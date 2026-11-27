package be.ecampus.ecampusbackend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.service.AnnonceService;

@RestController
@RequestMapping("/api/annonces")
public class AnnonceController {

    private final AnnonceService annonceService;

    public AnnonceController(AnnonceService annonceService) {
        this.annonceService = annonceService;
    }

    @GetMapping
    public List<Annonce> getAllAnnonces() {
        return annonceService.getAllAnnonces();
    }

    @GetMapping("/{id}")
    public Annonce getAnnonceById(@PathVariable UUID id) {
        return annonceService.getAnnonceById(id);
    }

    @PostMapping
    public Annonce createAnnonce(@RequestBody Annonce annonce) {
        return annonceService.createAnnonce(annonce);
    }

    @PutMapping("/{id}")
    public Annonce updateAnnonce(
            @PathVariable UUID id,
            @RequestBody Annonce annonce) {
        return annonceService.updateAnnonce(id, annonce);
    }

    @DeleteMapping("/{id}")
    public void deleteAnnonce(@PathVariable UUID id) {
        annonceService.deleteAnnonce(id);
    }
}
