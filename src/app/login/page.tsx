'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const imgSlider = "/assets/966ff5a3a1514cf0f3a52701a6dd51451b9d4b7b.png"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate login delay
    setTimeout(() => {
      // Mock authentication - just store a fake token and redirect
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: email,
        name: 'Admin User',
        role: email.includes('super') ? 'super_admin' : 'admin'
      }))
      router.push('/dashboard')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-[#ffffff] relative size-full min-h-screen">
      <div className="flex flex-row h-screen items-center justify-between px-3.5 py-[15px]">
        <div
          className="bg-center bg-cover bg-no-repeat h-full overflow-clip relative rounded-2xl shrink-0 w-[833px]"
          style={{ backgroundImage: `url('${imgSlider}')` }}
        >
          <div className="absolute left-[31px] top-[74px] translate-y-[-50%] w-[420px]">
            <h1 className="font-['Campton'] font-semibold text-[36px] text-[#ffffff] leading-normal">
              <span>Rogues Carrot Bar </span>
              <span className="text-[#88e1ff]">Admin Page</span>
            </h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-auto px-8">
          <div className="mb-6">
            <h2 className="font-['Campton'] font-semibold text-[36px] text-[#020202] text-center mb-2">
              Welcome !
            </h2>
            <p className="font-['Campton'] font-light text-[16px] text-[#949191]">
              Please log into your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-[22px]">
            <div className="space-y-3">
              <label className="block font-['Campton'] font-semibold text-[20px] text-[#949191]">
                Email / Nickname *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-[47px] bg-[#f9f9f9] border border-[#efefef] rounded-[10px] px-3.5 font-['Campton'] font-light text-[18px] text-[#949191] placeholder:text-[#949191]"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block font-['Campton'] font-semibold text-[20px] text-[#949191]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[47px] bg-[#f9f9f9] border border-[#efefef] rounded-[10px] px-3.5 font-['Campton'] font-light text-[18px] text-[#949191] placeholder:text-[#949191]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[47px] bg-[#09171a] hover:bg-[#0f1f23] disabled:opacity-50 rounded-[9px] font-['Campton'] font-semibold text-[20px] text-[#ffffff] transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}