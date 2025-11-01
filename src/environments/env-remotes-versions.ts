import { RemoteApps } from "./env-remotes-resolver";

export const envRemotesVersions = {
  customHost: '',
  versionsApi: '',
  platform: 'hr',
  format: '?v={{version}}&d={{date:MM-DD-HH-mm}}',
  versions: {
    products: '2.3.1',
    cart: '1.9.0',
  } as Partial<Record<RemoteApps, string>>,

};
