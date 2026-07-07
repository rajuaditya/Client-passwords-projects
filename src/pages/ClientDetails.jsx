import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, Pencil, Phone, StickyNote, Trash2, User, Mail, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ClientFormDialog } from '@/components/ClientFormDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { CredentialSection } from '@/components/CredentialSection'
import { CustomCredentials } from '@/components/CustomCredentials'
import { fetchClient, fetchCredentials, deleteClient as apiDeleteClient } from '@/lib/api'
import { CATEGORY_GROUPS, CATEGORY_MAP } from '@/lib/credentialCategories'
import { useToast } from '@/contexts/ToastContext'

export default function ClientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [client, setClient] = useState(null)
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [c, creds] = await Promise.all([fetchClient(id), fetchCredentials(id)])
      setClient(c)
      setCredentials(creds)
    } catch (err) {
      toast({ title: 'Failed to load client', description: err.message, variant: 'error' })
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiDeleteClient(id)
      toast({ title: 'Client deleted' })
      navigate('/')
    } catch (err) {
      toast({ title: 'Delete failed', description: err.message, variant: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const credentialByCategory = (key) => credentials.find((c) => c.category === key) || null
  const customCredentials = credentials.filter((c) => c.category === 'custom')

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (!client) return null

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Button>

      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold">{client.company_name}</h1>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {client.contact_person && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> {client.contact_person}
                  </span>
                )}
                {client.phone_number && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> {client.phone_number}
                  </span>
                )}
                {client.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {client.email}
                  </span>
                )}
                {client.website_url && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> {client.website_url}
                  </span>
                )}
                {client.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {client.address}
                  </span>
                )}
              </div>
              {client.notes && (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {client.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.title} className="space-y-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.keys.map((key) => (
                <CredentialSection
                  key={key}
                  category={CATEGORY_MAP[key]}
                  clientId={id}
                  credential={credentialByCategory(key)}
                  onChanged={load}
                />
              ))}
            </div>
          </div>
        ))}

        <CustomCredentials clientId={id} credentials={customCredentials} onChanged={load} />
      </div>

      <ClientFormDialog open={editOpen} onClose={() => setEditOpen(false)} client={client} onSaved={load} />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this client?"
        description={`This permanently deletes "${client.company_name}" and all of its stored credentials. This cannot be undone.`}
      />
    </div>
  )
}
