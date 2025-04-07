"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import useStore from "@/store/useStore";
import { currentUser } from "@/mocks/users";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const storeSetTheme = useStore((state) => state.setTheme);
  
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    theme: theme as "light" | "dark" | "system",
    notifications: currentUser.settings.notifications,
  });

  useEffect(() => {
    // Simulate loading user settings
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
    storeSetTheme(newTheme);
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, notifications: enabled }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    alert("Settings saved successfully!");
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-2" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize your Levercast experience.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-8">
        {/* Theme settings */}
        <div>
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center ${
                settings.theme === "light"
                  ? "border-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
              onClick={() => handleThemeChange("light")}
            >
              <div className="w-12 h-12 bg-white border border-neutral-200 rounded-full mb-3"></div>
              <span className="text-sm font-medium">Light</span>
            </div>
            <div
              className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center ${
                settings.theme === "dark"
                  ? "border-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 rounded-full mb-3"></div>
              <span className="text-sm font-medium">Dark</span>
            </div>
            <div
              className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center ${
                settings.theme === "system"
                  ? "border-neutral-900 dark:border-white"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
              onClick={() => handleThemeChange("system")}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-white to-neutral-900 border border-neutral-200 rounded-full mb-3"></div>
              <span className="text-sm font-medium">System</span>
            </div>
          </div>
        </div>

        {/* Notification settings */}
        <div>
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div>
              <h3 className="font-medium mb-1">Email Notifications</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Receive updates about your published posts.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 dark:peer-focus:ring-neutral-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-neutral-900 dark:peer-checked:bg-white"></div>
            </label>
          </div>
        </div>

        {/* Account settings - simplified for prototype */}
        <div>
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <div className="space-y-4">
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <h3 className="font-medium mb-1">Email Address</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {currentUser.email}
              </p>
            </div>
            <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
              <h3 className="font-medium mb-1">Connected Accounts</h3>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-md">
                  LinkedIn
                </span>
                <span className="px-2 py-1 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300 text-xs rounded-md">
                  Twitter
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
} 