import { serve } from 'wren/mod.ts';
import CreateObjectRoute from "./routes/create_object.ts"
import GetObjectRoute from "./routes/get_object.ts";
import { StorageSingleton } from "./storage.ts";

const storage = StorageSingleton.getInstance()

const routes = [
	CreateObjectRoute,
	GetObjectRoute
];

await storage.removeLeftovers()

setInterval(() => {
	storage.manager.purgeExpired()
}, 1000)

serve(routes);

// Run on different port
// serve(routes, { port: 3000 });
