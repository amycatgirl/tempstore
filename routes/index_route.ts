import { GET } from "wren/route.ts";
import { uploaderTemplate } from "../templates/index.ts";
import { OK } from "wren/response.ts";
const IndexRoute = GET("/", () => {
	return OK(uploaderTemplate, { "Content-type": "text/html"})
})

export default IndexRoute