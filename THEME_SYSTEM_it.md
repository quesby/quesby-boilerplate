# Neutrino Theme System

## Overview

Il sistema di temi di Neutrino CMS permette agli utenti di personalizzare facilmente l'aspetto del loro sito web senza modificare i file del tema originale. Il sistema è basato su filesystem e supporta versioning, design tokens e override intelligenti.

## Struttura del Sistema

```
src/
├── themes/                          # Directory dei temi
│   └── neutrino-basic@1.0.0/       # Tema con versioning
│       ├── layouts/                 # Layout del tema
│       ├── includes/                # Parti riutilizzabili
│       ├── styles/                  # Stili SCSS/CSS
│       ├── assets/                  # JavaScript e altri asset
│       └── theme.config.json        # Configurazione del tema
├── overrides/                       # Personalizzazioni utente
│   ├── styles/                      # CSS personalizzati
│   ├── layouts/                     # Layout personalizzati
│   ├── includes/                    # Include personalizzati
│   └── theme.config.json            # Configurazione locale
└── _data/
    └── site.json                    # Configurazione sito + tema
```

## Configurazione del Tema

### 1. Selezione del Tema

Nel file `src/_data/site.json`:

```json
{
  "name": "Neutrino - Electron",
  "url": "https://theoddape.it",
  "description": "An Eleventy boilerplate with Decap CMS",
  "logo": "/assets/images/neutrino-logo.svg",
  "favicon": "/assets/images/neutrino-logo.png",
  "theme": "neutrino-brand-website",
  "defaultVisualTheme": "dark",
  "contentPath": "${NEUTRINO_CONTENT_PATH}"
}
```

### 2. Configurazione del Tema

Ogni tema ha un file `theme.config.json` che definisce:

- **Metadata**: nome, versione, autore, licenza
- **Design Tokens**: colori, tipografia, spaziature, breakpoints
- **Features**: funzionalità supportate
- **Dependencies**: dipendenze del tema
- **Compatibility**: requisiti di compatibilità

## Design Tokens

I design tokens sono valori riutilizzabili che definiscono l'aspetto del tema:

### Colori
```json
"colors": {
  "primary": {
    "light": "#0af",
    "dark": "#00d"
  },
  "semantic": {
    "success": "#28a745",
    "warning": "#ffc107",
    "error": "#dc3545"
  }
}
```

### Tipografia
```json
"typography": {
  "fonts": {
    "heading": "Inter, sans-serif",
    "body": "Inter, sans-serif"
  },
  "weights": {
    "normal": 400,
    "bold": 700
  }
}
```

### Spaziature
```json
"spacing": {
  "xs": "0.25rem",
  "sm": "0.5rem",
  "md": "1rem",
  "lg": "1.5rem"
}
```

## Sistema di Override

### 1. Override CSS

Gli utenti possono creare file CSS personalizzati in `src/overrides/styles/`:

```css
/* custom.css */
:root {
  --color-primary: #ff6b6b;  /* Override colore primario */
}

.btn {
  border-radius: 25px;       /* Stile personalizzato per bottoni */
}
```

### 2. Override Layout

Layout personalizzati in `src/overrides/layouts/`:

```njk
<!-- base.njk personalizzato -->
<!DOCTYPE html>
<html>
  <head>
    <!-- Head personalizzato -->
  </head>
  <body>
    <!-- Layout personalizzato -->
  </body>
</html>
```

### 3. Override Include

Include personalizzati in `src/overrides/includes/`:

```njk
<!-- header.njk personalizzato -->
<header class="custom-header">
  <!-- Header personalizzato -->
</header>
```

## Priorità di Risoluzione

Il sistema risolve i file in questo ordine:

1. **Overrides** (`src/overrides/`) - Priorità massima
2. **Tema attivo** (`src/themes/{theme}/`) - Priorità media
3. **Tema di fallback** - Priorità minima

## Versioning dei Temi

### Formato Versione
```
nome-tema@major.minor.patch
es: neutrino-basic@1.0.0
```

### Aggiornamenti
- **Major**: Cambiamenti incompatibili
- **Minor**: Nuove funzionalità compatibili
- **Patch**: Bug fix e miglioramenti

## Utilizzo nei Template

### Include del Tema
```njk
{% include themePath + "/layouts/base.njk" %}
```

### Dati del Tema
```njk
{{ themeData.name }}           <!-- Nome del tema -->
{{ themeData.version }}        <!-- Versione del tema -->
{{ themeData.designTokens }}   <!-- Design tokens -->
```

### Filtro Theme Include
```njk
{{ "styles/main.css" | themeInclude }}
```

## Personalizzazione Avanzata

### 1. CSS Custom Properties
```css
:root {
  --color-primary: #custom-color;
  --spacing-lg: 2rem;
  --font-family-heading: 'Custom Font';
}
```

### 2. Componenti Personalizzati
```scss
.custom-button {
  @extend .btn;
  background: var(--color-accent);
  border-radius: var(--radius-full);
}
```

### 3. Layout Responsive
```scss
@media (max-width: var(--breakpoint-md)) {
  .custom-layout {
    flex-direction: column;
  }
}
```

## Best Practices

### 1. Non Modificare i Temi Originali
- Usa sempre il sistema di override
- Mantieni i temi originali intatti per aggiornamenti

### 2. Organizza le Personalizzazioni
- Raggruppa override correlati
- Usa nomi file descrittivi
- Documenta le modifiche personalizzate

### 3. Testa le Modifiche
- Verifica su diversi dispositivi
- Controlla la compatibilità cross-browser
- Testa con diversi temi

## Troubleshooting

### Tema Non Caricato
- Verifica il nome del tema in `site.json`
- Controlla che la directory del tema esista
- Verifica la sintassi JSON

### Override Non Funzionanti
- Controlla la struttura delle directory
- Verifica i nomi dei file
- Controlla la priorità di risoluzione

### Errori di Compilazione
- Verifica la sintassi SCSS/CSS
- Controlla le dipendenze del tema
- Verifica la compatibilità delle versioni

## Roadmap Futura

- **Theme Builder Online**: Creazione temi via interfaccia web
- **Marketplace Temi**: Repository di temi community
- **Import/Export**: Condivisione configurazioni tema
- **CDN Integration**: Temi preinstallati e aggiornamenti automatici
- **Plugin System**: Estensioni per temi avanzati
