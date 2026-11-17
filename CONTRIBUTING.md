# Contribuir

## Flujo de trabajo

1. Revisa si ya existe un issue para el cambio. Si no, crea uno y describe el objetivo y el resultado esperado.
2. Crea una rama corta a partir de `main`, por ejemplo `feat/formulario-contacto` o `fix/validacion-email`.
3. Haz un cambio acotado y crea commits descriptivos. Usa, por ejemplo, `feat: validar el formulario de contacto`.
4. Ejecuta `npm run lint`. Para cambios del sitio, revisa además el resultado con Wix Local Editor.
5. Abre un pull request hacia `main`, completa la plantilla y enlaza el issue con `Closes #<numero>` cuando corresponda.
6. Espera la revisión y los checks. Integra el cambio solo después de la aprobación y de confirmar que funciona en Wix.

No trabajes directamente sobre `main`. La rama predeterminada está conectada al sitio Wix, así que los cambios que se integren allí pueden afectar el sitio.

## Cambios de páginas Wix

No renombres los archivos de `src/pages`: Wix los utiliza para asociar el código con cada página. Tampoco crees desde el IDE archivos nuevos de páginas; crea páginas desde el editor Wix y sincroniza los cambios. Los cambios de diseño y los identificadores de elementos se administran en Wix, no en este repositorio.

Para configurar o probar el panel CMS, sigue [la guía de administración](docs/admin-panel-wix-cms.md). Las colecciones y la página visual se crean desde Wix; no las simules como archivos locales.
