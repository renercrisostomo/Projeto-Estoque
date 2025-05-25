package br.ifce.gestor_estoque.infra.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull; // Added for @NonNull annotation

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000") // Changed from 4200 to 3000
                .allowedMethods("GET", "POST", "DELETE", "PUT", "OPTIONS") // Added OPTIONS
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials
    }
}