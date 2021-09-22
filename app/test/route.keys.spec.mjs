// https://miniflare.dev/recipes/ava.html#isolated-tests
import test from "ava";
import { Miniflare } from "miniflare";

test.beforeEach((t) => {
    const mf = new Miniflare({
        buildCommand: undefined,
    });
    t.context = { mf };
});

test("returns the default server keys", async (t) => {
    const { mf } = t.context;
    const res = await mf.dispatchFetch("http://localhost:8787/api/keys");
    const json = await res.json();
    t.is(json.data, "BGDRJjAeUMkFC1uFnqR0L5-VlqwV6RxhQedXid6CY95ONU3NCQI82-WvNWc2vc9HV8YOIAC9VsMrMhJhi3XS8MQ");
});