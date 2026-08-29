# 🎂 Birthday Countdown Timer

A modern, responsive, glassmorphism-themed birthday countdown application built with **React**, **TypeScript**, and **Tailwind CSS**.

Live countdown targeting **September 2, 2026 at 00:00:00 (Midnight)** with real-time ticking cards, customizable name support, celebration confetti, and a standalone single-file HTML version.

---

## ✨ Features

- **Live Ticking Cards**: Real-time second-by-second countdown for Days, Hours, Minutes, and Seconds.
- **Custom Name Support**: Personalize the birthday person's name dynamically with proper English possessive formatting (e.g. *James' Birthday*, *Sarah's Birthday*).
- **Celebration Mode**: Automatically triggers celebratory confetti, animated gradient greetings, and festive messages once the countdown reaches zero.
- **Demo Mode**: Built-in "Simulate Zero" toggle to preview celebration animations anytime.
- **Standalone HTML Export**: Easily copy or download a 100% self-contained single-file HTML version to share or host anywhere without a build step.
- **Dark Glassmorphism Theme**: Atmospheric ambient glowing orbs, frosted glass panels, and crisp typography.

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open `http://localhost:3000` (or the port specified in terminal) in your browser.

### 4. Build for Production
```bash
npm run build
```
Production assets will be built into the `dist/` directory.

---

## 🌐 GitHub Pages Deployment

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated deployment to GitHub Pages.

### How to enable GitHub Pages:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit - Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. On GitHub, navigate to:
   **Settings** ➔ **Pages** (under Code and automation).

3. Under **Build and deployment** ➔ **Source**:
   Select **GitHub Actions**.

4. Every push to the `main` or `master` branch will automatically build and publish your site!

---

## ⚙️ Customization

### Changing the Target Date
Edit `TARGET_DATE` in `src/App.tsx` (and `public/birthday-countdown.html` for the standalone version):

```typescript
// Target date: Year, Month (0-indexed: 8 = Sept), Day, Hour, Minute, Second
const TARGET_DATE = new Date(2026, 8, 2, 0, 0, 0);
```

---

## 📄 License

Apache-2.0
