---
id: memr4shcqvv6g9jwadpxb0zkxp
title: Why am I building Neutrino CMS?
slug: why-am-i-building-neutrino-cms
description: Reasoning on a new headless CMS.
date: 2025-08-22
author: Green panda Studio
type: post
createdAt: 2025-08-22T11:33:11.856Z
aliases:
    - /blog/why-am-i-building-neutrino-cms/
tags:
  - 
draft: false
---

# Update on Nunjucks implementation for CMS
_Exported on 8/22/2025 at 08:20:39 GMT+2 from Cursor (1.4.5)_

---

**User**

@cursor_implementare_nunjucks_per_il_cms.md questo file per aggiornarti sulla nostra ultima chat

---

**Cursor**

Perfetto! Ho letto il file e sono aggiornato sulla nostra conversazione. ��

## **📋 Riepilogo della Situazione:**

### **✅ Cosa abbiamo implementato:**
- **Nunjucks** integrato nel server API (porta 3001)
- **Template admin** moderni e responsive
- **Dashboard** con statistiche e contenuti recenti
- **Gestione post** completa con template Nunjucks
- **Form creazione** per nuovi post

### **�� Stato attuale:**
- **Porta 3000**: Interfaccia Vue.js originale (Vite)
- **Porta 3001**: Nuova interfaccia Nunjucks + API
- **Due interfacce separate** per permetterti di valutare

### **🎨 Risultato:**
Ti è piaciuta molto la nuova interfaccia Nunjucks! È più elegante, professionale e responsive rispetto alla vecchia interfaccia Vue.js.

## **�� Domande aperte:**
1. **Valutazione**: Stai testando entrambe le interfacce
2. **Futuro**: Se procedere con sostituzione completa o mantenere entrambe
3. **Vue.js/Vite**: Se rimuoverli completamente o mantenerli per l'editor

## **🚀 Prossimi passi possibili:**
- Creare template per pagine e progetti
- Aggiungere autenticazione admin
- Implementare preview contenuti
- Upload immagini
- Editor documenti in Nunjucks (per confronto con Vue.js)

Sono pronto per continuare con qualsiasi funzionalità tu voglia implementare! Cosa preferisci fare ora? 😊

---

**User**

Vorrei che mi spiegassi esattamente come funziona il progetto così che impari a gestirlo da solo. VOrrei sapere ogni funzione cosa fa, a cosa serve, come e perché

---

**Cursor**

Perfetto! Ti spiego tutto il progetto nel dettaglio così che tu possa gestirlo autonomamente. 🎯

Prima di tutto, lasciami esaminare la struttura completa del progetto per darti una spiegazione accurata.


Perfetto! Ora ti spiego **TUTTO** il progetto nel dettaglio. ��

# 🚀 **GUIDA COMPLETA AL PROGETTO NEUTRINO CMS**

## **📋 PANORAMICA GENERALE**

Il progetto è un **CMS (Content Management System)** che gestisce contenuti in formato Markdown con due interfacce diverse:
1. **Interfaccia Vue.js** (porta 3000) - Vecchia interfaccia
2. **Interfaccia Nunjucks** (porta 3001) - Nuova interfaccia moderna

---

## **��️ STRUTTURA DEL PROGETTO**

### **📁 Directory Principali:**
```
neutrino-cms/
├── admin/           # Interfaccia Vue.js (porta 3000)
├── content/         # Contenuti Markdown
├── server/          # API Backend (porta 3001)
├── templates/       # Template Nunjucks
├── schemas/         # Schemi JSON per validazione
└── scripts/         # Script di utilità
```

---

## **⚙️ CONFIGURAZIONE E SCRIPTS**

### **📦 `package.json` - Gestione Dipendenze**

```json
{
    "name": "neutrino-local-cms",
    "version": "1.0.0",
    "type": "module",  // Usa ES6 modules
    "scripts": {
        "dev:api": "nodemon server/api.js",        // Avvia solo l'API
        "dev:admin": "vite",                       // Avvia solo l'admin Vue.js
        "dev": "concurrently \"npm run dev:admin\" \"npm run dev:api\"", // Avvia entrambi
        "build": "echo 'build step (no-op for now)'" // Build placeholder
    }
}
```

