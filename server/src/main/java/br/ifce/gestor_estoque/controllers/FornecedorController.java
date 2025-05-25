package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.dto.MessageDTO; // Import MessageDTO
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; // Import Optional

@RestController
@RequestMapping("/api/fornecedores")
public class FornecedorController {

    @Autowired
    FornecedorRepository fornecedorRepository;

    @GetMapping
    public ResponseEntity<List<Fornecedor>> listarTodos() {
        List<Fornecedor> fornecedores = fornecedorRepository.findAll();
        if (fornecedores.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no suppliers found
        }
        return ResponseEntity.ok(fornecedores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obterPorId(@PathVariable Long id) { // Return ResponseEntity<?> for mixed types
        Optional<Fornecedor> fornecedor = fornecedorRepository.findById(id);
        if (fornecedor.isPresent()) {
            return ResponseEntity.ok(fornecedor.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Fornecedor com ID " + id + " não encontrado."));
    }

    @PostMapping
    @Transactional // Added Transactional for create operations
    public ResponseEntity<Fornecedor> criar(@Valid @RequestBody Fornecedor fornecedor) {
        // Consider adding a check if a supplier with the same name/document already exists, if applicable
        Fornecedor novoFornecedor = fornecedorRepository.save(fornecedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoFornecedor);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody Fornecedor fornecedorAtualizado) { // Return ResponseEntity<?> for mixed types
        Optional<Fornecedor> fornecedorExistenteOptional = fornecedorRepository.findById(id);
        if (fornecedorExistenteOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Fornecedor com ID " + id + " não encontrado para atualização."));
        }
        
        Fornecedor fornecedorExistente = fornecedorExistenteOptional.get();
        fornecedorExistente.setNome(fornecedorAtualizado.getNome());
        fornecedorExistente.setContatoNome(fornecedorAtualizado.getContatoNome());
        fornecedorExistente.setContatoEmail(fornecedorAtualizado.getContatoEmail());
        fornecedorExistente.setContatoTelefone(fornecedorAtualizado.getContatoTelefone());
        // Ensure other fields are updated as necessary, e.g., CNPJ, address, etc.
        
        Fornecedor salvo = fornecedorRepository.save(fornecedorExistente);
        return ResponseEntity.ok(salvo);
    }

    @DeleteMapping("/{id}")
    @Transactional // Added Transactional for delete operations
    public ResponseEntity<?> deletar(@PathVariable Long id) { // Return ResponseEntity<?> for mixed types
        Optional<Fornecedor> fornecedor = fornecedorRepository.findById(id);
        if (fornecedor.isPresent()) {
            // Consider checking for related entities (e.g., products) before deleting
            // if there are constraints or specific business logic to handle.
            fornecedorRepository.delete(fornecedor.get());
            return ResponseEntity.noContent().build(); // Standard for successful DELETE with no content to return
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageDTO("Fornecedor com ID " + id + " não encontrado para exclusão."));
    }
}
