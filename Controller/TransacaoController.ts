import { Transacao } from "../Model/Transacao";
import { TransacaoDAL } from "../Repo/RepositorioTransacao";
import { RecyclerView, LinearLayoutManager } from "android.support.v7.widget";
import { useRef } from "react";

function exibirTransacoesNaTela(transacoes: Transacao[], usuarioId: string) {
  const transacoesDoUsuario = transacoes.filter(transacao => transacao.usuarioId === usuarioId);

  const flatListRef = useRef<FlatList | null>(null);

  return (
    <FlatList
      ref={flatListRef}
      data={transacoesDoUsuario}
      renderItem={({ item }) => (
        <View>
          <Text>{item.descricao}</Text>
          <Text>{item.valor}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}



