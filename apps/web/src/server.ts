import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const apiProxyTarget = process.env['API_PROXY_TARGET'] ?? 'http://localhost:5252';
const accessCode = process.env['ACCESS_CODE'] ?? '';

app.post('/validate-access-code', express.json(), (req, res) => {
  const providedCode = typeof req.body?.code === 'string' ? req.body.code : '';
  const valid = accessCode.length > 0 && providedCode === accessCode;

  if (!valid) {
    res.status(401).json({
      valid: false,
      message: 'Invalid code. Please try again.',
    });
    return;
  }

  res.status(200).json({ valid: true });
});

/**
 * Proxy API calls to the backend service.
 */
app.use('/api', express.json(), async (req, res, next) => {
  try {
    const targetUrl = new URL(req.originalUrl, apiProxyTarget);
    console.log(`Proxying request to ${targetUrl.href}`);

    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'content-type': req.headers['content-type'] ?? 'application/json',
        accept: req.headers['accept'] ?? 'application/json',
      },
      body:
        req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body ?? {}),
    });

    const responseBody = await upstreamResponse.text();
    res.status(upstreamResponse.status);
    res.setHeader(
      'content-type',
      upstreamResponse.headers.get('content-type') ?? 'application/json',
    );
    res.send(responseBody);
  } catch (error) {
    next(error);
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
