# Quick Start Guide

Get Axentralab running locally in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

## Installation

1. **Extract the project** (if you received a zip file):
```bash
unzip axentralab-saas.zip
cd axentralab-saas
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run development server**:
```bash
npm run dev
```

4. **Open in browser**:
```
http://localhost:3000
```

That's it! You should see the landing page.

## Available Pages

Once running, you can visit:

### Public Pages
- `/` - Landing page
- `/pricing` - Pricing plans
- `/features` - Feature details
- `/about` - About the company
- `/contact` - Contact form

### Auth Pages
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset

### Dashboard (UI Only - No Auth Yet)
- `/dashboard` - Dashboard overview
- `/dashboard/websites` - (To be implemented)
- `/dashboard/reports` - (To be implemented)
- `/dashboard/billing` - (To be implemented)
- `/dashboard/settings` - (To be implemented)

## Project Structure

```
axentralab-saas/
├── app/              # Next.js pages
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── dashboard/   # Dashboard-specific components
├── public/          # Static files
└── package.json     # Dependencies
```

## What's Included

✅ **Full Frontend** - All pages designed and built
✅ **Responsive Design** - Mobile-friendly
✅ **TypeScript** - Type-safe code
✅ **Tailwind CSS** - Modern styling
✅ **Component Library** - Reusable UI components
✅ **Dashboard UI** - Complete admin interface

## What's NOT Included (Next Steps)

⏳ **Backend API** - Needs to be built (NestJS or Laravel)
⏳ **Database** - PostgreSQL setup required
⏳ **Authentication** - JWT implementation needed
⏳ **Payment Integration** - Stripe setup required
⏳ **Email Service** - Resend or SMTP needed
⏳ **Monitoring Logic** - Website checking functionality
⏳ **Backup System** - Automated backup implementation

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Customization

### Change Colors

Edit `app/globals.css` and modify the CSS variables:

```css
:root {
  --primary: 222 84% 55%;  /* Main brand color */
  --accent: 217 91% 60%;   /* Accent color */
  /* ... */
}
```

### Change Fonts

Edit `app/globals.css` and update the Google Fonts import:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

### Update Content

- **Company Info**: Edit `components/Footer.tsx`
- **Pricing Plans**: Edit `app/pricing/page.tsx`
- **Features**: Edit `app/features/page.tsx`

## Next Steps

1. **Backend Development**
   - Choose NestJS or Laravel
   - Set up PostgreSQL
   - Implement authentication
   - Create API endpoints

2. **Payment Integration**
   - Set up Stripe account
   - Create products/prices
   - Implement checkout
   - Handle webhooks

3. **Core Features**
   - Website monitoring
   - Backup system
   - Security scanning
   - Email notifications

4. **Deployment**
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render
   - Set up database
   - Configure environment variables

See `DEPLOYMENT.md` for detailed deployment instructions.

## Need Help?

- Read the full `README.md` for detailed information
- Check `DEPLOYMENT.md` for deployment guide
- Review the code comments for implementation details

## File Overview

### Key Files to Understand

1. **`app/page.tsx`** - Landing page with all sections
2. **`app/layout.tsx`** - Root layout and metadata
3. **`components/Header.tsx`** - Navigation component
4. **`components/Footer.tsx`** - Footer component
5. **`components/ui/Button.tsx`** - Button component
6. **`app/dashboard/page.tsx`** - Dashboard overview

### Configuration Files

- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`tailwind.config.js`** - Tailwind CSS settings
- **`next.config.js`** - Next.js configuration

## Tips

1. **Start with the landing page** - It demonstrates all components
2. **Study the component library** - Reuse components for consistency
3. **Follow the design system** - Colors, spacing, typography
4. **Keep it simple** - Don't over-engineer
5. **Focus on conversion** - Clear CTAs, trust signals

## Common Issues

### Port 3000 already in use?
```bash
# Use different port
npm run dev -- -p 3001
```

### Module not found errors?
```bash
# Clean install
rm -rf node_modules
npm install
```

### Build errors?
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear Next.js cache
rm -rf .next
npm run build
```

## Performance Tips

- Images are already optimized (Next.js Image component ready)
- Lazy loading is enabled by default
- Code splitting happens automatically
- Tailwind CSS is purged in production

## Security Notes

- No hardcoded secrets (use environment variables)
- CORS will need configuration
- Rate limiting needed for API
- Input validation required
- XSS protection via React
- CSRF tokens needed for forms

---

Ready to build your SaaS? Let's go! 🚀
