import { DeviceRepo } from '../domain/device-repo';
import type { Device } from '../domain/device';
import { ListDevicesDeps } from '../app/list-products';
import { UpsertDeviceDeps } from '../app/devices/upsert-device';
import { CosmosDeviceRepo } from '../infra/cosmos-repo';

let cachedDeviceRepo: DeviceRepo | null = null;

export const getDeviceRepo = (): DeviceRepo => {
  if (!cachedDeviceRepo) {
    const connString = process.env.CosmosDbConnectionString;
    cachedDeviceRepo = new CosmosDeviceRepo(
      connString,
      'catalogue-db',
      'devices'
    );
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
