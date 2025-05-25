package br.ifce.gestor_estoque.infra.security;

import br.ifce.gestor_estoque.domain.user.User;
import br.ifce.gestor_estoque.repositores.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List; // Import List

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    TokenService tokenService;
    @Autowired
    UserRepository userRepository;

    // Define public paths that should bypass token validation in this filter
    private static final List<String> PUBLIC_PATHS = List.of("/auth/login", "/auth/register");

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        // If the path is public, skip token validation and proceed with the filter chain
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        var token = this.recoverToken(request);
        if (token != null) {
            var login = tokenService.validateToken(token);
            if (login != null) {
                User user = userRepository.findByEmail(login).orElse(null); // Find user, return null if not found
                
                if (user != null) { // Only proceed if user is found
                    var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // Optionally, you could clear security context or log this scenario
                    // For now, if user not found for a supposedly valid token, we just don't set authentication
                    // This might happen if a token is valid but user was deleted, or in race conditions like registration
                     SecurityContextHolder.clearContext(); 
                }
            } else {
                 SecurityContextHolder.clearContext(); // Invalid token
            }
        } else {
             SecurityContextHolder.clearContext(); // No token
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private String recoverToken(@NonNull HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}