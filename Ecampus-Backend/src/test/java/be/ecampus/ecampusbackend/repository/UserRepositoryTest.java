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
 * Integration tests of {@link UserRepository} against the real local PostgreSQL.
 *
 * <p>These are integration tests, not unit tests: they check that the Java mapping
 * and the SQL schema agree, which cannot be verified without the database.
 * Each test is rolled back by Spring, so tests do not depend on each other.
 */
@DataJpaTest
// Use the local Supabase PostgreSQL instead of an embedded in-memory database,
// because the constraints we test (unique index on lower(mail)) are PostgreSQL ones.
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest
{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void savesAndReadsBackAUser() {
        // Arrange
        User user = new User();
        user.setFirstname("Ada");
        user.setLastname("Lovelace");
        user.setMail("ada@example.com");
        user.setPasswordHash("hash");

        // Act
        User saved = userRepository.saveAndFlush(user);
        UUID id = saved.getId();

        // Empty Hibernate's memory so findById must read the row from the database
        // instead of returning the object we just saved.
        entityManager.clear();

        Optional<User> result = userRepository.findById(id);

        // Assert
        assertTrue(result.isPresent(), "The user should be found in the database");
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
        User first = new User();
        first.setFirstname("Ada");
        first.setLastname("Lovelace");
        first.setMail("ada@example.com");
        first.setPasswordHash("hash");
        userRepository.saveAndFlush(first);
        User duplicate = new User();
        duplicate.setFirstname("Ada");
        duplicate.setLastname("Clone");
        duplicate.setMail("Ada@Example.com");
        duplicate.setPasswordHash("hash");

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
        assertTrue(exceptionWasThrown, "The database should refuse the duplicate mail");
        // Check the constraint name so the test fails if the rejection comes
        // from another rule than the unique index on lower(mail).
        assertTrue(errorMessage.contains("uq_users_mail_lower"),
                "The refusal should come from uq_users_mail_lower");
    }

    @Test
    void findsAUserIgnoringTheCaseOfTheMail() {
        User user = new User();
        user.setFirstname("Ada");
        user.setLastname("Lovelace");
        user.setMail("ada@example.com");
        user.setPasswordHash("hash");
        userRepository.saveAndFlush(user);
        Optional<User> result = userRepository.findByMailIgnoreCase("ADA@EXAMPLE.COM");
        assertTrue(result.isPresent(), "The user should be found");
        User found = result.get();
        assertEquals(user.getId(), found.getId());
    }
}