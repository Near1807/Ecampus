package be.ecampus.ecampusbackend.controller;

import be.ecampus.ecampusbackend.model.Conversation;
import be.ecampus.ecampusbackend.model.Message;
import be.ecampus.ecampusbackend.service.MessagerieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/messagerie")
@CrossOrigin(origins = "*")
public class MessagerieController {

    private final MessagerieService messagerieService;

    public MessagerieController(MessagerieService messagerieService) {
        this.messagerieService = messagerieService;
    }

    // L'admin signale un problème sur une annonce -> ouvre le chat + envoie le 1er message
    @PostMapping("/ouvrir")
    public Conversation ouvrir(@RequestBody Map<String, String> payload) {
        UUID annonceId = UUID.fromString(payload.get("annonceId"));
        UUID adminId = UUID.fromString(payload.get("adminId"));
        String content = payload.get("content");

        return messagerieService.ouvrirConversationPourAnnonce(annonceId, adminId, content);
    }

    // L'utilisateur ou l'admin envoie une réponse
    @PostMapping("/{conversationId}/messages")
    public Message repondre(@PathVariable UUID conversationId, @RequestBody Map<String, String> payload) {
        UUID auteurId = UUID.fromString(payload.get("auteurId"));
        String content = payload.get("content");

        return messagerieService.envoyerMessage(conversationId, auteurId, content);
    }

    // Récupère l'historique des messages d'une annonce
    @GetMapping("/annonce/{annonceId}")
    public List<Message> lireConversation(@PathVariable UUID annonceId) {
        return messagerieService.getMessagesParAnnonce(annonceId);
    }

    // Marque les messages de l'autre personne comme lus
    @PutMapping("/{conversationId}/lire")
    public void marquerCommeLu(@PathVariable UUID conversationId, @RequestBody Map<String, String> payload) {
        UUID lecteurId = UUID.fromString(payload.get("lecteurId"));
        messagerieService.marquerCommeLus(conversationId, lecteurId);
    }
}