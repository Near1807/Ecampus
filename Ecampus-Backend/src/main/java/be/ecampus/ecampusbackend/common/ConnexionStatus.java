package be.ecampus.ecampusbackend.model;

/** Outcome of a login event. The names must match the CHECK constraint in the database. */
public enum ConnexionStatus {
    REUSSIE,
    ECHOUEE,
    DECONNECTE
}