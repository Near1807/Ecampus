package be.ecampus.ecampusbackend.service;

import be.ecampus.ecampusbackend.model.Annonce;
import be.ecampus.ecampusbackend.model.Conversation;
import be.ecampus.ecampusbackend.model.Message;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.repository.AnnonceRepository;
import be.ecampus.ecampusbackend.repository.ConversationRepository;
import be.ecampus.ecampusbackend.repository.MessageRepository;
import be.ecampus.ecampusbackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class MessagerieService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final AnnonceRepository annonceRepository;
    private final UserRepository userRepository;

    public MessagerieService(ConversationRepository conversationRepository,
                             MessageRepository messageRepository,
                             AnnonceRepository annonceRepository,
                             UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.annonceRepository = annonceRepository;
        this.userRepository = userRepository;
    }

    /**
     * 1. L'admin signale un problème sur une annonce :
     *    - Assigne l'admin comme modérateur de l'annonce
     *    - Ouvre (ou récupère) la conversation entre l'auteur et cet admin
     *    - Envoie le premier message explicatif
     */
    @Transactional
    public Conversation ouvrirConversationPourAnnonce(UUID annonceId, UUID adminId, String premierMessage) {
        Annonce annonce = annonceRepository.findById(annonceId)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin introuvable"));

        if (admin.getRole() == UserRole.USER) {
            throw new IllegalArgumentException("Seul un administrateur peut ouvrir une discussion de modération.");
        }
        if (annonce.getAuteurId().equals(admin.getId())) {
            throw new IllegalArgumentException("Un administrateur ne peut pas ouvrir une discussion avec lui-même.");
        }

        // Respecte le CHECK SQL : moderateurId et moderatedAt sont remplis ensemble
        if (annonce.getModerateurId() == null) {
            annonce.setModerateurId(admin.getId());
            annonce.setModeratedAt(Instant.now());
            annonceRepository.save(annonce);
        }

        Conversation conversation = conversationRepository
                .findByUserIdAndAdminId(annonce.getAuteurId(), annonce.getModerateurId())
                .orElseGet(() -> conversationRepository.save(
                        new Conversation(annonce.getAuteurId(), annonce.getModerateurId())
                ));

        envoyerMessage(conversation.getId(), admin.getId(), premierMessage);
        return conversation;
    }

    /**
     * 2. Envoyer un message (admin ou utilisateur) dans une conversation existante
     */
    @Transactional
    public Message envoyerMessage(UUID conversationId, UUID auteurId, String content) {
        if (!conversationRepository.existsById(conversationId)) {
            throw new RuntimeException("Conversation introuvable");
        }
        if (!userRepository.existsById(auteurId)) {
            throw new RuntimeException("Utilisateur introuvable");
        }

        Message message = new Message(conversationId, auteurId, content);
        return messageRepository.save(message);
    }

    /**
     * 3. Récupérer tous les messages liés à une annonce (liste vide si aucun problème signalé)
     */
    public List<Message> getMessagesParAnnonce(UUID annonceId) {
        Annonce annonce = annonceRepository.findById(annonceId)
                .orElseThrow(() -> new RuntimeException("Annonce introuvable"));

        if (annonce.getModerateurId() == null) {
            return List.of();
        }

        return conversationRepository
                .findByUserIdAndAdminId(annonce.getAuteurId(), annonce.getModerateurId())
                .map(conv -> messageRepository.findByConversationIdOrderByCreatedAtAsc(conv.getId()))
                .orElse(List.of());
    }

    /**
     * 4. Marquer les messages reçus comme lus (remplit read_at)
     */
    @Transactional
    public void marquerCommeLus(UUID conversationId, UUID lecteurId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        Instant maintenant = Instant.now();

        for (Message msg : messages) {
            if (!msg.getAuteurId().equals(lecteurId) && msg.getReadAt() == null) {
                msg.setReadAt(maintenant);
            }
        }
        messageRepository.saveAll(messages);
    }
}