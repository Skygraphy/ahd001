<script>
  import { enhance } from '$app/forms';
  let { form } = $props();

  let fileInput  = $state(null);
  let previews   = $state([]);
  let draggedIdx = $state(null);
  let dragOverIdx = $state(null);

  function onFilesChange(e) {
    const files = Array.from(e.target.files ?? []);
    previews = files.map(f => ({ name: f.name, url: URL.createObjectURL(f), file: f }));
  }

  function syncFileInput() {
    if (!fileInput) return;
    const dt = new DataTransfer();
    previews.forEach(p => dt.items.add(p.file));
    fileInput.files = dt.files;
  }

  function removePreview(idx) {
    URL.revokeObjectURL(previews[idx].url);
    previews = previews.filter((_, i) => i !== idx);
    syncFileInput();
  }

  function onDragStart(e, idx) {
    draggedIdx = idx;
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, idx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverIdx = idx;
    if (draggedIdx === idx) return;
    const items = [...previews];
    const [moved] = items.splice(draggedIdx, 1);
    items.splice(idx, 0, moved);
    previews = items;
    draggedIdx = idx;
  }

  function onDragEnd() {
    dragOverIdx = null;
    draggedIdx  = null;
    syncFileInput();
  }
</script>

<svelte:head>
  <title>Neues Produkt — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <a href="/admin" class="back-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      Zur Übersicht
    </a>
    <h1 class="page-title">Neues Produkt</h1>
  </div>
</div>

{#if form?.error}
  <div class="alert-error">{form.error}</div>
{/if}

<form method="POST" use:enhance class="product-form">
  <div class="form-section">
    <h2 class="section-title">Grunddaten</h2>

    <div class="field-row">
      <div class="field" style="flex: 0 0 10rem">
        <label for="nummer">Nummer *</label>
        <input id="nummer" name="nummer" type="text" placeholder="N° 01" required
               value={form?.values?.nummer ?? ''} />
      </div>
      <div class="field" style="flex: 1">
        <label for="name">Name *</label>
        <input id="name" name="name" type="text" required
               value={form?.values?.name ?? ''} placeholder="z.B. Stehleuchte Eiche" />
      </div>
    </div>

    <div class="field">
      <label for="description">Kurzbeschreibung *</label>
      <textarea id="description" name="description" rows="3" required
                placeholder="Wird auf der Produktkarte angezeigt …">{form?.values?.description ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="beschreibung">Beschreibung <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="beschreibung" name="beschreibung" rows="6"
                placeholder="Ausführliche Produktbeschreibung …">{form?.values?.beschreibung ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="besonderheiten">Besonderheiten <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="besonderheiten" name="besonderheiten" rows="5">{form?.values?.besonderheiten ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="materialien">Materialien <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="materialien" name="materialien" rows="5">{form?.values?.materialien ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="masse">Maße <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="masse" name="masse" rows="3">{form?.values?.masse ?? ''}</textarea>
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

  <div class="form-section">
    <h2 class="section-title">Bilder <span class="label-hint">(optional)</span></h2>
    <div class="field">
      <label for="images">Bilder hochladen <span class="label-hint">JPEG, PNG, WebP · max. 10 MB pro Datei · mehrere möglich</span></label>
      <input id="images" name="images" type="file"
             accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
             multiple class="file-input"
             bind:this={fileInput}
             onchange={onFilesChange} />
    </div>

    {#if previews.length > 0}
      <div class="image-list">
        {#each previews as preview, idx}
          <div
            class="image-row"
            class:dragging={draggedIdx === idx}
            class:drag-over={dragOverIdx === idx && draggedIdx !== idx}
            role="listitem"
            draggable="true"
            ondragstart={(e) => onDragStart(e, idx)}
            ondragover={(e) => onDragOver(e, idx)}
            ondragend={onDragEnd}
          >
            <span class="drag-handle" title="Ziehen zum Verschieben">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
              </svg>
            </span>
            <div class="image-thumb-wrap">
              <img src={preview.url} alt={preview.name} class="image-thumb" />
              {#if idx === 0}
                <span class="primary-badge">Standard</span>
              {/if}
            </div>
            <div class="image-meta">
              <span class="image-url" title={preview.name}>{preview.name}</span>
            </div>
            <button
              type="button"
              class="image-delete"
              title="Bild entfernen"
              onclick={() => removePreview(idx)}
            >✕</button>
          </div>
        {/each}
      </div>
    {/if}

    {#if form?.imageErrors?.length}
      <ul class="image-errors">
        {#each form.imageErrors as err}
          <li>{err}</li>
        {/each}
      </ul>
    {/if}
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
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-sand);
    text-decoration: none;
    margin-bottom: 1.25rem;
    transition: color 0.2s ease;
  }

  .back-link:hover { color: var(--color-cream); }

  .back-link:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
    border-radius: 2px;
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

  .label-hint {
    font-weight: 400;
    font-size: 0.72rem;
    color: var(--color-midbrown);
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
    color: #FAF6F0;
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

  .file-input {
    background-color: var(--color-bg);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 6px;
    padding: 0.55rem 0.875rem;
    color: var(--color-cream);
    font-size: 0.875rem;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  .file-input:focus { border-color: var(--color-sand); }
  .file-input::file-selector-button {
    background-color: var(--color-beige);
    border: none;
    border-radius: 4px;
    color: var(--color-cream);
    font-size: 0.8rem;
    font-family: inherit;
    padding: 0.25rem 0.625rem;
    margin-right: 0.75rem;
    cursor: pointer;
  }

  .image-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .image-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: var(--color-bg);
    border: 1px solid rgba(200, 168, 130, 0.12);
    border-radius: 7px;
    padding: 0.5rem 0.75rem;
    cursor: grab;
    user-select: none;
    transition: opacity 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
  }

  .image-row:active { cursor: grabbing; }

  .image-row.dragging { opacity: 0.4; }

  .image-row.drag-over {
    border-color: var(--color-sand);
    background-color: rgba(200, 168, 130, 0.06);
  }

  .drag-handle {
    color: var(--color-midbrown);
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .image-thumb-wrap {
    position: relative;
    flex-shrink: 0;
  }

  .image-thumb {
    width: 56px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
    background-color: var(--color-beige);
  }

  .primary-badge {
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.55rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background-color: var(--color-brown);
    color: #FAF6F0;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    white-space: nowrap;
  }

  .image-meta {
    flex: 1;
    min-width: 0;
  }

  .image-url {
    font-size: 0.75rem;
    color: var(--color-lightsand);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .image-delete {
    background: transparent;
    border: 1px solid rgba(192, 57, 43, 0.3);
    color: #c0392b;
    border-radius: 4px;
    width: 26px;
    height: 26px;
    font-size: 0.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .image-delete:hover {
    background-color: rgba(192, 57, 43, 0.15);
    color: #e74c3c;
  }

  .image-errors {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .image-errors li {
    font-size: 0.8rem;
    color: #e74c3c;
  }
</style>
