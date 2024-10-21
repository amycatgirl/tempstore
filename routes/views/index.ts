import { Hono, type Context } from "hono";
import { eta } from "../../eta.ts";
import { StorageSingleton } from "../../storage.ts";
import { env } from "../../env.ts";

const views = new Hono();

views.get("/", (c: Context) => {
  const renderedTemplate = eta.render("index", {});
  return c.html(renderedTemplate);
});

views.post("/", async (c: Context) => {
  const form = await c.req.formData();
  const file = form.get("file");
  const until: unknown | number = form.get("until") ?? 1;
  const storage = StorageSingleton.getInstance();
  const host =
    env["DOMAIN"] ?? Deno.env.get("DOMAIN") ?? "http://localhost:5544";

  if (!file) {
    c.status(400);
    return c.body(null);
  } else if (file instanceof File) {
    try {
      const { id, filename } = await storage.storeFile(file, until as number);

      console.log(`[CREATE] File ${filename} was created`);
      const renderedTemplate = eta.render("served", {
        id,
        filename,
        until,
        host,
      });

      c.status(200);

      return c.html(renderedTemplate);
    } catch (error) {
      return c.json(
        {
          message: "Error whilst creating object",
          error: (error as Error).message,
        },
        500,
      );
    }
  } else {
    c.status(406);
    return c.body(null);
  }
});

export default views;
