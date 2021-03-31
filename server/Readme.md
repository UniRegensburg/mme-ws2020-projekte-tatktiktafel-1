# Quellcode (Node.js)

## server
### AppServer.js

Weitgehend wie vorgegeben. Initialisiert express-Server mit geänderter index-Seite und stellt Colyseus-Client-Library bereit.

### RoomState.js

Colyseus-Repräsentation des Zustandes eines Raumes. Bildet Informationen über aktive Karte des Raumes, Zustand des Canvas und Positionen der Spieler/Bomben-Marker ab.

### TacticsRoom.js

Bildet eine Instanz eines Colyseus-Raumes ab. Beim Erstellen werden Room-ID, Zustand des Raumes initalisiert und einige Default-Parameter initialisiert. Anschließend werden Listener registriert, die auf bestimmte Aktionen der Clients warten und entsprechend den Zustand des Raumes modifizieren. Änderungen am Zustand des Raumes werden automatisch kommuniziert (siehe `onStateChange`-Event in `initColyseusClient()` der Client-[`index.js`](../app/resources/js/index.js)).

## build.js

Zusätzlich zur Vorgabe wird hier die Colyseus-Client-Datei in den `libs`-Ordner kopiert, damit sie bei Initialisierung des Servers über express bereitgestellt werden kann.

## index.js

Zusätzlich zur Vorgabe wird hier auf `/app/:roomId` ein entsprechender get-Handler eingerichtet, sowie der Colyseus-Server gestartet und ein Handler für Räume initialisiert.