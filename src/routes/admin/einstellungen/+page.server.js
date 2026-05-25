import { getDb } from '$lib/server/db.js';
import { settings } from '$lib/server/schema.js';
import { env } from '$env/dynamic/private';

const DEFAULT_TEMPLATE = 'Ich interessiere mich für das Objekt {Name}. Bitte kontaktieren Sie mich unter meiner angegebenen E-Mail-Adresse.';

export async function load() {
  const db   = getDb(env.DATABASE_URL);
  const rows = await db.select().from(settings);
  const map  = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    maintenanceMode:  map.maintenance_mode === 'true',
    inquiryTemplate:  map.inquiry_template  ?? DEFAULT_TEMPLATE,
    contactEmail:     map.contact_email     ?? 'office@altholz-design.at',
    contactPhone:     map.contact_phone     ?? '',
    impressumName:    map.impressum_name    ?? 'Altholz Design',
    impressumAddress: map.impressum_address ?? '',
    impressumWebsite: map.impressum_website ?? 'https://altholz-design.at',
  };
}

export const actions = {
  toggleMaintenance: async ({ request }) => {
    const data     = await request.formData();
    const newValue = data.get('value') === 'true' ? 'true' : 'false';
    const db = getDb(env.DATABASE_URL);
    await db
      .insert(settings)
      .values({ key: 'maintenance_mode', value: newValue })
      .onConflictDoUpdate({ target: settings.key, set: { value: newValue } });
    return { success: true };
  },

  saveContact: async ({ request }) => {
    const data  = await request.formData();
    const email = data.get('email')?.toString().trim() ?? '';
    const phone = data.get('phone')?.toString().trim() ?? '';
    const db = getDb(env.DATABASE_URL);
    await Promise.all([
      db.insert(settings).values({ key: 'contact_email', value: email })
        .onConflictDoUpdate({ target: settings.key, set: { value: email } }),
      db.insert(settings).values({ key: 'contact_phone', value: phone })
        .onConflictDoUpdate({ target: settings.key, set: { value: phone } }),
    ]);
    return { contactSaved: true };
  },

  saveTemplate: async ({ request }) => {
    const data  = await request.formData();
    const value = data.get('template')?.toString().trim() ?? DEFAULT_TEMPLATE;
    const db = getDb(env.DATABASE_URL);
    await db
      .insert(settings)
      .values({ key: 'inquiry_template', value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
    return { templateSaved: true };
  },

  saveImpressumData: async ({ request }) => {
    const data    = await request.formData();
    const name    = data.get('name')?.toString().trim()    ?? '';
    const address = data.get('address')?.toString().trim() ?? '';
    const website = data.get('website')?.toString().trim() ?? '';
    const db = getDb(env.DATABASE_URL);
    await Promise.all([
      db.insert(settings).values({ key: 'impressum_name',    value: name })
        .onConflictDoUpdate({ target: settings.key, set: { value: name } }),
      db.insert(settings).values({ key: 'impressum_address', value: address })
        .onConflictDoUpdate({ target: settings.key, set: { value: address } }),
      db.insert(settings).values({ key: 'impressum_website', value: website })
        .onConflictDoUpdate({ target: settings.key, set: { value: website } }),
    ]);
    return { impressumSaved: true };
  },
};
