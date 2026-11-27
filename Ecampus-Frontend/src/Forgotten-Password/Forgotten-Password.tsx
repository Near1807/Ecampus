import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "../components/AuthHeader.tsx";
import { Button } from "../components/Button.tsx";
import { Card } from "../components/Card.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Input } from "../components/Input.tsx";
import { Body, Label, Small, Title } from "../components/Typography.tsx";

/** Maximum length of the mail column. Provisional value, to be checked in the SQL schema. */
const MAIL_MAX_LENGTH = 255;

/**
 * Basic shape check of an e-mail address. It only catches obvious typos:
 * the real verification is done by the back-end.
 *
 * @param mail - The text typed by the user.
 * @returns True if the text looks like an e-mail address.
 */
function looksLikeMail(mail: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}

/**
 * Password recovery request page: asks for the e-mail address of the account.
 * The confirmation is the same whether the address exists or not, so that nobody can
 * use this page to find out which addresses have an account.
 * Starting point: nothing is sent to the back-end yet.
 *
 * @returns The form, or the confirmation once the request has been sent.
 */
export function ForgotPassword() {
    const [mail, setMail] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const cleanMail = mail.trim();
        if (!looksLikeMail(cleanMail)) {
            setError("L'adresse mail n'est pas valide.");
            return;
        }

        // TODO: send { mail: cleanMail } to POST /api/auth/forgot-password once the contract exists.
        // The back-end creates a one-time link and e-mails it; its answer is the same for every address.
        setError("");
        setSent(true);
    }

    return (
        <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-6">
            <AuthHeader />
            <Card variant="dark" taped>
                <Title>Mot de passe oublié</Title>
                {sent ? (
                    <>
                        <Body color="muted">
                            Si cette adresse correspond à un compte, un mail vient d'être envoyé avec un lien pour
                            choisir un nouveau mot de passe.
                        </Body>
                        <Link to="/login" className="underline">
                            Retour à la connexion
                        </Link>
                    </>
                ) : (
                    <>
                        <Body color="muted">
                            Indique l'adresse mail de ton compte. Tu recevras un lien pour choisir un nouveau mot de
                            passe.
                        </Body>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                            <div className="flex flex-col gap-1.5">
                                <Label color="muted">Adresse mail</Label>
                                <Input
                                    label="Adresse mail"
                                    type="email"
                                    placeholder="ada@exemple.be"
                                    maxLength={MAIL_MAX_LENGTH}
                                    value={mail}
                                    onChange={setMail}
                                />
                            </div>

                            {error !== "" && <ErrorMessage>{error}</ErrorMessage>}

                            <Button type="submit" icon="mail">
                                Envoyer le lien
                            </Button>
                        </form>
                        <Small color="muted">
                            <Link to="/login" className="underline">
                                Retour à la connexion
                            </Link>
                        </Small>
                    </>
                )}
            </Card>
        </div>
    );
}