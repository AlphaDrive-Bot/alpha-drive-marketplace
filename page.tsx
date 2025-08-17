import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listingSchema, type ListingInput } from '@/lib/validators';
import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

/**
 * Fetch categories server-side for use in the sell form.
 */
export default async function SellPage() {
  const { data: categories, error } = await supabase.from('categories').select('id, name');
  if (error) {
    console.error(error);
  }
  return <SellForm categories={categories || []} />;
}

function SellForm({ categories }: { categories: { id: string; name: string }[] }) {
  'use client';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price_ex_vat: 0,
      vat_rate: 0.17,
      category_id: '',
    },
  });
  const watchCategory = form.watch('category_id');
  const selectedCategoryName = categories.find((c) => c.id === watchCategory)?.name;
  const isVehicle = selectedCategoryName === 'רכב לימוד';

  async function onSubmit(data: ListingInput) {
    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        setSuccess('מודעה פורסמה בהצלחה!');
        // redirect to listings after a short delay
        setTimeout(() => router.push('/listings'), 2000);
      } else {
        const err = await res.json();
        alert(err.message || 'שגיאה בפרסום המודעה');
      }
    } catch (err) {
      console.error(err);
      alert('שגיאה בלתי צפויה');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-4">פרסם מודעה חדשה</h2>
      {success && <p className="text-green-400 mb-4">{success}</p>}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Honeypot field to trap bots */}
        <input
          type="text"
          name="hp_field"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />
        <div>
          <label className="block text-sm font-medium text-gray-300">כותרת</label>
          <input
            {...form.register('title')}
            type="text"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
            placeholder="לדוגמה: מראות למורה נהיגה"
          />
          {form.formState.errors.title && (
            <span className="text-red-500 text-sm">{form.formState.errors.title.message}</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">קטגוריה</label>
          <select
            {...form.register('category_id')}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
          >
            <option value="">בחר קטגוריה</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {form.formState.errors.category_id && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.category_id.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">מחיר (לפני מע"מ)</label>
          <input
            {...form.register('price_ex_vat', { valueAsNumber: true })}
            type="number"
            min="0"
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
          />
          {form.formState.errors.price_ex_vat && (
            <span className="text-red-500 text-sm">
              {form.formState.errors.price_ex_vat.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">תיאור</label>
          <textarea
            {...form.register('description')}
            rows={4}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
            placeholder="פרטים נוספים על המוצר או הרכב"
          />
        </div>
        {/* Vehicle-specific fields */}
        {isVehicle && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">שנת יצור</label>
              <input
                {...form.register('vehicle_year', { valueAsNumber: true })}
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">ק״מ</label>
              <input
                {...form.register('mileage_km', { valueAsNumber: true })}
                type="number"
                min="0"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">תיבת הילוכים</label>
              <select
                {...form.register('transmission')}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
              >
                <option value="">בחר</option>
                <option value="אוטומטית">אוטומטית</option>
                <option value="ידנית">ידנית</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input type="checkbox" {...form.register('dual_control')} id="dual_control" className="h-4 w-4 text-primary border-gray-600 rounded" />
              <label htmlFor="dual_control" className="text-sm text-gray-300">
                דו‑שליטה ואמצעי בטיחות
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">מצלמות</label>
              <input
                {...form.register('cameras')}
                type="text"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-md p-2 focus:border-primary focus:ring-primary"
                placeholder="סוג המצלמות, אם יש"
              />
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? 'שולח…' : 'פרסם מודעה'}
        </button>
      </form>
    </div>
  );
}