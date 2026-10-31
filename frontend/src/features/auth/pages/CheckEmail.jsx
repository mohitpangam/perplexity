import React from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const CheckEmail = () => {
  const location = useLocation()
  const email = location.state?.email || 'your email'

  const {handleResendEmail} = useAuth()

  const handleResend = async () => {
    await handleResendEmail({email})
  }

  if(!email){
    return <Navigate to="/register"/>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e11] text-zinc-100 px-4">
      <div className="max-w-md w-full p-8 bg-[#16161b] rounded-2xl border border-zinc-800 text-center shadow-2xl">
        {/* Email Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#D97757]/15 text-[#D97757] mb-4 border border-[#D97757]/30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-white">Check your inbox</h1>
        
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
          An email has been sent to <span className="text-white font-medium">{email}</span>.{' '}
          Kindly verify to continue.
        </p>

        {/* Back to Login Link */}
        <Link 
          to="/login"
          className="inline-block w-full py-3 bg-[#D97757] hover:bg-[#c66849] text-white font-medium rounded-xl transition mb-5 text-sm"
        >
          Go to Login
        </Link>

        {/* Resend Email Link (UI Only) */}
        <p className="text-sm text-zinc-400">
          Didn't receive the email?{' '}
          <button
            onClick={handleResend}
            type="button"
            className="text-[#D97757] hover:text-[#e48e72] font-medium transition cursor-pointer underline-offset-4 hover:underline"
          >
            Resend email
          </button>
        </p>
      </div>
    </div>
  )
}

export default CheckEmail
