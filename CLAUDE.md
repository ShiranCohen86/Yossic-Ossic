# yossic-ossic — אפליקציית שיעורים פרטיים

## תיאור הפרויקט
פלטפורמה למורה פרטי יחיד למתמטיקה ופיזיקה לכיתות ז'–י"ב.
Web-first PWA עם שני תפקידים: **מורה** (admin) ו**תלמיד**.

## Stack
- **Backend**: Node.js 20 + Express + MongoDB (Mongoose) + JWT
- **Frontend**: Next.js 14 (App Router, static export) + Tailwind CSS + Redux Toolkit
- **קבצים**: Cloudinary (PDF, תמונות)
- **Deployment**: Render (free tier)

## הרצה מקומית

```bash
# Backend
cd backend && cp .env.example .env   # מלא ערכים
npm install && npm run dev           # PORT=5001

# Frontend
cd frontend && cp .env.local.example .env.local
npm install && npm run dev           # PORT=3000

# Seed (יצירת חשבון מורה ראשוני)
npm run seed --prefix backend
```

## כללי עבודה

### תפקידים
- `teacher` — מנהל slots, מאשר שיעורים, מעלה חומרים, יוצר תלמידים
- `student` — מזמין שיעורים, צופה בחומרים

### Business rules
- חשבון מורה **אחד בלבד**, נוצר דרך seed. אין רישום ציבורי למורה.
- תלמידים נוצרים על ידי המורה בלבד.
- AvailabilitySlots הם תבניות חוזרות שבועיות. שיעורים בודדים נשמרים ב-Lesson.
- מחיקת קובץ חומר מוחקת גם מ-Cloudinary (publicId).

### Approval Mode
כל שינוי משמעותי בלוגיקת עסקים יוצג לאישור לפני ביצוע.
