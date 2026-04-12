// Einmalig: ersetzt 2 kaputte Pexels-URLs in der Datenbank
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { productImages } from '../src/lib/server/schema.js';
import { eq } from 'drizzle-orm';

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db  = drizzle(sql);

const fixes = [
  {
    oldUrl: 'https://images.pexels.com/photos/1406277/pexels-photo-1406277.jpeg?auto=compress&cs=tinysrgb&w=600',
    newUrl: 'https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    oldUrl: 'https://images.pexels.com/photos/3651091/pexels-photo-3651091.jpeg?auto=compress&cs=tinysrgb&w=600',
    newUrl: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

for (const { oldUrl, newUrl } of fixes) {
  const result = await db
    .update(productImages)
    .set({ url: newUrl })
    .where(eq(productImages.url, oldUrl));
  console.log(`✓ Ersetzt: …${oldUrl.slice(-20)} → …${newUrl.slice(-20)}`);
}

await sql.end();
console.log('Fertig.');
