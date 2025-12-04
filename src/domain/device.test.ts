import { describe, it, expect } from 'vitest';
import { createDevice, DeviceError } from './device';

describe('createDevice', () => {
  describe('valid device creation', () => {
    it('should create a device with valid parameters', () => {
      const params = {
        id: 'prod-123',
        name: 'Test device',
        pricePence: 1999,
        description: 'A great test device',
        updatedAt: new Date('2025-01-01'),
      };

      const device = createDevice(params);

      expect(device).toEqual(params);
    });

    it('should allow a price of zero pence', () => {
      const params = {
        id: 'prod-zero',
        name: 'Freebie',
        pricePence: 0,
        description: 'Free device',
        updatedAt: new Date(),
      };

      const device = createDevice(params);

      expect(device.pricePence).toBe(0);
    });
  });

  describe('id validation', () => {
    it('should throw DeviceError when id is only whitespace', () => {
      const params = {
        id: '   ',
        name: 'Test device',
        pricePence: 1999,
        description: 'A test device',
        updatedAt: new Date(),
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });

    it('should include the field name on DeviceError for invalid id', () => {
      const params = {
        id: '',
        name: 'Test device',
        pricePence: 100,
        description: 'A test device',
        updatedAt: new Date(),
      };

      try {
        createDevice(params as any);
        // If no error thrown, fail the test explicitly
        expect(false).toBe(true);
      } catch (err) {
        expect(err).toBeInstanceOf(DeviceError);
        expect((err as DeviceError).field).toBe('id');
      }
    });
  });

  describe('name and description validation', () => {
    it('should throw DeviceError when name is only whitespace', () => {
      const params = {
        id: 'prod-1',
        name: '   ',
        pricePence: 100,
        description: 'Valid description',
        updatedAt: new Date(),
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });

    it('should throw DeviceError when description is only whitespace', () => {
      const params = {
        id: 'prod-2',
        name: 'Valid Name',
        pricePence: 100,
        description: '   ',
        updatedAt: new Date(),
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });
  });

  describe('pricePence validation', () => {
    it('should throw DeviceError when price is negative', () => {
      const params = {
        id: 'prod-neg',
        name: 'Bad Price',
        pricePence: -1,
        description: 'Negative price',
        updatedAt: new Date(),
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });

    it('should throw DeviceError when price is not an integer', () => {
      const params = {
        id: 'prod-float',
        name: 'Float Price',
        pricePence: 9.99 as any,
        description: 'Float price',
        updatedAt: new Date(),
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });
  });

  describe('updatedAt validation', () => {
    it('should throw DeviceError when updatedAt is not a Date', () => {
      const params = {
        id: 'prod-date',
        name: 'Bad Date',
        pricePence: 100,
        description: 'Invalid updatedAt',
        updatedAt: '2025-01-01' as any,
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });

    it('should throw DeviceError when updatedAt is an invalid Date', () => {
      const params = {
        id: 'prod-invalid-date',
        name: 'Invalid Date',
        pricePence: 100,
        description: 'Invalid date object',
        updatedAt: new Date('not-a-date'),
      };

      const act = () => createDevice(params as any);

      expect(act).toThrow(DeviceError);
    });
  });
});
