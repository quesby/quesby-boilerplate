---
id: MFNVJ0YI6PM86AJ3U5V00000
title: [Obsoleto] Nuovo sistema di viaggi rapidi - MultiHomeTP
slug: obsoleto-nuovo-sistema-di-viaggi-rapidi-multihometp
description: Multi Home TP: Una nuova mod per spostarsi rapidamente sul server Vintage Story Italia.
date: 2025-09-13T14:58:00.000+02:00
author: The Odd Ape
tags:
  - Server
draft: false
aliases:
  - /blog/obsoleto-nuovo-sistema-di-viaggi-rapidi-multihometp/
image: /img/negozio-trasporti-rapidi.webp
type: news
---

A causa dell'aggiornamento alla 1.21 Teleportation Runes ha smesso di funzionare correttamente. Utilizzando una runa il client crasha istantaneamente anche se al ritorno in gioco ci si ritrova a destinazione.

In attesa di un aggiornamento da parte dell'autore, ho cercato un'alternativa e la ho trovata nella mod [MultiHomeTP](https://mods.vintagestory.at/show/mod/26212).

La mod funziona tramite comandi in chat e permette di settare dei punti di teletrasporto e viaggi rapidi in direzione di questi, ma... a un prezzo. Ogni viaggio rapido costa la stessa distanza in **walkcredits** (crediti di camminata) che si accumulano semplicemente... camminando.

In questo modo i viaggi rapidi resteranno bilanciati impedendo che venga abusato di essi.

## I comandi

##### /sethome \[nome]

Salva la tua posizione attuale come home.

Il nome predefinito è *default* se omesso.

Sovrascrive se esiste già una home con lo stesso nome.

Modalità singola: è consentita solo una home chiamata *default*; qualsiasi altro nome restituisce un errore.

##### /home \[nome]

Teletrasportati a una home salvata.

Il nome predefinito è *default* se omesso.

Ha un tempo di ricarica (HomeCooldownSeconds).

Se i costi di teletrasporto sono abilitati e la destinazione non è gratuita, il costo viene detratto dal tuo credito camminata (vedi *Walk Credit & Costs*).

Imposta la tua posizione precedente per `/back`.

La distanza è calcolata in 3D completo (X, Y, Z).

##### /back

Torna alla posizione precedente (il punto in cui ti trovavi prima dell’ultimo `/home` o `/tospawn`).

Ha un proprio tempo di ricarica (BackCooldownSeconds).

Può costare credito camminata se configurato (vedi *Walk Credit & Costs*).

Disponibile solo se *EnableBackCommand* è impostato su true.

##### /listhomes

Elenca tutti i nomi delle home che possiedi.

##### /homeinfo

Mostra le coordinate di tutte le tue home salvate.

##### /delhome \<nome>

Elimina una home specifica in base al nome.

Modalità singola: solo la home *default* può essere eliminata.

##### /delallhomes

Elimina tutte le tue home.

##### /renamehome \<nomevecchio> \<nomenuovo>

Rinomina una home salvata senza spostarla.

Modalità singola: la rinomina è disabilitata.

##### /tospawn, /tpspawn, /tptospawn

Teletrasportati alla posizione di spawn predefinita del mondo.

Ha un tempo di ricarica (SpawnCooldownSeconds) se abilitato.

Può costare credito camminata se configurato (vedi *Walk Credit & Costs*).

Imposta la tua posizione precedente per `/back`.

Disponibile solo se *EnableSpawnCommands* è impostato su true.

##### /walkcredit

Mostra il tuo credito camminata attuale e un riepilogo delle impostazioni dei costi (interruttore globale e moltiplicatori).

##### /listhomescost

Dalla tua posizione attuale, elenca per ogni home:

* Distanza approssimativa in 3D in blocchi,
* Costo di teletrasporto calcolato (secondo i moltiplicatori attuali),
* Se il tuo credito camminata è sufficiente.

### Player-to-Player Teleport (TP2P) (v1.0.9 e successive)

Disponibilità: le funzioni TP2P sono disponibili solo se *EnableTP2P (tp2pEnabled)* è true. TP2P può avere proprie impostazioni di ricarica e costo; la distanza è calcolata in 3D completo (X, Y, Z).

##### /tp2p \<giocatore>

Invia una richiesta di teletrasporto al giocatore specificato.

Il destinatario deve rispondere con `/tpaccept <giocatore>` o `/tpdeny <giocatore>`.

##### /tpaccept \[giocatore]

Accetta una richiesta TP2P in sospeso dal mittente specificato ed esegue il teletrasporto.

Se i costi di teletrasporto sono abilitati e questo teletrasporto non è gratuito, il costo viene detratto dal tuo credito camminata al momento dell’accettazione (vedi *Walk Credit & Costs*).

Imposta la tua posizione precedente per `/back` (così puoi tornare dove eri prima di accettare).

##### /tpdeny \[giocatore]

Rifiuta una richiesta TP2P in sospeso dal mittente specificato.

##### /tp2pcost \[giocatore]

Mostra il costo del teletrasporto TP2P verso il giocatore specificato; se omesso, mostra il costo verso tutti i giocatori online.