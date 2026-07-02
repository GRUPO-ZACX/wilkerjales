This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Acessos do dashboard

O app não permite cadastro público pela tela de login. Os usuários devem ser
criados pelo administrador no Supabase Auth ou pelo comando local abaixo.

Para criar ou atualizar o usuário de teste padrão:

```bash
npm run create:user
```

Credenciais padrão do comando:

```text
E-mail: admin@teste.com
Senha: 12345678
```

Para criar outro acesso:

```bash
npm run create:user -- pessoa@escritorio.adv.br senha-segura
```

O comando precisa de uma chave administrativa do Supabase no `.env.local`.
Em projetos novos, use a Secret key:

```bash
SUPABASE_SECRET_KEY=sua_secret_key
```

Em projetos antigos, também funciona com a chave legacy `service_role`:

```bash
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

Essas chaves nunca devem usar o prefixo `NEXT_PUBLIC_` nem ser expostas no navegador.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
