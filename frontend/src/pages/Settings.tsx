import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { settingsAPI } from '../services/workspaceApi'

interface SettingsState {
  name: string
  email: string
  role: 'instructor' | 'admin'
  weeklyDigest: boolean
  classReminders: boolean
  compactMode: boolean
}

const defaultSettings: SettingsState = {
  name: 'Dev Admin',
  email: 'dev@local',
  role: 'admin',
  weeklyDigest: true,
  classReminders: true,
  compactMode: false,
}

const Settings = () => {
  const { user, updateUser } = useAuth()
  const [settings, setSettings] = useState<SettingsState>(() => {
    return {
      ...defaultSettings,
      name: user?.name || defaultSettings.name,
      email: user?.email || defaultSettings.email,
      role: user?.role || defaultSettings.role,
    }
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await settingsAPI.get()
        setSettings(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      }
    }

    loadSettings()
  }, [])

  const updateSetting = <Key extends keyof SettingsState>(key: Key, value: SettingsState[Key]) => {
    setSettings((currentSettings) => ({ ...currentSettings, [key]: value }))
    setSaved(false)
  }

  const saveSettings = async () => {
    try {
      const updatedSettings = await settingsAPI.update(settings)
      setSettings(updatedSettings)
      if (user) {
      updateUser({
        ...user,
          name: updatedSettings.name,
          email: updatedSettings.email,
      })
    }
      setSaved(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    }
  }

  return (
    <div className="p-6">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Manage profile details, notification preferences, and dashboard display options.
        </p>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Profile</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Name
              <input
                value={settings.name}
                onChange={(event) => updateSetting('name', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Email
              <input
                value={settings.email}
                onChange={(event) => updateSetting('email', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Role
              <select
                value={settings.role}
                disabled
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              >
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
          <div className="mt-6 space-y-4">
            {[
              ['weeklyDigest', 'Weekly digest', 'Receive a weekly course summary.'],
              ['classReminders', 'Class reminders', 'Get reminders before live classes.'],
              ['compactMode', 'Compact mode', 'Use denser dashboard spacing.'],
            ].map(([key, title, description]) => (
              <label key={key} className="flex items-start justify-between gap-4 rounded-3xl bg-slate-50 p-4">
                <span>
                  <span className="block font-semibold text-slate-900">{title}</span>
                  <span className="mt-1 block text-sm text-slate-500">{description}</span>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(settings[key as keyof SettingsState])}
                  onChange={(event) => updateSetting(key as keyof SettingsState, event.target.checked as never)}
                  className="mt-1 h-5 w-5 accent-orange-500"
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {error || (saved ? 'Settings saved.' : 'Changes update your account and preferences.')}
        </p>
        <button
          type="button"
          onClick={saveSettings}
          className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Save settings
        </button>
      </div>
    </div>
  )
}

export default Settings
