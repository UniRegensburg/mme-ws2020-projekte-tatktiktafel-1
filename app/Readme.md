# Quellcode (Client)

## css

CSS-Code für die Landing Page und Hauptseite. Der Code für die Hauptseite wurde nach Komponenten aufgeteilt.

## image

Enthält Bilder und Icons zur Darstellung im Client.

### grenades

Icons für Utilities.

### maps

Bilder der CS:GO-Karten, als Hintergrund für den Canvas, auf dem gezeichnet wird.

### marker

Icons für die Spieler- und Bomben-Marker.

## js
### ColyseusProvider.js

Stellt den Colyseus-Client bereit, damit dieser via `import`-Statement importiert werden kann, was sonst nicht direkt funktioniert (vgl. https://github.com/UniRegensburg/mme-ws2020-projekte-tatktiktafel-1/issues/4).

### Config.js

Stellt ein `Config`-Objekt mit Konstanten für den Client-Teil der Anwendung bereit.

### index.js

Quellcode für die Taktiktafel. Es wird zunächst eine Verbindung zum Colyseus-Server hergestellt (wenn ein Raum mit passender ID gefunden wird, dann wird zu diesem verbunden, sonst wird ein neuer Raum erstellt; ID wird aus URL entnommen). Auf diesen Raum werden auch Listener für Änderungen am Zustand des Raumes registriert und gleich automatisch der aktuelle Zustand des Raumes übertragen.

Sämtliche Tools werden anschließend auch initialisiert: Canvas, Optionen, Utilities, Marker und Chat.

### landingpage.js

Quellcode für die Landing Page. Initialisiert Listener auf den entsprechenden Buttons für "Raum erstellen" und "Raum beitreten".

## Maps.js

Stellt ein `maps`-Objekt zur Verfügung, welches Name und Pfad für Bild der Map enthält.

## index.html

HTML-Quellcode für Taktiktafel.

## landingpage.html

HTML-Quellcode für Landing-Page.