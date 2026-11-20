package be.ecampus.ecampusbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * Display template an announcement can use. The template itself is front-end
 * code; the database only keeps a stable code that the front maps to it.
 */
@Entity
@Table(name = "templates")
public class Template {

    // The database generates the id (IDENTITY column), so JPA must not invent one.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50, unique = true)
    private String code;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false)
    private boolean actif = true;

    // Filled by the database default, never written by Java.
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected Template() {
    }
    /**
     * Creates an active template.
     *
     * @param code stable identifier that the front-end maps to a component, unique
     * @param nom  display name shown to administrators
     */
    public Template(String code, String nom) {
        this.code = code;
        this.nom = nom;
    }

    public Integer getId() { return id; }
    public String getCode() { return code; }
    public String getNom() { return nom; }
    public boolean isActif() { return actif; }
    public Instant getCreatedAt() { return createdAt; }
    public void deactivate() {
        this.actif = false;
    }
}


