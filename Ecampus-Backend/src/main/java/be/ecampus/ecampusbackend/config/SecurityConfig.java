package be.ecampus.ecampusbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

/**
 * Configuration de sécurité de l'API REST.
 *
 * - API sans état (stateless) : pas de session HTTP, pas de cookie de session.
 * - CSRF désactivé : inutile sans session ni cookie d'authentification.
 * - Pas de formulaire de login ni de HTTP Basic : le mécanisme d'authentification
 *   (Supabase Auth / JWT, ou login Spring) reste à brancher.
 * - Une requête non authentifiée sur une route protégée reçoit un 401 (sans redirection).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /** Routes accessibles sans authentification. */
    private static final String[] PUBLIC_ROUTES = {
            "/api/health",
            "/error"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ROUTES).permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

        return http.build();
    }
}
