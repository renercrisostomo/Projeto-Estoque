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
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getContatoNome() {
        return contatoNome;
    }

    public void setContatoNome(String contatoNome) {
        this.contatoNome = contatoNome;
    }

    public String getContatoEmail() {
        return contatoEmail;
    }

    public void setContatoEmail(String contatoEmail) {
        this.contatoEmail = contatoEmail;
    }

    public String getContatoTelefone() {
        return contatoTelefone;
    }

    public void setContatoTelefone(String contatoTelefone) {
        this.contatoTelefone = contatoTelefone;
    }
}
