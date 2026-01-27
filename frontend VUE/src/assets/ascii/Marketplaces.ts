export interface Marketplace {
  key: string;
  name: string;
  logo: string;
  accentColor: string;
}

export const MARKETPLACES: Record<string, Marketplace> ={
  ozon: {
    name: 'ozon',
    key: 'OZON',
    accentColor: '#0085FF',
    logo:
`
 ██████  ███████  ██████  ███    ██ 
██    ██    ███  ██    ██ ████   ██ 
██    ██   ███   ██    ██ ██ ██  ██ 
██    ██  ███    ██    ██ ██  ██ ██ 
 ██████  ███████  ██████  ██   ████`,
  },


  wildberries: {
    name: 'wildberries',
    key: 'WILDBERRIES',
    accentColor: '#CB11AB',
    logo:
`
██     ██ ██ ██      ██████  ██████  ███████ ██████  ██████  ██ ███████ ███████ 
██     ██ ██ ██      ██   ██ ██   ██ ██      ██   ██ ██   ██ ██ ██      ██      
██  █  ██ ██ ██      ██   ██ ██████  █████   ██████  ██████  ██ █████   ███████ 
██ ███ ██ ██ ██      ██   ██ ██   ██ ██      ██   ██ ██   ██ ██ ██           ██ 
 ███ ███  ██ ███████ ██████  ██████  ███████ ██   ██ ██   ██ ██ ███████ ███████`,
  },


  yandex: {
    name: 'yandex',
    key: 'YANDEX',
    accentColor: '#FFCC00',
    logo:
`
██    ██  █████  ███    ██ ██████  ███████ ██   ██     ███    ███  █████  ██████  ██   ██ ███████ ████████ 
 ██  ██  ██   ██ ████   ██ ██   ██ ██       ██ ██      ████  ████ ██   ██ ██   ██ ██  ██  ██         ██    
  ████   ███████ ██ ██  ██ ██   ██ █████     ███       ██ ████ ██ ███████ ██████  █████   █████      ██    
   ██    ██   ██ ██  ██ ██ ██   ██ ██       ██ ██      ██  ██  ██ ██   ██ ██   ██ ██  ██  ██         ██    
   ██    ██   ██ ██   ████ ██████  ███████ ██   ██     ██      ██ ██   ██ ██   ██ ██   ██ ███████    ██`,
}
}

export const MarketplaccesArray = Object.values(MARKETPLACES);

export const getMarketplace = (key: string): Marketplace|undefined => {
    return MARKETPLACES[key];
}
