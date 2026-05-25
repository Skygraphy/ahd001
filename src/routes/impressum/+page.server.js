import { getDb } from '$lib/server/db.js';
import { settings } from '$lib/server/schema.js';
import { env } from '$env/dynamic/private';

export async function load() {
  const db   = getDb(env.DATABASE_URL);
  const rows = await db.select().from(settings);
  const map  = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    impressumName:    map.impressum_name    ?? 'Altholz Design',
    impressumAddress: map.impressum_address ?? '',
    impressumWebsite: map.impressum_website ?? 'https://altholz-design.at',
    contactEmail:     map.contact_email     ?? 'office@altholz-design.at',
    contactPhone:     map.contact_phone     ?? '',
  };
}
