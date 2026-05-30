import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: '请填写用户名和密码' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });

    await createSession({ id: user.id, username: user.username });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      {
        error:
          '后台登录服务暂不可用，请检查 Vercel 环境变量并重新部署。'
      },
      { status: 500 }
    );
  }
}
