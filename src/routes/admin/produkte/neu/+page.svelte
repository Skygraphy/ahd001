<script>
  import { enhance } from '$app/forms';
  import { onDestroy } from 'svelte';
  let { form } = $props();

  let fileInput   = $state(null);
  let previews    = $state([]);
  let draggedIdx  = $state(null);
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

  function movePreview(idx, direction) {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= previews.length) return;
    const items = [...previews];
    [items[idx], items[targetIdx]] = [items[targetIdx], items[idx]];
    previews = items;
    syncFileInput();
  }

  onDestroy(() => previews.forEach(p => URL.revokeObjectURL(p.url)));
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

<form method="POST" enctype="multipart/form-data" use:enhance class="product-form">
  <div class="form-section">
    <h2 class="section-title">Grunddaten</h2>

    <div class="field-row">
      <div class="field field--narrow">
        <label for="nummer">Nummer *</label>
        <input id="nummer" name="nummer" type="text" placeholder="N° 01" required
               value={form?.values?.nummer ?? ''} />
      </div>
      <div class="field">
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
        <input id="price" name="price" type="number" min="0.01" step="0.01" required
               value={form?.values?.price ?? ''} placeholder="289" />
      </div>

      <div class="field">
        <label for="type">Typ *</label>
        <input id="type" name="type" type="text" required
               value={form?.values?.type ?? ''} placeholder="lamp / table / shelf …" />
      </div>

      <div class="field">
        <label for="sort_order">Reihenfolge</label>
        <input id="sort_order" name="sort_order" type="number" min="0" step="1"
               value={form?.values?.sort_order ?? '0'} />
      </div>
    </div>

    <div class="field field--inline">
      <input id="visible" name="visible" type="checkbox"
             checked={form?.values?.visible === 'on' || form?.values?.visible === undefined} />
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
      <ul class="image-list" role="list">
        {#each previews as preview, idx}
          <li
            class="image-row"
            class:dragging={draggedIdx === idx}
            class:drag-over={dragOverIdx === idx && draggedIdx !== idx}
            draggable="true"
            ondragstart={(e) => onDragStart(e, idx)}
            ondragover={(e) => onDragOver(e, idx)}
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
              <button type="button" class="move-btn" onclick={() => movePreview(idx, -1)}
                      disabled={idx === 0} aria-label="Bild nach oben">▲</button>
              <button type="button" class="move-btn" onclick={() => movePreview(idx, 1)}
                      disabled={idx === previews.length - 1} aria-label="Bild nach unten">▼</button>
            </div>
            <div class="image-thumb-wrap">
              <img src={preview.url} alt={preview.name} class="image-thumb" />
              {#if idx === 0}
                <span class="primary-badge">Standard</span>
              {/if}
            </div>
            <div class="image-meta">
              <span class="image-url" title={preview.name}>{preview.name}</span>
            </div>
            <button type="button" class="image-delete" title="Bild entfernen"
                    onclick={() => removePreview(idx)}>✕</button>
          </li>
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
  /* Seiten-spezifische Styles — gemeinsame Klassen liegen in admin.css */

  .page-header {
    margin-bottom: 2rem;
  }

  /* form-actions: rechtsbündig auf dieser Seite */
  .form-actions {
    justify-content: flex-end;
  }

  /* section-title: zusätzlicher margin-bottom auf dieser Seite */
  .section-title {
    margin-bottom: 0.25rem;
  }

</style>