**🎯 Cosa fa ogni script:**
- **`dev:api`**: Avvia solo il server API Fastify sulla porta 3001
- **`dev:admin`**: Avvia solo l'interfaccia Vue.js sulla porta 3000
- **`dev`**: Avvia **entrambi** contemporaneamente usando `concurrently`
- **`build`**: Placeholder per il build futuro

**🔧 Dipendenze principali:**
- **`fastify`**: Server web veloce per l'API
- **`nunjucks`**: Template engine per HTML dinamico
- **`vue` + `vite`**: Frontend reattivo e build tool
- **`gray-matter`**: Parsing dei frontmatter Markdown
- **`@fastify/cors`**: Abilita richieste cross-origin

---

## **�� SERVER API (Porta 3001)**

### **📁 `server/api.js` - Il Cuore del Sistema**

Questo file gestisce **TUTTO** il backend del CMS:

#### **🔧 Configurazione Iniziale:**
```javascript
const CONTENT_DIR = path.resolve(__dirname, '../content');    // Dove sono i contenuti
const TEMPLATES_DIR = path.resolve(__dirname, '../templates'); // Dove sono i template
```

#### **🎨 Configurazione Nunjucks:**
```javascript
const env = nunjucks.configure(TEMPLATES_DIR, {
  autoescape: true,                    // Sicurezza HTML
  noCache: process.env.NODE_ENV === 'development' // Disabilita cache in sviluppo
});
```

#### **🔍 Filtri Personalizzati:**
- **`date`**: Converte date in formato italiano
- **`excerpt`**: Tronca testo a lunghezza specificata
- **`slug`**: Converte titoli in URL-friendly

#### **📂 Funzione `walkContent()`:**
```javascript
function walkContent(dir) {
  // Scansiona ricorsivamente la directory content/
  // Trova tutti i file index.md
  // Restituisce array di percorsi completi
}
```

**🎯 Cosa fa:**
- Scansiona la cartella `content/` e sottocartelle
- Trova tutti i file `index.md`
- Restituisce i percorsi per l'API

---

## **🚀 ENDPOINT API**

### **1. `GET /documents` - Lista Tutti i Contenuti**
```javascript
fastify.get('/documents', async () => {
  const files = await walkContent(CONTENT_DIR);           // Trova tutti i file
  const data = await Promise.all(files.map(async file => { // Legge ogni file
    const content = await fs.readFile(file, 'utf8');      // Contenuto raw
    const parsed = matter(content);                       // Separa frontmatter e body
    return {
      id: normalizedId,                                   // ID univoco
      frontmatter: parsed.data,                           // Metadati (titolo, data, etc.)
      excerpt: parsed.content.slice(0, 150)              // Anteprima testo
    };
  }));
  return data;
});
```

**🎯 Cosa restituisce:**
- Array di tutti i contenuti con metadati
- Usato per liste, dashboard, statistiche

### **2. `GET /documents/*` - Legge Contenuto Specifico**
```javascript
fastify.get('/documents/*', async (req, reply) => {
  const id = req.params['*'];                           // ID dal URL (es: "posts/mio-post")
  const filepath = path.join(CONTENT_DIR, ...id.split('/')); // Costruisce percorso file
  const content = await fs.readFile(filepath, 'utf8');   // Legge file
  const parsed = matter(content);                        // Parsing Markdown
  return { 
    frontmatter: parsed.data,                            // Metadati
    body: parsed.content                                 // Contenuto Markdown
  };
});
```

**�� Cosa fa:**
- Legge un contenuto specifico per ID
- Restituisce frontmatter + body separati
- Usato per editing e visualizzazione

