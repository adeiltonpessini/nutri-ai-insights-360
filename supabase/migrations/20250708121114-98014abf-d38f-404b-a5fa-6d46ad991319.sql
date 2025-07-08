-- Criar enums para o sistema
CREATE TYPE public.user_role AS ENUM ('super_admin', 'company_admin', 'veterinario', 'cliente', 'tecnico');
CREATE TYPE public.animal_species AS ENUM ('bovino', 'suino', 'aves', 'caprino', 'ovino', 'equino', 'outros');
CREATE TYPE public.production_phase AS ENUM ('cria', 'recria', 'engorda', 'reproducao', 'lactacao', 'manutencao');
CREATE TYPE public.subscription_plan AS ENUM ('basico', 'profissional', 'enterprise');

-- Tabela de empresas/companhias
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  subscription_plan subscription_plan DEFAULT 'basico',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  max_animals INTEGER DEFAULT 100,
  max_users INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  empresa TEXT,
  telefone TEXT,
  avatar_url TEXT,
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles dos usuários
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  role public.user_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id, role)
);

-- Tabela de propriedades/fazendas
CREATE TABLE public.propriedades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  endereco TEXT,
  area_hectares DECIMAL,
  tipo_criacao TEXT NOT NULL,
  capacidade_animais INTEGER,
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de lotes de animais
CREATE TABLE public.lotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  propriedade_id UUID NOT NULL REFERENCES public.propriedades(id),
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  raca TEXT,
  quantidade_animais INTEGER NOT NULL,
  peso_medio_inicial DECIMAL,
  peso_medio_atual DECIMAL,
  idade_media_dias INTEGER,
  data_inicio DATE NOT NULL,
  objetivo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de diagnósticos
CREATE TABLE public.diagnosticos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lote_id UUID REFERENCES public.lotes(id),
  tipo_diagnostico TEXT NOT NULL,
  imagem_url TEXT,
  observacoes TEXT,
  resultados JSONB,
  recomendacoes JSONB,
  confianca_ia DECIMAL,
  status TEXT NOT NULL DEFAULT 'processando',
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de formulações de ração
CREATE TABLE public.formulacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  fase TEXT NOT NULL,
  ingredientes JSONB NOT NULL,
  valores_nutricionais JSONB NOT NULL,
  custo_por_kg DECIMAL,
  observacoes TEXT,
  is_favorita BOOLEAN DEFAULT false,
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de performance
CREATE TABLE public.performance_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lote_id UUID NOT NULL REFERENCES public.lotes(id),
  data_medicao DATE NOT NULL,
  peso_medio DECIMAL,
  ganho_peso_diario DECIMAL,
  conversao_alimentar DECIMAL,
  consumo_racao_kg DECIMAL,
  mortalidade_periodo INTEGER DEFAULT 0,
  observacoes TEXT,
  company_id UUID REFERENCES public.companies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de produtos das empresas
CREATE TABLE public.company_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2),
  unit TEXT NOT NULL,
  composition JSONB,
  benefits JSONB,
  usage_instructions TEXT,
  storage_instructions TEXT,
  image_url TEXT,
  images JSONB,
  specifications JSONB,
  certifications JSONB,
  target_species JSONB,
  target_phase JSONB,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER,
  min_order_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela animais
CREATE TABLE public.animais (
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
CREATE TABLE public.produtos_anutri (
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

-- Tabela receitas
CREATE TABLE public.receitas (
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
CREATE TABLE public.simulacoes_racao (
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
CREATE TABLE public.sustentabilidade (
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
CREATE TABLE public.metricas_performance (
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

-- Função para verificar role do usuário
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID, comp_id UUID)
RETURNS public.user_role AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND company_id = comp_id 
    AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para verificar se usuário tem acesso à empresa
CREATE OR REPLACE FUNCTION public.user_has_company_access(user_uuid UUID, comp_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND company_id = comp_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS nas tabelas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propriedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formulacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.animais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_anutri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulacoes_racao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sustentabilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_performance ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para companies
CREATE POLICY "Super admins podem ver todas as empresas"
ON public.companies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  )
);

CREATE POLICY "Usuários podem ver sua própria empresa"
ON public.companies FOR SELECT
USING (
  id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Políticas RLS para user_roles
CREATE POLICY "Super admins podem gerenciar todas as roles"
ON public.user_roles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  )
);

CREATE POLICY "Company admins podem gerenciar roles da empresa"
ON public.user_roles FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'company_admin' 
    AND is_active = true
  )
);

-- Políticas para profiles
CREATE POLICY "Usuários podem ver perfis da mesma empresa"
ON public.profiles FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
  ) OR auth.uid() = user_id
);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Políticas para company_products
CREATE POLICY "Produtos são visíveis para usuários da empresa"
ON public.company_products FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

