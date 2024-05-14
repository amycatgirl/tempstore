import {
  BadRequest,
  InternalServerError,
  NotFound,
  OK,
} from "wren/response.ts";
import { GET } from "wren/route.ts";
import { StorageSingleton } from "../storage.ts";

const GetObjectRoute = GET("/objects/:id", async ({ params }) => {
  const storage = StorageSingleton.getInstance();
  const object = storage.getFile(params.id as string);

  if (!params) return BadRequest();
  if (!object) return NotFound();

  console.log(`[GET] Found ${object.filename}, serving...`)

  try {
    const file = await object.openFile();

    if (!file) throw new Error(`Could not open file ${object.filename}`)

    return OK(file, { "Content-type": object.mimeType });
  } catch (error) {
    return InternalServerError({ message: "Error whilst opening file", error: error.message });
  }
});

export default GetObjectRoute;
