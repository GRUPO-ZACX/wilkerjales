"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "yes@/components/ui/button"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/client"

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    if (hasSupabaseEnv()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }

    router.push("/login")
    router.refresh()
  }

  return (
    <Button
      className="border-black/10 bg-white text-black hover:bg-black/5"
      onClick={logout}
      size="sm"
      type="button"
      variant="outline"
    >
      <LogOut />
      Sair
    </Button>
  )
}
