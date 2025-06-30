package br.ifce.gestor_estoque.listeners;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.events.EntradaProdutoCriadaEvent;
import br.ifce.gestor_estoque.events.EntradaProdutoExcluidaEvent;
import br.ifce.gestor_estoque.events.EntradaProdutoAtualizadaEvent;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class EntradaProdutoEventListener {

    @Autowired
    private ProdutoRepository produtoRepository;

    @EventListener
    @Transactional
    public void handleEntradaProdutoCriada(EntradaProdutoCriadaEvent event) {
        Produto produto = event.getEntradaProduto().getProduto();
        int quantidade = event.getEntradaProduto().getQuantidade();
        produto.entradaEstoque(quantidade);
        produtoRepository.save(produto);
    }

    @EventListener
    @Transactional
    public void handleEntradaProdutoAtualizada(EntradaProdutoAtualizadaEvent event) {
        Produto produtoNovo = event.getEntradaProduto().getProduto();
        int quantidadeNova = event.getEntradaProduto().getQuantidade();
        produtoNovo.entradaEstoque(quantidadeNova);
        produtoRepository.save(produtoNovo);
    }

    @EventListener
    @Transactional
    public void handleEntradaProdutoExcluida(EntradaProdutoExcluidaEvent event) {
        Produto produto = event.getEntradaProduto().getProduto();
        int quantidade = event.getEntradaProduto().getQuantidade();
        produto.saidaEstoque(quantidade);
        produtoRepository.save(produto);
    }
}
