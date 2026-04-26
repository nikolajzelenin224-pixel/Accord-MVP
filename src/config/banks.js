// Bank configurations for different regions
export const BANK_CONFIGS = {
  cis: [
    {
      id: 'sberbank',
      name: { ru: 'Сбербанк', en: 'Sberbank' },
      gradient: 'linear-gradient(135deg, #21a038 0%, #1a7d2e 100%)',
      logo: '🏦',
      textColor: '#ffffff',
      region: 'cis'
    },
    {
      id: 'tinkoff',
      name: { ru: 'Т-Банк', en: 'T-Bank' },
      gradient: 'linear-gradient(135deg, #ffdd2d 0%, #ffc700 100%)',
      logo: '⚡',
      textColor: '#000000',
      region: 'cis'
    },
    {
      id: 'alfa',
      name: { ru: 'Альфа-Банк', en: 'Alfa-Bank' },
      gradient: 'linear-gradient(135deg, #ef3124 0%, #d32f2f 100%)',
      logo: '🅰️',
      textColor: '#ffffff',
      region: 'cis'
    },
    {
      id: 'kaspi',
      name: { ru: 'Kaspi.kz', en: 'Kaspi.kz' },
      gradient: 'linear-gradient(135deg, #f14635 0%, #d63a2d 100%)',
      logo: '🏛️',
      textColor: '#ffffff',
      region: 'cis'
    }
  ],
  global: [
    {
      id: 'revolut',
      name: { ru: 'Revolut', en: 'Revolut' },
      gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      logo: '🌐',
      textColor: '#000000',
      region: 'global'
    },
    {
      id: 'mercury',
      name: { ru: 'Mercury', en: 'Mercury' },
      gradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      logo: '💼',
      textColor: '#ffffff',
      region: 'global'
    }
  ]
};

// Helper function to get banks by language
export const getBanksByLanguage = (language) => {
  return language === 'ru' ? BANK_CONFIGS.cis : BANK_CONFIGS.global;
};
