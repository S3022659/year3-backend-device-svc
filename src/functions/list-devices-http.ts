import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { makeListDevicesDeps } from '../config/appServices';
import { listDevices } from '../app/list-products';

const listDevicesHandler = async (
  _request: HttpRequest
): Promise<HttpResponseInit> => {
  const deps = makeListDevicesDeps();
  const result = await listDevices(deps);

  if (!result.success) {
    return {
      status: 500,
      jsonBody: {
        success: false,
        message: 'Failed to list devices',
        error: result.error,
      },
    };
  }

  const devices = result.data ?? [];
  return {
    status: 200,
    jsonBody: devices.map((device) => ({
      ...device,
      updatedAt: device.updatedAt.toISOString(),
    })),
  };
};

app.http('listDevicesHttp', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'devices',
  handler: listDevicesHandler,
});
