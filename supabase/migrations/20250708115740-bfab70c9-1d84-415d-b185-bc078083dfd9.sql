
-- Expandir roles existentes
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'tecnico';

-- Criar novos enums
CREATE TYPE IF NOT EXISTS animal_species AS ENUM ('bovino', 'suino', 'aves', 'caprino', 'ovino', 'equino', 'outros');
CREATE TYPE IF NOT EXISTS production_phase AS ENUM ('cria', 'recria', 'engorda', 'reproducao', 'lactacao', 'manutencao');
CREATE TYPE IF NOT EXISTS subscription_plan AS ENUM ('basico', 'profissional', 'enterprise');

-- Atualizar tabela companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_plan subscription_plan DEFAULT 'basico';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS max_animals INTEGER DEFAULT 100;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS max_users INTEGER DEFAULT 5;

-- Tabela animais
CREATE TABLE IF NOT EXISTS public.animais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  especie animal_species NOT NULL,
  raca VARCHAR(255),
  peso DECIMAL(10,2),
  data_nascimento DATE,
  fase_produtiva production_phase,
  foto_url TEXT,
  qrcode TEXT,
  observacoes TEXT,
  proprietario_id UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela produtos_anutri (catálogo de produtos)
CREATE TABLE IF NOT EXISTS public.produtos_anutri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  linha VARCHAR(255),
  categoria VARCHAR(255),
  especie_alvo animal_species[],
  fase_alvo production_phase[],
  objetivo TEXT,
  beneficios TEXT[],
  restricoes TEXT[],
  composicao JSONB,
  preco_por_kg DECIMAL(10,2),
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela diagnosticos
CREATE TABLE IF NOT EXISTS public.diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
  tecnico_id UUID NOT NULL REFERENCES profiles(user_id),
  imagem_url TEXT,
  observacoes TEXT,
  resultados_ia JSONB,
  condicao_corporal INTEGER CHECK (condicao_corporal BETWEEN 1 AND 5),
  peso_atual DECIMAL(10,2),
  recomendacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela receitas
CREATE TABLE IF NOT EXISTS public.receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  animal_id UUID REFERENCES animais(id),
  tecnico_id UUID NOT NULL REFERENCES profiles(user_id),
  formula JSONB NOT NULL,
  objetivo TEXT,
  produto_sugerido_id UUID REFERENCES produtos_anutri(id),
  custo_estimado DECIMAL(10,2),
  eficiencia_esperada DECIMAL(5,2),
  observacoes TEXT,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela simulacoes_racao
CREATE TABLE IF NOT EXISTS public.simulacoes_racao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animais(id),
  usuario_id UUID NOT NULL REFERENCES profiles(user_id),
  nome_simulacao VARCHAR(255) NOT NULL,
  formula JSONB NOT NULL,
  custo_total DECIMAL(10,2),
  custo_por_kg DECIMAL(10,2),
  eficiencia_estimada DECIMAL(5,2),
  substituicoes JSONB,
  impacto_ambiental JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela sustentabilidade
CREATE TABLE IF NOT EXISTS public.sustentabilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animais(id),
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  pegada_carbono DECIMAL(10,4),
  uso_agua DECIMAL(10,2),
  fcr DECIMAL(5,3),
  eficiencia_energetica DECIMAL(5,2),
  residuos_gerados DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela metricas_performance
CREATE TABLE IF NOT EXISTS public.metricas_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  animal_id UUID NOT NULL REFERENCES animais(id),
  receita_id UUID REFERENCES receitas(id),
  data_medicao DATE NOT NULL,
  peso DECIMAL(10,2),
  ganho_peso_diario DECIMAL(5,3),
  consumo_racao DECIMAL(8,2),
  conversao_alimentar DECIMAL(5,3),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_animais_updated_at BEFORE UPDATE ON animais FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_produtos_anutri_updated_at BEFORE UPDATE ON produtos_anutri FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_receitas_updated_at BEFORE UPDATE ON receitas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS Policies
ALTER TABLE animais ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos_anutri ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulacoes_racao ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustentabilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_performance ENABLE ROW LEVEL SECURITY;

-- Policies para animais
CREATE POLICY "Company members can view animals" ON animais FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert animals" ON animais FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update animals" ON animais FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete animals" ON animais FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

-- Policies para produtos_anutri
CREATE POLICY "Company members can view products" ON produtos_anutri FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert products" ON produtos_anutri FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update products" ON produtos_anutri FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete products" ON produtos_anutri FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

-- Policies para diagnosticos
CREATE POLICY "Company members can view diagnostics" ON diagnosticos FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert diagnostics" ON diagnosticos FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update diagnostics" ON diagnosticos FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

-- Policies para receitas
CREATE POLICY "Company members can view recipes" ON receitas FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert recipes" ON receitas FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update recipes" ON receitas FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete recipes" ON receitas FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

-- Policies para simulacoes_racao
CREATE POLICY "Company members can view simulations" ON simulacoes_racao FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert simulations" ON simulacoes_racao FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update simulations" ON simulacoes_racao FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete simulations" ON simulacoes_racao FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

-- Policies para sustentabilidade
CREATE POLICY "Company members can view sustainability" ON sustentabilidade FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert sustainability" ON sustentabilidade FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update sustainability" ON sustentabilidade FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

-- Policies para metricas_performance
CREATE POLICY "Company members can view metrics" ON metricas_performance FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert metrics" ON metricas_performance FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update metrics" ON metricas_performance FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

-- Inserir dados de exemplo para desenvolvimento
INSERT INTO companies (name, slug, description) VALUES 
('NutriScan Demo', 'nutriscan-demo', 'Empresa de demonstração do sistema'),
('AgroTech Solutions', 'agrotech-solutions', 'Empresa especializada em tecnologia agrícola')
ON CONFLICT (slug) DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO produtos_anutri (company_id, nome, linha, categoria, especie_alvo, fase_alvo, objetivo, beneficios, preco_por_kg) 
SELECT 
  c.id,
  'Ração Bovino Crescimento Premium',
  'Premium Line',
  'Ração Completa',
  ARRAY['bovino']::animal_species[],
  ARRAY['cria', 'recria']::production_phase[],
  'Maximizar ganho de peso em bovinos jovens',
  ARRAY['Alto teor proteico', 'Digestibilidade superior', 'Fortificado com vitaminas'],
  4.50
FROM companies c WHERE c.slug = 'nutriscan-demo'
ON CONFLICT DO NOTHING;
