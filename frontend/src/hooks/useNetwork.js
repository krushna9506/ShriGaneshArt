import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isNative = window.Capacitor !== undefined;

  useEffect(() => {
    let handler;
    
    if (isNative) {
      // Live query current network status
      Network.getStatus().then((status) => {
        setIsOnline(status.connected);
      });

      // Bind listener for connectivity shifts
      Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
      }).then((h) => {
        handler = h;
      });
    } else {
      // Standard browser listeners
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      if (handler) {
        handler.remove();
      }
    };
  }, [isNative]);

  return { isOnline, isNative };
}
