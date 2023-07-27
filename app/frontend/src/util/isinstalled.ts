export function isPWAInstalled(): boolean {
    return ((window.navigator as any).standalone) || (window.matchMedia('(display-mode: standalone)').matches);
}