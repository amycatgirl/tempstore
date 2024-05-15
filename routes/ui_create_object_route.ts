import {
  BadRequest,
  Created,
  InternalServerError,
  NotAcceptable,
} from "wren/response.ts";
import { POST } from "wren/route.ts";
import { StorageSingleton } from "../storage.ts";
import { html } from "html/mod.ts";

const UICreateObjectRoute = POST("/", async (req) => {
  const form = await req.formData();
  const file = form.get("file");
  const until: unknown = form.get("until") ?? 1;
  const storage = StorageSingleton.getInstance();

  if (!file) {
    return BadRequest();
  } else if (file instanceof File) {
    try {
      const { id, filename } = await storage.storeFile(
        file,
        until as number | undefined,
      );

      console.log(`[CREATE] File ${filename} was created`);
      return Created(`
      Stored file "${filename}". The file will expire ${
        (until as number) > 1 ? `in ${until}` : "an"
      } hour${(until as number) > 1 ? "s" : ""}
The file's id is: ${id}      
      `.trim());
    } catch (error) {
      return InternalServerError({
        message: "Error whilst creating object",
        error: error.message,
      });
    }
  } else {
    return NotAcceptable();
  }
});

export default UICreateObjectRoute;
