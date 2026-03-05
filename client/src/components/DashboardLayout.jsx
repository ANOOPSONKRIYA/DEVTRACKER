import { useMemo, useState } from 'react'

const sections = [
  { label: 'Overview', detail: 'Summary and activity', active: true },
  { label: 'Daily Logs', detail: 'Track study consistency', active: false },
  { label: 'DSA Tracker', detail: 'Problems and status', active: false },
  { label: 'Projects', detail: 'Portfolio progress', active: false },
  { label: 'Analytics', detail: 'Performance insights', active: false }
]

export default function DashboardLayout({ user, onLogout, pageTitle, pageSubtitle, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const userInitial = (user?.name || 'D').trim().charAt(0).toUpperCase()
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
    []
  )

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#303030] bg-[#1c1c1c]/95 shadow-2xl shadow-black/35">
      {isMobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-black/55 md:hidden"
          aria-label="Close sidebar"
          onClick={closeMobileMenu}
        />
      ) : null}

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside
          className={[
            'fixed inset-y-0 left-0 z-20 w-72 border-r border-[#2a2a2a] bg-[#171717]/95 p-5 transition-transform md:static md:w-[18rem] md:translate-x-0',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          ].join(' ')}
        >
          <div className="rounded-xl border border-[#2c2c2c] bg-[#1f1f1f] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10a37f]">DevTrackr</p>
            <h1 className="mt-2 text-base font-semibold text-[#ececec]">Productivity Dashboard</h1>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#2c2c2c] bg-[#1b1b1b] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10a37f]/20 text-sm font-semibold text-[#85f0d8]">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#ececec]">{user?.name || 'Developer'}</p>
              <p className="truncate text-xs text-[#9d9d9d]">{user?.email || 'No email available'}</p>
            </div>
          </div>

          <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
            {sections.map((section) => (
              <button
                key={section.label}
                type="button"
                onClick={closeMobileMenu}
                className={[
                  'w-full rounded-lg border px-3 py-2 text-left transition',
                  section.active
                    ? 'bg-[#10a37f]/20 text-[#85f0d8]'
                    : 'border-transparent text-[#c9c9c9] hover:border-[#2e2e2e] hover:bg-[#252525] hover:text-[#ececec]'
                ].join(' ')}
              >
                <p className="text-sm font-medium">{section.label}</p>
                <p className="mt-0.5 text-xs text-[#8f8f8f]">{section.detail}</p>
              </button>
            ))}
          </nav>

          <div className="mt-5 rounded-xl border border-[#2c2c2c] bg-[#1b1b1b] p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8f8f8f]">Environment</p>
            <p className="mt-1 text-sm text-[#d6d6d6]">Development</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col md:ml-0">
          <header className="sticky top-0 z-[5] flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="rounded-lg border border-[#343434] bg-[#252525] px-3 py-2 text-sm text-[#e0e0e0] transition hover:bg-[#2d2d2d] md:hidden"
              >
                Menu
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#9d9d9d]">{todayLabel}</p>
                <h2 className="text-base font-semibold text-[#ececec]">{pageTitle || 'Overview'}</h2>
                <p className="text-sm text-[#b9b9b9]">{pageSubtitle || 'Track your progress with clarity.'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-[#315f52] bg-[#10a37f]/15 px-3 py-2 text-xs font-medium text-[#88f1d9]">
                Secure Session
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-lg border border-[#343434] bg-[#262626] px-4 py-2 text-sm font-medium text-[#ececec] transition hover:bg-[#2f2f2f]"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </section>
  )
}
