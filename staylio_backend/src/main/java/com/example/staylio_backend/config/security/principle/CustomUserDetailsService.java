package com.example.staylio_backend.config.security.principle;

import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.repository.AccountRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AccountRepo accountRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User account = accountRepo.findByEmailWithRoles(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account is not existing: " + email));
        return new UserPrincipal(account);
    }
}
