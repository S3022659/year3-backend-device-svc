import { describe, it, expect } from 'vitest';
import { listDevices } from './list-devices';
import { FakeDeviceRepo } from '../infra/fake-device-repo';
import { Device } from '../domain/device';

describe('listDevices', () => {
  it('should return empty array when no devices exist', async () => {
    // Arrange
    const deviceRepo = new FakeDeviceRepo();

    // Act
    const result = await listDevices({ deviceRepo });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should return all devices from the repository', async () => {
    // Arrange
    const devices: Device[] = [
      {
        id: 'prod-1',
        name: 'Device 1',
        pricePence: 1000,
        description: 'First device',
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'prod-2',
        name: 'Device 2',
        pricePence: 2000,
        description: 'Second device',
        updatedAt: new Date('2025-01-02'),
      },
    ];
    const deviceRepo = new FakeDeviceRepo(devices);

    // Act
    const result = await listDevices({ deviceRepo });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual(devices);
  });

  describe('error scenarios', () => {
    // Error scenario tests can be added here
    it.todo('should handle repository errors gracefully');

    it('should return failure when repository.list throws', async () => {
      // Arrange: create a repo that throws from `list`
      const throwingRepo = {
        list: async () => {
          throw new Error('repository unavailable');
        },
        // satisfy interface - not used in this test
        getById: async (id: string) => null,
        save: async (p: any) => p,
        delete: async (id: string) => undefined,
      } as any;

      // Act
      const result = await listDevices({ deviceRepo: throwingRepo });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('repository unavailable');
    });

    it('should not allow mutating returned devices to affect repository', async () => {
      // Arrange
      const devices: Device[] = [
        {
          id: 'prod-1',
          name: 'Device 1',
          pricePence: 1000,
          description: 'First device',
          updatedAt: new Date('2025-01-01'),
        },
      ];
      const deviceRepo = new FakeDeviceRepo(devices);

      // Act
      const first = await listDevices({ deviceRepo });
      expect(first.success).toBe(true);
      // mutate the returned object
      if (first.data && first.data[0]) {
        first.data[0].name = 'MUTATED';
      }

      // fetch again from repo
      const second = await listDevices({ deviceRepo });

      // Assert: repo should still hold original name
      expect(second.success).toBe(true);
      expect(second.data && second.data[0].name).toBe('Device 1');
    });
  });
});
