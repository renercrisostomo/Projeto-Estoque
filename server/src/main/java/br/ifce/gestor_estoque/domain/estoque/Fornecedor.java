package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do fornecedor não pode estar em branco")
    @Size(max = 255, message = "O nome do fornecedor deve ter no máximo 255 caracteres")
    private String nome;

    @Size(max = 255, message = "O nome do contato deve ter no máximo 255 caracteres")
    private String contatoNome;

    @Email(message = "Formato de email inválido para o contato")
    @Size(max = 255, message = "O email do contato deve ter no máximo 255 caracteres")
    private String contatoEmail;

    @Size(max = 50, message = "O telefone do contato deve ter no máximo 50 caracteres")
    private String contatoTelefone;

    // Getters e Setters
    /**
     * Retorna o ID do fornecedor.
     * @return o ID do fornecedor.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID do fornecedor.
     * Este método é geralmente usado pelo JPA e não deve ser chamado diretamente.
     * @param id o novo ID do fornecedor.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Retorna o nome do fornecedor.
     * @return o nome do fornecedor.
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome do fornecedor.
     * O nome não pode ser nulo ou vazio e deve ter no máximo 255 caracteres.
     * @param nome o novo nome do fornecedor.
     * @throws IllegalArgumentException se o nome for nulo, vazio ou exceder 255 caracteres.
     */
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do fornecedor não pode ser nulo ou vazio.");
        }
        if (nome.length() > 255) {
            throw new IllegalArgumentException("O nome do fornecedor deve ter no máximo 255 caracteres.");
        }
        this.nome = nome;
    }

    /**
     * Retorna o nome do contato do fornecedor.
     * @return o nome do contato.
     */
    public String getContatoNome() {
        return contatoNome;
    }

    /**
     * Define o nome do contato do fornecedor.
     * O nome do contato deve ter no máximo 255 caracteres.
     * @param contatoNome o novo nome do contato.
     * @throws IllegalArgumentException se o nome do contato exceder 255 caracteres.
     */
    public void setContatoNome(String contatoNome) {
        if (contatoNome != null && contatoNome.length() > 255) {
            throw new IllegalArgumentException("O nome do contato deve ter no máximo 255 caracteres.");
        }
        this.contatoNome = contatoNome;
    }

    /**
     * Retorna o email de contato do fornecedor.
     * @return o email de contato.
     */
    public String getContatoEmail() {
        return contatoEmail;
    }

    /**
     * Define o email de contato do fornecedor.
     * O email deve ser válido e ter no máximo 255 caracteres.
     * @param contatoEmail o novo email de contato.
     * @throws IllegalArgumentException se o email for inválido ou exceder 255 caracteres.
     */
    public void setContatoEmail(String contatoEmail) {
        if (contatoEmail == null || contatoEmail.trim().isEmpty()) { // Check for null or empty string
            throw new IllegalArgumentException("O email do contato não pode ser nulo ou vazio.");
        }
        if (contatoEmail.length() > 255) {
            throw new IllegalArgumentException("O email do contato deve ter no máximo 255 caracteres.");
        }
        // Regex for basic email validation
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\\\.)+[a-zA-Z]{2,7}$";
        if (!contatoEmail.matches(emailRegex)) {
            throw new IllegalArgumentException("Formato de email inválido para o contato.");
        }
        this.contatoEmail = contatoEmail;
    }

    /**
     * Retorna o telefone de contato do fornecedor.
     * @return o telefone de contato.
     */
    public String getContatoTelefone() {
        return contatoTelefone;
    }

    /**
     * Define o telefone de contato do fornecedor.
     * O telefone deve ter no máximo 50 caracteres.
     * @param contatoTelefone o novo telefone de contato.
     * @throws IllegalArgumentException se o telefone exceder 50 caracteres.
     */
    public void setContatoTelefone(String contatoTelefone) {
        if (contatoTelefone != null && contatoTelefone.length() > 50) {
            throw new IllegalArgumentException("O telefone do contato deve ter no máximo 50 caracteres.");
        }
        // Adiciona validação para garantir que o telefone contém apenas números e caracteres válidos (ex: +, -, (, ))
        if (contatoTelefone != null && !contatoTelefone.matches("^[0-9()\\s+-]*$")) {
            throw new IllegalArgumentException("O telefone do contato contém caracteres inválidos.");
        }
        this.contatoTelefone = contatoTelefone;
    }

    // Comportamentos

    /**
     * Verifica se o fornecedor possui informações de contato completas (nome, email e telefone).
     * @return true se todas as informações de contato estiverem presentes, false caso contrário.
     */
    public boolean hasInformacoesContatoCompletas() {
        return this.contatoNome != null && !this.contatoNome.trim().isEmpty() &&
               this.contatoEmail != null && !this.contatoEmail.trim().isEmpty() &&
               this.contatoTelefone != null && !this.contatoTelefone.trim().isEmpty();
    }

    /**
     * Formata o nome do contato para exibição (Ex: "Nome Sobrenome" -> "Nome S.").
     * Retorna o nome original se não houver sobrenome.
     * @return O nome do contato formatado ou o nome original.
     */
    public String getNomeContatoFormatado() {
        if (this.contatoNome == null || this.contatoNome.trim().isEmpty()) {
            return "";
        }
        String[] partesNome = this.contatoNome.trim().split("\\s+");
        if (partesNome.length > 1) {
            return partesNome[0] + " " + partesNome[partesNome.length - 1].charAt(0) + ".";
        }
        return this.contatoNome;
    }
}
