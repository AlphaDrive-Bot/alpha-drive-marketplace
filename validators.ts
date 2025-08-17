import { z } from 'zod';

/**
 * Schema for creating a new category.
 */
export const categorySchema = z.object({
  name: z.string().min(1, { message: 'יש להזין שם קטגוריה' }),
  description: z.string().optional(),
});

/**
 * Schema for creating a new listing (product or vehicle).
 */
export const listingSchema = z.object({
  title: z.string().min(1, { message: 'יש להזין כותרת' }),
  description: z.string().optional(),
  price_ex_vat: z
    .number({ invalid_type_error: 'יש להזין מחיר' })
    .nonnegative({ message: 'המחיר חייב להיות מספר חיובי' }),
  vat_rate: z.number().default(0.17),
  category_id: z.string().uuid({ message: 'קטגוריה לא תקינה' }),
  // שדות נוספים לרכב
  vehicle_year: z.number().int().positive().optional(),
  mileage_km: z.number().int().nonnegative().optional(),
  transmission: z.enum(['אוטומטית', 'ידנית']).optional(),
  dual_control: z.boolean().optional(),
  cameras: z.string().optional(),
});

/**
 * Schema for creating a new lead (contact request).
 */
export const leadSchema = z.object({
  listing_id: z.string().uuid({ message: 'מזהה מודעה לא תקין' }),
  buyer_name: z.string().min(1, { message: 'יש להזין שם מלא' }),
  buyer_phone: z.string().min(6, { message: 'יש להזין טלפון' }),
  buyer_email: z.string().email().optional(),
  message: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type LeadInput = z.infer<typeof leadSchema>;