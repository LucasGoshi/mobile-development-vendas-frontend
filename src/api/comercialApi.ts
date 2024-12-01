const API_BASE = "http://localhost:8080/comercial"; // Colocar URL do backend
import type { Venda } from "../api/entities"; 

// Tipo genérico para os retornos
const get = async <T>(route: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${route}`);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar: ${response.statusText}`);
  }

  const responseBody: T = await response.json();
  return responseBody;
};


// Função para obter todas as vendas
export const vendaGetAll = (): Promise<Venda[]> => get<Venda[]>("/api/venda");
