
-- Criar enums
CREATE TYPE organization_type AS ENUM ('vet', 'empresa', 'fazenda');
CREATE TYPE organization_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE user_role_type AS ENUM ('admin', 'vet', 'colaborador', 'empresa_admin', 'fazendeiro', 'super_admin');
CREATE TYPE diagnostic_mode AS ENUM ('manual', 'ia');
CREATE TYPE animal_sex AS ENUM ('macho', 'femea');

-- Tabela de organizações
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type organization_type NOT NULL,
  plan organization_plan NOT NULL DEFAULT 'free',
  limite_animais INTEGER DEFAULT 10,
  limite_funcionarios INTEGER DEFAULT 2,
  limite_produtos INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de usuários (profiles)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  role user_role_type NOT NULL DEFAULT 'colaborador',
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- ========== SEÇÃO CLÍNICA VETERINÁRIA ==========

-- Tabela de animais (para clínicas)
CREATE TABLE public.animais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  raca TEXT,
  peso NUMERIC,
  data_nasc DATE,
  sexo animal_sex,
  cpf_tutor TEXT,
  foto_url TEXT,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de diagnósticos
CREATE TABLE public.diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  animal_id UUID NOT NULL REFERENCES animais(id),
  veterinario_id UUID REFERENCES user_profiles(user_id),
  tipo TEXT NOT NULL,
  modo diagnostic_mode NOT NULL DEFAULT 'manual',
  confianca_ia NUMERIC CHECK (confianca_ia >= 0 AND confianca_ia <= 100),
  descricao TEXT,
  recomendacoes TEXT,
  imagem_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de receitas
CREATE TABLE public.receitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  animal_id UUID NOT NULL REFERENCES animais(id),
  veterinario_id UUID REFERENCES user_profiles(user_id),
  medicamento TEXT NOT NULL,
  dosagem TEXT NOT NULL,
  duracao_dias INTEGER NOT NULL,
  observacoes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fórmulas
CREATE TABLE public.formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  veterinario_id UUID REFERENCES user_profiles(user_id),
  nome TEXT NOT NULL,
  ingredientes JSONB NOT NULL,
  custo_estimado NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Estoque da clínica
CREATE TABLE public.estoque_clinica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  validade DATE,
  alerta_minimo INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== SEÇÃO EMPRESAS ==========

-- Tabela de produtos
CREATE TABLE public.produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  composicao TEXT,
  modo_uso TEXT,
  especie_alvo TEXT[],
  fase_alvo TEXT[],
  preco_kg NUMERIC,
  registro_mapa TEXT,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indicações de produtos por veterinários
CREATE TABLE public.indicacoes_produto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  veterinario_id UUID NOT NULL REFERENCES user_profiles(user_id),
  produto_id UUID NOT NULL REFERENCES produtos(id),
  animal_id UUID REFERENCES animais(id),
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Métricas de indicações
CREATE TABLE public.indicacoes_metricas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos(id),
  veterinario_id UUID NOT NULL REFERENCES user_profiles(user_id),
  animal_id UUID REFERENCES animais(id),
  org_id UUID NOT NULL REFERENCES organizations(id),
  data_indicacao TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== SEÇÃO FAZENDAS ==========

-- Tabela de lotes
CREATE TABLE public.lotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  nome TEXT NOT NULL,
  finalidade TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  status TEXT DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Animais de fazenda
CREATE TABLE public.animais_fazenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  lote_id UUID REFERENCES lotes(id),
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  peso NUMERIC,
  data_nasc DATE,
  qr_code_url TEXT,
  brinco TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vacinações
CREATE TABLE public.vacinacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  animal_id UUID REFERENCES animais_fazenda(id),
  vacina TEXT NOT NULL,
  data_aplicacao DATE NOT NULL,
  reforco_previsto DATE,
  fabricante TEXT,
  lote_fabricacao TEXT,
  veterinario_id UUID REFERENCES user_profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Estoque da fazenda
