'use client'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const variantClass = {
  primary:   'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger:    'btn btn-danger',
  ghost:     'btn btn-ghost',
}
const sizeClass = { sm: 'btn-sm', md: '', lg: 'btn-lg', icon: 'btn-icon' }

export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.08 }}
      className={cn(variantClass[variant], sizeClass[size], className)}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : icon && <span className="shrink-0">{icon}</span>
      }
      {size !== 'icon' && children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  )
}
