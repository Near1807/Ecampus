package be.ecampus.ecampusbackend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.repository.UserRepository;
import be.ecampus.ecampusbackend.service.UserService;

/**
 * Crée le premier superadmin au démarrage, car son mot de passe doit être hashé
 * par le back-end (impossible depuis un simple INSERT SQL).
 *
 * Ne fait rien si les variables ne sont pas fournies ou si un SUPERADMIN existe déjà.
 * Variables : ECAMPUS_SUPERADMIN_MAIL, ECAMPUS_SUPERADMIN_PASSWORD,
 * ECAMPUS_SUPERADMIN_FIRSTNAME, ECAMPUS_SUPERADMIN_LASTNAME.
 */
@Component
public class SuperAdminBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SuperAdminBootstrap.class);

    private final UserRepository userRepository;
    private final UserService userService;
    private final String mail;
    private final String password;
    private final String firstname;
    private final String lastname;

    public SuperAdminBootstrap(UserRepository userRepository,
                               UserService userService,
                               @Value("${ecampus.bootstrap.superadmin.mail:}") String mail,
                               @Value("${ecampus.bootstrap.superadmin.password:}") String password,
                               @Value("${ecampus.bootstrap.superadmin.firstname:Super}") String firstname,
                               @Value("${ecampus.bootstrap.superadmin.lastname:Admin}") String lastname) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.mail = mail;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByRole(UserRole.SUPERADMIN)) {
            return;
        }
        if (mail.isBlank() || password.isBlank()) {
            log.warn("Aucun SUPERADMIN en base et ECAMPUS_SUPERADMIN_MAIL / _PASSWORD non définis : "
                    + "aucun compte d'administration ne sera créé.");
            return;
        }
        if (password.length() < 8 || password.length() > 72) {
            log.error("ECAMPUS_SUPERADMIN_PASSWORD doit contenir entre 8 et 72 caractères : superadmin non créé.");
            return;
        }
        if (userRepository.existsByMailIgnoreCase(mail.trim())) {
            log.error("Un compte existe déjà avec le mail du superadmin : superadmin non créé.");
            return;
        }
        userService.newUser(firstname, lastname, mail, password, UserRole.SUPERADMIN, null);
        log.info("Premier SUPERADMIN créé.");
    }
}
