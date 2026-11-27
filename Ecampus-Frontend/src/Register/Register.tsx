import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { Card } from "../components/Card.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Input } from "../components/Input.tsx";
import { Body, Label, Small, Title } from "../components/Typography.tsx";
import { Logo } from "../components/Logo.tsx";

/** Minimum password length. Team convention, to be aligned with the back-end validation. */
const PASSWORD_MIN_LENGTH = 8;

/** Maximum length of the name and mail columns. Provisional value, to be checked in the SQL schema. */
const FIELD_MAX_LENGTH = 255;

/** Content of the registration form. */
interface RegisterForm {
    firstname: string;
    lastname: string;
    mail: string;
    password: string;
    passwordConfirmation: string;
}

const EMPTY_FORM: RegisterForm = {
    firstname: "",
    lastname: "",
    mail: "",
    password: "",
    passwordConfirmation: "",
};

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
 * Brand block shown above the cards of the authentication pages: a tape pin and the logo.
 *
 * @returns The pin and the logo, centered.
 */
function AuthHeader() {
    return (
        <div className="flex flex-col items-center gap-3">
            <div
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-hover shadow-lg ring-4 ring-background/60"
            >
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/80" />
            </div>
            <Logo size="lg" />
        </div>
    );
}

/**
 * Registration page. The role and the status of the account are never sent:
 * the back-end decides them, otherwise a user could give himself the admin role.
 * Starting point: nothing is sent to the back-end yet.
 *
 * @returns The registration form, or a confirmation once it has been accepted.
 */
export function Register() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    function update(change: Partial<RegisterForm>) {
        setForm({ ...form, ...change });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const firstname = form.firstname.trim();
        const lastname = form.lastname.trim();
        const mail = form.mail.trim();

        if (firstname === "" || lastname === "" || mail === "" || form.password === "") {
            setError("Tous les champs sont obligatoires.");
            return;
        }
        if (!looksLikeMail(mail)) {
            setError("L'adresse mail n'est pas valide.");
            return;
        }
        if (form.password.length < PASSWORD_MIN_LENGTH) {
            setError("Le mot de passe doit faire au moins " + PASSWORD_MIN_LENGTH + " caractères.");
            return;
        }
        if (form.password !== form.passwordConfirmation) {
            setError("Les deux mots de passe sont différents.");
            return;
        }

        // TODO: send { firstname, lastname, mail, password } to POST /api/auth/register
        // once the contract exists. The back-end hashes the password; it is never stored as is.
        setError("");
        setDone(true);
    }

    if (done) {
        return (
            <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-6">
                <AuthHeader />
                <Card variant="dark" taped>
                    <Title>Compte créé</Title>
                    <Body color="muted">Ton compte a bien été créé. Tu peux maintenant te connecter.</Body>
                    <Link to="/login" className="underline">
                        Aller à la connexion
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 p-6">
            <div className="flex flex-col items-center gap-3">
                <div
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-hover shadow-lg ring-4 ring-background/60"
                >
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/80" />
                </div>
                <Logo size="lg" />
            </div>
            <Card variant="dark" taped>
                <Title>Créer un compte</Title>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Prénom</Label>
                        <Input
                            label="Prénom"
                            placeholder="Ada"
                            maxLength={FIELD_MAX_LENGTH}
                            value={form.firstname}
                            onChange={(firstname) => update({ firstname })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Nom</Label>
                        <Input
                            label="Nom"
                            placeholder="Lovelace"
                            maxLength={FIELD_MAX_LENGTH}
                            value={form.lastname}
                            onChange={(lastname) => update({ lastname })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Adresse mail</Label>
                        <Input
                            label="Adresse mail"
                            type="email"
                            placeholder="ada@exemple.be"
                            maxLength={FIELD_MAX_LENGTH}
                            value={form.mail}
                            onChange={(mail) => update({ mail })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Mot de passe</Label>
                        <Input
                            label="Mot de passe"
                            type="password"
                            placeholder={PASSWORD_MIN_LENGTH + " caractères minimum"}
                            value={form.password}
                            onChange={(password) => update({ password })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Confirmer le mot de passe</Label>
                        <Input
                            label="Confirmer le mot de passe"
                            type="password"
                            value={form.passwordConfirmation}
                            onChange={(passwordConfirmation) => update({ passwordConfirmation })}
                        />
                    </div>

                    {error !== "" && <ErrorMessage>{error}</ErrorMessage>}

                    <Button type="submit" icon="person_add">
                        Créer mon compte
                    </Button>
                </form>
                <Small color="muted">
                    Déjà un compte ?{" "}
                    <Link to="/login" className="underline">
                        Se connecter
                    </Link>
                </Small>
            </Card>
        </div>
    );
}