-- Criar tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  empresa TEXT,
  telefone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Usuários podem ver perfis públicos" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Tabela de propriedades/fazendas
CREATE TABLE public.propriedades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  endereco TEXT,
  area_hectares DECIMAL,
  tipo_criacao TEXT NOT NULL, -- bovinos, suinos, aves, etc
  capacidade_animais INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.propriedades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas propriedades" 
ON public.propriedades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar propriedades" 
ON public.propriedades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas propriedades" 
ON public.propriedades 
FOR UPDATE 
USING (auth.uid() = user_id);

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
  objetivo TEXT NOT NULL, -- engorda, lactacao, reproducao, etc
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.lotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus lotes" 
ON public.lotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar lotes" 
ON public.lotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus lotes" 
ON public.lotes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Tabela de diagnósticos
CREATE TABLE public.diagnosticos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lote_id UUID REFERENCES public.lotes(id),
  tipo_diagnostico TEXT NOT NULL, -- foto_fezes, foto_animal, dados_campo
  imagem_url TEXT,
  observacoes TEXT,
  resultados JSONB,
  recomendacoes JSONB,
  confianca_ia DECIMAL,
  status TEXT NOT NULL DEFAULT 'processando',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus diagnósticos" 
ON public.diagnosticos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar diagnósticos" 
ON public.diagnosticos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Tabela de formulações de ração
CREATE TABLE public.formulacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  fase TEXT NOT NULL, -- crescimento, engorda, lactacao, etc
  ingredientes JSONB NOT NULL,
  valores_nutricionais JSONB NOT NULL,
  custo_por_kg DECIMAL,
  observacoes TEXT,
  is_favorita BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.formulacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas formulações" 
ON public.formulacoes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar formulações" 
ON public.formulacoes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas formulações" 
ON public.formulacoes 
FOR UPDATE 
USING (auth.uid() = user_id);

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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.performance_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver histórico de seus lotes" 
ON public.performance_historico 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir dados de performance" 
ON public.performance_historico 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

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

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar timestamps
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