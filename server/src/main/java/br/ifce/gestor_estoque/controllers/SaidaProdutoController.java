package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.domain.estoque.SaidaProduto;
import br.ifce.gestor_estoque.dto.MessageDTO;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.SaidaProdutoResponse;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import br.ifce.gestor_estoque.repositores.SaidaProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saidas")
public class SaidaProdutoController {

    @Autowired
    private SaidaProdutoRepository saidaProdutoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @GetMapping
    public ResponseEntity<List<SaidaProdutoResponse>> listarTodas() {
        List<SaidaProdutoResponse> saidas = saidaProdutoRepository.findAll().stream()
                .map(SaidaProdutoResponse::new)
                .collect(Collectors.toList());
        if (saidas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(saidas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSaidaById(@PathVariable Long id) {
        Optional<SaidaProduto> saida = saidaProdutoRepository.findById(id);
        if (saida.isPresent()) {
            return ResponseEntity.ok(new SaidaProdutoResponse(saida.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Saída de produto com ID " + id + " não encontrada."));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createSaida(@Valid @RequestBody SaidaProdutoRequest request) {
        Optional<Produto> produtoOptional = produtoRepository.findById(request.produtoId);
        if (produtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Produto com ID " + request.produtoId + " não encontrado."));
        }

        Produto produto = produtoOptional.get();
        if (produto.getQuantidadeEstoque() < request.quantidade) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque atual: " + produto.getQuantidadeEstoque()));
        }

        SaidaProduto saidaProduto = new SaidaProduto();
        saidaProduto.setProduto(produto);
        saidaProduto.setQuantidade(request.quantidade);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        // Atualizar estoque do produto
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - request.quantidade);
        produtoRepository.save(produto);

        SaidaProduto novaSaida = saidaProdutoRepository.save(saidaProduto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new SaidaProdutoResponse(novaSaida));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateSaida(@PathVariable Long id, @Valid @RequestBody SaidaProdutoRequest request) {
        Optional<SaidaProduto> saidaOptional = saidaProdutoRepository.findById(id);
        if (saidaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Saída de produto com ID " + id + " não encontrada para atualização."));
        }

        Optional<Produto> produtoOptional = produtoRepository.findById(request.produtoId);
        if (produtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Produto com ID " + request.produtoId + " não encontrado."));
        }

        SaidaProduto saidaProduto = saidaOptional.get();
        Produto produtoNovo = produtoOptional.get();
        Produto produtoAntigo = saidaProduto.getProduto();

        // Calcular a diferença de quantidade para ajustar o estoque
        int quantidadeAntigaNaSaida = saidaProduto.getQuantidade();
        int quantidadeNovaNaSaida = request.quantidade;

        // Reverter a quantidade antiga da saída do estoque do produto antigo
        produtoAntigo.setQuantidadeEstoque(produtoAntigo.getQuantidadeEstoque() + quantidadeAntigaNaSaida);
        // Se o produto foi alterado na edição da saída, precisamos salvar o produto antigo.
        // Se for o mesmo produto, o save abaixo (produtoNovo) já cobre.
        if (!produtoAntigo.getId().equals(produtoNovo.getId())) {
            produtoRepository.save(produtoAntigo);
        }
        
        // Verificar estoque do produto novo (ou o mesmo produto atualizado)
        // Se for um produto diferente, verificar o estoque total dele.
        // Se for o mesmo produto, o estoque já foi ajustado (incrementado), então verificamos contra a nova quantidade da saída.
        int estoqueDisponivelParaNovaSaida = produtoNovo.getId().equals(produtoAntigo.getId()) ? produtoAntigo.getQuantidadeEstoque() : produtoNovo.getQuantidadeEstoque();
        if (estoqueDisponivelParaNovaSaida < quantidadeNovaNaSaida) {
             // Precisamos reverter a alteração no produtoAntigo se o save não ocorreu ou se é o mesmo produto
            if (produtoAntigo.getId().equals(produtoNovo.getId())) {
                 produtoAntigo.setQuantidadeEstoque(produtoAntigo.getQuantidadeEstoque() - quantidadeAntigaNaSaida); // Desfaz o incremento
                 // Não precisa salvar aqui, pois a transação será rollback ou não haverá mudança
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Quantidade em estoque insuficiente para o produto ID " + request.produtoId + ". Estoque disponível: " + estoqueDisponivelParaNovaSaida));
        }

        // Atualizar dados da saida
        saidaProduto.setProduto(produtoNovo);
        saidaProduto.setQuantidade(quantidadeNovaNaSaida);
        saidaProduto.setDataSaida(request.dataSaida);
        saidaProduto.setMotivo(request.motivo);
        saidaProduto.setCliente(request.cliente);
        saidaProduto.setObservacao(request.observacao);

        // Deduzir a nova quantidade da saída do estoque do produto novo (ou o mesmo produto)
        produtoNovo.setQuantidadeEstoque(estoqueDisponivelParaNovaSaida - quantidadeNovaNaSaida);
        produtoRepository.save(produtoNovo);

        SaidaProduto saidaAtualizada = saidaProdutoRepository.save(saidaProduto);
        return ResponseEntity.ok(new SaidaProdutoResponse(saidaAtualizada));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteSaida(@PathVariable Long id) {
        Optional<SaidaProduto> saidaOptional = saidaProdutoRepository.findById(id);
        if (saidaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Saída de produto com ID " + id + " não encontrada para exclusão."));
        }

        SaidaProduto saidaProduto = saidaOptional.get();

        // Adicionar a quantidade de volta ao estoque ao excluir a saida
        Produto produto = saidaProduto.getProduto();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + saidaProduto.getQuantidade());
        produtoRepository.save(produto);

        saidaProdutoRepository.delete(saidaProduto);
        return ResponseEntity.noContent().build();
    }
}
