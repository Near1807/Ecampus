package be.ecampus.ecampusbackend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.ValidationStatus;
import be.ecampus.ecampusbackend.repository.AnnonceRepository;

@Service
public class AnnonceService {

    private final AnnonceRepository annonceRepository;

    public AnnonceService(AnnonceRepository annonceRepository) {
        this.annonceRepository = annonceRepository;
    }

    public List<Annonce> getAllAnnonces() {
        return annonceRepository.findAll();
    }

    public Annonce getAnnonceById(UUID id) {
        return annonceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce not found: " + id));
    }

    public Annonce createAnnonce(Annonce annonce) {
        return annonceRepository.save(annonce);
    }

    public Annonce updateAnnonce(UUID id, Annonce annonce) {
        Annonce existingAnnonce = getAnnonceById(id);

        existingAnnonce.setModerateurId(annonce.getModerateurId());
        existingAnnonce.setModeratedAt(annonce.getModeratedAt());
        existingAnnonce.setTemplateId(annonce.getTemplateId());
        existingAnnonce.setValidationStatus(annonce.getValidationStatus());
        existingAnnonce.setExpiresAt(annonce.getExpiresAt());

        return annonceRepository.save(existingAnnonce);
    }

    public void deleteAnnonce(UUID id) {
        Annonce annonce = getAnnonceById(id);
        annonceRepository.delete(annonce);
    }

    public List<Annonce> getAllValideAnnonces() {
        return annonceRepository.findByValidationStatus(ValidationStatus.VALIDE);
    }
}
