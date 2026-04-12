<script>
  let { images, productName } = $props();

  let current = $state(0);
  const total = $derived(images.length);

  function goTo(i) { current = Math.max(0, Math.min(i, total - 1)); }
  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  function handleKeydown(e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  }

  let touchStartX = $state(null);
  function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX = null;
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="carousel"
  role="region"
  aria-label="Bilder von {productName}"
  aria-roledescription="Bildergalerie"
  tabindex="0"
  onkeydown={handleKeydown}
  ontouchstart={onTouchStart}
  ontouchend={onTouchEnd}
>
  {#each images as image, i (image.id)}
    <img
      src={image.url}
      alt={image.alt || productName}
      class="slide"
      class:active={i === current}
      loading="lazy"
      decoding="async"
      draggable="false"
      aria-hidden={i !== current}
    />
  {/each}

  {#if total > 1}
    <button
      class="arrow arrow-prev"
      onclick={prev}
      disabled={current === 0}
      aria-label="Vorheriges Bild"
    >‹</button>

    <button
      class="arrow arrow-next"
      onclick={next}
      disabled={current === total - 1}
      aria-label="Nächstes Bild"
    >›</button>

    <div class="dots" role="tablist" aria-label="Bild auswählen">
      {#each images as _, i}
        <button
          class="dot"
          class:dot-active={i === current}
          role="tab"
          aria-selected={i === current}
          aria-label="Bild {i + 1} von {total}"
          onclick={() => goTo(i)}
          tabindex={i === current ? 0 : -1}
        ></button>
      {/each}
    </div>
  {/if}

  <span class="sr-only" aria-live="polite">Bild {current + 1} von {total}</span>
</div>

<style>
  .carousel {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: none;
  }

  .carousel:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: -2px;
  }

  .slide {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .slide.active {
    opacity: 1;
    pointer-events: auto;
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 40px;
    border: none;
    background-color: rgba(250, 246, 240, 0.85);
    color: var(--color-brown);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    border-radius: 4px;
    opacity: 0;
    transition: background-color 0.15s ease, opacity 0.2s ease;
  }

  .carousel:hover .arrow:not(:disabled) {
    opacity: 1;
  }

  .arrow:hover:not(:disabled) {
    background-color: var(--color-cream);
  }

  .arrow:disabled {
    opacity: 0 !important;
    cursor: default;
  }

  .arrow:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
    opacity: 1;
  }

  .arrow-prev { left: 0.375rem; }
  .arrow-next { right: 0.375rem; }

  .dots {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 2;
    background-color: rgba(42, 26, 14, 0.3);
    border-radius: 99px;
    padding: 5px 8px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: none;
    padding: 0;
    background-color: rgba(250, 246, 240, 0.5);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }

  .dot.dot-active {
    background-color: var(--color-cream);
    transform: scale(1.3);
  }

  .dot:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
    border-radius: 50%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
