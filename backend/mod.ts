import { Application, Router } from "oak";
import logger from "oak_logger";
import { deviceRouter } from './routes/device.ts';
import { keysRouter } from './routes/keys.ts';
import { notificationRouter } from './routes/notify.ts';
import { oakCors } from "cors";
import { serveStaticFilesMiddleware } from "./routes/static-files.ts";
import { AppParameters, AppParametersValidator } from "./types/appparameters.ts";

const apiRouter = new Router({ prefix: '/api' });
apiRouter.use(deviceRouter.routes(), deviceRouter.allowedMethods());
apiRouter.use(keysRouter.routes(), keysRouter.allowedMethods());
apiRouter.use(notificationRouter.routes(), notificationRouter.allowedMethods());

export async function serve(params: AppParameters, listen = true): Promise<Application> {

    const parsed = AppParametersValidator.safeParse(params);
    if (!parsed.success) {
        throw new Error(`Invalid parameters: ${JSON.stringify(parsed.error)}`);
    }

    const { port, vapidKey, sub, frontend, cors, sendkey, loginkey } = parsed.data;

    const app = new Application();
    
    if (cors) {
        app.use(oakCors());
    }

    app.use(logger.logger, logger.responseTime);
    app.use(apiRouter.routes(), apiRouter.allowedMethods());

    // serve frontend if path is set
    if (frontend) {
        app.use(serveStaticFilesMiddleware);
    }

    // inject global settings
    app.state.vapidKey = vapidKey;
    app.state.sub = sub;
    app.state.frontend = frontend;
    app.state.sendkey = sendkey;
    app.state.loginkey = loginkey;

    console.log(`Listening on http://localhost:${port}/ Config: ${JSON.stringify(params)}`);

    if (listen) {
        await app.listen({ port });
    }

    return app;
}
