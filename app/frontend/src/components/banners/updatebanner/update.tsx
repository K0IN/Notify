import { FunctionalComponent, h } from "preact";
import style from './update.css';

const HasUpdateBanner: FunctionalComponent = () => 
    <div class={style.updateBanner} onClick={() => location.reload()}>Update Available please reload please this page (click here)</div>;
export default HasUpdateBanner;