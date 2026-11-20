package be.ecampus.ecampusbackend.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.repository.UserRepository;

/**
 * Pont entre la table users et Spring Security, quel que soit le mécanisme
 * d'authentification branché ensuite (login + JWT, HTTP Basic...).
 * - username = mail
 * - autorité = ROLE_USER / ROLE_ADMIN / ROLE_SUPERADMIN (pour hasRole(...))
 * - un compte BLOQUE est refusé à la connexion (accountLocked)
 */
@Service
public class EcampusUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public EcampusUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String mail) {
        User user = userRepository.findByMailIgnoreCase(mail)
                .orElseThrow(() -> new UsernameNotFoundException("Identifiants invalides"));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getMail())
                .password(user.getPasswordHash())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .accountLocked(!user.isActive())
                .build();
    }
}
