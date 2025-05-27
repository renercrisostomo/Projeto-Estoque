package br.ifce.gestor_estoque.config;

import br.ifce.gestor_estoque.domain.user.User;
import br.ifce.gestor_estoque.repositores.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin").isEmpty()) {
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@admin.com");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            // Você pode adicionar roles ou outras propriedades aqui se necessário
            userRepository.save(adminUser);
            System.out.println("Created admin user with email: admin@admin.com and password: admin");
        }
    }
}
