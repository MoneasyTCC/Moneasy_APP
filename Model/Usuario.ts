export class Usuario {
    id: string;
    usuarioId: string;
    nome: string;
    email: string;
  
    constructor(
      id: string,
      usuarioId: string,
      nome: string,
      email: string
    ) {
      this.id = id;
      this.usuarioId = usuarioId;
      this.email = email;
      this.nome = nome;

 
    }
  }