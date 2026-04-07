<script>
  import LampSVG from './LampSVG.svelte';
  let { product } = $props();

  // Lampen-SVG für alle Lampen, Objekt-SVG für den Rest (Modulo 3)
  let svgVariant = $derived(product.type === 'lamp' ? ((product.id - 1) % 3) + 1 : 4);
</script>

<article class="product-card">
  <div class="card-image">
    <LampSVG variant={svgVariant} type={product.type} />
    <div class="image-glow" aria-hidden="true"></div>
  </div>

  <div class="card-body">
    <span class="card-number">N° {product.id.toString().padStart(2, '0')}</span>
    <h3 class="card-title">{product.name}</h3>
    <p class="card-description">{product.description}</p>
    <div class="card-footer">
      <span class="card-price">{product.price}</span>
      <a href="#kontakt" class="card-btn">Anfragen →</a>
    </div>
  </div>
</article>

<style>
  .product-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-beige);
    border-radius: 0.75rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(74, 44, 23, 0.14);
  }

  .card-image {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-beige);
    height: 180px;
    overflow: hidden;
  }

  @media (max-width: 560px) {
    .card-image {
      height: 150px;
    }
  }

  .image-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 65%,
      rgba(250, 220, 160, 0.2),
      transparent 70%
    );
    pointer-events: none;
  }

  .card-body {
    padding: 1.25rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .card-number {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-sand);
  }

  .card-title {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--color-nearblack);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .card-description {
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--color-midbrown);
    flex: 1;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-beige);
  }

  .card-price {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-brown);
    letter-spacing: -0.01em;
  }

  .card-btn {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-brown);
    text-decoration: none;
    transition: color 0.2s ease, letter-spacing 0.2s ease;
    padding: 0.5rem 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .card-btn:hover {
    color: var(--color-earth);
    letter-spacing: 0.1em;
  }

  .card-btn:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }
</style>
