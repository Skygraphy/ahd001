<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Fehler — Altholz Design</title>
</svelte:head>

<div class="error-page">
  <div class="error-content">
    <p class="error-eyebrow">Altholz Design</p>

    <p class="error-code">{$page.status}</p>

    <h1 class="error-title">
      {#if $page.status === 404}
        Seite nicht gefunden
      {:else}
        Ein Fehler ist aufgetreten
      {/if}
    </h1>

    <p class="error-message">
      {#if $page.status === 404}
        Die gesuchte Seite existiert nicht oder wurde verschoben.
      {:else}
        Bitte versuchen Sie es später erneut.
      {/if}
    </p>

    <a href="/" class="back-home">Zur Startseite</a>
  </div>
</div>

<style>
  .error-page {
    min-height: 100svh;
    background-color: var(--color-nearblack);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
  }

  .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 32rem;
  }

  .error-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 2rem;
  }

  .error-code {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(5rem, 20vw, 9rem);
    font-weight: 300;
    color: var(--color-midbrown);
    line-height: 1;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .error-title {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 400;
    color: var(--color-cream);
    letter-spacing: -0.01em;
    margin-bottom: 1rem;
  }

  .error-message {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--color-lightsand);
    margin-bottom: 2.5rem;
  }

  .back-home {
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

  .back-home:hover {
    background-color: var(--color-midbrown);
    transform: translateY(-1px);
  }

  .back-home:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }
</style>
