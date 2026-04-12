<script>
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<svelte:head>
  <title>Admin Login — Altholz Design</title>
</svelte:head>

<div class="login-wrap">
  <div class="login-card">
    <p class="login-eyebrow">Altholz Design</p>
    <h1 class="login-title">Backend</h1>

    <form method="POST" use:enhance class="login-form">
      <div class="field">
        <label for="password">Passwort</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          class:error={form?.error}
        />
        {#if form?.error}
          <p class="field-error">{form.error}</p>
        {/if}
      </div>

      <button type="submit" class="login-btn">Anmelden</button>
    </form>
  </div>
</div>

<style>
  .login-wrap {
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg);
    padding: 1.5rem;
  }

  .login-card {
    width: 100%;
    max-width: 360px;
    background-color: var(--color-surface);
    border: 1px solid rgba(200, 168, 130, 0.15);
    border-radius: 12px;
    padding: 2.5rem 2rem;
  }

  .login-eyebrow {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sand);
    margin-bottom: 0.5rem;
  }

  .login-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2rem;
    font-weight: 400;
    color: var(--color-cream);
    margin-bottom: 2rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-lightsand);
    letter-spacing: 0.03em;
  }

  .field input {
    background-color: var(--color-bg);
    border: 1px solid rgba(200, 168, 130, 0.25);
    border-radius: 6px;
    padding: 0.6rem 0.875rem;
    color: var(--color-cream);
    font-size: 0.95rem;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .field input:focus {
    border-color: var(--color-sand);
  }

  .field input.error {
    border-color: #c0392b;
  }

  .field-error {
    font-size: 0.78rem;
    color: #e74c3c;
  }

  .login-btn {
    background-color: var(--color-brown);
    color: var(--color-cream);
    border: none;
    border-radius: 6px;
    padding: 0.7rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease;
    margin-top: 0.25rem;
  }

  .login-btn:hover {
    background-color: var(--color-midbrown);
  }
</style>
