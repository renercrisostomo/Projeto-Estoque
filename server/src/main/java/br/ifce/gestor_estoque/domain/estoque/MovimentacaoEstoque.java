package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@MappedSuperclass
public abstract class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id")
    @NotNull(message = "O produto não pode ser nulo")
    private Produto produto;

    @NotNull(message = "A quantidade não pode ser nula")
    @Positive(message = "A quantidade deve ser positiva")
    private Integer quantidade;

    @NotNull(message = "A data de movimentação não pode ser nula")
    private LocalDate dataMovimentacao;

    private String observacao;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("O produto não pode ser nulo.");
        }
        this.produto = produto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        if (quantidade == null) {
            throw new IllegalArgumentException("A quantidade não pode ser nula.");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser positiva.");
        }
        this.quantidade = quantidade;
    }

    public LocalDate getDataMovimentacao() {
        return dataMovimentacao;
    }

    public void setDataMovimentacao(LocalDate dataMovimentacao) {
        if (dataMovimentacao == null) {
            throw new IllegalArgumentException("A data de movimentação não pode ser nula.");
        }
        this.dataMovimentacao = dataMovimentacao;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
