import {
  BadRequest,
  Created,
  InternalServerError,
  NotAcceptable,
} from "wren/response.ts";
import { POST } from "wren/route.ts";
import { StorageSingleton } from "../storage.ts";
import { eta } from "../eta.ts";
import { env } from "../env.ts";

const UICreateObjectRoute = POST("/", async (req) => {
  const form = await req.formData();
  const file = form.get("file");
  const until: unknown | number = form.get("until") ?? 1;
  const storage = StorageSingleton.getInstance();
  const host = env["DOMAIN"] ?? "http://localhost:5544"

  if (!file) {
    return BadRequest();
  } else if (file instanceof File) {
    try {
      const { id, filename } = await storage.storeFile(
        file,
        until as number,
      );

      console.log(`[CREATE] File ${filename} was created`);
      const renderedTemplate = eta.render("served", {
        id,
        filename,
        until,
        host
      })
      return Created(renderedTemplate, { "content-type": "text/html"});
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
