# Features für tactiCS:GO

Die Applikation "tactiCS:GO" richtet sich an E-Sport CS:GO Spieler, die mit ihrem Team im Vorhinein sich verschiedene Taktiken für ihre Wettkämpfe ausdenken, ausklügeln und optimieren möchten. Hierfür können die Nutzer sich eine Karte der Active-Duty-Maps auswählen, um auf dieser mit unterschiedlichen Farben zu zeichnen, Nutzobjekte zu markieren und Spielerpositionen aufzuzeigen. Das alles wird mit allen Nutzern über den Server synchronisiert. Mit dem Reset-Button(s) kann die Karte zum Ursprungszustand zurückgesetzt werden.


<!---
[Notieren und beschreiben Sie hier alle wesentlichen Funktionen bzw. *Features* Ihrer Anwendung. Seien Sie möglichst ausführlich in der Dokumentation und beachten Sie für die Erläuterungen ("Beschreibung") die Perspektive Ihrer NutzerInnen. Schätzen Sie initial den wahrscheinlichen Aufwand - auch um diese Schätzung am Ende des Projekts mit dem tatsächlichen Aufwand vergleichen zu können. Priorisieren Sie die Features hinsichtlich des zentralen *Use Case* Ihrer Anwendung und notieren Sie, welche größeren Bereiche der Anwendung von diesen Funktionen betroffen sind]
--->

| Feature | Beschreibung | Priorität | Geschätzter Aufwand | Betroffene Schichten |
|---------|--------------|-----------|--------------------|---------------------|
| **Auswählbare Map** | Die Nutzer können zwischen den Maps des Active-Duty-Map-Pools auswählen. | hoch | 1 Tag | View |
| **Interaktive Karte** | Die Nutzer können mit der o.g. Map interagieren: zoomen, Bild verschieben, zeichnen. | kritisch | 4 Tage | View |
| **Zeichenfarbe ändern** | Die Nutzer können die Farbe, mit der sie zeichnen, ändern. | hoch | 0,5 Tage | View |
| **Rauchgranaten, Flashbangs, Decoys, Brandgranaten abbilden** | Die Nutzer können Nutzobjekte auf der Karte einfügen. Nutzer wählen ein Tool aus und können durch klicken auf die Karte die Objekte platzieren. Platzierte Objekte können einzeln gelöscht werden. | kritisch | 2 Tage | View |
| **Chat** | Der Nutzer kann in einem Chatroom mit anderen Nutzern kommunizieren. | nice-to-have | 2 Tage | Server und Client |
| **Spieler-Marker und Bombe als Drag-and-Drop** | Individuelle Spielerfiguren und die Bombe können auf die Map gedragged werden. | kritisch | 3 Tage | View |
| **Togglebare Callouts** | Per toggle-Button kann der Nutzer Callouts ein- und ausblenden. | nice-to-have | 1 Tag | View |
| **Reset-Button(s)** | Mit klicken eines Reset-Buttons können einzelne oder alle Arten von Markern o.ä. zurückgesetzt werden.  | kritisch | 1 Tag | View |
| **Synchronisation der Tafel für mehrere Nutzer** | Der aktuelle Zustand der Tafel (im jeweiligen Raum) wird für alle verbundenen Nutzer synchronisiert, sodass alle Nutzer die gleiche Tafel sehen. Die aktuell verbundenen Nutzer werden aufgelistet. | kritisch | 2 Tage | Server und Client |
| **Private passwortgeschützte Lobbies/Räume** | Es können verschiedene Instanzen der Tafel erzeugt werden, damit mehrere Nutzergruppen/Teams das System gleichzeitig nutzen können. | hoch | 1 Tag | Server
| **Radiergummi** | Nutzer können Gezeichnetes in einem Radius um den Cursor entfernen. | hoch | 1 Tag | View |
| **Nutzerspezifischer Radiergummi** | Nutzer können Gezeichnetes, was nur von sich selber stammt, in einem Radius um den Cursor entfernen. | nice-to-have | 1 Tag | View |
| **Marker** | Nutzer können temporäre Marker erstellen. | hoch | 0,5 Tag | View |
| **Laserpointer** | Nutzer können einen Laserpointer togglen, der dauerhaft ihre Mausposition an die anderen User überträgt. | hoch | 1 Tag | View |
| **Taktik-Tabs** | Nutzer können verschiedene Taktiken auf unterschiedlichen Karten innerhalb eines Raumes erstellen. | nice-to-have | 2 Tage | View |
| **Timeline** | Nutzer können in einer Timeline neue Timestemps erstellen, bei denen die Spieler- und Bombenposition von dem vorherigen Timestemp übernommen werden. | hoch | 2 Tage | View |
| **Timestamps to Picture** | Nutzer können sich die Timestamps als Bild rendern und herunterladen. Entweder einzeln oder eine ganze Taktik auf einmal als ZIP/PDF (?) | nice-to-have | 1 Tag | View |
| **Landingpage** | Beim Öffnen der Webseite landen die Nutzer auf einer Landingpage, auf der sie einen neuen Raum erstellen oder einem Raum über einen Key beitreten können. | hoch | 1 Tag | View |


