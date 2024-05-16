import { GET } from "wren/route.ts";
import { OK } from "wren/response.ts";
import { eta } from "../eta.ts";
const IndexRoute = GET("/", () => {
	const renderedTemplate = eta.render("index")
	return OK(renderedTemplate, { "Content-type": "text/html"})
})

export default IndexRoute