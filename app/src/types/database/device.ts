import type { WebPushInfos } from '../../webpush/webpushinfos';
import type { BaseEntry } from './baseentry';

export interface IDevice extends BaseEntry {
    pushData: WebPushInfos; // used for webpush
}
