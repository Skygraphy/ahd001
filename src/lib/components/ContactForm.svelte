<script>
  import { enhance } from '$app/forms';

  let { form } = $props();

  // Lokale touched-States für clientseitige Inline-Validierung
  let touched = $state({ name: false, email: false, message: false });
  let sending = $state(false);

  // Feldwerte für clientseitige Validierung
  let name    = $state('');
  let email   = $state('');
  let message = $state('');

  let errors = $derived({
    name:    name.trim().length === 0,
    email:   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: message.trim().length < 10,
  });

  function handleEnhance() {
    sending = true;
    return async ({ update }) => {
      sending = false;
      await update();
    };
  }

  function reset() {
    name = ''; email = ''; message = '';
    touched = { name: false, email: false, message: false };
  }
</script>

{#if form?.success}
  <div class="form-success">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-sand)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <p class="success-title">Nachricht gesendet</p>
    <p class="success-sub">Wir melden uns so bald wie möglich bei Ihnen.</p>
    <button class="btn-reset" onclick={reset} type="button">Weitere Anfrage</button>
  </div>

{:else}
  <form
    method="POST"
    action="/?/contact"
    use:enhance={handleEnhance}
    novalidate
  >

    <div class="field">
      <label for="cf-name">Name</label>
      <input
        id="cf-name"
        name="name"
        type="text"
        placeholder="Ihr Name"
        autocomplete="name"
        bind:value={name}
        onblur={() => (touched.name = true)}
        class:invalid={touched.name && errors.name}
        aria-describedby="cf-name-error"
        aria-invalid={touched.name && errors.name}
      />
      {#if touched.name && errors.name}
        <span id="cf-name-error" class="field-error" role="alert">Bitte geben Sie Ihren Namen ein.</span>
      {/if}
    </div>

    <div class="field">
      <label for="cf-email">E-Mail</label>
      <input
        id="cf-email"
        name="email"
        type="email"
        placeholder="ihre@email.at"
        autocomplete="email"
        bind:value={email}
        onblur={() => (touched.email = true)}
        class:invalid={touched.email && errors.email}
        aria-describedby="cf-email-error"
        aria-invalid={touched.email && errors.email}
      />
      {#if touched.email && errors.email}
        <span id="cf-email-error" class="field-error" role="alert">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
      {/if}
    </div>

    <div class="field">
      <label for="cf-message">Nachricht</label>
      <textarea
        id="cf-message"
        name="message"
        rows="5"
        placeholder="Welches Objekt interessiert Sie? Haben Sie besondere Wünsche?"
        bind:value={message}
        onblur={() => (touched.message = true)}
        class:invalid={touched.message && errors.message}
        aria-describedby="cf-message-error"
        aria-invalid={touched.message && errors.message}
      ></textarea>
      {#if touched.message && errors.message}
        <span id="cf-message-error" class="field-error" role="alert">Bitte schreiben Sie mindestens 10 Zeichen.</span>
      {/if}
    </div>

    {#if form?.error}
      <p class="submit-error">{form.error}</p>
    {/if}

    <button type="submit" class="btn-submit" disabled={sending}>
      {#if sending}
        <span class="spinner" aria-hidden="true"></span>
        Wird gesendet…
      {:else}
        Anfrage senden
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      {/if}
    </button>

  </form>
{/if}

<style>
  .contact-form,
  form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-sand);
  }

  @media (max-width: 480px) {
    label {
      font-size: 0.8rem;
    }
  }

  input,
  textarea {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    color: var(--color-cream);
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.6;
    width: 100%;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    resize: vertical;
  }

  @media (max-width: 480px) {
    textarea {
      resize: none;
    }
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(212, 184, 150, 0.4);
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: rgba(200, 168, 130, 0.6);
    background-color: rgba(255, 255, 255, 0.08);
  }

  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  input.invalid,
  textarea.invalid {
    border-color: rgba(200, 100, 80, 0.6);
  }

  .field-error {
    font-size: 0.75rem;
    color: rgba(220, 140, 110, 0.9);
  }

  .submit-error {
    font-size: 0.8rem;
    color: rgba(220, 140, 110, 0.9);
    text-align: center;
  }

  .btn-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.75rem;
    background-color: var(--color-brown);
    color: var(--color-cream);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    align-self: flex-start;
    min-height: 44px;
  }

  @media (max-width: 480px) {
    .btn-submit {
      align-self: stretch;
      width: 100%;
    }
  }

  .btn-submit:hover:not(:disabled) {
    background-color: var(--color-midbrown);
    transform: translateY(-1px);
  }

  .btn-submit:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(250, 246, 240, 0.3);
    border-top-color: var(--color-cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .form-success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 2rem;
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 0.5rem;
    background-color: rgba(255, 255, 255, 0.04);
  }

  .success-title {
    font-family: 'Cormorant Garamond', Georgia, ui-serif, serif;
    font-size: 1.5rem;
    font-weight: 400;
    color: var(--color-cream);
  }

  .success-sub {
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--color-lightsand);
    line-height: 1.6;
  }

  .btn-reset {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-sand);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    transition: color 0.2s ease;
  }

  .btn-reset:hover {
    color: var(--color-cream);
  }

  .btn-reset:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }
</style>
