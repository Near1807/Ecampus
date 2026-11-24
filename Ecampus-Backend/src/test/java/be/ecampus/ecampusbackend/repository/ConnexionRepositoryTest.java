package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Connexion;
import be.ecampus.ecampusbackend.model.ConnexionStatus;
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
public class ConnexionRepositoryTest {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ConnexionRepository connexionRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void savesAndReadsBackAConnexion() {
        // Arrange
        User user = new User();
        user.setFirstname("Ada");
        user.setLastname("Lovelace");
        user.setMail("ada@example.com");
        user.setPasswordHash("hash");
        UUID userId = userRepository.saveAndFlush(user).getId();
        Connexion connexion = new Connexion(userId, ConnexionStatus.REUSSIE);

        // Act
        Connexion saved = connexionRepository.saveAndFlush(connexion);
        UUID id = saved.getId();
        entityManager.clear();
        Connexion found = connexionRepository.findById(id).get();

        // Assert
        assertEquals(userId, found.getUserId());
        assertEquals(ConnexionStatus.REUSSIE, found.getStatus());
        assertNotNull(found.getDateHeure());
    }

    @Test
    void rejectsAConnexionWithAnUnknownUser() {
        // Arrange
        Connexion connexion = new Connexion(UUID.randomUUID(), ConnexionStatus.REUSSIE);

        // Act
        String errorMessage = "";
        try {
            connexionRepository.saveAndFlush(connexion);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("fk_connexions_users"));
    }
}