Model (Modelo):

Localização: Pasta Model
Função: Representar as tabelas do banco de dados.
Descrição: Os arquivos nesta pasta definem a estrutura dos dados que nossa aplicação irá manipular. Cada arquivo Model corresponde a uma tabela no banco de dados, onde são definidos os atributos (como colunas da tabela) e os tipos de dados que cada um pode armazenar. Por exemplo, o arquivo Usuario.ts contém a estrutura para a tabela de usuários, detalhando informações como nome, e-mail, senha, etc.
__________________________________________________________________
Controller (Controlador):

Localização: Pasta Controller
Função: Intermediar a comunicação entre o nosso frontend (a interface com o usuário) e o Repo (acesso ao banco de dados).
Descrição: Os controladores são essenciais para processar as entradas do usuário, validar essas informações e determinar quais operações do modelo devem ser executadas em resposta. Eles agem como um maestro, garantindo que os dados sejam passados corretamente do usuário para o sistema e vice-versa. Por exemplo, UsuarioController.ts gerencia as ações relacionadas aos usuários, como criar um novo usuário ou atualizar dados de um usuário existente.
__________________________________________________________________
Repo (Repositório):

Localização: Pasta Repo
Função: Acessar e manipular o banco de dados.
Descrição: Os repositórios são a ponte entre nossos modelos e o banco de dados. Eles contêm a lógica para acessar, adicionar, atualizar e remover dados do banco. Isso é feito através de comandos ou consultas que são enviados ao banco de dados para executar as operações desejadas. Por exemplo, RepositorioUsuario.ts contém métodos para salvar um novo usuário no banco de dados ou buscar informações de usuários existentes.




Em resumo, o Model define o que será armazenado, o Controller define como os dados serão processados e manipulados antes de serem armazenados ou após serem recuperados, e o Repo lida com a comunicação direta com o banco de dados para salvar ou recuperar esses dados.

Na pasta Service ficam serviços que nosso sistema esta usando. O firebase não é nosso, estamos nos concecatando nele e usando os recursos dele, por isso service.

Shared são recursos que são/podem ser compartilhados ao longo do projeto, em várias classes ou componentes.


M - Model
V - View - Eventos - atraves dos eventos são realizadas funcionalides/funções
C - Controller
__________________________________________________________________
Bibliotecas:

@types/react-native-datepicker
`npm i @types/react-native-datepicker`