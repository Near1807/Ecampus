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

/** An announcement written by a user and moderated by an administrator. */
@Entity
@Table(name = "annonces")
public class Annonce {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "auteur_id", nullable = false)
    private UUID auteurId;

    // Null as long as nobody has processed the announcement.
    @Column(name = "moderateur_id")
    private UUID moderateurId;

    // Filled together with moderateurId (CHECK in the database).
    @Column(name = "moderated_at")
    private Instant moderatedAt;

    // Must be set explicitly: the SQL DEFAULT 0 only applies when the column is
    // left out of the INSERT, and JPA sends every column (a null is rejected).
    @Column(name = "template_id", nullable = false)
    private Integer templateId = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "categorie", nullable = false, length = 50)
    private Categorie categorie;

    @Column(name = "titre", nullable = false, length = 255)
    private String titre;

    @Column(name = "description_courte")
    private String descriptionCourte;

    @Column(name = "description_longue", nullable = false)
    private String descriptionLongue;

    @Enumerated(EnumType.STRING)
    @Column(name = "niveau_priorite", nullable = false, length = 20)
    private NiveauPriorite niveauPriorite = NiveauPriorite.STANDARD;

    @Enumerated(EnumType.STRING)
    @Column(name = "validation_status", nullable = false, length = 20)
    private ValidationStatus validationStatus = ValidationStatus.EN_ATTENTE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "expires_at")
    private Instant expiresAt;

    // Optional: the date of the event itself, for announcements that have one.
    @Column(name = "event_date")
    private Instant eventDate;

    protected Annonce() {
    }

    /**
     * Creates a pending announcement with the standard template and priority.
     *
     * @param auteurId          id of the author
     * @param categorie         category of the announcement
     * @param titre             title
     * @param descriptionLongue full description
     */
    public Annonce(UUID auteurId, Categorie categorie, String titre, String descriptionLongue) {
        this.auteurId = auteurId;
        this.categorie = categorie;
        this.titre = titre;
        this.descriptionLongue = descriptionLongue;
    }

    public UUID getId() {
        return id;
    }

    public UUID getAuteurId() {
        return auteurId;
    }

    public UUID getModerateurId() {
        return moderateurId;
    }
    public void setModerateurId(UUID moderateurId) {this.moderateurId = moderateurId;}

    public Instant getModeratedAt() {
        return moderatedAt;
    }
    public void setModeratedAt(Instant moderatedAt) {this.moderatedAt = moderatedAt;}

    public Integer getTemplateId() {
        return templateId;
    }
    public void setTemplateId(Integer templateId) {this.templateId = templateId;}

    public Categorie getCategorie() {
        return categorie;
    }

    public String getTitre() {
        return titre;
    }

    public String getDescriptionCourte() {
        return descriptionCourte;
    }

    public String getDescriptionLongue() {
        return descriptionLongue;
    }

    public NiveauPriorite getNiveauPriorite() {
        return niveauPriorite;
    }

    public ValidationStatus getValidationStatus() {
        return validationStatus;
    }
    public void setValidationStatus(ValidationStatus validationStatus) {this.validationStatus = validationStatus;}

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }
    public void setExpiresAt(Instant expiresAt) {this.expiresAt = expiresAt;}

    public Instant getEventDate() {
        return eventDate;
    }
}