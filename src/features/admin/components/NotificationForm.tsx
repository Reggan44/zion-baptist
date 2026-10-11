import React from 'react';
import { Label } from '../../../components/elements/Label';
import { Input } from '../../../components/elements/Input';
import { Button } from '../../../components/elements/Button';
import { Loader2, Bell, Send } from 'lucide-react';
import type { BroadcastNotification } from '../../../types';

interface NotificationFormProps {
  notificationData: Omit<BroadcastNotification, 'id'>;
  setNotificationData: (data: Omit<BroadcastNotification, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  notificationData,
  setNotificationData,
  onSubmit,
  submitting,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex gap-3">
          <Bell className="text-amber-600 shrink-0" size={18} />
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            Broadcast messages are sent to all users who have subscribed to notifications via the website or app.
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="n-title" className="text-xs font-medium">Title <span className="text-red-500">*</span></Label>
        <Input id="n-title" required placeholder="Service Starting Soon!" value={notificationData.title} onChange={e => setNotificationData({...notificationData, title: e.target.value})} className="h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="n-body" className="text-xs font-medium">Message <span className="text-red-500">*</span></Label>
        <textarea id="n-body" rows={4} maxLength={200} placeholder="Join us today at 10 AM for a powerful word..." value={notificationData.body} onChange={e => setNotificationData({...notificationData, body: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <Button type="submit" disabled={submitting} className="w-full h-12 font-bold rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Broadcast Now</>}
      </Button>
    </form>
  );
};
