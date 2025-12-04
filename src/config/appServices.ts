import { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';
import { FakeDeviceRepo } from '../infra/fake-device-repo';
import { ListDevicesDeps } from '../app/list-products';
import { UpsertDeviceDeps } from '../app/devices/upsert-device';

let cachedDeviceRepo: DeviceRepo | null = null;

export const getDeviceRepo = (): DeviceRepo => {
  if (!cachedDeviceRepo) {
    const now = new Date();
    const initialDevices: Device[] = [
      {
        id: 'p-001',
        name: 'Seeded Widget',
        pricePence: 1299,
        description: 'A seeded example device for local testing.',
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: 'p-002',
        name: 'Seeded Gadget',
        pricePence: 2599,
        description: 'Another seeded device to get you started.',
        updatedAt: now,
      },
    ];
    cachedDeviceRepo = new FakeDeviceRepo(initialDevices);
  }
  return cachedDeviceRepo;
};

export const makeListDevicesDeps = (): ListDevicesDeps => ({
  deviceRepo: getDeviceRepo(),
});

export const makeUpsertDeviceDeps = (): UpsertDeviceDeps => ({
  deviceRepo: getDeviceRepo(),
  now: () => new Date(),
});
