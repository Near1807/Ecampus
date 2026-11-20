package be.ecampus.ecampusbackend.model;

/** State of a user account. The names must match the CHECK constraint in the database. */
public enum UserStatus {
    ACTIF,
    BLOQUE
}