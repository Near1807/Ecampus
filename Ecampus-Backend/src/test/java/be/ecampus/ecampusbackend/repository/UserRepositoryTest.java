package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.UserRole;
import jakarta.persistence.EntityManager;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests of UserRepository against the real local PostgreSQL.
 *
 * These tests check that the Java mapping and SQL schema agree.
 * Each test is rolled back by Spring.
 */
@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesAndReadsBackAUser() {

        // Arrange
        User user = new User(
                "Ada",
                "Lovelace",
                "ada@example.com",
                "hash"
        );

        // Act
        User saved = userRepository.saveAndFlush(user);
        UUID id = saved.getId();

        entityManager.clear();

        Optional<User> result = userRepository.findById(id);

        // Assert
        assertTrue(result.isPresent(),
                "The user should be found in the database");

        User found = result.get();

        assertEquals("Ada", found.getFirstname());
        assertEquals("Lovelace", found.getLastname());
        assertEquals("ada@example.com", found.getMail());
        assertEquals("hash", found.getPasswordHash());
        assertEquals(UserRole.USER, found.getRole());
    }

    @Test
    void rejectsTheSameMailIgnoringCase() {

        // Arrange
        User first = new User(
                "Ada",
                "Lovelace",
                "ada@example.com",
                "hash"
        );

        userRepository.saveAndFlush(first);

        User duplicate = new User(
                "Ada",
                "Clone",
                "Ada@Example.com",
                "hash"
        );

        // Act
        boolean exceptionWasThrown = false;
        String errorMessage = "";

        try {
            userRepository.saveAndFlush(duplicate);
        } catch (DataIntegrityViolationException exception) {
            exceptionWasThrown = true;
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(exceptionWasThrown,
                "The database should refuse the duplicate mail");

        assertTrue(errorMessage.contains("uq_users_mail_lower"),
                "The refusal should come from uq_users_mail_lower");
    }

    @Test
    void findsAUserIgnoringTheCaseOfTheMail() {

        // Arrange
        User user = new User(
                "Ada",
                "Lovelace",
                "ada@example.com",
                "hash"
        );

        userRepository.saveAndFlush(user);

        // Act
        Optional<User> result =
                userRepository.findByMailIgnoreCase("ADA@EXAMPLE.COM");

        // Assert
        assertTrue(result.isPresent(),
                "The user should be found");

        User found = result.get();

        assertEquals(user.getId(), found.getId());
    }
}
