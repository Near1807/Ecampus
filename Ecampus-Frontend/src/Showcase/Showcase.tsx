import { useState } from "react";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { Input } from "../components/Input.tsx";
import { Body, Display, Label, Small, Subtitle, Title } from "../components/Typography.tsx";
import {Card} from "../components/Card.tsx";

/**
 * Development page that shows every shared component with its main options.
 * It is a visual reference for the team and a quick way to check the design: it is not a page of the application.
 *
 * @returns The page listing the shared components.
 */
export function Showcase() {
    const [query, setQuery] = useState("");
    const [password, setPassword] = useState("");
    const [clicks, setClicks] = useState(0);

    function handleClick() {
        setClicks(clicks + 1);
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-12 p-10">
            <section className="flex flex-col gap-4">
                <Label color="primary">Typographie</Label>
                <Display>Display : E-CAMpus</Display>
                <Title>Title : titre de page</Title>
                <Subtitle>Subtitle : titre de section</Subtitle>
                <Body>Body : paragraphe de description.</Body>
                <Small color="muted">Small : texte secondaire</Small>
                <Label color="primary">Label : métadonnée</Label>
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">Button</Label>
                <div className="flex flex-wrap items-center gap-4">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button icon="check">Avec icône</Button>
                    <Button disabled>Désactivé</Button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                </div>
                <Button fullWidth>Pleine largeur</Button>
                <div className="flex items-center gap-4">
                    <Button onClick={handleClick}>Cliquer</Button>
                    <Small color="muted">Clics : {clicks}</Small>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">IconButton</Label>
                <div className="flex items-center gap-4">
                    <IconButton icon="person" label="Mon compte" />
                    <IconButton icon="arrow_upward" label="Envoyer" variant="primary" />
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">Icon</Label>
                <div className="flex items-center gap-4 text-primary">
                    <Icon name="check" />
                    <Icon name="check" size="lg" />
                </div>
            </section>

            <section className="flex max-w-md flex-col gap-4">
                <Label color="primary">Input</Label>
                <Input
                    label="Rechercher une annonce"
                    icon="search"
                    placeholder="Rechercher une annonce..."
                    value={query}
                    onChange={setQuery}
                />
                <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="Mot de passe"
                    autoComplete="current-password"
                    value={password}
                    onChange={setPassword}
                />
                <Small color="muted">Recherche tapée : {query}</Small>
            </section>
            <section className="flex flex-col gap-4">
                <Label color="primary">Card</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <Label>Objets trouvés</Label>
                        <Subtitle>Clé USB noire trouvée</Subtitle>
                        <Body>Déposée à l'accueil du bâtiment B.</Body>
                    </Card>
                    <Card variant="dark">
                        <Subtitle>Connexion</Subtitle>
                        <Body>Panneau sombre, pour un formulaire.</Body>
                    </Card>
                    <Card variant="accent">
                        <Display>Hackathon 48H</Display>
                        <Label>Jeudi 20 novembre</Label>
                    </Card>
                    <Card variant="blueprint">
                        <Display>Afterwork</Display>
                        <Label>Cafétéria principale</Label>
                    </Card>
                    <Card variant="transparent">
                        <Subtitle>Transparente</Subtitle>
                        <Body>Aucun fond : on voit celui de la page.</Body>
                    </Card>
                </div>
            </section>
        </div>

    );
}