### **3. `POST /documents/*` - Salva/Crea Contenuto**
```javascript
fastify.post('/documents/*', async (req, reply) => {
  const id = req.params['*'];                           // ID del contenuto
  const { frontmatter, body } = req.body;               // Dati dal form
  const newContent = matter.stringify(body, frontmatter); // Ricostruisce Markdown
  await fs.writeFile(filepath, newContent, 'utf8');      // Salva su disco
  return { status: 'ok' };
});
```

**�� Cosa fa:**
- Salva modifiche a contenuti esistenti
- Crea nuovi contenuti
- Ricostruisce formato Markdown con frontmatter

### **4. `DELETE /documents/*` - Elimina Contenuto**
```javascript
fastify.delete('/documents/*', async (req, reply) => {
  const id = req.params['*'];
  const filepath = path.join(CONTENT_DIR, ...id.split('/'));
  await fs.unlink(filepath);                            // Elimina file
  return { status: 'deleted', id: id };
});
```

---

## **🎨 INTERFACCIA ADMIN NUNJUCKS (Porta 3001)**

### **📁 Template System:**
```
templates/admin/
├── base.njk          # Layout base con sidebar e stili
├── dashboard.njk     # Dashboard principale
├── posts.njk         # Gestione post
└── create-post.njk   # Form creazione post
```

### **🔗 Endpoint Template:**

#### **`GET /admin/dashboard` - Dashboard Principale**
```javascript
fastify.get('/admin/dashboard', async (req, reply) => {
  const files = await walkContent(CONTENT_DIR);
  const stats = {
    total: files.length,                                // Totale contenuti
    posts: files.filter(f => f.includes('/posts/')).length,     // Numero post
    pages: files.filter(f => f.includes('/pages/')).length,     // Numero pagine
    projects: files.filter(f => f.includes('/projects/')).length // Numero progetti
  };
  
  const context = {
    title: 'Dashboard - Neutrino CMS',
    stats: stats,                                       // Statistiche per template
    recentFiles: files.slice(0, 5).map(f => ({         // 5 file più recenti
      name: path.basename(path.dirname(f)),
      path: path.relative(CONTENT_DIR, f),
      type: path.relative(CONTENT_DIR, path.dirname(f)).split('/')[0]
    })),
    timestamp: new Date().toISOString()
  };
  
  const html = env.render('admin/dashboard.njk', context); // Renderizza template
  reply.type('text/html').send(html);
});
```

**🎯 Cosa fa:**
- Calcola statistiche sui contenuti
- Prepara dati per il template
- Renderizza HTML con Nunjucks

#### **`GET /admin/posts` - Gestione Post**
```javascript
fastify.get('/admin/posts', async (req, reply) => {
  const files = await walkContent(CONTENT_DIR);
  const posts = files
    .filter(f => f.includes('/posts/'))                // Solo file post
    .map(async file => {
      const content = await fs.readFile(file, 'utf8');
      const parsed = matter(content);
      return {
        id: normalizedId,
        frontmatter: parsed.data,                       // Titolo, data, autore
        excerpt: parsed.content.slice(0, 150)          // Anteprima
      };
    });
  
  const context = {
    title: 'Gestione Post - Neutrino CMS',
    active: 'posts',                                    // Menu attivo
    posts: postsData,
    timestamp: new Date().toISOString()
  };
  
  const html = env.render('admin/posts.njk', context);
  reply.type('text/html').send(html);
});
```

---

## **⚛️ INTERFACCIA VUE.JS (Porta 3000)**

### **�� `vite.config.js` - Configurazione Build Tool**
```javascript
export default defineConfig({
  plugins: [vue()],                                    // Plugin Vue.js
  root: './admin',                                     // Directory root per sviluppo
  base: './',                                          // Base URL per build
  build: {
    outDir: '../dist',                                 // Output build
    emptyOutDir: true                                  // Pulisce output
  },
  server: {
    port: 3000                                         // Porta sviluppo
  }
});
```

**🎯 Cosa fa:**
- Configura Vite per Vue.js
- Imposta porta 3000 per sviluppo
- Configura build output

### **📁 `admin/` - Componenti Vue.js**

#### **`main.js` - Entry Point**
```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')                           // Crea app Vue
```

