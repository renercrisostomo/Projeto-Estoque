package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.domain.user.User;
import br.ifce.gestor_estoque.dto.LoginRequestDTO;
import br.ifce.gestor_estoque.dto.MessageDTO; // Import MessageDTO
import br.ifce.gestor_estoque.dto.RegisterRequestDTO;
import br.ifce.gestor_estoque.dto.ResponseDTO;
import br.ifce.gestor_estoque.infra.security.TokenService;
import br.ifce.gestor_estoque.repositores.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // Import HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body){
        Optional<User> userOptional = this.userRepository.findByEmail(body.email());

        if(userOptional.isPresent()){
            User user = userOptional.get();
            if(passwordEncoder.matches(body.password(), user.getPassword())) {
                String token = this.tokenService.generateToken(user);
                return ResponseEntity.ok(new ResponseDTO(user.getName(), user.getEmail(), token));
            }
        }
        // Retorna uma mensagem genérica para usuário não encontrado ou senha inválida
        // e o status HTTP 401 Unauthorized em ambos os casos.
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageDTO("Usuário e/ou senha inválidos."));
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO body){ // Changed ResponseEntity<ResponseDTO> to ResponseEntity<?>
        Optional<User> userOptional = this.userRepository.findByEmail(body.email());

        if(userOptional.isEmpty()) {
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());
            this.userRepository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            // It's common to return the created user's info (or just a success message) upon registration
            return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseDTO(newUser.getName(), newUser.getEmail(), token)); // Added email to ResponseDTO
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageDTO("E-mail já cadastrado."));
    }
}