import 'whatwg-fetch'; // polyfill fetch for Jest
import '@testing-library/jest-dom';
import { server } from './testServer';

// Start MSW before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of tests
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());
