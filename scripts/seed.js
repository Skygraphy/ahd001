// Einmaliges Befüllen der Datenbank mit den 22 Altholz-Produkten
// Voraussetzung: .env mit DATABASE_URL gesetzt
// Ausführen: node --env-file=.env scripts/seed.js

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { products, productImages } from '../src/lib/server/schema.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_PATH = join(__dirname, '../drizzle');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Fehler: DATABASE_URL nicht gesetzt. Bitte .env Datei anlegen.');
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db  = drizzle(sql);

// Migration ausführen (erstellt Tabelle falls noch nicht vorhanden)
await migrate(db, { migrationsFolder: MIGRATIONS_PATH });

const seedProducts = [
  { name: 'Tischlampe No.1',              description: 'Handgefertigte Tischlampe aus recyceltem Eichenholz mit warmem Edison-Glühfaden.',                         price_cents: 18900, type: 'lamp',      sort_order: 1  },
  { name: 'Wandlampe No.2',               description: 'Wandmontierte Leuchte aus altem Fichtenholz für rustikale und moderne Interieurs.',                          price_cents: 14900, type: 'lamp',      sort_order: 2  },
  { name: 'Stehlampe No.3',               description: 'Elegante Stehlampe aus massiver Altholzbohle mit breitem Schirm. Jedes Stück ein Unikat.',                  price_cents: 29900, type: 'lamp',      sort_order: 3  },
  { name: 'Hängeleuchte No.4',            description: 'Pendelleuchte aus altem Balkenholz. Ideal über Esstisch oder Kücheninsel.',                                 price_cents: 21900, type: 'lamp',      sort_order: 4  },
  { name: 'Nachttischlampe No.5',         description: 'Kompakte Nachttischlampe aus Nussholz-Altholz mit warmweißem Glühfaden.',                                   price_cents: 13900, type: 'lamp',      sort_order: 5  },
  { name: 'Außenleuchte No.6',            description: 'Witterungsbeständige Terrassenleuchte aus geöltem Lärchenholz-Altholz.',                                    price_cents: 24900, type: 'lamp',      sort_order: 6  },
  { name: 'Wandregal No.7',               description: 'Schwebendes Wandregal aus einer Altholzbohle, geölt und geschliffen.',                                      price_cents: 12900, type: 'shelf',     sort_order: 7  },
  { name: 'Bilderrahmen No.8',            description: 'Rustikaler Bilderrahmen aus recyceltem Weinreben-Holz. Format 20 × 30 cm.',                                 price_cents:  5900, type: 'frame',     sort_order: 8  },
  { name: 'Spiegel No.9',                 description: 'Wandspiegel mit handgearbeiteter Altholzrahmung aus altem Scheunenholz.',                                   price_cents: 17900, type: 'mirror',    sort_order: 9  },
  { name: 'Kerzenhalter No.10',           description: 'Massiver Kerzenhalter für drei Kerzen, gefertigt aus einem alten Eichenbalken.',                            price_cents:  8900, type: 'candle',    sort_order: 10 },
  { name: 'Wanduhr No.11',                description: 'Schlichte Wanduhr mit Zifferblatt aus Altholzscheibe und stillem Uhrwerk.',                                 price_cents: 10900, type: 'clock',     sort_order: 11 },
  { name: 'Tablett No.12',                description: 'Serviertablett aus zwei kontrastierenden Altholzarten, mit Griffleisten versehen.',                         price_cents:  7900, type: 'tray',      sort_order: 12 },
  { name: 'Hocker No.13',                 description: 'Stabiler Hocker aus dicken Altholzbohlen, unbehandelt und natürlich geölt.',                                price_cents: 22900, type: 'stool',     sort_order: 13 },
  { name: 'Pflanzenständer No.14',        description: 'Dreistufiger Pflanzenständer aus Altholzlatten, ideal für Balkon und Wohnzimmer.',                          price_cents: 15900, type: 'stand',     sort_order: 14 },
  { name: 'Weinregal No.15',              description: 'Wandmontiertes Weinregal für 6 Flaschen, aus alten Weinfassholz-Dauben.',                                   price_cents: 16900, type: 'shelf',     sort_order: 15 },
  { name: 'Schreibtisch-Organizer No.16', description: 'Kompakter Schreibtischorganizer aus Altholz mit drei Fächern und Stiftehalter.',                            price_cents:  6900, type: 'organizer', sort_order: 16 },
  { name: 'Türschild No.17',              description: 'Personalisiertes Türschild aus einer gesägten Altholzscheibe, auf Wunsch graviert.',                        price_cents:  4900, type: 'sign',      sort_order: 17 },
  { name: 'Briefhalter No.18',            description: 'Eleganter Briefhalter aus zwei kontrastierenden Altholzarten, mit Vintage-Messinghaken.',                   price_cents:  4500, type: 'organizer', sort_order: 18 },
  { name: 'Schneidebrett No.19',          description: 'Großzügiges Schneidebrett aus Altholz-Eiche mit eingearbeiteter Saftrille und Griff.',                      price_cents:  9500, type: 'tray',      sort_order: 19 },
  { name: 'Blumenkasten No.20',           description: 'Rustikaler Blumenkasten aus alten Schiffsplanken, innen mit Folie ausgelegt. Für Balkon und Fensterbrett.', price_cents: 11900, type: 'stand',     sort_order: 20 },
  { name: 'Garderobenleiste No.21',       description: 'Wandmontierte Garderobenleiste aus einer Altholzbohle mit vier handgeschmiedeten Haken.',                   price_cents: 14500, type: 'shelf',     sort_order: 21 },
  { name: 'Schaukelbrett No.22',          description: 'Massives Schaukelbrett aus einer alten Eichenbohle, mit Hanfseil und Deckenbefestigung geliefert.',         price_cents: 18500, type: 'stool',     sort_order: 22 },
];

