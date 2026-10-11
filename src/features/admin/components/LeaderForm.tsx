import React from 'react';
import { Label } from '../../../components/elements/Label';
import { Input } from '../../../components/elements/Input';
import { Button } from '../../../components/elements/Button';
import { Loader2, PlusCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../utils';
import type { Leader } from '../../../types';

interface LeaderFormProps {
  leaderData: Omit<Leader, 'id'>;
  setLeaderData: (data: Omit<Leader, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editingId: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, folder: string, callback: (url: string) => void) => void;
}

export const LeaderForm: React.FC<LeaderFormProps> = ({
  leaderData,
  setLeaderData,
  onSubmit,
  submitting,
  editingId,
  onFileUpload,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="l-name" className="text-xs font-medium">Full Name <span className="text-red-500">*</span></Label>
        <Input id="l-name" required value={leaderData.name} onChange={e => setLeaderData({...leaderData, name: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="l-role" className="text-xs font-medium">Role / Title <span className="text-red-500">*</span></Label>
        <Input id="l-role" required value={leaderData.role} onChange={e => setLeaderData({...leaderData, role: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="l-order" className="text-xs font-medium">Display order <span className="text-red-500">*</span></Label>
        <Input id="l-order" type="number" value={leaderData.order} onChange={e => setLeaderData({...leaderData, order: parseInt(e.target.value) || 0})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Profile Image <span className="text-red-500">*</span></Label>
        <div className="flex items-center gap-3">
          <Input value={leaderData.image} onChange={e => setLeaderData({...leaderData, image: e.target.value})} placeholder="/pastor.jpg" className="h-10 text-xs flex-1" />
          <Label className="h-10 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors shrink-0">
            <ImageIcon size={16} className="text-slate-400" />
            <input type="file" className="hidden" accept="image/*" onChange={e => onFileUpload(e, 'leaders', (url) => setLeaderData({...leaderData, image: url}))} />
          </Label>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="l-bio" className="text-xs font-medium">Biography <span className="text-red-500">*</span></Label>
        <textarea id="l-bio" rows={4} required value={leaderData.bio} onChange={e => setLeaderData({...leaderData, bio: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Key Responsibilities / Focus Areas</Label>
        <div className="space-y-2">
          {leaderData.responsibilities.map((req, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input value={req} onChange={e => {
                const newReqs = [...leaderData.responsibilities];
                newReqs[idx] = e.target.value;
                setLeaderData({...leaderData, responsibilities: newReqs});
              }} className="h-8 text-[11px] flex-1" placeholder="e.g. Oversight of Youth Ministry" />
              <button type="button" onClick={() => setLeaderData({...leaderData, responsibilities: leaderData.responsibilities.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setLeaderData({...leaderData, responsibilities: [...leaderData.responsibilities, '']})} className="w-full h-8 text-[11px] border-dashed border-slate-300">
            <PlusCircle size={14} className="mr-1" /> Add Responsibility
          </Button>
        </div>
      </div>
      <Button type="submit" disabled={submitting} className={cn("w-full h-10 font-semibold rounded-xl", editingId && "bg-blue-500 hover:bg-blue-600")}>
        {submitting ? <Loader2 size={16} className="animate-spin" /> : (editingId ? 'Update Leader' : 'Create Leader')}
      </Button>
    </form>
  );
};
