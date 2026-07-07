import { useState } from 'react'
import * as Icons from 'lucide-react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Collapsible } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { SecretField, CopyField } from '@/components/SecretField'
import { CredentialFormDialog } from '@/components/CredentialFormDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { FIELD_TYPES } from '@/lib/credentialCategories'
import { upsertFixedCredential, deleteCredential } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export function CredentialSection({ category, clientId, credential, onChanged }) {
  const [formOpen, setFormOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()

  const Icon = Icons[category.icon] || Icons.KeyRound
  const hasData = category.fields.some((f) => credential?.[f.name])

  const handleSubmit = async (values) => {
    await upsertFixedCredential({
      id: credential?.id,
      clientId,
      userId: user.id,
      category: category.key,
      values,
    })
    onChanged()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCredential(credential.id)
      onChanged()
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Collapsible
        title={category.label}
        icon={<Icon className="h-4 w-4 shrink-0 text-accent" />}
        badge={
          !hasData && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              empty
            </span>
          )
        }
      >
        {hasData ? (
          <div className="space-y-2">
            {category.fields.map((field) =>
              field.type === FIELD_TYPES.SECRET ? (
                <SecretField key={field.name} label={field.label} value={credential[field.name]} />
              ) : (
                <CopyField
                  key={field.name}
                  label={field.label}
                  value={credential[field.name]}
                  isUrl={field.type === FIELD_TYPES.URL}
                />
              )
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-destructive" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-3">
            <p className="text-xs text-muted-foreground">No credentials saved for {category.label} yet.</p>
            <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        )}
      </Collapsible>

      <CredentialFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={category}
        initialData={hasData ? credential : null}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Clear ${category.label}?`}
        description="This will permanently remove the saved credentials for this category."
        confirmLabel="Clear"
      />
    </>
  )
}
