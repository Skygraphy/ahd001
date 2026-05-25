<script>
  import { enhance } from '$app/forms';
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
  let { data, form } = $props();

  const p = $derived(data.product);
  const priceEuros = $derived((data.product.price_cents / 100).toFixed(2));

  let uploadMode = $state('file');

  // Drag & Drop — guard $effect so server refreshes don't clobber an active drag
  let images      = $state([...data.images]);
  let draggedIdx  = $state(null);
  let dragOverIdx = $state(null);
  let startOrder  = $state(null);
  let saving      = $state(false);
  let addImageOpen = $state(false);
  let confirmOpen  = $state(false);
  let confirmMsg   = $state('');
  let pendingForm  = $state(null);

  $effect(() => { if (draggedIdx === null) images = [...data.images]; });

  function requestDelete(form, msg) {
    pendingForm = form;
    confirmMsg  = msg;
    confirmOpen = true;
  }

  function executeDelete() {
    pendingForm?.requestSubmit();
    pendingForm = null;
  }

  const IMG_PER_PAGE = 5;
  let imagePage = $state(1);
  const totalImagePages = $derived(Math.ceil(images.length / IMG_PER_PAGE));
  const pageStart       = $derived((imagePage - 1) * IMG_PER_PAGE);
  const pageImages      = $derived(images.slice(pageStart, pageStart + IMG_PER_PAGE));

  function goToImagePage(page) { imagePage = page; }

  function onDragStart(e, pageIdx) {
    draggedIdx = pageStart + pageIdx;
    startOrder = images.map(i => i.id);
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
    const changed = startOrder && images.some((img, i) => img.id !== startOrder[i]);
    dragOverIdx = null;
    draggedIdx  = null;
    startOrder  = null;
    if (changed) saveOrder();
  }

  function moveImage(globalIdx, direction) {
    const targetIdx = globalIdx + direction;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const items = [...images];
    [items[globalIdx], items[targetIdx]] = [items[targetIdx], items[globalIdx]];
    images = items;
    // Follow item across page boundary
    const newPage = Math.floor(targetIdx / IMG_PER_PAGE) + 1;
    if (newPage !== imagePage) imagePage = newPage;
    saveOrder();
  }

  async function saveOrder() {
    saving = true;
    const formData = new FormData();
    images.forEach(img => formData.append('ids', String(img.id)));
    try {
      const res = await fetch('?/reorderImages', { method: 'POST', body: formData });
      if (!res.ok) {
        console.error('Reihenfolge speichern fehlgeschlagen:', res.status);
        images = [...data.images];
      }
    } catch (err) {
      console.error('Reihenfolge speichern fehlgeschlagen:', err);
      images = [...data.images];
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>{p.name} — Admin</title>
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
    <p class="page-subtitle">{p.nummer ?? ('N° ' + p.id.toString().padStart(2, '0'))}</p>
    <h1 class="page-title">{p.name}</h1>
  </div>
  <form method="POST" action="?/deleteProduct" use:enhance>
    <button type="button" class="btn-danger"
            onclick={(e) => requestDelete(e.currentTarget.closest('form'), `"${p.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)}>
      Produkt löschen
    </button>
  </form>
</div>

{#if data.uploadErrors?.length}
  <div class="alert-error">
    <strong>Einige Bilder konnten beim Anlegen nicht hochgeladen werden:</strong>
    <ul class="upload-error-list">
      {#each data.uploadErrors as err}
        <li>{err}</li>
      {/each}
    </ul>
  </div>
{/if}

{#if form?.error}
  <div class="alert-error">{form.error}</div>
{/if}

<!-- Produktdaten -->
<form method="POST" action="?/update" use:enhance class="product-form">
  <div class="form-section">
    <h2 class="section-title">Grunddaten</h2>

    <div class="field-row">
      <div class="field field--narrow">
        <label for="nummer">Nummer *</label>
        <input id="nummer" name="nummer" type="text" placeholder="N° 01" required value={p.nummer ?? ''} />
      </div>
      <div class="field">
        <label for="name">Name *</label>
        <input id="name" name="name" type="text" required value={p.name} />
      </div>
    </div>

    <div class="field">
      <label for="description">Kurzbeschreibung *</label>
      <textarea id="description" name="description" rows="3" required>{p.description}</textarea>
    </div>

    <div class="field">
      <label for="beschreibung">Beschreibung <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="beschreibung" name="beschreibung" rows="6">{p.beschreibung ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="besonderheiten">Besonderheiten <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="besonderheiten" name="besonderheiten" rows="5">{p.besonderheiten ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="materialien">Materialien <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="materialien" name="materialien" rows="5">{p.materialien ?? ''}</textarea>
    </div>

    <div class="field">
      <label for="masse">Maße <span class="label-hint">(HTML erlaubt)</span></label>
      <textarea id="masse" name="masse" rows="3">{p.masse ?? ''}</textarea>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="price">Preis (€) *</label>
        <input id="price" name="price" type="number" min="0.01" step="0.01" required value={priceEuros} />
      </div>

      <div class="field">
        <label for="type">Typ *</label>
        <input id="type" name="type" type="text" required value={p.type} />
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
    <a href="/produkte/{p.id}" target="_blank" class="btn-secondary">Vorschau</a>
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
    <ul class="image-list" role="list">
      {#each pageImages as img, pageIdx (img.id)}
        {@const globalIdx = pageStart + pageIdx}
        <li
          class="image-row"
          class:dragging={draggedIdx === globalIdx}
          class:drag-over={dragOverIdx === globalIdx && draggedIdx !== globalIdx}
          draggable="true"
          ondragstart={(e) => onDragStart(e, pageIdx)}
          ondragover={(e) => onDragOver(e, pageIdx)}
          ondragend={onDragEnd}
        >
          <span class="drag-handle" title="Ziehen zum Verschieben" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
              <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
              <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
            </svg>
          </span>
          <div class="move-btns">
            <button type="button" class="move-btn" onclick={() => moveImage(globalIdx, -1)}
                    disabled={globalIdx === 0} aria-label="Bild nach oben">▲</button>
            <button type="button" class="move-btn" onclick={() => moveImage(globalIdx, 1)}
                    disabled={globalIdx === images.length - 1} aria-label="Bild nach unten">▼</button>
          </div>
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
            <button type="button" class="image-delete" title="Bild entfernen"
                    onclick={(e) => requestDelete(e.currentTarget.closest('form'), 'Bild wirklich löschen?')}>
              ✕
            </button>
          </form>
        </li>
      {/each}
    </ul>

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
  <details class="add-image-details" bind:open={addImageOpen}>
    <summary class="add-image-summary">+ Bild hinzufügen</summary>
    <form method="POST" action="?/addImage" enctype="multipart/form-data" class="add-image-form"
          use:enhance={() => ({ update }) => update().then(() => { if (!form?.imageError) addImageOpen = false; })}>

      <!-- Upload-Tabs -->
      <div class="upload-tabs">
        <button type="button" class="upload-tab" class:active={uploadMode === 'file'}
                onclick={() => uploadMode = 'file'}>Datei hochladen</button>
        <button type="button" class="upload-tab" class:active={uploadMode === 'url'}
                onclick={() => uploadMode = 'url'}>Externe URL</button>
      </div>

      {#if uploadMode === 'file'}
        <div class="field">
          <label for="img-file">Bilddatei <span class="label-hint">(JPEG, PNG, WebP · max. 10 MB)</span></label>
          <input id="img-file" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                 class="file-input" />
        </div>
      {:else}
        <div class="field">
          <label for="img-url">Bild-URL</label>
          <input id="img-url" name="url" type="url" placeholder="https://…" />
        </div>
      {/if}

      <div class="field">
        <label for="img-alt">Alt-Text</label>
        <input id="img-alt" name="alt" type="text" placeholder="Beschreibung für Screenreader" />
      </div>

      <button type="submit" class="btn-primary" style="align-self: flex-start; margin-top: 0.5rem">
        Bild speichern
      </button>
    </form>
  </details>
</div>

<ConfirmDialog bind:open={confirmOpen} message={confirmMsg} onConfirm={executeDelete} />

<style>
  /* Seiten-spezifische Styles — gemeinsame Klassen liegen in admin.css */

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .page-subtitle {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-top: 0.2rem;
  }

  /* product-form bekommt hier zusätzlich margin-bottom */
  .product-form {
    margin-bottom: 2rem;
  }

  /* images-section ist eine Erweiterung von .form-section */
  .images-section {
    margin-bottom: 3rem;
  }

  /* field-row bekommt hier align-items: end */
  .field-row {
    align-items: end;
  }

  /* Image list – seiten-spezifisch */
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

  .upload-error-list {
    margin: 0.5rem 0 0;
    padding-left: 1.25rem;
    font-size: 0.82rem;
    line-height: 1.6;
  }

  .image-alt {
    font-size: 0.7rem;
    color: var(--color-sand);
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
    color: #FAF6F0;
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

  .upload-tabs {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid rgba(200, 168, 130, 0.15);
    margin-bottom: 0.25rem;
  }

  .upload-tab {
    padding: 0.4rem 0.875rem;
    font-size: 0.78rem;
    font-weight: 500;
    font-family: inherit;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--color-sand);
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
    margin-bottom: -1px;
  }

  .upload-tab:hover   { color: var(--color-cream); }
  .upload-tab.active  {
    color: var(--color-cream);
    border-bottom-color: var(--color-brown);
  }

  /* Buttons – seiten-spezifisch */
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
