# Panel de administración de contenido Wix

El panel usa Wix CMS y las funciones backend administradas de Wix; no instala ni expone un servidor propio. El código de administración es seguro por diseño, pero Wix no permite crear la página visual ni las colecciones del CMS desde este repositorio. Hay que completar los pasos de Wix Dashboard y Editor antes de que el panel pueda usarse. No se ha publicado el sitio ni se ha comprobado el panel contra el CMS real.

## 1. Crear las colecciones

En el Dashboard del sitio, abre **CMS → Colecciones** y crea estas colecciones con los identificadores indicados (no solo el nombre visible):

| ID de colección | Campos adicionales (ID: tipo) |
| --- | --- |
| `PageContent` | `slug`: Texto; `title`: Texto; `body`: Texto; `image`: Imagen |
| `CatalogItems` | `slug`: Texto; `title`: Texto; `kind`: Texto; `description`: Texto; `image`: Imagen; `price`: Número; `active`: Booleano; `sortOrder`: Número |

Conserva los campos de sistema de Wix. Usa un `slug` único por elemento: por ejemplo `inicio`, `sobre-mi`, `servicio-consultoria`. Para `kind`, usa solo `service` o `product`. Los textos se guardan como texto simple, no como HTML. El campo `image` acepta una dirección HTTPS o el valor `wix:image://` de un recurso de Wix; el panel no sube archivos al Media Manager.

Configura los permisos de ambas colecciones como **lectura: cualquiera** y **crear, actualizar y eliminar: solo administradores**. La lectura pública permite conectar el contenido a las páginas del sitio. Las escrituras del panel pasan por backend con `Permissions.Admin` y una comprobación adicional del rol Admin; las operaciones CMS omiten el chequeo de colección solo después de esa autorización. No habilites escritura anónima ni de miembros.

## 2. Crear la página del panel

En Wix Editor, añade una página llamada **Administración**, con URL `/admin`, quítala de los menús y, si el editor ofrece control de acceso para administradores, aplícalo. La página puede quedar oculta para visitantes en la navegación, pero eso **no es** la protección de los datos: la autorización real se valida en cada método backend.

Añade estos controles y establece sus IDs exactos en el panel de propiedades del Editor:

| ID | Control / configuración |
| --- | --- |
| `contentTypeInput` | Dropdown: `Páginas` → `pages`; `Productos y servicios` → `catalog` |
| `newContentButton` | Botón: Nuevo |
| `contentRepeater` | Repeater con `rowTitle` (texto), `rowSummary` (texto), `rowImage` (imagen), `editContentButton` (botón) y `deleteContentButton` (botón) dentro de cada elemento |
| `contentSlugInput`, `contentTitleInput`, `contentImageInput` | Entradas de texto |
| `pageBodyInput` | Entrada de texto multilínea |
| `catalogKindInput` | Dropdown: Servicio → `service`; Producto → `product` |
| `catalogDescriptionInput` | Entrada de texto multilínea |
| `catalogPriceInput`, `catalogSortOrderInput` | Entradas numéricas |
| `catalogActiveSwitch` | Interruptor para publicar/ocultar el elemento |
| `saveContentButton`, `cancelEditButton` | Botones para guardar y cancelar |
| `adminStatus`, `pageStatus` | Texto de estado |
| `previousPageButton`, `nextPageButton` | Botones de paginación |
| `deleteConfirmationText`, `confirmDeleteButton`, `cancelDeleteButton` | Texto y botones de confirmación |

Después de añadir la página en Wix, sincroniza el sitio con el repositorio. Wix generará el archivo de página asociado; no inventes ni renombres manualmente ese archivo. En el archivo recién generado, conecta el panel:

```js
import { initializeAdminPanel } from "public/adminPanel";

$w.onReady(() => {
  initializeAdminPanel($w);
});
```

La vista previa de Wix puede limitar la lectura de roles. Comprueba el acceso en el sitio publicado o en el entorno de Wix que tenga autenticación completa, pero no publiques el sitio solo para probar sin revisar antes los cambios y permisos.

## 3. Conectar contenido a páginas públicas

El panel guarda datos CMS; no cambia automáticamente el diseño ni sustituye los textos que estén escritos directamente en el Editor. Para mostrar estos datos en el sitio, añade en cada página Wix un dataset de `PageContent`, filtrado por el `slug` de esa página, y conecta los controles de texto e imagen a `title`, `body` e `image`. Para la lista de servicios/productos, conecta un repeater a `CatalogItems`, filtra `active` como verdadero y conecta sus controles a `title`, `description`, `image` y `price`. El diseño, los IDs de elementos, los filtros y sus conexiones viven en Wix Editor y no están presentes en este repositorio.

## Qué está y qué falta

El repositorio ya contiene la interfaz de gestión, CRUD para las dos colecciones y autorización backend de administrador. No contiene las colecciones ni la página visual creada en Wix, no conoce el dominio público del sitio y no ha ejecutado operaciones contra datos reales. Completa los pasos anteriores y valida cada tipo de contenido en Wix antes de considerar activo el panel. Las funciones `wix-web-module` con extensión `.web.js` y `Permissions.Admin` siguen el modelo actual de [Wix Web Methods](https://dev.wix.com/docs/velo/apis/wix-web-module/web-method.md); la comprobación de rol usa [`currentMember.getRoles()`](https://dev.wix.com/docs/velo/apis/wix-members-backend/current-member/get-roles.md).
