import { FunctionalComponent, h } from "preact";
import style from './notsupported.css';

const NotSupportedBanner: FunctionalComponent = () => <div class={style.banner}>Your device is does not support webpush.</div>;
export default NotSupportedBanner;