package be.ecampus.ecampusbackend.service;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.ValidationStatus;
import be.ecampus.ecampusbackend.repository.AnnonceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnnonceServiceTest {

    @Mock
    private AnnonceRepository annonceRepository;

    @InjectMocks
    private AnnonceService annonceService;

    private Annonce createTestAnnonce() {
        return new Annonce(
                UUID.randomUUID(),
                null,
                "Test announcement",
                "This is a test announcement"
        );
    }

    @Test
    void getsAllAnnonces() {
        // Arrange
        List<Annonce> annonces = List.of(
                createTestAnnonce(),
                createTestAnnonce()
        );

        when(annonceRepository.findAll()).thenReturn(annonces);

        // Act
        List<Annonce> result = annonceService.getAllAnnonces();

        // Assert
        assertEquals(2, result.size());
        assertEquals(annonces, result);
        verify(annonceRepository).findAll();
    }

    @Test
    void getsAnnonceById() {
        // Arrange
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));

        // Act
        Annonce result = annonceService.getAnnonceById(id);

        // Assert
        assertNotNull(result);
        assertEquals(annonce, result);
        verify(annonceRepository).findById(id);
    }

    @Test
    void throwsExceptionWhenAnnonceDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> annonceService.getAnnonceById(id)
        );

        assertTrue(exception.getMessage().contains("Annonce not found"));

        verify(annonceRepository).findById(id);
    }

    @Test
    void createsAnnonce() {
        // Arrange
        Annonce annonce = createTestAnnonce();

        when(annonceRepository.save(annonce))
                .thenReturn(annonce);

        // Act
        Annonce result = annonceService.createAnnonce(annonce);

        // Assert
        assertNotNull(result);
        assertEquals(annonce, result);

        verify(annonceRepository).save(annonce);
    }

    @Test
    void updatesAnnonce() {
        // Arrange
        UUID id = UUID.randomUUID();

        Annonce existingAnnonce = createTestAnnonce();
        Annonce updatedAnnonce = createTestAnnonce();

        UUID moderatorId = UUID.randomUUID();
        Instant moderatedAt = Instant.now();
        Instant expiresAt = Instant.now().plusSeconds(86400);

        updatedAnnonce.setModerateurId(moderatorId);
        updatedAnnonce.setModeratedAt(moderatedAt);
        updatedAnnonce.setTemplateId(2);
        updatedAnnonce.setValidationStatus(ValidationStatus.EN_ATTENTE);
        updatedAnnonce.setExpiresAt(expiresAt);

        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(existingAnnonce));

        when(annonceRepository.save(existingAnnonce))
                .thenReturn(existingAnnonce);

        // Act
        Annonce result = annonceService.updateAnnonce(id, updatedAnnonce);

        // Assert
        assertNotNull(result);
        assertEquals(moderatorId, result.getModerateurId());
        assertEquals(moderatedAt, result.getModeratedAt());
        assertEquals(2, result.getTemplateId());
        assertEquals(ValidationStatus.EN_ATTENTE, result.getValidationStatus());
        assertEquals(expiresAt, result.getExpiresAt());

        verify(annonceRepository).findById(id);
        verify(annonceRepository).save(existingAnnonce);
    }

    @Test
    void deletesAnnonce() {
        // Arrange
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));

        // Act
        annonceService.deleteAnnonce(id);

        // Assert
        verify(annonceRepository).findById(id);
        verify(annonceRepository).delete(annonce);
    }

    @Test
    void doesNotDeleteAnnonceWhenItDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
                RuntimeException.class,
                () -> annonceService.deleteAnnonce(id)
        );

        verify(annonceRepository).findById(id);
        verify(annonceRepository, never()).delete(any());
    }
}
