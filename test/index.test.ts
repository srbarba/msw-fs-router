import { join } from "node:path";
import { expect, it } from "vitest";
import { getMswHandlers } from "../src";
import { setupServer } from "msw/node";

it("should set msw handlers", async () => {
  const handlers = await getMswHandlers({
    baseURL: "http://localhost",
    scanDirs: [join(__dirname, "./routes")],
  });

  const server = setupServer(...handlers);
  server.listen();

  const response1 = await (await fetch("http://localhost/")).json();
  const response2 = await (await fetch("http://localhost/products")).json();
  const response3 = await (
    await fetch("http://localhost/orders/123", { method: "POST" })
  ).json();
  expect(response1).toMatchInlineSnapshot(`"ok"`);
  expect(response2).toMatchInlineSnapshot(`"GET"`);
  expect(response3).toMatchInlineSnapshot(`"123"`);
});
