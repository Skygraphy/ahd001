<script>
  import ContactForm from './ContactForm.svelte';

  let { form } = $props();

  const phone = '+43 664 512 2640';
  const website = 'altholz-design.at';
  const phoneHref = 'tel:' + phone.replace(/\s/g, '');
</script>

<section id="kontakt" class="contact-section">
  <div class="divider-top" aria-hidden="true"></div>

  <div class="contact-inner">

    <!-- Linke Spalte: Info -->
    <div class="contact-info">
      <p class="info-eyebrow">Kontakt</p>
      <h2 class="brand-name">Altholz Design</h2>
      <p class="brand-sub">Handgefertigte Objekte aus Klosterneuburg</p>

      <div class="info-divider" aria-hidden="true"></div>

      <p class="info-text">
        Sie haben eine Frage zu einem unserer Stücke oder möchten ein Unikat in Auftrag geben?
        Schreiben Sie uns — wir antworten persönlich.
      </p>

      <div class="contact-details">
        <a href="https://{website}" class="contact-item" target="_blank" rel="noopener noreferrer">
          <span class="contact-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          {website}
        </a>
        <a href={phoneHref} class="contact-item">
          <span class="contact-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69l3-.06a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.64-1.64a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
          {phone}
        </a>
      </div>
    </div>

    <!-- Rechte Spalte: Formular -->
    <div class="form-col">
      <ContactForm {form} />
    </div>

  </div>

  <!-- Footer-Zeile -->
  <div class="footer-row">
    <p class="copyright">&copy; {new Date().getFullYear()} Altholz Design &mdash; Alle Rechte vorbehalten</p>
    <a href="/impressum" class="impressum-link">Impressum</a>
  </div>
</section>

<style>
  .contact-section {
    background-color: var(--color-nearblack);
    padding: 5rem 1.5rem 3rem;
    position: relative;
  }

  @media (max-width: 480px) {
    .contact-section {
      padding: 3rem 1.25rem 2rem;
    }
  }

  .divider-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      rgba(200, 168, 130, 0.3) 30%,
      rgba(200, 168, 130, 0.3) 70%,
      transparent
    );
  }

  /* Zweispaltig */
  .contact-inner {
    max-width: 72rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: start;
  }

  @media (max-width: 768px) {
    .contact-inner {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  /* Info-Spalte */
  .info-eyebrow {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 1rem;
  }

  .brand-name {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 400;
    color: var(--color-cream);
    letter-spacing: -0.01em;
    margin-bottom: 0.4rem;
  }

  .brand-sub {
    font-size: 0.875rem;
    font-weight: 300;
    letter-spacing: 0.06em;
    color: var(--color-sand);
  }

  .info-divider {
    width: 2.5rem;
    height: 1px;
    background-color: rgba(200, 168, 130, 0.3);
    margin: 1.75rem 0;
  }

  .info-text {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.75;
    color: var(--color-lightsand);
    margin-bottom: 2rem;
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    color: var(--color-lightsand);
    font-size: 0.9rem;
    font-weight: 400;
    text-decoration: none;
    transition: color 0.2s ease;
    overflow-wrap: break-word;
    word-break: break-all;
    min-height: 44px;
  }

  .contact-item:hover {
    color: var(--color-cream);
  }

  .contact-item:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  .contact-icon {
    display: flex;
    align-items: center;
    color: var(--color-sand);
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .contact-item:hover .contact-icon {
    color: var(--color-cream);
  }

  /* Footer */
  .footer-row {
    max-width: 72rem;
    margin: 4rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid rgba(200, 168, 130, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .copyright {
    font-size: 0.75rem;
    color: var(--color-midbrown);
    letter-spacing: 0.04em;
  }

  .impressum-link {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-midbrown);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .impressum-link:hover {
    color: var(--color-sand);
  }

  .impressum-link:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }
</style>
