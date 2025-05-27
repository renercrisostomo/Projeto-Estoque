package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto não pode estar em branco")
    @Size(max = 255, message = "O nome do produto deve ter no máximo 255 caracteres")
    private String nome;

    @Size(max = 500, message = "A descrição do produto deve ter no máximo 500 caracteres")
    private String descricao;

    @NotNull(message = "O preço não pode ser nulo")
    @PositiveOrZero(message = "O preço deve ser zero ou positivo")
    private BigDecimal preco;

    @NotNull(message = "A quantidade em estoque não pode ser nula")
    @PositiveOrZero(message = "A quantidade em estoque deve ser zero ou positiva")
    private Integer quantidadeEstoque;

    @NotBlank(message = "A unidade de medida não pode estar em branco")
    @Size(max = 50, message = "A unidade de medida deve ter no máximo 50 caracteres")
    private String unidadeMedida;

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }
}
