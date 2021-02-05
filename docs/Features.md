# Features für tactiCS:GO

Die Applikation "tactiCS:GO" richtet sich an E-Sport CS:GO Spieler, die mit ihrem Team im Vorhinein sich verschiedene Taktiken für ihre Wettkämpfe ausdenken, ausklügeln und optimieren möchten. Hierfür können die Nutzer sich eine Karte der Active-Duty-Maps auswählen, um auf dieser mit unterschiedlichen Farben zu zeichnen, Nutzobjekte zu markieren und Spielerpositionen aufzuzeigen. Das alles wird mit allen Nutzern über den Server synchronisiert. Mit dem Reset-Button(s) kann die Karte zum Ursprungszustand zurückgesetzt werden.


<!---
[Notieren und beschreiben Sie hier alle wesentlichen Funktionen bzw. *Features* Ihrer Anwendung. Seien Sie möglichst ausführlich in der Dokumentation und beachten Sie für die Erläuterungen ("Beschreibung") die Perspektive Ihrer NutzerInnen. Schätzen Sie initial den wahrscheinlichen Aufwand - auch um diese Schätzung am Ende des Projekts mit dem tatsächlichen Aufwand vergleichen zu können. Priorisieren Sie die Features hinsichtlich des zentralen *Use Case* Ihrer Anwendung und notieren Sie, welche größeren Bereiche der Anwendung von diesen Funktionen betroffen sind]
--->

| Feature | Beschreibung | Priorität | Geschätzter Aufwand | Betroffene Schichten |
|---------|--------------|-----------|--------------------|---------------------|
| **Auswählbare Map** | Die Nutzer können zwischen den Maps des Active-Duty-Map-Pools auswählen. | hoch | 1 Tag | View |
| **Auf Map zeichnen** | Die Nutzer können auf der Map zeichnen. | kritisch | 4 Tage | View |
| **Zeichenfarbe ändern** | Die Nutzer können die Farbe, mit der sie zeichnen, ändern. | hoch | 0,5 Tage | View |
| **Rauchgranaten, Flashbangs, Decoys, Brandgranaten abbilden** | Die Nutzer können Nutzobjekte auf der Karte einfügen. | kritisch | 2 Tage | View |
| **Chat** | Der Nutzer kann in einem Chatroom mit anderen Nutzern kommunizieren. | nice-to-have | 2 Tage | Server und Client |
| **Spieler-Marker und Bombe als Drag-and-Drop** | Individuelle Spielerfiguren und die Bombe können auf die Map gedragged werden. | kritisch | 3 Tage | View |
| **Togglebare Callouts** | Per toggle-Button kann der Nutzer Callouts ein- und ausblenden. | nice-to-have | 1 Tag | View |
| **Reset-Button(s)** | Mit klicken eines Reset-Buttons können einzelne oder alle Arten von Markern o.ä. zurückgesetzt werden.  | kritisch | 1 Tag | View |
| **Synchronisation der Tafel für mehrere Nutzer** | Der aktuelle Zustand der Tafel (im jeweiligen Raum) wird für alle verbundenen Nutzer synchronisiert, sodass alle Nutzer die gleiche Tafel sehen. Die aktuell verbundenen Nutzer werden aufgelistet. | kritisch | 2 Tage | Server und Client |
| **Private passwortgeschützte Lobbies/Räume** | Es können verschiedene Instanzen der Tafel erzeugt werden, damit mehrere Nutzergruppen/Teams das System gleichzeitig nutzen können. | hoch | 1 Tag | Server
| **Radiergummi** | Nutzer können Gezeichnetes in einem Radius um den Cursor entfernen. | hoch | 1 Tag | View
| **Nutzerspezifischer Radiergummi** | Nutzer können Gezeichnetes, was nur von sich selber stammt, in einem Radius um den Cursor entfernen. | nice-to-have | 1 Tag | View

## Umsetzung

WebSockets, Canvas
<!---
[Beschreiben Sie kurz das geplante Vorgehen bei der Umsetzung der Features. Entwerfen Sie dazu ein oder mehrere *Vertical Slices* anhand derer Sie den zentralen *Use Case* der Anwendung implementieren werden. Geben Sie an, wann welche Funktionen (und in welchem Vollständigkeitsgrad) implementiert werden. Begründen Sie kurz die gewählte Reihenfolge. ]
--->