import React from 'react';
import { Label } from '../../../components/elements/Label';
import { Input } from '../../../components/elements/Input';
import { Button } from '../../../components/elements/Button';
import { Loader2, MapPin } from 'lucide-react';
import { cn } from '../../../utils';
import type { EventItem } from '../../../types';

interface EventFormProps {
  eventData: Omit<EventItem, 'id'>;
  setEventData: React.Dispatch<React.SetStateAction<Omit<EventItem, 'id'>>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editingId: string | null;
}

export function EventForm({
  eventData,
  setEventData,
  onSubmit,
  submitting,
  editingId
}: EventFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="e-title" className="text-xs font-medium">Title <span className="text-red-500">*</span></Label>
        <Input id="e-title" required maxLength={200} value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="e-date" className="text-xs font-medium">Date & Time <span className="text-red-500">*</span></Label>
        <Input id="e-date" required type="datetime-local" value={eventData.date} onChange={e => setEventData({...eventData, date: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="e-location" className="text-xs font-medium flex items-center gap-1">
          <MapPin size={12} aria-hidden="true" /> Location <span className="text-red-500">*</span>
        </Label>
        <Input id="e-location" required maxLength={500} value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="e-desc" className="text-xs font-medium">Description</Label>
        <textarea id="e-desc" rows={3} maxLength={2000} value={eventData.description} onChange={e => setEventData({...eventData, description: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
      </div>
      <Button type="submit" disabled={submitting} className={cn("w-full h-10 font-semibold rounded-xl", editingId && "bg-blue-500 hover:bg-blue-600")}>
        {submitting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : (editingId ? 'Update' : 'Create')}
      </Button>
    </form>
  );
}