CREATE TABLE public.estoque_fazenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 0,
  validade DATE,
  entrada DATE,
  saida DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Eventos zootécnicos
CREATE TABLE public.eventos_zootecnicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  animal_id UUID REFERENCES animais_fazenda(id),
  lote_id UUID REFERENCES lotes(id),
  tipo_evento TEXT NOT NULL,
  data_evento DATE NOT NULL,
  observacoes TEXT,
  peso_registrado NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========== FUNÇÕES AUXILIARES ==========

-- Função para obter organização do usuário
CREATE OR REPLACE FUNCTION get_user_org()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT org_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para verificar se usuário pertence à organização
CREATE OR REPLACE FUNCTION user_belongs_to_org(org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND org_id = org_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role_type AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM user_profiles 
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ========== RLS POLICIES ==========

-- Ativar RLS em todas as tabelas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE animais ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_clinica ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes_produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes_metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE animais_fazenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacinacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_fazenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_zootecnicos ENABLE ROW LEVEL SECURITY;

-- Policies para organizations
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (id = get_user_org());

CREATE POLICY "Super admins can view all organizations" ON organizations
  FOR SELECT USING (get_user_role() = 'super_admin');

-- Policies para user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view profiles in same org" ON user_profiles
  FOR SELECT USING (org_id = get_user_org());

-- Policies genéricas para isolamento por organização
CREATE POLICY "org_isolation_select" ON animais
  FOR SELECT USING (user_belongs_to_org(org_id));

CREATE POLICY "org_isolation_insert" ON animais
  FOR INSERT WITH CHECK (user_belongs_to_org(org_id));

CREATE POLICY "org_isolation_update" ON animais
  FOR UPDATE USING (user_belongs_to_org(org_id));

CREATE POLICY "org_isolation_delete" ON animais
  FOR DELETE USING (user_belongs_to_org(org_id));

-- Aplicar policies similares para todas as outras tabelas
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('diagnosticos', 'receitas', 'formulas', 'estoque_clinica', 
                          'produtos', 'indicacoes_produto', 'indicacoes_metricas',
                          'lotes', 'animais_fazenda', 'vacinacoes', 'estoque_fazenda', 
                          'eventos_zootecnicos')
    LOOP
        EXECUTE format('CREATE POLICY "org_isolation_select" ON %I FOR SELECT USING (user_belongs_to_org(org_id))', tbl);
        EXECUTE format('CREATE POLICY "org_isolation_insert" ON %I FOR INSERT WITH CHECK (user_belongs_to_org(org_id))', tbl);
        EXECUTE format('CREATE POLICY "org_isolation_update" ON %I FOR UPDATE USING (user_belongs_to_org(org_id))', tbl);
        EXECUTE format('CREATE POLICY "org_isolation_delete" ON %I FOR DELETE USING (user_belongs_to_org(org_id))', tbl);
    END LOOP;
END $$;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas que possuem updated_at
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND column_name = 'updated_at'
    LOOP
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', tbl, tbl);
    END LOOP;
END $$;

-- Inserir organização padrão para super admin
INSERT INTO organizations (name, type, plan, limite_animais, limite_funcionarios, limite_produtos)
VALUES ('InfinityVet Admin', 'vet', 'enterprise', 999999, 999999, 999999);

-- Definir usuário como super admin (substitua pelo seu email)
INSERT INTO user_profiles (user_id, org_id, role, nome, email)
SELECT 
  au.id,
  o.id,
  'super_admin'::user_role_type,
  COALESCE(au.raw_user_meta_data->>'nome', au.email),
  au.email
FROM auth.users au
CROSS JOIN organizations o
WHERE au.email = 'adeilton.ata@gmail.com' 
AND o.name = 'InfinityVet Admin'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin'::user_role_type,
  org_id = EXCLUDED.org_id;
