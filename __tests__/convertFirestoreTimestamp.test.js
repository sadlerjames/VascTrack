import { convertFirestoreTimestamp } from '../lib/utility/convertFirestoreTimestamp';

describe('convertFirestoreTimestamp', () => {
  it('returns same date if input is a Date object', () => {
    const now = new Date();
    expect(convertFirestoreTimestamp(now)).toBe(now);
  });

  it('parses valid ISO date string', () => {
    const iso = '2023-01-01T12:00:00Z';
    const result = convertFirestoreTimestamp(iso);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(new Date(iso).getTime());

  });

  it('converts Firestore timestamp object with "seconds"', () => {
    const timestamp = { seconds: 1700000000 };
    const result = convertFirestoreTimestamp(timestamp);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(timestamp.seconds * 1000);
  });

  it('returns fallback Date and logs error for invalid string', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const result = convertFirestoreTimestamp('invalid-date');
    expect(result).toBeInstanceOf(Date);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('returns fallback Date and logs error for unknown format', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const result = convertFirestoreTimestamp(12345);
    expect(result).toBeInstanceOf(Date);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
