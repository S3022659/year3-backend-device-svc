import { CosmosClient, Container } from '@azure/cosmos';
import { Device } from '../domain/device';
import { DeviceRepo } from '../domain/device-repo';

export class CosmosDeviceRepo implements DeviceRepo {
  private container: Container;

  constructor(connectionString: string, dbName: string, containerName: string) {
    const client = new CosmosClient({ connectionString });
    this.container = client.database(dbName).container(containerName);
  }

  async getById(id: string): Promise<Device | null> {
    try {
      const { resource } = await this.container.item(id, id).read<Device>();
      return resource ?? null;
    } catch (error: any) {
      if (error.code === 404) {
        return null;
      }
      throw error;
    }
  }

  async list(): Promise<Device[]> {
    const { resources } = await this.container.items
      .readAll<Device>()
      .fetchAll();
    return resources;
  }

  async save(device: Device): Promise<Device> {
    const { resource } = await this.container.items.upsert<Device>(device);
    return resource!;
  }

  async delete(id: string): Promise<void> {
    try {
      await this.container.item(id, id).delete();
    } catch (error: any) {
      if (error.code === 404) {
        // Already deleted or doesn't exist - no-op as per interface contract
        return;
      }
      throw error;
    }
  }
}
