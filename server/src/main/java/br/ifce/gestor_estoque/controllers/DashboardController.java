package br.ifce.gestor_estoque.controllers;

import br.ifce.gestor_estoque.dto.DashboardOverviewResponse;
import br.ifce.gestor_estoque.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewResponse> getDashboardOverview() {
        DashboardOverviewResponse response = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(response);
    }
}
