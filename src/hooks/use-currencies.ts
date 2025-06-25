export const useCurrencies = () => {
  const currencies = [
    {
      label: 'United States dollar',
      currency: 'USD',
      symbol: '$',
      value: 'USD',
    },
    {
      label: 'Euro',
      currency: 'EUR',
      symbol: '€',
      value: 'EUR',
    },
    {
      label: 'British pound',
      currency: 'GBP',
      symbol: '£',
      value: 'GBP',
    },
    {
      label: 'Turkish lira',
      currency: 'TRY',
      symbol: '₺',
      value: 'TRY',
    },
  ];

  return currencies;
};
