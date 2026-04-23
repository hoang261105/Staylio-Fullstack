package com.example.staylio_backend.config.security.principle;

import com.example.staylio_backend.model.entity.Account;
import com.example.staylio_backend.repository.AccountRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomAccountDetailsService implements UserDetailsService {

    private final AccountRepo accountRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = accountRepo.findByEmailWithRoles(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account is not existing: " + email));
        return new AccountPrincipal(account);
    }
}
