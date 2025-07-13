package br.ifce.gestor_estoque.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardOverviewResponse(
        int totalProducts,
        BigDecimal totalStockValue,
        int lowStockItems,
        int monthlyEntries,
        int monthlyExits,
        List<TopStockedProduct> topStockedProducts
) {
    public record TopStockedProduct(String name, int quantity) {}
}
