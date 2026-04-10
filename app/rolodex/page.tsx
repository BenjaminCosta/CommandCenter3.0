'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { contacts, type Contact } from '@/lib/data'
import { Search, Phone, Mail } from 'lucide-react'

const roleOrder: Contact['role'][] = ['PM', 'Super', 'Worker', 'Admin']
const roleLabels: Record<Contact['role'], string> = {
  PM: 'Project Managers',
  Super: 'Superintendents',
  Worker: 'Field Workers',
  Admin: 'Admin',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function RolodexPage() {
  const [search, setSearch] = useState('')

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = roleOrder.reduce(
    (acc, role) => {
      const group = filtered.filter((c) => c.role === role)
      if (group.length > 0) acc[role] = group
      return acc
    },
    {} as Record<string, Contact[]>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-black text-svc-white safe-top">
        <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
          <h1 className="font-heading text-3xl font-bold text-orange tracking-tight">SVC</h1>
          <span className="font-heading text-lg font-bold uppercase tracking-wide text-svc-white">
            Rolodex
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full pb-24">
        {/* Sticky Search */}
        <div className="sticky top-0 bg-background border-b border-border px-4 py-3 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
            <input
              type="search"
              placeholder="Search by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-card border border-border text-black placeholder:text-grey font-sans text-sm focus:outline-none focus:border-orange transition-colors"
            />
          </div>
        </div>

        {/* Contact Groups */}
        <div className="px-4 py-6 space-y-8">
          {(Object.entries(grouped) as [Contact['role'], Contact[]][]).map(([role, group]) => (
            <div key={role}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-grey whitespace-nowrap">
                  {roleLabels[role]}
                </span>
                <span className="font-mono text-xs text-grey/40">({group.length})</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Contact cards */}
              <div className="divide-y divide-border/40">
                {group.map((contact) => (
                  <div
                    key={contact.id}
                    className="bg-card flex items-center gap-4 py-4 hover:bg-muted/40 transition-colors"
                  >
                    {/* Initials avatar */}
                    <div className="w-11 h-11 bg-black flex-shrink-0 flex items-center justify-center">
                      <span className="font-heading text-sm font-bold text-orange tracking-wide">
                        {getInitials(contact.name)}
                      </span>
                    </div>

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-lg font-bold text-black leading-tight truncate">
                        {contact.name}
                      </p>
                      <p className="font-mono text-xs text-grey uppercase tracking-wide mt-0.5">
                        {roleLabels[role]}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone}`}
                          className="w-11 h-11 flex items-center justify-center text-grey hover:text-orange hover:bg-orange/10 transition-colors"
                          aria-label={`Call ${contact.name}`}
                        >
                          <Phone className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                      )}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="w-11 h-11 flex items-center justify-center text-grey hover:text-orange hover:bg-orange/10 transition-colors"
                          aria-label={`Email ${contact.name}`}
                        >
                          <Mail className="w-4 h-4" strokeWidth={1.5} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-20">
              <p className="text-grey font-mono text-sm">No contacts found</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="rolodex" />
    </div>
  )
}
