import React, { useState, useEffect, useMemo } from 'react';
import { CosmicParallaxBg } from './components/ui/parallax-cosmic-background';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { BlurFade } from './components/ui/blur-fade';
import { LeadDetailsModal } from './components/LeadDetailsModal';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  X,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  Filter,
  Lock,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';

interface Lead {
  _id: string;
  name: string;
  email: string;
  status: string;
  notes: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [newLead, setNewLead] = useState({ name: '', email: '', status: 'New' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notification, setNotification] = useState('');
  
  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    fetch('http://localhost:5000/api/leads')
      .then(response => response.json())
      .then(data => setLeads(data))
      .catch(error => console.error("Error fetching leads:", error));
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault(); 
    fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    })
    .then(response => response.json())
    .then((savedLead: Lead) => {
      setLeads([savedLead, ...leads]); 
      setNewLead({ name: '', email: '', status: 'New' }); 
      setIsModalOpen(false);
      showToast(`Successfully added ${savedLead.name}!`);
    })
    .catch(error => console.error("Error saving lead:", error));
  };

  const updateLead = async (id: string, data: { status?: string, notes?: string }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedLead = await response.json();
      setLeads(leads.map(l => l._id === id ? updatedLead : l));
      showToast("Intelligence Synchronized Successfully");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setShowLogin(false);
        showToast("Access Granted. Welcome, Admin.");
      } else {
        showToast(data.message || "Access Denied");
      }
    } catch (err) {
      showToast("Nexus Connection Failure");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    showToast("Logged out from Nexus Core");
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    contacted: leads.filter(l => l.status === 'Contacted').length,
    converted: leads.filter(l => l.status === 'Converted').length,
    rate: leads.length ? Math.round((leads.filter(l => l.status === 'Converted').length / leads.length) * 100) : 0
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      
      {/* 1. Hero Section: Cosmic Parallax */}
      <section className="relative h-screen">
        <CosmicParallaxBg 
          head="Nexus CRM" 
          text="Intelligent, Innovative, Integrated" 
          loop={true}
        />
        <div className="absolute top-10 right-10 z-50">
          {!isAuthenticated ? (
            <button 
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 glass-panel hover:bg-white/10 flex items-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" /> Admin Login
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="px-6 py-2 glass-panel hover:bg-red-500/20 text-red-400 border-red-500/20 flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer">
          <div className="text-sm font-light tracking-[0.2em] uppercase opacity-50">Explore System Core</div>
        </div>
      </section>

      {/* 2. Scroll Animation Section - Only show if authenticated or for demo */}
      <section className="bg-[#090A0F]">
        <ContainerScroll
          titleComponent={
            <BlurFade delay={0.2} inView>
              <h1 className="text-4xl md:text-7xl font-bold mb-8 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                Command Your Pipeline <br />
                <span className="text-purple-500">With Cosmic Precision</span>
              </h1>
            </BlurFade>
          }
        >
          <div className="p-8 h-full bg-zinc-900/50 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Leads', val: stats.total, icon: Users, color: 'text-white' },
                { label: 'New Opportunity', val: stats.new, icon: UserPlus, color: 'text-blue-400' },
                { label: 'In Contact', val: stats.contacted, icon: MessageSquare, color: 'text-yellow-400' },
                { label: 'Conversions', val: stats.converted, icon: CheckCircle2, color: 'text-green-400' },
              ].map((item, i) => (
                <div key={i} className="glass-panel p-6 flex flex-col items-center justify-center space-y-2 group transition-all duration-300 hover:scale-105 border-white/5">
                  <item.icon className={cn("w-8 h-8 mb-2", item.color)} />
                  <span className="text-xs uppercase tracking-widest opacity-30 font-bold">{item.label}</span>
                  <span className="text-4xl font-bold">{item.val}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 glass-panel border-purple-500/20 bg-purple-500/5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Efficiency Metric</h4>
                    <p className="text-zinc-500 text-sm italic">Overall conversion health of the Nexus ecosystem</p>
                  </div>
               </div>
               <div className="text-5xl font-black text-purple-500">{stats.rate}%</div>
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* 3. Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <BlurFade delay={0.1} inView>
              <h2 className="text-5xl font-bold tracking-tight mb-4">Lead Ecosystem</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">Manage and monitor your growth trajectory in real-time. Use the filters below to navigate the sectors of your pipeline.</p>
            </BlurFade>
          </div>
          <BlurFade delay={0.2} inView>
            <div className="flex gap-4">
               <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-500 flex items-center gap-2 group shadow-2xl shadow-purple-500/10"
              >
                <Plus className="group-hover:rotate-90 transition-transform duration-300" />
                Initialize Entry
              </button>
            </div>
          </BlurFade>
        </div>

        {/* Search & Filter Bar */}
        <BlurFade delay={0.2} inView>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search leads by identity or channel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="flex gap-2">
              {['All', 'New', 'Contacted', 'Converted'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-6 py-2 rounded-xl border text-sm font-bold transition-all",
                    statusFilter === status 
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20" 
                      : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Table Section */}
        <BlurFade delay={0.3} inView>
          <div className="glass-panel overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-[10px] opacity-30">Identity</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-[10px] opacity-30">Communication Channel</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-[10px] opacity-30">Status Sector</th>
                    <th className="px-8 py-6 font-bold uppercase tracking-widest text-[10px] opacity-30 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center text-zinc-700 italic font-medium">No signals detected in this sector...</td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, i) => (
                      <tr key={lead._id} className="group hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-white/10 flex items-center justify-center font-bold text-purple-400 group-hover:scale-110 transition-transform">
                              {lead.name.charAt(0)}
                            </div>
                            <span className="font-bold text-zinc-200 group-hover:text-purple-400 transition-colors">{lead.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">{lead.email}</td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            lead.status === 'New' && "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
                            lead.status === 'Contacted' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
                            lead.status === 'Converted' && "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                          )}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all text-zinc-600">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </BlurFade>
      </main>

      {/* Modal: Create Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <BlurFade delay={0} yOffset={20}>
            <div className="glass-panel w-full max-w-md p-10 relative overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl -z-10" />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-4xl font-black mb-2 tracking-tighter">Initialize Data</h2>
              <p className="text-zinc-500 mb-10 font-medium">Inject new client coordinates into the Nexus core.</p>
              
              <form onSubmit={handleAddLead} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-black ml-1">Identity Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-800"
                    placeholder="e.g. Victor Stone"
                    value={newLead.name}
                    onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-black ml-1">Comms Channel</label>
                  <input 
                    type="email" 
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all placeholder:text-zinc-800"
                    placeholder="vic@nexus.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black tracking-widest uppercase text-xs hover:opacity-90 transition-all shadow-xl shadow-purple-600/20"
                >
                  Confirm Injection
                </button>
              </form>
            </div>
          </BlurFade>
        </div>
      )}

      {/* Modal: Lead Details (Manage Status & Notes) */}
      {selectedLead && (
        <LeadDetailsModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={updateLead}
        />
      )}

      {/* Modal: Login */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <BlurFade delay={0} yOffset={20}>
            <div className="glass-panel w-full max-w-sm p-10 relative overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-500/5">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 blur-3xl -z-10 rounded-full" />
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-zinc-500" />
              </button>
              
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <Lock className="w-8 h-8 text-purple-400" />
              </div>
              
              <h2 className="text-3xl font-black mb-2 text-center tracking-tighter">Nexus Access</h2>
              <p className="text-zinc-500 mb-10 text-center font-medium">Provide authorization to unlock the core.</p>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <input 
                  type="email" 
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                  placeholder="Admin Identifier"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
                <input 
                  type="password" 
                  className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                  placeholder="Secret Key"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
                <button 
                  type="submit" 
                  className="w-full py-5 bg-white text-black rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-purple-500 hover:text-white transition-all"
                >
                  Authorize Entry
                </button>
              </form>
              <p className="mt-8 text-center text-[10px] text-zinc-700 font-bold tracking-widest uppercase">Admin: admin@nexus.com / Pass: admin123</p>
            </div>
          </BlurFade>
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="glass-panel px-8 py-5 border-purple-500/50 bg-purple-600/10 flex items-center gap-4 shadow-2xl shadow-purple-500/20">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <CheckCircle2 className="text-white w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight text-purple-100">{notification}</span>
          </div>
        </div>
      )}

      {/* Sidebar (Fixed Icons) */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-40 hidden xl:flex">
         <div className="p-4 glass-panel cursor-pointer hover:text-purple-400 hover:border-purple-500/30 transition-all group relative">
            <LayoutDashboard className="w-6 h-6" />
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Dashboard</div>
         </div>
         <div className="p-4 glass-panel cursor-pointer hover:text-purple-400 hover:border-purple-500/30 transition-all group relative">
            <Users className="w-6 h-6" />
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Leads</div>
         </div>
         <div className="p-4 glass-panel cursor-pointer hover:text-purple-400 hover:border-purple-500/30 transition-all group relative">
            <Bell className="w-6 h-6" />
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Alerts</div>
         </div>
         <div className="p-4 glass-panel cursor-pointer hover:text-purple-400 hover:border-purple-500/30 transition-all group relative">
            <Settings className="w-6 h-6" />
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Systems</div>
         </div>
      </div>

    </div>
  );
}

export default App;
