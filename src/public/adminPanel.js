import {
    createContent,
    deleteContent,
    listContent,
    updateContent,
} from "backend/contentAdmin.web";

const PAGE_SIZE = 25;

export function initializeAdminPanel($w) {
    let contentType = "pages";
    let offset = 0;
    let editingId = null;
    let deletingId = null;
    let currentItems = [];

    const status = (message) => {
        $w("#adminStatus").text = message;
    };

    const setFormMode = (mode) => {
        const isCatalog = mode === "catalog";
        $w("#pageBodyInput")[isCatalog ? "hide" : "show"]();
        [
            "#catalogKindInput",
            "#catalogDescriptionInput",
            "#catalogPriceInput",
            "#catalogSortOrderInput",
            "#catalogActiveSwitch",
        ].forEach((selector) => $w(selector)[isCatalog ? "show" : "hide"]());
    };

    const resetForm = () => {
        editingId = null;
        $w("#contentSlugInput").value = "";
        $w("#contentTitleInput").value = "";
        $w("#contentImageInput").value = "";
        $w("#pageBodyInput").value = "";
        $w("#catalogKindInput").value = "service";
        $w("#catalogDescriptionInput").value = "";
        $w("#catalogPriceInput").value = "0";
        $w("#catalogSortOrderInput").value = "0";
        $w("#catalogActiveSwitch").checked = true;
        $w("#saveContentButton").label = "Crear contenido";
        $w("#cancelEditButton").hide();
        setFormMode(contentType);
    };

    const refreshItems = async () => {
        const result = await listContent(contentType, offset);
        currentItems = result.items;
        $w("#contentRepeater").data = currentItems;
        $w("#previousPageButton")[offset === 0 ? "disable" : "enable"]();
        $w("#nextPageButton")[
            offset + result.pageSize >= result.totalCount ? "disable" : "enable"
        ]();

        const firstItem = result.totalCount === 0 ? 0 : offset + 1;
        const lastItem = Math.min(offset + currentItems.length, result.totalCount);
        $w("#pageStatus").text =
            result.totalCount === 0
                ? "No hay contenido todavía."
                : `Mostrando ${firstItem}-${lastItem} de ${result.totalCount}`;
    };

    const save = async () => {
        const input = {
            slug: $w("#contentSlugInput").value,
            title: $w("#contentTitleInput").value,
            image: $w("#contentImageInput").value,
        };

        if (contentType === "pages") {
            input.body = $w("#pageBodyInput").value;
        } else {
            input.kind = $w("#catalogKindInput").value;
            input.description = $w("#catalogDescriptionInput").value;
            input.price = $w("#catalogPriceInput").value;
            input.sortOrder = $w("#catalogSortOrderInput").value;
            input.active = $w("#catalogActiveSwitch").checked;
        }

        $w("#saveContentButton").disable();
        status("Guardando...");

        try {
            if (editingId) {
                await updateContent(contentType, editingId, input);
                status("Cambios guardados.");
            } else {
                await createContent(contentType, input);
                status("Contenido creado.");
            }

            resetForm();
            await refreshItems();
        } catch (error) {
            console.error("No se pudo guardar el contenido.", error);
            status(error.message || "No se pudo guardar el contenido.");
        } finally {
            $w("#saveContentButton").enable();
        }
    };

    $w("#contentRepeater").onItemReady(($item, itemData) => {
        $item("#rowTitle").text = itemData.title;
        $item("#rowSummary").text =
            contentType === "pages"
                ? itemData.body
                : `${itemData.kind === "product" ? "Producto" : "Servicio"} · ${itemData.description} · ${itemData.price} · ${itemData.active ? "Publicado" : "Oculto"}`;

        if (itemData.image) {
            $item("#rowImage").src = itemData.image;
            $item("#rowImage").show();
        } else {
            $item("#rowImage").hide();
        }

        $item("#editContentButton").onClick(() => {
            editingId = itemData._id;
            $w("#contentSlugInput").value = itemData.slug;
            $w("#contentTitleInput").value = itemData.title;
            $w("#contentImageInput").value = itemData.image;
            $w("#pageBodyInput").value = itemData.body;
            $w("#catalogKindInput").value = itemData.kind || "service";
            $w("#catalogDescriptionInput").value = itemData.description;
            $w("#catalogPriceInput").value = String(itemData.price);
            $w("#catalogSortOrderInput").value = String(itemData.sortOrder);
            $w("#catalogActiveSwitch").checked = itemData.active;
            $w("#saveContentButton").label = "Guardar cambios";
            $w("#cancelEditButton").show();
            setFormMode(contentType);
            status(`Editando: ${itemData.title}`);
        });

        $item("#deleteContentButton").onClick(() => {
            deletingId = itemData._id;
            $w("#deleteConfirmationText").text =
                `¿Eliminar "${itemData.title}"? Esta acción no se puede deshacer.`;
            $w("#deleteConfirmationText").show();
            $w("#confirmDeleteButton").show();
            $w("#cancelDeleteButton").show();
        });
    });

    $w("#contentTypeInput").onChange(() => {
        contentType = $w("#contentTypeInput").value;
        offset = 0;
        deletingId = null;
        $w("#deleteConfirmationText").hide();
        $w("#confirmDeleteButton").hide();
        $w("#cancelDeleteButton").hide();
        resetForm();
        refreshItems().catch((error) => {
            console.error("No se pudo cargar el contenido.", error);
            status(error.message || "No se pudo cargar el contenido.");
        });
    });

    $w("#newContentButton").onClick(() => {
        resetForm();
        status("Nuevo contenido.");
    });
    $w("#saveContentButton").onClick(save);
    $w("#cancelEditButton").onClick(() => {
        resetForm();
        status("Edición cancelada.");
    });
    $w("#previousPageButton").onClick(() => {
        offset = Math.max(0, offset - PAGE_SIZE);
        refreshItems().catch((error) => status(error.message));
    });
    $w("#nextPageButton").onClick(() => {
        offset += PAGE_SIZE;
        refreshItems().catch((error) => status(error.message));
    });

    $w("#confirmDeleteButton").onClick(async () => {
        if (!deletingId) {
            return;
        }

        $w("#confirmDeleteButton").disable();
        try {
            await deleteContent(contentType, deletingId);
            if (offset > 0 && currentItems.length === 1) {
                offset = Math.max(0, offset - PAGE_SIZE);
            }
            deletingId = null;
            $w("#deleteConfirmationText").hide();
            $w("#confirmDeleteButton").hide();
            $w("#cancelDeleteButton").hide();
            resetForm();
            await refreshItems();
            status("Contenido eliminado.");
        } catch (error) {
            console.error("No se pudo eliminar el contenido.", error);
            status(error.message || "No se pudo eliminar el contenido.");
        } finally {
            $w("#confirmDeleteButton").enable();
        }
    });

    $w("#cancelDeleteButton").onClick(() => {
        deletingId = null;
        $w("#deleteConfirmationText").hide();
        $w("#confirmDeleteButton").hide();
        $w("#cancelDeleteButton").hide();
    });

    $w("#deleteConfirmationText").hide();
    $w("#confirmDeleteButton").hide();
    $w("#cancelDeleteButton").hide();
    $w("#cancelEditButton").hide();
    $w("#contentTypeInput").value = contentType;
    $w("#previousPageButton").disable();
    resetForm();

    refreshItems().catch((error) => {
        console.error("No se pudo cargar el contenido.", error);
        status(error.message || "No se pudo cargar el contenido.");
    });
}
