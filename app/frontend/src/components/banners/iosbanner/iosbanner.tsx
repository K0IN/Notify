import { FunctionalComponent, h } from "preact";
import style from './iosbanner.css';

const IosInstallBanner: FunctionalComponent = () =>
    <div class={style.updateBanner} onClick={() => location.reload()}>
        Warning! IOS devices do not support web push notifications without installation.<br />
        Add our website to your iOS device's home screen for instant access to web push notifications:<br />
        Tap the share icon at the bottom of Safari.<br />
        Select "Add to Home Screen."<br />
        That is it! You can now use Notify.<br />
    </div>;
export default IosInstallBanner;