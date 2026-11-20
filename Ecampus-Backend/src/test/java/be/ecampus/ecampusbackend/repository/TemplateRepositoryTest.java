package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.Template;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.dao.DataIntegrityViolationException;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TemplateRepositoryTest {
    @Autowired
    private EntityManager entityManager;

    @Autowired
    private TemplateRepository templateRepository;

    @Test
    void savesAndReadsBackATemplate() {
        // Arrange
        Template template = new Template("NEWCODE", "New name");

        // Act
        Template saved = templateRepository.saveAndFlush(template);
        Integer id = saved.getId();
        entityManager.clear();
        Template found = templateRepository.findById(id).get();

        // Assert
        assertEquals("NEWCODE", found.getCode());
        assertEquals("New name", found.getNom());
        assertTrue(found.isActif());
        assertNotNull(found.getCreatedAt());
    }

    @Test
    void findsTheStandardTemplate() {
        // Act
        Template found = templateRepository.findById(0).get();

        // Assert
        assertEquals("STANDARD", found.getCode());
        assertEquals("Template standard", found.getNom());
    }

    @Test
    void rejectsATemplateWithAnExistingCode() {
        // Arrange
        Template duplicate = new Template("STANDARD", "doublon");

        // Act
        String errorMessage = "";
        try {
            templateRepository.saveAndFlush(duplicate);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("uq_templates_code"));
    }

    @Test
    void rejectsDeactivatingTemplate0() {
        // Arrange
        Template template0 = templateRepository.findById(0).get();

        // Act
        String errorMessage = "";
        try {
            template0.deactivate();
            templateRepository.saveAndFlush(template0);
        } catch (DataIntegrityViolationException exception) {
            errorMessage = exception.getMostSpecificCause().getMessage();
        }

        // Assert
        assertTrue(errorMessage.contains("chk_templates_standard_actif"));
    }
}