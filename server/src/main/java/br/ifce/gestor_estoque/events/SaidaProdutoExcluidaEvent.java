package br.ifce.gestor_estoque.events;

import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;

public class SaidaProdutoExcluidaEvent {
    private final SaidaProduto saidaProduto; // The state BEFORE deletion

    public SaidaProdutoExcluidaEvent(SaidaProduto saidaProduto) {
        this.saidaProduto = saidaProduto;
    }

    public SaidaProduto getSaidaProduto() {
        return saidaProduto;
    }
}
