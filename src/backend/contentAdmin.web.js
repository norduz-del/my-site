import { currentMember } from "wix-members-backend";
import wixData from "wix-data";
import { Permissions, webMethod } from "wix-web-module";

const COLLECTIONS = {
    pages: "PageContent",
    catalog: "CatalogItems",
};
const PAGE_SIZE = 25;
const MAX_OFFSET = 100000;

async function requireAdmin() {
    const roles = await currentMember.getRoles();
    const isAdmin = roles.some(
        (role) => role.name === "Admin" || role.title === "Admin",
    );

    if (!isAdmin) {
        throw new Error("Solo administradores del sitio pueden editar el contenido.");
    }
}

function getCollectionId(type) {
    if (!Object.prototype.hasOwnProperty.call(COLLECTIONS, type)) {
        throw new Error("Tipo de contenido no válido.");
    }

    return COLLECTIONS[type];
}

function requireText(value, field, maxLength) {
    if (typeof value !== "string") {
        throw new Error(`El campo ${field} debe ser texto.`);
    }

    const text = value.trim();
    if (!text || text.length > maxLength) {
        throw new Error(`El campo ${field} es obligatorio y admite hasta ${maxLength} caracteres.`);
    }

    return text;
}

function optionalText(value, field, maxLength) {
    if (typeof value !== "string") {
        throw new Error(`El campo ${field} debe ser texto.`);
    }

    const text = value.trim();
    if (text.length > maxLength) {
        throw new Error(`El campo ${field} admite hasta ${maxLength} caracteres.`);
    }

    return text;
}

function validateImage(value) {
    const image = optionalText(value, "imagen", 1000);
    if (!image) {
        return "";
    }

    if (image.startsWith("wix:image://v1/")) {
        return image;
    }

    let url;
    try {
        url = new URL(image);
    } catch {
        throw new Error("La imagen debe ser una URL https:// o wix:image:// válida.");
    }

    if (url.protocol !== "https:") {
        throw new Error("La imagen debe usar HTTPS.");
    }

    return url.toString();
}

function requireNumber(value, field, integer = false) {
    if (
        (typeof value !== "number" && typeof value !== "string") ||
        (typeof value === "string" && !value.trim())
    ) {
        throw new Error(`El campo ${field} debe ser un número igual o mayor que cero.`);
    }

    const number = typeof value === "number" ? value : Number(value);
    if (
        !Number.isFinite(number) ||
        number < 0 ||
        (integer && !Number.isInteger(number))
    ) {
        throw new Error(`El campo ${field} debe ser un número igual o mayor que cero.`);
    }

    return number;
}

function normalizeContent(type, input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new Error("El contenido enviado no es válido.");
    }

    const content = {
        slug: requireText(input.slug, "slug", 80).toLowerCase(),
        title: requireText(input.title, "título", 120),
        image: validateImage(input.image),
    };

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug)) {
        throw new Error("El slug solo puede contener letras sin acento, números y guiones.");
    }

    if (type === "pages") {
        content.body = optionalText(input.body, "texto", 5000);
        return content;
    }

    if (type !== "catalog") {
        throw new Error("Tipo de contenido no válido.");
    }

    if (input.kind !== "service" && input.kind !== "product") {
        throw new Error("Selecciona si el elemento es un servicio o un producto.");
    }

    if (typeof input.active !== "boolean") {
        throw new Error("El estado de publicación no es válido.");
    }

    content.kind = input.kind;
    content.description = optionalText(input.description, "descripción", 5000);
    content.price = requireNumber(input.price, "precio");
    content.active = input.active;
    content.sortOrder = requireNumber(input.sortOrder, "orden", true);
    return content;
}

async function ensureUniqueSlug(collectionId, slug, currentId) {
    let query = wixData.query(collectionId).eq("slug", slug);
    if (currentId) {
        query = query.ne("_id", currentId);
    }

    const result = await query.limit(1).find({ suppressAuth: true });
    if (result.items.length > 0) {
        throw new Error("Ya existe un elemento con ese slug en esta sección.");
    }
}

function toPanelItem(item) {
    return {
        _id: item._id,
        slug: item.slug,
        title: item.title,
        body: item.body || "",
        image: item.image || "",
        kind: item.kind || "",
        description: item.description || "",
        price: item.price ?? 0,
        active: item.active ?? false,
        sortOrder: item.sortOrder ?? 0,
    };
}

export const listContent = webMethod(
    Permissions.Admin,
    async (type, offset = 0) => {
        await requireAdmin();

        const collectionId = getCollectionId(type);
        if (!Number.isInteger(offset) || offset < 0 || offset > MAX_OFFSET) {
            throw new Error("La página solicitada no es válida.");
        }

        let query = wixData.query(collectionId);
        if (type === "catalog") {
            query = query.ascending("sortOrder").ascending("title");
        } else {
            query = query.ascending("title");
        }

        const result = await query
            .skip(offset)
            .limit(PAGE_SIZE)
            .find({ suppressAuth: true });

        return {
            items: result.items.map(toPanelItem),
            offset,
            pageSize: PAGE_SIZE,
            totalCount: result.totalCount,
        };
    },
);

export const createContent = webMethod(
    Permissions.Admin,
    async (type, input) => {
        await requireAdmin();

        const collectionId = getCollectionId(type);
        const content = normalizeContent(type, input);
        await ensureUniqueSlug(collectionId, content.slug);

        const item = await wixData.insert(collectionId, content, {
            suppressAuth: true,
        });

        return toPanelItem(item);
    },
);

export const updateContent = webMethod(
    Permissions.Admin,
    async (type, itemId, input) => {
        await requireAdmin();

        const collectionId = getCollectionId(type);
        if (typeof itemId !== "string" || !itemId.trim() || itemId.length > 100) {
            throw new Error("El identificador del contenido no es válido.");
        }

        const content = normalizeContent(type, input);
        await ensureUniqueSlug(collectionId, content.slug, itemId);

        const existing = await wixData.get(collectionId, itemId, {
            suppressAuth: true,
        });
        if (!existing) {
            throw new Error("No se encontró el contenido que intentas editar.");
        }

        const item = await wixData.update(
            collectionId,
            { ...content, _id: existing._id },
            { suppressAuth: true },
        );

        return toPanelItem(item);
    },
);

export const deleteContent = webMethod(
    Permissions.Admin,
    async (type, itemId) => {
        await requireAdmin();

        const collectionId = getCollectionId(type);
        if (typeof itemId !== "string" || !itemId.trim() || itemId.length > 100) {
            throw new Error("El identificador del contenido no es válido.");
        }

        const item = await wixData.remove(collectionId, itemId, {
            suppressAuth: true,
        });

        return { _id: item._id };
    },
);
