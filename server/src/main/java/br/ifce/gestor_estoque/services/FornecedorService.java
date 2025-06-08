package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.domain.estoque.Fornecedor;
import br.ifce.gestor_estoque.exceptions.NotFoundException;
import br.ifce.gestor_estoque.repositores.FornecedorRepository;
import br.ifce.gestor_estoque.services.interfaces.IFornecedorService; // Import the interface
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FornecedorService implements IFornecedorService { // Implement the interface

    @Autowired
    private FornecedorRepository fornecedorRepository;

    @Override // Add Override annotation
    public List<Fornecedor> listarTodos() {
        return fornecedorRepository.findAll();
    }

    @Override // Add Override annotation
    public Optional<Fornecedor> obterPorId(Long id) {
        return fornecedorRepository.findById(id);
    }

    @Override // Add Override annotation
    @Transactional
    public Fornecedor criar(Fornecedor fornecedor) {
        // Aqui podem ser adicionadas validações de negócio, se necessário
        // Ex: verificar se já existe um fornecedor com o mesmo CNPJ
        return fornecedorRepository.save(fornecedor);
    }

    @Override // Add Override annotation
    @Transactional
    public Fornecedor atualizar(Long id, Fornecedor fornecedorAtualizado) {
        Fornecedor fornecedorExistente = fornecedorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fornecedor com ID " + id + " não encontrado para atualização."));

        fornecedorExistente.setNome(fornecedorAtualizado.getNome());
        fornecedorExistente.setContatoNome(fornecedorAtualizado.getContatoNome());
        fornecedorExistente.setContatoEmail(fornecedorAtualizado.getContatoEmail());
        fornecedorExistente.setContatoTelefone(fornecedorAtualizado.getContatoTelefone());
        // Adicionar outras atualizações de campo conforme necessário

        return fornecedorRepository.save(fornecedorExistente);
    }

    @Override // Add Override annotation
    @Transactional
    public boolean deletar(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fornecedor com ID " + id + " não encontrado para exclusão."));
        
        // Adicionar verificações aqui se o fornecedor está vinculado a outras entidades (ex: Entradas)
        // e impedir a exclusão ou tratar em cascata conforme a regra de negócio.
        // Por exemplo:
        // if (entradaProdutoRepository.existsByFornecedorId(id)) {
        //    throw new BusinessException("Não é possível excluir o fornecedor pois ele está associado a entradas de produtos.");
        // }

        fornecedorRepository.delete(fornecedor);
        return true; // Retorna true se a exclusão for bem-sucedida após encontrar o fornecedor
    }
}
