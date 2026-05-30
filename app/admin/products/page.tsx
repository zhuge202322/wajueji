import Link from 'next/link';
import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      categories: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">产品列表（{products.length}）</h2>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" /> 新增产品
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">图片</th>
              <th className="px-4 py-3">产品名称</th>
              <th className="px-4 py-3">链接标识</th>
              <th className="px-4 py-3">所属分类</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  {p.images[0] ? (
                    <img src={p.images[0].src} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100" />
                  )}
                </td>
                <td className="px-4 py-3 font-bold text-slate-800">{p.name}</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.slug}</td>
                <td className="px-4 py-3 text-slate-600">
                  {p.categories.map((c) => c.name).join(', ') || '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-brand-primary font-bold hover:underline"
                    >
                      编辑
                    </Link>
                    <ProductDeleteButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">暂无产品。</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
