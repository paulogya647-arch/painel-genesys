(function () {
  if (document.getElementById('painel-movel')) return;

  const STORAGE_POS = 'painel_posicao';
  const STORAGE_DATA = 'painel_dados';

  const modelos = {
    LOS: `Em contato com o titular pelo número {tel}. Verificado que não houve manuseio no equipamento, não ocorreu chuva na localidade e não há rompimento de fibra. Equipamento não apresenta quedas. Aberta O.S. para verificação técnica, com pré-agendamento realizado. Titular disponível para receber a equipe.`,
    LEN: `Em contato com {nome}, pelo número {tel}, relatando instabilidade ao utilizar aplicações como YouTube, Facebook e WhatsApp. Cliente conectado à rede {rede}, com modem instalado na {local}. Instabilidade percebida em {abrangencia}. O problema ocorre principalmente no período {periodo}. Após análise do sinal e ajustes no roteador, cliente testou e confirmou normalização do acesso.`,
    TP: `Contato com {nome}. Cliente sem acesso à internet. Sinal presente, porém gerência do roteador TP-Link desativada. Equipamento reiniciado manualmente. Acesso normalizado. Contato: {tel}.`,
    SENHA: `➡ Cliente solicitou redefinição de senha devido a erro de autenticação. Atendimento realizado pelo número {tel}. Procedimento concluído com sucesso.`,
    SC: `{tel} – Tentativas de contato realizadas sem sucesso.`,
    ROTA: `Contato com o cliente pelo número {tel}. Identificada rota parada na localidade. Cliente informado que há equipe atuando no reparo.`
  };

  const setStyle = (el, css) => Object.assign(el.style, css);

  const criarBotao = (texto, cor) => {
    const b = document.createElement('button');
    b.innerText = texto;
    setStyle(b, {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      background: cor,
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '9px',
      fontWeight: 'bold'
    });
    return b;
  };

  let campoAtivo = null;
  document.addEventListener('focusin', e => {
    if (e.target.tagName === 'TEXTAREA') campoAtivo = e.target;
  });

  function colarTexto(texto) {
    if (!campoAtivo) {
      alert('Clique no campo de texto antes.');
      return;
    }

    const dados = {
      nome: iNome.value || 'Titular',
      tel: iTel.value || '(00)',
      rede: 'principal',
      local: 'sala',
      abrangencia: 'toda a residência',
      periodo: 'horários de pico'
    };

    campoAtivo.value = texto.replace(/{(\w+)}/g, (_, v) => dados[v] || `{${v}}`);
    campoAtivo.dispatchEvent(new Event('input', { bubbles: true }));
    campoAtivo.focus();

    localStorage.setItem(STORAGE_DATA, JSON.stringify({
      nome: iNome.value,
      tel: iTel.value
    }));
  }

  /* ===== PAINEL ===== */
  const painel = document.createElement('div');
  painel.id = 'painel-movel';

  setStyle(painel, {
    position: 'fixed',
    top: '10px',
    left: '10px',
    display: 'flex',
    gap: '6px',
    background: '#f1f1f1',
    padding: '8px',
    borderRadius: '30px',
    zIndex: '999999',
    border: '2px solid #0d6efd',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,.3)',
    userSelect: 'none'
  });

  const inputs = document.createElement('div');
  inputs.style.display = 'none';

  const iNome = document.createElement('input');
  iNome.placeholder = 'Nome';
  iNome.style.width = '70px';

  const iTel = document.createElement('input');
  iTel.placeholder = 'Tel';
  iTel.style.width = '70px';

  inputs.append(iNome, iTel);
  painel.appendChild(inputs);

  const btnInfo = criarBotao('INFO', '#0d6efd');
  btnInfo.style.cursor = 'grab';

  const mapa = [
    ['LOS', '#dc3545'],
    ['LEN', '#fd7e14'],
    ['TP', '#198754'],
    ['PSW', '#6f42c1'],
    ['ROTA', '#0d6efd'],
    ['S/C', '#20c997']
  ];

  mapa.forEach(([t, c]) => {
    const b = criarBotao(t, c);
    b.onclick = () => colarTexto(modelos[t === 'PSW' ? 'SENHA' : t]);
    painel.appendChild(b);
  });

  painel.appendChild(btnInfo);
  document.body.appendChild(painel);

})();

