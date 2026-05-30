import { headers } from 'next/headers';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Maredigger CMS 后台管理',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const path = h.get('x-pathname') || '';
  const isLogin = path === '/admin/login';

  return (
    <section className="min-h-screen bg-slate-50 text-slate-800">
      {isLogin ? children : <AdminShell>{children}</AdminShell>}
    </section>
  );
}
