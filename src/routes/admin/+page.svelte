<script>
  import { enhance } from '$app/forms';
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
  let { data } = $props();

  function formatPrice(cents) {
    return '€ ' + (cents / 100).toLocaleString('de-AT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ',–';
  }

  // Lokale, sortierbare Liste
  let list = $state([...data.products]);
  $effect(() => { list = [...data.products]; });
  let saving = $state(false);
  let confirmOpen = $state(false);
  let confirmMsg  = $state('');
  let pendingForm = null;

  function requestDelete(form, msg) {
    pendingForm = form;
    confirmMsg  = msg;
    confirmOpen = true;
  }

  function executeDelete() {
    pendingForm?.requestSubmit();
    pendingForm = null;
  }

  const PER_PAGE = 10;
  let currentPage = $state(1);
  const totalPages = $derived(Math.ceil(list.length / PER_PAGE));
  const pageStart  = $derived((currentPage - 1) * PER_PAGE);
  const pageItems  = $derived(list.slice(pageStart, pageStart + PER_PAGE));

  function goTo(page) { currentPage = page; }

  function move(globalIdx, direction) {
    const targetIdx = globalIdx + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const items = [...list];
    [items[globalIdx], items[targetIdx]] = [items[targetIdx], items[globalIdx]];
    list = items;

    // Seite mitführen wenn Produkt über Grenze springt
    const newPage = Math.floor(targetIdx / PER_PAGE) + 1;
    if (newPage !== currentPage) currentPage = newPage;

    saveOrder();
  }

  async function saveOrder() {
    saving = true;
    const formData = new FormData();
    list.forEach(p => formData.append('ids', String(p.id)));
    await fetch('?/reorder', { method: 'POST', body: formData });
    saving = false;
  }
</script>

<svelte:head>
  <title>Produkte — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <h1 class="page-title">Produkte</h1>
    <p class="page-subtitle">
      {list.length} Objekte in der Datenbank
      {#if saving}<span class="saving-hint">· Speichern …</span>{/if}
    </p>
  </div>
  <a href="/admin/produkte/neu" class="btn-primary">+ Neues Produkt</a>
</div>

<div class="table-wrap">
  <table class="product-table">
    <thead>
      <tr>
        <th class="th-order"></th>
        <th>Nr.</th>
        <th>Name</th>
        <th>Typ</th>
        <th>Preis</th>
        <th>Sichtbar</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each pageItems as product, pageIdx (product.id)}
        {@const globalIdx = pageStart + pageIdx}
        <tr class:hidden-row={!product.visible}>
          <td class="cell-order">
            <div class="order-arrows">
              <button
                class="arrow-btn"
                onclick={() => move(globalIdx, -1)}
                disabled={globalIdx === 0}
                aria-label="Nach oben"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              </button>
              <button
                class="arrow-btn"
                onclick={() => move(globalIdx, 1)}
                disabled={globalIdx === list.length - 1}
                aria-label="Nach unten"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
            </div>
          </td>
          <td class="cell-id">{product.nummer ?? '—'}</td>
          <td class="cell-name">
            <a href="/admin/produkte/{product.id}">{product.name}</a>
          </td>
          <td class="cell-type">
            <span class="badge">{product.type}</span>
          </td>
          <td class="cell-price">{formatPrice(product.price_cents)}</td>
          <td class="cell-visible">
            <form method="POST" action="?/toggleVisible" use:enhance>
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="visible" value={product.visible} />
              <button
                type="submit"
                class="toggle-btn"
                class:active={product.visible}
                title={product.visible ? 'Sichtbar (klicken zum Ausblenden)' : 'Ausgeblendet (klicken zum Einblenden)'}
              >
                {product.visible ? '✓' : '–'}
              </button>
            </form>
          </td>
          <td class="cell-actions">
            <a href="/admin/produkte/{product.id}" class="action-btn">Bearbeiten</a>
            <form method="POST" action="?/delete" use:enhance>
              <input type="hidden" name="id" value={product.id} />
              <button type="button" class="action-btn action-btn--danger"
                      onclick={(e) => requestDelete(e.currentTarget.closest('form'), `"${product.name}" wirklich löschen?`)}>
                Löschen
              </button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#if totalPages > 1}
  <nav class="pagination" aria-label="Seiten-Navigation">
    <button class="page-btn prev" onclick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1} aria-label="Vorherige Seite">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      <button class="page-btn number" class:active={page === currentPage}
              onclick={() => goTo(page)} aria-label="Seite {page}"
              aria-current={page === currentPage ? 'page' : undefined}>
        {page}
      </button>
    {/each}

    <button class="page-btn next" onclick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages} aria-label="Nächste Seite">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </nav>

  <p class="page-info">
    Seite {currentPage} von {totalPages} &nbsp;·&nbsp; {list.length} Objekte
  </p>
{/if}

