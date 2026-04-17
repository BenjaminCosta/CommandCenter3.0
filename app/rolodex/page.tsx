'use client'

import { useState, useMemo } from 'react'
import { contacts, type Contact } from '@/lib/data'
import { Search } from 'lucide-react'

const roleOrder: Contact['role'][] = ['PM', 'Super', 'Worker', 'Admin']
const roleLabels: Record<Contact['role'], string> = {
  PM: 'Project Managers',
  Super: 'Superintendents',
  Worker: 'Field Workers',
  Admin: 'Admin',
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function RolodexPage() {
  const [search, setSearch] = useState('')

  const grouped = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = contacts.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
    )
    return roleOrder.reduce((acc, role) => {
      const group = filtered.filter(c => c.role === role)
      if (group.length > 0) acc[role] = group
      return acc
    }, {} as Record<string, Contact[]>)
  }, [search])

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 max-w-lg mx-auto w-full pb-24">
        {/* Sticky search */}
        <div className="sticky top-0 bg-background px-6 py-3 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Search by name or role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-surface-container text-on-surface placeholder:text-on-surface-variant border border-outline-variant font-sans text-sm focus:outline-none focus:border-primary-container transition-colors"
            />
          </div>
        </div>

        {/* Contact groups */}
        <div className="px-4 py-4 space-y-8">
          {(Object.entries(grouped) as [Contact['role'], Contact[]][]).map(([role, group], groupIndex) => (
            <div key={role} className="card-stagger" style={{"--card-i": groupIndex} as React.CSSProperties}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-3 px-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
                  {roleLabels[role]}
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant/40">({group.length})</span>
                <div className="flex-1 h-px bg-surface-container-low" />
              </div>

              {/* Contact cards */}
              <div className="flex flex-col gap-px">
                {group.map((contact, contactIndex) => (
                  <div key={contact.id} className="bg-surface-container-low card-stagger" style={{"--card-i": contactIndex} as React.CSSProperties}>
                    <div className="flex items-stretch min-h-18">
                      {/* Avatar block */}
                      <div className="w-16 bg-surface-container-high shrink-0 flex items-center justify-center">
                        <span className="font-heading text-xl text-primary-container tracking-wide">
                          {getInitials(contact.name)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 px-4 py-3 min-w-0 flex flex-col justify-center gap-2">
                        <p className="font-heading text-xl uppercase tracking-tight text-on-surface leading-tight truncate">
                          {contact.name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {contact.phone && (
                            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                              {contact.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-stretch shrink-0">
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex-1 w-14 flex items-center justify-center bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors border-b border-surface-container-low"
                            aria-label={`Call ${contact.name}`}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>call</span>
                          </a>
                        )}
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex-1 w-14 flex items-center justify-center bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors"
                            aria-label={`Email ${contact.name}`}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-20">
              <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
                No contacts found
              </p>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}
