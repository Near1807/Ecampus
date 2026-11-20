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
 * Metadata of an image of an announcement. The file itself lives in a Supabase
 * Storage bucket; storagePath is the only link to it.
 */
@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "annonce_id", nullable = false)
    private UUID annonceId;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Image() {
    }

    /**
     * Creates the record of an image already stored in the bucket.
     *
     * @param annonceId   id of the announcement the image belongs to
     * @param storagePath path of the file in the bucket, unique
     */
    public Image(UUID annonceId, String storagePath) {
        this.annonceId = annonceId;
        this.storagePath = storagePath;
    }

    public UUID getId() {
        return id;
    }

    public UUID getAnnonceId() {
        return annonceId;
    }

    public String getStoragePath() {
        return storagePath;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}