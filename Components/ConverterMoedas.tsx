import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface Estado {
    taxa: number | null;
    dataCotacao: string;
    valorEmBRL: string;
    valorEmUSD: string;
    convertidoParaUSD: string;
    convertidoParaBRL: string;
}

const ConversorMoeda: React.FC = () => {
    const [taxa, setTaxa] = useState<number | null>(null);
    const [dataCotacao, setDataCotacao] = useState<string>('');
    const [valorEmBRL, setValorEmBRL] = useState<string>('');
    const [valorEmUSD, setValorEmUSD] = useState<string>('');
    const [convertidoParaUSD, setConvertidoParaUSD] = useState<string>('');
    const [convertidoParaBRL, setConvertidoParaBRL] = useState<string>('');

    const buscarTaxas = async () => {
        const chaveApi = 'f527e073e8652f8c0bbf733cd12e861f';  
        const url = `http://api.currencylayer.com/live?access_key=${chaveApi}&currencies=BRL&format=1`;
        try {
            const resposta = await fetch(url);
            const json = await resposta.json();
            if (json.success) {
                const dataAtualizada = new Date(json.timestamp * 1000);
                setDataCotacao(dataAtualizada.toLocaleDateString('pt-BR') + ' ' + dataAtualizada.toLocaleTimeString('pt-BR'));
                setTaxa(json.quotes['USDBRL']);
            } else {
                console.error('Erro ao buscar taxas', json.error);
            }
        } catch (erro) {
            console.error('Erro ao buscar taxas:', erro);
        }
    };

    useEffect(() => {
        buscarTaxas();
    }, []);

    const converterBRLParaUSD = () => {
        const valorReais = parseFloat(valorEmBRL);
        if (taxa !== null) {
            const valorConvertido = (valorReais / taxa).toFixed(2);
            setConvertidoParaUSD(valorConvertido);
        }
    };

    const converterUSDParaBRL = () => {
        const valorDolares = parseFloat(valorEmUSD);
        if (taxa !== null) {
            const valorConvertido = (valorDolares * taxa).toFixed(2);
            setConvertidoParaBRL(valorConvertido);
        }
    };

    const limparTudo = () => {
        setValorEmBRL('');
        setValorEmUSD('');
        setConvertidoParaUSD('');
        setConvertidoParaBRL('');
        setDataCotacao('');
    };

    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Taxa Atual (USD para BRL): {taxa ? `${taxa.toFixed(2)} - Atualizado em: ${dataCotacao}` : 'Carregando...'}</Text>
            
            <View style={estilos.linha}>
                <TextInput
                    style={estilos.entrada}
                    placeholder="Valor em BRL"
                    value={valorEmBRL}
                    onChangeText={setValorEmBRL}
                    keyboardType="numeric"
                />
                <Button title="Para USD" onPress={converterBRLParaUSD} color="#007AFF" />
            </View>
            <Text style={estilos.resultado}>Valor em USD: {convertidoParaUSD}</Text>
            
            <View style={estilos.linha}>
                <TextInput
                    style={estilos.entrada}
                    placeholder="Valor em USD"
                    value={valorEmUSD}
                    onChangeText={setValorEmUSD}
                    keyboardType="numeric"
                />
                <Button title="Para BRL" onPress={converterUSDParaBRL} color="#007AFF" />
            </View>
            <Text style={estilos.resultado}>Valor em BRL: {convertidoParaBRL}</Text>

            <Button title="Limpar" onPress={limparTudo} color="#FF6347" />
        </View>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    entrada: {
        fontSize: 16,
        padding: 10,
        width: '70%',
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginRight: 10,
    },
    resultado: {
        fontSize: 18,
        color: '#007AFF',
        marginBottom: 20,
    },
});

export default ConversorMoeda;
