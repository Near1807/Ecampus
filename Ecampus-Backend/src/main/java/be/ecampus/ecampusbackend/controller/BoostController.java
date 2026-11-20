package be.ecampus.ecampusbackend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/boost")
public class BoostController {

    @GetMapping
    public Map<String, String> boost() {
        return Map.of("status", "BOOST UP");
    }
}
