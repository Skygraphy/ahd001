<script>
  import { browser } from '$app/environment';

  let theme = $state(
    browser ? (localStorage.getItem('theme') ?? 'dark') : 'dark'
  );

  $effect(() => {
    if (!browser) return;
    if (theme === 'light') {
      document.documentElement.dataset.theme = 'light';
    } else {
      delete document.documentElement.dataset.theme;
    }
    localStorage.setItem('theme', theme);
  });
</script>

<div class="theme-group" role="group" aria-label="Farbschema wählen">
  <!-- Dunkel: Mond-Icon -->
  <button
    class="theme-btn"
    class:active={theme === 'dark'}
    onclick={() => theme = 'dark'}
    aria-label="Dunkles Design"
    aria-pressed={theme === 'dark'}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.75"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>

  <!-- Hell: Sonnen-Icon -->
  <button
    class="theme-btn"
    class:active={theme === 'light'}
    onclick={() => theme = 'light'}
    aria-label="Helles Design"
    aria-pressed={theme === 'light'}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.75"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  </button>

  <!-- System: Monitor-Icon -->
  <button
    class="theme-btn"
    class:active={theme === 'system'}
    onclick={() => theme = 'system'}
    aria-label="System-Design"
    aria-pressed={theme === 'system'}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="1.75"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  </button>
</div>

<style>
  .theme-group {
    position: fixed;
    top: 1.25rem;
    right: 1.5rem;
    z-index: 100;
    display: flex;
    gap: 2px;
    background-color: var(--color-surface);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 8px;
    padding: 3px;
    box-shadow: 0 2px 12px rgba(42, 26, 14, 0.25);
  }

  .theme-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--color-midbrown);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .theme-btn.active {
    background-color: var(--color-beige);
    color: var(--color-sand);
  }

  .theme-btn:hover:not(.active) {
    color: var(--color-lightsand);
  }

  .theme-btn:focus-visible {
    outline: 2px solid var(--color-sand);
    outline-offset: 2px;
  }
</style>
