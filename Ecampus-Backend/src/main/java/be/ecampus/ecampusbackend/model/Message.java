package be.ecampus.ecampusbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** A message written by a user or an administrator inside a conversation. */
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "conversation_id", nullable = false)
    private UUID conversationId;

    @Column(name = "auteur_id", nullable = false)
    private UUID auteurId;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // Null as long as the recipient has not read the message.
    @Column(name = "read_at")
    private Instant readAt;

    protected Message() {
    }

    /**
     * Creates an unread message.
     *
     * @param conversationId id of the conversation
     * @param auteurId       id of the author
     * @param content        text of the message
     */
    public Message(UUID conversationId, UUID auteurId, String content) {
        this.conversationId = conversationId;
        this.auteurId = auteurId;
        this.content = content;
    }

    public UUID getId() {
        return id;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public UUID getAuteurId() {
        return auteurId;
    }

    public String getContent() {
        return content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getReadAt() {
        return readAt;
    }
    public void setReadAt(Instant readAt) {this.readAt = readAt;}
}