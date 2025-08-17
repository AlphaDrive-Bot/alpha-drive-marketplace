# Alpha Drive Marketplace

מרקטפלייס ל‑Alpha Drive שמיועד למורי נהיגה בישראל. הפרויקט נבנה עם Next.js 14 (App Router), TypeScript, Tailwind CSS ו‑Supabase עבור ניהול בסיס הנתונים והלידים. האתר מותאם לתצוגת רייט‑טו‑לפט (RTL) בעברית ומוכן להרחבה לסליקה בעתיד.

## הרצה מקומית

1. התקנת חבילות:

   ```bash
   npm install
   ```

2. יצירת קובץ סביבות `.env.local` והגדרת משתני סביבה:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
   SUPABASE_SERVICE_ROLE=service-role-key
   N8N_LEAD_WEBHOOK_URL=https://n8n.example/hooks/alpha-marketplace
   ```

3. הרצת הפרויקט:

   ```bash
   npm run dev
   ```

4. הרצת מיגרציות (אופציונלי):

   הפרויקט כולל תיקיית `migrations` עם קובצי SQL להגדרת בסיס הנתונים. אם ברשותך Supabase או PostgreSQL מקומי, ניתן להריץ את המיגרציות כך:

   ```bash
   # לדוגמה עם ה־Supabase CLI
   supabase db reset --file migrations/001_init.sql
   ```

   או באמצעות `psql`:

   ```bash
   psql $DATABASE_URL -f migrations/001_init.sql
   ```

   ודא כי הרחבת `uuid-ossp` מופעלת במסד הנתונים.

4. פתיחת הדפדפן בכתובת `http://localhost:3000`.

## מבנה פרויקט

```
alpha-drive-marketplace/
├── app/                 # תיקיית הדפים ורכיבי ה-App Router
│   ├── page.tsx         # דף הבית
│   ├── layout.tsx       # פריסה בסיסית כולל RTL ו‑Theme
│   ├── listings/        # דפים הקשורים למודעות
│   │   └── page.tsx     # קטלוג המודעות
│   ├── sell/            # דף פרסום מודעה
│   │   └── page.tsx
│   ├── admin/           # ממשק ניהול בסיסי
│   │   └── page.tsx
│   └── api/             # API routes לסופאבייס ול-Webhooks
│       ├── listings/route.ts
│       ├── categories/route.ts
│       └── leads/route.ts
├── components/          # רכיבי React משותפים
│   ├── Navbar.tsx
│   ├── ListingCard.tsx
│   └── CategoryFilter.tsx
├── lib/                 # קבצים סדורים כגון Supabase ו‑Zod
│   ├── supabase.ts
│   └── validators.ts
├── tailwind.config.js   # הגדרות Tailwind עם צבעי מותג
├── postcss.config.js
├── next.config.js
├── tsconfig.json
├── vercel.json          # קובץ פריסה ל‑Vercel
└── README.md
```

## תיעוד API

הפרויקט כולל מספר מסלולי API (לבנתיים ללא אימות):

- **GET /api/categories** – החזרת כל הקטגוריות.
- **POST /api/categories** – יצירת קטגוריה חדשה; נדרש אובייקט עם שדה `name` ו־`description` (אופציונלי).
- **GET /api/listings** – החזרת כל המודעות.
- **POST /api/listings** – יצירת מודעה חדשה; נדרש אובייקט עם שדות `title`, `description`, `price_ex_vat`, `category_id` ופרטים אופציונליים לרכב.
- **POST /api/leads** – יצירת ליד חדש; נדרש אובייקט עם שדות `listing_id`, `buyer_name`, `buyer_phone`, `buyer_email` ו־`message`.

## הרחבות עתידיות

לשלב הבא ניתן להוסיף אימות משתמשים עם Supabase Auth, סליקה מאובטחת (V2), ניהול הרשאות מתקדם, ופאנל ניהול מרובה משתמשים.