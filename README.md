# Kucchu Puchu — Freelancer Portfolio Website (React + Tailwind)

Ye ek complete multi-page React website hai jo aapki SEO report ke structure ke hisaab se banayi gayi hai:
Home, About, Services, Portfolio, Videos, Blog, Blog Detail, Pricing, Contact — sab pages ready hain,
fully responsive (mobile/tablet/desktop) aur dark theme design ke saath.

## VS Code me chalane ka poora step-by-step guide

### Step 1 — Zaroori software install karein (agar pehle se nahi hai)
1. **Node.js** install karein: https://nodejs.org (LTS version lein). Node ke saath npm apne aap aa jata hai.
2. **VS Code** install karein: https://code.visualstudio.com

Check karne ke liye terminal (VS Code ke andar `Terminal > New Terminal`) me type karein:
```
node -v
npm -v
```
Dono ka version number dikhna chahiye.

### Step 2 — Project folder ko VS Code me kholna
1. Downloaded zip file ko kisi folder me extract karein (e.g. Desktop par).
2. VS Code kholein → `File > Open Folder` → `kucchu-puchu-portfolio` folder select karein.

### Step 3 — Dependencies install karna
VS Code ke Terminal me (Terminal > New Terminal) ye command chalayein:
```
npm install
```
Isse `node_modules` folder ban jayega — sab libraries (React, Tailwind, Router, Framer Motion, Lucide icons) download ho jayengi. Isme 1-2 minute lag sakta hai internet speed ke hisaab se.

### Step 4 — Website ko local server par chalana
```
npm run dev
```
Terminal me ek local link dikhega, jaise:
```
Local:   http://localhost:5173/
```
Ctrl+Click karke ya browser me manually ye link kholein — aapki website live dikh jayegi.
Jab bhi aap koi file save karenge, browser automatically update ho jayega (hot reload).

### Step 5 — Apni images lagana
Abhi is project me placeholder images (picsum/unsplash) lagi hain. Apni khud ki images lagane ke liye:
1. Apni image files `src/assets/` folder me daalein (naya folder bana lein agar nahi hai).
2. Kisi bhi page file (jaise `src/pages/Home.jsx`) me upar import karein:
   ```js
   import myPhoto from '../assets/my-photo.jpg'
   ```
3. Jahan `src="https://..."` likha hai, wahan `src={myPhoto}` kar dein.

### Step 6 — Content/text change karna
Har page apni alag file me hai (`src/pages/` folder ke andar). Jo bhi text change karna hai,
seedha us file me jaake edit kar dein — jaise naam "Govind" ki jagah apna naam, phone number,
email, services ke naam, pricing amounts, etc.

### Step 7 — Production build banana (jab website ready ho jaye hosting ke liye)
```
npm run build
```
Isse `dist` folder banega jisme final optimized website hogi — ise aap kisi bhi hosting
(Netlify, Vercel, Hostinger, GitHub Pages) par upload kar sakte hain.

Build ko locally check karne ke liye:
```
npm run preview
```

## Project Structure (file kaam)

```
kucchu-puchu-portfolio/
├── index.html                  → Main HTML entry (title, fonts)
├── package.json                → Dependencies list & run commands
├── vite.config.js              → Vite build tool config
├── tailwind.config.js          → Colors, fonts, theme settings
├── postcss.config.js           → Tailwind ke liye zaroori
├── src/
│   ├── main.jsx                → React app start hota hai yahan se
│   ├── App.jsx                 → Saare routes/pages yahan connect hote hain
│   ├── index.css               → Global styles, Tailwind import
│   ├── components/
│   │   ├── Navbar.jsx          → Top navigation (mobile menu bhi isi me)
│   │   └── Footer.jsx          → Bottom footer
│   └── pages/
│       ├── Home.jsx            → Home page (hero, stats, services preview)
│       ├── About.jsx           → About Me page
│       ├── Services.jsx        → Services listing page
│       ├── Portfolio.jsx       → Portfolio grid with filters
│       ├── Videos.jsx          → Videos page with tabs
│       ├── Blog.jsx            → Blog listing (blog post data bhi yahin hai)
│       ├── BlogDetail.jsx      → Single blog post page (dynamic route)
│       ├── Pricing.jsx         → Pricing packages page
│       └── Contact.jsx         → Contact form + info page
```

## SEO next steps (aapki report ke hisaab se)
- Har page me `index.html` ke `<title>` aur meta description ko unique banayein (report section 11-12).
- Deploy karne ke baad `sitemap.xml` aur `robots.txt` root me add karein (report section 14-15).
- Google Search Console aur Google Analytics (GA4) setup karein deploy karne ke baad (section 17-18).

## Common issues
- **`npm install` me error** → Node.js version LTS wali install karein (v18 ya v20+).
- **Port already in use** → `vite.config.js` me port number change kar dein.
- **Images nahi dikh rahi** → internet connection check karein (placeholder images web se load hoti hain), ya apni khud ki images lagayein (Step 5 dekhein).
