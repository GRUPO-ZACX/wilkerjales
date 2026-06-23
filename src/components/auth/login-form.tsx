"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "yes@/components/ui/button"
import { Input } from "yes@/components/ui/input"
import { createClient } from "yes@/lib/supabase/client"

type LoginFormProps = {
  isConfigured: boolean
}

export function LoginForm({ isConfigured }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const redirectTo = searchParams.get("redirectTo") || "/dashboard/informativos"

  async function signIn() {
    setMessage(null)

    if (!isConfigured) {
      setMessage("Configure as variáveis Supabase antes de entrar.")
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setIsLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function signUp() {
    setMessage(null)

    if (!isConfigured) {
      setMessage("Configure as variáveis Supabase antes de criar a conta.")
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setIsLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(
      "Conta criada. Se a confirmação de e-mail estiver ativa no Supabase, confirme o e-mail antes de entrar."
    )
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-semibold text-[#244F49]">
        E-mail
        <Input
          autoComplete="email"
          className="border-[#B7B783] bg-[#F7F5EE]"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="advogado@escritorio.adv.br"
          type="email"
          value={email}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-semibold text-[#244F49]">
        Senha
        <Input
          autoComplete="current-password"
          className="border-[#B7B783] bg-[#F7F5EE]"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Sua senha"
          type="password"
          value={password}
        />
      </label>

      {message && (
        <p className="border border-[#B7B783]/70 bg-[#F7F5EE] p-3 text-sm leading-6 text-[#244F49]">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          className="bg-[#163B35] text-[#F7F5EE] hover:bg-[#244F49]"
          disabled={isLoading}
          onClick={signIn}
          type="button"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        <Button
          className="border-[#B7B783] bg-[#F7F5EE] text-[#163B35] hover:bg-[#ECE8D8]"
          disabled={isLoading}
          onClick={signUp}
          type="button"
          variant="outline"
        >
          Criar conta
        </Button>
      </div>
    </div>
  )
}
