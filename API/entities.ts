export interface Product{
    id: number,
    nome: string,
    descricao: string,
    precoCompra: number,
    precoVenda: number,
    grupo: Grupo, 
    fabricante: Fabricante
}
export interface Fabricante

{
    id: number,
    nomeFantasia: string,
    razaoSocial: string,
    cnpj: number,
    endereco: string,
    telefone: number,
    email: string,
    vendedor: string
}


export interface Grupo

{
    id: number,
    nome: string,
    descricao: string,
    grupoParenteId: null
}

export interface Venda

{
    id: number,
    quantidade: number,
    produto: Product,
    dateTime: number,
}
