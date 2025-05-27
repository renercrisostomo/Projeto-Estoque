package br.ifce.gestor_estoque.dto.estoque;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import java.math.BigDecimal;

// DTO para respostas de Produto, incluindo nome do fornecedor
public class ProdutoResponse {
    public Long id;
    public String nome;
    public String descricao;
    public BigDecimal preco;
    public Integer quantidadeEstoque;
    public String unidadeMedida;

    public ProdutoResponse(Produto produto) {
        this.id = produto.getId();
        this.nome = produto.getNome();
        this.descricao = produto.getDescricao();
        this.preco = produto.getPreco();
        this.quantidadeEstoque = produto.getQuantidadeEstoque();
        this.unidadeMedida = produto.getUnidadeMedida();
    }
}
