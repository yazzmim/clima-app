async function buscarClima() {
  const input = document.getElementById('cidade');
  const cidade = input.value.trim();
  const resultado = document.getElementById('resultado');

  if (!cidade) {
    resultado.innerHTML = `<p style="color: #ff6b6b;">Digite o nome de uma cidade</p>`;
    resultado.classList.add('show');
    return;
  }

  resultado.innerHTML = `<p>Consultando...</p>`;
  resultado.classList.add('show');

  try {
    const res = await fetch(`/api/clima?cidade=${encodeURIComponent(cidade)}`);
    const data = await res.json();

    if (data.erro) {
      throw new Error(data.erro);
    }

    resultado.innerHTML = `
      <h2>${data.cidade}, ${data.pais}</h2>
      <div class="info">🌡️ Temperatura: <strong>${data.temperatura}</strong></div>
      <div class="info">🌡️ Sensação: <strong>${data.sensacao}</strong></div>
      <div class="info">☁️ Condição: <strong>${data.condicao}</strong></div>
      <div class="info">💧 Umidade: <strong>${data.umidade}</strong></div>
      <div class="info">🌬️ Vento: <strong>${data.vento}</strong></div>
      <div class="small">${data.timestamp}</div>
    `;

  } catch (err) {
    resultado.innerHTML = `
      <p style="color: #ff6b6b;">
        ❌ ${err.message}
      </p>`;
  }
}

// Buscar com Enter
document.getElementById('cidade').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') buscarClima();
});