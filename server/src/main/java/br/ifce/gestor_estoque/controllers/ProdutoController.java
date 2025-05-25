package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.domain.estoque.Produto;
import br.ifce.gestor_estoque.dto.MessageDTO; // Import MessageDTO
import br.ifce.gestor_estoque.dto.estoque.ProdutoRequest;
import br.ifce.gestor_estoque.dto.estoque.ProdutoResponse;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // Import Transactional
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // Import Optional
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    ProdutoRepository produtoRepository;

    @Autowired
    FornecedorRepository fornecedorRepository;

    @GetMapping
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        List<ProdutoResponse> produtos = produtoRepository.findAll().stream()
                .map(ProdutoResponse::new)
                .collect(Collectors.toList());
        if (produtos.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no products found
        }
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProdutoById(@PathVariable Long id) { // Return ResponseEntity<?> for mixed types
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            return ResponseEntity.ok(new ProdutoResponse(produto.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Produto com ID " + id + " não encontrado."));
    }

    @PostMapping
    @Transactional // Add Transactional for operations involving multiple repository calls
    public ResponseEntity<?> createProduto(@Valid @RequestBody ProdutoRequest produtoRequest) {
        Fornecedor fornecedor = null;
        if (produtoRequest.fornecedorId != null) { // Direct access
            Optional<Fornecedor> fornecedorOptional = fornecedorRepository.findById(produtoRequest.fornecedorId); // Direct access
            if (fornecedorOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageDTO("Fornecedor com ID " + produtoRequest.fornecedorId + " não encontrado.")); // Direct access
            }
            fornecedor = fornecedorOptional.get();
        }

        Produto produto = new Produto();
        produto.setNome(produtoRequest.nome); // Direct access
        produto.setDescricao(produtoRequest.descricao); // Direct access
        produto.setPreco(produtoRequest.preco); // Direct access
        produto.setQuantidadeEstoque(produtoRequest.quantidadeEstoque); // Direct access
        produto.setUnidadeMedida(produtoRequest.unidadeMedida); // Direct access
        produto.setFornecedor(fornecedor); // Set Fornecedor (can be null if fornecedorId was null)

        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ProdutoResponse(novoProduto));
    }

    @PutMapping("/{id}")
    @Transactional // Add Transactional for operations involving multiple repository calls
    public ResponseEntity<?> updateProduto(@PathVariable Long id, @Valid @RequestBody ProdutoRequest produtoRequest) {
        Optional<Produto> produtoOptional = produtoRepository.findById(id);
        if (produtoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Produto com ID " + id + " não encontrado para atualização."));
        }

        Produto produto = produtoOptional.get();
        Fornecedor fornecedor = null;
        if (produtoRequest.fornecedorId != null) { // Direct access
            Optional<Fornecedor> fornecedorOptional = fornecedorRepository.findById(produtoRequest.fornecedorId); // Direct access
            if (fornecedorOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new MessageDTO("Fornecedor com ID " + produtoRequest.fornecedorId + " não encontrado para atualização do produto.")); // Direct access
            }
            fornecedor = fornecedorOptional.get();
        }

        produto.setNome(produtoRequest.nome); // Direct access
        produto.setDescricao(produtoRequest.descricao); // Direct access
        produto.setPreco(produtoRequest.preco); // Direct access
        produto.setQuantidadeEstoque(produtoRequest.quantidadeEstoque); // Direct access
        produto.setUnidadeMedida(produtoRequest.unidadeMedida); // Direct access
        produto.setFornecedor(fornecedor);

        Produto produtoAtualizado = produtoRepository.save(produto);
        return ResponseEntity.ok(new ProdutoResponse(produtoAtualizado));
    }

    @DeleteMapping("/{id}")
    @Transactional // Add Transactional for delete operations
    public ResponseEntity<?> deleteProduto(@PathVariable Long id) { // Return ResponseEntity<?> for mixed types
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            produtoRepository.delete(produto.get());
            return ResponseEntity.noContent().build(); // Standard for successful DELETE with no content to return
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Produto com ID " + id + " não encontrado para exclusão."));
    }
}
