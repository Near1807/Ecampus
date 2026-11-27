package be.ecampus.ecampusbackend.service;

import java.util.Locale;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.ecampus.ecampusbackend.dto.UserDtos.ChangePasswordRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.CreateUserRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.PageResponse;
import be.ecampus.ecampusbackend.dto.UserDtos.RegisterRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.UpdateProfileRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.UserResponse;
import be.ecampus.ecampusbackend.exception.ApiException;
import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.UserStatus;
import be.ecampus.ecampusbackend.repository.UserRepository;

/**
 * Logique métier des utilisateurs.
 *
 * Règles appliquées :
 * - Inscription libre : rôle USER, aucun créateur.
 * - Un ADMIN crée des comptes USER ; un SUPERADMIN crée des comptes de n'importe quel rôle.
 * - Le créateur est enregistré dans created_by_id.
 * - Un ADMIN ne gère que des comptes USER.
 * - Seul un SUPERADMIN change un rôle.
 * - Personne ne change son propre rôle ni son propre statut.
 * - Mail unique sans distinction de casse : il est stocké en minuscules.
 * - Pas de suppression : on bloque un compte au lieu de le supprimer.
 *
 * Le rôle de l'acteur est relu en base à chaque requête.
 */
@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Charge l'utilisateur authentifié. */
    public User currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentification requise"
            );
        }

        User user = userRepository.findByMailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ApiException(
                        HttpStatus.UNAUTHORIZED,
                        "Utilisateur inconnu"
                ));

        if (!user.isActive()) {
            throw ApiException.forbidden("Compte bloqué");
        }

        return user;
    }

    public UserResponse getMe(Authentication authentication) {
        return UserResponse.from(currentUser(authentication));
    }

    @Transactional
    public UserResponse updateMe(
            Authentication authentication,
            UpdateProfileRequest request) {

        User me = currentUser(authentication);

        me.setFirstname(request.firstname().trim());
        me.setLastname(request.lastname().trim());

        return UserResponse.from(me);
    }

    @Transactional
    public void changePassword(
            Authentication authentication,
            ChangePasswordRequest request) {

        User me = currentUser(authentication);

        if (!passwordEncoder.matches(
                request.currentPassword(),
                me.getPasswordHash())) {
            throw ApiException.badRequest(
                    "Mot de passe actuel incorrect"
            );
        }

        if (passwordEncoder.matches(
                request.newPassword(),
                me.getPasswordHash())) {
            throw ApiException.badRequest(
                    "Le nouveau mot de passe doit être différent de l'actuel"
            );
        }

        me.setPasswordHash(
                passwordEncoder.encode(request.newPassword())
        );
    }

    // ----------------------------------------------------------------
    // Création de comptes
    // ----------------------------------------------------------------

    /** Inscription libre (route publique). */
    @Transactional
    public UserResponse register(RegisterRequest request) {

        User user = newUser(
                request.firstname(),
                request.lastname(),
                request.mail(),
                request.password(),
                UserRole.USER,
                null
        );

        return UserResponse.from(user);
    }

    /** Création d'un compte par un ADMIN ou un SUPERADMIN. */
    @Transactional
    public UserResponse createByAdmin(
            Authentication authentication,
            CreateUserRequest request) {

        User actor = requireAdmin(authentication);

        UserRole role = request.role() != null
                ? request.role()
                : UserRole.USER;

        if (actor.getRole() == UserRole.ADMIN
                && role != UserRole.USER) {
            throw ApiException.forbidden(
                    "Un ADMIN ne peut créer que des comptes USER"
            );
        }

        User user = newUser(
                request.firstname(),
                request.lastname(),
                request.mail(),
                request.password(),
                role,
                actor
        );

        return UserResponse.from(user);
    }

    /**
     * Crée et enregistre un compte.
     * Utilisé aussi par le bootstrap du premier superadmin.
     */
    @Transactional
    public User newUser(
            String firstname,
            String lastname,
            String mail,
            String rawPassword,
            UserRole role,
            User creator) {

        String normalizedMail = normalizeMail(mail);

        if (userRepository.existsByMailIgnoreCase(normalizedMail)) {
            throw ApiException.conflict(
                    "Un compte existe déjà avec ce mail"
            );
        }

        // Encode le mot de passe avant de créer l'utilisateur.
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Utilise le constructeur public du modèle User.
        User user = new User(
                firstname.trim(),
                lastname.trim(),
                normalizedMail,
                encodedPassword
        );

        user.setRole(role);
        user.setStatus(UserStatus.ACTIF);
        user.setTwoFactorEnabled(false);
        user.setCreatedBy(creator);

        return userRepository.save(user);
    }

    // ----------------------------------------------------------------
    // Consultation
    // ----------------------------------------------------------------

    /** Un utilisateur voit son propre compte ; un ADMIN/SUPERADMIN voit tous les comptes. */
    public UserResponse getById(
            Authentication authentication,
            UUID id) {

        User actor = currentUser(authentication);

        if (!actor.isAdmin() && !actor.getId().equals(id)) {
            throw ApiException.forbidden("Accès refusé");
        }

        return UserResponse.from(findOrThrow(id));
    }

    public PageResponse<UserResponse> search(
            Authentication authentication,
            UserRole role,
            UserStatus status,
            String query,
            Pageable pageable) {

        requireAdmin(authentication);

        return PageResponse.from(
                userRepository.search(
                        role,
                        status,
                        toLikePattern(query),
                        pageable
                ).map(UserResponse::from)
        );
    }

    // ----------------------------------------------------------------
    // Administration
    // ----------------------------------------------------------------

    /** Seul un SUPERADMIN change un rôle, jamais le sien. */
    @Transactional
    public UserResponse updateRole(
            Authentication authentication,
            UUID id,
            UserRole role) {

        User actor = currentUser(authentication);

        if (actor.getRole() != UserRole.SUPERADMIN) {
            throw ApiException.forbidden(
                    "Seul un SUPERADMIN peut changer un rôle"
            );
        }

        User target = findOrThrow(id);

        if (target.getId().equals(actor.getId())) {
            throw ApiException.forbidden(
                    "Impossible de changer son propre rôle"
            );
        }

        target.setRole(role);

        return UserResponse.from(target);
    }

    /** Bloquer / débloquer un compte. */
    @Transactional
    public UserResponse updateStatus(
            Authentication authentication,
            UUID id,
            UserStatus status) {

        User actor = requireAdmin(authentication);
        User target = findOrThrow(id);

        if (target.getId().equals(actor.getId())) {
            throw ApiException.forbidden(
                    "Impossible de changer son propre statut"
            );
        }

        if (actor.getRole() == UserRole.ADMIN
                && target.getRole() != UserRole.USER) {
            throw ApiException.forbidden(
                    "Un ADMIN ne peut gérer que des comptes USER"
            );
        }

        target.setStatus(status);

        return UserResponse.from(target);
    }

    // ----------------------------------------------------------------
    // Utilitaires
    // ----------------------------------------------------------------

    private User requireAdmin(Authentication authentication) {

        User actor = currentUser(authentication);

        if (!actor.isAdmin()) {
            throw ApiException.forbidden(
                    "Réservé aux ADMIN et SUPERADMIN"
            );
        }

        return actor;
    }

    private User findOrThrow(UUID id) {

        return userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound(
                        "Utilisateur introuvable"
                ));
    }

    static String normalizeMail(String mail) {
        return mail.trim().toLowerCase(Locale.ROOT);
    }

    /**
     * Retourne "%texte%" en minuscules,
     * avec %, _ et \ échappés.
     */
    static String toLikePattern(String query) {

        if (query == null || query.isBlank()) {
            return "%";
        }

        String escaped = query.trim()
                .toLowerCase(Locale.ROOT)
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");

        return "%" + escaped + "%";
    }
}
