export class Configuaracoes {
    id: string;
    usuarioId: string;
    frequencia: number;
    notificacoes: boolean;
    proximaNotificacao:Date;
    ultimaNotificacao:Date;

    constructor(
      id: string,
      usuarioId: string,
      frequencia: number,
      notificacoes: boolean,
      proximaNotificacao : Date,
      ultimaNotificacao: Date,
    ) {
      this.id = id;
      this.usuarioId = usuarioId;
      this.frequencia = frequencia;
      this.notificacoes = notificacoes;
      this.proximaNotificacao = proximaNotificacao;
      this.ultimaNotificacao = ultimaNotificacao;

 
    }
  }