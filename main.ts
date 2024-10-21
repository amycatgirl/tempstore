import { Hono } from "hono";

import { StorageSingleton } from "./storage.ts";

import ApiRoutes from "./routes/api/index.ts";
import Views from "./routes/views/index.ts";
import { env } from "./env.ts";

const app = new Hono();

const storage = StorageSingleton.getInstance();

await storage.removeLeftovers();

app.route("/", Views);
app.route("/api", ApiRoutes);

setInterval(() => {
  storage.manager.purgeExpired();
}, 1000);

Deno.serve(
  {
    port: parseInt(env["PORT"]) || 5544,
    hostname: env["DOMAIN"] || "127.0.0.1",
  },
  app.fetch,
);

// Run on different port
// serve(routes, { port: 3000 });
