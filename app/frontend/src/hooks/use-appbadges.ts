import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { Device } from '../types/localdevice';

export const useAppBadges = (badges: number) => {
   /*
    return useCallback(() => {        
        if (!navigator || 
            !(navigator as { setAppBadge?: (cnt: number) => void }).setAppBadge || 
            !(navigator as { clearAppBadge?: () => void }).clearAppBadge) {
            return;
        }
        .clearAppBadge();
        .setAppBadge(1)    
    },[badges]);   
    */
};

