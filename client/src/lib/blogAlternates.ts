const pairs = [
  ['la-matemtica-del-wellness-calculando-el-roi-de-una-cabina-de-crioterapia', 'the-math-of-wellness-calculating-the-roi-of-a-cryotherapy-cabin'],
  ['ia-y-la-hiper-personalizacin-en-el-wellness', 'ai-hyper-personalization-in-wellness'],
  ['el-secreto-de-la-longevidad-cmo-los-hoteles-de-lujo-estn-innovando-en-bienestar', 'the-secret-of-longevity-how-luxury-hotels-are-innovating-in-wellness'],
  ['efecto-wow-redefiniendo-la-experiencia-de-lujo-en-spas', 'wow-effect-redefining-the-luxury-spa-experience'],
  ['menopausia-adaptando-el-spa-a-la-salud-hormonal', 'menopause-adapting-the-spa-to-hormonal-health'],
  ['bienestar-mental-y-mindfulness-integrado', 'mental-wellness-integrated-mindfulness'],
  ['eco-lujo-sostenibilidad-como-estndar-premium', 'eco-luxury-sustainability-as-a-premium-standard'],
  ['la-revolucin-de-la-longevidad-y-el-biohacking', 'the-longevity-revolution-biohacking'],
  ['tendencias-spa-2026-del-mimo-a-la-longevidad-cientfica', 'spa-trends-2026-from-pampering-to-scientific-longevity'],
] as const;

export const blogAlternates = Object.fromEntries(
  pairs.flatMap(([es, en]) => [
    [es, { es: `/blog/${es}`, en: `/blog/${en}` }],
    [en, { es: `/blog/${es}`, en: `/blog/${en}` }],
  ]),
) as Record<string, { es: string; en: string }>;
