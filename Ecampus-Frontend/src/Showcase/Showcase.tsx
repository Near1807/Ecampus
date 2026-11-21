import { useState, type ReactNode } from "react";
import { Button } from "../components/Button.tsx";
import { Card } from "../components/Card.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Icon } from "../components/Icon.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { Input } from "../components/Input.tsx";
import { Logo } from "../components/Logo.tsx";
import { TextLink } from "../components/TextLink.tsx";
import { Body, Display, Label, Small, Subtitle, Title } from "../components/Typography.tsx";

interface ExampleProps {
    /** The component and the props used to obtain the example, shown below it on demand. */
    code: string;
    children: ReactNode;
}

/**
 * Shows a component example with the props used to obtain it, hidden below and revealed on click.
 * Local to the Showcase page: it is not a shared component.
 *
 * @param props - The code text to display and the example itself.
 * @returns The example followed by a collapsible code line.
 */
function Example({ code, children }: ExampleProps) {
    return (
        <div className="flex flex-col gap-2">
            <div>{children}</div>
            <details>
                <summary className="cursor-pointer font-mono text-[12px] text-foreground/60 hover:text-foreground">
                    Code
                </summary>
                <code className="mt-1 block font-mono text-[12px] text-foreground/80">{code}</code>
            </details>
        </div>
    );
}

interface UsageProps {
    /** A complete usage of the component: opening tag with every prop, content, closing tag. */
    code: string;
}

/**
 * Shows the complete way to write a shared component: every prop it accepts with its possible values,
 * and where the text content goes. Local to the Showcase page: it is not a shared component.
 *
 * @param props - The usage text to display.
 * @returns A collapsible block containing the usage.
 */
function Usage({ code }: UsageProps) {
    return (
        <details>
            <summary className="cursor-pointer font-mono text-[12px] text-primary hover:text-primary-light">
                Usage complet
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-sm bg-panel p-4 font-mono text-[12px] text-foreground/80">
                {code}
            </pre>
        </details>
    );
}

