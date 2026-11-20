package be.ecampus.ecampusbackend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ecampus.ecampusbackend.service.HealthService;

/** Point de contrôle public pour vérifier que l'API répond. */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService){
        this.healthService = healthService;
    }

    @GetMapping
    public Map<String, String> health() {
        return healthService.getHealth();
    }
}