CREATE POLICY "Company admins podem gerenciar produtos"
ON public.company_products FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('company_admin') 
    AND is_active = true
  )
);

-- Políticas para outras tabelas (usando user_has_company_access)
CREATE POLICY "Company members can view properties" ON propriedades FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert properties" ON propriedades FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update properties" ON propriedades FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view lotes" ON lotes FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert lotes" ON lotes FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update lotes" ON lotes FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view diagnostics" ON diagnosticos FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert diagnostics" ON diagnosticos FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view formulations" ON formulacoes FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert formulations" ON formulacoes FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update formulations" ON formulacoes FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view performance" ON performance_historico FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert performance" ON performance_historico FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view animals" ON animais FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert animals" ON animais FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update animals" ON animais FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete animals" ON animais FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view products" ON produtos_anutri FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert products" ON produtos_anutri FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update products" ON produtos_anutri FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete products" ON produtos_anutri FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view recipes" ON receitas FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert recipes" ON receitas FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update recipes" ON receitas FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete recipes" ON receitas FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view simulations" ON simulacoes_racao FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert simulations" ON simulacoes_racao FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update simulations" ON simulacoes_racao FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can delete simulations" ON simulacoes_racao FOR DELETE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view sustainability" ON sustentabilidade FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert sustainability" ON sustentabilidade FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update sustainability" ON sustentabilidade FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

CREATE POLICY "Company members can view metrics" ON metricas_performance FOR SELECT USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can insert metrics" ON metricas_performance FOR INSERT WITH CHECK (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can update metrics" ON metricas_performance FOR UPDATE USING (user_has_company_access(auth.uid(), company_id));

-- Triggers para timestamps
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_propriedades_updated_at
  BEFORE UPDATE ON public.propriedades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lotes_updated_at
  BEFORE UPDATE ON public.lotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_formulacoes_updated_at
  BEFORE UPDATE ON public.formulacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_products_updated_at
  BEFORE UPDATE ON public.company_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_animais_updated_at BEFORE UPDATE ON animais FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_produtos_anutri_updated_at BEFORE UPDATE ON produtos_anutri FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_receitas_updated_at BEFORE UPDATE ON receitas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Buckets de storage para imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diagnostics', 'diagnostics', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Políticas para bucket de diagnósticos
CREATE POLICY "Usuários podem ver imagens de diagnóstico" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'diagnostics');

CREATE POLICY "Usuários podem fazer upload de diagnósticos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'diagnostics' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas para bucket de avatars
CREATE POLICY "Avatars são públicos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários podem fazer upload de avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Inserir empresa padrão para desenvolvimento
INSERT INTO public.companies (name, slug, description) 
VALUES ('NutriScan360 Demo', 'nutriscan-demo', 'Empresa de demonstração do sistema NutriScan360');

-- Inserir produto de exemplo
INSERT INTO public.company_products (
  company_id, 
  name, 
  description, 
  category, 
  price, 
  unit,
  target_species,
  target_phase
) VALUES (
  (SELECT id FROM public.companies WHERE slug = 'nutriscan-demo'),
  'Ração Premium Bovinos',
  'Ração completa para bovinos em fase de engorda',
  'racao',
  85.50,
  'saco_25kg',
  '["bovinos"]',
  '["engorda", "crescimento"]'
);

-- Inserir produtos de exemplo no catálogo ANutri
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
FROM companies c WHERE c.slug = 'nutriscan-demo';