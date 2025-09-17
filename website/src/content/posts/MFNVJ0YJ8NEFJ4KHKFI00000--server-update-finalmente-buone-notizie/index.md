---
id: MFNVJ0YJ8NEFJ4KHKFI00000
title: Server Update: finalmente buone notizie!
slug: server-update-finalmente-buone-notizie
description: Finalmente delle buone notizie per il passaggio del server alla versione 1.21 di Vintage Story
date: 2025-08-31T12:00:00
author: Author
tags:
  - highlight
  - vintagestoryitalia
  - Server
draft: false
aliases:
  - /blog/server-update-finalmente-buone-notizie/
image: /img/aggiornamento-1.21-buone-notizie.webp
type: news
---

Finalmente arrivano delle buone notizie sulla faccenda e sembra che sia possibile **migrare Vintage Story Italia alla versione 1.21 di Vintage Story**. Quindi il titolo del mio ultimo articolo non è corretto 😅

Dopo una giornata molto frustrante durante la quale mi sono trovato a lottare con errori delle mod e Vintage Story che si ostinava prendere dati un po' dalla cartella di lancio e un po' dalla cartella **%appdata%/VintageStoryData**, sono riuscito a venire a capo della situazione.

### Vintage Story e le cartelle
Per risolvere il problema delle cartelle miste ho risolto creando un link con variabile **--dataPath** nella riga di comando. Era stata la mia prima intenzione, ma per qualche motivo all'inizio non ha funzionato e quindi, come spesso accade, ho provato di tutto prima di ritornarci.

### A Culinary Artillery + Expanded Foods
Questo è stato il primo ostacolo, ovvero una chiamata a una funzione di gestione dei liquidi che non funziona più in VS 1.21. Non so cosa possa essere cambiato... magari il nome della funzione o l'ordine/numero dei parametri oppure è stata del tutto rimossa. Fattostà che questa grossa mod non è compatibile con la 1.21.

Notoriamente [A Culinary Artillery](https://mods.vintagestory.at/aculinaryartillery) non è mai stata tra le prime ad essere aggiornate ed ha spesso causato problemi durante gli aggiornamenti. Uno dei mantenitori della mod ha commentato 3 giorni fa sulla pagina del ModDB:

<img src="/static/images/blog/A-Culinary-Artillery-Pursec-comment.webp">

>Ciao, solo un aggiornamento per chi non segue i thread su Discord. La mod è ancora in fase di aggiornamento insieme a EF! Non siamo ancora completamente morti. Nel frattempo sentitevi liberi di usare fork alternativi se volete, ma un aggiornamento ufficiale arriverà (si spera) presto! Grazie!
  "Pursec"

Quindi si può sperare in un aggiornamento nel prossimo futuro.
Nel frattempo [Agamand](https://mods.vintagestory.at/show/user/59D3C29CCCDCAF344D73) ha realizzato una patch che permette di utilizzare la mod in 1.21 e io ho scaricato quella.

### XSkills
Esatto... ci sono di mezzo pure le XSkills.

Anche le [XSkills](https://mods.vintagestory.at/show/mod/247) non sono note per essere le mod più rapide ad essere aggiornate e il loro modder [Xandu](https://mods.vintagestory.at/show/user/4EDDA391AB6ACB178188) sembra essere svanito. Nessuna notizia al momento.

La [XLib](https://mods.vintagestory.at/show/mod/244) genera una sfilza infinita di errori nella 1.21 e non permette al server di partire correttamente.

Anche in questo caso due patch, stavolta di [rabite](https://mods.vintagestory.at/show/user/33F0DBC9613DAF99A649), hanno tamponato la situazione, però non senza intoppi.

Per i test in locale ho scaricato l'intera cartella /data che contiene tutti i dati del server, dalla configurazione, ai file di salvataggio, alle informazioni di mod e giocatori. Per questo motivo mi sono stupito quando le patch hanno fatto funzionare le XSkills ma il mio Drayton aveva tutte le skill resettate.

Ho aperto e controllato tutti i file di configurazione che ho trovato, imparando diverse cose nel frattempo, ma tutto mi è sembrato apposto.

E infatti al terzo riavvio del server locale Drayton ha riavuto indietro tutte le sue skill.

Non ho la più pallida idea nè di come nè del perché, ma ora sembrano funzionare correttamente. Ho anche testato diverse skill forgiando e compiendo le azioni relative e si, funziona tutto.

### Food Shelves
Infine parliamo di [Food Shelves](https://mods.vintagestory.at/foodshelves) che al momento non funziona e fa crashare il client ad ogni interazione.

Ho trovato questo commento fresco fresco del modder:

<img src="/static/images/blog/Food-Shelves-Sonzina.webp">

>Food Shelves al momento non ha una versione per la 1.21, non è compatibile. Un aggiornamento è in arrivo e verrà rilasciato prima o poi.
"SONZINA"

Per questa mod non ho trovato alcuna patch miracolosa e quindi la soluzione al momento è disattivarla ed attendere un suo update.

Quindi chiedo a tutti voi utenti del server di spostare tutti i cibi e bevande in contenitori vanilla e di rimuovere tutti i contenitori della Food Shelves che avete.

Personalmente ho messo tutto da parte in una cassa seprando che con l'update i contenitori possano essere riutilizzati. Questo non sembra fare crashare il server perché la cassa è piena soltanto di tanti oggetti senza un riferimento e che sono visualizzati con la classica texture bianca col punto di domanda rosso.

### Si ma Ape quando aggiorni il server?
Fosse per me lo aggiornerei anche adesso, ma voglio dare prima il tempo a tutti i giocatori di sistemare i contenitori della Food Shelves.

Romperò le scatole su Discord per qualche giorno finché non verrà fatto e poi aggiornerò.

Ovviamente vi farò sapere quando il server verrà aggiornato.

Fino ad allora statemi bene, un saluto e a presto.