#### **`App.vue` - Componente Principale**
- Gestisce routing tra DocumentList e Editor
- Layout principale dell'applicazione

#### **`DocumentList.vue` - Lista Documenti**
- Mostra tutti i contenuti disponibili
- Permette selezione per editing
- Interfaccia con l'API `/documents`

#### **`Editor.vue` - Editor Contenuti**
- Form per editing frontmatter e body
- Salva modifiche via API POST
- Gestisce formattazione Markdown

---

## **�� GESTIONE CONTENUTI**

### **🏗️ Struttura Contenuti:**
```
content/
├── pages/           # Pagine statiche (chi siamo, contatti)
│   └── about/
│       └── index.md # Contenuto pagina
├── posts/           # Post del blog
│   └── primo-post/
│       └── index.md # Contenuto post
└── projects/        # Progetti portfolio
    └── sito-neutrino/
        └── index.md # Contenuto progetto
```

### **📄 Formato File Markdown:**
```markdown
---
title: "Titolo del Post"
date: "2024-01-15"
author: "Il Tuo Nome"
description: "Descrizione del post"
tags: ["tag1", "tag2"]
draft: false
---

# Contenuto del Post

Questo è il contenuto in Markdown...
```

**🎯 Frontmatter:**
- **`title`**: Titolo del contenuto
- **`date`**: Data di pubblicazione
- **`author`**: Autore
- **`description`**: Descrizione breve
- **`tags`**: Categorie/tag
- **`draft`**: Se è bozza o pubblicato

---

## **🔄 FLUSSO DI FUNZIONAMENTO**

### **�� Dashboard:**
1. **Utente visita** `/admin/dashboard`
2. **API chiama** `walkContent()` per scansionare contenuti
3. **Calcola statistiche** (totale, post, pagine, progetti)
4. **Prepara contesto** per template Nunjucks
5. **Renderizza HTML** con dati dinamici
6. **Restituisce pagina** completa al browser

### **✏️ Creazione Post:**
1. **Utente visita** `/admin/create/post`
2. **API renderizza** template form
3. **Utente compila** form e invia
4. **JavaScript frontend** raccoglie dati
5. **Chiama API** `POST /documents/posts/nome-post`
6. **API salva** file Markdown su disco
7. **Redirect** a lista post

### **�� Editing Contenuto:**
1. **Utente seleziona** contenuto da DocumentList
2. **Vue.js carica** contenuto via `GET /documents/id`
3. **Mostra form** con dati esistenti
4. **Utente modifica** e salva
5. **Vue.js invia** `POST /documents/id`
6. **API aggiorna** file su disco

---

## **🔧 COME GESTIRE IL PROGETTO**

### **�� Avvio Sviluppo:**
```bash
npm run dev          # Avvia entrambi (porta 3000 + 3001)
npm run dev:api      # Solo API (porta 3001)
npm run dev:admin    # Solo Vue.js (porta 3000)
```

### **📁 Aggiungere Nuovi Contenuti:**
1. **Crea cartella** in `content/posts/` o `content/pages/`
2. **Crea file** `index.md` con frontmatter e contenuto
3. **Riavvia server** se necessario
4. **Contenuto appare** automaticamente nell'admin

### **🎨 Modificare Template:**
1. **Edita file** `.njk` in `templates/admin/`
2. **Salva** - Nunjucks ricarica automaticamente
3. **Ricarica pagina** nel browser

### **🔌 Aggiungere Nuove API:**
1. **Aggiungi endpoint** in `server/api.js`
2. **Riavvia server** (nodemon lo fa automaticamente)
3. **Testa** con Postman o browser

---

## **�� VANTAGGI DELL'ARCHITETTURA**

### **✅ Separazione Responsabilità:**
- **API**: Gestione dati e logica business
- **Template**: Presentazione HTML
- **Vue.js**: Interattività e editing

### **✅ Flessibilità:**
- **Nunjucks**: Template riutilizzabili e mantenibili
- **Vue.js**: Interfaccia reattiva per editing
- **Fastify**: API veloce e scalabile

