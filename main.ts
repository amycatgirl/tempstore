import { serve } from 'wren/mod.ts';
import CreateObjectRoute from "./routes/create_object.ts"
import GetObjectRoute from "./routes/get_object.ts";
import { StorageSingleton } from "./storage.ts";
import IndexRoute from "./routes/index_route.ts";
import UICreateObjectRoute from "./routes/ui_create_object_route.ts";

const storage = StorageSingleton.getInstance()

const routes = [
	CreateObjectRoute,
	GetObjectRoute,
	IndexRoute,
	UICreateObjectRoute
];

await storage.removeLeftovers()

setInterval(() => {
	storage.manager.purgeExpired()
}, 1000)

serve(routes);

// Run on different port
// serve(routes, { port: 3000 });
