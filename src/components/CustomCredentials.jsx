import { useState } from 'react'
import { KeyRound, Pencil, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SecretField, CopyField } from '@/components/SecretField'
import { CredentialFormDialog } from '@/components/CredentialFormDialog'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { CUSTOM_CATEGORY, FIELD_TYPES } from '@/lib/credentialCategories'
import { createCustomCredential, updateCredential, deleteCredential } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export function CustomCredentials({ clientId, credentials, onChanged }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (values) => {
    if (editing) {
      await updateCredential(editing.id, values)
    } else {
      await createCustomCredential({ clientId, userId: user.id, values })
    }
    onChanged()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCredential(deleteTarget.id)
      onChanged()
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-muted-foreground">Other Accounts</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Account
        </Button>
      </div>

      {credentials.length === 0 ? (
        <Card className="border-dashed p-6 text-center text-sm text-muted-foreground">
          No custom accounts added yet — Zoom, Slack, Hostinger, GitHub, or anything else.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {credentials.map((cred) => (
            <Card key={cred.id} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-accent" />
                  <span className="font-display text-sm font-semibold">{cred.title || 'Untitled'}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      setEditing(cred)
                      setFormOpen(true)
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:text-destructive"
                    onClick={() => setDeleteTarget(cred)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {CUSTOM_CATEGORY.fields
                  .filter((f) => f.name !== 'title' && cred[f.name])
                  .map((field) =>
                    field.type === FIELD_TYPES.SECRET ? (
                      <SecretField key={field.name} label={field.label} value={cred[field.name]} />
                    ) : field.type === FIELD_TYPES.TEXTAREA ? (
                      <p key={field.name} className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                        {cred[field.name]}
                      </p>
                    ) : (
                      <CopyField
                        key={field.name}
                        label={field.label}
                        value={cred[field.name]}
                        isUrl={field.type === FIELD_TYPES.URL}
                      />
                    )
                  )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <CredentialFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={CUSTOM_CATEGORY}
        initialData={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this account?"
        description={`This will permanently remove "${deleteTarget?.title || 'this'}" credentials.`}
      />
    </div>
  )
}
