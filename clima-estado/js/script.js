document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultaForm');
  const resultado = document.getElementById('resultado');
  const listaHistorico = document.getElementById('listaHistorico');
  const historico = [];

  class Estado {
    constructor(cidade, populacao = 0, regiao = 'Desconhecida', disponivel = true) {
      this.cidade = cidade;
      this.populacao = populacao;
      this.regiao = regiao;
      this.disponivel = disponivel;
    }

    informacoes() {
      return `Cidade: ${this.cidade}, População: ${this.populacao}, Região: ${this.regiao}`;
    }
  }

  async function buscarInfoCidade(nomeCidade) {
    try {
      const res = await fetch('data/estados.json');
      const cidades = await res.json();
      return cidades.find(c => c.cidade.toLowerCase() === nomeCidade.toLowerCase());
    } catch (err) {
      console.error('Erro ao carregar estados.json', err);
      return null;
    }
  }

  async function obterCoordenadas(cidade) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade)}&format=json&addressdetails=1&limit=1&countrycodes=br`;
    const resposta = await fetch(url, {
      headers: {
        'Accept-Language': 'pt-BR'
      }
    });
    const dados = await resposta.json();
    if (dados.length > 0) {
      return {
        lat: parseFloat(dados[0].lat),
        lon: parseFloat(dados[0].lon)
      };
    } else {
      return null;
    }
  }

  async function buscarClimaOpenMeteo(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`;
    const resposta = await fetch(url);
    const dados = await resposta.json();
    return dados.current;
  }

  function atualizarHistorico() {
    listaHistorico.innerHTML = '';
    historico.slice().reverse().forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.data} — ${item.cidade}: ${item.temp}°C, ${item.desc}`;
      listaHistorico.appendChild(li);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cidadeInput = document.getElementById('cidadeInput');
    const nomeCidade = cidadeInput.value.trim();

    if (!nomeCidade) {
      alert('Digite o nome da cidade.');
      return;
    }

    const infoLocal = await buscarInfoCidade(nomeCidade);
    const coords = await obterCoordenadas(nomeCidade);

    if (!coords) {
      alert('Cidade não encontrada.');
      return;
    }

    const clima = await buscarClimaOpenMeteo(coords.lat, coords.lon);

    const temp = clima.temperature_2m;
    const umidade = clima.relative_humidity_2m;
    const vento = clima.wind_speed_10m;

    const estado = new Estado(
      nomeCidade,
      infoLocal?.populacao || 0,
      infoLocal?.regiao || 'Desconhecida',
      true
    );

    resultado.innerHTML = `
      <h3>${estado.cidade}</h3>
      <p>${estado.informacoes()}</p>
      <p>🌡️ Temperatura atual: ${temp}°C</p>
      <p>💧 Umidade: ${umidade}%</p>
      <p>💨 Vento: ${vento} km/h</p>
    `;

    historico.push({
      cidade: estado.cidade,
      temp,
      desc: `Umidade: ${umidade}%, Vento: ${vento} km/h`,
      data: new Date().toLocaleString()
    });

    atualizarHistorico();
    cidadeInput.value = '';
  });
});
