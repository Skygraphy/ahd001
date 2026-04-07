<svelte:head>
  <title>Impressum — Altholz Design</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="page-wrapper">
  <a href="/" class="back-link">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M19 12H5M5 12l7 7M5 12l7-7"/>
    </svg>
    Zurück
  </a>

  <article class="impressum">
    <h1>Impressum</h1>
    <p class="subtitle">Angaben gemäß § 5 ECG</p>

    <section>
      <h2>Unternehmensangaben</h2>
      <p>
        Altholz Design<br />
        Musterstraße 1<br />
        3400 Klosterneuburg<br />
        Österreich
      </p>
    </section>

    <section>
      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+43XXXXXXXXXX">+43 XXX XXX XXXX</a><br />
        Web: <a href="https://altholz-design.at" target="_blank" rel="noopener">altholz-design.at</a>
      </p>
    </section>

    <section>
      <h2>Unternehmensgegenstand</h2>
      <p>Herstellung und Verkauf von handgefertigten Altholzleuchten und Unikaten aus recyceltem Holz.</p>
    </section>

    <section>
      <h2>Haftungsausschluss</h2>
      <p>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
        externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber
        verantwortlich.
      </p>
    </section>

    <section>
      <h2>Urheberrecht</h2>
      <p>
        Die auf dieser Website veröffentlichten Inhalte unterliegen dem österreichischen
        Urheberrecht. Jede vom Urheberrecht nicht zugelassene Verwertung bedarf der vorherigen
        schriftlichen Zustimmung.
      </p>
    </section>
  </article>
</div>

<style>
  .page-wrapper {
    min-height: 100svh;
    background-color: var(--color-cream);
    padding: 3rem 1.5rem 6rem;
    max-width: 48rem;
    margin: 0 auto;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-midbrown);
    text-decoration: none;
    margin-bottom: 3rem;
    transition: color 0.2s ease;
    min-height: 44px;
    padding: 0.25rem 0;
  }

  .back-link:hover {
    color: var(--color-nearblack);
  }

  .back-link:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  .impressum h1 {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 400;
    color: var(--color-nearblack);
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
    color: var(--color-sand);
    letter-spacing: 0.06em;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-beige);
  }

  section {
    margin-bottom: 2.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--color-beige);
  }

  section:last-child {
    border-bottom: none;
  }

  .impressum h2 {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--color-earth);
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .impressum p {
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--color-midbrown);
  }

  .impressum a {
    color: var(--color-brown);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.2s ease;
  }

  .impressum a:hover {
    color: var(--color-nearblack);
  }

  .impressum a:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }
</style>
