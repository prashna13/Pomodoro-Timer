# Flocus — Minimalist 1.5h Deep Work & Health Companion

> A cozy, aesthetic Pomodoro & daily wellness web application custom-tailored for 1.5-hour (90-minute) deep focus blocks, 40-minute micro-break health prompts, analytics insights, and task management.

---

## ✨ Key Features

### ⏱️ Pomodoro Focus Timer
* **1.5 Hours Deep Work Preset**: Optimized for deep focus blocks (90 min), along with 50m, 25m classic, 15m short break, and 30m long break.
* **Aesthetic Terracotta Ring**: Circular progress bar with live countdown display and current mode indicator.
* **Task Linking**: Directly assign any task as your active focusing item.
* **Cozy Ambient Audio**: Synthesized Web Audio engine with **Gentle Rain 🌧️**, **Ocean Waves 🌊**, **432Hz Focus Drone 🎧**, and **Brown Noise 📻** with volume controls.

### 🧘 40-Minute Health Micro-Breaks
* **Health Prompt Alarm**: Every 40 minutes of active work, triggers a notification and pop-up overlay.
* **Stretch Checklist**: Quick 10-second stretch recommendations for neck, shoulders, and torso.
* **Hydration Tracker**: Interactive `+1 Glass` logger with daily water progress tracking (e.g. 4/8 glasses).
* **20-20-20 Eye Rest Timer**: Interactive 20-second countdown guiding you to look 20+ feet away.

### 📊 Analytics Dashboard & Daily Focus Goals
* **Daily Target Focus Hours**: Set your personal target (e.g. `4.5 Hours` / 3 blocks of 1.5h).
* **Daily Target Progress & Streaks (🔥)**: Tracks consecutive days hitting your target focus hours.
* **Visual Bar Charts**: SVG charts displaying focus trends over the past 7 or 14 days.

### 📅 Interactive History Calendar
* **Monthly Heatmap Grid**: Color-coded calendar cells showing daily focus intensity.
* **Target Achievement Stars (⭐)**: Highlights days where daily target goals were met.
* **Day Inspector**: Click any past date on the calendar to inspect focus hours, completed blocks, water intake, and health breaks.

### 📋 Todo & Reminders Manager
* **Block Estimation**: Estimate how many 1.5h blocks tasks will take and track progress (*🍅 1/2*).
* **Category & Priority Pills**: Filter by All, Due Today, Work, Personal, and Completed.
* **Celebratory Confetti**: Satisfying sound feedback and confetti animations upon task completion.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Audio**: Native Web Audio API Synthesizer (Zero external `.mp3` dependencies)
* **Effects**: Canvas Confetti
* **Deployment**: [Vercel](https://vercel.com/) ready with pre-configured `vercel.json`

---

## 🚀 Quick Start (Local Development)

1. **Clone or navigate to project**:
   ```bash
   cd pomodoro-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

Deploy directly from terminal using Vercel CLI:

```bash
npx vercel --prod
```

Or push to GitHub and connect your repository on [vercel.com/new](https://vercel.com/new).

---

## 📄 License
MIT License. Built for daily deep work and wellness balance.
