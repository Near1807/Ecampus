import { useState, type FormEvent } from "react";
import { Button } from "../components/Button.tsx";
import { Card } from "../components/Card.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { IconButton } from "../components/IconButton.tsx";
import { ImagePicker, releaseImages, type PickedImage } from "../components/ImagePicker.tsx";
import { Input } from "../components/Input.tsx";
import { Select } from "../components/Select.tsx";
import { StatusBadge, type Status } from "../components/StatusBadge.tsx";
import { Textarea } from "../components/Textarea.tsx";
import { Body, Label, Small, Subtitle, Title } from "../components/Typography.tsx";

/** Categories accepted by the database (CHECK on annonces.categorie). */
type Category =
    | "OBJET_TROUVE"
    | "OBJET_A_DONNER"
    | "EVENEMENT"
    | "APPEL_A_PROJET"
    | "PUBLICITE"
    | "ANNONCE_ADMINISTRATION";

const CATEGORIES: { value: Category; label: string }[] = [
    { value: "OBJET_TROUVE", label: "Objet trouvé" },
    { value: "OBJET_A_DONNER", label: "Objet à donner" },
    { value: "EVENEMENT", label: "Événement" },
    { value: "APPEL_A_PROJET", label: "Appel à projet" },
    { value: "PUBLICITE", label: "Publicité" },
    { value: "ANNONCE_ADMINISTRATION", label: "Annonce de l'administration" },
];

/** Active templates (annonces.template_id). To be loaded from the API. The value is the id as text. */
const TEMPLATES: { value: string; label: string }[] = [{ value: "0", label: "Standard" }];

/** Maximum length of annonces.titre (VARCHAR(255)). */
const TITLE_MAX_LENGTH = 255;

/** Limits of the pictures of one announcement. Provisional values, to be decided with the team. */
const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 5;

/**
 * An announcement owned by the current user.
 * Dates are YYYY-MM-DD strings, except eventDate (YYYY-MM-DDTHH:mm). Empty string means "not set".
 */
interface MyAnnonce {
    id: number;
    categorie: Category;
    templateId: number;
    titre: string;
    descriptionCourte: string;
    descriptionLongue: string;
    status: Status;
    createdAt: string;
    eventDate: string;
    expiresAt: string;
    /** Addresses of the pictures already saved. */
    imageUrls: string[];
}

/** Content of the form: id is null while creating a new announcement. */
interface Draft {
    id: number | null;
    categorie: Category;
    templateId: number;
    titre: string;
    descriptionCourte: string;
    descriptionLongue: string;
    eventDate: string;
    expiresAt: string;
    /** Pictures chosen during this edit, not saved yet. */
    images: PickedImage[];
}

const EMPTY_DRAFT: Draft = {
    id: null,
    categorie: "EVENEMENT",
    templateId: 0,
    titre: "",
    descriptionCourte: "",
    descriptionLongue: "",
    eventDate: "",
    expiresAt: "",
    images: [],
};

/** Placeholder data, to be replaced by the API once the contract is defined. */
const INITIAL_ANNONCES: MyAnnonce[] = [
    {
        id: 1,
        categorie: "EVENEMENT",
        templateId: 0,
        titre: "Afterwork du cercle",
        descriptionCourte: "Afterwork de rentrée, jeudi prochain.",
        descriptionLongue: "Afterwork de rentrée du cercle à la Cafétéria principale, jusqu'à 23h30.",
        status: "pending",
        createdAt: "2026-11-16",
        eventDate: "2026-12-04T18:00",
        expiresAt: "2026-12-05",
        imageUrls: [],
    },
    {
        id: 2,
        categorie: "OBJET_TROUVE",
        templateId: 0,
        titre: "Clé USB noire trouvée",
        descriptionCourte: "Déposée à l'accueil du bâtiment B.",
        descriptionLongue: "Clé USB noire trouvée dans l'auditoire 3, déposée à l'accueil du bâtiment B.",
        status: "validated",
        createdAt: "2026-11-10",
        eventDate: "",
        expiresAt: "",
        imageUrls: [],
    },
];

