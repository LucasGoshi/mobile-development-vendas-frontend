export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  quantidade: number;
  precoCompra: number;
  precoVenda: number;
  grupo: Grupo;
  fabricante: Fabricante;
}

export type ProdutoUpdate = Omit<Produto, "grupo" | "fabricante"> & {
  grupo: Pick<Produto, "id"> | null;
  fabricante: Pick<Fabricante, "id"> | null;
};

export type ProdutoCreate = Omit<ProdutoUpdate, "id">;

export interface Fabricante {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  vendedor: string;
}

export interface Grupo {
  id: number;
  nome: string;
  descricao: string;
  grupoParenteId: number | null;
}

export interface Venda {
  id: number;
  quantidade: number;
  produto: Produto;
  dateTime: string;
}

export type VendaUpdate = Omit<Venda, "produto"> & {
  produto: { id: number };
};

export type VendaCreate = Omit<VendaUpdate, "id">;
