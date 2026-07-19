import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'vercel-serverless-dev',
        configureServer(server) {
          server.middlewares.use(async (req: any, res: any, next) => {
            if (req.url && req.url.startsWith('/api/')) {
              const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
              const pathname = urlObj.pathname; // e.g. /api/crop-advisor
              const functionName = pathname.substring(5); // crop-advisor
              const apiFilePath = path.resolve(process.cwd(), `api/${functionName}.ts`);

              if (fs.existsSync(apiFilePath)) {
                try {
                  // 1. Parse POST bodies
                  if (req.method === 'POST' && !req.body) {
                    const buffers: Buffer[] = [];
                    for await (const chunk of req) {
                      buffers.push(chunk);
                    }
                    const rawBody = Buffer.concat(buffers).toString();
                    try {
                      req.body = JSON.parse(rawBody);
                    } catch {
                      req.body = rawBody;
                    }
                  }

                  // 2. Add req.query helper
                  const query: Record<string, string> = {};
                  urlObj.searchParams.forEach((value, key) => {
                    query[key] = value;
                  });
                  req.query = query;

                  // 3. Add res.status, res.json, res.send helpers
                  res.status = (statusCode: number) => {
                    res.statusCode = statusCode;
                    return res;
                  };
                  res.json = (data: any) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return res;
                  };
                  res.send = (data: any) => {
                    if (typeof data === 'object') {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    } else {
                      res.setHeader('Content-Type', 'text/html; charset=utf-8');
                      res.end(data);
                    }
                    return res;
                  };

                  // 4. Load the Vercel serverless function module dynamically via Vite's SSR
                  const module = await server.ssrLoadModule(`/api/${functionName}.ts`);
                  if (module && typeof module.default === 'function') {
                    await module.default(req, res);
                  } else {
                    res.status(500).json({ error: `No default export found in api/${functionName}.ts` });
                  }
                } catch (err: any) {
                  console.error(`Error executing api/${functionName}.ts:`, err);
                  res.status(500).json({ error: err.message || 'Internal Server Error' });
                }
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
