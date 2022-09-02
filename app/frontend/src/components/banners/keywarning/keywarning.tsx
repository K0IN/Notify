import { FunctionalComponent, h } from "preact";
import style from './keywarning.css';

const KeyWarningBanner: FunctionalComponent = () => <div class={style.banner}>Warning the instance uses a insecure key please refer to the official <a href="https://github.com/K0IN/Notify/blob/main/doc/wrangler.md">documentation</a> to setup you app key properly.</div>;
export default KeyWarningBanner;