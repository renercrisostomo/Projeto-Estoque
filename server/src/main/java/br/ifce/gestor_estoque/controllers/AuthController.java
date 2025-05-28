package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.dto.LoginRequestDTO;
import br.ifce.gestor_estoque.dto.MessageDTO;
import br.ifce.gestor_estoque.dto.RegisterRequestDTO;
import br.ifce.gestor_estoque.dto.ResponseDTO;
import br.ifce.gestor_estoque.exceptions.CustomAuthenticationException;
import br.ifce.gestor_estoque.exceptions.UserAlreadyExistsException;
import br.ifce.gestor_estoque.services.AuthService; // Import AuthService
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService; // Inject AuthService

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body){
        try {
            ResponseDTO response = authService.login(body);
            return ResponseEntity.ok(response);
        } catch (CustomAuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDTO(e.getMessage()));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO body){
        try {
            ResponseDTO response = authService.register(body);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageDTO(e.getMessage()));
        }
    }
}