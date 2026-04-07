// Einmaliges Befüllen der Datenbank mit den 22 Altholz-Produkten
// Voraussetzung: .env mit DATABASE_URL gesetzt
// Ausführen: node --env-file=.env scripts/seed.js

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { products } from '../src/lib/server/schema.js';
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

// Nur einfügen wenn Tabelle leer
const existing = await db.select().from(products);
if (existing.length > 0) {
  console.log(`Datenbank enthält bereits ${existing.length} Produkte. Seed übersprungen.`);
  console.log('Zum Neu-Seeden: Tabelle leeren, dann Skript erneut ausführen.');
} else {
  await db.insert(products).values(seedProducts);
  console.log(`✓ ${seedProducts.length} Produkte erfolgreich eingefügt.`);
}

await sql.end();
