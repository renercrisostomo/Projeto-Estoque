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
    /**
     * Retorna o ID do produto.
     * @return o ID do produto.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID do produto.
     * Este método é geralmente usado pelo JPA e não deve ser chamado diretamente.
     * @param id o novo ID do produto.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Retorna o nome do produto.
     * @return o nome do produto.
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome do produto.
     * O nome não pode ser nulo ou vazio e deve ter no máximo 255 caracteres.
     * @param nome o novo nome do produto.
     * @throws IllegalArgumentException se o nome for nulo, vazio ou exceder 255 caracteres.
     */
    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do produto não pode ser nulo ou vazio.");
        }
        if (nome.length() > 255) {
            throw new IllegalArgumentException("O nome do produto deve ter no máximo 255 caracteres.");
        }
        this.nome = nome;
    }

    /**
     * Retorna a descrição do produto.
     * @return a descrição do produto.
     */
    public String getDescricao() {
        return descricao;
    }

    /**
     * Define a descrição do produto.
     * A descrição deve ter no máximo 500 caracteres.
     * @param descricao a nova descrição do produto.
     * @throws IllegalArgumentException se a descrição exceder 500 caracteres.
     */
    public void setDescricao(String descricao) {
        if (descricao != null && descricao.length() > 500) {
            throw new IllegalArgumentException("A descrição do produto deve ter no máximo 500 caracteres.");
        }
        this.descricao = descricao;
    }

    /**
     * Retorna o preço do produto.
     * @return o preço do produto.
     */
    public BigDecimal getPreco() {
        return preco;
    }

    /**
     * Define o preço do produto.
     * O preço não pode ser nulo e deve ser zero ou positivo.
     * @param preco o novo preço do produto.
     * @throws IllegalArgumentException se o preço for nulo ou negativo.
     */
    public void setPreco(BigDecimal preco) {
        if (preco == null) {
            throw new IllegalArgumentException("O preço não pode ser nulo.");
        }
        if (preco.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O preço deve ser zero ou positivo.");
        }
        this.preco = preco;
    }

    /**
     * Retorna a quantidade em estoque do produto.
     * @return a quantidade em estoque.
     */
    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    /**
     * Define a quantidade em estoque do produto.
     * A quantidade não pode ser nula e deve ser zero ou positiva.
     * @param quantidadeEstoque a nova quantidade em estoque.
     * @throws IllegalArgumentException se a quantidade for nula ou negativa.
     */
    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        if (quantidadeEstoque == null) {
            throw new IllegalArgumentException("A quantidade em estoque não pode ser nula.");
        }
        if (quantidadeEstoque < 0) {
            throw new IllegalArgumentException("A quantidade em estoque deve ser zero ou positiva.");
        }
        this.quantidadeEstoque = quantidadeEstoque;
    }

    /**
     * Retorna a unidade de medida do produto.
     * @return a unidade de medida.
     */
    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    /**
     * Define a unidade de medida do produto.
     * A unidade de medida não pode ser nula ou vazia e deve ter no máximo 50 caracteres.
     * @param unidadeMedida a nova unidade de medida.
     * @throws IllegalArgumentException se a unidade de medida for nula, vazia ou exceder 50 caracteres.
     */
    public void setUnidadeMedida(String unidadeMedida) {
        if (unidadeMedida == null || unidadeMedida.trim().isEmpty()) {
            throw new IllegalArgumentException("A unidade de medida não pode ser nula ou vazia.");
        }
        if (unidadeMedida.length() > 50) {
            throw new IllegalArgumentException("A unidade de medida deve ter no máximo 50 caracteres.");
        }
        this.unidadeMedida = unidadeMedida;
    }

    // Comportamentos de Domínio

    /**
     * Verifica se há estoque suficiente para uma determinada quantidade.
     * @param quantidadeDesejada A quantidade a ser verificada.
     * @return true se houver estoque suficiente, false caso contrário.
     */
    public boolean temEstoqueSuficiente(int quantidadeDesejada) {
        if (quantidadeDesejada <= 0) {
            throw new IllegalArgumentException("A quantidade desejada para verificação deve ser positiva.");
        }
        return this.quantidadeEstoque >= quantidadeDesejada;
    }

    /**
     * Adiciona uma quantidade ao estoque do produto.
     * @param quantidadeAdicionar A quantidade a ser adicionada.
     * @throws IllegalArgumentException se a quantidade a adicionar for menor ou igual a zero.
     */
    public void entradaEstoque(int quantidadeAdicionar) {
        if (quantidadeAdicionar <= 0) {
            throw new IllegalArgumentException("A quantidade a adicionar ao estoque deve ser positiva.");
        }
        this.setQuantidadeEstoque(this.quantidadeEstoque + quantidadeAdicionar);
    }

    /**
     * Remove uma quantidade do estoque do produto.
     * @param quantidadeRemover A quantidade a ser removida.
     * @throws IllegalArgumentException se a quantidade a remover for menor ou igual a zero,
     *                                ou se não houver estoque suficiente.
     */
    public void saidaEstoque(int quantidadeRemover) {
        if (quantidadeRemover <= 0) {
            throw new IllegalArgumentException("A quantidade a remover do estoque deve ser positiva.");
        }
        if (!temEstoqueSuficiente(quantidadeRemover)) {
            throw new IllegalArgumentException("Estoque insuficiente para remover a quantidade solicitada. Estoque atual: " + this.quantidadeEstoque + ", Solicitado: " + quantidadeRemover);
        }
        this.setQuantidadeEstoque(this.quantidadeEstoque - quantidadeRemover);
    }
}
