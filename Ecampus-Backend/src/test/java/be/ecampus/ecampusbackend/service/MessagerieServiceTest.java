package be.ecampus.ecampusbackend.service;

import be.ecampus.ecampusbackend.model.*;
import be.ecampus.ecampusbackend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessagerieServiceTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private AnnonceRepository annonceRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private MessagerieService messagerieService;

    private UUID auteurId;
    private UUID adminId;
    private UUID annonceId;
    private User admin;
    private Annonce annonce;

    @BeforeEach
    void setUp() {
        auteurId = UUID.randomUUID();
        adminId = UUID.randomUUID();
        annonceId = UUID.randomUUID();

        admin = new User();
        admin.setFirstname("Alice");
        admin.setLastname("Admin");
        admin.setMail("admin@ecam.be");
        admin.setPasswordHash("hash");
        admin.setRole(UserRole.ADMIN);
        ReflectionTestUtils.setField(admin, "id", adminId);

        annonce = new Annonce(auteurId, Categorie.values()[0], "Titre test", "Description test");
        ReflectionTestUtils.setField(annonce, "id", annonceId);
    }

    @Test
    void ouvrirConversation_Succes_AssigneModerateurEtCreeMessage() {
        when(annonceRepository.findById(annonceId)).thenReturn(Optional.of(annonce));
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));
        when(conversationRepository.findByUserIdAndAdminId(auteurId, adminId)).thenReturn(Optional.empty());

        Conversation convSauvegardee = new Conversation(auteurId, adminId);
        UUID convId = UUID.randomUUID();
        ReflectionTestUtils.setField(convSauvegardee, "id", convId);

        when(conversationRepository.save(any(Conversation.class))).thenReturn(convSauvegardee);
        when(conversationRepository.existsById(convId)).thenReturn(true);
        when(userRepository.existsById(adminId)).thenReturn(true);

        Conversation resultat = messagerieService.ouvrirConversationPourAnnonce(
                annonceId, adminId, "Il manque la date sur votre annonce."
        );

        assertNotNull(resultat);
        assertEquals(adminId, annonce.getModerateurId());
        assertNotNull(annonce.getModeratedAt());
        verify(annonceRepository).save(annonce);
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    void ouvrirConversation_RefuseSiNonAdmin() {
        admin.setRole(UserRole.USER);

        when(annonceRepository.findById(annonceId)).thenReturn(Optional.of(annonce));
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));

        assertThrows(IllegalArgumentException.class, () ->
                messagerieService.ouvrirConversationPourAnnonce(annonceId, adminId, "Message interdit")
        );

        verify(conversationRepository, never()).save(any());
        verify(messageRepository, never()).save(any());
    }

    @Test
    void ouvrirConversation_RefuseSiAdminEstAuteurDeLAnnonce() {
        Annonce propreAnnonce = new Annonce(adminId, Categorie.values()[0], "Mon annonce", "Desc");
        ReflectionTestUtils.setField(propreAnnonce, "id", annonceId);

        when(annonceRepository.findById(annonceId)).thenReturn(Optional.of(propreAnnonce));
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));

        assertThrows(IllegalArgumentException.class, () ->
                messagerieService.ouvrirConversationPourAnnonce(annonceId, adminId, "Test")
        );
    }

    @Test
    void getMessagesParAnnonce_RenvoieListeVideSiPasDeModerateur() {
        when(annonceRepository.findById(annonceId)).thenReturn(Optional.of(annonce));

        List<Message> messages = messagerieService.getMessagesParAnnonce(annonceId);

        assertTrue(messages.isEmpty());
        verify(messageRepository, never()).findByConversationIdOrderByCreatedAtAsc(any());
    }

    @Test
    void marquerCommeLus_NeMarqueQueLesMessagesRecus() {
        UUID convId = UUID.randomUUID();
        Message msgAdmin = new Message(convId, adminId, "Bonjour");
        Message msgEtudiant = new Message(convId, auteurId, "Réponse");

        when(messageRepository.findByConversationIdOrderByCreatedAtAsc(convId))
                .thenReturn(List.of(msgAdmin, msgEtudiant));

        messagerieService.marquerCommeLus(convId, auteurId);

        assertNotNull(msgAdmin.getReadAt());
        assertNull(msgEtudiant.getReadAt());
        verify(messageRepository).saveAll(anyList());
    }

    @Test
    void ouvrirConversation_ReutiliseConversationExistanteSansDoublon() {
        // 1. Préparation : une conversation existe déjà entre l'étudiant et cet admin
        Conversation convExistante = new Conversation(auteurId, adminId);
        UUID convId = UUID.randomUUID();
        ReflectionTestUtils.setField(convExistante, "id", convId);

        when(annonceRepository.findById(annonceId)).thenReturn(Optional.of(annonce));
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));
        when(conversationRepository.findByUserIdAndAdminId(auteurId, adminId))
                .thenReturn(Optional.of(convExistante));
        when(conversationRepository.existsById(convId)).thenReturn(true);
        when(userRepository.existsById(adminId)).thenReturn(true);

        // 2. Exécution
        Conversation resultat = messagerieService.ouvrirConversationPourAnnonce(
                annonceId, adminId, "Autre problème signalé sur une annonce."
        );

        // 3. Vérifications
        assertEquals(convId, resultat.getId());
        verify(conversationRepository, never()).save(any(Conversation.class)); // Aucune nouvelle conversation créée
        verify(messageRepository).save(any(Message.class)); // Le nouveau message est bien ajouté
    }
}