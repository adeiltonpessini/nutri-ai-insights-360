-- Criar enum para roles do sistema
CREATE TYPE public.user_role AS ENUM ('super_admin', 'company_admin', 'veterinario', 'cliente');

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
  subscription_plan TEXT DEFAULT 'basic',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
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

-- Tabela de produtos das empresas
CREATE TABLE public.company_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2),
  unit TEXT NOT NULL, -- kg, ton, saco, etc
  composition JSONB, -- composição nutricional
  benefits JSONB, -- benefícios do produto
  usage_instructions TEXT,
  storage_instructions TEXT,
  image_url TEXT,
  images JSONB, -- array de URLs de imagens
  specifications JSONB, -- especificações técnicas
  certifications JSONB, -- certificações
  target_species JSONB, -- espécies alvo
  target_phase JSONB, -- fases alvo (crescimento, engorda, etc)
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER,
  min_order_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atualizar tabela de profiles para incluir company_id
ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Atualizar outras tabelas para incluir company_id
ALTER TABLE public.propriedades ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.lotes ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.diagnosticos ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.formulacoes ADD COLUMN company_id UUID REFERENCES public.companies(id);
ALTER TABLE public.performance_historico ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_products ENABLE ROW LEVEL SECURITY;

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

-- Políticas RLS para company_products
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

-- Atualizar políticas existentes para incluir company_id

-- Políticas para profiles
DROP POLICY IF EXISTS "Usuários podem ver perfis públicos" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;

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

-- Triggers para timestamps
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_products_updated_at
  BEFORE UPDATE ON public.company_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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