
-- Primeiro, vamos adicionar novas colunas e tabelas para suportar todas as funcionalidades

-- Adicionar campos avançados para animais
ALTER TABLE animais 
ADD COLUMN IF NOT EXISTS linhagem_genetica TEXT,
ADD COLUMN IF NOT EXISTS origem TEXT,
ADD COLUMN IF NOT EXISTS pais_id UUID REFERENCES animais(id),
ADD COLUMN IF NOT EXISTS maes_id UUID REFERENCES animais(id),
ADD COLUMN IF NOT EXISTS geolocalizacao POINT,
ADD COLUMN IF NOT EXISTS status_saude TEXT DEFAULT 'saudavel',
ADD COLUMN IF NOT EXISTS escore_corporal DECIMAL(3,1);

-- Tabela de histórico de saúde
CREATE TABLE IF NOT EXISTS historico_saude (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id),
  tipo TEXT NOT NULL, -- vacina, exame, tratamento, enfermidade
  descricao TEXT NOT NULL,
  data_aplicacao DATE NOT NULL,
  veterinario_responsavel UUID REFERENCES profiles(user_id),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de anexos por animal
CREATE TABLE IF NOT EXISTS animal_anexos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  animal_id UUID NOT NULL REFERENCES animais(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id),
  tipo TEXT NOT NULL, -- exame, documento, imagem
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT NOT NULL,
  tamanho_bytes BIGINT,
  tipo_mime TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES profiles(user_id)
);

-- Tabela para comparação de receitas
CREATE TABLE IF NOT EXISTS comparacao_receitas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  nome_comparacao TEXT NOT NULL,
  receita_a_id UUID REFERENCES receitas(id),
  receita_b_id UUID REFERENCES receitas(id),
  resultado_analise JSONB,
  created_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de plano de contas rural
CREATE TABLE IF NOT EXISTS plano_contas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL, -- ração, medicamentos, energia, funcionários, etc
  tipo TEXT NOT NULL, -- receita, despesa
  conta_pai_id UUID REFERENCES plano_contas(id),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de movimentações financeiras
CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  conta_id UUID NOT NULL REFERENCES plano_contas(id),
  lote_id UUID REFERENCES lotes(id),
  animal_id UUID REFERENCES animais(id),
  tipo TEXT NOT NULL, -- entrada, saída
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT NOT NULL,
  data_movimentacao DATE NOT NULL,
  documento TEXT,
  observacoes TEXT,
  created_by UUID REFERENCES profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de calendário veterinário
CREATE TABLE IF NOT EXISTS calendario_veterinario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  animal_id UUID REFERENCES animais(id),
  lote_id UUID REFERENCES lotes(id),
  tipo_evento TEXT NOT NULL, -- vacina, check-up, vermifugação
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_agendada DATE NOT NULL,
  data_realizada DATE,
  status TEXT DEFAULT 'agendado', -- agendado, realizado, cancelado
  veterinario_responsavel UUID REFERENCES profiles(user_id),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de tarefas diárias
CREATE TABLE IF NOT EXISTS tarefas_diarias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT NOT NULL, -- ordenha, vacinação, limpeza, alimentação
  prioridade TEXT DEFAULT 'media', -- baixa, media, alta
  data_prevista DATE NOT NULL,
  data_concluida DATE,
  status TEXT DEFAULT 'pendente', -- pendente, em_andamento, concluida
  responsavel_id UUID REFERENCES profiles(user_id),
  executado_por UUID REFERENCES profiles(user_id),
  tempo_estimado INTEGER, -- em minutos
  tempo_real INTEGER, -- em minutos
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  data_admissao DATE,
  data_demissao DATE,
  salario DECIMAL(10,2),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de estoque de insumos
