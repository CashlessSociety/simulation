const script = [
  {
    from: 'a', to: 'b',
    amt: 20, currency: 'ct', type: 'promise'
  },
  {
    from: 'b', to: 'c',
    amt: 20, currency: 'ct', type: 'promise'
  },
  {
    from: 'c', to: 'a',
    amt: 20, currency: 'ct', type: 'promise'
  },

  {
    users: ['a', 'b', 'c'],
    amt: 20, currency: 'ct', type: 'reciprocity'
  },
  {
    type: 'reset'
  },
  {
    users: ['a', 'b', 'c'],
    type: 'users'
  },
  {
    from: 'community', to: 'a',
    amt: 20, currency: 'ct', type: 'mutual'
  },
  {
    from: 'community', to: 'b',
    amt: 20, currency: 'ct', type: 'mutual'
  },
  {
    from: 'community', to: 'c',
    amt: 20, currency: 'ct', type: 'mutual'
  },
  {
    from: 'a', to: 'b',
    amt: 20, currency: 'ct', type: 'promise'
  },
  {
    from: 'b', to: 'c',
    amt: 20, currency: 'ct', type: 'promise'
  },
  {
    from: 'c', to: 'c',
    amt: 20, currency: 'ct', type: 'promise'
  },
];

export { script };