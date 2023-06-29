import {
  MyAwesomeError,
  rejectCustomError,
  resolveValue,
  throwCustomError,
  throwError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 'Hello, world!';
    await expect(resolveValue(value)).resolves.toBe(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'Custom error message';
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultErrorMessage = 'Oops!';
    expect(() => throwError()).toThrow(defaultErrorMessage);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
