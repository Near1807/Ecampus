package be.ecampus.ecampusbackend.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;

import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Objets échangés par l'API /api/users.
 * Le hash du mot de passe et le secret 2FA ne sortent jamais : UserResponse ne les contient pas.
 * Mot de passe : 8 à 72 caractères (72 = limite de bcrypt).
 */
public final class UserDtos {

    private UserDtos() {
    }

    /** Inscription libre : le compte créé a toujours le rôle USER et aucun créateur. */
    public record RegisterRequest(
            @NotBlank @Size(max = 100) String firstname,
            @NotBlank @Size(max = 100) String lastname,
            @NotBlank @Email @Size(max = 255) String mail,
            @NotBlank @Size(min = 8, max = 72) String password) {
    }

    /** Création d'un compte par un ADMIN ou un SUPERADMIN. role absent = USER. */
    public record CreateUserRequest(
            @NotBlank @Size(max = 100) String firstname,
            @NotBlank @Size(max = 100) String lastname,
            @NotBlank @Email @Size(max = 255) String mail,
            @NotBlank @Size(min = 8, max = 72) String password,
            UserRole role) {
    }

    /** Modification de son propre profil. Le mail, le rôle et le statut ne passent pas par ici. */
    public record UpdateProfileRequest(
            @NotBlank @Size(max = 100) String firstname,
            @NotBlank @Size(max = 100) String lastname) {
    }

    public record ChangePasswordRequest(
            @NotBlank String currentPassword,
            @NotBlank @Size(min = 8, max = 72) String newPassword) {
    }

    public record UpdateRoleRequest(@NotNull UserRole role) {
    }

    public record UpdateStatusRequest(@NotNull UserStatus status) {
    }

    public record UserResponse(
            UUID id,
            String firstname,
            String lastname,
            String mail,
            UserRole role,
            UserStatus status,
            boolean twoFactorEnabled,
            UUID createdById,
            OffsetDateTime createdAt) {

        public static UserResponse from(User user) {
            // getId() sur un proxy LAZY ne déclenche pas de requête.
            UUID createdById = user.getCreatedBy() != null ? user.getCreatedBy().getId() : null;
            return new UserResponse(
                    user.getId(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getMail(),
                    user.getRole(),
                    user.getStatus(),
                    user.isTwoFactorEnabled(),
                    createdById,
                    user.getCreatedAt());
        }
    }

    /** Page stable pour le front (la sérialisation directe de Page n'est pas garantie). */
    public record PageResponse<T>(
            List<T> content,
            int page,
            int size,
            long totalElements,
            int totalPages) {

        public static <T> PageResponse<T> from(Page<T> page) {
            return new PageResponse<>(
                    page.getContent(),
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements(),
                    page.getTotalPages());
        }
    }
}
