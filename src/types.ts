// Define the application types
export interface VoucherData {
  pin: string;
  ussdCode?: string;
  price?: number;
  network?: Network;
}

export type Network = 'mtn' | 'airtel' | 'glo' | '9mobile';

export interface NetworkConfig {
  name: string;
  color: string;
  logo?: string;
}

export const NETWORKS: Record<Network, NetworkConfig> = {
  mtn: {
    name: 'MTN',
    color: '#FFCC00'
  },
  airtel: {
    name: 'Airtel',
    color: '#FF0000'
  },
  glo: {
    name: 'Glo',
    color: '#00FF00'
  },
  '9mobile': {
    name: '9Mobile',
    color: '#006633'
  }
};

export const formatUSSDCode = (pin: string): string => {
  return `*311*${pin}#`;
};