package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.user.User;
import br.ifce.gestor_estoque.dto.LoginRequestDTO;
import br.ifce.gestor_estoque.dto.RegisterRequestDTO;
import br.ifce.gestor_estoque.dto.ResponseDTO;
import br.ifce.gestor_estoque.exceptions.CustomAuthenticationException;
import br.ifce.gestor_estoque.exceptions.UserAlreadyExistsException;
import br.ifce.gestor_estoque.infra.security.TokenService;
import br.ifce.gestor_estoque.repositores.UserRepository;
import br.ifce.gestor_estoque.services.interfaces.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor // Lombok annotation for constructor injection
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final TokenService tokenService;

    @Override
    public ResponseDTO login(LoginRequestDTO body) {
        User user = userRepository.findByEmail(body.email())
                .orElseThrow(() -> new CustomAuthenticationException("Usuário e/ou senha inválidos."));

        if (!user.getPassword().equals(body.password())) {
            throw new CustomAuthenticationException("Usuário e/ou senha inválidos.");
        }

        String token = tokenService.generateToken(user);
        return new ResponseDTO(user.getName(), user.getEmail(), token);
    }

    @Override
    @Transactional
    public ResponseDTO register(RegisterRequestDTO body) {
        Optional<User> userOptional = userRepository.findByEmail(body.email());

        if (userOptional.isPresent()) {
            throw new UserAlreadyExistsException("E-mail já cadastrado.");
        }

        User newUser = new User();
        // A senha agora é hashed automaticamente pelo setter em User.java
        newUser.setPassword(body.password()); 
        newUser.setEmail(body.email());
        newUser.setName(body.name());
        userRepository.save(newUser);

        String token = tokenService.generateToken(newUser);
        return new ResponseDTO(newUser.getName(), newUser.getEmail(), token);
    }
}
