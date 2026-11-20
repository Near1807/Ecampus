package be.ecampus.ecampusbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * A conversation between a user and an administrator. That the second one
 * really has an admin role cannot be checked by the database: the service
 * layer enforces it.
 */
@Entity
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "admin_id", nullable = false)
    private UUID adminId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Conversation() {
    }

    /**
     * Opens a conversation.
     *
     * @param userId  id of the user
     * @param adminId id of the administrator, who must differ from the user
     */
    public Conversation(UUID userId, UUID adminId) {
        this.userId = userId;
        this.adminId = adminId;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getAdminId() {
        return adminId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}