<script>
  let { images, initialIndex = 0, productName, onClose } = $props();

  let current = $state(initialIndex);
  const total = $derived(images.length);

  function goTo(i) { current = ((i % total) + total) % total; }
  function prev()  { goTo(current - 1); }
  function next()  { goTo(current + 1); }

  function handleKeydown(e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'Escape')     { onClose(); }
  }

  $effect(() => {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    };
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="backdrop" onclick={onClose}>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div class="lightbox" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Bildansicht">

    <button class="close-btn" onclick={onClose} aria-label="Schließen">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <div class="image-wrap">
      {#each images as image, i (image.id)}
        <img
          src={image.url}
          alt={image.alt || productName}
          class="slide"
          class:active={i === current}
          loading={i === current ? 'eager' : 'lazy'}
          draggable="false"
        />
      {/each}
    </div>

    {#if total > 1}
      <button class="nav-btn nav-prev" onclick={prev} aria-label="Vorheriges Bild">‹</button>
      <button class="nav-btn nav-next" onclick={next} aria-label="Nächstes Bild">›</button>
      <div class="counter">{current + 1} / {total}</div>
    {/if}

  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(10, 6, 2, 0.88);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.18s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .lightbox {
    position: relative;
    width: min(82vw, 1080px);
    height: min(80vh, 780px);
    background: #110b04;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
    animation: scaleIn 0.2s ease;
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }

  @media (max-width: 768px) {
    .backdrop { padding: 1rem; }
    .lightbox  { width: 96vw; height: 70vw; min-height: 220px; }
  }

  /* Images */
  .image-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .slide.active { opacity: 1; }

  /* Close */
  .close-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(200, 168, 130, 0.25);
    background: rgba(17, 11, 4, 0.7);
    color: var(--color-sand);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .close-btn:hover {
    background: rgba(200, 168, 130, 0.15);
    color: var(--color-cream);
  }

  /* Navigation */
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 44px;
    height: 72px;
    border: none;
    background: rgba(17, 11, 4, 0.55);
    color: var(--color-cream);
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-btn:hover  { background: rgba(17, 11, 4, 0.85); }
  .nav-prev { left:  0.5rem; }
  .nav-next { right: 0.5rem; }

  /* Counter */
  .counter {
    position: absolute;
    bottom: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: rgba(200, 168, 130, 0.7);
    background: rgba(10, 6, 2, 0.5);
    padding: 0.2rem 0.6rem;
    border-radius: 99px;
  }
</style>
