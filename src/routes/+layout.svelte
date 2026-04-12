<script>
  import '../app.css';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { page } from '$app/stores';
  let { children } = $props();
</script>

<svelte:head>
  {@html `<script>
    (function(){
      var t = localStorage.getItem('theme');
      if (t === 'light') {
        document.documentElement.dataset.theme = 'light';
      }
    })();
  </script>`}
</svelte:head>

{@render children()}

{#if !$page.url.pathname.startsWith('/admin')}
  <ThemeToggle />
{/if}
