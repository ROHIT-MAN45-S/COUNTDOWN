/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Gift, 
  PartyPopper, 
  RotateCcw, 
  Play, 
  Check, 
  Copy, 
  Code2, 
  ExternalLink,
  Volume2,
  Heart
} from 'lucide-react';

// Target date: September 2, 2026 at 00:00:00 (Midnight)
const TARGET_DATE = new Date(2026, 8, 2, 0, 0, 0); // Month 8 is September (0-indexed)

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isZero: boolean;
}

export default function App() {
  // 1. State Management
  const [nameInput, setNameInput] = useState<string>('');
  const [savedName, setSavedName] = useState<string>('YOUR');
  const [isTestZeroMode, setIsTestZeroMode] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  
  // Confetti interval reference
  const confettiIntervalRef = useRef<number | null>(null);

  // Compute time left until Target Date
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const target = TARGET_DATE.getTime();
    const difference = target - now;

    if (difference <= 0 || isTestZeroMode) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMs: 0,
        isZero: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: difference,
      isZero: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestZeroMode]);

  // Handle document title updates and dynamic name formatting
  const formattedHeaderTitle = useMemo(() => {
    const trimmed = savedName.trim().toUpperCase();
    if (!trimmed || trimmed === 'YOUR') {
      return 'COUNTDOWN TO YOUR BIRTHDAY';
    }
    // Handle possessive properly (e.g. JAMES' vs SARAH'S)
    const possessive = trimmed.endsWith('S') ? `${trimmed}'` : `${trimmed}'S`;
    return `COUNTDOWN TO ${possessive} BIRTHDAY`;
  }, [savedName]);

  const celebrationMessage = useMemo(() => {
    const trimmed = savedName.trim().toUpperCase();
    if (!trimmed || trimmed === 'YOUR') {
      return '🎉 HAPPY BIRTHDAY! 🎉';
    }
    return `🎉 HAPPY BIRTHDAY, ${trimmed}! 🎉`;
  }, [savedName]);

  // Update document title dynamically
  useEffect(() => {
    if (timeLeft.isZero) {
      document.title = celebrationMessage;
    } else {
      const trimmed = savedName.trim();
      if (!trimmed || trimmed.toUpperCase() === 'YOUR') {
        document.title = 'Countdown to Your Birthday';
      } else {
        const possessive = trimmed.endsWith('s') || trimmed.endsWith('S') ? `${trimmed}'` : `${trimmed}'s`;
        document.title = `Countdown to ${possessive} Birthday`;
      }
    }
  }, [savedName, timeLeft.isZero, celebrationMessage]);

  // Confetti launcher for celebration mode
  useEffect(() => {
    if (timeLeft.isZero) {
      // Immediate blast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Continuous celebration bursts
      const interval = window.setInterval(() => {
        // Left cannon
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e']
        });
        // Right cannon
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e']
        });
      }, 2000);

      confettiIntervalRef.current = interval;

      return () => {
        clearInterval(interval);
      };
    } else {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
      }
    }
  }, [timeLeft.isZero]);

  // Handle Set Name button click
  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim();
    if (cleanName) {
      setSavedName(cleanName);
    } else {
      setSavedName('YOUR');
    }
  };

  // Standalone Single-File HTML Generation
  const generateStandaloneHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Birthday Countdown Timer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #030712;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      position: relative;
      padding: 24px 16px;
    }
    /* Ambient background glows */
    .glow-sphere {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }
    .glow-1 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, #8b5cf6 0%, rgba(139, 92, 246, 0) 70%);
      top: -100px;
      left: -100px;
    }
    .glow-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #ec4899 0%, rgba(236, 72, 153, 0) 70%);
      bottom: -120px;
      right: -120px;
    }
    .glow-3 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, #3b82f6 0%, rgba(59, 130, 246, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* Main Container */
    .container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
      text-align: center;
    }

    /* Glass Panel */
    .glass-box {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      padding: 36px 28px;
      width: 100%;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.2);
    }

    /* Top Input Form */
    .name-form {
      display: flex;
      gap: 12px;
      width: 100%;
      max-width: 480px;
      margin: 0 auto 28px auto;
    }
    .name-input {
      flex: 1;
      background: rgba(31, 41, 55, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 12px 18px;
      font-size: 15px;
      color: #ffffff;
      outline: none;
      transition: all 0.2s ease;
    }
    .name-input:focus {
      border-color: #ec4899;
      box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.25);
    }
    .set-btn {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      white-space: nowrap;
    }
    .set-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
    }
    .set-btn:active {
      transform: translateY(1px);
    }

    /* Headers */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      color: #c4b5fd;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header-title {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #ffffff 30%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @media (min-width: 640px) {
      .header-title {
        font-size: 44px;
      }
    }
    .target-badge {
      font-size: 14px;
      color: #94a3b8;
      margin-bottom: 36px;
    }

    /* Grid for Cards */
    .timer-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 100%;
    }
    @media (min-width: 640px) {
      .timer-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
    }

    /* Individual Glass Timer Card */
    .timer-card {
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.75) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .timer-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    }
    .timer-card:hover {
      transform: translateY(-3px);
      border-color: rgba(236, 72, 153, 0.4);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    }
    .card-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 52px;
      font-weight: 700;
      line-height: 1;
      color: #ffffff;
      margin-bottom: 8px;
      text-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
    }
    @media (min-width: 640px) {
      .card-number {
        font-size: 64px;
      }
    }
    .card-label {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #a855f7;
    }

    /* Celebration Box */
    .celebration-box {
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      padding: 20px 0;
    }
    @keyframes popIn {
      0% {
        opacity: 0;
        transform: scale(0.85);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .celebration-title {
      font-family: 'Outfit', sans-serif;
      font-size: 38px;
      font-weight: 900;
      line-height: 1.2;
      background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #fbbf24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: pulse 2s infinite ease-in-out;
    }
    @media (min-width: 640px) {
      .celebration-title {
        font-size: 54px;
      }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    .celebration-sub {
      font-size: 18px;
      color: #e2e8f0;
      max-width: 520px;
      line-height: 1.6;
    }

    /* Footer Controls */
    .footer-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin-top: 12px;
    }
    .action-btn {
      background: rgba(31, 41, 55, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      border-radius: 9999px;
      padding: 8px 18px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .action-btn:hover {
      background: rgba(55, 65, 81, 0.8);
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="glow-sphere glow-1"></div>
  <div class="glow-sphere glow-2"></div>
  <div class="glow-sphere glow-3"></div>

  <div class="container">
    <div class="glass-box">
      <!-- Name Input Form (Hidden on Celebration) -->
      <form class="name-form" id="nameForm">
        <input 
          type="text" 
          id="nameInput" 
          class="name-input" 
          placeholder="Enter a birthday person's name..."
          autocomplete="off"
        />
        <button type="submit" class="set-btn" id="setNameBtn">Set Name</button>
      </form>

      <!-- Active Timer State -->
      <div id="timerSection">
        <div class="badge">✨ Milestone Countdown</div>
        <h1 class="header-title" id="headerTitle">COUNTDOWN TO YOUR BIRTHDAY</h1>
        <div class="target-badge">Target: September 2, 2026 at 00:00:00 (Midnight)</div>

        <div class="timer-grid">
          <div class="timer-card">
            <div class="card-number" id="daysVal">00</div>
            <div class="card-label">Days</div>
          </div>
          <div class="timer-card">
            <div class="card-number" id="hoursVal">00</div>
            <div class="card-label">Hours</div>
          </div>
          <div class="timer-card">
            <div class="card-number" id="minutesVal">00</div>
            <div class="card-label">Minutes</div>
          </div>
          <div class="timer-card">
            <div class="card-number" id="secondsVal">00</div>
            <div class="card-label">Seconds</div>
          </div>
        </div>
      </div>

      <!-- Celebration State (Shown when hits 0) -->
      <div id="celebrationSection" class="celebration-box">
        <div style="font-size: 64px; margin-bottom: -10px;">🎂 🎁 ✨</div>
        <h1 class="celebration-title" id="celebrationMessage">🎉 HAPPY BIRTHDAY! 🎉</h1>
        <p class="celebration-sub">
          Wishing you a wonderful year ahead filled with joy, happiness, and unforgettable moments!
        </p>
        <button class="action-btn" id="resetBtn" style="margin-top: 16px; border-color: #ec4899; color: #f472b6;">
          🔄 Back to Countdown Timer
        </button>
      </div>
    </div>

    <!-- Quick test controls -->
    <div class="footer-actions">
      <button class="action-btn" id="testZeroBtn">
        ⚡ Preview Celebration Mode
      </button>
    </div>
  </div>

  <script>
    // State
    let currentName = 'YOUR';
    let isTestZero = false;
    let confettiTimer = null;

    // Target Date: September 2, 2026 at 00:00:00 (Midnight)
    const TARGET_DATE = new Date(2026, 8, 2, 0, 0, 0);

    // Elements
    const nameForm = document.getElementById('nameForm');
    const nameInput = document.getElementById('nameInput');
    const headerTitle = document.getElementById('headerTitle');
    const timerSection = document.getElementById('timerSection');
    const celebrationSection = document.getElementById('celebrationSection');
    const celebrationMessage = document.getElementById('celebrationMessage');
    const testZeroBtn = document.getElementById('testZeroBtn');
    const resetBtn = document.getElementById('resetBtn');

    const daysEl = document.getElementById('daysVal');
    const hoursEl = document.getElementById('hoursVal');
    const minutesEl = document.getElementById('minutesVal');
    const secondsEl = document.getElementById('secondsVal');

    // Update Header Text & Document Title
    function updateDisplayName() {
      const clean = currentName.trim().toUpperCase();
      if (!clean || clean === 'YOUR') {
        headerTitle.innerText = 'COUNTDOWN TO YOUR BIRTHDAY';
        document.title = 'Countdown to Your Birthday';
        celebrationMessage.innerText = '🎉 HAPPY BIRTHDAY! 🎉';
      } else {
        const possessive = clean.endsWith('S') ? clean + "'" : clean + "'S";
        headerTitle.innerText = 'COUNTDOWN TO ' + possessive + ' BIRTHDAY';
        document.title = 'Countdown to ' + possessive + ' Birthday';
        celebrationMessage.innerText = '🎉 HAPPY BIRTHDAY, ' + clean + '! 🎉';
      }
    }

    // Set Name Event
    nameForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const val = nameInput.value.trim();
      currentName = val ? val : 'YOUR';
      updateDisplayName();
    });

    // Confetti Engine
    function startCelebrationConfetti() {
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (confettiTimer) clearInterval(confettiTimer);
        confettiTimer = setInterval(function() {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 }
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 }
          });
        }, 2200);
      }
    }

    function stopConfetti() {
      if (confettiTimer) {
        clearInterval(confettiTimer);
        confettiTimer = null;
      }
    }

    // Main Ticking Logic
    function updateCountdown() {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;

      if (difference <= 0 || isTestZero) {
        // Zero state triggered
        nameForm.style.display = 'none';
        timerSection.style.display = 'none';
        celebrationSection.style.display = 'flex';
        updateDisplayName();
        startCelebrationConfetti();
        return;
      }

      // Normal state
      nameForm.style.display = 'flex';
      timerSection.style.display = 'block';
      celebrationSection.style.display = 'none';
      stopConfetti();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.innerText = String(days).padStart(2, '0');
      hoursEl.innerText = String(hours).padStart(2, '0');
      minutesEl.innerText = String(minutes).padStart(2, '0');
      secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    // Toggle Preview Zero
    testZeroBtn.addEventListener('click', function() {
      isTestZero = !isTestZero;
      testZeroBtn.innerText = isTestZero ? '⏱️ Return to Active Timer' : '⚡ Preview Celebration Mode';
      updateCountdown();
    });

    resetBtn.addEventListener('click', function() {
      isTestZero = false;
      testZeroBtn.innerText = '⚡ Preview Celebration Mode';
      updateCountdown();
    });

    // Initial run & interval
    updateDisplayName();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  </script>
</body>
</html>`;
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateStandaloneHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2500);
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'birthday-countdown.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center px-4 py-8 sm:py-12 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Background ambient lighting */}
      <div 
        id="bg-glow-1"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse-glow" 
      />
      <div 
        id="bg-glow-2"
        className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 sm:w-[520px] sm:h-[520px] rounded-full bg-pink-600/20 blur-[130px] animate-pulse-glow" 
      />
      <div 
        id="bg-glow-3"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full bg-indigo-600/15 blur-[100px]" 
      />

      {/* Top Bar with Branding & Quick Tools */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Birthday Countdown
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-code-modal-btn"
            onClick={() => setShowCodeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 transition-all hover:text-white"
            title="View Standalone HTML Code"
          >
            <Code2 className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Standalone HTML</span>
          </button>

          <button
            id="toggle-test-zero-btn"
            onClick={() => setIsTestZeroMode(prev => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              isTestZeroMode 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20' 
                : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white'
            }`}
          >
            {isTestZeroMode ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Exit Demo Zero</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate Zero (00:00:00)</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Glass Panel */}
      <main className="w-full max-w-3xl z-10 my-auto">
        <div id="main-glass-panel" className="glass-panel rounded-3xl p-6 sm:p-10 transition-all duration-300">
          
          {/* Section 1: Custom Name Feature (Hidden when Countdown is Zero / Celebration) */}
          {!timeLeft.isZero && (
            <div id="custom-name-section" className="mb-8 max-w-lg mx-auto">
              <form onSubmit={handleSetName} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <input
                    id="name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter name (e.g., Alex, Sarah)..."
                    className="w-full bg-slate-900/80 border border-slate-700/70 focus:border-pink-500/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-pink-500/20"
                  />
                  {nameInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setNameInput('');
                        setSavedName('YOUR');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1.5 py-0.5 rounded bg-slate-800/80"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  id="set-name-btn"
                  type="submit"
                  className="px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Set Name</span>
                </button>
              </form>

              <div className="mt-2 text-center">
                <span className="text-xs text-slate-400">
                  Current Name Target:{' '}
                  <span className="text-pink-400 font-semibold">
                    {savedName.trim() ? savedName.trim().toUpperCase() : 'YOUR'}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Section 2: Active Countdown Timer */}
          {!timeLeft.isZero ? (
            <div id="active-countdown-display" className="text-center">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/15 border border-violet-500/30 text-violet-300 uppercase tracking-wider mb-4">
                <Calendar className="w-3.5 h-3.5 text-violet-400" />
                <span>Target: September 2, 2026 • 00:00:00 (Midnight)</span>
              </div>

              {/* Dynamic Header Text */}
              <h1 
                id="header-title"
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 transition-all"
              >
                {formattedHeaderTitle}
              </h1>

              <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8">
                Ticking second-by-second with precision down to midnight.
              </p>

              {/* 4-Card Glassmorphism Grid */}
              <div id="timer-cards-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
                {/* Days */}
                <div id="card-days" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center group">
                  <span className="font-mono-num text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(236,72,153,0.35)] group-hover:scale-105 transition-transform">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-pink-400 mt-2">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div id="card-hours" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center group">
                  <span className="font-mono-num text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-transform">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-purple-400 mt-2">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div id="card-minutes" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center group">
                  <span className="font-mono-num text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(99,102,241,0.35)] group-hover:scale-105 transition-transform">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-400 mt-2">
                    Minutes
                  </span>
                </div>

                {/* Seconds */}
                <div id="card-seconds" className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center group">
                  <span className="font-mono-num text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400 mt-2">
                    Seconds
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Section 3: Celebration State (Countdown Hits 0) */
            <div id="celebration-state-container" className="text-center py-6 sm:py-10 animate-scale-up">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-2xl shadow-pink-500/40 mb-6 animate-bounce">
                <PartyPopper className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>

              {/* Dynamic Animated Celebration Message */}
              <h1 
                id="celebration-message-header"
                className="font-heading text-3xl sm:text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 bg-clip-text text-transparent mb-4 leading-tight"
              >
                {celebrationMessage}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
                Today is all about celebrating you! May this new age and chapter bring endless health, happiness, prosperity, and memorable adventures. 🎂✨
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  id="celebration-confetti-blast-btn"
                  onClick={() => {
                    confetti({
                      particleCount: 120,
                      spread: 80,
                      origin: { y: 0.6 }
                    });
                  }}
                  className="px-6 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 transition-all shadow-lg shadow-pink-500/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Confetti Blast</span>
                </button>

                <button
                  id="back-to-timer-btn"
                  onClick={() => setIsTestZeroMode(false)}
                  className="px-5 py-3 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Back to Timer</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer information */}
      <footer className="w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 mt-6 z-10 border-t border-slate-800/60 pt-4">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>September 2, 2026 00:00:00 (Midnight)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownloadHtml}
            className="hover:text-pink-400 transition-colors flex items-center gap-1"
          >
            <span>Download Standalone HTML</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setShowCodeModal(true)}
            className="hover:text-pink-400 transition-colors"
          >
            Copy Code
          </button>
        </div>
      </footer>

      {/* Standalone HTML Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-pink-400" />
                <h3 className="font-semibold text-white">Standalone Single-File HTML Website</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/60 flex-1">
              <p className="font-sans text-xs text-slate-400 mb-3">
                This is a complete, self-contained single-file HTML website with embedded CSS, JavaScript, Canvas-Confetti CDN, and the September 2, 2026 midnight target.
              </p>
              <pre className="whitespace-pre-wrap break-all select-all p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                {generateStandaloneHtml()}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900">
              <button
                onClick={handleDownloadHtml}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Download .html File
              </button>
              <button
                onClick={handleCopyHtml}
                className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-pink-500 to-violet-600 rounded-lg hover:from-pink-400 hover:to-violet-500 transition-all flex items-center gap-1.5"
              >
                {copiedHtml ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full HTML Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
