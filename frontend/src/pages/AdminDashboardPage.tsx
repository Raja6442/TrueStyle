import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbRouter } from '../services/databaseRouter';
import { mockDb } from '../services/mockDatabase';
import { Profile, OfficialBrand, TrustedSeller, SupportTicket, AuditLog } from '../types';
import { GlassCard } from '../components/GlassCard';
import { 
  ShieldAlert, 
  Users, 
  FolderLock, 
  Store, 
  MailWarning, 
  Terminal, 
  Plus, 
  Trash2, 
  Check, 
  UserPlus, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  // Admin Tabs
  const [adminTab, setAdminTab] = useState<'monitor' | 'users' | 'brands' | 'sellers' | 'tickets' | 'logs'>('monitor');
  
  // Data lists
  const [users, setUsers] = useState<Profile[]>([]);
  const [brands, setBrands] = useState<OfficialBrand[]>([]);
  const [sellers, setSellers] = useState<TrustedSeller[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Mutation states: Add Brand Form
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDomains, setNewBrandDomains] = useState('');
  const [newBrandCat, setNewBrandCat] = useState('Luxury');

  // Mutation states: Add Seller Form
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerPlatform, setNewSellerPlatform] = useState('');
  const [newSellerRating, setNewSellerRating] = useState(4.0);
  const [newSellerStatus, setNewSellerStatus] = useState<'trusted' | 'suspicious'>('trusted');

  // Load admin context
  const loadAdminData = async () => {
    const uList = await dbRouter.getProfiles();
    const bList = await dbRouter.getBrands();
    const sList = await dbRouter.getSellers();
    const tList = await dbRouter.getTickets();
    const lList = await dbRouter.getLogs();
    
    setUsers(uList);
    setBrands(bList);
    setSellers(sList);
    setTickets(tList);
    setLogs(lList);
  };

  useEffect(() => {
    loadAdminData();
  }, [adminTab]);

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-20 text-red-500 font-mono font-bold">ACCESS DENIED: INSUFFICIENT PERMISSIONS.</div>;
  }

  // Statistics
  const totalUsersCount = users.length;
  const adminUsersCount = users.filter(u => u.role === 'admin').length;
  const verifiedBrandsCount = brands.length;
  const trustedSellersCount = sellers.filter(s => s.status === 'trusted').length;
  const suspiciousSellersCount = sellers.filter(s => s.status === 'suspicious').length;
  const openTicketsCount = tickets.filter(t => t.status === 'open').length;

  // Handlers: User Role Promotion
  const toggleUserRole = async (targetUser: Profile) => {
    if (targetUser.id === user.id) {
      alert("Self-demotion is restricted to preserve root admin access.");
      return;
    }
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const updated = { ...targetUser, role: nextRole as 'user' | 'admin' };
    
    await dbRouter.saveProfile(updated);
    
    // Update credentials
    const credentials = JSON.parse(localStorage.getItem('truestyle_mock_creds') || '{}');
    if (credentials[targetUser.email.toLowerCase()]) {
      credentials[targetUser.email.toLowerCase()].profile = updated;
      localStorage.setItem('truestyle_mock_creds', JSON.stringify(credentials));
    }

    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'user_role_modification',
      details: `Modified role of ${targetUser.email} to ${nextRole.toUpperCase()}.`,
      ip_address: '192.168.1.1'
    });

    await loadAdminData();
  };

  // Handlers: Add Official Brand
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName || !newBrandDomains) return;

    const domainsArray = newBrandDomains.split(',').map(d => d.trim().toLowerCase());
    await dbRouter.addBrand({
      brand_name: newBrandName,
      official_domains: domainsArray,
      category: newBrandCat,
      status: 'verified'
    });

    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'brand_added',
      details: `Added official brand ${newBrandName} with domains: ${domainsArray.join(', ')}`,
      ip_address: '192.168.1.1'
    });

    setNewBrandName('');
    setNewBrandDomains('');
    await loadAdminData();
  };

  // Handlers: Delete Brand
  const handleDeleteBrand = async (id: string, name: string) => {
    await dbRouter.deleteBrand(id);
    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'brand_deleted',
      details: `Deleted official brand ${name} from registry.`,
      ip_address: '192.168.1.1'
    });
    await loadAdminData();
  };

  // Handlers: Add Seller
  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerName || !newSellerPlatform) return;

    await dbRouter.addSeller({
      seller_name: newSellerName,
      platform: newSellerPlatform,
      rating: newSellerRating,
      status: newSellerStatus
    });

    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'seller_added',
      details: `Added merchant "${newSellerName}" (${newSellerStatus}) on ${newSellerPlatform}`,
      ip_address: '192.168.1.1'
    });

    setNewSellerName('');
    setNewSellerPlatform('');
    await loadAdminData();
  };

  // Handlers: Delete Seller
  const handleDeleteSeller = async (id: string, name: string) => {
    await dbRouter.deleteSeller(id);
    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'seller_deleted',
      details: `Deleted seller ${name} from vendor database.`,
      ip_address: '192.168.1.1'
    });
    await loadAdminData();
  };

  // Handlers: Resolve ticket
  const handleResolveTicket = async (ticketId: string) => {
    await dbRouter.updateTicketStatus(ticketId, 'resolved');
    await dbRouter.addLog({
      actor_id: user.id,
      actor_name: user.full_name,
      action: 'ticket_resolved',
      details: `Resolved support ticket ID ${ticketId}.`,
      ip_address: '192.168.1.1'
    });
    await loadAdminData();
  };

  // Reset database seeds
  const handleResetDb = async () => {
    if (confirm("Reset local database to default seeds? This deletes mock scans and custom sellers.")) {
      mockDb.reset();
      await loadAdminData();
      alert("Database reset completed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 select-none border-b border-border pb-6">
        <div>
          <span className="text-red-500 font-mono text-xs font-semibold tracking-widest uppercase flex items-center">
            <ShieldAlert className="w-4 h-4 mr-1 text-red-500 animate-pulse" />
            ADMINISTRATOR PRIVILEGED CONSOLE
          </span>
          <h1 className="text-3xl font-bold text-foreground mt-1 tracking-tight">
            TrueStyle Operations Center
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">SECURE NODE HOST: {user.email} (Level: Root Admin)</p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 bg-card border border-border p-1 rounded-lg">
          {[
            { id: 'monitor', label: 'Monitor', icon: Terminal },
            { id: 'users', label: 'Nodes (Users)', icon: Users },
            { id: 'brands', label: 'Brands', icon: FolderLock },
            { id: 'sellers', label: 'Sellers', icon: Store },
            { id: 'tickets', label: 'Tickets', icon: MailWarning },
            { id: 'logs', label: 'Audit Logs', icon: Terminal },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center transition ${
                adminTab === tab.id ? 'bg-red-700 text-foreground shadow-neon-blue' : 'text-muted hover:text-foreground'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 mr-1.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content 1: Terminal Monitor Overview */}
      {adminTab === 'monitor' && (
        <div className="space-y-6">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
            <GlassCard hoverable={false} className="p-4 border-red-950/30">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Total Registry Users</span>
              <div className="text-2xl font-bold text-foreground font-mono mt-1">{totalUsersCount}</div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-4 border-red-950/30">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Official Brand Scans</span>
              <div className="text-2xl font-bold text-accent font-mono mt-1">{verifiedBrandsCount}</div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-4 border-red-950/30">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Trusted / Flags Merchants</span>
              <div className="text-2xl font-bold text-foreground font-mono mt-1">
                {trustedSellersCount} <span className="text-xs text-red-500">/ {suspiciousSellersCount}</span>
              </div>
            </GlassCard>

            <GlassCard hoverable={false} className="p-4 border-red-950/30">
              <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Pending Support Tickets</span>
              <div className="text-2xl font-bold text-red-500 font-mono mt-1">{openTicketsCount}</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
            {/* Quick Actions */}
            <GlassCard hoverable={false} className="p-5 md:col-span-1 border-red-950/20">
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-4">Security Recovery Keys</h4>
              <div className="space-y-3.5">
                <button
                  onClick={handleResetDb}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/30 text-xs font-semibold transition"
                >
                  <RotateCcw className="w-4 h-4 animate-spin-slow" />
                  <span>Reset Database Seeds</span>
                </button>
                <div className="p-3 bg-cyber-dark-bg border border-border rounded text-[10px] text-muted font-mono leading-relaxed">
                  Notice: resetting the database purges customized listings. System seeds for brands (Nike, Gucci) and test users will be reloaded.
                </div>
              </div>
            </GlassCard>

            {/* Quick Audit Snapshot */}
            <GlassCard hoverable={false} className="p-5 md:col-span-2 border-red-950/20">
              <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider mb-4 flex items-center">
                <Terminal className="w-4 h-4 mr-1 text-red-500" />
                Live Heuristics Terminal Log
              </h4>
              <div className="bg-[#050608] border border-border p-3.5 rounded-lg h-36 overflow-y-auto font-mono text-[9px] text-muted space-y-1.5 scrollbar-thin">
                {logs.slice(0, 5).map(log => (
                  <div key={log.id} className="truncate">
                    <span className="text-red-500">&gt;</span> <span className="text-muted">[{new Date(log.created_at).toLocaleTimeString()}]</span> <span className="font-semibold text-foreground">{log.actor_name}</span>: {log.action} - {log.details}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab Content 2: User / Node Directory */}
      {adminTab === 'users' && (
        <GlassCard hoverable={false} className="p-6">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border flex items-center">
            <Users className="w-4 h-4 mr-2 text-accent" />
            Registered Identity Nodes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-muted font-mono uppercase tracking-widest bg-cyber-dark-bg/25">
                  <th className="py-3 px-4">Node UUID</th>
                  <th className="py-3 px-4">Identity Name</th>
                  <th className="py-3 px-4">Secure Email</th>
                  <th className="py-3 px-4">Registry Date</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Authentication Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-border/20 transition-all">
                    <td className="py-3 px-4 font-mono text-[10px] text-muted select-all">{u.id}</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{u.full_name}</td>
                    <td className="py-3 px-4 font-mono text-muted select-all">{u.email}</td>
                    <td className="py-3 px-4 text-muted font-mono">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-red-950 text-red-400' : 'bg-accent text-accent'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleUserRole(u)}
                        className="px-2.5 py-1 bg-card hover:bg-border border border-border rounded text-[10px] text-muted hover:text-foreground transition"
                      >
                        {u.role === 'admin' ? 'Demote Admin' : 'Promote Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab Content 3: Brands Registry Manager */}
      {adminTab === 'brands' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Brand Form */}
          <GlassCard hoverable={false} className="lg:col-span-1">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border">
              Add Official Brand Domain
            </h3>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Brand Name</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Balenciaga"
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Authorized Domains (comma-separated)</label>
                <input
                  type="text"
                  value={newBrandDomains}
                  onChange={(e) => setNewBrandDomains(e.target.value)}
                  placeholder="e.g. balenciaga.com, balenciaga.cn"
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Category Type</label>
                <select
                  value={newBrandCat}
                  onChange={(e) => setNewBrandCat(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-lg text-xs text-foreground"
                >
                  <option value="Luxury">Luxury Fashion</option>
                  <option value="Sportswear">Sportswear / Athletics</option>
                  <option value="Streetwear">Streetwear / Hype</option>
                  <option value="Watches">Luxury Watches</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-accent hover:bg-accent text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue"
              >
                Insert Brand Registry
              </button>
            </form>
          </GlassCard>

          {/* Brands Registry List */}
          <GlassCard hoverable={false} className="lg:col-span-2">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border flex items-center select-none">
              <FolderLock className="w-4 h-4 mr-2 text-accent" />
              Official Brands & Domains Registry ({brands.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold text-muted font-mono uppercase tracking-widest bg-cyber-dark-bg/25">
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Domain List</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {brands.map(b => (
                    <tr key={b.id} className="hover:bg-border/20 transition-all">
                      <td className="py-3 px-4 font-semibold text-foreground">{b.brand_name}</td>
                      <td className="py-3 px-4 font-mono text-muted select-all">
                        {b.official_domains.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-muted font-mono">{b.category}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteBrand(b.id, b.brand_name)}
                          className="p-1 text-muted hover:text-red-500 rounded transition"
                          title="Purge brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Content 4: Trusted/Suspicious Sellers Ledger */}
      {adminTab === 'sellers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Seller Form */}
          <GlassCard hoverable={false} className="lg:col-span-1">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border">
              Add Merchant Profile
            </h3>
            <form onSubmit={handleAddSeller} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Merchant Store Name</label>
                <input
                  type="text"
                  value={newSellerName}
                  onChange={(e) => setNewSellerName(e.target.value)}
                  placeholder="e.g. Gucci Official Store"
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Host Platform</label>
                <input
                  type="text"
                  value={newSellerPlatform}
                  onChange={(e) => setNewSellerPlatform(e.target.value)}
                  placeholder="e.g. Amazon, eBay, Shopify"
                  className="w-full glass-input px-3.5 py-2.5 rounded-lg text-xs text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1">Status Type</label>
                <select
                  value={newSellerStatus}
                  onChange={(e) => setNewSellerStatus(e.target.value as any)}
                  className="w-full glass-input px-3 py-2 rounded-lg text-xs text-foreground"
                >
                  <option value="trusted">Trusted Vendor</option>
                  <option value="suspicious">Flagged / Suspicious Vendor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-accent hover:bg-accent text-foreground font-semibold text-xs tracking-wider uppercase transition shadow-neon-blue"
              >
                Commit Merchant Node
              </button>
            </form>
          </GlassCard>

          {/* Sellers Ledger List */}
          <GlassCard hoverable={false} className="lg:col-span-2">
            <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border flex items-center select-none">
              <Store className="w-4 h-4 mr-2 text-accent" />
              Global Vendor Trust Index ({sellers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold text-muted font-mono uppercase tracking-widest bg-cyber-dark-bg/25">
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Host Platform</th>
                    <th className="py-3 px-4">Security Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {sellers.map(s => (
                    <tr key={s.id} className="hover:bg-border/20 transition-all">
                      <td className="py-3 px-4 font-semibold text-foreground">{s.seller_name}</td>
                      <td className="py-3 px-4 text-muted font-mono select-all">{s.platform}</td>
                      <td className="py-3 px-4 font-mono select-none">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          s.status === 'trusted' 
                            ? 'bg-green-950/30 text-green-400 border-green-900/30' 
                            : 'bg-red-950/30 text-red-400 border-red-900/30'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right select-none">
                        <button
                          onClick={() => handleDeleteSeller(s.id, s.seller_name)}
                          className="p-1 text-muted hover:text-red-500 rounded transition"
                          title="Purge vendor record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab Content 5: Support Tickets Inbox */}
      {adminTab === 'tickets' && (
        <GlassCard hoverable={false} className="p-6">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border flex items-center select-none">
            <MailWarning className="w-4 h-4 mr-2 text-accent animate-bounce" />
            Moderator Ticket Inbox ({tickets.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-muted font-mono uppercase tracking-widest bg-cyber-dark-bg/25">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4">Sender Profile</th>
                  <th className="py-3 px-4">Security Status</th>
                  <th className="py-3 px-4 text-right">Commit Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-border/20 transition-all">
                    <td className="py-3 px-4 text-muted font-mono select-none">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 py-4 max-w-[280px]">
                      <div className="font-bold text-foreground leading-tight">{t.subject}</div>
                      <div className="text-[10px] text-muted mt-1 leading-relaxed whitespace-pre-wrap">{t.message}</div>
                    </td>
                    <td className="py-3 px-4 select-all">
                      <div className="font-semibold text-foreground">{t.name}</div>
                      <div className="text-[10px] text-muted font-mono mt-0.5">{t.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono select-none">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        t.status === 'open' 
                          ? 'bg-red-950/30 text-red-400 border-red-900/30 animate-pulse' 
                          : 'bg-green-950/30 text-green-400 border-green-900/30'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right select-none">
                      {t.status === 'open' ? (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="px-2.5 py-1 bg-accent/40 hover:bg-accent/40 border border-accent/30 rounded text-[10px] text-accent transition"
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="text-gray-600 text-[10px] font-mono">RESOLVED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab Content 6: Audit Logs */}
      {adminTab === 'logs' && (
        <GlassCard hoverable={false} className="p-6">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider mb-6 pb-2 border-b border-border flex items-center select-none">
            <Terminal className="w-4 h-4 mr-2 text-accent" />
            Security Audit Logs Ledger ({logs.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-bold text-muted font-mono uppercase tracking-widest bg-cyber-dark-bg/25">
                  <th className="py-3 px-4">Date/Time</th>
                  <th className="py-3 px-4">Actor Node</th>
                  <th className="py-3 px-4">Security Action</th>
                  <th className="py-3 px-4">Log Details</th>
                  <th className="py-3 px-4 text-right">Masked IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs font-mono">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-border/20 transition-all text-[11px] text-muted">
                    <td className="py-3 px-4 text-muted select-none">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground select-all">{log.actor_name}</td>
                    <td className="py-3 px-4 text-accent select-none uppercase text-[10px] font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-muted select-none">{log.details}</td>
                    <td className="py-3 px-4 text-right text-muted select-all">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
