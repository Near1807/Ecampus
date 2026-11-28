package be.ecampus.ecampusbackend.service;

import be.ecampus.ecampusbackend.exception.ApiException;
import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.ValidationStatus;
import be.ecampus.ecampusbackend.repository.AnnonceRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

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

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

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

    private User createAdmin() {
        User admin = new User(
                "Admin",
                "Test",
                "admin@test.com",
                "hash"
        );
        admin.setRole(UserRole.ADMIN);
        return admin;
    }

    private User createUser() {
        User user = new User(
                "User",
                "Test",
                "user@test.com",
                "hash"
        );
        user.setRole(UserRole.USER);
        return user;
    }

    @Test
    void getsAllAnnonces() {
        List<Annonce> annonces = List.of(
                createTestAnnonce(),
                createTestAnnonce()
        );

        when(annonceRepository.findAll()).thenReturn(annonces);

        List<Annonce> result = annonceService.getAllAnnonces();

        assertEquals(2, result.size());
        assertEquals(annonces, result);

        verify(annonceRepository).findAll();
    }

    @Test
    void getsAllValideAnnonces() {
        List<Annonce> annonces = List.of(
                createTestAnnonce(),
                createTestAnnonce()
        );

        when(annonceRepository.findByValidationStatus(
                ValidationStatus.VALIDE))
                .thenReturn(annonces);

        List<Annonce> result = annonceService.getAllValideAnnonces();

        assertEquals(2, result.size());
        assertEquals(annonces, result);

        verify(annonceRepository)
                .findByValidationStatus(ValidationStatus.VALIDE);
    }

    @Test
    void getsAnnonceById() {
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));

        Annonce result = annonceService.getAnnonceById(id);

        assertNotNull(result);
        assertEquals(annonce, result);

        verify(annonceRepository).findById(id);
    }

    @Test
    void throwsExceptionWhenAnnonceDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> annonceService.getAnnonceById(id)
        );

        assertTrue(exception.getMessage().contains("Annonce not found"));

        verify(annonceRepository).findById(id);
    }

    @Test
    void createsAnnonce() {
        Annonce annonce = createTestAnnonce();

        when(annonceRepository.save(annonce))
                .thenReturn(annonce);

        Annonce result = annonceService.createAnnonce(annonce);

        assertNotNull(result);
        assertEquals(annonce, result);
        assertEquals(ValidationStatus.EN_ATTENTE,
                result.getValidationStatus());

        verify(annonceRepository).save(annonce);
    }

    @Test
    void updatesAnnonce() {
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

        Annonce result = annonceService.updateAnnonce(id, updatedAnnonce);

        assertNotNull(result);
        assertEquals(moderatorId, result.getModerateurId());
        assertEquals(moderatedAt, result.getModeratedAt());
        assertEquals(2, result.getTemplateId());
        assertEquals(ValidationStatus.EN_ATTENTE,
                result.getValidationStatus());
        assertEquals(expiresAt, result.getExpiresAt());

        verify(annonceRepository).findById(id);
        verify(annonceRepository).save(existingAnnonce);
    }

    @Test
    void validatesPendingAnnonce() {
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();
        User admin = createAdmin();

        when(userService.currentUser(authentication)).thenReturn(admin);
        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));
        when(annonceRepository.save(annonce)).thenReturn(annonce);

        Annonce result = annonceService.validerAnnonce(id, authentication);

        assertEquals(ValidationStatus.VALIDE,
                result.getValidationStatus());
        assertEquals(admin.getId(), result.getModerateurId());
        assertNotNull(result.getModeratedAt());

        verify(annonceRepository).save(annonce);
    }

    @Test
    void declinesPendingAnnonce() {
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();
        User admin = createAdmin();

        when(userService.currentUser(authentication)).thenReturn(admin);
        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));
        when(annonceRepository.save(annonce)).thenReturn(annonce);

        Annonce result = annonceService.declinerAnnonce(id, authentication);

        assertEquals(ValidationStatus.DECLINE,
                result.getValidationStatus());
        assertEquals(admin.getId(), result.getModerateurId());
        assertNotNull(result.getModeratedAt());

        verify(annonceRepository).save(annonce);
    }

    @Test
    void cannotValidateAlreadyModeratedAnnonce() {
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();
        User admin = createAdmin();

        annonce.setValidationStatus(ValidationStatus.DECLINE);

        when(userService.currentUser(authentication)).thenReturn(admin);
        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));

        assertThrows(
                ApiException.class,
                () -> annonceService.validerAnnonce(id, authentication)
        );

        verify(annonceRepository, never()).save(any());
    }

    @Test
    void cannotDeclineAlreadyModeratedAnnonce() {
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();
        User admin = createAdmin();

        annonce.setValidationStatus(ValidationStatus.VALIDE);

        when(userService.currentUser(authentication)).thenReturn(admin);
        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));

        assertThrows(
                ApiException.class,
                () -> annonceService.declinerAnnonce(id, authentication)
        );

        verify(annonceRepository, never()).save(any());
    }

    @Test
    void regularUserCannotValidateAnnonce() {
        UUID id = UUID.randomUUID();
        User user = createUser();

        when(userService.currentUser(authentication)).thenReturn(user);

        assertThrows(
                ApiException.class,
                () -> annonceService.validerAnnonce(id, authentication)
        );

        verify(annonceRepository, never()).findById(any());
        verify(annonceRepository, never()).save(any());
    }

    @Test
    void regularUserCannotDeclineAnnonce() {
        UUID id = UUID.randomUUID();
        User user = createUser();

        when(userService.currentUser(authentication)).thenReturn(user);

        assertThrows(
                ApiException.class,
                () -> annonceService.declinerAnnonce(id, authentication)
        );

        verify(annonceRepository, never()).findById(any());
        verify(annonceRepository, never()).save(any());
    }

    @Test
    void deletesAnnonce() {
        UUID id = UUID.randomUUID();
        Annonce annonce = createTestAnnonce();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.of(annonce));

        annonceService.deleteAnnonce(id);

        verify(annonceRepository).findById(id);
        verify(annonceRepository).delete(annonce);
    }

    @Test
    void doesNotDeleteAnnonceWhenItDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(annonceRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> annonceService.deleteAnnonce(id)
        );

        verify(annonceRepository).findById(id);
        verify(annonceRepository, never()).delete(any());
    }
}
