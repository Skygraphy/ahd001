<script>
  import { enhance } from '$app/forms';
  let { data, form } = $props();

  const p = $derived(data.product);
  const priceEuros = $derived((data.product.price_cents / 100).toString());

  // Drag & Drop Reihenfolge
  let images = $state([...data.images]);
  let draggedIdx = $state(null);
  let dragOverIdx = $state(null);
  let saving = $state(false);

  // Pagination Bilder
  const IMG_PER_PAGE = 5;
  let imagePage = $state(1);
  const totalImagePages = $derived(Math.ceil(images.length / IMG_PER_PAGE));
  const pageStart      = $derived((imagePage - 1) * IMG_PER_PAGE);
  const pageImages     = $derived(images.slice(pageStart, pageStart + IMG_PER_PAGE));

  function goToImagePage(page) { imagePage = page; }

  // Drag handlers arbeiten mit globalen Indizes
  function onDragStart(e, pageIdx) {
    draggedIdx = pageStart + pageIdx;
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, pageIdx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const globalIdx = pageStart + pageIdx;
    dragOverIdx = globalIdx;
    if (draggedIdx === globalIdx) return;
    const items = [...images];
    const [moved] = items.splice(draggedIdx, 1);
    items.splice(globalIdx, 0, moved);
    images = items;
    draggedIdx = globalIdx;
  }

  function onDragEnd() {
    dragOverIdx = null;
    draggedIdx = null;
    saveOrder();
  }

  async function saveOrder() {
    saving = true;
    const formData = new FormData();
    images.forEach(img => formData.append('ids', String(img.id)));
    await fetch('?/reorderImages', { method: 'POST', body: formData });
    saving = false;
  }
</script>

<svelte:head>
  <title>{p.name} — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <a href="/admin" class="back-link">← Zur Übersicht</a>
    <h1 class="page-title">{p.name}</h1>
    <p class="page-subtitle">N° {p.id.toString().padStart(2, '0')}</p>
  </div>
  <form method="POST" action="?/deleteProduct" use:enhance
        onsubmit={(e) => { if (!confirm(`"${p.name}" wirklich löschen?`)) e.preventDefault(); }}>
    <button type="submit" class="btn-danger">Produkt löschen</button>
  </form>
</div>

