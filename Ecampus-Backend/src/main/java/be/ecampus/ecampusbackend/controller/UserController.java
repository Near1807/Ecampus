package be.ecampus.ecampusbackend.controller;

import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import be.ecampus.ecampusbackend.dto.UserDtos.ChangePasswordRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.CreateUserRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.PageResponse;
import be.ecampus.ecampusbackend.dto.UserDtos.RegisterRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.UpdateProfileRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.UpdateRoleRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.UpdateStatusRequest;
import be.ecampus.ecampusbackend.dto.UserDtos.UserResponse;
import be.ecampus.ecampusbackend.model.UserRole;
import be.ecampus.ecampusbackend.model.UserStatus;
import be.ecampus.ecampusbackend.service.UserService;
import jakarta.validation.Valid;

/**
 * Routes /api/users.
 *
 * | Méthode | Route                        | Accès                        |
 * |---------|------------------------------|------------------------------|
 * | POST    | /api/users/register          | public (inscription libre)   |
 * | GET     | /api/users/me                | connecté                     |
 * | PATCH   | /api/users/me                | connecté                     |
 * | PUT     | /api/users/me/password       | connecté                     |
 * | GET     | /api/users                   | ADMIN, SUPERADMIN            |
 * | POST    | /api/users                   | ADMIN (USER), SUPERADMIN     |
 * | GET     | /api/users/{id}              | soi-même, ADMIN, SUPERADMIN  |
 * | PATCH   | /api/users/{id}/status       | ADMIN (sur USER), SUPERADMIN |
 * | PATCH   | /api/users/{id}/role         | SUPERADMIN                   |
 *
 * Les @PreAuthorize filtrent tôt sur le rôle du jeton ; le service revérifie
 * à partir du rôle stocké en base (source de vérité).
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final int MAX_PAGE_SIZE = 100;

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return userService.getMe(authentication);
    }

    @PatchMapping("/me")
    public UserResponse updateMe(Authentication authentication,
                                 @Valid @RequestBody UpdateProfileRequest request) {
        return userService.updateMe(authentication, request);
    }

    @PutMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(Authentication authentication,
                               @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public PageResponse<UserResponse> list(Authentication authentication,
                                           @RequestParam(required = false) UserRole role,
                                           @RequestParam(required = false) UserStatus status,
                                           @RequestParam(required = false) String q,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        PageRequest pageable = PageRequest.of(
                Math.max(page, 0),
                Math.clamp(size, 1, MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return userService.search(authentication, role, status, q, pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public UserResponse create(Authentication authentication,
                               @Valid @RequestBody CreateUserRequest request) {
        return userService.createByAdmin(authentication, request);
    }

    @GetMapping("/{id}")
    public UserResponse getById(Authentication authentication, @PathVariable UUID id) {
        return userService.getById(authentication, id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public UserResponse updateStatus(Authentication authentication, @PathVariable UUID id,
                                     @Valid @RequestBody UpdateStatusRequest request) {
        return userService.updateStatus(authentication, id, request.status());
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public UserResponse updateRole(Authentication authentication, @PathVariable UUID id,
                                   @Valid @RequestBody UpdateRoleRequest request) {
        return userService.updateRole(authentication, id, request.role());
    }
}
