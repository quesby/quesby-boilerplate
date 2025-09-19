---
id: "MFP4YBYTHRG7Q2440Y000000"
title: "Aggiornamento del server a Vintage Story 1.21: impossibile. Vi spiego perché."
slug: "aggiornamento-del-server-a-vintage-story-121-impossibile-vi-spiego-perch"
description: "Chiarisco il motivo per cui non posso aggiornare Vintage Story Italia alla versione 1.21"
date: "2025-08-30T12:00:00"
author: "Author"
tags:
  - "highlight"
  - "Server"
draft: false
aliases:
  - "/blog/aggiornamento-del-server-a-vintage-story-121-impossibile-vi-spiego-perch/"
seoTitle: "Aggiornamento del server a Vintage Story 1.21: impossibile. Vi spiego perché."
seoDescription: "Chiarisco il motivo per cui non posso aggiornare Vintage Story Italia alla versione 1.21"
image: "problemi-aggiornamento-server-1.21.webp"
type: "news"
---

Dopo aver speso diverse ore a testare il passaggio alla versione 1.21, sono giunto alla conclusione che — al momento — il server non può essere aggiornato.

Il motivo?

Un cambiamento dell’API di gioco, nello specifico nella gestione dei liquidi, che ha rotto tutte le mod che utilizzano quella chiamata.
In pratica, è stato modificato il modo in cui i liquidi vengono gestiti nel codice, rendendo automaticamente incompatibili tutte le mod che ci interagivano.

## Sempre la solita storia
Purtroppo, Vintage Story non è nuovo a questo tipo di cambiamenti. Anzi, è una delle cose più fastidiose e limitanti di tutto il suo ecosistema: ad ogni aggiornamento importante viene “ripulita” l’API… a discapito della compatibilità.

Il che non sarebbe nemmeno un problema — se il gioco non si vantasse pubblicamente di essere orientato alle mod.

> Come si può definire un gioco “open e moddabile” se ad ogni versione spezza, sostituisce o ribalta intere funzionalità già esistenti?

Come ci si può aspettare che i modder — spesso volontari, appassionati, o piccoli gruppi informali — si mettano a riscrivere tutto da capo ogni 4-6 mesi, solo per inseguire l’ultima modifica interna all’engine?

Perché ricordiamolo: **le mod di Vintage Story devono essere open source e non possono essere vendute**.

Quindi parliamo di persone che lavorano gratuitamente nel loro tempo libero — ma che poi vengono trattati come sviluppatori full-time da tenere allineati a ogni refactor.

## Gestire un server

Da gestore di un server ogni volta che esce una nuova versione mi viene male.
Perché da una parte non voglio offrire un'esperienza vanilla — troppo limitata e sciapa secondo me.

Ma dall'altra non posso garantire un aggiornamento rapido, perché quasi sempre salta tutto e servono settimane per capire cosa si può tenere, cosa si deve togliere, e quali mod sono ancora compatibili.

Ma poi perché dovrei essere costretto a togliere delle mod che al momento funzionano? Se le modifiche non nascono da problemi di sicurezza o di instabilitá, perché devono essere implementate ogni volta? Per rendere più elegante il codice? Come è possibile che ad ogni update la maggior parte delle mod non sia più compatibile? Eppure i liquidi c'erano anche prima e le mod ci interagivano.

Io non sono un modder nè tantomeno un programmatore, ma da utente e gestore penso che aggiornare un server dovrebbe essere un'operazione semplice e lineare.

Con Vintage Story, purtroppo, non lo è mai.

Amo questo gioco. Credo sia uno dei migliori sandbox in circolazione.

Ma sul fronte “oriented to modding” ha fallito. E secondo me dovrebbe smettere di usare quello slogan.

Il gioco è bellissimo.

Il gioco è profondo.

Ma non è stabile per il modding — e, a questo punto, forse non lo è mai stato davvero.