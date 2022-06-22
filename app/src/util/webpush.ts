import { WebPushInfosSchema } from '../types/database/device';
import { WebPushInfos } from '../webpush/webpushinfos';
export const validateWebPushData = (data?: Partial<WebPushInfos>): data is Required<WebPushInfos> => WebPushInfosSchema.safeParse(data).success;