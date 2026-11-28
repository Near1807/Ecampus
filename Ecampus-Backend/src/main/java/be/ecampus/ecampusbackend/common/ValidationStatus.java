package be.ecampus.ecampusbackend.model;

/** Moderation state of an announcement. The names must match the CHECK constraint in the database. */
public enum ValidationStatus {
    EN_ATTENTE,
    VALIDE,
    DECLINE
}