/** @returns Today's date as a YYYY-MM-DD string. */
function today(): string {
    return new Date().toISOString().slice(0, 10);
}

/**
 * @param date - A YYYY-MM-DD string, or an empty string.
 * @returns The date in the Belgian format, or an empty string.
 */
function formatDate(date: string): string {
    return date === "" ? "" : new Date(date).toLocaleDateString("fr-BE");
}

/**
 * @param dateTime - A YYYY-MM-DDTHH:mm string, or an empty string.
 * @returns The date and time in the Belgian format, or an empty string.
 */
function formatDateTime(dateTime: string): string {
    return dateTime === "" ? "" : new Date(dateTime).toLocaleString("fr-BE", { dateStyle: "short", timeStyle: "short" });
}

/**
 * My announcements page: the announcements of the current user, with a form to create or edit one.
 * The form only contains what the user decides; the author, the creation date, the moderation fields
 * and the priority are filled by the back-end.
 * Starting point: data is local and nothing is sent to the back-end yet.
 *
 * @returns The list view, or the form view while an announcement is being written.
 */
export function MesAnnonces() {
    const [annonces, setAnnonces] = useState(INITIAL_ANNONCES);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [error, setError] = useState("");

    function startNew() {
        setError("");
        setDraft(EMPTY_DRAFT);
    }

    function startEdit(annonce: MyAnnonce) {
        setError("");
        setDraft({
            id: annonce.id,
            categorie: annonce.categorie,
            templateId: annonce.templateId,
            titre: annonce.titre,
            descriptionCourte: annonce.descriptionCourte,
            descriptionLongue: annonce.descriptionLongue,
            eventDate: annonce.eventDate,
            expiresAt: annonce.expiresAt,
            images: [],
        });
    }

    function cancel() {
        // Free the browser memory used by the previews that will never be saved.
        if (draft !== null) {
            releaseImages(draft.images);
        }
        setError("");
        setDraft(null);
    }

    function updateDraft(change: Partial<Draft>) {
        if (draft === null) {
            return;
        }
        setDraft({ ...draft, ...change });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (draft === null) {
            return;
        }
        // Same rules as the database: title and long description are mandatory,
        // and the expiration date must come after the creation date (chk_annonces_dates).
        if (draft.titre.trim() === "" || draft.descriptionLongue.trim() === "") {
            setError("Le titre et la description sont obligatoires.");
            return;
        }
        if (draft.expiresAt !== "" && draft.expiresAt <= today()) {
            setError("La date d'expiration doit être après aujourd'hui.");
            return;
        }
        const content = {
            categorie: draft.categorie,
            templateId: draft.templateId,
            titre: draft.titre.trim(),
            descriptionCourte: draft.descriptionCourte.trim(),
            descriptionLongue: draft.descriptionLongue.trim(),
            eventDate: draft.eventDate,
            expiresAt: draft.expiresAt,
        };
        // The previews stay valid after saving: they are the only copy of the pictures until the upload exists.
        const newImageUrls = draft.images.map((image) => image.previewUrl);
        if (draft.id === null) {
            const created: MyAnnonce = {
                id: Date.now(),
                ...content,
                status: "pending",
                createdAt: today(),
                imageUrls: newImageUrls,
            };
            setAnnonces([created, ...annonces]);
        } else {
            setAnnonces(
                annonces.map((annonce) =>
                    annonce.id === draft.id
                        ? {
                              ...annonce,
                              ...content,
                              imageUrls: [...annonce.imageUrls, ...newImageUrls],
                              status: "pending",
                          }
                        : annonce,
                ),
            );
        }
        setError("");
        setDraft(null);
    }

    if (draft !== null) {
        return (
            <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
                <div className="flex items-center justify-between gap-4">
                    <Title>{draft.id === null ? "Nouvelle annonce" : "Modifier l'annonce"}</Title>
                    <Button variant="ghost" icon="arrow_back" onClick={cancel}>
                        Retour
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Catégorie</Label>
                        <Select
                            label="Catégorie"
                            value={draft.categorie}
                            options={CATEGORIES}
                            onChange={(categorie) => updateDraft({ categorie })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Modèle d'affichage</Label>
                        <Select
                            label="Modèle d'affichage"
                            value={String(draft.templateId)}
                            options={TEMPLATES}
                            onChange={(templateId) => updateDraft({ templateId: Number(templateId) })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Titre</Label>
                        <Input
                            label="Titre"
                            placeholder="Titre de l'annonce"
                            maxLength={TITLE_MAX_LENGTH}
                            value={draft.titre}
                            onChange={(titre) => updateDraft({ titre })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Description courte (facultative)</Label>
                        <Input
                            label="Description courte"
                            placeholder="Une phrase pour le tableau"
                            value={draft.descriptionCourte}
                            onChange={(descriptionCourte) => updateDraft({ descriptionCourte })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Description</Label>
                        <Textarea
                            label="Description"
                            placeholder="Tous les détails de l'annonce"
                            value={draft.descriptionLongue}
                            onChange={(descriptionLongue) => updateDraft({ descriptionLongue })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Date de l'événement (facultative)</Label>
                        <Input
                            label="Date de l'événement"
                            type="datetime-local"
                            value={draft.eventDate}
                            onChange={(eventDate) => updateDraft({ eventDate })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Date d'expiration (facultative)</Label>
                        <Input
                            label="Date d'expiration"
                            type="date"
                            value={draft.expiresAt}
                            onChange={(expiresAt) => updateDraft({ expiresAt })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label color="muted">Images (facultatives, {MAX_IMAGES} maximum)</Label>
                        <ImagePicker
                            label="Images de l'annonce"
                            images={draft.images}
                            onChange={(images) => updateDraft({ images })}
                            onError={setError}
                            maxImages={MAX_IMAGES}
                            maxSizeMb={MAX_IMAGE_SIZE_MB}
                        />
                    </div>

                    {error !== "" && <ErrorMessage>{error}</ErrorMessage>}

                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" icon="check">
                            Enregistrer
                        </Button>
                        <Button variant="secondary" onClick={cancel}>
                            Annuler
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Title>Mes annonces</Title>
                <Button icon="add" onClick={startNew}>
                    Nouvelle annonce
                </Button>
            </div>

            {annonces.length === 0 ? (
                <Body color="muted">Tu n'as pas encore d'annonce.</Body>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {annonces.map((annonce) => (
                        <Card key={annonce.id} variant="dark">
                            {annonce.imageUrls.length > 0 && (
                                <img
                                    src={annonce.imageUrls[0]}
                                    alt=""
                                    className="aspect-video w-full rounded-sm object-cover"
                                />
                            )}
                            <div className="flex items-center justify-between gap-3">
                                <Label color="primary">
                                    {CATEGORIES.find((category) => category.value === annonce.categorie)?.label}
                                </Label>
                                <StatusBadge status={annonce.status} />
                            </div>
                            <Subtitle>{annonce.titre}</Subtitle>
                            {annonce.descriptionCourte !== "" && <Body color="muted">{annonce.descriptionCourte}</Body>}
                            {annonce.eventDate !== "" && <Small>Événement : {formatDateTime(annonce.eventDate)}</Small>}
                            <div className="flex items-center justify-between gap-3">
                                <Small color="muted">
                                    Créée le {formatDate(annonce.createdAt)}
                                    {annonce.expiresAt !== "" && " · Expire le " + formatDate(annonce.expiresAt)}
                                </Small>
                                <IconButton icon="edit" label="Modifier l'annonce" onClick={() => startEdit(annonce)} />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}