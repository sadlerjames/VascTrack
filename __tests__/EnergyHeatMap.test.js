import { processEnergyData, formatHour } from '../components/graphs/EnergyHeatMap';

describe('processEnergyData', () => {
  const sampleRecords = [
    {
      recordedAt: new Date('2023-04-29T08:00:00Z'), // Sat 9AM
      energyLevel: 3,
    },
    {
      recordedAt: new Date('2023-04-29T08:00:00Z'), // Sat 9AM
      energyLevel: 5,
    },
    {
      recordedAt: new Date('2023-04-28T10:00:00Z'), // Fri 11AM
      energyLevel: 2,
    },
    {
      recordedAt: new Date('2023-04-30T21:00:00Z'), // Sun 10PM
      energyLevel: 4,
    },
  ];

  it('computes average energy levels by hour and day', () => {
    const result = processEnergyData(sampleRecords);
    expect(result[9]['Sat']).toBe(4); 
    expect(result[11]['Fri']).toBe(2);
    expect(result[22]['Sun']).toBe(4); 
  });

  it('returns null for time slots with no records', () => {
    const result = processEnergyData(sampleRecords);
    expect(result[6]['Mon']).toBeNull(); // No Monday 6AM data
    expect(result[14]['Wed']).toBeNull(); // No Wednesday 2PM data
  });
});