// Produkte einfügen wenn Tabelle leer
const existing = await db.select().from(products);
if (existing.length > 0) {
  console.log(`Datenbank enthält bereits ${existing.length} Produkte. Seed übersprungen.`);
  console.log('Zum Neu-Seeden: Tabelle leeren, dann Skript erneut ausführen.');
} else {
  await db.insert(products).values(seedProducts);
  console.log(`✓ ${seedProducts.length} Produkte erfolgreich eingefügt.`);
}

// Bilder für alle 22 Produkte (immer neu seeden)
const seedImages = [
  // Tischlampe No.1 — 5 Bilder
  { product_id:  1, url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Tischlampe No.1 — warmes Glühlicht',    sort_order: 1 },
  { product_id:  1, url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Tischlampe No.1 — Abendstimmung',       sort_order: 2 },
  { product_id:  1, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Tischlampe No.1 — Holzmaserung',        sort_order: 3 },
  { product_id:  1, url: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Tischlampe No.1 — Wohnzimmerambiente',  sort_order: 4 },
  { product_id:  1, url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Tischlampe No.1 — Raumstimmung',        sort_order: 5 },

  // Wandlampe No.2 — 4 Bilder
  { product_id:  2, url: 'https://images.pexels.com/photos/1123262/pexels-photo-1123262.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wandlampe No.2 — Gesamtansicht',        sort_order: 1 },
  { product_id:  2, url: 'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Wandlampe No.2 — Wandmontage',          sort_order: 2 },
  { product_id:  2, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wandlampe No.2 — Holzdetail',           sort_order: 3 },
  { product_id:  2, url: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wandlampe No.2 — warme Atmosphäre',     sort_order: 4 },

  // Stehlampe No.3 — 5 Bilder
  { product_id:  3, url: 'https://images.pexels.com/photos/2116937/pexels-photo-2116937.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Stehlampe No.3 — Gesamtansicht',        sort_order: 1 },
  { product_id:  3, url: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Stehlampe No.3 — Lichtkegel',           sort_order: 2 },
  { product_id:  3, url: 'https://images.pexels.com/photos/2451403/pexels-photo-2451403.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Stehlampe No.3 — Raumatmosphäre',      sort_order: 3 },
  { product_id:  3, url: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Stehlampe No.3 — Sockeldetail',         sort_order: 4 },
  { product_id:  3, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Stehlampe No.3 — Holzoberfläche',      sort_order: 5 },

  // Hängeleuchte No.4 — 4 Bilder
  { product_id:  4, url: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Hängeleuchte No.4 — Über dem Tisch',    sort_order: 1 },
  { product_id:  4, url: 'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Hängeleuchte No.4 — Esszimmerambiente', sort_order: 2 },
  { product_id:  4, url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Hängeleuchte No.4 — warmes Glühlicht',  sort_order: 3 },
  { product_id:  4, url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Hängeleuchte No.4 — Holzdetail',        sort_order: 4 },

  // Nachttischlampe No.5 — 4 Bilder
  { product_id:  5, url: 'https://images.pexels.com/photos/4050293/pexels-photo-4050293.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Nachttischlampe No.5 — Schlafzimmer',   sort_order: 1 },
  { product_id:  5, url: 'https://images.pexels.com/photos/3932890/pexels-photo-3932890.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Nachttischlampe No.5 — Abendlicht',     sort_order: 2 },
  { product_id:  5, url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Nachttischlampe No.5 — warme Stimmung', sort_order: 3 },
  { product_id:  5, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Nachttischlampe No.5 — Nussholzdetail', sort_order: 4 },

  // Außenleuchte No.6 — 4 Bilder
  { product_id:  6, url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Außenleuchte No.6 — Terrassenstimmung', sort_order: 1 },
  { product_id:  6, url: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Außenleuchte No.6 — Abendlicht',        sort_order: 2 },
  { product_id:  6, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Außenleuchte No.6 — Lärchenholz',       sort_order: 3 },
  { product_id:  6, url: 'https://images.pexels.com/photos/2116937/pexels-photo-2116937.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Außenleuchte No.6 — Gartenatmosphäre',  sort_order: 4 },

  // Wandregal No.7 — 5 Bilder
  { product_id:  7, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wandregal No.7 — montiert',             sort_order: 1 },
  { product_id:  7, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Wandregal No.7 — Holzoberfläche',      sort_order: 2 },
  { product_id:  7, url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wandregal No.7 — Raumansicht',         sort_order: 3 },
  { product_id:  7, url: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wandregal No.7 — Interieurambiente',   sort_order: 4 },
  { product_id:  7, url: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Wandregal No.7 — Holzmaserung',        sort_order: 5 },

  // Bilderrahmen No.8 — 4 Bilder
  { product_id:  8, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Bilderrahmen No.8 — Gesamtansicht',    sort_order: 1 },
  { product_id:  8, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Bilderrahmen No.8 — Holzdetail',       sort_order: 2 },
  { product_id:  8, url: 'https://images.pexels.com/photos/2251688/pexels-photo-2251688.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Bilderrahmen No.8 — Handarbeit',        sort_order: 3 },
  { product_id:  8, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Bilderrahmen No.8 — Holzoberfläche',   sort_order: 4 },

  // Spiegel No.9 — 4 Bilder
  { product_id:  9, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Spiegel No.9 — Raumansicht',           sort_order: 1 },
  { product_id:  9, url: 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Spiegel No.9 — Rahmendetail',          sort_order: 2 },
  { product_id:  9, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Spiegel No.9 — Holzmaserung',          sort_order: 3 },
  { product_id:  9, url: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Spiegel No.9 — Interieuransicht',      sort_order: 4 },

  // Kerzenhalter No.10 — 5 Bilder
  { product_id: 10, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Kerzenhalter No.10 — Eichenholz',      sort_order: 1 },
  { product_id: 10, url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Kerzenhalter No.10 — Kerzenlicht',     sort_order: 2 },
  { product_id: 10, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Kerzenhalter No.10 — Holzoberfläche', sort_order: 3 },
  { product_id: 10, url: 'https://images.pexels.com/photos/3932890/pexels-photo-3932890.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Kerzenhalter No.10 — Abendstimmung',  sort_order: 4 },
  { product_id: 10, url: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Kerzenhalter No.10 — warmes Licht',   sort_order: 5 },

  // Wanduhr No.11 — 4 Bilder
  { product_id: 11, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Wanduhr No.11 — Zifferblatt',         sort_order: 1 },
  { product_id: 11, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Wanduhr No.11 — Altholzscheibe',      sort_order: 2 },
  { product_id: 11, url: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Wanduhr No.11 — Jahresringe',         sort_order: 3 },
  { product_id: 11, url: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Wanduhr No.11 — Holzmaserung',        sort_order: 4 },

  // Tablett No.12 — 4 Bilder
  { product_id: 12, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Tablett No.12 — Holzoberfläche',      sort_order: 1 },
  { product_id: 12, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Tablett No.12 — Griffleiste',         sort_order: 2 },
  { product_id: 12, url: 'https://images.pexels.com/photos/2251688/pexels-photo-2251688.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Tablett No.12 — Handarbeit',           sort_order: 3 },
  { product_id: 12, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Tablett No.12 — warme Holztöne',      sort_order: 4 },

  // Hocker No.13 — 5 Bilder
  { product_id: 13, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Hocker No.13 — Gesamtansicht',         sort_order: 1 },
  { product_id: 13, url: 'https://images.pexels.com/photos/209679/pexels-photo-209679.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Hocker No.13 — Massivholz',            sort_order: 2 },
  { product_id: 13, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Hocker No.13 — Holzoberfläche',       sort_order: 3 },
  { product_id: 13, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Hocker No.13 — Raumansicht',           sort_order: 4 },
  { product_id: 13, url: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Hocker No.13 — Maserungsdetail',      sort_order: 5 },

  // Pflanzenständer No.14 — 4 Bilder
  { product_id: 14, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Pflanzenständer No.14 — Raumansicht',  sort_order: 1 },
  { product_id: 14, url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Pflanzenständer No.14 — Interieur',    sort_order: 2 },
  { product_id: 14, url: 'https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Pflanzenständer No.14 — Balkonambiente',sort_order: 3 },
  { product_id: 14, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Pflanzenständer No.14 — Holzdetail',  sort_order: 4 },

  // Weinregal No.15 — 4 Bilder
  { product_id: 15, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Weinregal No.15 — montiert',           sort_order: 1 },
  { product_id: 15, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Weinregal No.15 — Holzdetail',        sort_order: 2 },
  { product_id: 15, url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Weinregal No.15 — Raumansicht',        sort_order: 3 },
  { product_id: 15, url: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Weinregal No.15 — Weinatmosphäre',    sort_order: 4 },

  // Schreibtisch-Organizer No.16 — 3 Bilder
  { product_id: 16, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Organizer No.16 — Gesamtansicht',     sort_order: 1 },
  { product_id: 16, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Organizer No.16 — Holzdetail',        sort_order: 2 },
  { product_id: 16, url: 'https://images.pexels.com/photos/2251688/pexels-photo-2251688.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Organizer No.16 — Handarbeit',         sort_order: 3 },

  // Türschild No.17 — 3 Bilder
  { product_id: 17, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Türschild No.17 — Altholzscheibe',    sort_order: 1 },
  { product_id: 17, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Türschild No.17 — Holzmaserung',      sort_order: 2 },
  { product_id: 17, url: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Türschild No.17 — Schnittfläche',      sort_order: 3 },

  // Briefhalter No.18 — 3 Bilder
  { product_id: 18, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Briefhalter No.18 — Gesamtansicht',   sort_order: 1 },
  { product_id: 18, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Briefhalter No.18 — Holzdetail',      sort_order: 2 },
  { product_id: 18, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Briefhalter No.18 — Messinghaken',    sort_order: 3 },

  // Schneidebrett No.19 — 4 Bilder
  { product_id: 19, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Schneidebrett No.19 — Eichenoberfläche', sort_order: 1 },
  { product_id: 19, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Schneidebrett No.19 — Maserung',     sort_order: 2 },
  { product_id: 19, url: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Schneidebrett No.19 — Stirnholz',    sort_order: 3 },
  { product_id: 19, url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Schneidebrett No.19 — Küchenambiente', sort_order: 4 },

  // Blumenkasten No.20 — 4 Bilder
  { product_id: 20, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Blumenkasten No.20 — Raumansicht',     sort_order: 1 },
  { product_id: 20, url: 'https://images.pexels.com/photos/4846461/pexels-photo-4846461.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Blumenkasten No.20 — Balkon',          sort_order: 2 },
  { product_id: 20, url: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Blumenkasten No.20 — Interieur',       sort_order: 3 },
  { product_id: 20, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Blumenkasten No.20 — Holzdetail',     sort_order: 4 },

  // Garderobenleiste No.21 — 4 Bilder
  { product_id: 21, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Garderobenleiste No.21 — montiert',    sort_order: 1 },
  { product_id: 21, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Garderobenleiste No.21 — Holzbohle',  sort_order: 2 },
  { product_id: 21, url: 'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Garderobenleiste No.21 — Raumambiente', sort_order: 3 },
  { product_id: 21, url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Garderobenleiste No.21 — Flurambiente', sort_order: 4 },

  // Schaukelbrett No.22 — 5 Bilder
  { product_id: 22, url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Schaukelbrett No.22 — Eichenbohle',    sort_order: 1 },
  { product_id: 22, url: 'https://images.pexels.com/photos/209679/pexels-photo-209679.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Schaukelbrett No.22 — Holzdetail',    sort_order: 2 },
  { product_id: 22, url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Schaukelbrett No.22 — Oberfläche',    sort_order: 3 },
  { product_id: 22, url: 'https://images.pexels.com/photos/279614/pexels-photo-279614.jpeg?auto=compress&cs=tinysrgb&w=600',   alt: 'Schaukelbrett No.22 — Holzmaserung',  sort_order: 4 },
  { product_id: 22, url: 'https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Schaukelbrett No.22 — Raumatmosphäre', sort_order: 5 },
];

// Bilder immer neu seeden (truncate + re-insert)
await db.delete(productImages);
await db.insert(productImages).values(seedImages);
console.log(`✓ ${seedImages.length} Produktbilder eingefügt (alle Produkte).`);

await sql.end();
