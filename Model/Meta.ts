export class  Meta {
    id: string;
    usuarioId: string;
    titulo: string;
    valorObjetivo: number;
    valorAtual: number;
    dataInicio: Date;
    dataFimPrevista: Date;
    status: string;
  
    constructor(
      id: string,
      usuarioId: string,
      titulo: string,
      valorObjetivo: number,
      valorAtual: number,
      dataInicio: Date,
      dataFimPrevista: Date,
      status: string
    ) {
      this.id = id;
      this.usuarioId = usuarioId;
      this.titulo = titulo;
      this.valorObjetivo = valorObjetivo;
      this.valorAtual = valorAtual;
      this.dataInicio = dataInicio;
      this.dataFimPrevista = dataFimPrevista;
      this.status = status;
    }
  }
  