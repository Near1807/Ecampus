package be.ecampus.ecampusbackend.repository;

import be.ecampus.ecampusbackend.model.User;

public final class UserTestFactory {

    private UserTestFactory() {
    }

    public static User createUser(
            String firstname,
            String lastname,
            String mail
    ) {
        return new User(firstname, lastname, mail, "hash");
    }
}
