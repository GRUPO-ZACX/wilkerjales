#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"

const DEFAULT_EMAIL = "admin@teste.com"
const DEFAULT_PASSWORD = "12345678"
const ENV_FILES = [".env.local", ".env"]

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const separatorIndex = trimmed.indexOf("=")

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    let value = trimmed.slice(separatorIndex + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] ??= value
  }
}

async function findUserByEmail(supabase, email) {
  let page = 1
  const perPage = 1000

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })

    if (error) {
      throw error
    }

    const user = data.users.find(
      (currentUser) => currentUser.email?.toLowerCase() === email.toLowerCase()
    )

    if (user) {
      return user
    }

    if (data.users.length < perPage) {
      return null
    }

    page += 1
  }

  return null
}

for (const envFile of ENV_FILES) {
  loadEnvFile(resolve(process.cwd(), envFile))
}

const email = process.argv[2] || process.env.SEED_USER_EMAIL || DEFAULT_EMAIL
const password =
  process.argv[3] || process.env.SEED_USER_PASSWORD || DEFAULT_PASSWORD
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const adminKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error(
    "Defina SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL antes de criar o usuário."
  )
  process.exit(1)
}

if (!adminKey) {
  console.error(
    "Defina SUPABASE_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY no .env.local para criar usuários pelo terminal."
  )
  process.exit(1)
}

if (password.length < 6) {
  console.error("A senha precisa ter pelo menos 6 caracteres.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, adminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

try {
  const existingUser = await findUserByEmail(supabase, email)

  if (existingUser) {
    const { error } = await supabase.auth.admin.updateUserById(existingUser.id, {
      email_confirm: true,
      password,
    })

    if (error) {
      throw error
    }

    console.log(`Usuário atualizado: ${email}`)
    process.exit(0)
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
  })

  if (error) {
    throw error
  }

  console.log(`Usuário criado: ${email}`)
} catch (error) {
  console.error(error.message || error)
  process.exit(1)
}
