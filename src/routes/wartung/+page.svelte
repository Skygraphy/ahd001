<svelte:head>
  <title>Wartungsarbeiten — Altholz Design</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap">
  <div class="icon-wrap" aria-hidden="true">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.25"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  </div>

  <p class="eyebrow">Altholz Design</p>
  <h1 class="title">Wartungsarbeiten</h1>
  <p class="message">
    Die Seite kann aufgrund von Wartungsarbeiten momentan nicht erreicht werden.<br />
    Bitte versuchen Sie es später wieder.
  </p>
</div>

<style>
  :global(body) {
    margin: 0;
    background-color: #140C06;
    color: #FAF6F0;
    font-family: 'DM Sans', ui-sans-serif, sans-serif;
  }

  .wrap {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem 1.5rem;
    gap: 0;
  }

  .icon-wrap {
    color: #7C5232;
    margin-bottom: 2rem;
    opacity: 0.7;
  }

  .eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #C8A882;
    margin-bottom: 0.75rem;
  }

  .title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 400;
    color: #FAF6F0;
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .message {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    font-weight: 300;
    line-height: 1.75;
    color: #D4B896;
    max-width: 36rem;
  }
</style>
