'use client'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description, confirmLabel = 'Delete', loading,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <AlertDialog.Portal forceMount>
            <AlertDialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </AlertDialog.Overlay>
            <AlertDialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-32px)] max-w-md glass rounded-2xl shadow-modal p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-danger-subtle)] border border-[var(--accent-danger-subtle)] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-[var(--accent-danger)]" />
                  </div>
                  <div>
                    <AlertDialog.Title className="text-base font-semibold text-[var(--text-primary)]">{title}</AlertDialog.Title>
                    <AlertDialog.Description className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</AlertDialog.Description>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <AlertDialog.Cancel asChild>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
                  </AlertDialog.Action>
                </div>
              </motion.div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  )
}
