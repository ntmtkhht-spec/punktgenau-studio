export interface Cue {
  readonly from: number;
  readonly to: number;
  readonly text: string; // *Wort* = hervorgehoben
}

/** Untertitel als Sprachersatz. Zeiten in Sekunden, max. ~15 Zeichen/s. */
export const CUES: readonly Cue[] = [
  {from: 0.3, to: 2.8, text: 'Wie erkennt eine KI, *was* das hier ist?'},
  {from: 2.8, to: 5.0, text: 'Der Trick ist überraschend *simpel*.'},
  {from: 5.0, to: 8.0, text: 'Schau dir einfach die *Nachbarn* an.'},
  {from: 8.0, to: 11.0, text: 'Wer nah ist, gehört wohl *dazu*.'},
  {from: 11.0, to: 14.0, text: 'Nähe messen wir als *Abstand*.'},
  {from: 14.0, to: 18.0, text: 'Dafür reicht der *Satz des Pythagoras*.'},
  {from: 18.0, to: 21.0, text: 'Berechne ihn zu *jedem* Punkt.'},
  {from: 21.0, to: 24.0, text: 'Jetzt wählst du *k*, die Anzahl der Nachbarn.'},
  {from: 24.0, to: 27.0, text: 'Hier ist k = *3*: Die drei Nächsten zählen.'},
  {from: 27.0, to: 30.0, text: 'Zwei *orange*, einer blau.'},
  {from: 30.0, to: 33.0, text: 'Mehrheit gewinnt: Der Punkt ist *orange*!'},
  {from: 33.0, to: 36.0, text: 'Aber *k* entscheidet alles.'},
  {from: 36.0, to: 39.5, text: 'Bei k = 1 zählt nur *ein* Nachbar, und der ist blau.'},
  {from: 39.5, to: 43.0, text: 'Zu kleines k reagiert auf *Rauschen*.'},
  {from: 43.0, to: 46.0, text: 'Zu großes k *verwischt* alles.'},
  {from: 46.0, to: 49.5, text: 'Abstand messen, *k* Nachbarn wählen, abstimmen.'},
  {from: 49.5, to: 53.0, text: 'Ähnliches liegt *nah* beieinander.'},
];
