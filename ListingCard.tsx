"use client";

import { useState } from 'react';
import { ListingInput } from '@/lib/validators';

interface ListingCardProps {
  listing: any; // listing record from Supabase
  category?: string;
}

/**
 * Card component to display a single listing or product.
 * Shows title, price before/after VAT, category name and basic details.
 */
export default function ListingCard({ listing, category }: ListingCardProps) {
  const priceExVat = listing.price_ex_vat ?? 0;
  const vatRate = listing.vat_rate ?? 0.17;
  const priceIncVat = Math.round(priceExVat * (1 + vatRate));
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 flex flex-col space-y-2">
      <h3 className="text-lg font-semibold text-primary">{listing.title}</h3>
      {category && (
        <span className="text-xs text-gray-400">{category}</span>
      )}
      <p className="text-sm text-gray-300 line-clamp-3">
        {listing.description || 'אין תיאור'}
      </p>
      <div className="flex justify-between text-sm mt-auto">
          <span className="text-gray-300">
            ₪{priceExVat.toLocaleString()} (לפני מע"מ)
          </span>
          <span className="text-gray-100 font-bold">
            ₪{priceIncVat.toLocaleString()} (כולל מע"מ)
          </span>
      </div>
      <button
        onClick={() => setShowContact((prev) => !prev)}
        className="mt-2 px-3 py-1 rounded bg-primary text-white text-sm hover:bg-blue-600"
      >
        {showContact ? 'סגור' : 'צור קשר'}
      </button>
      {showContact && (
        <div className="mt-2 text-sm text-gray-200 space-y-1 border-t border-gray-600 pt-2">
          <div>
            <strong>שם:</strong> {listing.contact_name || 'לא ידוע'}
          </div>
          <div>
            <strong>טלפון:</strong> {listing.contact_phone || 'לא ידוע'}
          </div>
          {listing.contact_email && (
            <div>
              <strong>דוא"ל:</strong> {listing.contact_email}
            </div>
          )}
        </div>
      )}
    </div>
  );
}