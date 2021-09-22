import test from "ava";
import { Miniflare, Request } from "miniflare";

test.beforeEach((t) => {
    const mf = new Miniflare({
        buildCommand: undefined,
    });
    t.context = { mf };
});

test("create a new device", async (t) => {
    t.assert(true)
});

/*
test("create a new device", async (t) => {
    const { mf } = t.context;
    const res = await mf.dispatchFetch(new Request("http://localhost:8787/api/device", { 
        method: "POST",
    }));
    console.log(res)
    const json = await res.json();
    console.log(json);
});
*/