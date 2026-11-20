package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.Categorie;
import be.ecampus.ecampusbackend.model.Image;
import be.ecampus.ecampusbackend.model.User;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class ImageRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private AnnonceRepository annonceRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void savesAndReadsBackAnImage() {
        // Arrange
        User author = new User("Ada", "Lovelace", "ada@example.com", "hash");
        UUID authorId = userRepository.saveAndFlush(author).getId();
        Annonce annonce = new Annonce(authorId, Categorie.EVENEMENT, "Title", "Content");
        UUID annonceId = annonceRepository.saveAndFlush(annonce).getId();
        Image image = new Image(annonceId, "annonces/photo1.jpg");

        // Act
        Image saved = imageRepository.saveAndFlush(image);
        UUID id = saved.getId();
        entityManager.clear();
        Image found = imageRepository.findById(id).get();

        // Assert
        assertEquals(annonceId, found.getAnnonceId());
        assertEquals("annonces/photo1.jpg", found.getStoragePath());
        assertNotNull(found.getCreatedAt());
    }

    @Test
    void rejectsAnImageWithAnUnknownAnnonce() {
        // Arrange
        Image image = new Image(UUID.randomUUID(), "annonces/photo1.jpg");

        // Act
        String errorMessage = "";
        try {
            imageRepository.saveAndFlush(image);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("fk_images_annonces"));
    }

    @Test
    void rejectsTwoImagesWithTheSameStoragePath() {
        // Arrange
        User author = new User("Ada", "Lovelace", "ada@example.com", "hash");
        UUID authorId = userRepository.saveAndFlush(author).getId();
        Annonce annonce = new Annonce(authorId, Categorie.EVENEMENT, "Title", "Content");
        UUID annonceId = annonceRepository.saveAndFlush(annonce).getId();
        imageRepository.saveAndFlush(new Image(annonceId, "annonces/photo1.jpg"));
        Image duplicate = new Image(annonceId, "annonces/photo1.jpg");

        // Act
        String errorMessage = "";
        try {
            imageRepository.saveAndFlush(duplicate);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("uq_images_storage_path"));
    }
}