package br.ifce.gestor_estoque.domain.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "O nome não pode estar em branco")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String name;

    @NotBlank(message = "O email não pode estar em branco")
    @Email(message = "Formato de email inválido")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "A senha não pode estar em branco")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String password;

    // Construtores
    public User() {
    }

    public User(String name, String email, String password) {
        this.setName(name);
        this.setEmail(email);
        this.setPassword(password); // A senha será 'hashed' no setter
    }


    // Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Setters com validação
    public void setId(String id) {
        // ID é gerado automaticamente, setter pode ser restrito ou removido se não houver uso externo.
        this.id = id;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome não pode ser nulo ou vazio.");
        }
        if (name.length() < 3 || name.length() > 100) {
            throw new IllegalArgumentException("O nome deve ter entre 3 e 100 caracteres.");
        }
        this.name = name;
    }

    public void setEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("O email não pode ser nulo ou vazio.");
        }
        // Regex para validação de email (pode ser mais robusto dependendo da necessidade)
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        if (!email.matches(emailRegex)) {
            throw new IllegalArgumentException("Formato de email inválido.");
        }
        this.email = email;
    }

    public void setPassword(String rawPassword) {
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("A senha não pode ser nula ou vazia.");
        }
        if (rawPassword.length() < 6) {
            throw new IllegalArgumentException("A senha deve ter no mínimo 6 caracteres.");
        }
        // Idealmente, o hashing da senha deve ocorrer no serviço ou em um manipulador de eventos de entidade.
        // No entanto, para adicionar comportamento à classe de domínio, podemos incluir aqui.
        // Considere mover para a camada de serviço se preferir manter a entidade POJO.
        this.password = hashPassword(rawPassword);
    }

    // Comportamentos
    /**
     * Verifica se a senha fornecida corresponde à senha armazenada (hashed).
     * @param rawPassword A senha em texto plano a ser verificada.
     * @return true se a senha corresponder, false caso contrário.
     */
    public boolean checkPassword(String rawPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.matches(rawPassword, this.password);
    }

    /**
     * Atualiza a senha do usuário. A nova senha será hashed.
     * @param newRawPassword A nova senha em texto plano.
     */
    public void updatePassword(String newRawPassword) {
        if (newRawPassword == null || newRawPassword.isEmpty()) {
            throw new IllegalArgumentException("A nova senha não pode ser nula ou vazia.");
        }
        if (newRawPassword.length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres.");
        }
        this.password = hashPassword(newRawPassword);
    }
    
    /**
     * Retorna as iniciais do nome do usuário.
     * Ex: "John Doe" retorna "JD". "John" retorna "J".
     * @return As iniciais do nome.
     */
    public String getInitials() {
        if (this.name == null || this.name.trim().isEmpty()) {
            return "";
        }
        String[] names = this.name.trim().split("\\s+");
        StringBuilder initials = new StringBuilder();
        if (names.length > 0) {
            initials.append(names[0].charAt(0));
            if (names.length > 1) {
                initials.append(names[names.length - 1].charAt(0));
            }
        }
        return initials.toString().toUpperCase();
    }

    // Método privado para hashing de senha
    private String hashPassword(String rawPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(rawPassword);
    }
}