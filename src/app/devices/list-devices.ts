import { DeviceRepo } from '../../domain/device-repo';
import { Device } from '../../domain/device';

export type ListDevicesDeps = {
  deviceRepo: DeviceRepo;
};

export type ListDevicesResult = {
  success: boolean;
  data?: Device[];
  error?: string;
};

/**
 * Create a use-case for listing Devices.
 * Usage:
 *   const result = await listDevices({ deviceRepo });
 */
export async function listDevices(
  deps: ListDevicesDeps
): Promise<ListDevicesResult> {
  const { deviceRepo } = deps;

  try {
    const Devices = await deviceRepo.list();
    return { success: true, data: Devices };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
