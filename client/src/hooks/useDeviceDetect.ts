import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceDetect(): {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Detección por User-Agent para identificar dispositivos móviles/tablets
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      
      // Detección por tamaño de pantalla como respaldo
      const width = window.innerWidth;
      
      if (isMobileDevice && width < 768) {
        setDeviceType('mobile');
      } else if (isMobileDevice || (width >= 768 && width < 1024)) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Ejecutar al cargar y cuando cambie el tamaño de la ventana
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  };
}