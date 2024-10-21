import { Hono, type Context } from "hono";

import { StorageSingleton } from "../../storage.ts";

const api = new Hono();

api.post("/object", async (c: Context) => {
  const form = await c.req.formData();
  const file = form.get("file") ?? 1;
  const until: unknown = form.get("until");
  const storage = StorageSingleton.getInstance();

  if (until && (until as number) > 5) {
    return c.json(
      {
        message: "You can't store files for more than five hours!",
      },
      400,
    );
  }

  if (!file) {
    return c.json({
      message: "Missing file",
    });
  } else if (file instanceof File) {
    try {
      const { id, filename, stored_until } = await storage.storeFile(
        file,
        (until as number | undefined) ?? 1,
      );

      console.log(`[CREATE] File ${filename} was created`);
      return c.json(
        {
          id,
          filename,
          message: `Saved ${filename} until ${new Date(stored_until)}`,
        },
        201,
      );
    } catch {
      return c.json({ message: "Error whilst creating object" }, 500);
    }
  } else {
    return c.json({}, 406);
  }
});

api.get("/object/:id", async (c: Context) => {
  if (!c.req.param()) return c.text("", 400);

  const objectId = c.req.param("id");
  const storage = StorageSingleton.getInstance();
  const object = storage.getFile(objectId);

  if (!object) return c.json({ message: `Could not find object ${objectId}` });

  console.log(`[GET] Found ${object.filename}, serving...`);

  try {
    const file = await object.openFile();

    if (!file) throw new Error(`Could not open file ${object.filename}`);

    c.header("Content-Type", object.mimeType);
    c.status(200);

    return c.body(file, { "Content-type": object.mimeType });
  } catch (error: unknown) {
    return c.json(
      {
        message: "Error whilst opening file",
        error: (error as Error).message,
      },
      500,
    );
  }
});

export default api;