## Umsetzung

Bei der Umsetzung werden die Features in der Regel direkt Vollständig implementiert. Wir haben uns für folgende Reihenfolge bei der Implementierung entschieden, da hier wichtige Features zuerst implementiert werden, auf die andere Features im späteren Verlauf aufbauen. Außerdem wird hier die Priorität berücksichtigt. Das UI jedoch wird dabei parrallel zu den ersten Features entwickelt. 

1.  Auf Whiteboard zeichnen, automatische Anmeldung im Default-Raum
2.  Map (Hintergrund) anzeigen
3.  Spieler-Marker und Bombe implementieren
4.  Utilities (Smokes etc) implementieren
5.  Reset Button(s)
6.  auswählbare Maps
7.  auswählbare Zeichenfarben
8.  Radiergummi
9.  Marker
10. Timeline
11. Taktik-Tabs
12. Private Räume/Landing Page
13. togglebare Callouts
14. Chat
15. Nutzerspezifischer Radiergummi
16. Laserpointer
17. Timestamps to Picture


## Beispielhafter Usecase

Ein Spieler erzeugt über die Landingpage einen Raum und erhält einen Code/Link (wird angezeigt und/oder direkt in Zwischenablage kopiert), den er an seine Teammitglieder verteilen kann. Mitglieder eines Raumes können die dort zur Verfügung stehenden Tools nutzen, um auf einer ausgewählten CS:GO Karte Marker zu platzieren und sie zu annotieren, um ihre Taktik bildlich zu kommunizieren. Es können innerhalb eines Raumes mehrere Taktiken mit unterschiedlichen oder gleichen Karten erzeugt werden. Jede Taktik besteht aus einem oder mehreren Timestamps. Die Räume bleiben auch ohne dass jemand in diesem anwesend ist für einige Zeit (tbd) erhalten. Um ihre Taktiken über diese Zeit hinaus zu persistieren, können Nutzer diese als Bild rendern und herunterladen.

<!-- Wie fängts an
Wie läuft es ab
Wie endet es

Zeitliche Abläufe darstellen
Mehrere Taktiken


evtl. colyseus benutzen


Abschluss durch Persistieren; Rückkehr zum Raum, exportieren als Bild?
Zeitliche Ebene durch mehrere Tafeln in einem Raum? 
-->

<!---
[Beschreiben Sie kurz das geplante Vorgehen bei der Umsetzung der Features. Entwerfen Sie dazu ein oder mehrere *Vertical Slices* anhand derer Sie den zentralen *Use Case* der Anwendung implementieren werden. Geben Sie an, wann welche Funktionen (und in welchem Vollständigkeitsgrad) implementiert werden. Begründen Sie kurz die gewählte Reihenfolge. ]
--->

<!---
Sollte Karte interaktiv sein? Zoom etc. Scrolling / Verschieben
In Feature Liste konkretisieren

Bessere Begriffe: z.B. statt Timestamp Phase/Frame
Begriff Playbooks

Software Engineering:
Eigenschaften von Usern, Räumen
Userinterface
- Map noch zentraler, App vielleicht als Fullscreen, randlos mit Icons über der Map
Gesamtstruktur der Anwendung auf einem Whiteboard zusammenfassen
https://en.wikipedia.org/wiki/Class-responsibility-collaboration_card

Wie Anwendung strukturieren
Wie funktioniert Colysseus
Beide Seiten zusammenbringen
Auf dieser Basis die Anwendung aufbauen

Im Laufe der Woche machen und Herrn Bazo im Discord anpingen
--->
