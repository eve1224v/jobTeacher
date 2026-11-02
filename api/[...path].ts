import app from '../server';

export default function handler(req: any, res: any) {
  // Normalize URL for Express in Vercel Serverless environment
  if (req.query?.path) {
    const subpath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    req.url = `/api/${subpath}`;
  } else if (!req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return app(req, res);
}
