package br.ifce.gestor_estoque.events;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;

public class EntradaProdutoAtualizadaEvent {
    private final EntradaProduto entradaProduto; // The state AFTER update

    public EntradaProdutoAtualizadaEvent(EntradaProduto entradaProduto) {
        this.entradaProduto = entradaProduto;
    }

    public EntradaProduto getEntradaProduto() {
        return entradaProduto;
    }
}
