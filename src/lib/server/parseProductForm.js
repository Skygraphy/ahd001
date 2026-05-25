/**
 * Parses and validates product FormData. Returns parsed values plus a serializable
 * `values` object safe to return in fail() responses (no File objects).
 */
export function parseProductForm(data) {
  const nummer         = data.get('nummer')?.toString().trim() || null;
  const name           = data.get('name')?.toString().trim() ?? '';
  const description    = data.get('description')?.toString().trim() ?? '';
  const beschreibung   = data.get('beschreibung')?.toString().trim() || null;
  const besonderheiten = data.get('besonderheiten')?.toString().trim() || null;
  const materialien    = data.get('materialien')?.toString().trim() || null;
  const masse          = data.get('masse')?.toString().trim() || null;
  const priceRaw       = data.get('price')?.toString().replace(',', '.') ?? '0';
  const priceEuros     = parseFloat(priceRaw);
  const type           = data.get('type')?.toString().trim() ?? '';
  const sort_order_raw = parseInt(data.get('sort_order')?.toString() ?? '', 10);
  const sort_order     = Number.isFinite(sort_order_raw) && sort_order_raw >= 0 ? sort_order_raw : 0;
  const visible        = data.get('visible') === 'on';

  const errors = [];
  if (!nummer)                              errors.push('Nummer ist erforderlich.');
  if (!name)                                errors.push('Name ist erforderlich.');
  if (!description)                         errors.push('Kurzbeschreibung ist erforderlich.');
  if (!type)                                errors.push('Typ ist erforderlich.');
  if (!Number.isFinite(priceEuros) || priceEuros <= 0) errors.push('Ungültiger Preis (muss größer als 0 sein).');

  // Serializable values for fail() — no File objects
  const values = {
    nummer, name, description, beschreibung, besonderheiten, materialien, masse,
    price: data.get('price')?.toString() ?? '',
    type, sort_order,
    visible: visible ? 'on' : 'off',
  };

  return {
    nummer, name, description, beschreibung, besonderheiten, materialien, masse,
    priceEuros,
    price_cents: Math.round(priceEuros * 100),
    type, sort_order, visible,
    values, errors,
  };
}
