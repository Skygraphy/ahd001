<script>
  import ProductCard from './ProductCard.svelte';

  let { products } = $props();

  // Preis von Cent auf "€ 189,–" formatieren
  function formatPrice(cents) {
    const euros = cents / 100;
    return '€ ' + euros.toLocaleString('de-AT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ',–';
  }

  const PER_PAGE = 9;

  let currentPage = $state(1);
  const totalPages = $derived(Math.ceil(products.length / PER_PAGE));
  const pageItems  = $derived(
    products.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
           .map(p => ({ ...p, price: formatPrice(p.price_cents) }))
  );

  function goTo(page) {
    currentPage = page;
    document.getElementById('produkte')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<section id="produkte" class="products-section">
  <div class="section-header">
    <p class="section-eyebrow">Kollektion</p>
    <h2 class="section-title">Unsere Objekte</h2>
    <p class="section-subtitle">
      22 handgefertigte Unikate aus recyceltem Altholz — jedes Stück trägt seine eigene Geschichte.
    </p>
  </div>

  <div class="bento-grid">
    {#each pageItems as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>

  <!-- Pagination -->
  <nav class="pagination" aria-label="Seiten-Navigation">
    <button
      class="page-btn prev"
      onclick={() => goTo(currentPage - 1)}
      disabled={currentPage === 1}
      aria-label="Vorherige Seite"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      <button
        class="page-btn number"
        class:active={page === currentPage}
        onclick={() => goTo(page)}
        aria-label="Seite {page}"
        aria-current={page === currentPage ? 'page' : undefined}
      >
        {page}
      </button>
    {/each}

    <button
      class="page-btn next"
      onclick={() => goTo(currentPage + 1)}
      disabled={currentPage === totalPages}
      aria-label="Nächste Seite"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </nav>

  <p class="page-info">
    Seite {currentPage} von {totalPages} &nbsp;·&nbsp; {products.length} Objekte
  </p>
</section>

<style>
  .products-section {
    padding: 6rem 1.5rem;
    background-color: var(--color-bg);
  }

  @media (min-width: 768px) {
    .products-section {
      padding: 8rem 3rem;
    }
  }

  .section-header {
    text-align: center;
    margin-bottom: 4rem;
    max-width: 36rem;
    margin-left: auto;
    margin-right: auto;
  }

  .section-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 0.75rem;
  }

  .section-title {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 400;
    color: var(--color-cream);
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }

  .section-subtitle {
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--color-lightsand);
  }

  .bento-grid {
    max-width: 72rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    align-content: start;
  }

  @media (max-width: 900px) {
    .bento-grid {
      grid-template-columns: repeat(2, 1fr);
      min-height: auto;
    }
  }

  @media (max-width: 560px) {
    .bento-grid {
      grid-template-columns: 1fr;
      min-height: unset;
    }
  }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 3.5rem;
  }

  .page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-beige);
    background-color: var(--color-surface);
    color: var(--color-midbrown);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    font-family: inherit;
  }

  .page-btn:hover:not(:disabled) {
    background-color: var(--color-beige);
    border-color: var(--color-sand);
    color: var(--color-nearblack);
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
    opacity: 0.35;
    cursor: not-allowed;
  }

  .page-btn.prev,
  .page-btn.next {
    color: var(--color-brown);
  }

  .page-info {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    color: var(--color-sand);
  }
</style>
