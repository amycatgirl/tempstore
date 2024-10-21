import { Eta } from "eta";
import { resolve } from "path";

const eta = new Eta({
  views: resolve("./templates"),
  cache: true,
  useWith: true,
});

export { eta };