<ConfirmDialog bind:open={confirmOpen} message={confirmMsg} onConfirm={executeDelete} />

<style>
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .page-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--color-cream);
    line-height: 1.1;
  }

  .page-subtitle {
    font-size: 0.8rem;
    color: var(--color-sand);
    margin-top: 0.25rem;
  }

  .btn-primary {
    background-color: var(--color-brown);
    color: #FAF6F0;
    border-radius: 6px;
    padding: 0.55rem 1.1rem;
    font-size: 0.8rem;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.15s ease;
  }

  .btn-primary:hover {
    background-color: var(--color-midbrown);
  }

  .table-wrap {
    overflow-x: auto;
    border: 1px solid rgba(200, 168, 130, 0.15);
    border-radius: 10px;
    background-color: var(--color-surface);
  }

  .product-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .product-table thead th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-sand);
    border-bottom: 1px solid rgba(200, 168, 130, 0.15);
    white-space: nowrap;
  }

  .product-table tbody tr {
    border-bottom: 1px solid rgba(200, 168, 130, 0.08);
    transition: background-color 0.1s ease;
  }

  .product-table tbody tr:last-child {
    border-bottom: none;
  }

  .product-table tbody tr:hover {
    background-color: rgba(200, 168, 130, 0.04);
  }

  .product-table tbody tr.hidden-row {
    opacity: 0.45;
  }

  .product-table td {
    padding: 0.75rem 1rem;
    color: var(--color-lightsand);
    vertical-align: middle;
  }

  .cell-id {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: var(--color-sand);
    white-space: nowrap;
  }

  .cell-name a {
    color: var(--color-cream);
    text-decoration: none;
    font-weight: 500;
  }

  .cell-name a:hover {
    color: var(--color-sand);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background-color: var(--color-beige);
    color: var(--color-sand);
  }

  .cell-type {
    text-align: center;
  }

  .cell-price {
    white-space: nowrap;
    font-weight: 500;
    color: #B08255;
  }

  .saving-hint {
    color: var(--color-midbrown);
    font-style: italic;
  }

  .th-order {
    width: 2.5rem;
  }

  .cell-order {
    padding: 0.25rem 0.5rem;
  }

  .order-arrows {
    display: flex;
    flex-direction: column;
    gap: 1px;
    align-items: center;
  }

  .arrow-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 18px;
    border: none;
    background: transparent;
    color: var(--color-midbrown);
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.1s ease, color 0.1s ease;
    padding: 0;
  }

  .arrow-btn:hover:not(:disabled) {
    background-color: var(--color-beige);
    color: var(--color-cream);
  }

  .arrow-btn:disabled {
    opacity: 0.2;
    cursor: default;
  }

  .cell-visible {
    text-align: center;
  }

  .toggle-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(200, 168, 130, 0.3);
    background: transparent;
    color: var(--color-midbrown);
    font-size: 0.75rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .toggle-btn.active {
    background-color: var(--color-brown);
    border-color: var(--color-brown);
    color: #FAF6F0;
  }

  .cell-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .cell-actions form {
    display: contents;
  }

  .action-btn {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.3rem 0.625rem;
    border-radius: 5px;
    border: 1px solid rgba(200, 168, 130, 0.2);
    background: transparent;
    color: var(--color-lightsand);
    text-decoration: none;
    cursor: pointer;
    font-family: inherit;
    transition: background-color 0.15s ease, color 0.15s ease;
    white-space: nowrap;
  }

  .action-btn:hover {
    background-color: var(--color-beige);
    color: var(--color-cream);
  }

  .action-btn--danger {
    color: #c0392b;
    border-color: rgba(192, 57, 43, 0.3);
  }

  .action-btn--danger:hover {
    background-color: rgba(192, 57, 43, 0.15);
    color: #e74c3c;
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    margin-top: 2rem;
  }

  .page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.375rem;
    border: 1px solid rgba(200, 168, 130, 0.2);
    background-color: var(--color-surface);
    color: var(--color-midbrown);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .page-btn:hover:not(:disabled) {
    background-color: var(--color-beige);
    border-color: var(--color-sand);
    color: var(--color-cream);
  }

  .page-btn:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  .page-btn.active {
    background-color: var(--color-brown);
    border-color: var(--color-brown);
    color: #FAF6F0;
  }

  .page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .page-info {
    text-align: center;
    margin-top: 0.75rem;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    color: var(--color-sand);
  }
</style>
