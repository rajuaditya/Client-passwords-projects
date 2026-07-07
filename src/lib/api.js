import { supabase } from '@/lib/supabaseClient'

// ---------- Clients ----------

export async function fetchClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('company_name', { ascending: true })
  if (error) throw error
  return data
}

export async function fetchClient(id) {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function deleteClient(id) {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}

// ---------- Credentials ----------

export async function fetchCredentials(clientId) {
  const { data, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

// Fixed (single-row-per-category) credentials are upserted on (client_id, category)
export async function upsertFixedCredential({ id, clientId, userId, category, values }) {
  const payload = { ...values, client_id: clientId, user_id: userId, category }
  if (id) {
    const { error } = await supabase.from('credentials').update(payload).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('credentials').insert([payload])
    if (error) throw error
  }
}

export async function createCustomCredential({ clientId, userId, values }) {
  const { error } = await supabase
    .from('credentials')
    .insert([{ ...values, client_id: clientId, user_id: userId, category: 'custom' }])
  if (error) throw error
}

export async function updateCredential(id, values) {
  const { error } = await supabase.from('credentials').update(values).eq('id', id)
  if (error) throw error
}

export async function deleteCredential(id) {
  const { error } = await supabase.from('credentials').delete().eq('id', id)
  if (error) throw error
}
