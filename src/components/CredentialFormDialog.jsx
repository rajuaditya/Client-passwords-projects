import { useEffect, useState } from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FIELD_TYPES } from '@/lib/credentialCategories'
import { useToast } from '@/contexts/ToastContext'

export function CredentialFormDialog({ open, onClose, category, initialData, onSubmit }) {
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      const base = {}
      category.fields.forEach((f) => {
        base[f.name] = initialData?.[f.name] ?? ''
      })
      setForm(base)
    }
  }, [open, category, initialData])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const cleaned = {}
      Object.entries(form).forEach(([k, v]) => {
        cleaned[k] = typeof v === 'string' ? v.trim() || null : v
      })
      await onSubmit(cleaned)
      toast({ title: 'Credential saved' })
      onClose()
    } catch (err) {
      toast({ title: 'Save failed', description: err.message, variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-lg">
      <form onSubmit={handleSubmit}>
        <DialogHeader title={`${initialData ? 'Edit' : 'Add'} ${category.label}`} onClose={onClose} />
        <DialogBody className="space-y-4">
          {category.fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name}>
                {field.label}
                {field.optional && <span className="ml-1 text-muted-foreground">(optional)</span>}
              </Label>
              {field.type === FIELD_TYPES.TEXTAREA ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name] ?? ''}
                  onChange={handleChange}
                  rows={3}
                />
              ) : field.type === FIELD_TYPES.SECRET ? (
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="off"
                  value={form[field.name] ?? ''}
                  onChange={handleChange}
                  className="font-mono"
                />
              ) : (
                <Input id={field.name} name={field.name} value={form[field.name] ?? ''} onChange={handleChange} />
              )}
            </div>
          ))}
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Credential'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
