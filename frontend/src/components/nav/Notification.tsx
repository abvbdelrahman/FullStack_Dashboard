import { useEffect, useMemo, useState } from 'react'
import { notificationAPI, type NotificationItem } from '../../services/workspaceApi'

const Notification = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchNotifications = async () => {
      try {
        const data = await notificationAPI.getAll()
        if (mounted) setNotifications(data)
      } catch {
        if (mounted) setNotifications([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchNotifications()
    return () => {
      mounted = false
    }
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  const markAsRead = async (id: string) => {
    const current = notifications.find((notification) => notification.id === id)
    if (!current || current.read) return

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )

    try {
      await notificationAPI.update(id, { read: true })
    } catch {
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification,
        ),
      )
    }
  }

  const markAllAsRead = async () => {
    const previous = notifications
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, read: true })),
    )

    try {
      const nextNotifications = await notificationAPI.markAllRead()
      setNotifications(nextNotifications)
    } catch {
      setNotifications(previous)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-5 text-sm text-slate-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-5 text-sm text-slate-500">No notifications.</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                    notification.read ? 'bg-white' : 'bg-orange-50/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-slate-300' : 'bg-orange-500'}`} />
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-slate-900">{notification.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{notification.description}</span>
                      <span className="mt-2 block text-xs font-medium text-slate-400">{notification.time}</span>
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification
