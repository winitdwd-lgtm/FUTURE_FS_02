import React, { useState } from 'react';
import { X, Save, MessageSquare, Tag, Clock } from 'lucide-react';
import { BlurFade } from './ui/blur-fade';
import { cn } from '../lib/utils';

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

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, data: { status?: string, notes?: string }) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, onClose, onUpdate }) => {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdate(lead._id, { status, notes });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <BlurFade delay={0} yOffset={20}>
        <div className="glass-panel w-full max-w-2xl p-8 relative overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-3xl -z-10" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{lead.name}</h2>
              <p className="text-zinc-400">{lead.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Status Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-bold">
                <Tag className="w-4 h-4" /> Pipeline Sector
              </label>
              <div className="grid grid-cols-1 gap-2">
                {['New', 'Contacted', 'Converted'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "px-4 py-3 rounded-xl border transition-all text-left font-medium",
                      status === s 
                        ? "bg-purple-600/20 border-purple-500 text-purple-400 shadow-lg shadow-purple-500/10" 
                        : "bg-white/5 border-white/5 hover:border-white/20 text-zinc-400"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Section */}
            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Ingested</span>
                    <span className="text-zinc-300">{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Last Sync</span>
                    <span className="text-zinc-300">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Source</span>
                    <span className="text-zinc-300">{lead.source}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 mb-8">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-bold">
              <MessageSquare className="w-4 h-4" /> Follow-up Intel & Notes
            </label>
            <textarea
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none text-zinc-300 placeholder:text-zinc-700"
              placeholder="Add intelligence about follow-ups, client preferences, or meeting summaries..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isSaving ? "Syncing..." : <><Save className="w-5 h-5" /> Commit Changes to Nexus</>}
          </button>
        </div>
      </BlurFade>
    </div>
  );
};
