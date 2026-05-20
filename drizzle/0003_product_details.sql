ALTER TABLE "products" ADD COLUMN "besonderheiten" text;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "materialien" text;
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "masse" text;
--> statement-breakpoint

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Handgeschliffen und geölt</li><li>Jedes Stück ein Unikat</li><li>Kompatibel mit E27-Leuchtmitteln</li><li>Auf Wunsch mit Dimmer</li></ul>',
  "materialien"    = '<ul><li>Recyceltes Eichenholz (100+ Jahre)</li><li>Mattiertes Messing</li><li>Edison-Glühfaden E27</li><li>Gewebtes Anschlusskabel</li></ul>',
  "masse"          = 'Höhe ca. 42 cm · Sockel 12 × 12 cm · Kabel 180 cm'
WHERE "id" = 1;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Verdeckte Wandverkabelung möglich</li><li>Armlänge individuell anpassbar</li><li>Inkl. Montagematerial</li><li>Geeignet für Innenräume</li></ul>',
  "materialien"    = '<ul><li>Altes Fichtenholz (Patina-Ton)</li><li>Edelstahl-Halterung</li><li>Weißes Textilkabel</li><li>Fassung E14</li></ul>',
  "masse"          = 'Breite ca. 35 cm · Tiefe 18 cm · Höhe 22 cm'
WHERE "id" = 2;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Naturbelassene Baumkante</li><li>Standsicher durch Massivholzfuß</li><li>Schirm separat wählbar</li><li>Auf Wunsch mit Fußschalter</li></ul>',
  "materialien"    = '<ul><li>Massive Altholzbohle (Stadel)</li><li>Naturbelassene Außenkante</li><li>Leinenschirm in Naturton</li><li>Fassung E27, 3-fach schaltbar</li></ul>',
  "masse"          = 'Höhe ca. 165 cm · Fuß 28 × 28 cm · Schirm-Ø 40 cm'
WHERE "id" = 3;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Historisches Baumaterial</li><li>Kabelfarbe wählbar</li><li>Hängehöhe individuell</li><li>Geeignet für Gruppeninstallationen</li></ul>',
  "materialien"    = '<ul><li>Deckenbalkens (19. Jh.)</li><li>Textilkabel schwarz oder naturbeige</li><li>Fassung E27</li><li>Baldachin aus Messing</li></ul>',
  "masse"          = 'Länge ca. 55 cm · Breite 12 cm · Höhe einstellbar bis 200 cm'
WHERE "id" = 4;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Edles Nussholz</li><li>Mit Inline-Schalter</li><li>USB-Ladeport auf Anfrage</li><li>Schlankes, raumschonendes Design</li></ul>',
  "materialien"    = '<ul><li>Nussholz (Weinviertel)</li><li>Inline-Schalter am Kabel</li><li>Fassung E14</li><li>Naturgeölte Oberfläche</li></ul>',
  "masse"          = 'Höhe ca. 28 cm · Sockel Ø 10 cm · Kabel 150 cm'
WHERE "id" = 5;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Wetterfest (IP44)</li><li>Lärchenholz mit Außenöl</li><li>Für Wand- und Pfahlmontage</li><li>Entwickelt natürliche Patina</li></ul>',
  "materialien"    = '<ul><li>Lärchenholz (geölt, witterungsbeständig)</li><li>IP44-zertifizierte Fassung E27</li><li>Edelstahlschrauben</li><li>UV-beständiges Außenöl</li></ul>',
  "masse"          = 'Höhe ca. 30 cm · Breite 18 cm · Tiefe 16 cm'
WHERE "id" = 6;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Einstückige Bohle</li><li>Schwebende Optik</li><li>Länge individuell anpassbar</li><li>Inkl. Montagematerial und Dübel</li></ul>',
  "materialien"    = '<ul><li>Altholzbohle aus Getreidestadel</li><li>Wandhalterungen aus geschwärztem Stahl</li><li>Geölt und gewachst</li><li>Edelstahlschrauben</li></ul>',
  "masse"          = 'Länge ca. 80 cm · Tiefe 20 cm · Stärke 4 cm · Traglast ca. 15 kg'
