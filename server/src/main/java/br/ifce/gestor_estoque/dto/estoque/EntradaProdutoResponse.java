package br.ifce.gestor_estoque.dto.estoque;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EntradaProdutoResponse {
    public Long id;
    public Long produtoId;
    public String produtoNome;
    public Long fornecedorId;
    public String fornecedorNome;
    public Integer quantidade;
    public LocalDate dataEntrada;
    public BigDecimal precoCusto;
    public String observacao;
    public BigDecimal valorTotalEntrada; // Novo campo

    public EntradaProdutoResponse(EntradaProduto entradaProduto) {
        this.id = entradaProduto.getId();
        this.produtoId = entradaProduto.getProduto().getId();
        this.produtoNome = entradaProduto.getProduto().getNome();
        this.fornecedorId = entradaProduto.getFornecedor().getId();
        this.fornecedorNome = entradaProduto.getFornecedor().getNome();
        this.quantidade = entradaProduto.getQuantidade();
        this.dataEntrada = entradaProduto.getDataEntrada();
        this.precoCusto = entradaProduto.getPrecoCusto();
        this.observacao = entradaProduto.getObservacao();
        this.valorTotalEntrada = entradaProduto.calcularValorTotalEntrada(); // Usando o método de domínio
    }
}
