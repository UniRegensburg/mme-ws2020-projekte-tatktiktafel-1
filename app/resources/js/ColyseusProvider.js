/* global Colyseus */

/** Colyseus wird in der index.html via script-Tag importiert.
 * Diese Datei dient als Ersatz zur import-Syntax und dient hauptsächlich dazu,
 * dass nicht beim Einsatz des Clients immer Colyseus gegenüber dem Linter als globale Variable spezifiziert werden muss, dies passiert hier.
 * Stattdessen sollte dieses Modul hier wie folgt importiert werden:
 * import Colyseus from "/app/resources/js/ColyseusProvider.js"
 */

export default Colyseus;