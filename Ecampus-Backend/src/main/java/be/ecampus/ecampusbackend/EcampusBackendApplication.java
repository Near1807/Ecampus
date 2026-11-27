package be.ecampus.ecampusbackend;

import be.ecampus.ecampusbackend.service.EmailService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EcampusBackendApplication {

    @Bean
    public CommandLineRunner testEmail(EmailService emailService) {
        return args -> {
            try {
                emailService.sendEmail(
                        "23230@ecam.be",
                        "TEST Envoie de mail",
                        "Je t'envoie ce mail pour tester l'envoi de mail de eCampus."
                );
                System.out.println("Mail de test envoye.");
            } catch (Exception e) {
                // Ne pas faire planter l'application si l'envoi echoue
                System.err.println("Echec de l'envoi du mail de test : " + e.getMessage());
            }
        };
    }

    public static void main(String[] args) {

        //System.out.println("MAIL_USERNAME = " + System.getenv("MAIL_USERNAME"));
        //System.out.println("MAIL_PASSWORD = " + (System.getenv("MAIL_PASSWORD") != null ? "présent" : "absent"));
        // System.out.println("Je suis un BG ");
        //System.out.println("JE suis le GOAT Steve le BG");
        SpringApplication.run(EcampusBackendApplication.class, args);

    }

}
