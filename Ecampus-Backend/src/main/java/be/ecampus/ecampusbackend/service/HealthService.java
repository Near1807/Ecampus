package be.ecampus.ecampusbackend.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class HealthService {

    public Map<String, String> getHealth() {
        return Map.of("status", "UP");
    }
}
