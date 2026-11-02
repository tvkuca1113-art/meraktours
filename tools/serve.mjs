/* =========================================================================
   Local preview of the built site.

     npm start            → http://localhost:3000
     npm start -- 8080    → a different port

   Serves dist/ exactly the way the host will: clean URLs, real 404 page.
   ========================================================================= */
import { serve } from './lib.mjs';

const args=process.argv.slice(2);
const portIndex=args.indexOf('--port');
const port = Number(portIndex>=0?args[portIndex+1]:args.find(v=>/^\d+$/.test(v))||process.env.PORT||3000);
await serve(port);

console.log(`
  Merak Tours — local preview

    http://localhost:${port}/

  Rebuild in another window with  npm run build  and refresh.
  Ctrl+C to stop.
`);
