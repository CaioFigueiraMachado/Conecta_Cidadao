/* Script SQL para configurar o banco de dados do Conecta Cidadão
 * Execute este script no Supabase SQL Editor */

/* ============================================ */
/* 1. TABELA USERS - Garantir colunas de imagem */
/* ============================================ */
ALTER TABLE users ADD COLUMN IF NOT EXISTS profilepic TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bannerpic TEXT;

/* ============================================ */
/* 2. TABELA BENEFITS - Garantir colunas adicionais */
/* ============================================ */
ALTER TABLE benefits ADD COLUMN IF NOT EXISTS imagem TEXT;
ALTER TABLE benefits ADD COLUMN IF NOT EXISTS descricao TEXT DEFAULT '';

/* ============================================ */
/* 3. TABELA REDEEMED - Histórico de resgates */
/* ============================================ */
/* A tabela 'redeemed' deve existir, mas garantimos a estrutura:
 * Se não existir, cria:
 */
CREATE TABLE IF NOT EXISTS redeemed (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  benefit_id BIGINT REFERENCES benefits(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  empresa TEXT NOT NULL,
  pontos INTEGER NOT NULL,
  code TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/* ============================================ */
/* 4. TABELA POINTS_TRANSACTIONS - Extrato unificado de pontos */
/* ============================================ */
/* Registra todas as transações: créditos (pontos recebidos) e débitos (pontos gastos)
 */
CREATE TABLE IF NOT EXISTS points_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('credito', 'debito')),
  pontos INTEGER NOT NULL,
  descricao TEXT NOT NULL,
  origem TEXT NOT NULL CHECK (origem IN ('relatorio', 'resgate', 'ajuste', 'bonus')),
  referencia_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

/* Índices para performance
 */
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON points_transactions(created_at DESC);

/* ============================================ */
/* 5. RLS - Políticas de segurança (se necessário) */
/* ============================================ */
/* Habilita RLS na tabela users (se ainda não estiver)
 */
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

/* Política: usuários podem atualizar próprio perfil (incluindo pontos)
 */
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

/* Habilita RLS na tabela benefits (se ainda não estiver)
 */
ALTER TABLE benefits ENABLE ROW LEVEL SECURITY;

/* Política: leitura pública de benefícios
 */
DROP POLICY IF EXISTS "Public benefits read access" ON benefits;
CREATE POLICY "Public benefits read access"
ON benefits FOR SELECT
USING (true);

/* Política: parceiros podem inserir/atualizar seus próprios benefícios
 */
DROP POLICY IF EXISTS "Partners can manage own benefits" ON benefits;
CREATE POLICY "Partners can manage own benefits"
ON benefits FOR ALL
USING (auth.uid() = partner_id)
WITH CHECK (auth.uid() = partner_id);

/* Habilita RLS na tabela redeemed (se ainda não estiver)
 */
ALTER TABLE redeemed ENABLE ROW LEVEL SECURITY;

/* Política: usuários podem ver seus próprios resgates
 */
DROP POLICY IF EXISTS "Users can view own redeems" ON redeemed;
CREATE POLICY "Users can view own redeems"
ON redeemed FOR SELECT
USING (auth.uid() = user_id);

/* Política: usuários podem inserir seus próprios resgates
 */
DROP POLICY IF EXISTS "Users can insert own redeems" ON redeemed;
CREATE POLICY "Users can insert own redeems"
ON redeemed FOR INSERT
WITH CHECK (auth.uid() = user_id);

/* ============================================ */
/* 6. RLS - points_transactions */
/* ============================================ */
/* Habilita RLS na tabela points_transactions
 */
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

/* Política: usuários podem ver suas próprias transações
 */
DROP POLICY IF EXISTS "Users can view own transactions" ON points_transactions;
CREATE POLICY "Users can view own transactions"
ON points_transactions FOR SELECT
USING (auth.uid() = user_id);

/* Política: usuários podem inserir suas próprias transações
 */
DROP POLICY IF EXISTS "Users can insert own transactions" ON points_transactions;
CREATE POLICY "Users can insert own transactions"
ON points_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

/* ============================================ */
/* 7. RECARREGAR CACHE */
/* ============================================ */
NOTIFY pgrst, 'reload schema';
