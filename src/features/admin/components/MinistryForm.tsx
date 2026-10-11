import React from 'react';
import { Label } from '../../../components/elements/Label';
import { Input } from '../../../components/elements/Input';
import { Button } from '../../../components/elements/Button';
import { Loader2, ImageIcon, Trash2, Plus } from 'lucide-react';
import { cn } from '../../../utils';
import type { Ministry } from '../../../types';

interface MinistryFormProps {
  ministryData: Omit<Ministry, 'id'>;
  setMinistryData: React.Dispatch<React.SetStateAction<Omit<Ministry, 'id'>>>;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  editingId: string | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, folder: string, callback: (url: string) => void) => Promise<void>;
}

export function MinistryForm({
  ministryData,
  setMinistryData,
  onSubmit,
  submitting,
  editingId,
  handleFileUpload
}: MinistryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="m-name" className="text-xs font-medium">Ministry Name <span className="text-red-500">*</span></Label>
        <Input id="m-name" required value={ministryData.name} onChange={e => setMinistryData({...ministryData, name: e.target.value})} className="h-10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="m-icon" className="text-xs font-medium">Icon</Label>
          <select
            id="m-icon"
            className="w-full h-10 border border-border rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            value={ministryData.iconName}
            onChange={e => setMinistryData({...ministryData, iconName: e.target.value})}
          >
            <option value="BookOpen">Learning (BookOpen)</option>
            <option value="Users">Community (Users)</option>
            <option value="Heart">Care (Heart)</option>
            <option value="Music">Worship (Music)</option>
            <option value="Shield">Protection (Shield)</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-order" className="text-xs font-medium">Display order</Label>
          <Input id="m-order" type="number" value={ministryData.order} onChange={e => setMinistryData({...ministryData, order: parseInt(e.target.value) || 0})} className="h-10" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-style" className="text-xs font-medium">Theme Color</Label>
        <div className="flex gap-2">
          {[
            { bg: 'bg-brand-sage', text: 'text-brand-sage', label: 'Sage' },
            { bg: 'bg-brand-sky', text: 'text-brand-sky', label: 'Sky' },
            { bg: 'bg-rose-500', text: 'text-rose-500', label: 'Rose' },
            { bg: 'bg-brand-gold', text: 'text-brand-gold', label: 'Gold' },
            { bg: 'bg-brand-grey', text: 'text-brand-grey', label: 'Grey' },
          ].map(style => (
            <button
              key={style.bg}
              type="button"
              onClick={() => setMinistryData({...ministryData, color: style.bg, textColor: style.text})}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all",
                style.bg,
                ministryData.color === style.bg ? "border-primary scale-110 shadow-md" : "border-white"
              )}
              title={style.label}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="m-desc" className="text-xs font-medium">Description <span className="text-red-500">*</span></Label>
        <textarea id="m-desc" rows={3} required value={ministryData.description} onChange={e => setMinistryData({...ministryData, description: e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Main Image <span className="text-red-500">*</span></Label>
        <div className="flex items-center gap-3">
          <Input value={ministryData.image} onChange={e => setMinistryData({...ministryData, image: e.target.value})} placeholder="/image.jpg" className="h-10 text-xs" />
          <Label className="h-10 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors shrink-0">
            <ImageIcon size={16} className="text-slate-400" />
            <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'ministries', (url) => setMinistryData({...ministryData, image: url}))} />
          </Label>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Gallery Images</Label>
        <div className="space-y-2">
          {ministryData.gallery.map((img, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Input value={img} onChange={e => {
                const newGallery = [...ministryData.gallery];
                newGallery[idx] = e.target.value;
                setMinistryData({...ministryData, gallery: newGallery});
              }} className="h-8 text-[10px] flex-1" placeholder="/gallery-image.jpg" />
              <Label className="h-8 px-2 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors shrink-0">
                <ImageIcon size={14} className="text-slate-400" />
                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'ministries_gallery', (url) => {
                  const newGallery = [...ministryData.gallery];
                  newGallery[idx] = url;
                  setMinistryData({...ministryData, gallery: newGallery});
                })} />
              </Label>
              <button type="button" onClick={() => setMinistryData({...ministryData, gallery: ministryData.gallery.filter((_, i) => i !== idx)})} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
            </div>
          ))}
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={() => setMinistryData({...ministryData, gallery: [...ministryData.gallery, '']})}
            className="h-8 text-[10px] w-full border border-dashed border-border"
          >
            <Plus size={12} className="mr-1" /> Add Image
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={submitting} className={cn("w-full h-10 font-semibold rounded-xl", editingId && "bg-blue-500 hover:bg-blue-600")}>
        {submitting ? <Loader2 size={16} className="animate-spin" /> : (editingId ? 'Update Ministry' : 'Create Ministry')}
      </Button>
    </form>
  );
}
