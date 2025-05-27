package br.ifce.gestor_estoque.dto.estoque;

import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import java.time.LocalDate;

public class SaidaProdutoResponse {
    public Long id;
    public Long produtoId;
    public String produtoNome;
    public Integer quantidade;
    public LocalDate dataSaida;
    public String motivo;
    public String cliente;
    public String observacao;

    public SaidaProdutoResponse(SaidaProduto saidaProduto) {
        this.id = saidaProduto.getId();
        this.produtoId = saidaProduto.getProduto().getId();
        this.produtoNome = saidaProduto.getProduto().getNome();
        this.quantidade = saidaProduto.getQuantidade();
        this.dataSaida = saidaProduto.getDataSaida();
        this.motivo = saidaProduto.getMotivo();
        this.cliente = saidaProduto.getCliente();
        this.observacao = saidaProduto.getObservacao();
    }
}