WHERE "id" = 7;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Seltenes Weinrebenholz</li><li>Entspiegeltes Glas</li><li>Andere Formate auf Anfrage</li><li>Inkl. Aufhänger</li></ul>',
  "materialien"    = '<ul><li>Weinrebenholz (nach Rodungsschnitt)</li><li>Entspiegeltes Glas</li><li>Sperrholzrückwand</li><li>Metallaufhänger</li></ul>',
  "masse"          = 'Außenmaß 28 × 38 cm · Innenmaß 20 × 30 cm · Tiefe 3,5 cm'
WHERE "id" = 8;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Silber-Braun-Patina</li><li>Horizontale &amp; vertikale Montage</li><li>Individuelle Größen auf Anfrage</li><li>Auch als Vollspiegel erhältlich</li></ul>',
  "materialien"    = '<ul><li>Scheunenholz (Silber-Braun-Patina)</li><li>Hochwertiges Spiegelglas</li><li>Rückseitige MDF-Verstärkung</li><li>Doppelte Aufhängung</li></ul>',
  "masse"          = 'Außenmaß 60 × 80 cm · Spiegelfläche 50 × 70 cm · Tiefe 5 cm'
WHERE "id" = 9;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Drei Kerzenaufnahmen</li><li>Auch als Wanddeko</li><li>Wachsschutz durch Metallhülsen</li><li>Kerzengröße wählbar</li></ul>',
  "materialien"    = '<ul><li>Eichenbalken (Presshaus, Klosterneuburg)</li><li>Metallhülsen für Kerzenaufnahmen</li><li>Geölt und gewachst</li><li>Integrierte Wandaufhänger</li></ul>',
  "masse"          = 'Länge ca. 36 cm · Breite 10 cm · Höhe 8 cm · Kerzen-Ø 4 cm'
WHERE "id" = 10;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Lautloses Sweep-Uhrwerk</li><li>Naturbelassene Risse</li><li>Jede Scheibe einzigartig</li><li>Batterie AA inklusive</li></ul>',
  "materialien"    = '<ul><li>Kirschbaumscheibe (Jahresringe sichtbar)</li><li>Lautloses Sweep-Uhrwerk</li><li>Messingpunkte als Ziffern</li><li>Wandhaken aus Edelstahl</li></ul>',
  "masse"          = 'Ø ca. 38–42 cm (naturbedingt variabel) · Stärke 3–4 cm'
WHERE "id" = 11;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Lebensmittelecht geölt</li><li>Zwei Holzarten im Wechsel</li><li>Individuelle Größe möglich</li><li>Spülmaschinenfest (nicht empfohlen)</li></ul>',
  "materialien"    = '<ul><li>Altholz Ahorn und Nuss</li><li>Patinierte Stahlgriffe</li><li>Lebensmittelechtes Öl</li><li>Rutschfester Filzstreifen unten</li></ul>',
  "masse"          = 'Länge 50 cm · Breite 30 cm · Höhe (mit Griff) 8 cm'
WHERE "id" = 12;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Traglast 120 kg</li><li>Kein Span, kein Furnier</li><li>Auch als Beistelltisch</li><li>Individuell in Höhe und Breite</li></ul>',
  "materialien"    = '<ul><li>Massivholzbohle (6 cm stark)</li><li>Eichenvierkant-Kantholz-Beine</li><li>Hartöl-Behandlung</li><li>Filzgleiter unter den Beinen</li></ul>',
  "masse"          = 'Sitzfläche 38 × 38 cm · Höhe 46 cm · Traglast 120 kg'
WHERE "id" = 13;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>3 Ebenen</li><li>Für Innen und Außen</li><li>Kräutergarten-geeignet</li><li>Holzart individuell wählbar</li></ul>',
  "materialien"    = '<ul><li>Altes Obstholz (Apfel, Birne, Kirsche)</li><li>Verbindungen aus Edelstahlschrauben</li><li>Geölt für Außeneinsatz</li><li>Rutschfeste Gummigleiter</li></ul>',
  "masse"          = 'Breite ca. 60 cm · Tiefe 30 cm · Höhe 80 cm (3 Stufen)'
WHERE "id" = 14;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Echtes Weinfassholz</li><li>Würziger Eichenduft</li><li>Gravur auf Anfrage</li><li>Auch als Tischversion</li></ul>',
  "materialien"    = '<ul><li>Weinfass-Dauben (Eiche, weingetränkt)</li><li>Wandhalterungen aus Messing</li><li>Geölt und poliert</li><li>Lasermarkierung möglich</li></ul>',
  "masse"          = 'Breite ca. 55 cm · Tiefe 28 cm · Höhe 35 cm · 6 Flaschen'
