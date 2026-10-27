# Hernán Solano

Portafolio personal con proyectos, experiencia y CV en español e inglés. Construido con Next.js, TypeScript y Tailwind CSS, con temas claro y oscuro.

## Desarrollo

Requiere Node.js 24.

```sh
npm ci
npm run dev
```

Abre [localhost:3000](http://localhost:3000). Las páginas están disponibles en `/es` y `/en`.

## Contenido

- `content/`: perfil, proyectos, experiencia, formación y conocimientos.
- `messages/`: textos de la interfaz en ambos idiomas.
- `public/`: archivos públicos, incluidos los CV en `public/cv/`.

## Comprobaciones y producción

`npm run check` valida contenido, TypeScript, lint y compilación. GitHub Actions ejecuta estas comprobaciones y una auditoría de dependencias.

`npm run build` genera la versión de producción y `npm start` la sirve. El proyecto es compatible con Vercel.

| Variable | Descripción |
| --- | --- |
| `SITE_URL` | Dominio canónico; por defecto `https://hernansolano.me`. |
| `SITE_INDEXABLE` | `true` permite indexación en producción; desactivada por defecto y en previews de Vercel. |
