import { useMemo, useState } from 'react'

const sections = ['Overview', 'Daily Logs', 'DSA Tracker', 'Projects', 'Analytics']

export default function DashboardLayout({ user, onLogout, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
            'fixed inset-y-0 left-0 z-20 w-72 border-r border-[#2a2a2a] bg-[#171717]/95 p-6 transition-transform md:static md:w-64 md:translate-x-0',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          ].join(' ')}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10a37f]">DevTrackr</p>
          <h1 className="mt-3 text-lg font-semibold text-[#ececec]">Dashboard</h1>

          <nav className="mt-8 space-y-2">
            {sections.map((section, index) => (
              <button
                key={section}
                type="button"
                className={[
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition',
                  index === 0
                    ? 'bg-[#10a37f]/20 text-[#85f0d8]'
                    : 'text-[#c9c9c9] hover:bg-[#252525] hover:text-[#ececec]'
                ].join(' ')}
              >
                {section}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col md:ml-0">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2a2a2a] bg-[#1f1f1f]/90 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="rounded-lg border border-[#343434] bg-[#252525] px-3 py-2 text-sm text-[#e0e0e0] transition hover:bg-[#2d2d2d] md:hidden"
              >
                Menu
              </button>

              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#9d9d9d]">{todayLabel}</p>
                <p className="text-sm text-[#dedede]">
                  Welcome {user?.name || 'Developer'} ({user?.email || 'No email available'})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-lg border border-[#343434] bg-[#262626] px-4 py-2 text-sm font-medium text-[#ececec] transition hover:bg-[#2f2f2f]"
            >
              Logout
            </button>
          </header>

          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </section>
  )
}
