<script>
  import { enhance } from '$app/forms';
  let { data, form } = $props();

  let active       = $state(false);
  let contactEmail = $state('');
  let template     = $state('');
  $effect(() => { active       = data.maintenanceMode; });
  $effect(() => { contactEmail = data.contactEmail; });
  $effect(() => { template     = data.inquiryTemplate; });
</script>

<svelte:head>
  <title>Einstellungen — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <a href="/admin" class="back-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      Zur Übersicht
    </a>
    <h1 class="page-title">Einstellungen</h1>
  </div>
</div>

{#if active}
  <div class="alert-warning">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
    Wartungsmodus ist aktiv — die Website ist für Besucher nicht erreichbar.
  </div>
{/if}

<div class="settings-card">
  <div class="setting-row">
    <div class="setting-info">
      <p class="setting-label">Wartungsmodus</p>
      <p class="setting-description">
        Wenn aktiviert, sehen alle Besucher die Wartungsseite.<br />
        Der Admin-Bereich bleibt jederzeit erreichbar.
      </p>
    </div>

    <form method="POST" action="?/toggleMaintenance" use:enhance={() => {
      return ({ result }) => {
        if (result.type === 'success') active = !active;
      };
    }}>
      <input type="hidden" name="value" value={active ? 'false' : 'true'} />
      <button
        type="submit"
        class="toggle-switch"
        class:on={active}
        aria-pressed={active}
        aria-label={active ? 'Wartungsmodus deaktivieren' : 'Wartungsmodus aktivieren'}
      >
        <span class="toggle-thumb"></span>
      </button>
    </form>
  </div>

</div>

<div class="settings-card" style="margin-top: 1.5rem">
  <form method="POST" action="?/saveContactEmail" use:enhance class="setting-row setting-row--col">
    <div class="setting-info">
      <p class="setting-label">E-Mail-Adresse (Kontaktbereich)</p>
      <p class="setting-description">Wird im Kontaktbereich der Website angezeigt.</p>
    </div>
    <input
      name="email"
      type="email"
      class="template-input"
      bind:value={contactEmail}
    />
    {#if form?.success}
      <p class="save-success">Gespeichert.</p>
    {/if}
    <div>
      <button type="submit" class="btn-save">Speichern</button>
    </div>
  </form>
</div>

<div class="settings-card" style="margin-top: 1.5rem">
  <form method="POST" action="?/saveTemplate" use:enhance class="setting-row setting-row--col">
    <div class="setting-info">
      <p class="setting-label">Anfrage-Textvorlage</p>
      <p class="setting-description">
        Wird als Vortext im Nachrichtenfeld des Kontaktformulars eingefügt, wenn ein Besucher
        auf „Anfrage senden" klickt. <code class="placeholder-hint">{'{Name}'}</code> wird durch den Produktnamen ersetzt.
      </p>
    </div>
    <textarea
      name="template"
      rows="4"
      class="template-textarea"
      bind:value={template}
    ></textarea>
    {#if form?.success}
      <p class="save-success">Gespeichert.</p>
    {/if}
    <div>
      <button type="submit" class="btn-save">Speichern</button>
    </div>
  </form>
</div>

<style>
  .page-header {
    margin-bottom: 2rem;
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
    margin-bottom: 1.25rem;
    transition: color 0.2s ease;
  }

  .back-link:hover { color: var(--color-cream); }

  .back-link:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
    border-radius: 2px;
  }

  .page-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--color-cream);
  }

  .alert-warning {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    background-color: rgba(192, 100, 20, 0.12);
    border: 1px solid rgba(192, 100, 20, 0.4);
    color: #e8893a;
    border-radius: 8px;
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .settings-card {
    background-color: var(--color-surface);
    border: 1px solid rgba(200, 168, 130, 0.15);
    border-radius: 10px;
    overflow: hidden;
    max-width: 640px;
  }

  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 1.5rem;
  }

  .setting-info {
    flex: 1;
    min-width: 0;
  }

  .setting-label {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-cream);
    margin-bottom: 0.3rem;
  }

  .setting-description {
    font-size: 0.8rem;
    color: var(--color-sand);
    line-height: 1.55;
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    width: 48px;
    height: 26px;
    border-radius: 99px;
    border: none;
    background-color: rgba(200, 168, 130, 0.2);
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.2s ease;
    padding: 0;
  }

  .toggle-switch.on {
    background-color: #c0392b;
  }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #FAF6F0;
    transition: transform 0.2s ease;
    display: block;
  }

  .toggle-switch.on .toggle-thumb {
    transform: translateX(22px);
  }

  .toggle-switch:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }


  .setting-row--col {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .template-input {
    background-color: var(--color-bg);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 6px;
    padding: 0.55rem 0.875rem;
    color: var(--color-cream);
    font-size: 0.9rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .template-input:focus { border-color: var(--color-sand); }

  .template-textarea {
    background-color: var(--color-bg);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 6px;
    padding: 0.6rem 0.875rem;
    color: var(--color-cream);
    font-size: 0.9rem;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .template-textarea:focus { border-color: var(--color-sand); }

  .placeholder-hint {
    background-color: rgba(200, 168, 130, 0.12);
    border-radius: 3px;
    padding: 0.1em 0.35em;
    font-size: 0.85em;
    color: var(--color-sand);
    font-family: monospace;
  }

  .btn-save {
    background-color: var(--color-brown);
    color: #FAF6F0;
    border: none;
    border-radius: 6px;
    padding: 0.55rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .btn-save:hover { background-color: var(--color-midbrown); }

  .save-success {
    font-size: 0.8rem;
    color: #2ecc71;
  }
</style>
