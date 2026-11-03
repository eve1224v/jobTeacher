import app from '../server';

export default function handler(req: any, res: any) {
  if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  req.originalUrl = req.url;

  if (req.body !== undefined) {
    req._body = true;
  }

  return app(req, res);
}
