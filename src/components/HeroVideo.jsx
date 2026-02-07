import React from 'react'
import { Link } from 'react-router-dom'

const HeroVideo = () => {
    return (
        <section className="relative w-full h-[78vh] bg-black overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                src="/hero-video.mp4"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80" />

            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-6">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Najbrzi put do prakse</p>
                <h1 className="mt-4 text-4xl md:text-6xl font-display font-bold leading-tight drop-shadow-2xl">
                    Posao koji ima smisla.
                    <br />
                    Praksa koja te vodi dalje.
                </h1>
                <p className="mt-6 text-lg md:text-2xl text-slate-200 max-w-2xl">
                    Jobzee povezuje studente, alumni i kompanije kroz proverene oglase i jasne prijave.
                </p>

                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition"
                    >
                        Pretrazi oglase
                    </Link>
                    <Link
                        to="/ponuda"
                        className="px-6 py-3 rounded-full border border-white/30 text-white hover:border-white/70 transition"
                    >
                        Pogledaj ponudu
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HeroVideo