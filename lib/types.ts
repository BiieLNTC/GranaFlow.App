// Autenticação
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cadastradoEm: string;
}

// Transações
export interface Transacao {
  id: number;
  usuarioId: number;
  categoriaId: number;
  nomeCategoria: string,
  corCategoria: string,
  pessoaId: number;
  nomePessoa: string;
  dataTransacao: string;
  descricao: string;
  tipo: TipoTransacao;
  valor: number;
  cadastradoEm: string;
}

export interface CreateTransacaoRequest {
  categoriaId: number;
  pessoaId: number;
  dataTransacao: string;
  descricao: string;
  tipo: number;
  valor: number;
}

// Categorias
export interface Categoria {
  id: number;
  usuarioId: number;
  descricao: string;
  finalidade: number;
  cor: string;
}

export interface CreateCategoriaRequest {
  id: number;
  descricao: string;
  finalidade: number;
  cor: string;
}

// Pessoas
export interface Pessoa {
  id: number;
  usuarioId: number;
  nome: string;
  dataNascimento: string;
  cadastradoEm: string;
}

export interface CreatePessoaRequest {
  nome: string;
  dataNascimento: string;
}

// Enum para tipos de transação
export enum TipoTransacao {
  Despesa = 1,
  Receita = 2
}

export interface TotaisTransacoes {
  saldoTotal: number
  saldoReceitasMes: number
  totalReceitasMes: number
  saldoDespesasMes: number
  totalDespesasMes: number
}

export const DEFAULT_TOTAIS_TRANSACOES: TotaisTransacoes = {
  saldoTotal: 0,
  saldoReceitasMes: 0,
  totalReceitasMes: 0,
  saldoDespesasMes: 0,
  totalDespesasMes: 0,
};

export interface TotaisPessoa {
  nome: string
  receitas: number
  despesas: number
  saldo: number
}

// Helper para calcular idade
export function calcularIdade(dataNascimento: string): number {
  const today = new Date();
  const birthDate = new Date(dataNascimento);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Verificar se pessoa é menor de idade
export function ehMenorDeIdade(dataNascimento: string): boolean {
  return calcularIdade(dataNascimento) < 18;
}