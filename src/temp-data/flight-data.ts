export interface FlightModel {
  airline: {
    name: string;
    shortName?: string;
    logo: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  departure: {
    city: string;
    code: string;
    date: string;
    time: string;
  };
  arrival: {
    city: string;
    code: string;
    date: string;
    time: string;
  };
  duration: string;
  numberOfStops?: number;
}

export const flightData: FlightModel[] = [
  {
    airline: {
      name: 'Airline',
      shortName: 'ADS',
      logo: '/images/american-airlines.svg',
    },
    price: {
      amount: 449,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '20:00',
    },
    arrival: {
      city: 'Los Angeles',
      code: 'LAX',
      date: '12 May',
      time: '01:50',
    },
    duration: '5h 50',
    numberOfStops: undefined,
  },
  {
    airline: {
      name: '',
      shortName: '',
      logo: '/images/swiss-airlines.svg',
    },
    price: {
      amount: 489,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '21:10',
    },
    arrival: {
      city: 'Barcelona-El Prat',
      code: 'BCN',
      date: '12 May',
      time: '04:50',
    },
    duration: '7h 50',
    numberOfStops: 1,
  },
  {
    airline: {
      name: 'Airline',
      shortName: 'ADS',
      logo: '/images/american-airlines.svg',
    },
    price: {
      amount: 449,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '20:00',
    },
    arrival: {
      city: 'Los Angeles',
      code: 'LAX',
      date: '12 May',
      time: '01:50',
    },
    duration: '5h 50',
    numberOfStops: undefined,
  },
  {
    airline: {
      name: '',
      shortName: '',
      logo: '/images/swiss-airlines.svg',
    },
    price: {
      amount: 489,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '21:10',
    },
    arrival: {
      city: 'Barcelona-El Prat',
      code: 'BCN',
      date: '12 May',
      time: '04:50',
    },
    duration: '7h 50',
    numberOfStops: 1,
  },
  {
    airline: {
      name: 'Airline',
      shortName: 'ADS',
      logo: '/images/american-airlines.svg',
    },
    price: {
      amount: 449,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '20:00',
    },
    arrival: {
      city: 'Los Angeles',
      code: 'LAX',
      date: '12 May',
      time: '01:50',
    },
    duration: '5h 50',
    numberOfStops: undefined,
  },
  {
    airline: {
      name: 'Airline',
      shortName: 'ADS',
      logo: '/images/american-airlines.svg',
    },
    price: {
      amount: 449,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '20:00',
    },
    arrival: {
      city: 'Los Angeles',
      code: 'LAX',
      date: '12 May',
      time: '01:50',
    },
    duration: '5h 50',
    numberOfStops: undefined,
  },
  {
    airline: {
      name: '',
      shortName: '',
      logo: '/images/swiss-airlines.svg',
    },
    price: {
      amount: 489,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '21:10',
    },
    arrival: {
      city: 'Barcelona-El Prat',
      code: 'BCN',
      date: '12 May',
      time: '04:50',
    },
    duration: '7h 50',
    numberOfStops: 1,
  },
  {
    airline: {
      name: 'Airline',
      shortName: 'ADS',
      logo: '/images/american-airlines.svg',
    },
    price: {
      amount: 449,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '20:00',
    },
    arrival: {
      city: 'Los Angeles',
      code: 'LAX',
      date: '12 May',
      time: '01:50',
    },
    duration: '5h 50',
    numberOfStops: undefined,
  },
  {
    airline: {
      name: '',
      shortName: '',
      logo: '/images/swiss-airlines.svg',
    },
    price: {
      amount: 489,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '21:10',
    },
    arrival: {
      city: 'Barcelona-El Prat',
      code: 'BCN',
      date: '12 May',
      time: '04:50',
    },
    duration: '7h 50',
    numberOfStops: 1,
  },
  {
    airline: {
      name: 'Airline',
      shortName: 'ADS',
      logo: '/images/american-airlines.svg',
    },
    price: {
      amount: 449,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '20:00',
    },
    arrival: {
      city: 'Los Angeles',
      code: 'LAX',
      date: '12 May',
      time: '01:50',
    },
    duration: '5h 50',
    numberOfStops: undefined,
  },
  {
    airline: {
      name: '',
      shortName: '',
      logo: '/images/swiss-airlines.svg',
    },
    price: {
      amount: 489,
      currency: '$',
    },
    departure: {
      city: 'New York',
      code: 'JFK',
      date: '11 May',
      time: '21:10',
    },
    arrival: {
      city: 'Barcelona-El Prat',
      code: 'BCN',
      date: '12 May',
      time: '04:50',
    },
    duration: '7h 50',
    numberOfStops: 1,
  },
];
