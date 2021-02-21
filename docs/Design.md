# Software Desing für tactiCS:GO

<!--
[Beschreiben Sie hier die intendierte Code-Struktur Ihrer Anwendung. Notieren Sie wesentliche Module oder Konzepte, entlang derer sich Ihre Anwendung strukturieren lässt. Gehen Sie dabei auch auf grundlegende Architekturen, z.B. die Unterscheidung von Server- und Client-Anwendung ein und beschreiben Sie die Art und Weise, wie Teilkomponenten miteinander kommunizieren werden. Entwerfen Sie Strukturen und Vorgaben für zentrale Datenobjekte und geben Sie an, welche Teilbereiche der Anwendung unter Verwendung externe APIs oder Bibliotheken umgesetzt werden sollen. Erweitern und Überarbeiten Sie dieses Dokument im Verlauf des Projektes. Hier soll stets eine aktuelle Dokumentation des aktuell geplanten bzw. umgesetzten Software Designs einsehbar sein.]
-->

## Colyseus (Back-end)
### Server
- Managet die Räume. Räume können über die .define()-Methode einem Handler zugewiesen werden.
- Collaborations: Landing-Page, Room

### Client
- Erstellt parallel zur Erstellung oder Beitreten eines Raumes
- Client-side Repräsentation des Rooms enthält eine .send()-Methode, mit welche Modifikationen am Zustand an den Raum kommuniziert werden können.
- Collaborations: Room

### Room
- Room kann auf Landing-Page erstellt werden
- Room kann per ID/Link beigetreten werden
- Wird vom Colyseus-Server gemanaget
- Collaborations: Client, Server, Landing-Page, Schema
  
### Schema
- Enthält eine Sammlung, welche den aktuellen Zustand des Raumes repräsentiert. Wird beim Erstellen des Raumes (.onCreate()) initialisiert und beim Erhalten von Nutzerinput (.onMessage()) modifiziert und anschließend automatisch synchronisiert.
- Collaborations: Room
<!--
### User
- managet einen einzelnen Nutzer 
- Collobarations: Client 
-->
___
## View (Front-end)
### Landing Page
- Seite auf der der User landet, wenn er über Google etc. auf die Seite kommt
- User kann hier einen neuen Raum erstellen
- User kann einem Raum mit einer ID beitreten
- Interagiert mit Server zur Erstellung neuer Räume und Zuweisung von Clients
- Collaborations: Client, Room, Server

### User Inputs
- Alle Buttons und ähnliches werden angezeigt, wenn einem Raum beigetreten wurde
- Alle Benutzereingaben werden an den Room weitergegeben, wenn der Benutzer welche tätigt
- Die einzelnen Arten von User-Inputs werden entsprechend wo möglich modularisiert.
- Collaborations: Client, Room

### Render
- Aktueller Status des Rooms wird visualisiert: die Karte, Pfeile, Spielerpositionen, Nutzobjekte, etc.
- Wird via room.onStateChange() aktiviert.
- Collaborations: Room (Client)