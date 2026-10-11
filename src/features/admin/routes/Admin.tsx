import React, { useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { getSermons, addSermon, updateSermon, deleteSermon } from '../../sermons/api/getSermons';
import { getEvents, addEvent, updateEvent, deleteEvent } from '../../events/api/getEvents';
import { getBroadcastHistory, broadcastNotification } from '../../notifications/api/notifications';
import { getMinistries, addMinistry, updateMinistry, deleteMinistry } from '../../ministries/api/getMinistries';
import { getLeaders, addLeader, updateLeader, deleteLeader } from '../../leaders/api/getLeaders';
import { getContactMessages, deleteContactMessage, markMessageAsRead, type ContactMessage } from '../api/contact';
import { uploadImage } from '../../../lib/storage';
import type { Sermon, EventItem, BroadcastNotification, Ministry, Leader } from '../../../types';
import {
  Trash2, Edit2, X, Plus, Database, Calendar as CalendarIcon,
  Library, Heart, MapPin, LogOut, CheckCircle, AlertCircle, Loader2,
  Image as ImageIcon, FileText, Bell, Send, Upload, Tag, LayoutList,
  PlusCircle, MinusCircle, Users, MessageSquare
} from 'lucide-react';
import { Button } from '../../../components/elements/Button';
import { Input } from '../../../components/elements/Input';
import { Label } from '../../../components/elements/Label';
import { SermonForm } from '../components/SermonForm';
import { EventForm } from '../components/EventForm';
import { NotificationForm } from '../components/NotificationForm';
import { MinistryForm } from '../components/MinistryForm';
import { LeaderForm } from '../components/LeaderForm';
import { cn } from '../../../utils';
import {
  isNonEmpty, isValidUrl, isWithinMaxLength, sanitizeText
} from '../../../utils/validation';

// ─── Types ──────────────────────────────────────────────────────────────────

type TabKey = 'sermons' | 'events' | 'notifications' | 'ministries' | 'leaders' | 'messages';
type ToastType = 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

// ─── Toast Component ─────────────────────────────────────────────────────────

const ToastNotification = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-medium transition-all",
      toast.type === 'success'
        ? 'bg-green-50 text-green-800 border border-green-200'
        : 'bg-red-50 text-red-800 border border-red-200'
    )}
  >
    {toast.type === 'success'
      ? <CheckCircle size={18} className="text-green-600 shrink-0" aria-hidden="true" />
      : <AlertCircle size={18} className="text-red-500 shrink-0" aria-hidden="true" />
    }
    {toast.message}
    <button onClick={onDismiss} className="ml-2 text-current opacity-60 hover:opacity-100" aria-label="Dismiss notification">
      <X size={14} />
    </button>
  </div>
);

// ─── Validation ───────────────────────────────────────────────────────────────

const validateSermon = (data: Omit<Sermon, 'id'>): string | null => {
  if (!isNonEmpty(data.title)) return 'Title is required.';
  if (!isWithinMaxLength(data.title, 200)) return 'Title must be 200 characters or fewer.';
  if (!isNonEmpty(data.date)) return 'Date is required.';
  if (!isNonEmpty(data.videoUrl)) return 'Video URL is required.';
  if (!isValidUrl(data.videoUrl)) return 'Video URL must be a valid https:// URL.';
  if (!isWithinMaxLength(data.description, 2000)) return 'Description must be 2000 characters or fewer.';
  return null;
};

const validateEvent = (data: Omit<EventItem, 'id'>): string | null => {
  if (!isNonEmpty(data.title)) return 'Title is required.';
  if (!isWithinMaxLength(data.title, 200)) return 'Title must be 200 characters or fewer.';
  if (!isNonEmpty(data.date)) return 'Date is required.';
  if (!isNonEmpty(data.location)) return 'Location is required.';
  if (!isWithinMaxLength(data.description, 2000)) return 'Description must be 2000 characters or fewer.';
  return null;
};

