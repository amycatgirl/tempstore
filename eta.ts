import { Eta } from "eta/src/index.ts";
import { resolve } from "path/mod.ts";

const eta = new Eta({
	views: resolve("./templates"),
	cache: true,
	useWith: true,	
})

export { eta }