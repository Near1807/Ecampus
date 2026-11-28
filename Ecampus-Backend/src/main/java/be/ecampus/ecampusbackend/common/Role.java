package be.ecampus.ecampusbackend.model;

/** Access level of a user. The names must match the CHECK constraint in the database. */
public enum Role {
    USER,
    ADMIN,
    SUPERADMIN
}