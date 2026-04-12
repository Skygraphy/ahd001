<script>
  let { children, data } = $props();
</script>

{#if data.isAuth}
  <div class="admin-shell">
    <header class="admin-header">
      <a href="/admin" class="admin-brand">
        <span class="brand-eyebrow">Altholz Design</span>
        <span class="brand-title">Backend</span>
      </a>
      <nav class="admin-nav">
        <a href="/admin" class="nav-link">Produkte</a>
        <a href="/admin/produkte/neu" class="nav-link nav-link--primary">+ Neu</a>
        <a href="/admin/einstellungen" class="nav-link nav-link--icon" title="Einstellungen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </a>
        <form method="POST" action="/admin/logout">
          <button type="submit" class="nav-link nav-link--logout">Abmelden</button>
        </form>
      </nav>
    </header>

    <main class="admin-main">
      {@render children()}
    </main>
  </div>
{:else}
  {@render children()}
{/if}

<style>
  .admin-shell {
    min-height: 100dvh;
    background-color: var(--color-bg);
    display: flex;
    flex-direction: column;
  }

  .admin-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: var(--color-surface);
    border-bottom: 1px solid rgba(200, 168, 130, 0.15);
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .admin-brand {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    line-height: 1.2;
  }

  .brand-eyebrow {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sand);
  }

  .brand-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--color-cream);
  }

  .admin-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.4rem 0.875rem;
    border-radius: 6px;
    text-decoration: none;
    color: var(--color-lightsand);
    background: transparent;
    border: none;
    font-family: inherit;
    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .nav-link:hover {
    color: var(--color-cream);
    background-color: var(--color-beige);
  }

  .nav-link--primary {
    background-color: var(--color-brown);
    color: var(--color-cream);
  }

  .nav-link--primary:hover {
    background-color: var(--color-midbrown);
    color: var(--color-cream);
  }

  .nav-link--icon {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-link--logout {
    color: var(--color-sand);
  }

  .admin-main {
    flex: 1;
    padding: 2rem 1.5rem;
    max-width: 72rem;
    width: 100%;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .admin-main {
      padding: 2.5rem 2rem;
    }
  }
</style>
