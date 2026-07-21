import '@testing-library/jest-dom';

// Global fetch mock
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: [] }),
    ok: true,
  })
) as jest.Mock;
