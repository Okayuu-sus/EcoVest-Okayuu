interface ForestSilhouetteProps {
  className?: string;
}

/**
 * Hand-drawn pine-forest treeline, layered two rows deep for a bit of
 * parallax depth. Pure SVG (no external image asset) so it stays consistent
 * with the rest of the app's hand-rolled icon style and needs no licensing
 * or download. Meant to sit absolutely positioned at the bottom of a
 * gradient hero/CTA section.
 */
export default function ForestSilhouette({ className = "" }: ForestSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`}
      aria-hidden="true"
    >
      {/* back row — shorter, softer trees for depth */}
      <path
        className="text-forest-950/30"
        fill="currentColor"
        d="M0,220 L0,150 L40,180 L80,120 L120,170 L160,110 L200,165 L240,125 L280,175 L320,115 L360,168 L400,130 L440,178 L480,120 L520,172 L560,135 L600,180 L640,125 L680,170 L720,130 L760,175 L800,120 L840,168 L880,132 L920,178 L960,122 L1000,172 L1040,128 L1080,176 L1120,120 L1160,170 L1200,130 L1240,178 L1280,125 L1320,172 L1360,135 L1400,178 L1440,150 L1440,220 Z"
      />
      {/* front row — taller, darker trees closest to the viewer */}
      <path
        className="text-forest-950/60"
        fill="currentColor"
        d="M0,220 L0,170 L30,190 L60,130 L90,185 L120,110 L150,180 L180,100 L210,175 L240,95 L270,178 L300,105 L330,182 L360,90 L390,175 L420,115 L450,185 L480,100 L510,178 L540,120 L570,182 L600,95 L630,175 L660,110 L690,180 L720,90 L750,178 L780,120 L810,185 L840,100 L870,175 L900,115 L930,182 L960,95 L990,178 L1020,110 L1050,180 L1080,100 L1110,175 L1140,120 L1170,185 L1200,95 L1230,178 L1260,115 L1290,182 L1320,100 L1350,178 L1380,120 L1410,185 L1440,170 L1440,220 Z"
      />
    </svg>
  );
}
