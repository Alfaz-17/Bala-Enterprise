'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface SettingsState {
  [key: string]: string;
}

const settingFields = [
  { key: 'phone_number', label: 'Phone Number', placeholder: '+91-9876543210' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+91-9876543210' },
  { key: 'email', label: 'Email', placeholder: 'info@balaenterprise.com' },
  { key: 'address', label: 'Address', placeholder: 'Full address...' },
  { key: 'google_maps_url', label: 'Google Maps URL', placeholder: 'https://maps.google.com/...' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
  { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        setSettings(json.data || {});
        setLoading(false);
      });
  }, []);

  async function handleSave(key: string) {
    setSaving(key);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingKey: key, settingValue: settings[key] || '' }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to save setting');
      toast.success('Setting saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save setting');
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">
        Site Settings
      </h1>

      <div className="space-y-4">
        {settingFields.map((field) => (
          <div
            key={field.key}
            className="bg-card border border-border p-4"
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={settings[field.key] || ''}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="flex-1 px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving === field.key ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