CREATE TABLE IF NOT EXISTS estoque_insumos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL, -- ração, medicamento, vacina, suplemento
  marca TEXT,
  codigo_produto TEXT,
  unidade_medida TEXT NOT NULL, -- kg, litro, unidade
  quantidade_atual DECIMAL(10,3) DEFAULT 0,
  quantidade_minima DECIMAL(10,3) DEFAULT 0,
  preco_unitario DECIMAL(10,2),
  data_validade DATE,
  lote_fornecedor TEXT,
  fornecedor TEXT,
  localizacao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  insumo_id UUID NOT NULL REFERENCES estoque_insumos(id),
  tipo_movimentacao TEXT NOT NULL, -- entrada, saída, ajuste
  quantidade DECIMAL(10,3) NOT NULL,
  motivo TEXT NOT NULL,
  documento TEXT,
  data_movimentacao DATE NOT NULL,
  responsavel_id UUID REFERENCES profiles(user_id),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de sustentabilidade expandida
ALTER TABLE sustentabilidade 
ADD COLUMN IF NOT EXISTS emissao_metano DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS consumo_agua_litros DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS pontuacao_esg DECIMAL(5,2);

-- Tabela de log de alterações
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  user_id UUID NOT NULL REFERENCES profiles(user_id),
  tabela TEXT NOT NULL,
  registro_id UUID NOT NULL,
  acao TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  dados_anteriores JSONB,
  dados_novos JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security para todas as novas tabelas
ALTER TABLE historico_saude ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_anexos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparacao_receitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendario_veterinario ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarefas_diarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_insumos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para company members
CREATE POLICY "Company members can manage historico_saude" ON historico_saude FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage animal_anexos" ON animal_anexos FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage comparacao_receitas" ON comparacao_receitas FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage plano_contas" ON plano_contas FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage movimentacoes_financeiras" ON movimentacoes_financeiras FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage calendario_veterinario" ON calendario_veterinario FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage tarefas_diarias" ON tarefas_diarias FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage funcionarios" ON funcionarios FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage estoque_insumos" ON estoque_insumos FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can manage movimentacoes_estoque" ON movimentacoes_estoque FOR ALL USING (user_has_company_access(auth.uid(), company_id));
CREATE POLICY "Company members can view audit_log" ON audit_log FOR SELECT USING (user_has_company_access(auth.uid(), company_id));

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_historico_saude_animal ON historico_saude(animal_id);
CREATE INDEX IF NOT EXISTS idx_animal_anexos_animal ON animal_anexos(animal_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_financeiras_lote ON movimentacoes_financeiras(lote_id);
CREATE INDEX IF NOT EXISTS idx_calendario_veterinario_data ON calendario_veterinario(data_agendada);
CREATE INDEX IF NOT EXISTS idx_tarefas_diarias_data ON tarefas_diarias(data_prevista);
CREATE INDEX IF NOT EXISTS idx_estoque_insumos_categoria ON estoque_insumos(categoria);

-- Função para gerar QR Code automaticamente
CREATE OR REPLACE FUNCTION generate_animal_qrcode()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qrcode IS NULL THEN
    NEW.qrcode = 'QR-' || NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar QR Code automaticamente
DROP TRIGGER IF EXISTS trigger_generate_qrcode ON animais;
CREATE TRIGGER trigger_generate_qrcode
  BEFORE INSERT ON animais
  FOR EACH ROW
  EXECUTE FUNCTION generate_animal_qrcode();

-- Função para auditoria automática
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (company_id, user_id, tabela, registro_id, acao, dados_anteriores)
    VALUES (OLD.company_id, auth.uid(), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (company_id, user_id, tabela, registro_id, acao, dados_anteriores, dados_novos)
    VALUES (NEW.company_id, auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (company_id, user_id, tabela, registro_id, acao, dados_novos)
    VALUES (NEW.company_id, auth.uid(), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar auditoria nas tabelas principais
CREATE TRIGGER audit_animais AFTER INSERT OR UPDATE OR DELETE ON animais FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_receitas AFTER INSERT OR UPDATE OR DELETE ON receitas FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_lotes AFTER INSERT OR UPDATE OR DELETE ON lotes FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
