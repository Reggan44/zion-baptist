import React from 'react';
import { Label } from '../../../components/elements/Label';
import { Input } from '../../../components/elements/Input';
import { Button } from '../../../components/elements/Button';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils';
import type { Sermon } from '../../../types';

interface SermonFormProps {
  sermonData: Omit<Sermon, 'id'>;
  setSermonData: (data: Omit<Sermon, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editingId: string | null;
}

export const SermonForm: React.FC<SermonFormProps> = ({
  sermonData,
  setSermonData,
  onSubmit,
  submitting,
  editingId,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="s-title" className="text-xs font-medium">Title <span className="text-red-500">*</span></Label>
        <Input id="s-title" required maxLength={200} value={sermonData.title} onChange={e => setSermonData({...sermonData, title: e.target.value})} className="h-10" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="s-date" className="text-xs font-medium">Date <span className="text-red-500">*</span></Label>
          <Input id="s-date" required type="date" value={sermonData.date} onChange={e => setSermonData({...sermonData, date: e.target.value})} className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="s-category" className="text-xs font-medium">Category</Label>
          <Input id="s-category" maxLength={100} value={sermonData.category} onChange={e => setSermonData({...sermonData, category: e.target.value})} className="h-10" placeholder="Sunday" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-url" className="text-xs font-medium">Video URL (https://) <span className="text-red-500">*</span></Label>
        <Input id="s-url" required type="url" placeholder="https://youtube.com/watch?v=" value={sermonData.videoUrl} onChange={e => setSermonData({...sermonData, videoUrl: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="s-desc" className="text-xs font-medium">Description</Label>
        <textarea id="s-desc" rows={3} maxLength={2000} value={sermonData.description} onChange={e => setSermonData({...sermonData, description: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
      </div>
      <Button type="submit" disabled={submitting} className={cn("w-full h-10 font-semibold rounded-xl", editingId && "bg-blue-500 hover:bg-blue-600")}>
        {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : (editingId ? 'Update' : 'Create')}
      </Button>
    </form>
  );
};
