import { isDevMode, InjectionToken, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { envRemotesVersions } from './env-remotes-versions';
import { environment } from './environment';

export enum RemoteApps {
  cart = 'cart',
  products = 'products',
  company = 'company',
  jobSeeker = 'jobSeeker',
}

export interface RemoteUrlOptions {
  file?: string;          // default: 'remoteEntry.js'
  ignoreEnvUrl?: boolean; // default: false
  cacheBust?: boolean;    // default: true when version present
}

type SubdomainMap = Record<RemoteApps, string>;
type PortMap = Partial<Record<RemoteApps, number>>;

const SUBDOMAINS: SubdomainMap = {
  [RemoteApps.cart]: 'cart-remote',
  [RemoteApps.products]: 'products-remote',
  [RemoteApps.company]: 'company-remote',
  [RemoteApps.jobSeeker]: 'jobseeker-remote',
} as const;

const LOCAL_PORTS: PortMap = {
  [RemoteApps.cart]: 4202,
  [RemoteApps.products]: 4201,
  [RemoteApps.company]: 4204,
  [RemoteApps.jobSeeker]: 4205,
};

function isLocalHost(h: string): boolean {
  return h.includes('localhost') || h.startsWith('127.') || h.endsWith('.local');
}
function stripTrailingSlash(s: string): string {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

/** For DI contexts (browser/SSR) */
export const WINDOW_LOCATION = new InjectionToken<Location | null>('WINDOW_LOCATION', {
  providedIn: 'root',
  factory: () => {
    const doc = inject(DOCUMENT, { optional: true });
    return (doc?.defaultView?.location ?? null) as Location | null;
  },
});

/** Safe getter that works outside DI (top-level) too */
function getSafeLocation(): Location | null {
  try {
    return inject(WINDOW_LOCATION);
  } catch {
    // not in DI context (e.g., top-level module code)
    return (globalThis as any)?.location ?? null;
  }
}

const memo = new Map<string, string>();

export function getRemoteUrl(app: RemoteApps, opts: RemoteUrlOptions = {}): string {
  const key = JSON.stringify({ app, opts });
  const cached = memo.get(key);
  if (cached) return cached;

  const loc = getSafeLocation(); // may be null (SSR)
  const runningLocal = !!loc && isLocalHost(loc.hostname);
  const version =
    envRemotesVersions.versions?.[app] ??
    (environment as any)[`${app}Version`] ??
    undefined;

  const file = opts.file ?? 'remoteEntry.js';

  const log = (...a: unknown[]) => {
    if (isDevMode()) console.debug('[getRemoteUrl]', ...a);
  };

  // 1) explicit env override
  const envUrl = opts.ignoreEnvUrl ? undefined : ((environment as any)[`${app}ModuleUrl`] as string | undefined);
  if (envUrl) {
    try {
      const base = new URL(stripTrailingSlash(envUrl));
      base.pathname = `${base.pathname.replace(/\/+$/, '')}/${file}`;
      if ((opts.cacheBust ?? !!version) && version) base.searchParams.set('v', String(version));
      const out = base.toString();
      memo.set(key, out); log('env', { app, out });
      return out;
    } catch {
      log('env-url-invalid, falling back', { app, envUrl });
    }
  }

  // 2) derive host
  const customHost = envRemotesVersions.customHost;
  const hostWithPort = customHost || loc?.host || 'localhost:4200';
  const firstDot = hostWithPort.indexOf('.');
  const rootHost = firstDot > 0 ? hostWithPort.slice(firstDot + 1) : hostWithPort;

  // 3) local dev
  if (!loc || runningLocal || isLocalHost(rootHost)) {
    const port = LOCAL_PORTS[app];
    const host = port ? `localhost:${port}` : rootHost;
    const url = new URL(`http://${host}/${file}`);
    if ((opts.cacheBust ?? !!version) && version) url.searchParams.set('v', String(version));
    const out = url.toString();
    memo.set(key, out); log('local', { app, out });
    return out;
  }

  // 4) server
  const sub = SUBDOMAINS[app];
  const baseHostClean = rootHost.replace(new RegExp(`^${sub}\\.`), '');
  const url = new URL(`https://${sub}.${baseHostClean}/${file}`);
  if ((opts.cacheBust ?? !!version) && version) url.searchParams.set('v', String(version));
  const out = url.toString();
  memo.set(key, out); log('server', { app, out });
  return out;
}
