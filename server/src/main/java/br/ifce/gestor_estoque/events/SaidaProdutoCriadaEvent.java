package br.ifce.gestor_estoque.events;

import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;

public class SaidaProdutoCriadaEvent {
    private final SaidaProduto saidaProduto;

    public SaidaProdutoCriadaEvent(SaidaProduto saidaProduto) {
        this.saidaProduto = saidaProduto;
    }

    public SaidaProduto getSaidaProduto() {
        return saidaProduto;
    }
}