### **✅ Manutenibilità:**
- **Codice modulare** e ben organizzato
- **Template separati** dal codice
- **API RESTful** standard

---

## **🚨 PROBLEMI COMUNI E SOLUZIONI**

### **❌ "Port already in use"**
```bash
# Trova processo sulla porta
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Termina processo
taskkill /PID <numero_processo> /F
```

### **❌ Template non si aggiorna**
- **Verifica percorso** template in `TEMPLATES_DIR`
- **Ricarica pagina** browser
- **Controlla errori** console server

### **❌ Contenuti non appaiono**
- **Verifica struttura** cartelle `content/`
- **Controlla nomi** file (deve essere `index.md`)
- **Riavvia server** API

---

## **�� PROSSIMI PASSI SUGGERITI**

1. **Testare tutte le funzionalità** esistenti
2. **Creare template** per pagine e progetti
3. **Aggiungere autenticazione** admin
4. **Implementare preview** contenuti
5. **Aggiungere upload** immagini
6. **Creare frontend pubblico** del sito

---

**🎉 Ora hai una comprensione completa del progetto!** 

Puoi:
- **Modificare template** Nunjucks
- **Aggiungere nuove API** endpoint
- **Gestire contenuti** Markdown
- **Personalizzare interfacce** admin
- **Debugging** e troubleshooting

Hai domande specifiche su qualche parte o vuoi che ti mostri come implementare nuove funzionalità? 😊

```plaintext
neutrino-cms/
├── admin/           # Interfaccia Vue.js (porta 3000)
├── content/         # Contenuti Markdown
├── server/          # API Backend (porta 3001)
├── templates/       # Template Nunjucks
├── schemas/         # Schemi JSON per validazione
└── scripts/         # Script di utilità
```

```json
{
    "name": "neutrino-local-cms",
    "version": "1.0.0",
    "type": "module",  // Usa ES6 modules
    "scripts": {
        "dev:api": "nodemon server/api.js",        // Avvia solo l'API
        "dev:admin": "vite",                       // Avvia solo l'admin Vue.js
        "dev": "concurrently \"npm run dev:admin\" \"npm run dev:api\"", // Avvia entrambi
        "build": "echo 'build step (no-op for now)'" // Build placeholder
    }
}
```

```javascript
const CONTENT_DIR = path.resolve(__dirname, '../content');    // Dove sono i contenuti
const TEMPLATES_DIR = path.resolve(__dirname, '../templates'); // Dove sono i template
```

```javascript
const env = nunjucks.configure(TEMPLATES_DIR, {
  autoescape: true,                    // Sicurezza HTML
  noCache: process.env.NODE_ENV === 'development' // Disabilita cache in sviluppo
});
```

```javascript
function walkContent(dir) {
  // Scansiona ricorsivamente la directory content/
  // Trova tutti i file index.md
  // Restituisce array di percorsi completi
}
```

```javascript
fastify.get('/documents', async () => {
  const files = await walkContent(CONTENT_DIR);           // Trova tutti i file
  const data = await Promise.all(files.map(async file => { // Legge ogni file
    const content = await fs.readFile(file, 'utf8');      // Contenuto raw
    const parsed = matter(content);                       // Separa frontmatter e body
    return {
      id: normalizedId,                                   // ID univoco
      frontmatter: parsed.data,                           // Metadati (titolo, data, etc.)
      excerpt: parsed.content.slice(0, 150)              // Anteprima testo
    };
  }));
  return data;
});
```

```javascript
fastify.get('/documents/*', async (req, reply) => {
  const id = req.params['*'];                           // ID dal URL (es: "posts/mio-post")
  const filepath = path.join(CONTENT_DIR, ...id.split('/')); // Costruisce percorso file
  const content = await fs.readFile(filepath, 'utf8');   // Legge file
  const parsed = matter(content);                        // Parsing Markdown
  return { 
    frontmatter: parsed.data,                            // Metadati
    body: parsed.content                                 // Contenuto Markdown
  };
});
```

