import { BadRequest, Created, NotAcceptable } from "wren/response.ts";
import { POST } from "wren/route.ts";
import { StorageSingleton } from "../storage.ts";

const CreateObjectRoute = POST("/create", async (req) => {
  const form = await req.formData();
  const file = form.get("file");
  const until: unknown = form.get("until");
  const storage = StorageSingleton.getInstance();

  if (!file) {
    return BadRequest();
  } else if (file instanceof File) {
    const { id, filename, stored_until } = await storage.storeFile(file, (until as number | undefined) ?? 1);

    console.log(`[CREATE] File ${filename} was created`)
    return Created({
      id,
      filename,
      message: `Saved ${filename} until ${new Date(stored_until)}`,
    });
  } else {
    return NotAcceptable();
  }
});

export default CreateObjectRoute;
