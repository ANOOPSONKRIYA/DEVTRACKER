import { useMemo, useState } from 'react'

const sections = [
  { label: 'Overview', detail: 'Summary and activity', active: true },
  { label: 'Daily Logs', detail: 'Track study consistency', active: false },
  { label: 'DSA Tracker', detail: 'Problems and status', active: false },
  { label: 'Projects', detail: 'Portfolio progress', active: false },
  { label: 'Analytics', detail: 'Performance insights', active: false }
]

function sectionCode(label) {
  return label
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function HamburgerButton({ onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle sidebar"
      className={[
        'inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#343434] bg-[#252525] transition hover:bg-[#2d2d2d]',
        className || ''
      ].join(' ')}
    >
      <span className="flex w-4 flex-col gap-1">
        <span className="h-[2px] rounded bg-[#cfcfcf]" />
        <span className="h-[2px] rounded bg-[#cfcfcf]" />
        <span className="h-[2px] rounded bg-[#cfcfcf]" />
      </span>
    </button>
  )
}

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function DashboardLayout({ user, onLogout, pageTitle, pageSubtitle, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  function toggleMobileSearch() {
    setIsMobileSearchOpen((current) => !current)
  }

  return (
    <section className="relative min-h-screen bg-[#212121]">
      {isMobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-10 bg-black/55 md:hidden"
          aria-label="Close sidebar"
          onClick={closeMobileMenu}
        />
      ) : null}

      <header className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#1f1f1f]/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <HamburgerButton
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="md:hidden"
          />
          <HamburgerButton
            onClick={() => setIsDesktopSidebarCollapsed((current) => !current)}
            className="hidden md:inline-flex"
          />

          <div className="min-w-[120px] text-sm font-semibold text-[#d7d7d7]">DevTrackr</div>

          <div className="relative hidden min-w-0 flex-1 md:block md:max-w-xl">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search logs, DSA, projects..."
              className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] pl-10 pr-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
            />
          </div>

          <button
            type="button"
            onClick={toggleMobileSearch}
            aria-label="Toggle search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#343434] bg-[#252525] text-[#cfcfcf] transition hover:bg-[#2d2d2d] md:hidden"
          >
            <SearchIcon className="h-4 w-4" />
          </button>

          <div className="ml-auto hidden items-center gap-2 text-xs text-[#a2a2a2] sm:flex">
            <span>{todayLabel}</span>
            <span className="rounded-md border border-[#315f52] bg-[#10a37f]/15 px-2 py-1 text-[#88f1d9]">
              Secure Session
            </span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-[#343434] bg-[#262626] px-3 py-2 text-sm font-medium text-[#ececec] transition hover:bg-[#2f2f2f]"
          >
            Logout
          </button>
        </div>

        {isMobileSearchOpen ? (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a8a8a]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search logs, DSA, projects..."
                className="h-10 w-full rounded-md border border-[#343434] bg-[#1a1a1a] pl-10 pr-3 text-sm text-[#ececec] outline-none placeholder:text-[#878787] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20"
              />
            </div>
          </div>
        ) : null}
      </header>

      <div className="flex min-h-[calc(100vh-65px)]">
        <aside
          className={[
            'fixed inset-y-0 left-0 top-[65px] z-20 flex h-[calc(100vh-65px)] flex-col border-r border-[#2a2a2a] bg-[#171717]/95 p-4 transition-all duration-200 md:static md:top-auto md:h-auto md:translate-x-0',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
            isDesktopSidebarCollapsed ? 'w-72 md:w-20' : 'w-72 md:w-[18rem]'
          ].join(' ')}
        >
          <div className={isDesktopSidebarCollapsed ? 'rounded-xl border border-[#2c2c2c] bg-[#1f1f1f] p-2 text-center' : 'rounded-xl border border-[#2c2c2c] bg-[#1f1f1f] p-3'}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10a37f]">DT</p>
            {!isDesktopSidebarCollapsed ? (
              <h1 className="mt-2 text-sm font-semibold text-[#ececec]">Productivity Dashboard</h1>
            ) : null}
          </div>

          <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">
            {sections.map((section) => (
              <button
                key={section.label}
                type="button"
                onClick={closeMobileMenu}
                className={[
                  'w-full rounded-lg border px-2.5 py-2 text-left transition',
                  section.active
                    ? 'border-[#315f52] bg-[#10a37f]/20 text-[#85f0d8]'
                    : 'border-transparent text-[#c9c9c9] hover:border-[#2e2e2e] hover:bg-[#252525] hover:text-[#ececec]',
                  isDesktopSidebarCollapsed ? 'flex items-center justify-center' : ''
                ].join(' ')}
                title={section.label}
              >
                {isDesktopSidebarCollapsed ? (
                  <span className="text-xs font-semibold tracking-wide">{sectionCode(section.label)}</span>
                ) : (
                  <>
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className="mt-0.5 text-xs text-[#8f8f8f]">{section.detail}</p>
                  </>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-4">
            {!isDesktopSidebarCollapsed ? (
              <div className="rounded-xl border border-[#2c2c2c] bg-[#1b1b1b] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8f8f8f]">Environment</p>
                <p className="mt-1 text-sm text-[#d6d6d6]">Development</p>
              </div>
            ) : null}

            <div
              className={[
                'flex items-center rounded-xl border border-[#2c2c2c] bg-[#1b1b1b] p-3',
                isDesktopSidebarCollapsed ? 'justify-center' : 'gap-3'
              ].join(' ')}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10a37f]/20 text-sm font-semibold text-[#85f0d8]">
                {userInitial}
              </div>
              {!isDesktopSidebarCollapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#ececec]">{user?.name || 'Developer'}</p>
                  <p className="truncate text-xs text-[#9d9d9d]">{user?.email || 'No email available'}</p>
                </div>
              ) : null}
            </div>
          </div>

        </aside>

        <div className="flex min-w-0 flex-1 flex-col md:ml-0">
          <div className="border-b border-[#2a2a2a] px-4 py-3 sm:px-6">
            <h2 className="text-base font-semibold text-[#ececec]">{pageTitle || 'Overview'}</h2>
            <p className="text-sm text-[#b9b9b9]">{pageSubtitle || 'Track your progress with clarity.'}</p>
          </div>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </section>
  )
}