```javascript
fastify.post('/documents/*', async (req, reply) => {
  const id = req.params['*'];                           // ID del contenuto
  const { frontmatter, body } = req.body;               // Dati dal form
  const newContent = matter.stringify(body, frontmatter); // Ricostruisce Markdown
  await fs.writeFile(filepath, newContent, 'utf8');      // Salva su disco
  return { status: 'ok' };
});
```

```javascript
fastify.delete('/documents/*', async (req, reply) => {
  const id = req.params['*'];
  const filepath = path.join(CONTENT_DIR, ...id.split('/'));
  await fs.unlink(filepath);                            // Elimina file
  return { status: 'deleted', id: id };
});
```

```plaintext
templates/admin/
├── base.njk          # Layout base con sidebar e stili
├── dashboard.njk     # Dashboard principale
├── posts.njk         # Gestione post
└── create-post.njk   # Form creazione post
```

```javascript
fastify.get('/admin/dashboard', async (req, reply) => {
  const files = await walkContent(CONTENT_DIR);
  const stats = {
    total: files.length,                                // Totale contenuti
    posts: files.filter(f => f.includes('/posts/')).length,     // Numero post
    pages: files.filter(f => f.includes('/pages/')).length,     // Numero pagine
    projects: files.filter(f => f.includes('/projects/')).length // Numero progetti
  };
  
  const context = {
    title: 'Dashboard - Neutrino CMS',
    stats: stats,                                       // Statistiche per template
    recentFiles: files.slice(0, 5).map(f => ({         // 5 file più recenti
      name: path.basename(path.dirname(f)),
      path: path.relative(CONTENT_DIR, f),
      type: path.relative(CONTENT_DIR, path.dirname(f)).split('/')[0]
    })),
    timestamp: new Date().toISOString()
  };
  
  const html = env.render('admin/dashboard.njk', context); // Renderizza template
  reply.type('text/html').send(html);
});
```

```javascript
fastify.get('/admin/posts', async (req, reply) => {
  const files = await walkContent(CONTENT_DIR);
  const posts = files
    .filter(f => f.includes('/posts/'))                // Solo file post
    .map(async file => {
      const content = await fs.readFile(file, 'utf8');
      const parsed = matter(content);
      return {
        id: normalizedId,
        frontmatter: parsed.data,                       // Titolo, data, autore
        excerpt: parsed.content.slice(0, 150)          // Anteprima
      };
    });
  
  const context = {
    title: 'Gestione Post - Neutrino CMS',
    active: 'posts',                                    // Menu attivo
    posts: postsData,
    timestamp: new Date().toISOString()
  };
  
  const html = env.render('admin/posts.njk', context);
  reply.type('text/html').send(html);
});
```

```javascript
export default defineConfig({
  plugins: [vue()],                                    // Plugin Vue.js
  root: './admin',                                     // Directory root per sviluppo
  base: './',                                          // Base URL per build
  build: {
    outDir: '../dist',                                 // Output build
    emptyOutDir: true                                  // Pulisce output
  },
  server: {
    port: 3000                                         // Porta sviluppo
  }
});
```

```javascript
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')                           // Crea app Vue
```

```plaintext
content/
├── pages/           # Pagine statiche (chi siamo, contatti)
│   └── about/
│       └── index.md # Contenuto pagina
├── posts/           # Post del blog
│   └── primo-post/
│       └── index.md # Contenuto post
└── projects/        # Progetti portfolio
    └── sito-neutrino/
        └── index.md # Contenuto progetto
```

```markdown
---
title: "Titolo del Post"
date: "2024-01-15"
author: "Il Tuo Nome"
description: "Descrizione del post"
tags: ["tag1", "tag2"]
draft: false
---

# Contenuto del Post

Questo è il contenuto in Markdown...
```

```shellscript
npm run dev          # Avvia entrambi (porta 3000 + 3001)
npm run dev:api      # Solo API (porta 3001)
npm run dev:admin    # Solo Vue.js (porta 3000)
```

```shellscript
# Trova processo sulla porta
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Termina processo
taskkill /PID <numero_processo> /F
```