WHERE "id" = 15;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Zinkenverbindungen</li><li>Drei Fächer + Stiftehalter</li><li>Holzart nach Verfügbarkeit</li><li>Personalisierbar durch Gravur</li></ul>',
  "materialien"    = '<ul><li>Altholz (Esche oder Eiche, je nach Verfügbarkeit)</li><li>Zinkenverbindungen</li><li>Geölt außen, rau innen</li><li>Filzunterlage</li></ul>',
  "masse"          = 'Breite 28 cm · Tiefe 20 cm · Höhe 18 cm · Stiftehalter Ø 6 cm'
WHERE "id" = 16;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Gravur auf Wunsch</li><li>Naturbelassene Rinde</li><li>Hausnummer oder Name</li><li>Einfache Türmontage</li></ul>',
  "materialien"    = '<ul><li>Altholzscheibe (Rundschnitt)</li><li>Natürliche Rinde als Abschluss</li><li>Geölt und versiegelt</li><li>Türlasche aus Edelstahl</li></ul>',
  "masse"          = 'Ø ca. 18–24 cm (naturbedingt variabel) · Stärke 2,5 cm'
WHERE "id" = 17;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Zwei Holzarten im Kontrast</li><li>Vintage-Messinghaken</li><li>Auch als Schlüsselbrett</li><li>Anzahl Haken wählbar</li></ul>',
  "materialien"    = '<ul><li>Zwei Altholzarten kontrastierend</li><li>Vintage-Messinghaken (3 Stück)</li><li>Hartwachsöl-Behandlung</li><li>Wandschrauben inklusive</li></ul>',
  "masse"          = 'Breite 30 cm · Höhe 12 cm · Tiefe 4 cm'
WHERE "id" = 18;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Lebensmittelecht</li><li>Saftrille eingefräst</li><li>Nachölbar mit Olivenöl</li><li>Auf Wunsch mit Gravur</li></ul>',
  "materialien"    = '<ul><li>Massivholz-Eiche (Altholz)</li><li>Lebensmittelechtes Olivenöl</li><li>Eingefräste Saftrille</li><li>Integrierter Holzgriff</li></ul>',
  "masse"          = 'Länge 45 cm · Breite 28 cm · Stärke 3 cm'
WHERE "id" = 19;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Echtes Schiffsholz</li><li>Folie für Wasserschutz</li><li>Ablauflöcher vorhanden</li><li>Für Balkon und Terrasse</li></ul>',
  "materialien"    = '<ul><li>Alte Schiffsplanken (salzbewittert)</li><li>Teichfolien-Innenschutz</li><li>Edelstahlschrauben</li><li>Ablauflöcher vorgebohrt</li></ul>',
  "masse"          = 'Länge 60 cm · Breite 18 cm · Höhe 20 cm'
WHERE "id" = 20;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Handgeschmiedete Haken</li><li>Länge und Hakenanzahl wählbar</li><li>Für alle Räume geeignet</li><li>Inkl. Dübel und Schrauben</li></ul>',
  "materialien"    = '<ul><li>Altholzbohle (durchgehend)</li><li>Handgeschmiedete Flachstahlhaken (4 Stück)</li><li>Holz geölt</li><li>Edelstahlschrauben für Wandmontage</li></ul>',
  "masse"          = 'Länge ca. 80 cm · Breite 8 cm · Stärke 3 cm · Hakenabstand 18 cm'
WHERE "id" = 21;

UPDATE "products" SET
  "besonderheiten" = '<ul><li>Traglast 120 kg</li><li>Seillänge verstellbar</li><li>Geprüfte Aufhängehardware</li><li>Für Innen und Außen</li></ul>',
  "materialien"    = '<ul><li>Massive Eichenbohle (Altholz)</li><li>Dreifach geflochtenes Hanfseil</li><li>Geprüfte Stahlkarabiner</li><li>Deckenhaken aus Edelstahl</li></ul>',
  "masse"          = 'Brettlänge 60 cm · Breite 20 cm · Stärke 4 cm · Seillänge 80 cm (einstellbar)'
WHERE "id" = 22;
