# Video 02b: Die Primzahl-Spirale (Polar-Version, Voice-Skript, ca. 152 Wörter + optional 15, ca. 55 s)

Stil: vollständige, zusammenhängende Sätze. Kein "Hallo", kein Intro.
Jede Zeile = ein Beat im Video. Bitte als eine durchgehende Audiodatei einsprechen.

1. Zeichnet man Zahlen nicht in einer Reihe, sondern rund um einen Punkt, entstehen plötzlich Spiralen, mit denen niemand rechnet.
2. Die Regel ist ganz einfach: Jede Zahl steht so weit von der Mitte entfernt, wie sie groß ist, und wird um genauso viele Schritte gedreht.
3. Etwas mehr als sechs Schritte ergeben eine volle Umdrehung, deshalb landet jede sechste Zahl fast an derselben Stelle, und es wachsen sechs Spiralarme.
4. Behalten wir jetzt nur die Primzahlen, bleiben von den sechs Armen nur zwei übrig, denn auf den anderen liegen nur Vielfache von zwei oder drei.
5. Zoomt man weiter heraus, sieht man vierundvierzig Arme, weil vierundvierzig Schritte fast genau sieben Umdrehungen sind, und die Primzahlen besetzen davon nur zwanzig.
6. Ganz weit draußen werden die Spiralen zu geraden Strahlen, denn siebenhundertzehn Schritte sind fast exakt hundertdreizehn Umdrehungen.
7. Die Spiralen verraten also kein Geheimnis der Primzahlen, sondern zeigen, wie gut man Pi mit einfachen Brüchen annähern kann.
8. (optional, erste Streichung bei Überlänge) Dass auf jedem übrig gebliebenen Arm unendlich viele Primzahlen liegen, hat Dirichlet schon achtzehnhundertsiebenunddreißig bewiesen.

## Fakten-Check (selbst nachgerechnet, research/polar.py)
- Ein "Schritt" = 1 Radiant; eine Umdrehung = 2π ≈ 6,283 Schritte.
- 44/7 = 6,2857 ≈ 2π; 710/113 = 6,28318584 ≈ 2π (Abweichung erst in der 7. Nachkommastelle).
- Primzahlen > 6 liegen nur in 2 von 6 Restklassen, > 44 in 20 von 44, > 710 in 280 von 710 (= φ(6), φ(44), φ(710)).
- Arme 0, 2, 3, 4 (mod 6) enthalten nur Vielfache von 2 oder 3 (außer den Primzahlen 2 und 3 selbst).
- Dirichlet 1837: In jeder Restklasse a mod m mit ggT(a, m) = 1 liegen unendlich viele Primzahlen.
- Quelle der Idee: 3Blue1Brown, "Why do prime numbers make these spirals?" (2019). Eigene Umsetzung, keine Übernahme von Material.
