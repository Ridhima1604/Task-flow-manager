'use client'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  footer?: React.ReactNode
}

const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, description, children, size = 'md', footer }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className={cn(
                  'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-32px)]',
                  sizeMap[size],
                  'glass rounded-2xl shadow-modal flex flex-col max-h-[90vh]',
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4 shrink-0">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">{title}</Dialog.Title>
                    {description && (
                      <Dialog.Description className="text-sm text-[var(--text-secondary)] mt-1">{description}</Dialog.Description>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="btn btn-ghost btn-icon ml-4 shrink-0 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {/* Body */}
                <div className="px-6 pb-4 overflow-y-auto scrollable flex-1">
                  {children}
                </div>
                {/* Footer */}
                {footer && (
                  <div className="px-6 pt-4 pb-6 border-t border-[var(--border-subtle)] shrink-0 flex items-center justify-end gap-3">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
