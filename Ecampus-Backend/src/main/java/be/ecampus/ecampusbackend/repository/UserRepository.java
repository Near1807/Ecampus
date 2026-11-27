package be.ecampus.ecampusbackend.repository;

import java.util.Optional;
import java.util.UUID;
<<<<<<< HEAD

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.UserStatus;
=======
>>>>>>> origin/main

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import be.ecampus.ecampusbackend.model.User;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.UserStatus;

public interface UserRepository extends JpaRepository<User, UUID> {

<<<<<<< HEAD
    /** Find a user by email, ignoring case. */
    @Query("select u from User u where lower(u.mail) = lower(:mail)")
    Optional<User> findByMailIgnoreCase(@Param("mail") String mail);

    /** Check whether an email already exists, ignoring case. */
=======
    /** Le mail est unique sans distinction de casse (index sur lower(mail)). */
    @Query("select u from User u where lower(u.mail) = lower(:mail)")
    Optional<User> findByMailIgnoreCase(@Param("mail") String mail);

>>>>>>> origin/main
    @Query("select count(u) > 0 from User u where lower(u.mail) = lower(:mail)")
    boolean existsByMailIgnoreCase(@Param("mail") String mail);

    boolean existsByRole(UserRole role);

    /**
<<<<<<< HEAD
     * Paginated search.
     * Role and status are optional (null means no filter).
     * Pattern must be lowercase, escaped and surrounded by '%'.
=======
     * - Recherche paginée. role et status sont facultatifs (null = pas de filtre).
     * - pattern est déjà en minuscules, échappé et entouré de '%' (au minimum "%").
>>>>>>> origin/main
     */
    @Query("""
            select u from User u
            where (:role is null or u.role = :role)
              and (:status is null or u.status = :status)
              and (lower(u.mail) like :pattern escape '\\'
                   or lower(u.firstname) like :pattern escape '\\'
                   or lower(u.lastname) like :pattern escape '\\')
            """)
    Page<User> search(@Param("role") UserRole role,
                      @Param("status") UserStatus status,
                      @Param("pattern") String pattern,
                      Pageable pageable);
}
