package br.ifce.gestor_estoque.services;

import br.ifce.gestor_estoque.dto.DashboardOverviewResponse;
import br.ifce.gestor_estoque.repositores.EntradaProdutoRepository;
import br.ifce.gestor_estoque.repositores.ProdutoRepository;
import br.ifce.gestor_estoque.repositores.SaidaProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final EntradaProdutoRepository entradaProdutoRepository;
    private final SaidaProdutoRepository saidaProdutoRepository;

    public DashboardOverviewResponse getDashboardOverview() {
        int totalProducts = (int) produtoRepository.count();

        BigDecimal totalStockValue = produtoRepository.findAll().stream()
                .map(produto -> produto.getPreco().multiply(BigDecimal.valueOf(produto.getQuantidadeEstoque())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int lowStockItems = (int) produtoRepository.countByQuantidadeEstoqueLessThanEqual(10);

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);

        int monthlyEntries = (int) entradaProdutoRepository.countByDataMovimentacaoGreaterThanEqual(startOfMonth);

        int monthlyExits = (int) saidaProdutoRepository.countByDataMovimentacaoGreaterThanEqual(startOfMonth);

        List<DashboardOverviewResponse.TopStockedProduct> topStockedProducts = 
                produtoRepository.findTop5ByOrderByQuantidadeEstoqueDesc()
                        .stream()
                        .map(produto -> new DashboardOverviewResponse.TopStockedProduct(
                                produto.getNome(), 
                                produto.getQuantidadeEstoque()
                        ))
                        .toList();

        return new DashboardOverviewResponse(
                totalProducts,
                totalStockValue,
                lowStockItems,
                monthlyEntries,
                monthlyExits,
                topStockedProducts
        );
    }
}
