import { useEffect, useState } from 'react'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const emptyForm = {
  company_name: '',
  contact_person: '',
  phone_number: '',
  email: '',
  website_url: '',
  address: '',
  notes: '',
}

export function ClientFormDialog({ open, onClose, client, onSaved }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const isEdit = Boolean(client)

  useEffect(() => {
    if (open) {
      setForm(client ? { ...emptyForm, ...client } : emptyForm)
    }
  }, [open, client])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company_name.trim()) {
      toast({ title: 'Company name is required', variant: 'error' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim() || null,
        phone_number: form.phone_number.trim() || null,
        email: form.email.trim() || null,
        website_url: form.website_url.trim() || null,
        address: form.address.trim() || null,
        notes: form.notes.trim() || null,
      }

      if (isEdit) {
        const { error } = await supabase.from('clients').update(payload).eq('id', client.id)
        if (error) throw error
        toast({ title: 'Client updated' })
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([{ ...payload, user_id: user.id }])
        if (error) throw error
        toast({ title: 'Client added' })
      }
      onSaved?.()
      onClose()
    } catch (err) {
      toast({ title: 'Something went wrong', description: err.message, variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="max-w-xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader
          title={isEdit ? 'Edit Client' : 'Add Client'}
          description="Store the client's basic profile. Credentials are added on the client's detail page."
          onClose={onClose}
        />
        <DialogBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-full space-y-1.5">
            <Label htmlFor="company_name">Company Name *</Label>
            <Input id="company_name" name="company_name" value={form.company_name} onChange={handleChange} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact_person">Contact Person</Label>
            <Input id="contact_person" name="contact_person" value={form.contact_person} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" name="website_url" value={form.website_url} onChange={handleChange} />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Client'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
