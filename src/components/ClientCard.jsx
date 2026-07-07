import { useNavigate } from 'react-router-dom'
import { Building2, Globe, Pencil, Phone, Trash2, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ClientCard({ client, onEdit, onDelete }) {
  const navigate = useNavigate()

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/clients/${client.id}`)}
    >
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-sm font-semibold">{client.company_name}</h3>
            {client.contact_person && (
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <User className="h-3 w-3 shrink-0" />
                {client.contact_person}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(client)
            }}
            aria-label="Edit client"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(client)
            }}
            aria-label="Delete client"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border px-5 py-3 text-xs text-muted-foreground">
        {client.phone_number && (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0" />
            <span className="truncate">{client.phone_number}</span>
          </div>
        )}
        {client.website_url && (
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 shrink-0" />
            <span className="truncate">{client.website_url}</span>
          </div>
        )}
        {!client.phone_number && !client.website_url && <span>No contact details added yet</span>}
      </div>
    </Card>
  )
}
