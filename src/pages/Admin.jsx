import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, UserPlus, Trash2, LogOut, Check, Save, RotateCcw, AlertTriangle, FileText, Settings, Database, TrendingUp, Users, ArrowUpDown, GripVertical, ChevronUp, ChevronDown, Calendar, Clock, Timer, Sparkles, GitBranch, UploadCloud, RefreshCw } from 'lucide-react';
import { getJuneData, getMayData, saveJuneData, saveMayData, saveJuneDataRaw, saveMayDataRaw, sortAndRank, resetData, getWagerGoal, saveWagerGoal, getPrizePool, savePrizePool, getLeaderboardDates, saveLeaderboardDates, getTimerEnd, buildFullSnapshot, initializeFromGitHub } from '../utils/dataStore';
import { pushLeaderboardToGitHub, getGitHubToken, setGitHubToken } from '../utils/githubSync';

/* ============================================================================
   BACKGROUND AURORA CANVAS COMPONENT
   ============================================================================ */
function AdminAuroraCanvas() {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const blobs = [
      { x: width * 0.2, y: height * 0.2, r: 280, color: 'rgba(230, 57, 70, 0.02)' },
      { x: width * 0.8, y: height * 0.8, r: 320, color: 'rgba(234, 179, 8, 0.015)' },
      { x: width * 0.5, y: height * 0.5, r: 250, color: 'rgba(16, 185, 129, 0.015)' }
    ];

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      blobs.forEach((b) => {
        const r = b.r + Math.sin(time * 0.001) * 20;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDisplayDateDMY(isoDateStr, timeStr = '') {
  if (!isoDateStr) return 'Not set';
  const parts = isoDateStr.split('-');
  if (parts.length !== 3) return isoDateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parts[2];
  const monthName = MONTH_NAMES[monthIdx] || parts[1];
  const dmy = `${String(day).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}/${year}`;
  const readable = `${parseInt(day, 10)} ${monthName} ${year}`;
  if (timeStr) {
    return `${readable} at ${timeStr} (${dmy})`;
  }
  return `${readable} (${dmy})`;
}

function DMYDatePicker({ label, isoValue, onChange }) {
  const parts = (isoValue || '2026-08-16').split('-');
  const year = parts[0] || '2026';
  const month = parts[1] || '08';
  const day = parts[2] || '16';

  const handleDayChange = (newDay) => {
    const parsed = parseInt(newDay, 10);
    const validDay = isNaN(parsed) ? '01' : String(Math.min(31, Math.max(1, parsed))).padStart(2, '0');
    onChange(`${year}-${month}-${validDay}`);
  };

  const handleMonthChange = (newMonth) => {
    onChange(`${year}-${newMonth}-${day}`);
  };

  const handleYearChange = (newYear) => {
    onChange(`${newYear || '2026'}-${month}-${day}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-white/60 tracking-wide flex items-center gap-2">
          <span>{label}</span>
          <span className="text-white/40 text-[9px] font-mono font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
            Day / Month / Year
          </span>
        </label>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {/* Date (DD) */}
        <div className="col-span-3 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-white/45 tracking-wide">Date (DD)</span>
          <input
            type="number"
            min="1"
            max="31"
            value={parseInt(day, 10) || ''}
            onChange={(e) => handleDayChange(e.target.value)}
            placeholder="DD"
            className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-2.5 py-2.5 text-sm font-mono text-white text-center font-bold focus:outline-none transition-colors"
          />
        </div>

        {/* Month (MM) */}
        <div className="col-span-5 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-white/45 tracking-wide">Month (MM)</span>
          <select
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-2 py-2.5 text-sm font-medium text-white focus:outline-none transition-colors cursor-pointer"
          >
            {MONTH_NAMES.map((name, idx) => {
              const val = String(idx + 1).padStart(2, '0');
              return (
                <option key={val} value={val} className="bg-[#16161d] text-white">
                  {val} - {name.slice(0, 3)}
                </option>
              );
            })}
          </select>
        </div>

        {/* Year (YYYY) */}
        <div className="col-span-4 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-white/45 tracking-wide">Year (YYYY)</span>
          <input
            type="number"
            min="2024"
            max="2035"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="YYYY"
            className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-2.5 py-2.5 text-sm font-mono text-white text-center font-bold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Live Formatted Display */}
      <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5 mt-0.5">
        <Calendar size={13} className="text-accent shrink-0" />
        <span className="text-xs text-white/50">
          Selected: <strong className="text-white/90 font-semibold">{formatDisplayDateDMY(isoValue)}</strong>
        </span>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('june');
  const [players, setPlayers] = useState([]);
  const [wagerGoalInput, setWagerGoalInput] = useState('');
  const [prizePoolInput, setPrizePoolInput] = useState('');
  const [activeConfigTab, setActiveConfigTab] = useState('general');

  // Add Competitor Form State
  const [newUsername, setNewUsername] = useState('');
  const [newWager, setNewWager] = useState('');
  const [newPrize, setNewPrize] = useState('');

  // Status Alerts
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'reset' | null

  // Leaderboard Dates & Automatic Timer state
  const [datesConfig, setDatesConfig] = useState(getLeaderboardDates());
  const [liveLabelInput, setLiveLabelInput] = useState('');
  const [liveStartDateInput, setLiveStartDateInput] = useState('');
  const [liveEndDateInput, setLiveEndDateInput] = useState('');
  const [liveEndTimeInput, setLiveEndTimeInput] = useState('23:59');
  const [pastLabelInput, setPastLabelInput] = useState('');
  const [timerRemaining, setTimerRemaining] = useState(null);

  // GitHub Auto-Sync State
  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [gitHubSyncStatus, setGitHubSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [gitHubSyncMsg, setGitHubSyncMsg] = useState(null);
  const [githubTokenInput, setGithubTokenInput] = useState(getGitHubToken());

  const handleSaveGitHubToken = (e) => {
    if (e) e.preventDefault();
    setGitHubToken(githubTokenInput.trim());
    triggerStatusAlert('success');
  };

  const syncToGitHub = async (customSnapshot = null) => {
    setIsSyncingGitHub(true);
    setGitHubSyncStatus('syncing');
    try {
      const snapshot = customSnapshot || buildFullSnapshot();
      await pushLeaderboardToGitHub(snapshot);
      setGitHubSyncStatus('synced');
      triggerStatusAlert('github_success');
      setTimeout(() => setGitHubSyncStatus('idle'), 4000);
    } catch (err) {
      console.error('GitHub sync error:', err);
      setGitHubSyncStatus('error');
      setGitHubSyncMsg(err.message || 'GitHub sync error');
      triggerStatusAlert('github_error');
      setTimeout(() => setGitHubSyncStatus('idle'), 6000);
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  // Load active dates & timer on mount, fetching live repo data
  useEffect(() => {
    if (isAuthenticated) {
      initializeFromGitHub().then(() => {
        const data = activeTab === 'june' ? getJuneData() : getMayData();
        setPlayers(data);
        setWagerGoalInput(getWagerGoal().toString());
        setPrizePoolInput(getPrizePool(activeTab));
        const dates = getLeaderboardDates();
        setDatesConfig(dates);
        setLiveLabelInput(dates.liveLabel || 'Aug 16–23');
        setLiveStartDateInput(dates.liveStartDate || '2026-08-16');
        setLiveEndDateInput(dates.liveEndDate || '2026-08-23');
        setLiveEndTimeInput(dates.liveEndTime || '23:59');
        setPastLabelInput(dates.pastLabel || 'Aug 9–16');
      });
    }
  }, [isAuthenticated, activeTab]);

  // Live countdown tick for admin preview
  useEffect(() => {
    const tick = () => {
      const end = getTimerEnd();
      if (!end) {
        setTimerRemaining(null);
        return;
      }
      const diff = end - Date.now();
      if (diff <= 0) {
        setTimerRemaining({ d: 0, h: 0, m: 0, s: 0, isEnded: true });
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimerRemaining({ d, h, m, s, isEnded: false });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [datesConfig]);

  const handleSaveDateSettings = (e) => {
    if (e) e.preventDefault();
    const newDates = {
      liveLabel: liveLabelInput.trim() || 'Aug 16–23',
      liveStartDate: liveStartDateInput,
      liveEndDate: liveEndDateInput,
      liveEndTime: liveEndTimeInput || '23:59',
      pastLabel: pastLabelInput.trim() || 'Aug 9–16'
    };
    const saved = saveLeaderboardDates(newDates);
    setDatesConfig(saved);
    triggerStatusAlert('success');
    syncToGitHub();
  };

  // Session check on mount
  useEffect(() => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Secure client-side hashing verify (SHA-256)
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(false);

    try {
      const hashBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(passwordInput)
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Password SHA-256 target: 307f22052a4617bf8473f4d60c7c7452740cf16e5735b2b0b069705d76810965
      if (hashHex === '307f22052a4617bf8473f4d60c7c7452740cf16e5735b2b0b069705d76810965') {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAdmin', 'true');
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error('Crypto error', err);
      setLoginError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdmin');
    setPasswordInput('');
  };

  // Add Competitor
  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newUsername) return;

    // Standardize inputs
    const formattedWager = newWager.startsWith('$') ? newWager : `$${newWager}`;
    const formattedPrize = !newPrize || newPrize.trim() === '' ? '—' : (newPrize.startsWith('$') ? newPrize : `$${newPrize}`);

    const newPlayer = {
      username: newUsername.trim(),
      wagered: formattedWager,
      prize: formattedPrize,
      rank: 99, // Will be recalculated on save
      isPodium: false
    };

    const updated = [...players, newPlayer];
    saveCurrentData(updated);

    // Reset Form
    setNewUsername('');
    setNewWager('');
    setNewPrize('');
    triggerStatusAlert('success');
  };

  // Update specific player cells inline
  const handlePlayerCellChange = (index, field, value) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
  };

  // Save changes to localStorage and push to GitHub repo
  const handleSaveChanges = async () => {
    saveCurrentData(players);
    saveWagerGoal(parseInt(wagerGoalInput, 10) || 1000000);
    savePrizePool(activeTab, prizePoolInput);
    handleSaveDateSettings();
    await syncToGitHub();
  };

  const saveCurrentData = (data) => {
    let saved;
    if (activeTab === 'june') {
      saved = saveJuneDataRaw(data);
    } else {
      saved = saveMayDataRaw(data);
    }
    setPlayers(saved);
  };

  // Arrange: auto-sort all players by wager descending
  const handleArrange = () => {
    const sorted = sortAndRank(players);
    if (activeTab === 'june') {
      saveJuneData(sorted);
    } else {
      saveMayData(sorted);
    }
    setPlayers(sorted);
    triggerStatusAlert('success');
  };

  // Remove player
  const handleRemovePlayer = (rank) => {
    const updated = players.filter(p => p.rank !== rank);
    saveCurrentData(updated);
    triggerStatusAlert('success');
  };

  // Move player up/down (mobile-friendly alternative to drag)
  const handleMovePlayer = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === players.length - 1) return;
    const updated = [...players];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    // Recalculate ranks based on new positions
    const ranked = updated.map((p, i) => ({ ...p, rank: i + 1, isPodium: i < 3 }));
    setPlayers(ranked);
  };

  // ---- Drag & Drop (pointer events for desktop + mobile touch) ----
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [dragIdx, setDragIdx] = useState(null);

  const handleDragStart = (idx) => {
    dragItem.current = idx;
    setDragIdx(idx);
  };

  const handleDragEnter = (idx) => {
    dragOverItem.current = idx;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      setDragIdx(null);
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const updated = [...players];
    const draggedItem = updated.splice(dragItem.current, 1)[0];
    updated.splice(dragOverItem.current, 0, draggedItem);
    // Re-rank based on new array order
    const ranked = updated.map((p, i) => ({ ...p, rank: i + 1, isPodium: i < 3 }));
    setPlayers(ranked);
    setDragIdx(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // ---- Touch Drag (for mobile) ----
  const tableContainerRef = useRef(null);
  const touchDragItem = useRef(null);
  const touchCloneRef = useRef(null);
  const tableBodyRef = useRef(null);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
      if (touchCloneRef.current && touchCloneRef.current.parentNode) {
        touchCloneRef.current.parentNode.removeChild(touchCloneRef.current);
      }
    };
  }, []);

  const handleTouchStart = useCallback((idx, e) => {
    touchDragItem.current = idx;
    dragOverItem.current = idx;
    setDragIdx(idx);

    // Block page and side scrollbar scrolling while dragging on mobile
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.userSelect = 'none';
    if (tableContainerRef.current) {
      tableContainerRef.current.style.overflow = 'hidden';
    }

    const touch = e.touches[0];
    const row = e.currentTarget.closest('tr');
    if (row) {
      const clone = row.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.top = `${touch.clientY - 25}px`;
      clone.style.left = `${row.getBoundingClientRect().left}px`;
      clone.style.width = `${row.getBoundingClientRect().width}px`;
      clone.style.opacity = '0.92';
      clone.style.zIndex = '99999';
      clone.style.pointerEvents = 'none';
      clone.style.background = '#18181b';
      clone.style.border = '2px solid rgba(234, 179, 8, 0.6)';
      clone.style.borderRadius = '12px';
      clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(234, 179, 8, 0.2)';
      document.body.appendChild(clone);
      touchCloneRef.current = clone;
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchDragItem.current === null) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];

    // Move the visual clone with the finger
    if (touchCloneRef.current) {
      touchCloneRef.current.style.top = `${touch.clientY - 25}px`;
    }

    // Figure out which row we're over
    if (tableBodyRef.current) {
      const rows = tableBodyRef.current.querySelectorAll('tr[data-idx]');
      for (const row of rows) {
        const rect = row.getBoundingClientRect();
        if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          const overIdx = parseInt(row.getAttribute('data-idx'), 10);
          if (!isNaN(overIdx)) {
            dragOverItem.current = overIdx;
          }
          break;
        }
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Restore page and side scrollbar scrolling
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.userSelect = '';
    if (tableContainerRef.current) {
      tableContainerRef.current.style.overflow = '';
    }

    // Remove clone
    if (touchCloneRef.current) {
      if (touchCloneRef.current.parentNode) {
        touchCloneRef.current.parentNode.removeChild(touchCloneRef.current);
      }
      touchCloneRef.current = null;
    }

    if (touchDragItem.current === null || dragOverItem.current === null || touchDragItem.current === dragOverItem.current) {
      setDragIdx(null);
      touchDragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const updated = [...players];
    const draggedItem = updated.splice(touchDragItem.current, 1)[0];
    updated.splice(dragOverItem.current, 0, draggedItem);
    const ranked = updated.map((p, i) => ({ ...p, rank: i + 1, isPodium: i < 3 }));
    setPlayers(ranked);
    setDragIdx(null);
    touchDragItem.current = null;
    dragOverItem.current = null;
  }, [players]);

  // Reset database back to default static mockups and push to GitHub
  const handleResetData = async () => {
    if (window.confirm('Reset leaderboard database to default static mockup values? Any edits will be lost and synced to GitHub.')) {
      resetData();
      const resetList = activeTab === 'june' ? getJuneData() : getMayData();
      setPlayers(resetList);
      setWagerGoalInput(getWagerGoal().toString());
      setPrizePoolInput(getPrizePool(activeTab));
      const resetDates = getLeaderboardDates();
      setDatesConfig(resetDates);
      setLiveLabelInput(resetDates.liveLabel);
      setLiveStartDateInput(resetDates.liveStartDate);
      setLiveEndDateInput(resetDates.liveEndDate);
      setLiveEndTimeInput(resetDates.liveEndTime);
      setPastLabelInput(resetDates.pastLabel);
      triggerStatusAlert('reset');
      await syncToGitHub();
    }
  };

  const triggerStatusAlert = (type) => {
    setSaveStatus(type);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Dynamic Dashboard Metrics
  const metrics = useMemo(() => {
    const count = players.length;
    const parseWager = (wagerStr) => {
      const cleaned = wagerStr.replace('$', '').trim();
      if (cleaned.endsWith('K')) {
        return parseFloat(cleaned.replace('K', '')) * 1000;
      }
      return parseFloat(cleaned) || 0;
    };
    const totalWagered = players.reduce((sum, p) => sum + parseWager(p.wagered), 0);
    const topWager = count > 0 ? Math.max(...players.map(p => parseWager(p.wagered))) : 0;
    
    const totalWageredFormatted = totalWagered >= 1000
      ? `$${(totalWagered / 1000).toFixed(1)}K`
      : `$${totalWagered.toFixed(2)}`;

    const topWagerFormatted = topWager >= 1000
      ? `$${(topWager / 1000).toFixed(1)}K`
      : `$${topWager.toFixed(2)}`;

    return { count, totalWageredFormatted, topWagerFormatted };
  }, [players]);

  // Export to CSV helper
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Rank,Username,Wagered,Prize\n';
    
    players.forEach(p => {
      csvContent += `${p.rank},"${p.username}",${p.wagered},${p.prize}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hunchos_leaderboard_${activeTab}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-bg-darker pb-24 overflow-hidden pt-28">
      <AdminAuroraCanvas />

      {/* LOGIN SCREEN */}
      {!isAuthenticated ? (
        <div className="relative z-10 max-w-md mx-auto px-6 pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#16161d]/95 border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-5 shadow-lg shadow-accent/10">
                <Lock size={22} className="text-accent" />
              </div>
              <h2 className="text-3xl font-black font-display text-white uppercase tracking-tight">ADMIN GATEWAY</h2>
              <p className="text-sm font-medium text-white/40 tracking-wide mt-2">Hunchos Lead Terminal</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-white/60 tracking-wide">Enter Access Code</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••"
                  className="bg-white/[0.04] border border-white/8 rounded-xl px-5 py-3.5 text-sm text-white tracking-widest placeholder-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all text-center"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2.5 text-rose-400 text-xs font-bold tracking-wider uppercase bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>ACCESS DENIED. INVALID PASSWORD HASH.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest py-4 uppercase rounded-xl transition-all duration-300 shadow-xl cursor-pointer hover:shadow-white/10 active:scale-[0.99]"
              >
                {isSubmitting ? 'VERIFYING SIGNATURE...' : 'AUTHENTICATE SESSION'}
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        /* ADMIN DASHBOARD */
        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col gap-10">
          
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black font-display text-white uppercase tracking-tight">ADMIN CONTROL PANEL</h1>
              <p className="text-sm font-medium text-white/40 tracking-wide mt-2">Live database manager</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => syncToGitHub()}
                disabled={isSyncingGitHub}
                className={`flex items-center gap-2 px-4 py-2.5 border text-xs font-bold tracking-wide uppercase transition-all rounded-full cursor-pointer shadow-sm ${
                  gitHubSyncStatus === 'synced'
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                    : gitHubSyncStatus === 'error'
                    ? 'border-rose-500/40 bg-rose-500/15 text-rose-400'
                    : isSyncingGitHub
                    ? 'border-accent/40 bg-accent/15 text-accent'
                    : 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                }`}
                title="Push current state directly to GitHub repository"
              >
                {isSyncingGitHub ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-accent" />
                    <span>Pushing to GitHub...</span>
                  </>
                ) : gitHubSyncStatus === 'synced' ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>Synced to GitHub</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={14} className="text-emerald-400" />
                    <span>Sync with GitHub</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2.5 px-5 py-2.5 border border-white/15 hover:border-white/40 text-xs font-bold tracking-widest uppercase transition-all bg-white/5 hover:bg-white/15 rounded-full cursor-pointer text-white/90 shadow-sm"
              >
                <FileText size={15} className="text-white/70" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-5 py-2.5 border border-rose-500/30 hover:border-rose-500 text-xs font-bold tracking-widest text-rose-400 transition-all bg-rose-500/10 hover:bg-rose-500/20 rounded-full cursor-pointer shadow-sm"
              >
                <LogOut size={15} />
                <span>End Session</span>
              </button>
            </div>
          </div>

          {/* Status Overlay */}
          {saveStatus && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-3 border px-5 py-3.5 rounded-2xl text-xs font-bold tracking-wide uppercase max-w-lg shadow-lg ${
                saveStatus === 'success' || saveStatus === 'github_success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : saveStatus === 'github_error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              {saveStatus === 'github_error' ? (
                <AlertTriangle size={16} className="shrink-0 text-rose-400" />
              ) : (
                <Check size={16} className="shrink-0" />
              )}
              <span>
                {saveStatus === 'github_success'
                  ? 'DATABASE SAVED & PUSHED TO GITHUB REPO'
                  : saveStatus === 'github_error'
                  ? (gitHubSyncMsg ? `GITHUB SYNC: ${gitHubSyncMsg.toUpperCase()}` : 'ERROR SYNCING WITH GITHUB')
                  : saveStatus === 'success'
                  ? 'DATABASE UPDATED & SAVED'
                  : 'DATABASE RESET TO DEFAULT VALUES'}
              </span>
            </motion.div>
          )}

          {/* Metrics & Month Toggle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Config panel */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Selector tabs */}
              <div className="flex gap-2 bg-[#16161d] p-1.5 rounded-2xl border border-white/10 self-start w-full shadow-inner">
                {[
                  { id: 'june', label: datesConfig.liveLabel || 'Aug 16–23', status: 'Live' },
                  { id: 'may', label: datesConfig.pastLabel || 'Aug 9–16', status: 'Past' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-grow py-2.5 px-3 text-xs font-bold tracking-wider uppercase transition-all rounded-xl cursor-pointer text-center flex items-center justify-center gap-2 ${
                      activeTab === tab.id ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${
                      activeTab === tab.id ? 'bg-black/10 text-black' : 'bg-white/10 text-white/40'
                    }`}>
                      {tab.status}
                    </span>
                  </button>
                ))}
              </div>

              {/* Metrics cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#16161d] border border-white/10 p-5 rounded-2xl flex items-center gap-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/45 tracking-wide">Total Volume</span>
                    <span className="text-base sm:text-lg font-mono font-black text-white mt-0.5">{metrics.totalWageredFormatted}</span>
                  </div>
                </div>

                <div className="bg-[#16161d] border border-white/10 p-5 rounded-2xl flex items-center gap-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <Users size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/45 tracking-wide">Competitors</span>
                    <span className="text-base sm:text-lg font-mono font-black text-white mt-0.5">{metrics.count}</span>
                  </div>
                </div>
              </div>

              {/* Config settings */}
              <div className="bg-[#16161d] border border-white/10 p-6 sm:p-7 rounded-3xl flex flex-col gap-6 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <Settings size={16} className="text-white/70" />
                  <span className="text-base font-display font-black tracking-wide text-white">Target configurations</span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Wager Goal */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/60 tracking-wide">Wager Goal (USD)</label>
                    <input
                      type="number"
                      value={wagerGoalInput}
                      onChange={(e) => setWagerGoalInput(e.target.value)}
                      placeholder="1000000"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm font-mono text-white tracking-wider focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Prize Pool */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/60 tracking-wide">Prize Pool Text</label>
                    <input
                      type="text"
                      value={prizePoolInput}
                      onChange={(e) => setPrizePoolInput(e.target.value)}
                      placeholder="$1,000"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white tracking-wide focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleSaveChanges}
                    className="w-full mt-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest py-3.5 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                  >
                    <Save size={14} />
                    <span>Apply Settings</span>
                  </button>
                </div>
              </div>

              {/* Leaderboard Schedule & Dates */}
              <div className="bg-[#16161d] border border-white/10 p-6 sm:p-7 rounded-3xl flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-white/70" />
                    <span className="text-base font-display font-black tracking-wide text-white">Leaderboard Schedule</span>
                  </div>
                  <span className="text-[10px] font-medium px-3 py-1 rounded-lg tracking-wide bg-white/5 border border-white/10 text-white/50 font-mono">
                    DD / MM / YYYY
                  </span>
                </div>

                {/* Automatic Countdown Readout Preview */}
                <div className="bg-[#0c0c0f] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[11px] font-semibold text-white/50 tracking-wide flex items-center gap-1.5">
                      <Timer size={12} className={timerRemaining && !timerRemaining.isEnded ? 'text-emerald-400' : 'text-rose-400'} />
                      <span>{timerRemaining && !timerRemaining.isEnded ? 'Active Countdown' : 'Timer Status'}</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg tracking-wide ${
                      timerRemaining && !timerRemaining.isEnded
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                    }`}>
                      {timerRemaining && !timerRemaining.isEnded ? 'Counting Down' : 'Competition Ended'}
                    </span>
                  </div>

                  {timerRemaining && !timerRemaining.isEnded ? (
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex flex-col items-center bg-black/60 border border-white/10 rounded-xl px-3 py-2 min-w-[46px]">
                        <span className="text-xl font-mono font-black text-white">{String(timerRemaining.d).padStart(2, '0')}</span>
                        <span className="text-[9px] font-medium text-white/40 tracking-wide mt-0.5">Days</span>
                      </div>
                      <span className="text-white/40 font-mono font-bold text-base">:</span>
                      <div className="flex flex-col items-center bg-black/60 border border-white/10 rounded-xl px-3 py-2 min-w-[46px]">
                        <span className="text-xl font-mono font-black text-white">{String(timerRemaining.h).padStart(2, '0')}</span>
                        <span className="text-[9px] font-medium text-white/40 tracking-wide mt-0.5">Hrs</span>
                      </div>
                      <span className="text-white/40 font-mono font-bold text-base">:</span>
                      <div className="flex flex-col items-center bg-black/60 border border-white/10 rounded-xl px-3 py-2 min-w-[46px]">
                        <span className="text-xl font-mono font-black text-white">{String(timerRemaining.m).padStart(2, '0')}</span>
                        <span className="text-[9px] font-medium text-white/40 tracking-wide mt-0.5">Min</span>
                      </div>
                      <span className="text-white/40 font-mono font-bold text-base">:</span>
                      <div className="flex flex-col items-center bg-black/60 border border-white/10 rounded-xl px-3 py-2 min-w-[46px]">
                        <span className="text-xl font-mono font-black text-accent">{String(timerRemaining.s).padStart(2, '0')}</span>
                        <span className="text-[9px] font-medium text-white/40 tracking-wide mt-0.5">Sec</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-xs font-mono font-bold text-white/60 uppercase">Timer reaches zero on target deadline</span>
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center mt-1 border-t border-white/5 pt-2 w-full">
                    <span className="text-[10px] font-medium text-white/35 tracking-wide">Target Deadline:</span>
                    <span className="text-xs font-mono font-semibold text-accent/90 mt-1">
                      {formatDisplayDateDMY(liveEndDateInput, liveEndTimeInput)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Start Date (DD / MM / YYYY) */}
                  <DMYDatePicker
                    label="Live Week Start Date"
                    isoValue={liveStartDateInput}
                    onChange={setLiveStartDateInput}
                  />

                  {/* End Date (DD / MM / YYYY) */}
                  <DMYDatePicker
                    label="Live Week End Date (Deadline)"
                    isoValue={liveEndDateInput}
                    onChange={setLiveEndDateInput}
                  />

                  {/* End Time (HH:MM) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-white/60 tracking-wide flex items-center justify-between">
                      <span>End Time (Hour : Minute)</span>
                      <span className="text-white/35 font-mono text-[10px]">24-Hour Format</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={liveEndTimeInput}
                        onChange={(e) => setLiveEndTimeInput(e.target.value)}
                        className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-2.5 text-sm font-mono text-white tracking-wider focus:outline-none transition-colors w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3.5 py-2.5">
                      <Clock size={13} className="text-accent shrink-0" />
                      <span className="text-xs text-white/50">
                        Deadline Time: <strong className="text-white/90 font-semibold">{liveEndTimeInput || '23:59'} (Target End)</strong>
                      </span>
                    </div>
                  </div>

                  {/* Live Week Label */}
                  <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-white/60 tracking-wide">
                        Live Week Display Label
                      </label>
                      <span className="text-[10px] font-mono text-white/30">Visible on Tabs</span>
                    </div>
                    <input
                      type="text"
                      value={liveLabelInput}
                      onChange={(e) => setLiveLabelInput(e.target.value)}
                      placeholder="e.g. Aug 16–23 or 16–23 Aug"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white tracking-wide focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Past Week Label */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-white/60 tracking-wide">
                        Past Week Display Label
                      </label>
                      <span className="text-[10px] font-mono text-white/30">Visible on Tabs</span>
                    </div>
                    <input
                      type="text"
                      value={pastLabelInput}
                      onChange={(e) => setPastLabelInput(e.target.value)}
                      placeholder="e.g. Aug 9–16 or 09–16 Aug"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm font-medium text-white tracking-wide focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleSaveDateSettings}
                    className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest py-3.5 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] mt-2"
                  >
                    <Save size={14} />
                    <span>Apply Schedule & Dates</span>
                  </button>
                </div>
              </div>

              {/* Maintenance & GitHub Tools */}
              <div className="bg-[#16161d] border border-white/10 p-6 sm:p-7 rounded-3xl flex flex-col gap-6 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <Database size={16} className="text-white/70" />
                  <span className="text-base font-display font-black tracking-wide text-white">Database & GitHub Sync</span>
                </div>

                {/* GitHub Token Config */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-white/60 tracking-wide flex items-center gap-1.5">
                      <GitBranch size={13} className="text-white/50" />
                      <span>GitHub Personal Access Token</span>
                    </label>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md ${
                      githubTokenInput ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40'
                    }`}>
                      {githubTokenInput ? 'Token Connected' : 'No Token'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={githubTokenInput}
                      onChange={(e) => setGithubTokenInput(e.target.value)}
                      placeholder="github_pat_..."
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-2.5 text-xs font-mono text-white tracking-wider focus:outline-none transition-colors w-full"
                    />
                    <button
                      onClick={handleSaveGitHubToken}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all uppercase cursor-pointer shrink-0"
                    >
                      Save
                    </button>
                  </div>
                  <span className="text-[10px] text-white/35">
                    Target repo: <strong className="text-white/60">OfficialTeamAN/Hunchos (main)</strong>
                  </span>
                </div>

                <button
                  onClick={handleResetData}
                  className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 font-bold text-xs tracking-widest py-3.5 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] mt-2"
                >
                  <RotateCcw size={14} />
                  <span>Restore Mock Defaults & Sync</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Competitors list and forms */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Add Competitor Form */}
              <div className="bg-[#16161d] border border-white/10 p-6 sm:p-7 rounded-3xl flex flex-col gap-6 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                  <UserPlus size={16} className="text-white/70" />
                  <span className="text-base font-display font-black tracking-wide text-white">Add New Competitor</span>
                </div>

                <form onSubmit={handleAddPlayer} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/60 tracking-wide">Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. StakeWinner"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/60 tracking-wide">Wager Amount</label>
                    <input
                      type="text"
                      required
                      value={newWager}
                      onChange={(e) => setNewWager(e.target.value)}
                      placeholder="e.g. $12.3K or $403.00"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/60 tracking-wide">Prize Amount</label>
                    <input
                      type="text"
                      value={newPrize}
                      onChange={(e) => setNewPrize(e.target.value)}
                      placeholder="e.g. $100 or leave empty"
                      className="bg-white/[0.04] border border-white/8 focus:border-white/20 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-3 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest py-4 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg active:scale-[0.99]"
                  >
                    <UserPlus size={15} />
                    <span>Initialize Competitor</span>
                  </button>
                </form>
              </div>

              {/* Competitors List Manager */}
              <div className="bg-[#16161d] border border-white/10 rounded-3xl p-5 sm:p-7 flex flex-col gap-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5">
                  <span className="text-base font-display font-black tracking-wide text-white">Competitor database ({players.length})</span>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleArrange}
                      className="flex items-center gap-2 px-3.5 py-2 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                      title="Auto-sort all players by wager amount (highest first)"
                    >
                      <ArrowUpDown size={13} />
                      <span>Arrange by Wager</span>
                    </button>
                    <span className="text-[11px] font-mono font-medium text-white/30 tracking-wide hidden sm:inline">DRAG TO REORDER</span>
                  </div>
                </div>

                <div ref={tableContainerRef} className="overflow-x-auto max-h-[560px] overflow-y-auto pr-1 -mx-1 px-1">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-[#16161d] z-10">
                      <tr className="border-b border-white/10 text-xs font-semibold text-white/50 tracking-wide">
                        <th className="py-3 pl-2 w-10 text-center"></th>
                        <th className="py-3 w-12">Rank</th>
                        <th className="py-3">Competitor</th>
                        <th className="py-3 w-32">Wagered</th>
                        <th className="py-3 w-28 hidden sm:table-cell">Prize</th>
                        <th className="py-3 pr-2 text-right w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody ref={tableBodyRef}>
                      {players.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-xs text-white/40 uppercase font-bold tracking-widest">
                            No competitors in database
                          </td>
                        </tr>
                      ) : (
                        players.map((player, idx) => (
                          <tr
                            key={`${player.username}-${idx}`}
                            data-idx={idx}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className={`border-b border-white/[0.04] transition-all select-none ${
                              dragIdx === idx
                                ? 'bg-yellow-500/15 border-yellow-500/30 opacity-70'
                                : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            {/* Drag Handle (Touch & Desktop) */}
                            <td 
                              onTouchStart={(e) => handleTouchStart(idx, e)}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                              onTouchCancel={handleTouchEnd}
                              style={{ touchAction: 'none' }}
                              className="py-3.5 pl-2 pr-1 w-10 cursor-grab active:cursor-grabbing touch-none select-none text-center"
                            >
                              <div className="p-1 rounded-lg hover:bg-white/10 active:bg-yellow-500/20 inline-flex items-center justify-center transition-colors">
                                <GripVertical size={18} className="text-white/40 hover:text-white/80 active:text-yellow-400 transition-colors" />
                              </div>
                            </td>
                            {/* Rank */}
                            <td className="py-3.5 font-mono font-bold text-white/60 text-xs">
                              {player.rank < 10 ? `0${player.rank}` : player.rank}
                            </td>
                            {/* Username */}
                            <td className="py-3.5 pr-2">
                              <input
                                type="text"
                                value={player.username}
                                onChange={(e) => handlePlayerCellChange(idx, 'username', e.target.value)}
                                className="bg-black/20 hover:bg-black/40 focus:bg-black/60 border border-transparent hover:border-white/10 focus:border-white/20 text-white font-medium focus:outline-none rounded-lg px-2.5 py-1.5 text-sm w-full min-w-0 transition-all"
                              />
                            </td>
                            {/* Wagered */}
                            <td className="py-3.5 pr-2">
                              <input
                                type="text"
                                value={player.wagered}
                                onChange={(e) => handlePlayerCellChange(idx, 'wagered', e.target.value)}
                                className="bg-black/20 hover:bg-black/40 focus:bg-black/60 border border-transparent hover:border-white/10 focus:border-white/20 text-white font-mono font-bold focus:outline-none rounded-lg px-2.5 py-1.5 text-sm w-full min-w-0 transition-all"
                              />
                            </td>
                            {/* Prize (hidden on small screens) */}
                            <td className="py-3.5 pr-2 hidden sm:table-cell">
                              <input
                                type="text"
                                value={player.prize}
                                onChange={(e) => handlePlayerCellChange(idx, 'prize', e.target.value)}
                                className="bg-black/20 hover:bg-black/40 focus:bg-black/60 border border-transparent hover:border-white/10 focus:border-white/20 text-white font-mono font-bold focus:outline-none rounded-lg px-2.5 py-1.5 text-sm w-full min-w-0 transition-all"
                              />
                            </td>
                            {/* Actions: up/down + delete */}
                            <td className="py-3.5 pr-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleMovePlayer(idx, 'up')}
                                  disabled={idx === 0}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    idx === 0 ? 'text-white/10' : 'text-white/40 hover:text-white hover:bg-white/10'
                                  }`}
                                  title="Move Up"
                                >
                                  <ChevronUp size={15} />
                                </button>
                                <button
                                  onClick={() => handleMovePlayer(idx, 'down')}
                                  disabled={idx === players.length - 1}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    idx === players.length - 1 ? 'text-white/10' : 'text-white/40 hover:text-white hover:bg-white/10'
                                  }`}
                                  title="Move Down"
                                >
                                  <ChevronDown size={15} />
                                </button>
                                <button
                                  onClick={() => handleRemovePlayer(player.rank)}
                                  className="text-rose-400 hover:text-rose-300 transition-colors p-1.5 hover:bg-rose-500/15 rounded-lg cursor-pointer ml-1"
                                  title="Remove Player"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className="text-[11px] font-mono text-white/30 tracking-wide">Drag rows or use ↑↓ to reorder • Click cells to edit • Arrange to auto-sort</span>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleArrange}
                      className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                    >
                      <ArrowUpDown size={14} />
                      <span>Arrange</span>
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-widest px-6 py-3 uppercase rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                    >
                      <Save size={14} />
                      <span>Save Leaderboard</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