{#if form?.error}
  <div class="alert-error">{form.error}</div>
{/if}
{#if form?.success}
  <div class="alert-success">Gespeichert.</div>
{/if}

<!-- Produktdaten -->
<form method="POST" action="?/update" use:enhance class="product-form">
  <div class="form-section">
    <h2 class="section-title">Grunddaten</h2>

    <div class="field">
      <label for="name">Name *</label>
      <input id="name" name="name" type="text" required value={p.name} />
    </div>

    <div class="field">
      <label for="description">Kurzbeschreibung *</label>
      <textarea id="description" name="description" rows="3" required>{p.description}</textarea>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="price">Preis (€) *</label>
        <input id="price" name="price" type="number" min="1" step="1" required value={priceEuros} />
      </div>

      <div class="field">
        <label for="type">Typ *</label>
        <input id="type" name="type" type="text" list="type-options" required value={p.type} />
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
        <input id="sort_order" name="sort_order" type="number" min="0" step="1" value={p.sort_order} />
      </div>
    </div>

    <div class="field field--inline">
      <input id="visible" name="visible" type="checkbox" checked={p.visible} />
      <label for="visible">Auf der Website sichtbar</label>
    </div>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn-primary">Speichern</button>
    <a href="/produkte/{p.id}" target="_blank" class="btn-secondary">Vorschau ↗</a>
  </div>
</form>

<!-- Bilder -->
<div class="form-section images-section">
  <div class="images-header">
    <h2 class="section-title">Bilder ({images.length})</h2>
    {#if saving}
      <span class="saving-hint">Speichern …</span>
    {/if}
  </div>

  {#if form?.imageError}
    <div class="alert-error">{form.imageError}</div>
  {/if}

  {#if images.length > 0}
    <div class="image-list">
      {#each pageImages as img, pageIdx (img.id)}
        {@const globalIdx = pageStart + pageIdx}
        <div
          class="image-row"
          class:dragging={draggedIdx === globalIdx}
          class:drag-over={dragOverIdx === globalIdx && draggedIdx !== globalIdx}
          draggable="true"
          ondragstart={(e) => onDragStart(e, pageIdx)}
          ondragover={(e) => onDragOver(e, pageIdx)}
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
            <img src={img.url} alt={img.alt || p.name} class="image-thumb" loading="lazy" />
            {#if globalIdx === 0}
              <span class="primary-badge">Standard</span>
            {/if}
          </div>
          <div class="image-meta">
            <span class="image-url" title={img.url}>{img.url}</span>
            {#if img.alt}<span class="image-alt">{img.alt}</span>{/if}
          </div>
          <form method="POST" action="?/deleteImage" use:enhance>
            <input type="hidden" name="imageId" value={img.id} />
            <button type="submit" class="image-delete" title="Bild entfernen">✕</button>
          </form>
        </div>
      {/each}
    </div>

    {#if totalImagePages > 1}
      <nav class="img-pagination" aria-label="Bilder-Navigation">
        <button class="img-page-btn" onclick={() => goToImagePage(imagePage - 1)}
                disabled={imagePage === 1} aria-label="Vorherige">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        {#each Array.from({ length: totalImagePages }, (_, i) => i + 1) as page}
          <button class="img-page-btn" class:active={page === imagePage}
                  onclick={() => goToImagePage(page)} aria-label="Seite {page}"
                  aria-current={page === imagePage ? 'page' : undefined}>
            {page}
          </button>
        {/each}
        <button class="img-page-btn" onclick={() => goToImagePage(imagePage + 1)}
                disabled={imagePage === totalImagePages} aria-label="Nächste">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </nav>
      <p class="img-page-info">
        Seite {imagePage} von {totalImagePages} &nbsp;·&nbsp; {images.length} Bilder
      </p>
    {/if}
  {:else}
    <p class="no-images">Noch keine Bilder hinterlegt.</p>
  {/if}

  <!-- Bild hinzufügen -->
  <details class="add-image-details">
    <summary class="add-image-summary">+ Bild hinzufügen</summary>
    <form method="POST" action="?/addImage" use:enhance class="add-image-form">
      <div class="field-row">
        <div class="field" style="flex: 3">
          <label for="img-url">Bild-URL *</label>
          <input id="img-url" name="url" type="url" required
                 placeholder="https://images.pexels.com/…" />
        </div>
        <div class="field" style="flex: 2">
          <label for="img-alt">Alt-Text</label>
          <input id="img-alt" name="alt" type="text"
                 placeholder="Beschreibung für Screenreader" />
        </div>
        <div class="field" style="flex: 1">
          <label for="img-sort">Reihenf.</label>
          <input id="img-sort" name="sort_order" type="number" min="0" value="0" />
        </div>
      </div>
      <button type="submit" class="btn-primary" style="align-self: flex-start; margin-top: 0.5rem">
        Bild speichern
      </button>
    </form>
  </details>
</div>

<style>
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .back-link {
    font-size: 0.78rem;
    color: var(--color-sand);
    text-decoration: none;
    letter-spacing: 0.03em;
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  .back-link:hover { color: var(--color-lightsand); }

  .page-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--color-cream);
    line-height: 1.1;
  }

  .page-subtitle {
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    color: var(--color-sand);
    margin-top: 0.2rem;
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

  .alert-success {
    background-color: rgba(39, 174, 96, 0.1);
    border: 1px solid rgba(39, 174, 96, 0.3);
    color: #2ecc71;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .product-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .form-section, .images-section {
    background-color: var(--color-surface);
    border: 1px solid rgba(200, 168, 130, 0.15);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .images-section {
    margin-bottom: 3rem;
  }

  .section-title {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-sand);
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
    align-items: end;
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

  .field--inline label { cursor: pointer; margin: 0; }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* Image list */
  .images-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .saving-hint {
    font-size: 0.72rem;
    color: var(--color-sand);
    font-style: italic;
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
    transition: opacity 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
    user-select: none;
  }

  .image-row:active { cursor: grabbing; }

  .image-row.dragging {
    opacity: 0.4;
  }

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
    color: var(--color-cream);
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    white-space: nowrap;
  }

  .image-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .image-url {
    font-size: 0.75rem;
    color: var(--color-lightsand);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .image-alt {
    font-size: 0.7rem;
    color: var(--color-sand);
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

  .no-images {
    font-size: 0.85rem;
    color: var(--color-sand);
    font-style: italic;
  }

  /* Bild-Pagination */
  .img-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    margin-top: 0.75rem;
  }

  .img-page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 5px;
    border: 1px solid rgba(200, 168, 130, 0.2);
    background-color: var(--color-bg);
    color: var(--color-midbrown);
    font-size: 0.78rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .img-page-btn:hover:not(:disabled) {
    background-color: var(--color-beige);
    border-color: var(--color-sand);
    color: var(--color-cream);
  }

  .img-page-btn.active {
    background-color: var(--color-brown);
    border-color: var(--color-brown);
    color: var(--color-cream);
  }

  .img-page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .img-page-info {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    color: var(--color-sand);
  }

  /* Add image accordion */
  .add-image-details {
    border-top: 1px solid rgba(200, 168, 130, 0.1);
    padding-top: 1.25rem;
    margin-top: 0.25rem;
  }

  .add-image-summary {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-sand);
    cursor: pointer;
    list-style: none;
    outline: none;
  }

  .add-image-summary::-webkit-details-marker { display: none; }

  .add-image-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  /* Buttons */
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
    display: inline-block;
    transition: background-color 0.15s ease;
  }

  .btn-primary:hover { background-color: var(--color-midbrown); }

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
    display: inline-block;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .btn-secondary:hover {
    background-color: var(--color-beige);
    color: var(--color-cream);
  }

  .btn-danger {
    background: transparent;
    color: #c0392b;
    border: 1px solid rgba(192, 57, 43, 0.3);
    border-radius: 6px;
    padding: 0.55rem 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .btn-danger:hover {
    background-color: rgba(192, 57, 43, 0.12);
    color: #e74c3c;
  }
</style>
