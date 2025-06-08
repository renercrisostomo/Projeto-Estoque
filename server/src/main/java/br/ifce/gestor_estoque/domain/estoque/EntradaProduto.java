package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class EntradaProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id")
    @NotNull(message = "O produto não pode ser nulo")
    private Produto produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id")
    @NotNull(message = "O fornecedor não pode ser nulo")
    private Fornecedor fornecedor;

    @NotNull(message = "A quantidade não pode ser nula")
    @Positive(message = "A quantidade deve ser positiva")
    private Integer quantidade;

    @NotNull(message = "A data de entrada não pode ser nula")
    private LocalDate dataEntrada;

    @Column(precision = 10, scale = 2)
    private BigDecimal precoCusto; // Preço de custo unitário no momento da entrada

    private String observacao;

    // Getters e Setters
    /**
     * Retorna o ID da entrada do produto.
     * @return o ID da entrada do produto.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID da entrada do produto.
     * Este método é geralmente usado pelo JPA e não deve ser chamado diretamente.
     * @param id o novo ID da entrada do produto.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Retorna o produto associado a esta entrada.
     * @return o produto.
     */
    public Produto getProduto() {
        return produto;
    }

    /**
     * Define o produto associado a esta entrada.
     * O produto não pode ser nulo.
     * @param produto o produto a ser associado.
     * @throws IllegalArgumentException se o produto for nulo.
     */
    public void setProduto(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("O produto não pode ser nulo.");
        }
        this.produto = produto;
    }

    /**
     * Retorna o fornecedor associado a esta entrada.
     * @return o fornecedor.
     */
    public Fornecedor getFornecedor() {
        return fornecedor;
    }

    /**
     * Define o fornecedor associado a esta entrada.
     * O fornecedor não pode ser nulo.
     * @param fornecedor o fornecedor a ser associado.
     * @throws IllegalArgumentException se o fornecedor for nulo.
     */
    public void setFornecedor(Fornecedor fornecedor) {
        if (fornecedor == null) {
            throw new IllegalArgumentException("O fornecedor não pode ser nulo.");
        }
        this.fornecedor = fornecedor;
    }

    /**
     * Retorna a quantidade de produtos na entrada.
     * @return a quantidade.
     */
    public Integer getQuantidade() {
        return quantidade;
    }

    /**
     * Define a quantidade de produtos na entrada.
     * A quantidade não pode ser nula e deve ser positiva.
     * @param quantidade a quantidade de produtos.
     * @throws IllegalArgumentException se a quantidade for nula ou não positiva.
     */
    public void setQuantidade(Integer quantidade) {
        if (quantidade == null) {
            throw new IllegalArgumentException("A quantidade não pode ser nula.");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser positiva.");
        }
        this.quantidade = quantidade;
    }

    /**
     * Retorna a data de entrada do produto.
     * @return a data de entrada.
     */
    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    /**
     * Define a data de entrada do produto.
     * A data de entrada não pode ser nula.
     * @param dataEntrada a data de entrada.
     * @throws IllegalArgumentException se a data de entrada for nula.
     */
    public void setDataEntrada(LocalDate dataEntrada) {
        if (dataEntrada == null) {
            throw new IllegalArgumentException("A data de entrada não pode ser nula.");
        }
        this.dataEntrada = dataEntrada;
    }

    /**
     * Retorna o preço de custo unitário do produto no momento da entrada.
     * @return o preço de custo.
     */
    public BigDecimal getPrecoCusto() {
        return precoCusto;
    }

    /**
     * Define o preço de custo unitário do produto no momento da entrada.
     * O preço de custo pode ser nulo (se não aplicável), mas se fornecido, não deve ser negativo.
     * @param precoCusto o preço de custo.
     * @throws IllegalArgumentException se o preço de custo for negativo.
     */
    public void setPrecoCusto(BigDecimal precoCusto) {
        if (precoCusto != null && precoCusto.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("O preço de custo não pode ser negativo.");
        }
        this.precoCusto = precoCusto;
    }

    /**
     * Retorna a observação associada a esta entrada.
     * @return a observação.
     */
    public String getObservacao() {
        return observacao;
    }

    /**
     * Define a observação associada a esta entrada.
     * Não há restrições de validação para a observação neste momento.
     * @param observacao a observação.
     */
    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
