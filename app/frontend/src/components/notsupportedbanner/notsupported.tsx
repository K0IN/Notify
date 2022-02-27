import { FunctionalComponent, h } from "preact";
import style from './notsupported.css';

const NotSupportedBanner: FunctionalComponent = () => <div class={style.banner}>Your device is not supported</div>;
export default NotSupportedBanner;