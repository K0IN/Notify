import test from "ava";
import { Miniflare, Request } from "miniflare";

test.beforeEach((t) => {
    const mf = new Miniflare({
        buildCommand: undefined,
        kvNamespaces: ["NOTIFY_USERS"]
    });
    t.context = { mf };
});

test("test url check for create device", async (t) => {
    const { mf } = t.context;
    const req = new Request("http://localhost/api/device/", { 
        method: "POST", 
        body: `{
            "web_push_data": {
                "auth": "auth",
                "endpoint": "endpoint",
                "key": "key"
            }
        }` });
    const res = await mf.dispatchFetch(req);
    const json = await res.json();    
    t.assert(!json.success, "added device with invalid endpoint url"); 
});
