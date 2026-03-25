export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  let cidade = url.searchParams.get('cidade') || 'Montes Claros';

  if (!cidade || cidade.trim() === '') {
    return Response.json({ erro: "Digite o nome de uma cidade" }, { status: 400 });
  }

  cidade = cidade.trim();

  try {
    // ✅ Sua chave real do OpenWeatherMap
    const apiKey = "716a7136b6f1b6e9cf85dd511896916d";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&units=metric&lang=pt_br&appid=${apiKey}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenWeather erro:", res.status, errorText);
      throw new Error(`OpenWeather retornou ${res.status}`);
    }

    const data = await res.json();

    const clima = {
      cidade: data.name,
      pais: data.sys.country,
      temperatura: Math.round(data.main.temp) + "°C",
      sensacao: Math.round(data.main.feels_like) + "°C",
      condicao: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
      umidade: data.main.humidity + "%",
      vento: Math.round(data.wind.speed * 3.6) + " km/h",
      timestamp: new Date().toLocaleString('pt-BR')
    };

    return Response.json(clima, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error("Erro completo:", error.message);

    let mensagemErro = "Não foi possível obter o clima.";

    if (error.message.includes("401")) {
      mensagemErro = "API Key inválida ou não ativada ainda.";
    } else if (error.message.includes("404")) {
      mensagemErro = "Cidade não encontrada. Tente o nome em inglês ou outra cidade.";
    }

    return Response.json({ erro: mensagemErro }, { status: 400 });
  }
}