package br.ifce.gestor_estoque.domain.estoque;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
public class SaidaProduto {

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

    @NotNull(message = "A data de saída não pode ser nula")
    private LocalDate dataSaida;

    @Size(max = 255, message = "O motivo deve ter no máximo 255 caracteres")
    private String motivo; // Ex: Venda, Perda, Ajuste

    @Size(max = 255, message = "O cliente deve ter no máximo 255 caracteres")
    private String cliente; // Opcional, para quem foi a saída

    private String observacao;

    // Getters e Setters
    /**
     * Retorna o ID da saída do produto.
     * @return o ID da saída do produto.
     */
    public Long getId() {
        return id;
    }

    /**
     * Define o ID da saída do produto.
     * Este método é geralmente usado pelo JPA e não deve ser chamado diretamente.
     * @param id o novo ID da saída do produto.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Retorna o produto associado a esta saída.
     * @return o produto.
     */
    public Produto getProduto() {
        return produto;
    }

    /**
     * Define o produto associado a esta saída.
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
     * Retorna a quantidade de produtos na saída.
     * @return a quantidade.
     */
    public Integer getQuantidade() {
        return quantidade;
    }

    /**
     * Define a quantidade de produtos na saída.
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
     * Retorna a data de saída do produto.
     * @return a data de saída.
     */
    public LocalDate getDataSaida() {
        return dataSaida;
    }

    /**
     * Define a data de saída do produto.
     * A data de saída não pode ser nula.
     * @param dataSaida a data de saída.
     * @throws IllegalArgumentException se a data de saída for nula.
     */
    public void setDataSaida(LocalDate dataSaida) {
        if (dataSaida == null) {
            throw new IllegalArgumentException("A data de saída não pode ser nula.");
        }
        this.dataSaida = dataSaida;
    }

    /**
     * Retorna o motivo da saída.
     * @return o motivo da saída.
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Define o motivo da saída.
     * O motivo pode ser nulo ou vazio, mas se fornecido, deve ter no máximo 255 caracteres.
     * @param motivo o motivo da saída.
     * @throws IllegalArgumentException se o motivo exceder 255 caracteres.
     */
    public void setMotivo(String motivo) {
        if (motivo != null && motivo.length() > 255) {
            throw new IllegalArgumentException("O motivo deve ter no máximo 255 caracteres.");
        }
        this.motivo = motivo;
    }

    /**
     * Retorna o cliente associado à saída (opcional).
     * @return o cliente.
     */
    public String getCliente() {
        return cliente;
    }

    /**
     * Define o cliente associado à saída.
     * O cliente pode ser nulo ou vazio, mas se fornecido, deve ter no máximo 255 caracteres.
     * @param cliente o cliente associado à saída.
     * @throws IllegalArgumentException se o cliente exceder 255 caracteres.
     */
    public void setCliente(String cliente) {
        if (cliente != null && cliente.length() > 255) {
            throw new IllegalArgumentException("O cliente deve ter no máximo 255 caracteres.");
        }
        this.cliente = cliente;
    }

    /**
     * Retorna a observação sobre a saída.
     * @return a observação.
     */
    public String getObservacao() {
        return observacao;
    }

    /**
     * Define uma observação sobre a saída.
     * @param observacao a observação.
     */
    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    // Comportamentos

    /**
     * Verifica se a saída é para um cliente específico.
     * @param nomeCliente o nome do cliente a ser verificado.
     * @return true se a saída for para o cliente especificado, false caso contrário.
     */
    public boolean isSaidaParaCliente(String nomeCliente) {
        return this.cliente != null && this.cliente.equalsIgnoreCase(nomeCliente);
    }

    /**
     * Registra um motivo de ajuste para a saída.
     * Este método pode ser usado para padronizar motivos de ajuste de estoque.
     * @param motivoAjuste O motivo do ajuste.
     */
    public void registrarMotivoAjuste(String motivoAjuste) {
        if (motivoAjuste == null || motivoAjuste.trim().isEmpty()) {
            throw new IllegalArgumentException("O motivo de ajuste não pode ser nulo ou vazio.");
        }
        this.motivo = "Ajuste: " + motivoAjuste;
    }
}
