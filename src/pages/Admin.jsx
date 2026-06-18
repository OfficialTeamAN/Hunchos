import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, UserPlus, Trash2, LogOut, Check, Save, RotateCcw, AlertTriangle, FileText, Settings, Database, TrendingUp, Users } from 'lucide-react';
import { getJuneData, getMayData, saveJuneData, saveMayData, resetData, getWagerGoal, saveWagerGoal, getPrizePool, savePrizePool } from '../utils/dataStore';

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

  // Session check on mount
  useEffect(() => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state data with selected month tab / localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const data = activeTab === 'june' ? getJuneData() : getMayData();
      setPlayers(data);
      setWagerGoalInput(getWagerGoal().toString());
      setPrizePoolInput(getPrizePool(activeTab));
    }
  }, [isAuthenticated, activeTab]);

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

  // Save changes to localStorage
  const handleSaveChanges = () => {
    saveCurrentData(players);
    saveWagerGoal(parseInt(wagerGoalInput, 10) || 1000000);
    savePrizePool(activeTab, prizePoolInput);
    triggerStatusAlert('success');
  };

  const saveCurrentData = (data) => {
    let saved;
    if (activeTab === 'june') {
      saved = saveJuneData(data);
    } else {
      saved = saveMayData(data);
    }
    setPlayers(saved);
  };

  // Remove player
  const handleRemovePlayer = (rank) => {
    const updated = players.filter(p => p.rank !== rank);
    saveCurrentData(updated);
    triggerStatusAlert('success');
  };

  // Reset database back to default static mockups
  const handleResetData = () => {
    if (window.confirm('Reset leaderboard database to default static mockup values? Any edits will be lost.')) {
      resetData();
      const resetList = activeTab === 'june' ? getJuneData() : getMayData();
      setPlayers(resetList);
      setWagerGoalInput(getWagerGoal().toString());
      setPrizePoolInput(getPrizePool(activeTab));
      triggerStatusAlert('reset');
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
        <div className="relative z-10 max-w-sm mx-auto px-6 pt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0c0c0d]/90 border border-white/5 p-8 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Lock size={18} className="text-accent" />
              </div>
              <h2 className="text-2xl font-black font-display text-white uppercase tracking-tight">ADMIN GATEWAY</h2>
              <p className="text-[9px] font-bold text-white/30 tracking-widest uppercase mt-1">Hunchos Lead Terminal</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Enter Access Code</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••"
                  className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white tracking-widest placeholder-white/20 focus:outline-none focus:border-white/20 transition-all text-center"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-rose-500 text-[9px] font-bold tracking-wider uppercase bg-rose-500/5 border border-rose-500/10 px-3 py-2 rounded-lg">
                  <AlertTriangle size={10} className="shrink-0" />
                  <span>ACCESS DENIED. INVALID PASSWORD HASH.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-white hover:bg-white/95 text-black font-bold text-[10px] tracking-widest py-3.5 uppercase rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-tight">ADMIN CONTROL PANEL</h1>
              <p className="text-[9px] font-bold text-white/30 tracking-widest uppercase mt-1">Live database manager</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-white/5 hover:border-white text-[9px] font-bold tracking-widest uppercase transition-all bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <FileText size={12} className="text-white/55" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-rose-500/15 hover:border-rose-500 text-[9px] font-bold tracking-widest text-rose-500 transition-all bg-rose-500/5 hover:bg-rose-500/10 rounded-full cursor-pointer"
              >
                <LogOut size={12} />
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
              className={`flex items-center gap-3 border px-4 py-3 rounded-2xl text-[10px] font-bold tracking-widest uppercase max-w-sm ${
                saveStatus === 'success'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400'
              }`}
            >
              <Check size={14} className="shrink-0" />
              <span>{saveStatus === 'success' ? 'DATABASE UPDATED SUCCESSFULLY' : 'DATABASE RESET TO DEFAULT VALUES'}</span>
            </motion.div>
          )}

          {/* Metrics & Month Toggle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Config panel */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Selector tabs */}
              <div className="flex gap-1.5 bg-[#0a0a0b]/60 p-1 rounded-full border border-white/5 self-start w-full">
                {['june', 'may'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-grow py-2 text-[9px] font-bold tracking-widest uppercase transition-all rounded-full cursor-pointer text-center ${
                      activeTab === tab ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {tab === 'june' ? 'June 2026' : 'May 2026'}
                  </button>
                ))}
              </div>

              {/* Metrics cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0c0c0d]/80 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center">
                    <TrendingUp size={14} className="text-accent" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-bold text-white/30 uppercase tracking-wider">Total Volume</span>
                    <span className="text-xs font-mono font-bold text-white/80 mt-0.5">{metrics.totalWageredFormatted}</span>
                  </div>
                </div>

                <div className="bg-[#0c0c0d]/80 border border-white/5 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                    <Users size={14} className="text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-bold text-white/30 uppercase tracking-wider">Competitors</span>
                    <span className="text-xs font-mono font-bold text-white/80 mt-0.5">{metrics.count}</span>
                  </div>
                </div>
              </div>

              {/* Config settings */}
              <div className="bg-[#0c0c0d]/80 border border-white/5 p-6 rounded-3xl flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Settings size={14} className="text-white/40" />
                  <span className="text-[10px] font-bold tracking-widest text-white/55 uppercase">Target configurations</span>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Wager Goal */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Wager Goal (USD)</label>
                    <input
                      type="number"
                      value={wagerGoalInput}
                      onChange={(e) => setWagerGoalInput(e.target.value)}
                      placeholder="1000000"
                      className="bg-black/35 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-mono text-white tracking-wider focus:outline-none"
                    />
                  </div>

                  {/* Prize Pool */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Prize Pool Text</label>
                    <input
                      type="text"
                      value={prizePoolInput}
                      onChange={(e) => setPrizePoolInput(e.target.value)}
                      placeholder="$1,000"
                      className="bg-black/35 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white tracking-wide focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveChanges}
                    className="w-full mt-3 bg-white hover:bg-white/95 text-black font-bold text-[9px] tracking-widest py-3 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Save size={12} />
                    <span>Apply Settings</span>
                  </button>
                </div>
              </div>

              {/* Maintenance Tools */}
              <div className="bg-[#0c0c0d]/80 border border-white/5 p-6 rounded-3xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Database size={14} className="text-white/40" />
                  <span className="text-[10px] font-bold tracking-widest text-white/55 uppercase">Database tools</span>
                </div>

                <button
                  onClick={handleResetData}
                  className="w-full bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 text-rose-500 font-bold text-[9px] tracking-widest py-3 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Restore Mock Defaults</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Competitors list and forms */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Add Competitor Form */}
              <div className="bg-[#0c0c0d]/80 border border-white/5 p-6 rounded-3xl flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <UserPlus size={14} className="text-white/40" />
                  <span className="text-[10px] font-bold tracking-widest text-white/55 uppercase">Add New Competitor</span>
                </div>

                <form onSubmit={handleAddPlayer} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. StakeWinner"
                      className="bg-black/35 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Wager Amount</label>
                    <input
                      type="text"
                      required
                      value={newWager}
                      onChange={(e) => setNewWager(e.target.value)}
                      placeholder="e.g. $12.3K or $403.00"
                      className="bg-black/35 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Prize Amount</label>
                    <input
                      type="text"
                      value={newPrize}
                      onChange={(e) => setNewPrize(e.target.value)}
                      placeholder="e.g. $100 or leave empty"
                      className="bg-black/35 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="sm:col-span-3 bg-white hover:bg-white/95 text-black font-bold text-[9px] tracking-widest py-3.5 uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-md"
                  >
                    <UserPlus size={12} />
                    <span>Initialize Competitor</span>
                  </button>
                </form>
              </div>

              {/* Competitors List Manager */}
              <div className="bg-[#0c0c0d]/80 border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold tracking-widest text-white/55 uppercase">Competitor database ({players.length})</span>
                  <span className="text-[7.5px] font-mono font-bold text-white/20 tracking-wider">AUTO-RECALCULATES RANKINGS</span>
                </div>

                <div className="overflow-x-auto max-h-[460px] overflow-y-auto pr-1">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[8px] font-bold text-white/30 uppercase tracking-wider">
                        <th className="py-2.5 pl-2 w-16">Rank</th>
                        <th className="py-2.5 w-44">Competitor</th>
                        <th className="py-2.5 w-32">Wagered</th>
                        <th className="py-2.5 w-32">Prize</th>
                        <th className="py-2.5 pr-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[9px] text-white/25 uppercase font-bold tracking-widest">
                            No competitors in database
                          </td>
                        </tr>
                      ) : (
                        players.map((player, idx) => (
                          <tr key={player.rank} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                            <td className="py-3 pl-2 font-mono font-bold text-white/35">
                              {player.rank < 10 ? `0${player.rank}` : player.rank}
                            </td>
                            <td className="py-3 pr-2">
                              <input
                                type="text"
                                value={player.username}
                                onChange={(e) => handlePlayerCellChange(idx, 'username', e.target.value)}
                                className="bg-transparent border-none text-white focus:outline-none focus:bg-white/5 rounded px-2 py-1 text-xs w-full"
                              />
                            </td>
                            <td className="py-3 pr-2">
                              <input
                                type="text"
                                value={player.wagered}
                                onChange={(e) => handlePlayerCellChange(idx, 'wagered', e.target.value)}
                                className="bg-transparent border-none text-white font-mono focus:outline-none focus:bg-white/5 rounded px-2 py-1 text-xs w-full"
                              />
                            </td>
                            <td className="py-3 pr-2">
                              <input
                                type="text"
                                value={player.prize}
                                onChange={(e) => handlePlayerCellChange(idx, 'prize', e.target.value)}
                                className="bg-transparent border-none text-white font-mono focus:outline-none focus:bg-white/5 rounded px-2 py-1 text-xs w-full"
                              />
                            </td>
                            <td className="py-3 pr-2 text-right">
                              <button
                                onClick={() => handleRemovePlayer(player.rank)}
                                className="text-rose-500/60 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-500/5 rounded-lg cursor-pointer"
                                title="Remove Player"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                  <span className="text-[7.5px] font-mono text-white/20 uppercase">Click username, wagered, or prize cells to edit inline.</span>
                  
                  <button
                    onClick={handleSaveChanges}
                    className="bg-white hover:bg-white/95 text-black font-bold text-[9px] tracking-widest px-5 py-2.5 uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Save size={12} />
                    <span>Save Leaderboard</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
