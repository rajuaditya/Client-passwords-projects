import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext(undefined)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'success', duration = 3000 }) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, title, description, variant }])
      if (duration) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg animate-in',
              t.variant === 'success' && 'border-success/30',
              t.variant === 'error' && 'border-destructive/30',
              t.variant === 'info' && 'border-border'
            )}
          >
            {t.variant === 'success' && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
            {t.variant === 'error' && <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
            {t.variant === 'info' && <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />}
            <div className="flex-1">
              {t.title && <p className="text-sm font-medium text-card-foreground">{t.title}</p>}
              {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (ctx === undefined) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
