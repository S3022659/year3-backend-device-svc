export type Device = {
  id: string;
  name: string;
  pricePence: number;
  description: string;
  updatedAt: Date;
};

export type CreateDeviceParams = {
  id: string;
  name: string;
  pricePence: number;
  description: string;
  updatedAt: Date;
};

export class DeviceError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ProductError';
  }
}

const validateDevice = (params: CreateDeviceParams): void => {
  if (!params.id || typeof params.id !== 'string' || params.id.trim() === '') {
    throw new DeviceError('id', 'Product id must be a non-empty string.');
  }
  if (
    !params.name ||
    typeof params.name !== 'string' ||
    params.name.trim() === ''
  ) {
    throw new DeviceError('name', 'Product name must be a non-empty string.');
  }
  if (
    typeof params.pricePence !== 'number' ||
    params.pricePence < 0 ||
    !Number.isInteger(params.pricePence)
  ) {
    throw new DeviceError(
      'pricePence',
      'Product pricePence must be a non-negative integer.'
    );
  }
  if (
    !params.description ||
    typeof params.description !== 'string' ||
    params.description.trim() === ''
  ) {
    throw new DeviceError(
      'description',
      'Product description must be a non-empty string.'
    );
  }
  if (
    !(params.updatedAt instanceof Date) ||
    isNaN(params.updatedAt.getTime())
  ) {
    throw new DeviceError(
      'updatedAt',
      'updatedAt must be a valid Date object.'
    );
  }
};

export const createDevice = (params: CreateDeviceParams): Device => {
  validateDevice(params);

  return {
    id: params.id,
    name: params.name,
    pricePence: params.pricePence,
    description: params.description,
    updatedAt: params.updatedAt,
  };
};
