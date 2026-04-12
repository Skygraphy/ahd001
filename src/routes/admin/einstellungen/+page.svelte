<script>
  import { enhance } from '$app/forms';
  let { data } = $props();

  let active = $state(false);
  $effect(() => { active = data.maintenanceMode; });
</script>

<svelte:head>
  <title>Einstellungen — Admin</title>
</svelte:head>

<div class="page-header">
  <div>
    <a href="/admin" class="back-link">← Zur Übersicht</a>
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

  <div class="preview-link-row">
    <a href="/wartung" target="_blank" class="preview-link">Wartungsseite in neuem Tab öffnen ↗</a>
  </div>
</div>

<style>
  .page-header {
    margin-bottom: 2rem;
  }

  .back-link {
    font-size: 0.78rem;
    color: var(--color-sand);
    text-decoration: none;
    letter-spacing: 0.03em;
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  .back-link:hover { color: var(--color-lightsand); }

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
    background-color: var(--color-cream);
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

  .preview-link-row {
    border-top: 1px solid rgba(200, 168, 130, 0.1);
    padding: 0.875rem 1.5rem;
  }

  .preview-link {
    font-size: 0.78rem;
    color: var(--color-sand);
    text-decoration: none;
    letter-spacing: 0.03em;
  }

  .preview-link:hover { color: var(--color-lightsand); }
</style>
