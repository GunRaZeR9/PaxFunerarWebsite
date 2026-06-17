import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

// Resolve the real server.mjs path relative to this wrapper's own location,
// so it works regardless of what working directory Passenger launches from.
const here = dirname(fileURLToPath(import.meta.url));
const serverPath = join(here, 'dist', 'pax-funerar', 'server', 'server.mjs');

// Angular's generated server.mjs only calls app.listen() when its own
// isMainModule() check passes — it compares process.argv[1] against its
// own import.meta.url. Passenger imports this file as a module rather than
// invoking it as the entry script, so that check fails on its own. Setting
// argv[1] here first makes the comparison succeed before we import it.
process.argv[1] = serverPath;

await import(pathToFileURL(serverPath).href);