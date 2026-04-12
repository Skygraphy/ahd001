<script>
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<svelte:head>
  <title>Neues Produkt — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <a href="/admin" class="back-link">← Zur Übersicht</a>
    <h1 class="page-title">Neues Produkt</h1>
  </div>
</div>

{#if form?.error}
  <div class="alert-error">{form.error}</div>
{/if}

<form method="POST" use:enhance class="product-form">
  <div class="form-section">
    <h2 class="section-title">Grunddaten</h2>

    <div class="field">
      <label for="name">Name *</label>
      <input id="name" name="name" type="text" required
             value={form?.values?.name ?? ''} placeholder="z.B. Stehleuchte Eiche" />
    </div>

    <div class="field">
      <label for="description">Kurzbeschreibung *</label>
      <textarea id="description" name="description" rows="3" required
                placeholder="Wird auf der Produktkarte angezeigt …">{form?.values?.description ?? ''}</textarea>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="price">Preis (€) *</label>
        <input id="price" name="price" type="number" min="1" step="1" required
               value={form?.values?.price ?? ''} placeholder="289" />
      </div>

      <div class="field">
        <label for="type">Typ *</label>
        <input id="type" name="type" type="text" list="type-options" required
               value={form?.values?.type ?? ''} placeholder="lamp / table / shelf …" />
        <datalist id="type-options">
          <option value="lamp">lamp</option>
          <option value="table">table</option>
          <option value="shelf">shelf</option>
          <option value="bench">bench</option>
          <option value="stool">stool</option>
          <option value="decoration">decoration</option>
        </datalist>
      </div>

      <div class="field">
        <label for="sort_order">Reihenfolge</label>
        <input id="sort_order" name="sort_order" type="number" min="0" step="1"
               value={form?.values?.sort_order ?? '0'} />
      </div>
    </div>

    <div class="field field--inline">
      <input id="visible" name="visible" type="checkbox"
             checked={form?.values?.visible !== 'off'} />
      <label for="visible">Auf der Website sichtbar</label>
    </div>
  </div>

  <div class="form-actions">
    <a href="/admin" class="btn-secondary">Abbrechen</a>
    <button type="submit" class="btn-primary">Produkt erstellen</button>
  </div>
</form>

<style>
  .page-header {
    margin-bottom: 2rem;
  }

  .back-link {
    font-size: 0.78rem;
    color: var(--color-sand);
    text-decoration: none;
    letter-spacing: 0.03em;
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  .back-link:hover {
    color: var(--color-lightsand);
  }

  .page-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--color-cream);
  }

  .alert-error {
    background-color: rgba(192, 57, 43, 0.12);
    border: 1px solid rgba(192, 57, 43, 0.35);
    color: #e74c3c;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .product-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section {
    background-color: var(--color-surface);
    border: 1px solid rgba(200, 168, 130, 0.15);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .section-title {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 0.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-lightsand);
  }

  .field input,
  .field textarea {
    background-color: var(--color-bg);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 6px;
    padding: 0.55rem 0.875rem;
    color: var(--color-cream);
    font-size: 0.9rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease;
    resize: vertical;
  }

  .field input:focus,
  .field textarea:focus {
    border-color: var(--color-sand);
  }

  .field-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .field--inline {
    flex-direction: row;
    align-items: center;
    gap: 0.6rem;
  }

  .field--inline input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--color-brown);
    cursor: pointer;
    padding: 0;
  }

  .field--inline label {
    cursor: pointer;
    margin: 0;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .btn-primary {
    background-color: var(--color-brown);
    color: var(--color-cream);
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.15s ease;
  }

  .btn-primary:hover {
    background-color: var(--color-midbrown);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-lightsand);
    border: 1px solid rgba(200, 168, 130, 0.25);
    border-radius: 6px;
    padding: 0.6rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .btn-secondary:hover {
    background-color: var(--color-beige);
    color: var(--color-cream);
  }
</style>
