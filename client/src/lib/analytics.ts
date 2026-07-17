declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTM_ID = 'GTM-KGMBTXN2';
const ATTRIBUTION_KEY = 'epm_campaign_attribution';
const CAMPAIGN_PARAMETERS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
] as const;
let interactionTrackingInitialized = false;

type CampaignAttribution = Partial<Record<(typeof CAMPAIGN_PARAMETERS)[number], string>> & {
  landing_page?: string;
  referrer_host?: string;
};

function sanitizeCampaignValue(value: string | null) {
  return value?.trim().slice(0, 200) || undefined;
}

function readCampaignAttribution(): CampaignAttribution {
  if (typeof window === 'undefined') return {};

  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as CampaignAttribution
      : {};
  } catch {
    return {};
  }
}

export function initCampaignAttribution() {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const captured = CAMPAIGN_PARAMETERS.reduce<CampaignAttribution>((result, key) => {
    const value = sanitizeCampaignValue(url.searchParams.get(key));
    if (value) result[key] = value;
    return result;
  }, {});
  const hasCampaignParameters = Object.keys(captured).length > 0;
  const storedAttribution = readCampaignAttribution();

  if (!hasCampaignParameters && Object.keys(storedAttribution).length > 0) return;

  captured.landing_page = window.location.pathname;
  if (document.referrer) {
    try {
      captured.referrer_host = new URL(document.referrer).hostname.slice(0, 200);
    } catch {
      // Ignore malformed referrers rather than blocking analytics initialization.
    }
  }

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(captured));
  } catch {
    // Tracking must never prevent the site from loading in restricted browsers.
  }
}

export function updateConsent(granted: boolean) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  });
}

export function loadGoogleTagManager() {
  if (document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.dataset.gtmId = GTM_ID;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

export function trackEvent(event: string, parameters: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: window.location.pathname,
    ...readCampaignAttribution(),
    ...parameters,
  });
}

export function initInteractionTracking() {
  if (interactionTrackingInitialized || typeof document === 'undefined') return;
  interactionTrackingInitialized = true;

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const actionable = event.target.closest<HTMLElement>('a,button');
    if (!actionable) return;

    const anchor = actionable instanceof HTMLAnchorElement ? actionable : null;
    const href = anchor?.getAttribute('href') || '';
    const location = actionable.closest('footer')
      ? 'footer'
      : actionable.closest('#contact')
        ? 'contact'
        : 'page';

    if (href.startsWith('tel:')) {
      trackEvent('click_to_call', { link_location: location });
    } else if (href.startsWith('mailto:')) {
      trackEvent('click_email', { link_location: location });
    }

    const cta = actionable.closest<HTMLElement>('[data-analytics-cta]');
    const ctaName = cta?.dataset.analyticsCta;
    if (ctaName) {
      trackEvent('cta_click', {
        cta_name: ctaName,
        cta_location: cta.dataset.analyticsLocation || location,
      });
    }
  }, { capture: true });
}
