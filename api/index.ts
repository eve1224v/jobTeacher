import app from '../server.js';

export default function handler(req: any, res: any) {
  try {
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }
    req.originalUrl = req.url;

    if (req.body !== undefined) {
      req._body = true;
    }

    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Function Error]', err?.message || err);
    if (!res.headersSent) {
      return res.status(500).json({
        error: `[Vercel Serverless Error] ${err?.message || '서버리스 함수 실행 중 오류가 발생했습니다.'}`,
        status: 500,
      });
    }
  }
}
