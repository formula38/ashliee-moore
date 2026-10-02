package com.triple8.ashliee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class AshlieeApplication {
    public static void main(String[] args) {
        SpringApplication.run(AshlieeApplication.class, args);
    }
}
