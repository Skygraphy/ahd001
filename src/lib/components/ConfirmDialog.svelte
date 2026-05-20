<script>
  let { open = $bindable(false), message = '', onConfirm } = $props();

  function handleConfirm() { open = false; onConfirm?.(); }
  function handleCancel()  { open = false; }

  function onKeydown(e) { if (e.key === 'Escape') handleCancel(); }

  $effect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeydown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = '';
    };
  });
</script>

{#if open}
  <div class="backdrop" onclick={handleCancel} role="presentation">
    <div class="dialog" role="alertdialog" aria-modal="true"
         onclick={(e) => e.stopPropagation()}>
      <p class="message">{message}</p>
      <div class="actions">
        <button class="btn-cancel" onclick={handleCancel}>Abbrechen</button>
        <button class="btn-confirm" onclick={handleConfirm}>Löschen</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(20, 12, 6, 0.72);
    backdrop-filter: blur(3px);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dialog {
    background-color: var(--color-surface);
    border: 1px solid rgba(200, 168, 130, 0.2);
    border-radius: 12px;
    padding: 1.75rem 2rem;
    width: min(90vw, 360px);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.55);
  }

  .message {
    font-size: 0.95rem;
    color: var(--color-lightsand);
    line-height: 1.55;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 0.625rem;
    justify-content: flex-end;
  }

  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(200, 168, 130, 0.25);
    color: var(--color-lightsand);
    border-radius: 6px;
    padding: 0.5rem 1.1rem;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .btn-cancel:hover {
    background-color: var(--color-beige);
    color: var(--color-cream);
  }

  .btn-confirm {
    background-color: #a93226;
    border: none;
    color: #fff;
    border-radius: 6px;
    padding: 0.5rem 1.1rem;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .btn-confirm:hover { background-color: #c0392b; }
</style>
