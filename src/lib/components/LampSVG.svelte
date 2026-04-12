<script>
  let { variant = 1, type = 'lamp' } = $props();
</script>

<style>
  .lamp-svg {
    width: 100%;
    height: 100%;
    max-width: 120px;
    max-height: 150px;
  }
</style>

{#if variant === 1}
  <!-- Tischlampe -->
  <svg viewBox="0 0 160 200" role="img" aria-label="Tischlampe" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <ellipse cx="80" cy="105" rx="24" ry="18" style="fill: var(--color-cream)" opacity="0.06"/>
    <path d="M44 110 L116 110 L100 48 L60 48 Z" style="fill: var(--color-sand)" opacity="0.92"/>
    <path d="M62 52 L98 52 L112 106 L48 106 Z" style="fill: var(--color-cream)" opacity="0.06"/>
    <rect x="58" y="44" width="44" height="6" rx="3" fill="#B8936E"/>
    <rect x="42" y="108" width="76" height="5" rx="2.5" fill="#A07852"/>
    <ellipse cx="80" cy="108" rx="9" ry="11" style="fill: var(--color-cream)" opacity="0.55"/>
    <ellipse cx="80" cy="108" rx="5" ry="6" style="fill: var(--color-cream)" opacity="0.4"/>
    <rect x="77" y="120" width="6" height="52" rx="3" style="fill: var(--color-brown)"/>
    <ellipse cx="80" cy="174" rx="28" ry="7" style="fill: var(--color-earth)"/>
    <ellipse cx="80" cy="172" rx="22" ry="5" fill="#5C3D2E"/>
    <line x1="79" y1="128" x2="79" y2="168" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.4"/>
  </svg>

{:else if variant === 2}
  <!-- Wandlampe -->
  <svg viewBox="0 0 160 200" role="img" aria-label="Wandlampe" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <rect x="108" y="40" width="18" height="100" rx="4" fill="#5C3D2E"/>
    <line x1="117" y1="48" x2="117" y2="132" style="stroke: var(--color-earth)" stroke-width="1.5" opacity="0.5"/>
    <rect x="72" y="78" width="38" height="7" rx="3.5" style="fill: var(--color-brown)"/>
    <path d="M42 86 L78 86 L68 148 L52 148 Z" style="fill: var(--color-sand)" opacity="0.92"/>
    <path d="M46 90 L74 90 L66 144 L54 144 Z" style="fill: var(--color-cream)" opacity="0.07"/>
    <rect x="40" y="82" width="40" height="6" rx="3" fill="#B8936E"/>
    <ellipse cx="60" cy="116" rx="8" ry="10" style="fill: var(--color-cream)" opacity="0.5"/>
    <ellipse cx="60" cy="116" rx="4" ry="5" style="fill: var(--color-cream)" opacity="0.4"/>
    <ellipse cx="60" cy="148" rx="20" ry="9" style="fill: var(--color-cream)" opacity="0.05"/>
    <circle cx="117" cy="78" r="4" style="fill: var(--color-earth)"/>
    <circle cx="117" cy="78" r="2" fill="#3D2B1F"/>
    <circle cx="117" cy="102" r="4" style="fill: var(--color-earth)"/>
    <circle cx="117" cy="102" r="2" fill="#3D2B1F"/>
  </svg>

{:else if variant === 3}
  <!-- Stehlampe -->
  <svg viewBox="0 0 160 220" role="img" aria-label="Stehlampe" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <ellipse cx="80" cy="90" rx="34" ry="22" style="fill: var(--color-cream)" opacity="0.05"/>
    <path d="M28 82 Q80 42 132 82 L120 106 Q80 88 40 106 Z" style="fill: var(--color-sand)" opacity="0.92"/>
    <path d="M36 86 Q80 50 124 86 L116 102 Q80 84 44 102 Z" style="fill: var(--color-cream)" opacity="0.07"/>
    <path d="M38 106 Q80 92 122 106" stroke="#A07852" stroke-width="4" stroke-linecap="round"/>
    <path d="M55 56 Q80 46 105 56" stroke="#B8936E" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="80" cy="106" rx="9" ry="11" style="fill: var(--color-cream)" opacity="0.55"/>
    <ellipse cx="80" cy="106" rx="5" ry="6" style="fill: var(--color-cream)" opacity="0.4"/>
    <path d="M77 118 L77 192 L83 192 L83 118 Z" style="fill: var(--color-brown)"/>
    <line x1="80" y1="126" x2="80" y2="188" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.4"/>
    <ellipse cx="80" cy="196" rx="32" ry="8" style="fill: var(--color-earth)"/>
    <ellipse cx="80" cy="193" rx="24" ry="6" fill="#5C3D2E"/>
  </svg>

{:else if type === 'shelf' || type === 'tray' || type === 'organizer' || type === 'sign'}
  <!-- Regal / Tablett / Organizer / Schild — horizontale Holzplatte -->
  <svg viewBox="0 0 160 160" role="img" aria-label="Holzobjekt" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <!-- Hauptbohle -->
    <rect x="20" y="60" width="120" height="22" rx="4" style="fill: var(--color-brown)"/>
    <!-- Holzmaserung -->
    <line x1="24" y1="68" x2="136" y2="68" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.4"/>
    <line x1="30" y1="74" x2="130" y2="74" stroke="#8B6040" stroke-width="0.5" opacity="0.3"/>
    <line x1="55" y1="62" x2="55" y2="80" style="stroke: var(--color-midbrown)" stroke-width="0.5" opacity="0.25"/>
    <line x1="90" y1="62" x2="90" y2="80" style="stroke: var(--color-midbrown)" stroke-width="0.5" opacity="0.25"/>
    <!-- Stirnkante -->
    <rect x="20" y="60" width="6" height="22" rx="2" style="fill: var(--color-earth)"/>
    <rect x="134" y="60" width="6" height="22" rx="2" style="fill: var(--color-earth)"/>
    <!-- Wandhalterungen -->
    <rect x="36" y="50" width="8" height="14" rx="2" fill="#5C3D2E"/>
    <rect x="116" y="50" width="8" height="14" rx="2" fill="#5C3D2E"/>
    <!-- Schrauben -->
    <circle cx="40" cy="54" r="2.5" fill="#3D2B1F"/>
    <circle cx="120" cy="54" r="2.5" fill="#3D2B1F"/>
    <!-- Dekorative Objekte auf dem Regal -->
    <rect x="32" y="44" width="10" height="16" rx="2" style="fill: var(--color-sand)" opacity="0.7"/>
    <rect x="46" y="48" width="8" height="12" rx="1.5" fill="#B8936E" opacity="0.6"/>
    <ellipse cx="118" cy="56" rx="7" ry="4" style="fill: var(--color-sand)" opacity="0.5"/>
  </svg>

{:else if type === 'frame' || type === 'mirror'}
  <!-- Bilderrahmen / Spiegel — rechteckiger Rahmen -->
  <svg viewBox="0 0 160 160" role="img" aria-label="Rahmen" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <!-- Äußerer Rahmen -->
    <rect x="28" y="22" width="104" height="116" rx="5" style="fill: var(--color-brown)"/>
    <!-- Holzmaserung -->
    <line x1="32" y1="30" x2="32" y2="130" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.4"/>
    <line x1="128" y1="30" x2="128" y2="130" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.4"/>
    <line x1="36" y1="26" x2="124" y2="26" stroke="#8B6040" stroke-width="0.5" opacity="0.3"/>
    <line x1="36" y1="134" x2="124" y2="134" stroke="#8B6040" stroke-width="0.5" opacity="0.3"/>
    <!-- Innenfläche (Bild/Spiegel) -->
    <rect x="44" y="38" width="72" height="84" rx="2" style="fill: var(--color-beige)" opacity="0.6"/>
    <!-- Spiegelglanz -->
    <line x1="50" y1="44" x2="80" y2="44" style="stroke: var(--color-cream)" stroke-width="1.5" opacity="0.3" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="68" y2="50" style="stroke: var(--color-cream)" stroke-width="1" opacity="0.2" stroke-linecap="round"/>
    <!-- Eckverzierungen -->
    <rect x="28" y="22" width="12" height="12" rx="2" style="fill: var(--color-earth)"/>
    <rect x="120" y="22" width="12" height="12" rx="2" style="fill: var(--color-earth)"/>
    <rect x="28" y="126" width="12" height="12" rx="2" style="fill: var(--color-earth)"/>
    <rect x="120" y="126" width="12" height="12" rx="2" style="fill: var(--color-earth)"/>
  </svg>

{:else if type === 'candle' || type === 'clock'}
  <!-- Kerzenhalter / Uhr — runde Holzscheibe -->
  <svg viewBox="0 0 160 160" role="img" aria-label="Holzscheibe" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <!-- Holzscheibe -->
    <circle cx="80" cy="80" r="52" style="fill: var(--color-brown)"/>
    <!-- Jahresringe -->
    <circle cx="80" cy="80" r="44" fill="none" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.5"/>
    <circle cx="80" cy="80" r="36" fill="none" style="stroke: var(--color-midbrown)" stroke-width="0.8" opacity="0.4"/>
    <circle cx="80" cy="80" r="26" fill="none" stroke="#8B6040" stroke-width="0.6" opacity="0.35"/>
    <circle cx="80" cy="80" r="16" fill="none" stroke="#8B6040" stroke-width="0.5" opacity="0.3"/>
    <!-- Maserungslinien -->
    <path d="M80 28 Q84 55 80 80 Q76 55 80 28" style="fill: var(--color-midbrown)" opacity="0.15"/>
    <path d="M28 80 Q55 76 80 80 Q55 84 28 80" style="fill: var(--color-midbrown)" opacity="0.15"/>
    <!-- Kern -->
    <circle cx="80" cy="80" r="5" style="fill: var(--color-earth)"/>
    <!-- Stirnholzkante -->
    <circle cx="80" cy="80" r="52" fill="none" style="stroke: var(--color-earth)" stroke-width="4"/>
  </svg>

{:else}
  <!-- Hocker / Ständer / generisches Holzmöbel -->
  <svg viewBox="0 0 160 160" role="img" aria-label="Holzmöbel" fill="none" xmlns="http://www.w3.org/2000/svg" class="lamp-svg">
    <!-- Sitzfläche / Platte oben -->
    <rect x="22" y="44" width="116" height="18" rx="4" style="fill: var(--color-brown)"/>
    <line x1="26" y1="50" x2="134" y2="50" style="stroke: var(--color-midbrown)" stroke-width="1" opacity="0.4"/>
    <line x1="26" y1="56" x2="134" y2="56" stroke="#8B6040" stroke-width="0.5" opacity="0.3"/>
    <!-- Linkes Bein -->
    <rect x="34" y="62" width="12" height="68" rx="3" fill="#5C3D2E"/>
    <line x1="40" y1="68" x2="40" y2="126" style="stroke: var(--color-earth)" stroke-width="1" opacity="0.35"/>
    <!-- Rechtes Bein -->
    <rect x="114" y="62" width="12" height="68" rx="3" fill="#5C3D2E"/>
    <line x1="120" y1="68" x2="120" y2="126" style="stroke: var(--color-earth)" stroke-width="1" opacity="0.35"/>
    <!-- Querstrebe -->
    <rect x="46" y="100" width="68" height="8" rx="3" style="fill: var(--color-brown)" opacity="0.8"/>
    <!-- Füße -->
    <ellipse cx="40" cy="132" rx="10" ry="4" style="fill: var(--color-earth)"/>
    <ellipse cx="120" cy="132" rx="10" ry="4" style="fill: var(--color-earth)"/>
  </svg>
{/if}
