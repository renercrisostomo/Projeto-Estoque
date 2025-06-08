package br.ifce.gestor_estoque.events;

import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;

public class SaidaProdutoAtualizadaEvent {
    private final SaidaProduto saidaProduto; // The state AFTER update

    public SaidaProdutoAtualizadaEvent(SaidaProduto saidaProduto) {
        this.saidaProduto = saidaProduto;
    }

    public SaidaProduto getSaidaProduto() {
        return saidaProduto;
    }
}
