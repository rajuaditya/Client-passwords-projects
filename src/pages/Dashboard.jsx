import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ClientCard } from '@/components/ClientCard'
import { ClientFormDialog } from '@/components/ClientFormDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { fetchClients, deleteClient as apiDeleteClient } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'

export default function Dashboard() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchClients()
      setClients(data)
    } catch (err) {
      toast({ title: 'Failed to load clients', description: err.message, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) =>
      [c.company_name, c.contact_person, c.website_url, c.phone_number]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    )
  }, [clients, query])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiDeleteClient(deleteTarget.id)
      toast({ title: 'Client deleted' })
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground">All client profiles and their stored credentials.</p>
        </div>
        <Button
          onClick={() => {
            setEditingClient(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="text-2xl font-bold leading-none">{clients.length}</p>
            <p className="text-xs text-muted-foreground">Total Clients</p>
          </div>
        </Card>
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients by name, contact, phone, or website…"
            className="h-full pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 border-dashed p-12 text-center">
          <Users className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">{query ? 'No clients match your search' : 'No clients yet'}</p>
          <p className="text-sm text-muted-foreground">
            {query ? 'Try a different search term.' : 'Add your first client to start storing credentials.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={(c) => {
                setEditingClient(c)
                setFormOpen(true)
              }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <ClientFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        client={editingClient}
        onSaved={load}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this client?"
        description={`This permanently deletes "${deleteTarget?.company_name}" and all of its stored credentials. This cannot be undone.`}
      />
    </div>
  )
}
