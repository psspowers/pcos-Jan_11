import React, { useState } from 'react';
import { getProfile, saveProfile, exportData, deleteAllData, UserProfile, getLogs } from '@/lib/storage';
import { useTheme } from '@/ui/theme-provider';
import { Shield, Download, Trash2, Bell, User, AlertTriangle, Info, FileText, Database, Moon, Sun, Laptop, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props { onDataDeleted: () => void; }

export const SettingsScreen: React.FC<Props> = ({ onDataDeleted }) => {
  const [profile, setProfile] = useState<UserProfile | null>(getProfile());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { theme, setTheme } = useTheme();
  const logs = getLogs();
  const navigate = useNavigate();

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pcos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleDelete = () => {
    deleteAllData();
    setShowDeleteConfirm(false);
    onDataDeleted();
  };

  const toggleReminder = () => {
    if (profile) {
      const updated = { ...profile, reminderEnabled: !profile.reminderEnabled };
      saveProfile(updated);
      setProfile(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-sage-800 dark:text-sage-200">Settings</h2>
        <p className="text-sage-500 dark:text-sage-400 text-sm">Manage your profile and data</p>
      </div>

      <div className="bg-gradient-to-r from-sage-100 to-peach-100 dark:from-sage-900 dark:to-peach-900 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-6 h-6 text-sage-600 dark:text-sage-300 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sage-800 dark:text-sage-200">Privacy First</h3>
          <p className="text-sm text-sage-600 dark:text-sage-300">All data stored locally on your device. No ads, no tracking, no cloud storage.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-sage-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <Moon className="w-5 h-5 text-sage-500 dark:text-sage-400" />
          <h3 className="font-semibold text-sage-800 dark:text-sage-200">Theme</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2 ${
              theme === 'light'
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900'
                : 'border-sage-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-gray-500'
            }`}
          >
            <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-sage-600 dark:text-sage-300' : 'text-sage-400'}`} />
            <span className={`text-xs font-medium ${theme === 'light' ? 'text-sage-800 dark:text-sage-200' : 'text-sage-600 dark:text-sage-400'}`}>
              Light
            </span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2 ${
              theme === 'dark'
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900'
                : 'border-sage-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-gray-500'
            }`}
          >
            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-sage-600 dark:text-sage-300' : 'text-sage-400'}`} />
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-sage-800 dark:text-sage-200' : 'text-sage-600 dark:text-sage-400'}`}>
              Dark
            </span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2 ${
              theme === 'system'
                ? 'border-sage-500 bg-sage-50 dark:bg-sage-900'
                : 'border-sage-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-gray-500'
            }`}
          >
            <Laptop className={`w-5 h-5 ${theme === 'system' ? 'text-sage-600 dark:text-sage-300' : 'text-sage-400'}`} />
            <span className={`text-xs font-medium ${theme === 'system' ? 'text-sage-800 dark:text-sage-200' : 'text-sage-600 dark:text-sage-400'}`}>
              System
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-sage-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <Database className="w-5 h-5 text-sage-500 dark:text-sage-400" />
          <h3 className="font-semibold text-sage-800 dark:text-sage-200">Your Data</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-sage-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-sage-800 dark:text-sage-200">{logs.length}</div>
            <div className="text-sage-500 dark:text-sage-400">Days logged</div>
          </div>
          <div className="bg-sage-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-sage-800 dark:text-sage-200">{(JSON.stringify({ profile, logs }).length / 1024).toFixed(1)}KB</div>
            <div className="text-sage-500 dark:text-sage-400">Data size</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/plant-preview')}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sage-100 to-peach-100 dark:from-sage-800 dark:to-peach-800 text-sage-700 dark:text-sage-200 rounded-xl hover:from-sage-200 hover:to-peach-200 dark:hover:from-sage-700 dark:hover:to-peach-700 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2"
      >
        <Sparkles className="w-5 h-5" />
        Preview Plant Growth Stages
      </button>

      {profile && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-sage-100 dark:border-gray-700 space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-sage-500 dark:text-sage-400" />
            <h3 className="font-semibold text-sage-800 dark:text-sage-200">Profile</h3>
          </div>
          <div className="grid gap-2 text-sm">
            {profile.age && <div className="flex justify-between py-2 border-b border-sage-100 dark:border-gray-700"><span className="text-sage-500 dark:text-sage-400">Age</span><span className="text-sage-700 dark:text-sage-300">{profile.age}</span></div>}
            {profile.diagnosisYear && <div className="flex justify-between py-2 border-b border-sage-100 dark:border-gray-700"><span className="text-sage-500 dark:text-sage-400">Diagnosis Year</span><span className="text-sage-700 dark:text-sage-300">{profile.diagnosisYear}</span></div>}
            <div className="flex justify-between py-2"><span className="text-sage-500 dark:text-sage-400">Primary Goal</span><span className="text-sage-700 dark:text-sage-300 capitalize">{profile.primaryGoal}</span></div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-sage-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-sage-500 dark:text-sage-400" />
            <div>
              <h3 className="font-semibold text-sage-800 dark:text-sage-200">Daily Reminder</h3>
              <p className="text-xs text-sage-500 dark:text-sage-400">Reminder to log symptoms</p>
            </div>
          </div>
          <button onClick={toggleReminder} className={`w-12 h-7 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2 ${profile?.reminderEnabled ? 'bg-sage-600 dark:bg-sage-500' : 'bg-sage-200 dark:bg-gray-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white dark:bg-gray-200 shadow transition-transform ${profile?.reminderEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-200 rounded-xl hover:bg-sage-200 dark:hover:bg-sage-700 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2">
          <Download className="w-5 h-5" />Export All Data
        </button>
        <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-offset-2">
          <Trash2 className="w-5 h-5" />Delete All Data
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>This app is a companion tool and not a substitute for professional medical advice. Always consult your healthcare provider.</p>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center text-sage-800 dark:text-sage-200 mb-2">Delete All Data?</h3>
            <p className="text-sage-600 dark:text-sage-300 text-center text-sm mb-6">This cannot be undone. All logs and profile data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-200 rounded-xl hover:bg-sage-200 dark:hover:bg-sage-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:focus-visible:ring-sage-400 focus-visible:ring-offset-2">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 dark:bg-red-600 text-white rounded-xl hover:bg-red-600 dark:hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
