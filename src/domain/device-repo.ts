import { Device as Device } from './device';

/**
 * Repository interface for persisting and retrieving Device entities.
 * Implementations should map these methods to whatever backing store is used
 * (in-memory, database, external service, etc.).
 */
export interface DeviceRepo {
  /**
   * Fetch a Device by id. Returns null if not found.
   */
  getById(id: string): Promise<Device | null>;

  /**
   * List all Devices. Implementations may choose to add pagination later.
   */
  list(): Promise<Device[]>;

  /**
   * Save a Device (create or update / upsert).
   * Implementations should insert the Device if it does not exist, or
   * update the existing record if it does. Return the saved Device (which
   * may include store-generated fields or normalized values).
   */
  save(Device: Device): Promise<Device>;

  /**
   * Remove a Device by id. No-op if the Device does not exist.
   */
  delete(id: string): Promise<void>;
}
