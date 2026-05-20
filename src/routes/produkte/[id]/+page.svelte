<script>
  import LampSVG from '$lib/components/LampSVG.svelte';
  import ProductImageCarousel from '$lib/components/ProductImageCarousel.svelte';
  import ImageLightbox from '$lib/components/ImageLightbox.svelte';

  let { data } = $props();
  let { product } = $derived(data);
  let inquiryHref = $derived(
    '/?nachricht=' + encodeURIComponent((data.inquiryTemplate ?? '').replace('{Name}', product.name)) + '#kontakt'
  );

  let svgVariant    = $derived(product.type === 'lamp' ? ((product.id - 1) % 3) + 1 : 4);
  let hasImages     = $derived(product.images?.length > 0);
  let lightboxOpen  = $state(false);
  let lightboxIndex = $state(0);

  function openLightbox(idx) { lightboxIndex = idx; lightboxOpen = true; }
  function closeLightbox()   { lightboxOpen = false; }

  function formatPrice(cents) {
    return '€ ' + (cents / 100).toLocaleString('de-AT', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ',–';
  }
</script>

<svelte:head>
  <title>{product.name} — Altholz Design</title>
  <meta name="description" content={product.description} />
</svelte:head>

<div class="page">

  <!-- Zurück-Link -->
  <div class="breadcrumb-row">
    <a href="/#produkte" class="back-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      Alle Objekte
    </a>
  </div>

  <article class="product-detail">

    <!-- Linke Spalte: Bilder -->
    <div class="media-col">
      <div class="media-frame">
        {#if hasImages}
          <ProductImageCarousel
            images={product.images}
            productName={product.name}
            onImageClick={openLightbox}
          />
        {:else}
          <div class="svg-wrap">
            <LampSVG variant={svgVariant} type={product.type} />
          </div>
        {/if}
      </div>
    </div>

    <!-- Rechte Spalte: Inhalt -->
    <div class="content-col">

      <span class="eyebrow">{product.nummer ?? 'N° ' + product.id.toString().padStart(2, '0')}</span>
      <h1 class="product-title">{product.name}</h1>
      <p class="product-tagline">{product.description}</p>

      <div class="price-row">
        <span class="price">{formatPrice(product.price_cents)}</span>
      </div>

      <div class="divider" aria-hidden="true"></div>

      {#if product.beschreibung}
        <div class="beschreibung-block">
          <h2 class="section-title">Beschreibung</h2>
          <div class="beschreibung">{@html product.beschreibung}</div>
        </div>
      {/if}

      {#if product.besonderheiten || product.materialien || product.masse}
        <div class="divider" aria-hidden="true"></div>

        {#if product.besonderheiten}
          <div class="section">
            <h2 class="section-title">Besonderheiten</h2>
            <div class="html-content">{@html product.besonderheiten}</div>
          </div>
        {/if}

        {#if product.materialien || product.masse}
          <div class="meta-grid">
            {#if product.materialien}
              <div class="meta-block">
                <h2 class="section-title">Materialien</h2>
                <div class="html-content">{@html product.materialien}</div>
              </div>
            {/if}
            {#if product.masse}
              <div class="meta-block">
                <h2 class="section-title">Maße</h2>
                <div class="html-content">{@html product.masse}</div>
              </div>
            {/if}
          </div>
        {/if}
      {/if}

      <div class="divider" aria-hidden="true"></div>

      <!-- Handmade-Hinweis -->
      <p class="handmade-note">
        Dieses Objekt ist ein Unikat aus Klosterneuburg. Jedes Stück wird von Hand gefertigt
        und kann in Material, Maserung und Abmessungen leicht variieren.
      </p>

      <!-- CTA unten -->
      <a href={inquiryHref} class="btn-inquiry btn-inquiry--full">
        Anfrage senden
      </a>

    </div>
  </article>

</div>

{#if lightboxOpen && hasImages}
  <ImageLightbox
    images={product.images}
    initialIndex={lightboxIndex}
    productName={product.name}
    onClose={closeLightbox}
  />
{/if}

<style>
  .page {
    background-color: var(--color-bg);
    min-height: 100vh;
    padding: 2rem 1.5rem 5rem;
    max-width: 72rem;
    margin: 0 auto;
  }

  /* Breadcrumb */
  .breadcrumb-row {
    margin-bottom: 2.5rem;
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
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: var(--color-cream);
  }

  .back-link:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Layout */
  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  @media (max-width: 768px) {
    .product-detail {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  /* Media */
  .media-col {
    position: sticky;
    top: 2rem;
  }

  @media (max-width: 768px) {
    .media-col {
      position: static;
    }
  }

  .media-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    background-color: var(--color-beige);
    border-radius: 0.75rem;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .svg-wrap {
    width: 60%;
    height: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Content */
  .eyebrow {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 0.75rem;
  }

  .product-title {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400;
    color: var(--color-cream);
    letter-spacing: -0.01em;
    line-height: 1.1;
    margin-bottom: 0.75rem;
  }

  .product-tagline {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--color-lightsand);
    margin-bottom: 1.75rem;
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 2.1rem;
    font-weight: 600;
    color: var(--color-brown);
    letter-spacing: -0.01em;
  }

  .beschreibung-block {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .beschreibung {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.8;
    color: var(--color-lightsand);
  }

  .beschreibung :global(b),
  .beschreibung :global(strong) {
    font-weight: 500;
    color: var(--color-cream);
  }

  .divider {
    height: 1px;
    background: linear-gradient(to right, rgba(200, 168, 130, 0.2), transparent);
    margin: 1.75rem 0;
  }

  /* Sections */
  .section {
    margin-bottom: 1.75rem;
  }

  .section-title {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 0.75rem;
  }

  /* HTML-Content (besonderheiten, materialien, masse) */
  .html-content {
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.8;
    color: var(--color-lightsand);
  }

  .html-content :global(ul) {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .html-content :global(li) {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .html-content :global(li::before) {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: var(--color-sand);
    flex-shrink: 0;
  }

  .html-content :global(b),
  .html-content :global(strong) {
    font-weight: 500;
    color: var(--color-cream);
  }

  /* Meta grid */
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 480px) {
    .meta-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Handmade note */
  .handmade-note {
    font-size: 0.8rem;
    font-weight: 300;
    font-style: italic;
    color: var(--color-midbrown);
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  /* Buttons */
  .btn-inquiry {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    background-color: var(--color-brown);
    color: #FAF6F0;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: background-color 0.2s ease, transform 0.2s ease;
    min-height: 44px;
  }

  .btn-inquiry:hover {
    background-color: var(--color-midbrown);
    transform: translateY(-1px);
  }

  .btn-inquiry:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  .btn-inquiry--full {
    align-self: flex-start;
  }

  @media (max-width: 480px) {
    .btn-inquiry--full {
      width: 100%;
      justify-content: center;
    }
  }
</style>
