# Åpen Capital — Carta de Boas-Vindas

Aplicação web para geração de cartas de boas-vindas personalizadas para novos colaboradores.

---

## Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta na [Vercel](https://vercel.com) para deploy (opcional)

---

## 1. Configurar o Supabase

### 1.1 Criar projeto
1. Acesse [app.supabase.com](https://app.supabase.com) e crie um novo projeto.

### 1.2 Criar tabelas
1. No menu lateral, vá em **SQL Editor**
2. Cole o conteúdo de `supabase/schema.sql` e execute

### 1.3 Criar buckets de Storage
1. Vá em **Storage** → **New bucket**
2. Crie o bucket `fotos_colaboradores` com **Public** ativado
3. Crie o bucket `fotos_contribuicoes` com **Public** ativado

### 1.4 Copiar credenciais
Em **Project Settings → API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Configurar o projeto

```bash
cd apen-boas-vindas
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
ADMIN_PASSWORD=sua_senha_admin
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 3. Adicionar fotos da equipe

Coloque em `public/images/`:
- `mayra-luna.jpg` — Foto da Mayra Luna
- `tulio-cavalcanti.jpg` — Foto do Túlio Cavalcanti
- `logo-apen.png` — Logo da Åpen (opcional)

Formato: JPG/PNG, mínimo 200×200px, quadrada.

---

## 4. Instalar e rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 5. Como usar

### Criar uma carta (admin)
1. Acesse `/` (página inicial)
2. Preencha os dados do novo colaborador, seus próprios dados e os dados das Pessoas Extra 1 e 2
3. Clique em **Criar carta e gerar link**
4. Copie o link gerado e envie pelo WhatsApp

### Colaboradores da Åpen e família
- Todos usam o mesmo link `/carta/[id]`
- Colaboradores se identificam pelo nome cadastrado
- Família seleciona "Família ou amigo(a)"

### Painel admin
- Acesse `/admin/[id]` (substitua `[id]` pelo ID da carta)
- Informe a senha configurada em `ADMIN_PASSWORD`
- Gerencie contribuições, mova entre páginas, gere o PDF

### Preview
- Acesse `/preview/[id]` para ver o layout completo
- Use Ctrl+P (ou ⌘+P) → **Salvar como PDF**

---

## 6. Deploy na Vercel

```bash
npm i -g vercel
vercel
```

Configure as mesmas variáveis de ambiente no painel da Vercel.

**Atenção para PDF no Vercel:** O Puppeteer requer configuração especial em ambientes serverless. Substitua no `package.json`:

```json
"puppeteer-core": "^21.7.0",
"@sparticuz/chromium": "^119.0.0"
```

E atualize `app/api/pdf/[id]/route.ts` para usar `@sparticuz/chromium` como executável.

Como alternativa, use a página `/preview/[id]` com a impressão do navegador — o resultado é idêntico ao PDF gerado pelo Puppeteer.

---

## Estrutura do projeto

```
app/
  page.tsx                  ← Criação da carta (admin)
  carta/[id]/               ← Link colaborativo
  admin/[id]/               ← Painel do admin
  preview/[id]/             ← Preview para impressão
  api/
    cartas/                 ← CRUD de cartas
    contribuicoes/          ← CRUD de contribuições
    pdf/[id]/               ← Geração de PDF
    admin/auth/             ← Autenticação do admin
lib/
  types.ts                  ← Tipos TypeScript
  supabase.ts               ← Cliente Supabase (browser)
  supabase-admin.ts         ← Cliente Supabase (server)
  pdf-template.ts           ← Template HTML do PDF
public/images/              ← Fotos fixas da equipe
supabase/schema.sql         ← Schema do banco de dados
```
