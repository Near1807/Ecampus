import { useState, type FormEvent } from "react";
import { Button } from "../components/Button.tsx";
import { DropdownMenu } from "../components/DropdownMenu.tsx";
import { ConversationItem } from "../components/ConversationItem.tsx";
import { FilterTabs } from "../components/FilterTabs.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { Input } from "../components/Input.tsx";
import { MessageBubble } from "../components/MessageBubble.tsx";
import { StatusBadge, type Status } from "../components/StatusBadge.tsx";
import { Body, Label, Subtitle, Title } from "../components/Typography.tsx";

type Filter = "all" | "pending" | "done";

/** One message of a discussion. */
interface ChatMessage {
    id: number;
    own: boolean;
    author: string;
    time: string;
    content: string;
}

/** A discussion between the administrator and the author of an announcement. */
interface Discussion {
    id: number;
    subject: string;
    author: string;
    status: Status;
    lastTime: string;
    messages: ChatMessage[];
}

const FILTERS = [
    { value: "all", label: "Toutes" },
    { value: "pending", label: "En attente" },
    { value: "done", label: "Terminées" },
] satisfies { value: Filter; label: string }[];

/** Placeholder data, to be replaced by the API once the contract is defined. */
const INITIAL_DISCUSSIONS: Discussion[] = [
    {
        id: 1,
        subject: "Afterwork du cercle",
        author: "Lucas Vandermeersch",
        status: "pending",
        lastTime: "14:23",
        messages: [
            { id: 1, own: false, author: "Lucas Vandermeersch", time: "10:04", content: "Bonjour, nous souhaitons publier l'annonce pour l'afterwork de rentrée du cercle prévu jeudi prochain." },
            { id: 2, own: true, author: "Marc Dubois (Modérateur)", time: "10:15", content: "Bonjour Lucas. Merci de préciser l'horaire de fin ainsi que le local exact afin de respecter le protocole de sécurité du campus." },
            { id: 3, own: false, author: "Lucas Vandermeersch", time: "14:18", content: "C'est bien noté. L'événement aura lieu à la Cafétéria principale jusqu'à 23h30 au plus tard." },
            { id: 4, own: true, author: "Marc Dubois (Modérateur)", time: "14:23", content: "Parfait, les informations sont conformes. Je valide la publication sur le tableau d'affichage principal." },
        ],
    },
    {
        id: 2,
        subject: "Clé USB noire trouvée",
        author: "Sophie Martin",
        status: "pending",
        lastTime: "Hier",
        messages: [
            { id: 5, own: false, author: "Sophie Martin", time: "Hier", content: "Elle a été déposée à l'accueil du bâtiment B." },
        ],
    },
    {
        id: 3,
        subject: "Recrutement journal étudiant",
        author: "Bureau des étudiants",
        status: "validated",
        lastTime: "14 oct.",
        messages: [
            { id: 6, own: true, author: "Marc Dubois (Modérateur)", time: "14 oct.", content: "Annonce validée et placardée sur le tableau." },
        ],
    },
    {
        id: 4,
        subject: "Hackathon 48H ECAM",
        author: "Cercle Informatique",
        status: "validated",
        lastTime: "12 oct.",
        messages: [
            { id: 7, own: true, author: "Marc Dubois (Modérateur)", time: "12 oct.", content: "Dossier de sécurité complet et conforme." },
        ],
    },
];

/**
 * Discussions page, administrator view: the list of discussions on one side, the open thread
 * with its moderation actions and its input on the other.
 * Starting point: data is local and nothing is sent to the back-end yet.
 *
 * @returns The discussions page.
 */
export function Conversations() {
    const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
    const [selectedId, setSelectedId] = useState<number | null>(INITIAL_DISCUSSIONS[0].id);
    const [filter, setFilter] = useState<Filter>("all");
    const [draft, setDraft] = useState("");

    const selected = discussions.find((discussion) => discussion.id === selectedId);

    const visibleDiscussions = discussions.filter((discussion) => {
        if (filter === "pending") {
            return discussion.status === "pending";
        }
        if (filter === "done") {
            return discussion.status !== "pending";
        }
        return true;
    });

    function updateSelected(change: (discussion: Discussion) => Discussion) {
        setDiscussions(discussions.map((discussion) => (discussion.id === selectedId ? change(discussion) : discussion)));
    }

    function handleSend(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (draft.trim() === "") {
            return;
        }
        const time = new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
        const newMessage: ChatMessage = {
            id: Date.now(),
            own: true,
            author: "Vous",
            time,
            content: draft.trim(),
        };
        updateSelected((discussion) => ({
            ...discussion,
            lastTime: time,
            messages: [...discussion.messages, newMessage],
        }));
        setDraft("");
    }

    function handleAccept() {
        updateSelected((discussion) => ({ ...discussion, status: "validated" }));
    }

    function handleDecline() {
        updateSelected((discussion) => ({ ...discussion, status: "declined" }));
    }

    function handleRequestChanges() {
        setDraft("Pourriez-vous modifier votre annonce : ");
    }

    return (
        <div className="flex h-full overflow-hidden">
            <aside
                className={
                    (selected ? "hidden md:flex" : "flex") +
                    " w-full shrink-0 flex-col border-r border-foreground/10 md:w-[360px]"
                }
            >
                <div className="flex flex-col gap-5 p-6 pb-4">
                    <Title>Discussions</Title>
                    <FilterTabs label="Filtrer les discussions" options={FILTERS} value={filter} onChange={setFilter} />
                </div>
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-2">
                    {visibleDiscussions.map((discussion) => (
                        <ConversationItem
                            key={discussion.id}
                            subject={discussion.subject}
                            author={discussion.author}
                            preview={discussion.messages.at(-1)?.content ?? ""}
                            time={discussion.lastTime}
                            status={discussion.status}
                            selected={discussion.id === selectedId}
                            onClick={() => setSelectedId(discussion.id)}
                        />
                    ))}
                </div>
            </aside>

            {selected ? (
                <main className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 px-6 py-4 md:px-10">
                        <div className="flex items-center gap-4">
                            <div className="md:hidden">
                                <IconButton
                                    icon="arrow_back"
                                    label="Retour aux discussions"
                                    onClick={() => setSelectedId(null)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <Subtitle>{selected.subject}</Subtitle>
                                <Label color="muted">{selected.author}</Label>
                            </div>
                            <StatusBadge status={selected.status} />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button icon="check" disabled={selected.status === "validated"} onClick={handleAccept}>
                                Accepter l'annonce
                            </Button>
                            <DropdownMenu
                                label="Autres actions"
                                items={[
                                    { label: "Demander des modifications", onSelect: handleRequestChanges },
                                    { label: "Refuser l'annonce", onSelect: handleDecline, danger: true },
                                ]}
                            />
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8 md:px-12">
                        {selected.messages.map((message) => (
                            <MessageBubble key={message.id} own={message.own} author={message.author} time={message.time}>
                                {message.content}
                            </MessageBubble>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-3 border-t border-foreground/10 px-6 py-4 md:px-12"
                    >
                        <div className="flex-1">
                            <Input
                                label="Message"
                                placeholder="Écrire un message..."
                                value={draft}
                                onChange={setDraft}
                            />
                        </div>
                        <IconButton icon="arrow_upward" label="Envoyer" variant="primary" type="submit" />
                    </form>
                </main>
            ) : (
                <div className="hidden flex-1 items-center justify-center md:flex">
                    <Body color="muted">Sélectionne une discussion pour l'afficher.</Body>
                </div>
            )}
        </div>
    );
}