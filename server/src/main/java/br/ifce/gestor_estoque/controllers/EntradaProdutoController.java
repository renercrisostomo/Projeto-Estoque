package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.domain.estoque.EntradaProduto;
import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.dto.MessageDTO;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.EntradaProdutoResponse;
import br.ifce.gestor_estoque.repositores.EntradaProdutoRepository;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
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
@RequestMapping("/api/entradas")
public class EntradaProdutoController {

    @Autowired
    private EntradaProdutoRepository entradaProdutoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @GetMapping
    public ResponseEntity<List<EntradaProdutoResponse>> listarTodas() {
        List<EntradaProdutoResponse> entradas = entradaProdutoRepository.findAll().stream()
                .map(EntradaProdutoResponse::new)
                .collect(Collectors.toList());
        if (entradas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(entradas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEntradaById(@PathVariable Long id) {
        Optional<EntradaProduto> entrada = entradaProdutoRepository.findById(id);
        if (entrada.isPresent()) {
            return ResponseEntity.ok(new EntradaProdutoResponse(entrada.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Entrada de produto com ID " + id + " não encontrada."));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createEntrada(@Valid @RequestBody EntradaProdutoRequest request) {
        Optional<Produto> produtoOptional = produtoRepository.findById(request.produtoId);
        if (produtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Produto com ID " + request.produtoId + " não encontrado."));
        }

        Optional<Fornecedor> fornecedorOptional = fornecedorRepository.findById(request.fornecedorId);
        if (fornecedorOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Fornecedor com ID " + request.fornecedorId + " não encontrado."));
        }

        EntradaProduto entradaProduto = new EntradaProduto();
        entradaProduto.setProduto(produtoOptional.get());
        entradaProduto.setFornecedor(fornecedorOptional.get());
        entradaProduto.setQuantidade(request.quantidade);
        entradaProduto.setDataEntrada(request.dataEntrada);
        entradaProduto.setPrecoCusto(request.precoCusto);
        entradaProduto.setObservacao(request.observacao);

        // Atualizar estoque do produto
        Produto produto = produtoOptional.get();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + request.quantidade);
        produtoRepository.save(produto);

        EntradaProduto novaEntrada = entradaProdutoRepository.save(entradaProduto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new EntradaProdutoResponse(novaEntrada));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateEntrada(@PathVariable Long id, @Valid @RequestBody EntradaProdutoRequest request) {
        Optional<EntradaProduto> entradaOptional = entradaProdutoRepository.findById(id);
        if (entradaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Entrada de produto com ID " + id + " não encontrada para atualização."));
        }

        Optional<Produto> produtoOptional = produtoRepository.findById(request.produtoId);
        if (produtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Produto com ID " + request.produtoId + " não encontrado."));
        }

        Optional<Fornecedor> fornecedorOptional = fornecedorRepository.findById(request.fornecedorId);
        if (fornecedorOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageDTO("Fornecedor com ID " + request.fornecedorId + " não encontrado."));
        }

        EntradaProduto entradaProduto = entradaOptional.get();

        // Reverter a quantidade antiga do estoque antes de atualizar
        Produto produtoAntigo = entradaProduto.getProduto();
        produtoAntigo.setQuantidadeEstoque(produtoAntigo.getQuantidadeEstoque() - entradaProduto.getQuantidade());
        produtoRepository.save(produtoAntigo);

        // Atualizar dados da entrada
        entradaProduto.setProduto(produtoOptional.get());
        entradaProduto.setFornecedor(fornecedorOptional.get());
        entradaProduto.setQuantidade(request.quantidade);
        entradaProduto.setDataEntrada(request.dataEntrada);
        entradaProduto.setPrecoCusto(request.precoCusto);
        entradaProduto.setObservacao(request.observacao);

        // Atualizar estoque do produto novo/atualizado
        Produto produtoNovo = produtoOptional.get();
        produtoNovo.setQuantidadeEstoque(produtoNovo.getQuantidadeEstoque() + request.quantidade);
        produtoRepository.save(produtoNovo);

        EntradaProduto entradaAtualizada = entradaProdutoRepository.save(entradaProduto);
        return ResponseEntity.ok(new EntradaProdutoResponse(entradaAtualizada));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteEntrada(@PathVariable Long id) {
        Optional<EntradaProduto> entradaOptional = entradaProdutoRepository.findById(id);
        if (entradaOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Entrada de produto com ID " + id + " não encontrada para exclusão."));
        }

        EntradaProduto entradaProduto = entradaOptional.get();

        // Reverter a quantidade do estoque ao excluir a entrada
        Produto produto = entradaProduto.getProduto();
        produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - entradaProduto.getQuantidade());
        produtoRepository.save(produto);

        entradaProdutoRepository.delete(entradaProduto);
        return ResponseEntity.noContent().build();
    }
}
