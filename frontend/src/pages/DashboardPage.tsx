import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbRouter } from '../services/databaseRouter';
import { storageManager } from '../services/storageManager';
import { ProductScan, UserMetrics } from '../types';
import { exportScanReportPDF } from '../utils/pdfGenerator';
import { GlassCard } from '../components/GlassCard';
import { 
  Doughnut, 
  Line 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  History, 
  Settings, 
  Search, 
  Trash2, 
  FileDown, 
  Star, 
  Bookmark, 
  Bell, 
  Key, 
  Mail, 
  Lock,
  ExternalLink
} from 'lucide-react';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardPage: React.FC = () => {
  const { user, preferences, updateUserPreferences, updateUserProfile } = useAuth();
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'console' | 'history' | 'settings'>('console');
  
  // States loaded from DB
  const [scans, setScans] = useState<ProductScan[]>([]);
  const [favorites, setFavorites] = useState<{ brand_name: string }[]>([]);
  const [bookmarks, setBookmarks] = useState<{ scan_id: string }[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'danger'>('all');
  const [dateFilter, setDateFilter] = useState('');

  // Settings
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || '');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.full_name || '');
      setSelectedAvatar(user.avatar_url || '');
    }
  }, [user]);

  const AVAILABLE_AVATARS = [
    { id: 'cyber', url: '/avatar_cyber.png', label: 'Cyber Agent' },
    { id: 'hacker', url: '/avatar_hacker.png', label: 'Neon Hacker' },
    { id: 'stealth', url: '/avatar_stealth.png', label: 'Stealth Operative' },
    { id: 'synth', url: '/avatar_synth.png', label: 'Synth Bot' }
  ];

  // Load dashboard data on mount / update
  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        await dbRouter.syncUserMetrics(user.id);
        let scanList = await dbRouter.getScans(user.id);
        const favs = await dbRouter.getFavorites(user.id);
        const marks = await dbRouter.getBookmarks(user.id);
        const userMetrics = await dbRouter.getUserMetrics(user.id);
        setScans(scanList);
        setFavorites(favs);
        setBookmarks(marks);
        setMetrics(userMetrics);
      }
    };
    loadDashboardData();
  }, [user, activeTab]);

  if (!user) return null;

  // Stats loaded from DB
  const totalScans = metrics?.total_scan_queries || 0;
  const counterfeitScans = metrics?.threat_alerts_triggered || 0;
  const averageRisk = metrics?.security_check_ratios || 0;
  const activeSubscription = metrics?.active_subscription || 'SHIELD FREE CORE';

  // Chart Data: Safe vs Counterfeit ratio
  const doughnutData = {
    labels: ['Average Safe Margin', 'Average Risk Score'],
    datasets: [{
      data: [100 - averageRisk, averageRisk],
      backgroundColor: ['rgba(51, 124, 255, 0.7)', 'rgba(239, 68, 68, 0.7)'],
      borderColor: ['#0043bd', '#b91c1c'],
      borderWidth: 1,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af', font: { family: 'Outfit', size: 10 } },
        position: 'bottom' as const
      }
    }
  };

  // Chart Data: Risk scores history (Up to last 15 scans)
  const chartScans = scans.slice(0, 15).reverse();
  const lineData = {
    labels: chartScans.map((s, idx) => s.brand_name.length > 10 ? s.brand_name.substring(0, 10) + '...' : s.brand_name),
    datasets: [{
      fill: true,
      label: 'Overall Risk Score',
      data: chartScans.map(s => s.overall_score),
      borderColor: '#337cff',
      backgroundColor: 'rgba(51, 124, 255, 0.1)',
      tension: 0.4
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#6b7280', font: { size: 9 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 9 } }
      }
    }
  };

  // Filters scan lists
  const filteredScans = scans.filter(scan => {
    const matchesBrand = scan.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scan.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scan.final_recommendation === statusFilter;
    const matchesDate = !dateFilter || scan.created_at.startsWith(dateFilter);
    return matchesBrand && matchesStatus && matchesDate;
  });

  const handleDeleteScan = async (id: string) => {
    const scanToDelete = scans.find(s => s.id === id);
    if (scanToDelete && scanToDelete.image_url) {
      await storageManager.deleteFile(scanToDelete.image_url);
    }
    
    await dbRouter.deleteScan(id);
    const updated = await dbRouter.getScans(user.id);
    setScans(updated);
    
    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'scan_record_deleted',
      details: `Purged scan entry ID ${id} from active records.`,
      ip_address: '127.0.0.1'
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(false);
    const success = await updateUserProfile(profileName, selectedAvatar || undefined);
    if (success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 select-none border-b border-border pb-6">
        <div>
          <span className="text-accent font-mono text-xs font-semibold tracking-widest uppercase">
            VERIFIED TERMINAL SESSION
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-1 tracking-tight">
            Welcome back, {user.full_name}
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">NODE IDENTIFIER: {user.email} (Role: {user.role})</p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex space-x-2 mt-4 md:mt-0 bg-card border border-border p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center transition ${
              activeTab === 'console' ? 'bg-accent text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            <Shield className="w-4 h-4 mr-1.5" />
            Console Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center transition ${
              activeTab === 'history' ? 'bg-accent text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4 mr-1.5" />
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition flex items-center ${
              activeTab === 'settings' ? 'bg-accent text-foreground shadow-[0_0_10px_rgba(0,67,189,0.3)]' : 'text-muted hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            Config
          </button>
        </div>
      </div>

      {/* Tab Content 1: Console Overview */}
      {activeTab === 'console' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <GlassCard hoverable={false} className="p-4 bg-card/50">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Total Scan Queries</span>
              <div className="text-2xl font-bold text-foreground font-mono mt-1">{totalScans}</div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-4 bg-card/50">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Threat Alerts Triggered</span>
              <div className="text-2xl font-bold text-red-500 font-mono mt-1">{counterfeitScans}</div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-4 bg-card/50">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Security Check Ratios</span>
              <div className="text-2xl font-bold text-accent font-mono mt-1">{averageRisk}% Avg Risk</div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-4 bg-card/50">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Active Subscriptions</span>
              <div className="text-sm font-bold text-foreground font-mono mt-2 flex items-center">
                {activeSubscription}
              </div>
            </GlassCard>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard hoverable={false} className="lg:col-span-1 p-5 h-64 flex flex-col justify-between select-none">
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-2">Scan Threat Ratio</h4>
              <div className="relative flex-grow h-40">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </GlassCard>

            <GlassCard hoverable={false} className="lg:col-span-2 p-5 h-64 flex flex-col justify-between select-none">
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-2">Risk Index Scans Trend</h4>
              <div className="relative flex-grow h-40">
                <Line data={lineData} options={lineOptions} />
              </div>
            </GlassCard>
          </div>

          {/* Favorites & Bookmarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard hoverable={false} className="p-5 select-none">
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-4 flex items-center">
                <Star className="w-4 h-4 text-accent fill-cyber-blue-500 mr-2" />
                Favorite Brands Registry ({favorites.length})
              </h4>
              {favorites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav, idx) => (
                    <span 
                      key={idx} 
                      onClick={() => { setSearchQuery(fav.brand_name); setActiveTab('history'); }}
                      className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg bg-accent/30 text-accent hover:bg-accent/40 border border-accent/30 transition flex items-center"
                    >
                      {fav.brand_name}
                      <ExternalLink className="w-3 h-3 ml-1.5 opacity-60" />
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted">No favorite brands indexed. Tap 'Fav Brand' on scan results to save.</p>
              )}
            </GlassCard>

            <GlassCard hoverable={false} className="p-5">
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-4 flex items-center select-none">
                <Bookmark className="w-4 h-4 text-accent fill-cyber-blue-500 mr-2" />
                Bookmarked Scans ({bookmarks.length})
              </h4>
              {bookmarks.length > 0 ? (
                <div className="divide-y divide-border max-h-[220px] overflow-y-auto pr-1">
                  {bookmarks.map((book) => {
                    const matchedScan = scans.find(s => s.id === book.scan_id);
                    if (!matchedScan) return null;
                    return (
                      <div key={book.scan_id} className="py-2.5 flex items-center justify-between">
                        <div className="truncate">
                          <span className="block text-xs font-semibold text-foreground truncate">{matchedScan.brand_name} - {matchedScan.product_name}</span>
                          <span className="text-[10px] text-muted font-mono">Risk Factor: {matchedScan.overall_score}%</span>
                        </div>
                        <button
                          onClick={() => exportScanReportPDF(matchedScan)}
                          className="px-2.5 py-1 bg-accent/40 hover:bg-accent/40 border border-accent/30 rounded text-[10px] text-accent transition"
                        >
                          PDF
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted select-none">No bookmarked products. Bookmark scanned items to display them here.</p>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab Content 2: Audit Logs (Scan History) */}
      {activeTab === 'history' && (
        <GlassCard hoverable={false} className="p-6">
          {/* Filters Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 select-none">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand or product..."
                className="w-full pl-9 pr-3 py-2 bg-cyber-dark-bg border border-border text-xs rounded-lg text-foreground"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-cyber-dark-bg border border-border text-xs rounded-lg p-2 text-foreground"
              >
                <option value="all">All Outcomes</option>
                <option value="safe">Safe / Verified</option>
                <option value="danger">Counterfeits Flagged</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-cyber-dark-bg border border-border text-xs rounded-lg p-1.5 text-foreground font-mono"
              />
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-muted font-mono uppercase tracking-widest bg-cyber-dark-bg/25 select-none">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Product Info</th>
                  <th className="py-3 px-4">Domain/Platform</th>
                  <th className="py-3 px-4">Price / Disc</th>
                  <th className="py-3 px-4 text-center">Risk Vector</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredScans.length > 0 ? (
                  filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-border/20 transition-all">
                      <td className="py-3 px-4 text-muted font-mono select-none">
                        {new Date(scan.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{scan.brand_name}</div>
                        <div className="text-[10px] text-muted max-w-[180px] truncate">{scan.product_name}</div>
                      </td>
                      <td className="py-3 px-4 text-muted truncate max-w-[140px] font-mono select-all">
                        {scan.platform_name}
                      </td>
                      <td className="py-3 px-4 text-muted font-mono select-none">
                        ₹{scan.price} <span className="text-[10px] text-red-500">({scan.discount_pct}% Off)</span>
                      </td>
                      <td className="py-3 px-4 text-center select-none">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase font-mono ${
                          scan.final_recommendation === 'danger' 
                            ? 'bg-red-950/50 text-red-400 border-red-900/30' 
                            : 'bg-accent text-accent border-accent/30'
                        }`}>
                          {scan.final_recommendation === 'danger' ? 'Suspicious' : 'Safe'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right select-none">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => exportScanReportPDF(scan)}
                            className="p-1 text-muted hover:text-accent rounded transition"
                            title="Export PDF Report"
                          >
                            <FileDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteScan(scan.id)}
                            className="p-1 text-muted hover:text-red-500 rounded transition"
                            title="Purge scan log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="select-none">
                    <td colSpan={6} className="py-8 text-center text-muted text-xs">
                      No security audit records match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab Content 3: Settings/Preferences */}
      {activeTab === 'settings' && preferences && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Form */}
          <GlassCard hoverable={false} className="md:col-span-2">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border">
              Edit Account Cryptographic Node
            </h3>

            {settingsSuccess && (
              <div className="p-3 mb-6 bg-green-950/30 border border-green-900/30 rounded-lg text-xs text-green-400 font-mono">
                ✔ Node parameters successfully updated.
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-3">Identity Avatar</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {AVAILABLE_AVATARS.map((avatar) => (
                    <div 
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={`cursor-pointer rounded-xl border-2 transition-all duration-300 p-2 flex flex-col items-center ${
                        selectedAvatar === avatar.url 
                          ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(0,67,189,0.3)]' 
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <img src={avatar.url} alt={avatar.label} className="w-16 h-16 rounded-full object-cover mb-2" />
                      <span className={`text-[10px] font-mono text-center ${selectedAvatar === avatar.url ? 'text-accent' : 'text-muted'}`}>
                        {avatar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Full Identity Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Secure Node Email (Immutable)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-gray-600 font-mono cursor-not-allowed select-all bg-cyber-dark-bg/50 border-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-accent text-foreground rounded-lg text-xs font-semibold uppercase tracking-wider transition"
              >
                Commit Parameter Modifications
              </button>
            </form>
          </GlassCard>

          {/* Notification Preferences */}
          <GlassCard hoverable={false} className="select-none">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border">
              Sync Preferences
            </h3>

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.email_notifications}
                  onChange={(e) => updateUserPreferences({ email_notifications: e.target.checked })}
                  className="rounded bg-cyber-dark-bg border-border text-accent focus:ring-cyber-blue-500 mt-1"
                />
                <div>
                  <span className="block text-xs font-semibold text-foreground">Email OTP Handshakes</span>
                  <span className="block text-[10px] text-muted mt-0.5 leading-relaxed">
                    Trigger SMTP verification link triggers during logins or reset actions.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.security_alerts}
                  onChange={(e) => updateUserPreferences({ security_alerts: e.target.checked })}
                  className="rounded bg-cyber-dark-bg border-border text-accent focus:ring-cyber-blue-500 mt-1"
                />
                <div>
                  <span className="block text-xs font-semibold text-foreground">Real-Time Threat Warnings</span>
                  <span className="block text-[10px] text-muted mt-0.5 leading-relaxed">
                    Flag alarms immediately if scanned domain lists are registered as counterfeit hubs.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weekly_digest}
                  onChange={(e) => updateUserPreferences({ weekly_digest: e.target.checked })}
                  className="rounded bg-cyber-dark-bg border-border text-accent focus:ring-cyber-blue-500 mt-1"
                />
                <div>
                  <span className="block text-xs font-semibold text-foreground">Weekly Intel Summaries</span>
                  <span className="block text-[10px] text-muted mt-0.5 leading-relaxed">
                    Receive weekly threat briefings summarizing deactivated luxury scam channels.
                  </span>
                </div>
              </label>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
