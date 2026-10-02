package com.triple8.ashliee.config;

import com.triple8.ashliee.domain.AdminUser;
import com.triple8.ashliee.repo.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminSeed {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner seedAdmin(AdminUserRepository users, PasswordEncoder encoder,
                                @Value("${ashliee.admin-username}") String username,
                                @Value("${ashliee.admin-password}") String password) {
        return args -> {
            if (users.findByUsername(username).isEmpty()) {
                AdminUser user = new AdminUser();
                user.setUsername(username);
                user.setPasswordHash(encoder.encode(password));
                users.save(user);
            }
        };
    }
}
