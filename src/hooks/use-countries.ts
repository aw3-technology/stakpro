export const useCountries = () => {
  const countries = [
    {
      continent: 'America',
      items: [
        { value: '1', label: 'United States', flag: '🇺🇸' },
        { value: '2', label: 'Canada', flag: '🇨🇦' },
        { value: '3', label: 'Mexico', flag: '🇲🇽' },
      ],
    },
    {
      continent: 'Africa',
      items: [
        { value: '4', label: 'South Africa', flag: '🇿🇦' },
        { value: '5', label: 'Nigeria', flag: '🇳🇬' },
        { value: '6', label: 'Morocco', flag: '🇲🇦' },
      ],
    },
    {
      continent: 'Asia',
      items: [
        { value: '7', label: 'China', flag: '🇨🇳' },
        { value: '8', label: 'Japan', flag: '🇯🇵' },
        { value: '9', label: 'India', flag: '🇮🇳' },
      ],
    },
    {
      continent: 'Europe',
      items: [
        { value: '10', label: 'United Kingdom', flag: '🇬🇧' },
        { value: '11', label: 'France', flag: '🇫🇷' },
        { value: '12', label: 'Germany', flag: '🇩🇪' },
      ],
    },
    {
      continent: 'Oceania',
      items: [
        { value: '13', label: 'Australia', flag: '🇦🇺' },
        { value: '14', label: 'New Zealand', flag: '🇳🇿' },
      ],
    },
  ];

  return countries;
};
