export class  Transacao {
    id: string;
    usuarioId: string;
    tipo: string;
    valor: number;
    data: Date;
    descricao: string;
    moeda: string;
  
    constructor(id:string,usuarioId: string, tipo: string, valor: number, data: Date, descricao: string, moeda: string) {
      this.id = id;
      this.usuarioId = usuarioId;
      this.tipo = tipo;
      this.valor = valor;
      this.data = data;
      this.descricao = descricao;
      this.moeda = moeda;
    }
  }