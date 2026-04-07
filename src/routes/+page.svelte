<script>
  import Hero from '$lib/components/Hero.svelte';
  import ProductGrid from '$lib/components/ProductGrid.svelte';
  import ContactSection from '$lib/components/ContactSection.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Altholz Design — Handgefertigte Altholzlampen</title>
</svelte:head>

<main>
  <Hero />
  <ProductGrid products={data.products} />
  <ContactSection />
</main>
