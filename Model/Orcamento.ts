export class Orcamento{
  id: string;
  usuarioId: string;
  categoria: string;
  descricao?: string;
  valorDefinido: number;
  valorAtual: number;
  data: Date;

  constructor(usuarioId: string,id: string, categoria: string, descricao: string, valorDefinido: number, valorATual:number, data: Date) {
    this.id = id; 
    this.usuarioId = usuarioId; 
    this.categoria = categoria;
    this.descricao = descricao; 
    this.valorDefinido = valorDefinido; 
    this.valorAtual = valorATual; 
    this.data = data;
  }
}
