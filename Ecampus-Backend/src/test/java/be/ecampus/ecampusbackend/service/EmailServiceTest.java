package be.ecampus.ecampusbackend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    private static final String FROM = "no-reply@ecampus.local";

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        // @InjectMocks ne sait pas injecter le String "from", on construit donc le service a la main
        emailService = new EmailService(mailSender, FROM);
    }

    @Test
    void sendsEmailWithCorrectFields() {
        // Arrange
        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        // Act
        emailService.sendEmail("etudiant@ecam.be", "Sujet de test", "Contenu du mail");

        // Assert
        verify(mailSender, times(1)).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();

        assertEquals(FROM, sent.getFrom());
        assertArrayEquals(new String[]{"etudiant@ecam.be"}, sent.getTo());
        assertEquals("Sujet de test", sent.getSubject());
        assertEquals("Contenu du mail", sent.getText());
    }

    @Test
    void sendsExactlyOneMessagePerCall() {
        // Act
        emailService.sendEmail("a@ecam.be", "S1", "T1");
        emailService.sendEmail("b@ecam.be", "S2", "T2");

        // Assert
        verify(mailSender, times(2)).send(any(SimpleMailMessage.class));
        verifyNoMoreInteractions(mailSender);
    }

    @Test
    void propagatesExceptionWhenSendingFails() {
        // Arrange
        doThrow(new MailSendException("SMTP indisponible"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        // Act + Assert
        MailSendException ex = assertThrows(MailSendException.class,
                () -> emailService.sendEmail("etudiant@ecam.be", "Sujet", "Texte"));
        assertEquals("SMTP indisponible", ex.getMessage());
    }
}
