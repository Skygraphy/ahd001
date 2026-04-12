<script>
  import { enhance } from '$app/forms';
  let { data } = $props();

  function formatPrice(cents) {
    return '€ ' + (cents / 100).toLocaleString('de-AT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + ',–';
  }

  const PER_PAGE = 10;
  let currentPage = $state(1);
  const totalPages = $derived(Math.ceil(data.products.length / PER_PAGE));
  const pageItems  = $derived(
    data.products.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
  );

  function goTo(page) { currentPage = page; }
</script>

<svelte:head>
  <title>Produkte — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <h1 class="page-title">Produkte</h1>
    <p class="page-subtitle">{data.products.length} Objekte in der Datenbank</p>
  </div>
  <a href="/admin/produkte/neu" class="btn-primary">+ Neues Produkt</a>
</div>

<div class="table-wrap">
  <table class="product-table">
    <thead>
      <tr>
        <th>Nr.</th>
        <th>Name</th>
        <th>Typ</th>
        <th>Preis</th>
        <th>Reihenf.</th>
        <th>Sichtbar</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each pageItems as product (product.id)}
        <tr class:hidden-row={!product.visible}>
          <td class="cell-id">N° {product.id.toString().padStart(2, '0')}</td>
          <td class="cell-name">
            <a href="/admin/produkte/{product.id}">{product.name}</a>
          </td>
          <td class="cell-type">
            <span class="badge">{product.type}</span>
          </td>
          <td class="cell-price">{formatPrice(product.price_cents)}</td>
          <td class="cell-sort">{product.sort_order}</td>
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
            <form method="POST" action="?/delete" use:enhance
                  onsubmit={(e) => { if (!confirm(`"${product.name}" wirklich löschen?`)) e.preventDefault(); }}>
              <input type="hidden" name="id" value={product.id} />
              <button type="submit" class="action-btn action-btn--danger">Löschen</button>
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
    Seite {currentPage} von {totalPages} &nbsp;·&nbsp; {data.products.length} Objekte
  </p>
{/if}

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
    color: var(--color-cream);
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

  .cell-sort {
    text-align: center;
    color: var(--color-sand);
    font-size: 0.8rem;
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
    color: var(--color-cream);
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
    color: var(--color-cream);
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
