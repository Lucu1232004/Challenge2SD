// Hook de información del dispositivo y la batería.
import { useCallback, useEffect, useState } from 'react';
import { Device } from '@capacitor/device';

export interface DeviceData {
  model: string;
  platform: string;
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
  webViewVersion: string;
  identifier: string;
  batteryLevel: number | null;
  isCharging: boolean | null;
}

export function useDevice() {
  const [data, setData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [info, battery, id] = await Promise.all([
        Device.getInfo(),
        Device.getBatteryInfo(),
        Device.getId(),
      ]);
      setData({
        model: info.model,
        platform: info.platform,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
        webViewVersion: info.webViewVersion,
        identifier: id.identifier,
        batteryLevel: battery.batteryLevel ?? null,
        isCharging: battery.isCharging ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo leer la información del dispositivo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, load };
}
