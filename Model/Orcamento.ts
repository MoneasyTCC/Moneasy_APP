export class Orcamento{
    id: string;
    usuarioId: string;
    categoria: string;
    descricao?: string;
    valor: number;
  
    constructor(usuarioId: string,id: string, categoria: string, descricao: string, valor: number) {
      this.id = id; 
      this.usuarioId = usuarioId; 
      this.categoria = categoria;
      this.descricao = descricao; 
      this.valor = valor; 
    }
  }
  