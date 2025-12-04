import { describe, it, expect } from 'vitest';
import { FakeDeviceRepo } from './fake-device-repo';
import { Device } from '../domain/device';

describe('FakeDeviceRepo', () => {
  it('getById should return null when device not found', async () => {
    const repo = new FakeDeviceRepo();

    const res = await repo.getById('nope');

    expect(res).toBeNull();
  });

  it('getById should return a cloned device when present', async () => {
    const device: Device = {
      id: 'p1',
      name: 'Device 1',
      pricePence: 100,
      description: 'desc',
      updatedAt: new Date('2025-01-01'),
    };

    const repo = new FakeDeviceRepo([device]);

    const a = await repo.getById('p1');
    expect(a).toEqual(device);

    // mutate returned object and ensure repo copy is unchanged
    if (a) a.name = 'MUTATED';

    const b = await repo.getById('p1');
    expect(b && b.name).toBe('Device 1');
  });

  it('save should insert and return saved device as clone', async () => {
    const repo = new FakeDeviceRepo();

    const device: Device = {
      id: 'p2',
      name: 'New',
      pricePence: 200,
      description: 'new device',
      updatedAt: new Date(),
    };

    const saved = await repo.save(device);
    expect(saved).toEqual(device);

    // mutate returned and ensure repo copy unchanged
    saved.name = 'MUTATED';
    const fromRepo = await repo.getById('p2');
    expect(fromRepo && fromRepo.name).toBe('New');
  });

  it('save should update existing device', async () => {
    const device: Device = {
      id: 'p3',
      name: 'Old',
      pricePence: 300,
      description: 'old',
      updatedAt: new Date(),
    };

    const repo = new FakeDeviceRepo([device]);

    const updated: Device = { ...device, name: 'Updated', pricePence: 350 };
    const saved = await repo.save(updated);
    expect(saved).toEqual(updated);

    const fromRepo = await repo.getById('p3');
    expect(fromRepo).toEqual(updated);
  });

  it('delete should remove a device', async () => {
    const device: Device = {
      id: 'p4',
      name: 'ToDelete',
      pricePence: 400,
      description: 'delete me',
      updatedAt: new Date(),
    };

    const repo = new FakeDeviceRepo([device]);

    await repo.delete('p4');

    const res = await repo.getById('p4');
    expect(res).toBeNull();
  });
});
