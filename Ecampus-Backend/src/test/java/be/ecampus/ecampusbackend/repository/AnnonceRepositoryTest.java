package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.Categorie;
import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.ValidationStatus;

import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
public class AnnonceRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private AnnonceRepository annonceRepository;

    @Autowired
    private UserRepository userRepository;

    private User createUser(String firstname, String lastname, String mail) {
        User user = new User(
                firstname,
                lastname,
                mail,
                "hash"
        );

        return userRepository.saveAndFlush(user);
    }

    @Test
    void savesAndReadsBackAnAnnonce() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        // Act
        Annonce saved = annonceRepository.saveAndFlush(annonce);
        UUID id = saved.getId();

        entityManager.clear();

        Annonce found = annonceRepository.findById(id).get();

        // Assert
        assertEquals(authorId, found.getAuteurId());
        assertEquals(Categorie.EVENEMENT, found.getCategorie());
        assertEquals("Title", found.getTitre());
        assertEquals("Content", found.getDescriptionLongue());
        assertEquals(0, found.getTemplateId());
    }

    @Test
    void rejectsAnAnnonceWithAnUnknownAuthor() {

        // Arrange
        UUID unknownAuthorId = UUID.randomUUID();

        Annonce annonce = new Annonce(
                unknownAuthorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("fk_annonces_auteur"));
    }

    @Test
    void rejectsAnAnnonceWithAnUnknownTemplate() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        annonce.setTemplateId(999);

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("fk_annonces_template"));
    }

    @Test
    void rejectsSelfModeration() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        annonce.setModerateurId(authorId);
        annonce.setModeratedAt(Instant.now());
        annonce.setValidationStatus(ValidationStatus.VALIDE);

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains(
                "chk_annonces_no_self_moderation"
        ));
    }

    @Test
    void rejectsAValidatedStatusWithoutModerator() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        annonce.setValidationStatus(ValidationStatus.VALIDE);

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains(
                "chk_annonces_moderation_coherence"
        ));
    }

    @Test
    void rejectsAModerationDateBeforeCreation() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        User savedModerator = createUser(
                "Grace", "Hopper", "grace@example.com"
        );

        UUID moderatorId = savedModerator.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        annonce.setModerateurId(moderatorId);
        annonce.setValidationStatus(ValidationStatus.VALIDE);
        annonce.setModeratedAt(Instant.now().minusSeconds(3600));

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains(
                "chk_annonces_moderated_after_creation"
        ));
    }

    @Test
    void rejectsAModeratorWithoutModerationDate() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        User savedModerator = createUser(
                "Grace", "Hopper", "grace@example.com"
        );

        UUID moderatorId = savedModerator.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        annonce.setModerateurId(moderatorId);
        annonce.setValidationStatus(ValidationStatus.VALIDE);

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains(
                "chk_annonces_moderated_at_coherence"
        ));
    }

    @Test
    void validExpirationDate() {

        // Arrange
        User savedAuthor = createUser(
                "Ada", "Lovelace", "ada@example.com"
        );

        UUID authorId = savedAuthor.getId();

        Annonce annonce = new Annonce(
                authorId,
                Categorie.EVENEMENT,
                "Title",
                "Content"
        );

        annonce.setExpiresAt(Instant.now().minusSeconds(3600));

        // Act
        String errorMessage = "";

        try {
            annonceRepository.saveAndFlush(annonce);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("chk_annonces_dates"));
    }
}