const validateMinistry = (data: Omit<Ministry, 'id'>): string | null => {
  if (!isNonEmpty(data.name)) return 'Name is required.';
  if (!isWithinMaxLength(data.name, 100)) return 'Name must be 100 characters or fewer.';
  if (!isNonEmpty(data.description)) return 'Description is required.';
  if (!isWithinMaxLength(data.description, 1000)) return 'Description must be 1000 characters or fewer.';
  if (!isNonEmpty(data.image)) return 'Image URL is required.';
  return null;
};

const validateLeader = (data: Omit<Leader, 'id'>): string | null => {
  if (!isNonEmpty(data.name)) return 'Name is required.';
  if (!isNonEmpty(data.role)) return 'Role is required.';
  if (!isNonEmpty(data.bio)) return 'Bio is required.';
  if (!isNonEmpty(data.image)) return 'Profile image is required.';
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('sermons');
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [notifications, setNotifications] = useState<BroadcastNotification[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const initSermon: Omit<Sermon, 'id'> = { title: '', date: '', videoUrl: '', description: '', category: '' };
  const initEvent: Omit<EventItem, 'id'> = { title: '', date: '', location: '', description: '' };
  const initNotification: Omit<BroadcastNotification, 'id'> = { title: '', body: '', sentAt: '' };
  const initMinistry: Omit<Ministry, 'id'> = { 
    name: '', 
    description: '', 
    image: '', 
    gallery: [], 
    iconName: 'BookOpen', 
    color: 'bg-brand-sage', 
    textColor: 'text-brand-sage',
    order: 0
  };
  const initLeader: Omit<Leader, 'id'> = { name: '', role: '', bio: '', image: '', responsibilities: [], order: 0 };

  const [sermonData, setSermonData] = useState<Omit<Sermon, 'id'>>(initSermon);
  const [eventData, setEventData] = useState<Omit<EventItem, 'id'>>(initEvent);
  const [notificationData, setNotificationData] = useState<Omit<BroadcastNotification, 'id'>>(initNotification);
  const [ministryData, setMinistryData] = useState<Omit<Ministry, 'id'>>(initMinistry);
  const [leaderData, setLeaderData] = useState<Omit<Leader, 'id'>>(initLeader);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'sermons') setSermons(await getSermons());
      else if (activeTab === 'events') setEvents(await getEvents());
      else if (activeTab === 'notifications') setNotifications(await getBroadcastHistory());
      else if (activeTab === 'ministries') setMinistries(await getMinistries());
      else if (activeTab === 'leaders') setLeaders(await getLeaders());
      else if (activeTab === 'messages') setMessages(await getContactMessages());
    } catch (err: any) {
      console.error('Fetch failed:', err);
      showToast('Failed to load data. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
    cancelEdit();
  }, [activeTab]);

  const cancelEdit = () => {
    setEditingId(null);
    setFormError(null);
    setSermonData(initSermon);
    setEventData(initEvent);
    setNotificationData(initNotification);
    setMinistryData(initMinistry);
    setLeaderData(initLeader);
  };

  const startEdit = (item: any, type: TabKey) => {
    setEditingId(item.id ?? null);
    setFormError(null);
    if (type === 'sermons') {
      const s = item as Sermon;
      setSermonData({ title: s.title, date: s.date, videoUrl: s.videoUrl, description: s.description, category: s.category || '' });
    } else if (type === 'events') {
      const ev = item as EventItem;
      setEventData({ title: ev.title, date: ev.date, location: ev.location, description: ev.description });
    } else if (type === 'ministries') {
      const m = item as Ministry;
      setMinistryData({ 
        name: m.name, 
        description: m.description, 
        image: m.image, 
        gallery: m.gallery || [], 
        iconName: m.iconName, 
        color: m.color, 
        textColor: m.textColor,
        order: m.order || 0
      });
    } else if (type === 'leaders') {
      const l = item as Leader;
      setLeaderData({ name: l.name, role: l.role, bio: l.bio, image: l.image, responsibilities: l.responsibilities || [], order: l.order || 0 });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folder: string, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setFormError(null);
    try {
      const url = await uploadImage(file, folder);
      callback(url);
      showToast('Image uploaded successfully!', 'success');
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Generic submit with validation
  const handleSubmit = async (type: TabKey, e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (type === 'sermons') {
        const sanitized = { ...sermonData, title: sanitizeText(sermonData.title), description: sanitizeText(sermonData.description) };
        const err = validateSermon(sanitized);
        if (err) { setFormError(err); setSubmitting(false); return; }
        if (editingId) await updateSermon(editingId, sanitized);
        else await addSermon(sanitized);
      } else if (type === 'events') {
        const sanitized = { ...eventData, title: sanitizeText(eventData.title), description: sanitizeText(eventData.description), location: sanitizeText(eventData.location) };
        const err = validateEvent(sanitized);
        if (err) { setFormError(err); setSubmitting(false); return; }
        if (editingId) await updateEvent(editingId, sanitized);
        else await addEvent(sanitized);
      } else if (type === 'notifications') {
        if (!notificationData.title || !notificationData.body) { setFormError('Title and Body are required'); setSubmitting(false); return; }
        await broadcastNotification({ ...notificationData, sentAt: new Date().toISOString() });
      } else if (type === 'ministries') {
        const sanitized = { ...ministryData, name: sanitizeText(ministryData.name), description: sanitizeText(ministryData.description) };
        const err = validateMinistry(sanitized);
        if (err) { setFormError(err); setSubmitting(false); return; }
        if (editingId) await updateMinistry(editingId, sanitized);
        else await addMinistry(sanitized);
      } else if (type === 'leaders') {
        const sanitized = { ...leaderData, name: sanitizeText(leaderData.name), role: sanitizeText(leaderData.role), bio: sanitizeText(leaderData.bio) };
        const err = validateLeader(sanitized);
        if (err) { setFormError(err); setSubmitting(false); return; }
        if (editingId) await updateLeader(editingId, sanitized);
        else await addLeader(sanitized);
      }

      cancelEdit();
      await fetchData();
      showToast(`${editingId ? 'Updated' : 'Sent/Created'} successfully!`, 'success');
    } catch (err: any) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, type: TabKey, name: string) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      if (type === 'sermons') await deleteSermon(id);
      else if (type === 'events') await deleteEvent(id);
      else if (type === 'ministries') await deleteMinistry(id);
      else if (type === 'leaders') await deleteLeader(id);
      else if (type === 'messages') await deleteContactMessage(id);
      
      if (editingId === id) cancelEdit();
      await fetchData();
      showToast('Deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete. Please try again.', 'error');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const repairAndSyncMinistries = async () => {
    if (!window.confirm('Sync & Repair ministries? This will add missing items and update existing ones to match official branding (colors, icons, galleries).')) return;
    setLoading(true);
    try {
      const { ministrySeedData } = await import('../../../data/ministries-seed');
      const current = await getMinistries();
      
      let createdCount = 0;
      let updatedCount = 0;

      for (const seedItem of ministrySeedData) {
        const normalizedSeedName = seedItem.name.toLowerCase().trim();
        const existing = current.find(m => m.name.toLowerCase().trim() === normalizedSeedName);

        if (existing) {
          // Check if update is needed (compare key fields)
          const needsUpdate = 
            existing.iconName !== seedItem.iconName || 
            existing.color !== seedItem.color || 
            existing.image !== seedItem.image ||
            (seedItem.gallery && JSON.stringify(existing.gallery) !== JSON.stringify(seedItem.gallery));

          if (needsUpdate) {
            await updateMinistry(existing.id!, {
              iconName: seedItem.iconName,
              color: seedItem.color,
              textColor: seedItem.textColor,
              image: seedItem.image,
              gallery: seedItem.gallery || [],
              description: seedItem.description // Also sync description in case it changed
            });
            updatedCount++;
          }
        } else {
          // Create new
          await addMinistry({
            name: seedItem.name.trim(),
            description: seedItem.description,
            image: seedItem.image,
            gallery: seedItem.gallery || [],
            iconName: seedItem.iconName,
            color: seedItem.color,
            textColor: seedItem.textColor,
            order: (createdCount + current.length) * 10
          });
          createdCount++;
        }
      }
      
      await fetchData();
      const message = [
        createdCount > 0 ? `Created ${createdCount}` : null,
        updatedCount > 0 ? `Repaired/Updated ${updatedCount}` : null,
        (createdCount === 0 && updatedCount === 0) ? 'All ministries already match official records.' : null
      ].filter(Boolean).join(' and ') || 'Sync complete.';
      
      showToast(message, 'success');
    } catch (err: any) {
      console.error('Repair/Sync failed:', err);
      showToast('Repair/Sync failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const repairAndSyncLeaders = async () => {
    if (!window.confirm('Sync & Repair leaders? This will restore missing pastors and update existing ones from the official seed data.')) return;
    setLoading(true);
    try {
      const { leaderSeedData } = await import('../../../data/ministries-seed');
      const current = await getLeaders();
      
      let createdCount = 0;
      let updatedCount = 0;

      for (const seedItem of leaderSeedData) {
        const leaderItem = seedItem as Leader;
        const normalizedSeedName = leaderItem.name.toLowerCase().trim();
        const existing = current.find(l => l.name.toLowerCase().trim() === normalizedSeedName);

        if (existing) {
          // Update existing
          await updateLeader(existing.id!, {
            role: leaderItem.role,
            bio: leaderItem.bio,
            image: leaderItem.image,
            responsibilities: leaderItem.responsibilities || [],
            order: leaderItem.order || 0
          });
          updatedCount++;
        } else {
          // Create new
          await addLeader({
            ...seedItem,
            responsibilities: seedItem.responsibilities || [],
            order: seedItem.order || 0
          });
          createdCount++;
        }
      }
      
      await fetchData();
      const message = [
        createdCount > 0 ? `Created ${createdCount}` : null,
        updatedCount > 0 ? `Repaired/Updated ${updatedCount}` : null,
        (createdCount === 0 && updatedCount === 0) ? 'All leaders already match official records.' : null
      ].filter(Boolean).join(' and ') || 'Sync complete.';
      
      showToast(message, 'success');
    } catch (err: any) {
      console.error('Repair/Sync failed:', err);
      showToast('Repair/Sync failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabConfig = [
    { key: 'sermons' as const, icon: <Library size={16} aria-hidden="true" />, label: 'Sermons' },
    { key: 'ministries' as const, icon: <LayoutList size={16} aria-hidden="true" />, label: 'Ministries' },
    { key: 'events' as const, icon: <CalendarIcon size={16} aria-hidden="true" />, label: 'Events' },
    { key: 'notifications' as const, icon: <Bell size={16} aria-hidden="true" />, label: 'Broadcast' },
    { key: 'leaders' as const, icon: <Users size={16} aria-hidden="true" />, label: 'Pastors/Leaders' },
    { key: 'messages' as const, icon: <MessageSquare size={16} aria-hidden="true" />, label: 'Messages' },
  ];

  return (
    <div className="pt-52 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      {toast && <ToastNotification toast={toast} onDismiss={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database size={20} className="text-primary" aria-hidden="true" />
            CMS <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sermons, events, and communications</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-border shadow-sm" role="tablist" aria-label="Content sections">
            {tabConfig.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="flex items-center gap-2">
            {activeTab === 'ministries' && (
              <Button
                variant="outline"
                onClick={repairAndSyncMinistries}
                disabled={loading && ministries.length === 0}
                className={cn(
                  "flex items-center gap-2 h-10 rounded-xl text-sm border-brand-sage/20 text-brand-sage hover:bg-brand-sage/5",
                  (loading && ministries.length === 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Database size={15} aria-hidden="true" />}
                Repair & Sync
              </Button>
            )}
            {activeTab === 'leaders' && (
              <Button
                variant="outline"
                onClick={repairAndSyncLeaders}
                disabled={loading && leaders.length === 0}
                className={cn(
                  "flex items-center gap-2 h-10 rounded-xl text-sm border-brand-sage/20 text-brand-sage hover:bg-brand-sage/5",
                  (loading && leaders.length === 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Database size={15} aria-hidden="true" />}
                Repair & Sync
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2 h-10 rounded-xl text-sm border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut size={15} aria-hidden="true" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        {activeTab !== 'messages' && (
          <div className="lg:col-span-4">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card sticky top-44">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", editingId ? "bg-blue-50 text-blue-500" : "bg-primary/10 text-primary")}>
                  {editingId ? <Edit2 size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                </div>
                {editingId ? `Edit ${activeTab.slice(0, -1)}` : `New ${activeTab.slice(0, -1)}`}
              </h2>
              {editingId && (
                <Button variant="ghost" size="icon" onClick={cancelEdit} className="h-8 w-8 rounded-lg" aria-label="Cancel editing">
                  <X size={14} />
                </Button>
              )}
            </div>

            {formError && (
              <div role="alert" className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-4 text-xs">
                <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
                {formError}
              </div>
            )}

            {/* Sermons Form */}
            {activeTab === 'sermons' && (
              <SermonForm
                sermonData={sermonData}
                setSermonData={setSermonData}
                onSubmit={(e) => handleSubmit('sermons', e)}
                submitting={submitting}
                editingId={editingId}
              />
            )}

            {/* Events Form */}
            {activeTab === 'events' && (
              <EventForm
                eventData={eventData}
                setEventData={setEventData}
                onSubmit={(e) => handleSubmit('events', e)}
                submitting={submitting}
                editingId={editingId}
              />
            )}

            {/* Notifications Form */}
            {activeTab === 'notifications' && (
              <NotificationForm
                notificationData={notificationData}
                setNotificationData={setNotificationData}
                onSubmit={(e) => handleSubmit('notifications', e)}
                submitting={submitting}
              />
            )}

            {/* Ministries Form */}
            {activeTab === 'ministries' && (
              <MinistryForm
                ministryData={ministryData}
                setMinistryData={setMinistryData}
                onSubmit={(e) => handleSubmit('ministries', e)}
                submitting={submitting}
                editingId={editingId}
                onFileUpload={handleFileUpload}
              />
            )}

            {/* Leaders Form */}
            {activeTab === 'leaders' && (
              <LeaderForm
                leaderData={leaderData}
                setLeaderData={setLeaderData}
                onSubmit={(e) => handleSubmit('leaders', e)}
                submitting={submitting}
                editingId={editingId}
                onFileUpload={handleFileUpload}
              />
            )}
          </div>
        </div>
        )}

        {/* Items List */}
        <div className={cn("lg:col-span-8", activeTab === 'messages' && "lg:col-span-12")}>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-48 bg-white border border-border rounded-2xl">
              <Loader2 className="animate-spin text-primary mb-3" size={28} aria-label="Loading" />
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTab === 'sermons' && sermons.map(sermon => (
                <ItemCard
                  key={sermon.id}
                  title={sermon.title}
                  subtitle={sermon.date}
                  badge={sermon.category}
                  onEdit={() => startEdit(sermon, 'sermons')}
                  onDelete={() => handleDelete(sermon.id!, 'sermons', sermon.title)}
                  isEditing={editingId === sermon.id}
                />
              ))}
              {activeTab === 'events' && events.map(event => (
                <ItemCard
                  key={event.id}
                  title={event.title}
                  subtitle={event.date}
                  badge={event.location}
                  onEdit={() => startEdit(event, 'events')}
                  onDelete={() => handleDelete(event.id!, 'events', event.title)}
                  isEditing={editingId === event.id}
                />
              ))}
              {activeTab === 'notifications' && notifications.map(n => (
                <div key={n.id} className="bg-white border border-border rounded-2xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Bell size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-slate-800">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                        {new Date(n.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              ))}
              {activeTab === 'ministries' && ministries.map(m => (
                <ItemCard
                  key={m.id}
                  title={m.name}
                  subtitle={m.description.slice(0, 60) + '...'}
                  badge={m.iconName}
                  onEdit={() => startEdit(m, 'ministries')}
                  onDelete={() => handleDelete(m.id!, 'ministries', m.name)}
                  isEditing={editingId === m.id}
                />
              ))}
              {activeTab === 'leaders' && leaders.map(l => (
                <ItemCard
                  key={l.id}
                  title={l.name}
                  subtitle={l.role}
                  onEdit={() => startEdit(l, 'leaders')}
                  onDelete={() => handleDelete(l.id!, 'leaders', l.name)}
                  isEditing={editingId === l.id}
                />
              ))}
              {activeTab === 'messages' && messages.map(msg => (
                <div key={msg.id} className={cn(
                  "bg-white border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden",
                  !msg.read ? "border-brand-sage/30 bg-brand-sage/[0.02]" : "border-border"
                )}>
                  {!msg.read && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-sage text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                      New Message
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Users size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-brand-grey tracking-tight">{msg.name}</h4>
                          <p className="text-xs text-brand-sage font-bold">{msg.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider">Subject</span>
                          <span className="text-sm font-bold text-slate-700">{msg.subject || '(No Subject)'}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                          "{msg.message}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <CalendarIcon size={12} /> {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Just now'}
                        </span>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          const subject = encodeURIComponent(`RE: ${msg.subject || 'Inquiry'} - Zion Baptist Church`);
                          window.location.href = `mailto:${msg.email}?subject=${subject}`;
                        }}
                        className="rounded-xl h-10 px-4 bg-brand-sage text-brand-grey font-bold text-xs gap-2"
                      >
                        <Send size={14} /> Reply
                      </Button>
                      {!msg.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            markMessageAsRead(msg.id);
                            fetchData();
                          }}
                          className="rounded-xl h-10 px-4 border-brand-sage/20 text-brand-sage font-bold text-xs gap-2 hover:bg-brand-sage/5"
                        >
                          <CheckCircle size={14} /> Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(msg.id, 'messages', `Message from ${msg.name}`)}
                        className="rounded-xl h-10 px-4 text-red-400 hover:text-red-500 hover:bg-red-50 font-bold text-xs gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {activeTab === 'sermons' && sermons.length === 0 && <EmptyState label="sermons" />}
              {activeTab === 'events' && events.length === 0 && <EmptyState label="events" />}
              {activeTab === 'notifications' && notifications.length === 0 && <EmptyState label="broadcast message history" />}
              {activeTab === 'ministries' && ministries.length === 0 && <EmptyState label="ministries" />}
              {activeTab === 'leaders' && leaders.length === 0 && <EmptyState label="leaders" />}
              {activeTab === 'messages' && messages.length === 0 && <EmptyState label="messages" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ItemCard = ({
  title, subtitle, badge, onEdit, onDelete, isEditing
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
}) => (
  <div className={cn(
    "bg-white border rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-200",
    isEditing ? "border-primary shadow-card" : "border-border hover:shadow-sm"
  )}>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap mb-0.5">
        <h3 className="font-semibold text-foreground text-sm truncate">{title}</h3>
        {badge && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full whitespace-nowrap">{badge}</span>}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        aria-label={`Edit ${title}`}
        className={cn("h-8 w-8 rounded-xl", isEditing && "bg-primary/10 text-primary")}
      >
        <Edit2 size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        aria-label={`Delete ${title}`}
        className="h-8 w-8 rounded-xl text-red-500 hover:bg-red-50"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  </div>
);

const EmptyState = ({ label }: { label: string }) => (
  <div className="text-center py-16 bg-white border border-dashed border-border rounded-2xl">
    <p className="text-muted-foreground font-medium">No {label} yet</p>
    <p className="text-xs text-muted-foreground mt-1">Use the form on the left to add your first {label.slice(0, -1)}.</p>
  </div>
);

export default Admin;
