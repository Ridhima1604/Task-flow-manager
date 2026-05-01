'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, AlertCircle, Sparkles, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const FEATURES = [
  'Real-time kanban boards',
  'Team collaboration & roles',
  'Beautiful analytics & insights',
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: isAdmin ? 'admin' : 'member' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        return
      }
      // Auto sign-in
      const signInRes = await signIn('credentials', { email, password, redirect: false })
      if (signInRes?.error) {
        setError('Account created but sign-in failed. Please log in.')
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden auth-gradient">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255,255,255,0.15)'/%3E%3C/svg%3E")`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 flex flex-col justify-center px-16 py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-8 shadow-glow-indigo">
              <Sparkles className="w-7 h-7 text-[var(--text-primary)]" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-gradient-primary leading-tight">
              TaskFlow
            </h1>
            <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
              The beautiful way to manage<br />your team&apos;s projects and tasks.
            </p>
            <div className="space-y-4">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--accent-success)] shrink-0" />
                  <span className="text-[var(--text-secondary)]">{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-sidebar)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <div className="glass rounded-2xl shadow-modal p-8">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-glow-indigo">
                <Sparkles className="w-4 h-4 text-[var(--text-primary)]" />
              </div>
              <span className="font-bold text-[var(--text-primary)]">TaskFlow</span>
            </div>

            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Get started</h2>
            <p className="text-[var(--text-secondary)] text-sm mb-8">Create your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                id="register-name"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Email"
                type="email"
                id="register-email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label="Password"
                type="password"
                id="register-password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
                minLength={6}
              />

              {/* Admin toggle section */}
              <div className="mt-4 p-4 rounded-xl bg-amber-500/[0.08] border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">First time setup?</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
                  Register as admin (only works if no admin exists in the database yet)
                </p>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    id="register-admin"
                    checked={isAdmin}
                    onChange={e => setIsAdmin(e.target.checked)}
                    className="w-auto p-0 m-0 w-4 h-4 rounded border-amber-500/40 accent-amber-400 cursor-pointer"
                    style={{ width: '16px', padding: '0', margin: '0' }}
                  />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    Register as Admin
                  </span>
                </label>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-rose-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--text-muted)] mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--accent-primary)] hover:opacity-80 font-medium transition-colors">
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
