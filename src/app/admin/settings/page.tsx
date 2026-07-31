'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

interface SettingsState {
  [key: string]: string;
}

const settingFields = [
  { key: 'phone_number', label: 'Phone Number', placeholder: '+91-9876543210' },
  { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+91-9876543210' },
  { key: 'email', label: 'Email', placeholder: 'info@balaenterprise.com' },
  { key: 'address', label: 'Address', placeholder: 'Full address...' },
  { key: 'google_maps_url', label: 'Google Maps URL', placeholder: 'https://maps.google.com/...' },
  { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { key: 'tradeindia_url', label: 'TradeIndia Profile URL', placeholder: 'https://www.tradeindia.com/bala-enterprise-24235777/' },
  { key: 'indiamart_url', label: 'IndiaMART Profile URL', placeholder: 'https://www.indiamart.com/balaenterprises-gujarat/profile.html' },
  { key: 'google_site_verification', label: 'Google Site Verification Code', placeholder: 'google1a9235a9002fce74 or meta content value' },
  { key: 'bing_site_verification', label: 'Bing Site Verification Code', placeholder: 'msvalidate.01 content value' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

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

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation password do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Failed to change password.');
      }

      toast.success('Password changed successfully! Signing out...');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        signOut({ callbackUrl: '/admin/login' });
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
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

      <h2 className="font-heading text-2xl font-bold text-foreground mt-12 mb-6">
        Change Password
      </h2>

      <form onSubmit={handlePasswordChange} className="bg-card border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={changingPassword}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {changingPassword ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
