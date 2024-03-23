
async function CotacaoDolar() {

fetch('http://apilayer.net/api/live? access_key = f527e073e8652f8c0bbf733cd12e861f& currencies = EUR,GBP,CAD,PLN,USD& source = BRLUSD& format = 1')
  .then((response) => response.json())
  .then((data) => {
    console.log('Cotação do Dólar:', data.quotes.BRLUSD);
  })
  .catch((error) => {
    console.error('Erro ao buscar dados:', error);
  });
}