import type {
  Fabricante,
  Grupo,
  Produto,
  ProdutoCreate,
  ProdutoUpdate,
  Venda,
  VendaCreate,
  VendaUpdate,
} from "./entities";

const API_BASE = "http://localhost:8080/comercial";

const get = async <T>(route: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${route}`);
  const responseBody = await response.json();
  return responseBody;
};

const post = async <T>(route: string, body: T): Promise<T> => {
  const response = await fetch(`${API_BASE}${route}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json();
  return responseBody;
};

const put = async <T>(route: string, body: T): Promise<T> => {
  const response = await fetch(`${API_BASE}${route}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseBody = await response.json();
  return responseBody;
};

const httpDelete = async (route: string): Promise<void> => {
  await fetch(`${API_BASE}${route}`, {
    method: "DELETE",
  });
};

export const produtoGetAll = () => get<Produto[]>("/api/produto");
export const produtoGetOne = (id: number) => get<Produto>(`/api/produto/${id}`);
export const produtoCreate = (produto: ProdutoCreate) => post("/api/produto/novo", produto);
export const produtoUpdate = (produto: ProdutoUpdate) =>
  put(`/api/produto/atualizar/${produto.id}`, produto);
export const produtoDelete = (id: number) => httpDelete(`/api/produto/remover/${id}`);

export const fabricanteGetAll = () => get<Fabricante[]>("/api/fabricante");
export const fabricanteGetOne = (id: number) => get<Fabricante>(`/api/fabricante/${id}`);
export const fabricanteCreate = (fabricante: Omit<Fabricante, "id">) =>
  post("/api/fabricante/novo", fabricante);
export const fabricanteUpdate = (fabricante: Fabricante) =>
  put(`/api/fabricante/atualizar/${fabricante.id}`, fabricante);
export const fabricanteDelete = (id: number) => httpDelete(`/api/fabricante/remover/${id}`);

export const vendaGetAll = () => get<Venda[]>("/api/venda");
export const vendaGetOne = (id: number) => get<Venda>(`/api/venda/${id}`);
export const vendaCreate = (venda: VendaCreate) => post("/api/venda/novo", venda);
export const vendaUpdate = (venda: VendaUpdate) => put(`/api/venda/atualizar/${venda.id}`, venda);
export const vendaDelete = (id: number) => httpDelete(`/api/venda/remover/${id}`);

export const grupoGetAll = () => get<Grupo[]>("/api/grupo");
export const grupoGetOne = (id: number) => get<Grupo>(`/api/grupo/${id}`);
export const grupoCreate = (grupo: Omit<Grupo, "id">) => post("/api/grupo/novo", grupo);
export const grupoUpdate = (grupo: Grupo) => put(`/api/grupo/atualizar/${grupo.id}`, grupo);
export const grupoDelete = (id: number) => httpDelete(`/api/grupo/remover/${id}`);
