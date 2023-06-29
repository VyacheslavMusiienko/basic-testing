import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
  getBankAccount,
} from '.';

const initialBalance1 = 1000;
const initialBalance2 = 500;
const initialBalance3 = 2000;
const account: BankAccount = getBankAccount(initialBalance1);

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initialBalance1);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => {
      account.withdraw(initialBalance3);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account2: BankAccount = getBankAccount(initialBalance2);

    expect(() => {
      account.transfer(initialBalance3, account2);
    }).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => {
      account.transfer(initialBalance3, account);
    }).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    account.deposit(initialBalance2);

    expect(account.getBalance()).toBe(1000 + initialBalance2);
  });

  test('should withdraw money', () => {
    const initialBalance1 = 1000;
    const initialBalance2 = 500;
    const account: BankAccount = getBankAccount(initialBalance1);

    account.withdraw(initialBalance2);

    expect(account.getBalance()).toBe(initialBalance1 - initialBalance2);
  });

  test('should transfer money', () => {
    const account1: BankAccount = getBankAccount(initialBalance1);
    const account2: BankAccount = getBankAccount(initialBalance2);
    const transferAmount = 200;

    account1.transfer(transferAmount, account2);

    expect(account1.getBalance()).toBe(initialBalance1 - transferAmount);
    expect(account2.getBalance()).toBe(initialBalance2 + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();

    expect(typeof balance).toBe('number');
    expect(Number.isFinite(balance)).toBe(true);
    expect(balance).toBeGreaterThanOrEqual(0);
    expect(balance).toBeLessThanOrEqual(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    account.fetchBalance = jest.fn().mockResolvedValue(initialBalance2);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(initialBalance2);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    account.fetchBalance = jest.fn().mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
