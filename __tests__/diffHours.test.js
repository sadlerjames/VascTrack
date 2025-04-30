import { differenceInHours } from '../lib/utility/diffHours';

describe('differenceInHours', () => {
  it('returns correct difference in hours between two valid Date objects', () => {
    const dose = new Date('2023-01-01T10:00:00Z');
    const symptom = new Date('2023-01-01T16:00:00Z');
    expect(differenceInHours(symptom, dose)).toBe(6);
  });

  it('returns negative difference if symptom is before dose', () => {
    const dose = new Date('2023-01-01T18:00:00Z');
    const symptom = new Date('2023-01-01T10:00:00Z');
    expect(differenceInHours(symptom, dose)).toBe(-8);
  });

  it('returns null and warns if either input is missing', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    expect(differenceInHours(null, new Date())).toBeNull();
    expect(differenceInHours(new Date(), null)).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    consoleWarnSpy.mockRestore();
  });

  it('returns null and warns if either input is an invalid Date', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    expect(differenceInHours(new Date('invalid'), new Date())).toBeNull();
    expect(differenceInHours(new Date(), new Date('invalid'))).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
    consoleWarnSpy.mockRestore();
  });
});
