export class Divida {
    id: string;
    usuarioId: string;
    titulo: string;
    valorTotal: number;
    valorPago: number;
    dataInicio: Date;
    dataVencimento: Date;
    status: string;
  
    constructor(
      id: string,
      usuarioId: string,
      titulo: string,
      valorTotal: number,
      valorPago: number,
      dataInicio: Date,
      dataVencimento: Date,
      status: string
    ) {
      this.id = id;
      this.usuarioId = usuarioId;
      this.titulo = titulo;
      this.valorTotal = valorTotal;
      this.valorPago = valorPago;
      this.dataInicio = dataInicio;
      this.dataVencimento = dataVencimento;
      this.status = status; // Exemplos de status: 'em aberto', 'pago', etc.
    }
  }
  