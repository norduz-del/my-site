# Portafolio profesional en GitHub

Este repositorio contiene código de páginas Wix/Velo y un panel para administrar contenido de páginas y productos/servicios con Wix CMS, además de documentar un flujo profesional de colaboración.

**Wix aloja y ejecuta el sitio; este proyecto no implementa un servidor propio.** El panel usa métodos backend de Wix protegidos para administradores. Para activarlo, primero hay que crear las colecciones CMS y la página visual en Wix Editor; el [paso a paso del panel](docs/admin-panel-wix-cms.md) documenta el esquema, controles e IDs requeridos. Las páginas actuales son plantillas Velo y deben conectarse al CMS desde Wix Editor para mostrar contenido editado.

## Qué demuestra este proyecto

- **Git y colaboración:** una rama por cambio, commits descriptivos y pull requests revisables antes de integrar.
- **Seguimiento del trabajo:** plantillas de issues para describir errores y proponer mejoras con contexto y criterios de aceptación.
- **Integración continua:** GitHub Actions instala las dependencias y ejecuta ESLint en cada pull request dirigido a `main`.
- **Documentación:** instrucciones para preparar el entorno, contribuir y explicar las decisiones del proyecto.
- **Panel Wix CMS:** CRUD de textos e imágenes de páginas y catálogo de productos/servicios, con autorización verificada en backend.
- **Wix/Velo:** el código de páginas permanece vinculado a las páginas del sitio; Wix gestiona el alojamiento y los cambios visuales se hacen en el editor Wix.

La guía [Cómo presentar este proyecto](docs/guia-github-profesional.md) explica el flujo paso a paso, los conceptos que conviene dominar y cómo mostrar este trabajo en una entrevista.

## Empezar en local

Necesitas Git, Node.js 14.8 o posterior y npm. Para desarrollar el sitio también necesitas acceso al sitio Wix conectado y Wix CLI.

```bash
git clone <URL-del-repositorio>
cd <carpeta-del-repositorio>
npm install
npm run lint
npm run dev
```

`npm run dev` inicia el entorno local de Wix y requiere acceso al sitio conectado; puede solicitar iniciar sesión. No es un servidor independiente para desplegar fuera de Wix. Consulta [Contribuir](CONTRIBUTING.md) para el flujo de ramas y pull requests.

> **Importante:** Wix sincroniza el sitio con la rama predeterminada. No integres cambios en `main` hasta revisarlos en el entorno de Wix y contar con la aprobación correspondiente.

## Estructura destacada

```text
.github/
  ISSUE_TEMPLATE/       Formularios para errores y mejoras
  workflows/ci.yml      Revisión automática de estilo
  pull_request_template.md
docs/                   Guía de habilidades y presentación
src/pages/              Código asociado a las páginas Wix
CONTRIBUTING.md         Flujo para contribuir
```

## Validaciones

- `npm run lint`: ejecuta ESLint con las reglas recomendadas por Wix.
- GitHub Actions ejecuta esa misma validación en pull requests dirigidos a `main`.
- `npm run dev`: permite revisar el sitio con Wix Local Editor; no es una prueba automatizada ni un servidor de producción propio.

Los checks locales y el workflow deben ejecutarse en el entorno configurado antes de afirmar que pasaron. El código del panel requiere la configuración manual descrita en su guía; no se han creado las colecciones/página Wix ni se ha probado contra el CMS real. Esta documentación no afirma que ya se hayan creado issues, pull requests, ni ejecuciones remotas.

## Recursos

- [GitHub: flujo de GitHub](https://docs.github.com/get-started/using-github/github-flow)
- [GitHub: GitHub Actions](https://docs.github.com/actions)
- [Wix: configurar Git Integration y Wix CLI](https://support.wix.com/en/article/velo-setting-up-git-integration-wix-cli-beta)
