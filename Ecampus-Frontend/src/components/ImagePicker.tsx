import { useRef, type ChangeEvent } from "react";
import { Button } from "./Button.tsx";
import { IconButton } from "./IconButton.tsx";

/** An image chosen by the user and not uploaded yet. */
export interface PickedImage {
    file: File;
    /** Temporary browser address used to show the preview. */
    previewUrl: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Frees the browser memory used by the previews. Call it when the pictures are abandoned.
 *
 * @param images - The pictures whose previews are no longer needed.
 */
export function releaseImages(images: PickedImage[]) {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
}

interface ImagePickerProps {
    /** Accessible name of the file field. */
    label: string;
    /** Pictures chosen so far, kept in a state by the parent. */
    images: PickedImage[];
    /** Called with the new list when a picture is added or removed. */
    onChange: (images: PickedImage[]) => void;
    /** Called with a message when a file is refused, and with an empty text when a new choice starts. */
    onError: (message: string) => void;
    /** Maximum number of pictures. */
    maxImages: number;
    /** Maximum size of one picture, in megabytes. */
    maxSizeMb: number;
}

/**
 * Chooses pictures from the device and shows their previews, each with a button to remove it.
 * Only jpeg, png and webp files are accepted.
 *
 * @param props - The chosen pictures, the limits, and the handlers.
 * @returns The add button and the grid of previews.
 */
export function ImagePicker({ label, images, onChange, onError, maxImages, maxSizeMb }: ImagePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(event.target.files ?? []);
        // Empty the field so that choosing the same file again triggers a new change.
        event.target.value = "";
        onError("");

        const accepted: PickedImage[] = [];
        for (const file of selected) {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                onError("Seuls les fichiers JPEG, PNG et WebP sont acceptés.");
                continue;
            }
            if (file.size > maxSizeMb * 1024 * 1024) {
                onError("Chaque image doit faire " + maxSizeMb + " Mo au maximum.");
                continue;
            }
            if (images.length + accepted.length >= maxImages) {
                onError("Tu peux ajouter " + maxImages + " images au maximum.");
                break;
            }
            accepted.push({ file, previewUrl: URL.createObjectURL(file) });
        }
        if (accepted.length > 0) {
            onChange([...images, ...accepted]);
        }
    }

    function handleRemove(index: number) {
        URL.revokeObjectURL(images[index].previewUrl);
        onChange(images.filter((_, position) => position !== index));
    }

    return (
        <div className="flex flex-col gap-3">
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                aria-label={label}
                className="hidden"
                onChange={handleChange}
            />
            <div>
                <Button
                    variant="secondary"
                    icon="add_photo_alternate"
                    disabled={images.length >= maxImages}
                    onClick={() => inputRef.current?.click()}
                >
                    Ajouter des images
                </Button>
            </div>
            {images.length > 0 && (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                        <li key={image.previewUrl} className="relative aspect-square overflow-hidden rounded-sm bg-panel">
                            <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />
                            <div className="absolute right-1 top-1">
                                <IconButton
                                    icon="close"
                                    label={"Retirer " + image.file.name}
                                    onClick={() => handleRemove(index)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}