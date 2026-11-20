package be.ecampus.ecampusbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** One login event of a user, kept as an audit journal (not a session store). */
@Entity
@Table(name = "connexions")
public class Connexion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "date_heure", nullable = false, updatable = false)
    private Instant dateHeure = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ConnexionStatus status;

    protected Connexion() {
    }

    /**
     * Records a login event happening now.
     *
     * @param userId id of the user concerned
     * @param status outcome of the event
     */
    public Connexion(UUID userId, ConnexionStatus status) {
        this.userId = userId;
        this.status = status;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public Instant getDateHeure() {
        return dateHeure;
    }

    public ConnexionStatus getStatus() {
        return status;
    }
}