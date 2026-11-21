import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../components/Button.tsx";
import { Card } from "../components/Card.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Input } from "../components/Input.tsx";
import { Logo } from "../components/Logo.tsx";
import { TextLink } from "../components/TextLink.tsx";
import { Label, Small, Title } from "../components/Typography.tsx";

/**
 * Login page: logo and a card with the e-mail and password fields.
 * Visual only for now: submitting the form does not call the back-end yet.
 *
 * @returns The full-screen login page (no navbar).
 */
export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Handles the submission of the login form. Temporary: it always shows the error banner,
     * to preview its look until the call to the back-end is written.
     *
     * @param event - Submit event of the form.
     */
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("Adresse e-mail ou mot de passe incorrect");
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light bg-[radial-gradient(var(--color-foreground)_1px,transparent_1px)] [background-size:24px_24px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-mustard/5 blur-3xl"
            />

            <main className="relative z-10 flex w-full max-w-[520px] flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-3">
                    <div
                        aria-hidden="true"
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-hover shadow-lg ring-4 ring-background/60"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-foreground/80" />
                    </div>
                    <Logo size="lg" />
                </div>

                <div className="w-full">
                    <Card variant="dark" taped>
                        <form className="flex flex-col gap-5 p-2 sm:p-4" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-0.5">
                                <Title>Connexion</Title>
                                <Label color="muted">Accès réservé communauté ECAM Brussels</Label>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label color="muted">Adresse e-mail</Label>
                                    <Label color="muted">@ecam.be</Label>
                                </div>
                                <Input
                                    label="Adresse e-mail"
                                    type="email"
                                    icon="alternate_email"
                                    autoComplete="email"
                                    required
                                    placeholder="prenom.nom@ecam.be"
                                    value={email}
                                    onChange={setEmail}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label color="muted">Mot de passe</Label>
                                    <TextLink href="#">Mot de passe oublié ?</TextLink>
                                </div>
                                <Input
                                    label="Mot de passe"
                                    type="password"
                                    icon="lock"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={setPassword}
                                />
                            </div>

                            {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

                            <Button type="submit" size="lg" fullWidth>
                                Se connecter
                            </Button>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-foreground/15" />
                                <Label color="muted">ou</Label>
                                <div className="h-px flex-1 bg-foreground/15" />
                            </div>

                            <div className="text-center">
                                <Small color="muted">
                                    Pas encore de compte ? <TextLink href="#">Créer un compte</TextLink>
                                </Small>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
        </div>
    );
}