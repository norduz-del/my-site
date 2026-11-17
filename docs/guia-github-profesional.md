# Cómo demostrar dominio de GitHub con este proyecto

Un perfil sólido no se demuestra con una insignia o una lista de comandos: se demuestra mostrando cómo organizas, explicas, revisas y verificas un cambio real. Este repositorio reúne esas prácticas alrededor de un sitio Wix/Velo.

Wix aloja y ejecuta el sitio. El repositorio incorpora un panel CMS con métodos backend de Wix y autorización de administrador, pero no un servidor propio. Las colecciones CMS y la página visual del panel deben crearse desde Wix Dashboard/Editor; describe ese requisito con precisión al presentar el proyecto.

## Qué habilidades se ven aquí

| Práctica | Evidencia en el repositorio | Qué debes poder explicar |
| --- | --- | --- |
| Documentación | `README.md` y esta guía | Qué hace el proyecto, cómo arrancarlo y qué necesita el entorno |
| Issues claros | `.github/ISSUE_TEMPLATE/` | Cómo describir un problema o una mejora con contexto y resultado esperado |
| Trabajo aislado | `CONTRIBUTING.md` | Por qué usar una rama por cambio y no desarrollar directamente en `main` |
| Revisión de código | `.github/pull_request_template.md` | Cómo resumir un cambio, relacionarlo con un issue y pedir revisión |
| Integración continua | `.github/workflows/ci.yml` | Qué evento ejecuta el workflow y por qué el lint evita errores de estilo |
| Wix y seguridad del backend | `src/pages/`, `src/backend/` | Que Wix aloja el sitio, qué contiene realmente el repositorio y por qué las funciones backend futuras deben tener permisos mínimos |

Las plantillas y el workflow están versionados en el repositorio. Para enseñar el historial real, usa tus propios issues, pull requests y ejecuciones de Actions cuando existan; no presentes documentación o ejemplos como actividad ya realizada.

## Flujo que puedes demostrar

1. Abre un issue pequeño y concreto: explica el problema, los pasos para reproducirlo o el resultado esperado.
2. Crea una rama como `feat/descripcion-breve` o `fix/descripcion-breve`.
3. Haz un cambio acotado y usa un mensaje de commit que explique su intención, por ejemplo `docs: aclarar el flujo de contribucion`.
4. Ejecuta `npm run lint`; para cambios del sitio, revisa también el comportamiento en Wix Local Editor.
5. Abre un pull request con contexto, pruebas y enlace al issue. Explica qué queda fuera del alcance.
6. Atiende comentarios, actualiza la rama y espera los checks antes de integrar.
7. Revisa el workflow de GitHub Actions y confirma el resultado en el pull request.

En este repositorio, la rama predeterminada está conectada al sitio Wix. No integres cambios hasta validar el resultado en el entorno Wix y confirmar que tienes permiso para hacerlo.

## Lo que conviene saber para una entrevista

- **Git:** diferencias entre working tree, staging, commit, rama, merge y conflicto; cómo consultar `git status` y revisar un diff antes de confirmar.
- **GitHub Flow:** para qué sirven ramas, pull requests, revisiones y checks requeridos; cómo enlazar un issue con `Closes #<numero>`.
- **Commits:** escribir mensajes breves y específicos que comuniquen el propósito del cambio.
- **Issues y Projects:** separar errores, tareas y mejoras; convertir un objetivo en tareas pequeñas y mantener su estado actualizado. Un tablero de Projects debe crearse y configurarse en GitHub; este repositorio no afirma que exista uno.
- **Actions:** reconocer el evento (`pull_request`), los pasos del workflow, los logs de una ejecución fallida y la diferencia entre CI (validación) y despliegue (publicación).
- **Calidad y seguridad:** revisar cambios antes de integrarlos, mantener permisos mínimos en workflows y no subir secretos, tokens ni datos privados.
- **Documentación:** permitir que otra persona instale, ejecute y entienda el proyecto sin depender de instrucciones privadas.
- **Wix/Velo:** distinguir el código en este repositorio del diseño del sitio y saber cuándo usar Wix Local Editor para validar.

No es necesario memorizar cada comando. Debes poder explicar qué problema resuelve cada paso, cómo investigar un fallo y qué verificaste realmente.

## Cómo presentar el proyecto

1. Empieza por el objetivo: «Preparé un flujo de contribución para un sitio Wix, con documentación, issues estructurados, pull requests revisables y lint automático».
2. Muestra el README y recorre un cambio real de punta a punta: issue → rama → commits → pull request → checks → revisión.
3. Abre `.github/workflows/ci.yml` y explica cuándo se ejecuta y qué verifica; diferencia esto de publicar el sitio.
4. Si el historial aún no contiene ese ejemplo, crea uno pequeño y genuino antes de la entrevista. No inventes revisores, checks, métricas ni resultados.
5. Comenta la particularidad de Wix: `main` está conectada al sitio, así que el flujo exige validar con Wix antes de integrar.

## Límites de esta demostración

El workflow ejecuta ESLint; no sustituye pruebas funcionales ni la revisión visual de Wix. Las plantillas no crean issues por sí solas y la guía de Projects no crea un tablero. La presencia de estos archivos tampoco significa que GitHub Actions ya se haya ejecutado: comprueba la pestaña **Actions** y el estado del pull request para mostrar evidencia real.
