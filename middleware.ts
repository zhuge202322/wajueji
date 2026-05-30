import { NextResponse, NextRequest } from 'next/server';

const ADMIN_COOKIE = 'maredigger_admin';

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function verifyAdminToken(token: string | undefined) {
  if (!token) return false;

  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) return false;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(
        process.env.ADMIN_JWT_SECRET || 'maredigger-default-secret-change-me-in-production'
      ),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(signature),
      new TextEncoder().encode(`${header}.${payload}`)
    );
    if (!valid) return false;

    const claims = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
    return typeof claims.exp === 'number' ? claims.exp * 1000 > Date.now() : true;
  } catch {
    return false;
  }
}

function nextWithPathHeader(req: NextRequest, path: string) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', path);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Admin & admin-api: guard auth
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    const isAdminLogin = path === '/admin/login' || path === '/api/admin/login';
    if (!isAdminLogin) {
      const token = req.cookies.get(ADMIN_COOKIE)?.value;
      const authorized = await verifyAdminToken(token);
      if (!authorized) {
        if (path.startsWith('/api/')) {
          return NextResponse.json({ error: '未登录或登录已过期' }, { status: 401 });
        }
        const url = req.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }
    return nextWithPathHeader(req, path);
  }

  return nextWithPathHeader(req, path);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads|.*\\..*).*)'],
};
