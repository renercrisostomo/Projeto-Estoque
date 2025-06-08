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
        // Usando o método de domínio para entrada de estoque
        produto.entradaEstoque(quantidade);
        produtoRepository.save(produto);
    }

    @EventListener
    @Transactional
    public void handleEntradaProdutoAtualizada(EntradaProdutoAtualizadaEvent event) {
        // O EntradaProdutoService já reverteu o estoque do produto antigo.
        // Este listener aplica a entrada ao novo produto (ou ao mesmo produto, se não mudou).
        Produto produtoNovo = event.getEntradaProduto().getProduto();
        int quantidadeNova = event.getEntradaProduto().getQuantidade();
        // Usando o método de domínio para entrada de estoque
        produtoNovo.entradaEstoque(quantidadeNova);
        produtoRepository.save(produtoNovo);
    }

    @EventListener
    @Transactional
    public void handleEntradaProdutoExcluida(EntradaProdutoExcluidaEvent event) {
        Produto produto = event.getEntradaProduto().getProduto();
        int quantidade = event.getEntradaProduto().getQuantidade();
        // Usando o método de domínio para saída de estoque (reversão da entrada)
        produto.saidaEstoque(quantidade);
        produtoRepository.save(produto);
    }
}
