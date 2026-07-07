// Every fixed credential "section" shown on the Client Details page.
// `fields` lists which columns from the `credentials` table apply to that
// category and how they should be labeled/typed in the UI.
// `single: true` categories have at most one row per client (enforced by a
// partial unique index in Postgres). `custom` allows unlimited rows.

export const FIELD_TYPES = {
  TEXT: 'text',
  URL: 'url',
  SECRET: 'secret', // password / PIN - maskable
  TEXTAREA: 'textarea',
}

export const CREDENTIAL_CATEGORIES = [
  {
    key: 'website',
    label: 'Website',
    icon: 'Globe',
    fields: [
      { name: 'website_url', label: 'Website URL', type: FIELD_TYPES.URL },
      { name: 'login_url', label: 'Admin Login URL', type: FIELD_TYPES.URL },
      { name: 'username', label: 'Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'wordpress',
    label: 'WordPress',
    icon: 'LayoutTemplate',
    fields: [
      { name: 'login_url', label: 'Login URL', type: FIELD_TYPES.URL },
      { name: 'username', label: 'Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'hosting',
    label: 'Hosting',
    icon: 'Server',
    fields: [
      { name: 'title', label: 'Hosting Provider', type: FIELD_TYPES.TEXT },
      { name: 'login_url', label: 'Login URL', type: FIELD_TYPES.URL },
      { name: 'username', label: 'Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'domain',
    label: 'Domain',
    icon: 'Fingerprint',
    fields: [
      { name: 'title', label: 'Registrar', type: FIELD_TYPES.TEXT },
      { name: 'login_url', label: 'Login URL', type: FIELD_TYPES.URL },
      { name: 'username', label: 'Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'business_email',
    label: 'Business Email',
    icon: 'Mail',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'gmail',
    label: 'Gmail',
    icon: 'Mail',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: 'Facebook',
    fields: [
      { name: 'username', label: 'Email / Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: 'Instagram',
    fields: [
      { name: 'username', label: 'Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: 'Linkedin',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    icon: 'Twitter',
    fields: [
      { name: 'username', label: 'Username', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: 'Youtube',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'whatsapp_business',
    label: 'WhatsApp Business',
    icon: 'MessageCircle',
    fields: [
      { name: 'phone_number', label: 'Phone Number', type: FIELD_TYPES.TEXT },
      { name: 'pin', label: 'Password / PIN', type: FIELD_TYPES.SECRET, optional: true },
    ],
  },
  {
    key: 'meta_business_manager',
    label: 'Meta Business Manager',
    icon: 'Boxes',
    fields: [
      { name: 'email', label: 'Login Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'google_analytics',
    label: 'Google Analytics',
    icon: 'BarChart3',
    group: 'Google Accounts',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'google_search_console',
    label: 'Google Search Console',
    icon: 'Search',
    group: 'Google Accounts',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'google_tag_manager',
    label: 'Google Tag Manager',
    icon: 'Tags',
    group: 'Google Accounts',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'google_ads',
    label: 'Google Ads',
    icon: 'Megaphone',
    group: 'Google Accounts',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'google_business_profile',
    label: 'Google Business Profile',
    icon: 'MapPin',
    group: 'Google Accounts',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'canva',
    label: 'Canva',
    icon: 'Palette',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
  {
    key: 'chatgpt',
    label: 'ChatGPT',
    icon: 'Sparkles',
    fields: [
      { name: 'email', label: 'Email', type: FIELD_TYPES.TEXT },
      { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    ],
  },
]

// Map for quick lookup by key
export const CATEGORY_MAP = CREDENTIAL_CATEGORIES.reduce((acc, c) => {
  acc[c.key] = c
  return acc
}, {})

export const CUSTOM_CATEGORY = {
  key: 'custom',
  label: 'Other Account',
  icon: 'KeyRound',
  fields: [
    { name: 'title', label: 'Title', type: FIELD_TYPES.TEXT },
    { name: 'login_url', label: 'Login URL', type: FIELD_TYPES.URL },
    { name: 'username', label: 'Username / Email', type: FIELD_TYPES.TEXT },
    { name: 'password', label: 'Password', type: FIELD_TYPES.SECRET },
    { name: 'notes', label: 'Notes', type: FIELD_TYPES.TEXTAREA },
  ],
}

// Grouping used purely for rendering order/headers in Client Details page
export const CATEGORY_GROUPS = [
  { title: 'Website & Infrastructure', keys: ['website', 'wordpress', 'hosting', 'domain'] },
  { title: 'Email', keys: ['business_email', 'gmail'] },
  { title: 'Social Media', keys: ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'whatsapp_business'] },
  { title: 'Meta Business Manager', keys: ['meta_business_manager'] },
  {
    title: 'Google Accounts',
    keys: [
      'google_analytics',
      'google_search_console',
      'google_tag_manager',
      'google_ads',
      'google_business_profile',
    ],
  },
  { title: 'Tools', keys: ['canva', 'chatgpt'] },
]