/**
 * Development page that shows every shared component with its main options.
 * Each example hides the props used to obtain it, and each section hides the complete usage of the component,
 * so the page also works as a quick reference for the team.
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
                <Example code="<Display>">
                    <Display>E-CAMpus</Display>
                </Example>
                <Example code="<Title>">
                    <Title>Titre de page</Title>
                </Example>
                <Example code="<Subtitle>">
                    <Subtitle>Titre de section</Subtitle>
                </Example>
                <Example code="<Body>">
                    <Body>Paragraphe de description.</Body>
                </Example>
                <Example code={'<Small color="muted">'}>
                    <Small color="muted">Texte secondaire</Small>
                </Example>
                <Example code={'<Label color="primary">'}>
                    <Label color="primary">Métadonnée</Label>
                </Example>
                <Usage
                    code={`// Display, Title, Subtitle, Body, Small et Label s'écrivent tous de la même façon
<Body
    color="muted"    // facultatif : "muted" | "primary" | "ink"
>
    Texte affiché    // obligatoire : le contenu
</Body>`}
                />
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">Logo</Label>
                <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
                    <Example code={'<Logo size="sm" />'}>
                        <Logo size="sm" />
                    </Example>
                    <Example code={'<Logo size="lg" />'}>
                        <Logo size="lg" />
                    </Example>
                </div>
                <Usage
                    code={`<Logo
    size="lg"    // "sm" | "lg"
/>`}
                />
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">Button</Label>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                    <Example code="<Button>">
                        <Button>Primary</Button>
                    </Example>
                    <Example code={'<Button variant="secondary">'}>
                        <Button variant="secondary">Secondary</Button>
                    </Example>
                    <Example code={'<Button variant="ghost">'}>
                        <Button variant="ghost">Ghost</Button>
                    </Example>
                    <Example code={'<Button icon="check">'}>
                        <Button icon="check">Avec icône</Button>
                    </Example>
                    <Example code="<Button disabled>">
                        <Button disabled>Désactivé</Button>
                    </Example>
                </div>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                    <Example code={'<Button size="sm">'}>
                        <Button size="sm">Small</Button>
                    </Example>
                    <Example code={'<Button size="md">'}>
                        <Button size="md">Medium</Button>
                    </Example>
                    <Example code={'<Button size="lg">'}>
                        <Button size="lg">Large</Button>
                    </Example>
                </div>
                <Example code="<Button fullWidth>">
                    <Button fullWidth>Pleine largeur</Button>
                </Example>
                <Example code="<Button onClick={handleClick}>">
                    <div className="flex items-center gap-4">
                        <Button onClick={handleClick}>Cliquer</Button>
                        <Small color="muted">Clics : {clicks}</Small>
                    </div>
                </Example>
                <Usage
                    code={`<Button
    variant="primary"      // facultatif : "primary" | "secondary" | "ghost"
    size="md"              // facultatif : "sm" | "md" | "lg"
    icon="check"           // facultatif : nom d'une icône Material Symbols
    fullWidth              // facultatif : prend toute la largeur
    disabled               // facultatif : attribut HTML natif
    onClick={handleClick}  // facultatif : attribut HTML natif
>
    Texte du bouton        // obligatoire : le contenu
</Button>`}
                />
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">IconButton</Label>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
                    <Example code={'<IconButton icon="person" label="Mon compte" />'}>
                        <IconButton icon="person" label="Mon compte" />
                    </Example>
                    <Example code={'<IconButton icon="arrow_upward" label="Envoyer" variant="primary" />'}>
                        <IconButton icon="arrow_upward" label="Envoyer" variant="primary" />
                    </Example>
                </div>
                <Usage
                    code={`<IconButton
    icon="person"          // obligatoire : nom d'une icône Material Symbols
    label="Mon compte"     // obligatoire : texte lu par les lecteurs d'écran, affiché au survol
    variant="neutral"      // facultatif : "neutral" | "primary"
    disabled               // facultatif : attribut HTML natif
    onClick={handleClick}  // facultatif : attribut HTML natif
/>                         // pas de contenu entre les balises`}
                />
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">Icon</Label>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4 text-primary">
                    <Example code={'<Icon name="check" />'}>
                        <Icon name="check" />
                    </Example>
                    <Example code={'<Icon name="check" size="lg" />'}>
                        <Icon name="check" size="lg" />
                    </Example>
                </div>
                <Usage
                    code={`<Icon
    name="check"    // obligatoire : nom d'une icône Material Symbols
    size="md"       // facultatif : "md" | "lg"
/>                  // la couleur est héritée du parent`}
                />
            </section>

            <section className="flex max-w-md flex-col gap-4">
                <Label color="primary">Input</Label>
                <Example code={'<Input label icon="search" placeholder value onChange />'}>
                    <Input
                        label="Rechercher une annonce"
                        icon="search"
                        placeholder="Rechercher une annonce..."
                        value={query}
                        onChange={setQuery}
                    />
                </Example>
                <Example code={'<Input label type="password" autoComplete placeholder value onChange />'}>
                    <Input
                        label="Mot de passe"
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete="current-password"
                        value={password}
                        onChange={setPassword}
                    />
                </Example>
                <Small color="muted">Recherche tapée : {query}</Small>
                <Usage
                    code={`<Input
    label="Mot de passe"              // obligatoire : nom du champ, lu par les lecteurs d'écran
    value={password}                  // obligatoire : le texte actuel, stocké dans un state
    onChange={setPassword}            // obligatoire : reçoit le nouveau texte à chaque frappe
    type="password"                   // facultatif : attribut HTML natif
    placeholder="Texte d'aide"        // facultatif : attribut HTML natif
    icon="lock"                       // facultatif : icône à gauche du champ
    autoComplete="current-password"   // facultatif : attribut HTML natif
    disabled                          // facultatif : attribut HTML natif
/>                                    // pas de contenu entre les balises`}
                />
            </section>

            <section className="flex max-w-md flex-col gap-4">
                <Label color="primary">ErrorMessage</Label>
                <Example code="<ErrorMessage>">
                    <ErrorMessage>Email ou mot de passe incorrect.</ErrorMessage>
                </Example>
                <Usage
                    code={`<ErrorMessage>
    Texte de l'erreur    // obligatoire : le contenu
</ErrorMessage>`}
                />
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">TextLink</Label>
                <Example code={'<TextLink href="#">'}>
                    <TextLink href="#">Mot de passe oublié ?</TextLink>
                </Example>
                <Usage
                    code={`<TextLink
    href="/forgot-password"    // obligatoire : adresse du lien
>
    Texte du lien              // obligatoire : le contenu
</TextLink>`}
                />
            </section>

            <section className="flex flex-col gap-4">
                <Label color="primary">Card</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Example code="<Card>">
                        <Card>
                            <Label>Objets trouvés</Label>
                            <Subtitle>Clé USB noire trouvée</Subtitle>
                            <Body>Déposée à l'accueil du bâtiment B.</Body>
                        </Card>
                    </Example>
                    <Example code={'<Card variant="dark">'}>
                        <Card variant="dark">
                            <Subtitle>Connexion</Subtitle>
                            <Body>Panneau sombre, pour un formulaire.</Body>
                        </Card>
                    </Example>
                    <Example code={'<Card variant="accent">'}>
                        <Card variant="accent">
                            <Display>Hackathon 48H</Display>
                            <Label>Jeudi 20 novembre</Label>
                        </Card>
                    </Example>
                    <Example code={'<Card variant="blueprint">'}>
                        <Card variant="blueprint">
                            <Display>Afterwork</Display>
                            <Label>Cafétéria principale</Label>
                        </Card>
                    </Example>
                    <Example code={'<Card variant="transparent">'}>
                        <Card variant="transparent">
                            <Subtitle>Transparente</Subtitle>
                            <Body>Aucun fond : on voit celui de la page.</Body>
                        </Card>
                    </Example>
                    <Example code={'<Card variant="dark" taped>'}>
                        <Card variant="dark" taped>
                            <Subtitle>Avec ruban</Subtitle>
                            <Body>Option taped : un ruban adhésif en haut de la carte.</Body>
                        </Card>
                    </Example>
                </div>
                <Usage
                    code={`<Card
    variant="paper"    // facultatif : "paper" | "dark" | "transparent" | "accent" | "blueprint"
    taped              // facultatif : ajoute un ruban adhésif en haut
>
    <Subtitle>Titre</Subtitle>    // obligatoire : le contenu, par exemple d'autres composants
    <Body>Texte</Body>
</Card>`}
                />
            </section>
        </div>
    );
}