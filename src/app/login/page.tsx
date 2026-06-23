import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { LoginForm } from "yes@/components/auth/login-form"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Login | Informativo Jurídico Digital",
  description: "Acesse o dashboard do Informativo Jurídico Digital.",
}

export default async function LoginPage() {
  const isConfigured = hasSupabaseEnv()

  if (isConfigured) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      redirect("/dashboard/informativos")
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-10 text-black">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-[1120px] items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-black/45">
            Informativo Jurídico Digital
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-6xl">
            Acesse seus informativos jurídicos.
          </h1>
          <p className="mt-6 text-lg leading-8 text-black/60">
            Edite, publique e mantenha o histórico dos informativos do
            escritório com layout institucional controlado.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-black">
            Entrar no dashboard
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/55">
            Use e-mail e senha cadastrados no Supabase Auth.
          </p>

          {!isConfigured && (
            <p className="mt-5 rounded-xl border border-black/10 bg-neutral-50 p-3 text-sm leading-6 text-black/65">
              Configure `NEXT_PUBLIC_SUPABASE_URL` e
              `NEXT_PUBLIC_SUPABASE_ANON_KEY` para ativar login e persistência.
            </p>
          )}

          <div className="mt-6">
            <Suspense>
              <LoginForm isConfigured={isConfigured} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}
