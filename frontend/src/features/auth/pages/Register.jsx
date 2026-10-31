import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const auth = useAuth()

  const handleSubmit = async(e) => {
    e.preventDefault()

    await auth.handleRegister({username, email, password})

    navigate("/check-email", {
      state: {email}
    })

    console.log('Register submitted:', { username, email, password })
  }

  if(!loading && user){
    return navigate("/")
  }

  if(loading){
    return (<main><h1>Loading...</h1></main>)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0e0e11] text-zinc-100 px-4 py-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D97757]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#16161b]/95 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#D97757]/15 text-[#D97757] mb-3 border border-[#D97757]/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-zinc-400 mt-1">Get started with your free account today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2" htmlFor="reg-username">
              Username
            </label>
            <input
              id="reg-username"
              type="text"
              required
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e1e24] border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 text-sm outline-none transition duration-200 focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20"
            />
          </div>

          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2" htmlFor="reg-email">
              Email Address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1e1e24] border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 text-sm outline-none transition duration-200 focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2" htmlFor="reg-password">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1e1e24] border border-zinc-700/60 rounded-xl text-white placeholder-zinc-500 text-sm outline-none transition duration-200 focus:border-[#D97757] focus:ring-2 focus:ring-[#D97757]/20 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 focus:outline-none transition cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#D97757] hover:bg-[#c66849] active:scale-[0.99] text-white font-medium rounded-xl text-sm transition-all duration-200 shadow-lg shadow-[#D97757]/20 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#16161b] px-3 text-zinc-500 font-medium">or</span>
          </div>
        </div>

        {/* Navigation to Login */}
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#D97757] hover:text-[#e48e72] font-medium transition cursor-pointer underline-offset-4 hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register