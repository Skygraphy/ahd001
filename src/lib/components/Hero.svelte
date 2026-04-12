<script>
  let mouseX = $state(0);
  let mouseY = $state(0);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  }

  let spotlightStyle = $derived(
    `--x: ${mouseX}px; --y: ${mouseY}px;`
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
  class="hero-section"
  aria-label="Startbereich"
  style={spotlightStyle}
  onmousemove={handleMouseMove}
>
  <!-- Hintergrundbild -->
  <div class="hero-bg" aria-hidden="true"></div>
  <!-- Dunkles Overlay für Lesbarkeit -->
  <div class="hero-bg-overlay" aria-hidden="true"></div>

  <div class="spotlight-overlay" aria-hidden="true"></div>

  <!-- Dekorative Linien -->
  <div class="deco-line deco-line-left" aria-hidden="true"></div>
  <div class="deco-line deco-line-right" aria-hidden="true"></div>

  <div class="hero-content">
    <p class="hero-eyebrow">Klosterneuburg · Handwerk · Unikate</p>

    <h1 class="hero-title">
      Altholz<br /><span class="hero-title-light">Design</span>
    </h1>

    <p class="hero-tagline">
      Licht aus Geschichte.<br />
      Handgefertigte Lampen aus altem Holz.
    </p>

    <div class="hero-actions">
      <a href="#produkte" class="btn-primary-custom">
        Produkte entdecken
      </a>
      <a href="#kontakt" class="btn-ghost-custom">
        Kontakt
      </a>
    </div>
  </div>

  <!-- Scroll-Indikator -->
  <div class="scroll-indicator" aria-hidden="true">
    <div class="scroll-line"></div>
  </div>
</section>

<style>
  .hero-section {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: var(--color-nearblack);
  }

  /* Hintergrundbild */
  .hero-bg {
    position: absolute;
    inset: 0;
    background-color: var(--color-earth);
    background-image: url('https://images.pexels.com/photos/14238329/pexels-photo-14238329.jpeg?auto=compress&cs=tinysrgb&w=1920');
    background-size: cover;
    background-position: center 40%;
    background-repeat: no-repeat;
    opacity: 0.45;
    transform: scale(1.03);
  }

  /* Dunkles Gradient-Overlay für Lesbarkeit des Textes */
  .hero-bg-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(42, 26, 14, 0.55) 0%, rgba(42, 26, 14, 0.3) 50%, rgba(42, 26, 14, 0.75) 100%),
      radial-gradient(ellipse at center, transparent 30%, rgba(42, 26, 14, 0.4) 100%);
  }

  /* Cursor Spotlight */
  .spotlight-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2;
    background: radial-gradient(
      700px circle at var(--x, 50%) var(--y, 50%),
      rgba(212, 184, 150, 0.18),
      rgba(124, 82, 50, 0.08) 45%,
      transparent 70%
    );
    transition: background 0.08s ease;
  }

  @media (max-width: 768px) {
    .spotlight-overlay {
      background: radial-gradient(
        350px circle at var(--x, 50%) var(--y, 50%),
        rgba(212, 184, 150, 0.14),
        rgba(124, 82, 50, 0.06) 45%,
        transparent 70%
      );
    }
  }

  /* Dekorative vertikale Linien */
  .deco-line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(200, 168, 130, 0.15) 20%,
      rgba(200, 168, 130, 0.15) 80%,
      transparent
    );
  }
  .deco-line-left  { left: clamp(2rem, 8vw, 6rem); }
  .deco-line-right { right: clamp(2rem, 8vw, 6rem); }

  @media (max-width: 768px) {
    .deco-line { display: none; }
  }

  /* Dekorative Linien über dem Overlay */
  .deco-line {
    z-index: 3;
  }

  /* Content */
  .hero-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5rem 1.5rem 2rem;
    max-width: 52rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    .hero-content {
      padding: 3rem 1rem 2rem;
    }
  }

  .hero-eyebrow {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 0.75rem;
  }

  .hero-title {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(4.5rem, 13vw, 10rem);
    font-weight: 400;
    line-height: 0.92;
    color: var(--color-cream);
    margin-bottom: 2rem;
    letter-spacing: -0.01em;
    text-align: center;
  }

  .hero-title-light {
    color: var(--color-sand);
    font-weight: 300;
    font-style: italic;
  }

  .hero-tagline {
    font-family: 'DM Sans', ui-sans-serif, sans-serif;
    font-size: clamp(0.95rem, 2.2vw, 1.2rem);
    font-weight: 300;
    line-height: 1.75;
    color: var(--color-lightsand);
    letter-spacing: 0.01em;
    margin-bottom: 3rem;
    text-align: center;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-primary-custom {
    display: inline-flex;
    align-items: center;
    padding: 0.875rem 2rem;
    background-color: var(--color-brown);
    color: var(--color-cream);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .btn-primary-custom:hover {
    background-color: var(--color-midbrown);
    transform: translateY(-1px);
  }

  .btn-primary-custom:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  .btn-ghost-custom {
    display: inline-flex;
    align-items: center;
    padding: 0.875rem 2rem;
    background-color: transparent;
    color: var(--color-sand);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1px solid rgba(200, 168, 130, 0.3);
    border-radius: 0.375rem;
    text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease;
  }

  .btn-ghost-custom:hover {
    border-color: rgba(200, 168, 130, 0.7);
    color: var(--color-cream);
  }

  .btn-ghost-custom:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  /* Scroll Indikator */
  .scroll-indicator {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .scroll-line {
    width: 1px;
    height: 3rem;
    background: linear-gradient(to bottom, var(--color-sand), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50%       { opacity: 1;   transform: scaleY(1.1); }
  }
</style>
