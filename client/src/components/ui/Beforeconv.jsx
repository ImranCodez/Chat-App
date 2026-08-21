import React from 'react'

const Beforeconv = () => {
   return (
        <div className="ambient-canvas relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6">
          <div className="ambient-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute left-[12%] top-[18%] h-3 w-3 rounded-full bg-accent/60 float-slow" />
          <div className="pointer-events-none absolute bottom-[22%] right-[16%] h-2 w-2 rounded-full bg-brand-light/70 float-delayed" />
          <svg
            className="pointer-events-none absolute h-[min(78vw,34rem)] w-[min(78vw,34rem)] text-accent/25"
            viewBox="0 0 540 540"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="welcome-orbit"
              cx="270"
              cy="270"
              r="198"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 14"
            />
            <circle
              className="welcome-orbit-reverse"
              cx="270"
              cy="270"
              r="148"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1 10"
            />
            <path
              className="welcome-dash"
              d="M74 332C150 198 216 392 302 246S428 140 482 204"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              className="welcome-pulse"
              cx="270"
              cy="270"
              r="62"
              fill="rgb(16 38 56 / 0.72)"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <div className="form-enter relative flex max-w-sm flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border hover:border-white duration-300 border-brand/30 bg-accent-soft text-accent shadow-xl shadow-brand/10">
              <FiMessageCircle size={30} />
            </div>
  
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Your conversations, in one place
            </h1>
  
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Select a conversation from the sidebar to pick up where you left
              off.
            </p>
          </div>
        </div>
      );
}

export default Beforeconv