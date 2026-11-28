package be.ecampus.ecampusbackend.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.ValidationStatus;
import be.ecampus.ecampusbackend.repository.AnnonceRepository;
import be.ecampus.ecampusbackend.exception.ApiException;

@Service
public class AnnonceService {

    private final AnnonceRepository annonceRepository;
    private final UserService userService;

    public AnnonceService(
            AnnonceRepository annonceRepository,
            UserService userService) {
        this.annonceRepository = annonceRepository;
        this.userService = userService;
    }

    public List<Annonce> getAllAnnonces() {
        return annonceRepository.findAll();
    }

    public Annonce getAnnonceById(UUID id) {
        return annonceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Annonce not found: " + id));
    }

    public Annonce createAnnonce(Annonce annonce) {
        return annonceRepository.save(annonce);
    }

    public Annonce updateAnnonce(UUID id, Annonce annonce) {
        Annonce existingAnnonce = getAnnonceById(id);

        existingAnnonce.setModerateurId(annonce.getModerateurId());
        existingAnnonce.setModeratedAt(annonce.getModeratedAt());
        existingAnnonce.setTemplateId(annonce.getTemplateId());
        existingAnnonce.setExpiresAt(annonce.getExpiresAt());

        return annonceRepository.save(existingAnnonce);
    }

    public void deleteAnnonce(UUID id) {
        Annonce annonce = getAnnonceById(id);
        annonceRepository.delete(annonce);
    }

    public List<Annonce> getAllValideAnnonces() {
        return annonceRepository.findByValidationStatus(
                ValidationStatus.VALIDE);
    }

    @Transactional
    public Annonce validerAnnonce(
            UUID id,
            Authentication authentication) {

        User moderator = checkAdmin(authentication);
        Annonce annonce = getAnnonceById(id);

        checkPending(annonce);

        annonce.setValidationStatus(ValidationStatus.VALIDE);
        annonce.setModerateurId(moderator.getId());
        annonce.setModeratedAt(Instant.now());

        return annonceRepository.save(annonce);
    }

    @Transactional
    public Annonce declinerAnnonce(
            UUID id,
            Authentication authentication) {

        User moderator = checkAdmin(authentication);
        Annonce annonce = getAnnonceById(id);

        checkPending(annonce);

        annonce.setValidationStatus(ValidationStatus.DECLINE);
        annonce.setModerateurId(moderator.getId());
        annonce.setModeratedAt(Instant.now());

        return annonceRepository.save(annonce);
    }

    private User checkAdmin(Authentication authentication) {

        User moderator = userService.currentUser(authentication);

        if (!moderator.isAdmin()) {
            throw ApiException.forbidden(
                    "Seuls les administrateurs peuvent modérer les annonces");
        }

        return moderator;
    }

    private void checkPending(Annonce annonce) {

        if (annonce.getValidationStatus() != ValidationStatus.EN_ATTENTE) {
            throw ApiException.badRequest(
                    "Cette annonce a déjà été modérée");
        }
    }
}
