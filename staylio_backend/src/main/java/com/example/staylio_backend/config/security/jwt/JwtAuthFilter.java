package com.example.staylio_backend.config.security.jwt;

import com.example.staylio_backend.common.exception.TokenRevokedException;
import com.example.staylio_backend.config.security.principle.CustomUserDetailsService;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.repository.BlacklistTokenRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final BlacklistTokenRepo blacklistTokenRepo;
    private final ObjectMapper mapper;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            String token = resolveToken(request);

            log.info("JWT Token: {}", token);

            if (StringUtils.hasText(token)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                if (blacklistTokenRepo.existsByToken(token)) {
                    throw new TokenRevokedException("Token has been revoked");
                }

                boolean valid = jwtTokenProvider.validateToken(token);

                log.info("JWT Valid: {}", valid);

                if (valid) {

                    String email = jwtTokenProvider.getEmailFromToken(token);

                    UserDetails userDetails =
                            userDetailsService.loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    log.info("Authenticated user: {}", email);
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {

            log.error("JWT expired: {}", ex.getMessage());

            unauthorizedResponse(
                    response,
                    request,
                    "Token has expired"
            );

        } catch (TokenRevokedException ex) {

            log.error("JWT revoked: {}", ex.getMessage());

            unauthorizedResponse(
                    response,
                    request,
                    ex.getMessage()
            );

        } catch (JwtException | IllegalArgumentException ex) {

            log.error("JWT invalid: {}", ex.getMessage());

            unauthorizedResponse(
                    response,
                    request,
                    "Invalid token"
            );

        } catch (Exception ex) {

            log.error("Authentication error", ex);

            unauthorizedResponse(
                    response,
                    request,
                    "Authentication failed"
            );
        }
    }

    private String resolveToken(HttpServletRequest request) {

        // PRIORITY 1: Authorization Header
        String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(bearerToken)
                && bearerToken.startsWith("Bearer ")) {

            return bearerToken.substring(7);
        }

        // PRIORITY 2: Cookie
        if (request.getCookies() != null) {

            for (Cookie cookie : request.getCookies()) {

                if ("accessToken".equals(cookie.getName())
                        && StringUtils.hasText(cookie.getValue())) {

                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    private void unauthorizedResponse(
            HttpServletResponse response,
            HttpServletRequest request,
            String message
    ) throws IOException {

        SecurityContextHolder.clearContext();

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ApiResponse<Object> body = new ApiResponse<>();

        body.setSuccess(false);
        body.setMessage("Unauthorized");
        body.setData(null);
        body.setErrors(List.of(
                Map.of(
                        "path", request.getRequestURI(),
                        "message", message
                )
        ));
        body.setTimestamp(LocalDateTime.now());

        mapper.writeValue(response.getWriter(), body);
    }
}