(() => {
  'use strict';

  const CHAVE = 'dh-salas-v1';
  const TIPOS = ['Combate', 'Exploração', 'Travessia', 'Social', 'Evento', 'Tesouro', 'Descanso'];
  const PATAMARES = [1, 2, 3, 4];
  const SOMA_MIN = 2, SOMA_MAX = 40, COMBOS = 400;

  // Estatísticas improvisadas por patamar (livro básico, cap. 4).
  const REF = {
    1: { niveis: 'nível 1', dif: 11, atq: '+1', dano: '1d6+2 a 1d12+4', limiares: '7 / 12' },
    2: { niveis: 'níveis 2 a 4', dif: 14, atq: '+2', dano: '2d6+3 a 2d12+4', limiares: '10 / 20' },
    3: { niveis: 'níveis 5 a 7', dif: 17, atq: '+3', dano: '3d8+3 a 3d12+5', limiares: '20 / 32' },
    4: { niveis: 'níveis 8 a 10', dif: 20, atq: '+4', dano: '4d8+10 a 4d12+15', limiares: '25 / 45' }
  };
  const EFEITOS = {
    esperanca: 'Com Esperança',
    medo: 'Com Medo',
    critico: 'Crítico'
  };

  const $ = (s, raiz = document) => raiz.querySelector(s);
  const $$ = (s, raiz = document) => [...raiz.querySelectorAll(s)];
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pct = (v) => (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
  const clonar = (o) => JSON.parse(JSON.stringify(o));

  // ---------- Estado ----------

  let estado, temLocal = false;
  let patamarAtual = 1, editando = null, ultimaRolagem = null;

  function normalizar(d) {
    const base = clonar(window.DADOS_PADRAO);
    const o = { versao: 1, jogadores: 4, ordem: 'piramide', patamares: base.patamares, encontros: [] };
    if (!d || typeof d !== 'object' || !Array.isArray(d.encontros)) throw new Error('Arquivo sem lista de encontros.');
    o.jogadores = Math.min(8, Math.max(1, parseInt(d.jogadores, 10) || 4));
    o.ordem = d.ordem === 'lista' ? 'lista' : 'piramide';
    for (const p of PATAMARES) {
      for (const k of Object.keys(EFEITOS)) {
        const v = d.patamares?.[p]?.[k];
        if (typeof v === 'string') o.patamares[p][k] = v;
      }
    }
    o.encontros = d.encontros.map((e, i) => ({
      id: String(e.id ?? 'e' + i),
      nome: String(e.nome ?? '').trim() || 'Sem nome',
      tipo: TIPOS.includes(e.tipo) ? e.tipo : TIPOS[0],
      desc: String(e.desc ?? ''),
      patamares: PATAMARES.filter((p) => (e.patamares || []).map(Number).includes(p)),
      peso: Math.max(0, Number(e.peso) || 0)
    }));
    return o;
  }

  function carregar() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        estado = normalizar(JSON.parse(bruto));
        temLocal = true;
        return;
      }
    } catch (e) { /* armazenamento indisponível ou corrompido: usa o padrão */ }
    estado = normalizar(window.DADOS_PADRAO);
    temLocal = false;
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
      temLocal = true;
    } catch (e) { /* sem armazenamento: segue só em memória */ }
    renderTudo();
  }

  // ---------- Distribuição das faixas em 2d20 ----------

  const combosDaSoma = (s) => (s <= 21 ? s - 1 : 41 - s);

  function ordenar(itens, ordem) {
    if (ordem === 'lista') return itens.slice();
    // Raros alternando entre as duas pontas, comuns ficam no meio.
    const crescente = itens.map((e, i) => ({ e, i })).sort((a, b) => a.e.peso - b.e.peso || a.i - b.i);
    const esq = [], dir = [];
    crescente.forEach((x, k) => (k % 2 ? dir : esq).push(x.e));
    return esq.concat(dir.reverse());
  }

  // Divide as somas 2..40 em faixas contíguas, uma por encontro, minimizando
  // o erro quadrático entre a chance real e o peso pedido.
  function distribuir(patamar) {
    const itens = estado.encontros.filter((e) => e.patamares.includes(patamar) && e.peso > 0);
    const n = itens.length, m = SOMA_MAX - SOMA_MIN + 1;
    if (!n) return { linhas: [], erro: 'Nenhum encontro com peso maior que zero neste patamar.' };
    if (n > m) return { linhas: [], erro: `São ${n} encontros, mas 2d20 só tem ${m} somas possíveis. Remova ou zere o peso de ${n - m}.` };

    const ord = ordenar(itens, estado.ordem);
    const total = ord.reduce((s, e) => s + e.peso, 0);
    const alvo = ord.map((e) => e.peso / total);
    const acum = [0];
    for (let j = 0; j < m; j++) acum.push(acum[j] + combosDaSoma(j + SOMA_MIN));

    const custo = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(Infinity));
    const corte = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    custo[0][0] = 0;
    for (let i = 1; i <= n; i++) {
      for (let j = i; j <= m - (n - i); j++) {
        for (let k = i - 1; k < j; k++) {
          if (custo[i - 1][k] === Infinity) continue;
          const real = (acum[j] - acum[k]) / COMBOS;
          const c = custo[i - 1][k] + (real - alvo[i - 1]) ** 2;
          if (c < custo[i][j]) { custo[i][j] = c; corte[i][j] = k; }
        }
      }
    }
    const linhas = [];
    for (let i = n, j = m; i >= 1; i--) {
      const k = corte[i][j];
      linhas.unshift({ enc: ord[i - 1], de: k + SOMA_MIN, ate: j - 1 + SOMA_MIN, real: (acum[j] - acum[k]) / COMBOS, alvo: alvo[i - 1] });
      j = k;
    }
    return { linhas, erro: null };
  }

  const faixa = (l) => (l.de === l.ate ? String(l.de) : `${l.de}–${l.ate}`);
  const pb = () => 3 * estado.jogadores + 2;

  // ---------- Aba Tabela ----------

  function renderTabela() {
    $('#seletor-patamar').innerHTML = PATAMARES.map((p) =>
      `<button type="button" data-pat="${p}" aria-pressed="${p === patamarAtual}">${p}º patamar</button>`).join('');
    $('#jogadores').value = estado.jogadores;

    const r = REF[patamarAtual];
    $('#ref-patamar').innerHTML = [
      ['Pontos de Batalha', `${pb()} PB`],
      ['Dificuldade', r.dif],
      ['Ataque', r.atq],
      ['Dano', r.dano],
      ['Limiares', r.limiares]
    ].map(([a, b]) => `<div><div class="rot">${a}</div><div class="val">${b}</div></div>`).join('');

    $('#titulo-tabela').textContent = `${patamarAtual}º patamar (${r.niveis})`;
    const { linhas, erro } = distribuir(patamarAtual);
    const aviso = $('#aviso-tabela');
    aviso.hidden = !erro;
    aviso.textContent = erro || '';
    $('#tabela tbody').innerHTML = linhas.map((l) => `
      <tr data-de="${l.de}" data-ate="${l.ate}">
        <td class="faixa">${faixa(l)}</td>
        <td><div class="nome">${esc(l.enc.nome)}</div><div class="desc">${esc(l.enc.desc)}</div></td>
        <td><span class="etiqueta">${esc(l.enc.tipo)}</span></td>
        <td class="num">${pct(l.real)}</td>
      </tr>`).join('');

    const regras = estado.patamares[patamarAtual];
    $('#regras-patamar').innerHTML = `
      <div class="efeito esperanca"><strong>Esperança maior:</strong> ${esc(regras.esperanca)}</div>
      <div class="efeito medo"><strong>Medo maior:</strong> ${esc(regras.medo)}</div>
      <div class="efeito"><strong>Dados iguais (crítico):</strong> ${esc(regras.critico)}</div>`;
    renderResultado(linhas);
  }

  function renderResultado(linhas) {
    const caixa = $('#resultado');
    $$('#tabela tr.sorteada').forEach((tr) => tr.classList.remove('sorteada'));
    if (!ultimaRolagem) { caixa.hidden = true; return; }
    const { esp, medo } = ultimaRolagem;
    const soma = esp + medo;
    const linha = (linhas || distribuir(patamarAtual).linhas).find((l) => soma >= l.de && soma <= l.ate);
    const tipo = esp === medo ? 'critico' : esp > medo ? 'esperanca' : 'medo';
    caixa.hidden = false;
    caixa.innerHTML = `
      <div class="soma">Soma ${soma} · ${patamarAtual}º patamar</div>
      ${linha
        ? `<h3>${esc(linha.enc.nome)}</h3><span class="etiqueta">${esc(linha.enc.tipo)}</span><p>${esc(linha.enc.desc)}</p>`
        : '<h3>Sem sala para essa soma</h3>'}
      <div class="efeito ${tipo}"><strong>${EFEITOS[tipo]}:</strong> ${esc(estado.patamares[patamarAtual][tipo])}</div>`;
    const tr = $(`#tabela tr[data-de="${linha?.de}"]`);
    if (tr) tr.classList.add('sorteada');
  }

  function lerDados() {
    const v = (id) => {
      const n = parseInt($(id).value, 10);
      return n >= 1 && n <= 20 ? n : null;
    };
    const esp = v('#d-esp'), medo = v('#d-medo');
    ultimaRolagem = esp && medo ? { esp, medo } : null;
    renderResultado();
  }

  // ---------- Aba Encontros ----------

  function renderEncontros() {
    const filtro = Number($('#filtro-pat').value);
    const dist = filtro ? distribuir(filtro) : null;
    const porId = new Map((dist?.linhas || []).map((l) => [l.enc.id, l]));
    const lista = estado.encontros.filter((e) => !filtro || e.patamares.includes(filtro));

    $('#lista-enc thead').innerHTML = `<tr><th>Encontro</th><th>Tipo</th><th>Patamares</th><th class="num">Peso</th>${
      filtro ? '<th class="num">Pedido</th><th class="num">Real</th><th>2d20</th>' : ''}<th></th></tr>`;
    $('#lista-enc tbody').innerHTML = lista.map((e) => {
      const l = porId.get(e.id);
      const extra = filtro
        ? `<td class="num">${l ? pct(l.alvo) : '–'}</td><td class="num">${l ? pct(l.real) : '–'}</td><td class="faixa">${l ? faixa(l) : '–'}</td>`
        : '';
      return `
      <tr>
        <td><div class="nome">${esc(e.nome)}</div><div class="desc">${esc(e.desc)}</div></td>
        <td><span class="etiqueta">${esc(e.tipo)}</span></td>
        <td>${e.patamares.length ? e.patamares.map((p) => p + 'º').join(', ') : '–'}</td>
        <td class="num">${e.peso.toLocaleString('pt-BR')}</td>
        ${extra}
        <td class="botoes">
          <button type="button" class="mini secundario" data-acao="editar" data-id="${esc(e.id)}">Editar</button>
          <button type="button" class="mini secundario" data-acao="duplicar" data-id="${esc(e.id)}">Duplicar</button>
          <button type="button" class="mini perigo" data-acao="excluir" data-id="${esc(e.id)}">Excluir</button>
        </td>
      </tr>`;
    }).join('') || '<tr><td colspan="8">Nenhum encontro cadastrado.</td></tr>';

    const soma = lista.reduce((s, e) => s + e.peso, 0);
    $('#resumo-enc').textContent = filtro
      ? `${lista.length} encontros · pesos somam ${soma.toLocaleString('pt-BR')}${dist.erro ? ' · ' + dist.erro : ''}`
      : `${lista.length} encontros`;
  }

  function preencherForm(e) {
    editando = e ? e.id : null;
    $('#form-titulo').textContent = e ? 'Editar encontro' : 'Novo encontro';
    $('#f-salvar').textContent = e ? 'Salvar' : 'Adicionar';
    $('#f-cancelar').hidden = !e;
    $('#f-nome').value = e ? e.nome : '';
    $('#f-tipo').value = e ? e.tipo : TIPOS[0];
    $('#f-peso').value = e ? e.peso : 5;
    $('#f-desc').value = e ? e.desc : '';
    const marcados = e ? e.patamares : [Number($('#filtro-pat').value) || patamarAtual];
    $$('input[name="f-pat"]').forEach((c) => { c.checked = marcados.includes(Number(c.value)); });
  }

  function enviarForm(ev) {
    ev.preventDefault();
    const dados = {
      nome: $('#f-nome').value.trim(),
      tipo: $('#f-tipo').value,
      peso: Math.max(0, Number($('#f-peso').value) || 0),
      desc: $('#f-desc').value.trim(),
      patamares: $$('input[name="f-pat"]:checked').map((c) => Number(c.value))
    };
    if (!dados.nome) return;
    if (!dados.patamares.length) { alert('Marque pelo menos um patamar.'); return; }
    const atual = estado.encontros.find((e) => e.id === editando);
    if (atual) Object.assign(atual, dados);
    else estado.encontros.push({ id: 'e' + Date.now().toString(36), ...dados });
    preencherForm(null);
    salvar();
  }

  function acaoLista(ev) {
    const b = ev.target.closest('button[data-acao]');
    if (!b) return;
    const i = estado.encontros.findIndex((e) => e.id === b.dataset.id);
    if (i < 0) return;
    const e = estado.encontros[i];
    if (b.dataset.acao === 'editar') {
      preencherForm(e);
      $('#form-enc').scrollIntoView({ behavior: 'smooth', block: 'start' });
      $('#f-nome').focus({ preventScroll: true });
    } else if (b.dataset.acao === 'duplicar') {
      estado.encontros.splice(i + 1, 0, { ...clonar(e), id: 'e' + Date.now().toString(36), nome: e.nome + ' (cópia)' });
      salvar();
    } else if (b.dataset.acao === 'excluir' && confirm(`Excluir “${e.nome}”?`)) {
      estado.encontros.splice(i, 1);
      if (editando === e.id) preencherForm(null);
      salvar();
    }
  }

  // ---------- Aba Regras ----------

  function renderPatamares() {
    $('#ordem').value = estado.ordem;
    $('#editor-patamares').innerHTML = PATAMARES.map((p) => `
      <div class="cartao editor-pat">
        <h2>${p}º patamar <span class="dica">(${REF[p].niveis} · Dificuldade ${REF[p].dif})</span></h2>
        ${Object.entries(EFEITOS).map(([k, rot]) => `
          <label>${rot}
            <textarea rows="2" data-pat="${p}" data-efeito="${k}">${esc(estado.patamares[p][k])}</textarea>
          </label>`).join('')}
      </div>`).join('');
  }

  // ---------- Aba Foundry ----------

  // As duas funções abaixo nunca rodam no navegador: o código-fonte delas é
  // copiado para dentro da macro e executado pelo Foundry.

  /* eslint-disable no-undef */
  async function macroCriar(DADOS) {
    if (!game.user.isGM) return ui.notifications.warn('Apenas o mestre pode criar as tabelas.');
    const v13 = (game.release?.generation ?? 12) >= 13;
    const pasta = game.folders.find((f) => f.type === 'RollTable' && f.name === DADOS.pasta)
      ?? await Folder.create({ name: DADOS.pasta, type: 'RollTable' });
    for (const t of DADOS.tabelas) {
      const antiga = game.tables.find((x) => x.name === t.nome && x.folder?.id === pasta.id);
      if (antiga) await antiga.delete();
      await RollTable.create({
        name: t.nome,
        description: t.descricao,
        formula: '2d20',
        replacement: true,
        displayRoll: true,
        folder: pasta.id,
        results: t.resultados.map((r) => Object.assign(
          { type: CONST.TABLE_RESULT_TYPES.TEXT, range: [r.de, r.ate], weight: r.ate - r.de + 1, drawn: false },
          v13 ? { name: r.nome, description: r.html } : { text: '<strong>' + r.nome + '</strong> ' + r.html }
        ))
      });
    }
    const existente = game.macros.find((m) => m.name === DADOS.macro.nome && m.isOwner);
    if (existente) await existente.update({ command: DADOS.macro.comando });
    else await Macro.create({ name: DADOS.macro.nome, type: 'script', command: DADOS.macro.comando, img: 'icons/svg/d20-grey.svg' });
    ui.notifications.info(DADOS.tabelas.length + ' tabela(s) criadas na pasta "' + DADOS.pasta + '". Use a macro "' + DADOS.macro.nome + '" para rolar.');
  }

  async function macroRolar(CFG) {
    const chaves = Object.keys(CFG.tabelas);
    let pat = chaves[0];
    if (chaves.length > 1) {
      const conteudo = '<p>Qual o patamar do grupo?</p>';
      const D2 = foundry.applications?.api?.DialogV2;
      const escolha = D2
        ? await D2.wait({
          window: { title: CFG.titulo },
          content: conteudo,
          buttons: chaves.map((k) => ({ action: 'p' + k, label: k + 'º patamar' })),
          rejectClose: false
        })
        : await Dialog.wait({
          title: CFG.titulo,
          content: conteudo,
          buttons: Object.fromEntries(chaves.map((k) => ['p' + k, { label: k + 'º patamar', callback: () => 'p' + k }])),
          close: () => null
        });
      if (!escolha) return;
      pat = String(escolha).slice(1);
    }
    const cfg = CFG.tabelas[pat];
    if (!cfg) return;
    const tabela = game.tables.getName(cfg.nome);
    if (!tabela) return ui.notifications.warn('Tabela "' + cfg.nome + '" não encontrada. Rode a macro de criação primeiro.');

    const rolagem = await new Roll('1d20[Esperança] + 1d20[Medo]').evaluate();
    const [esp, medo] = rolagem.dice.map((d) => d.total);
    const res = tabela.getResultsForRoll(rolagem.total)[0];
    const sala = res
      ? (res.name ? '<h4>' + res.name + '</h4>' : '') + (res.description ?? res.text ?? '')
      : '<em>Nenhuma sala para essa soma.</em>';
    const tipo = esp === medo ? 'critico' : esp > medo ? 'esperanca' : 'medo';
    const rotulo = { esperanca: 'Com Esperança', medo: 'Com Medo', critico: 'Crítico' }[tipo];
    const content = '<h3>' + cfg.nome + '</h3>'
      + '<p>Esperança <strong>' + esp + '</strong> · Medo <strong>' + medo + '</strong> · Soma <strong>' + rolagem.total + '</strong></p>'
      + sala
      + '<p><strong>' + rotulo + ':</strong> ' + cfg[tipo] + '</p>';
    await ChatMessage.create({
      content,
      rolls: [rolagem],
      speaker: ChatMessage.getSpeaker({ alias: CFG.titulo }),
      whisper: CFG.sussurrar ? ChatMessage.getWhisperRecipients('GM').map((u) => u.id) : []
    });
  }
  /* eslint-enable no-undef */

  function gerarMacro() {
    const escolhidos = $$('input[name="x-pat"]:checked').map((c) => Number(c.value));
    const tabelas = [], cfgTabelas = {}, pulados = [];
    for (const p of escolhidos) {
      const { linhas, erro } = distribuir(p);
      if (erro) { pulados.push(`${p}º: ${erro}`); continue; }
      const nome = `Salas de Encontro — ${p}º patamar`;
      const regras = estado.patamares[p];
      const r = REF[p];
      tabelas.push({
        nome,
        descricao: `<p>Role 2d20 (um de Esperança, um de Medo). Dificuldade ${r.dif} · dano ${esc(r.dano)} · limiares ${esc(r.limiares)}.</p>`
          + `<p><strong>Esperança maior:</strong> ${esc(regras.esperanca)}</p>`
          + `<p><strong>Medo maior:</strong> ${esc(regras.medo)}</p>`
          + `<p><strong>Dados iguais:</strong> ${esc(regras.critico)}</p>`,
        resultados: linhas.map((l) => ({
          de: l.de, ate: l.ate, nome: esc(l.enc.nome),
          html: `<p><em>${esc(l.enc.tipo)}</em>${l.enc.desc ? ' — ' + esc(l.enc.desc) : ''}</p>`
        }))
      });
      cfgTabelas[p] = { nome, esperanca: esc(regras.esperanca), medo: esc(regras.medo), critico: esc(regras.critico) };
    }
    const msg = $('#msg-macro');
    msg.textContent = pulados.length ? 'Fora da macro: ' + pulados.join(' ') : '';
    if (!tabelas.length) { $('#macro').value = ''; return; }

    const cfg = { titulo: 'Sala de Encontro', sussurrar: $('#x-sussurro').checked, tabelas: cfgTabelas };
    const comandoRolar = `// Salas de Encontro — rolagem\nconst CFG = ${JSON.stringify(cfg)};\nawait (${macroRolar.toString()})(CFG);\n`;
    const dados = { pasta: 'Salas de Encontro', tabelas, macro: { nome: 'Rolar Sala de Encontro', comando: comandoRolar } };
    $('#macro').value = `// Salas de Encontro (Daggerheart) — cria as tabelas de rolagem 2d20 e a macro de rolagem.\n`
      + `// Gerado em ${new Date().toLocaleDateString('pt-BR')}.\n`
      + `const DADOS = ${JSON.stringify(dados, null, 1)};\n\nawait (${macroCriar.toString()})(DADOS);\n`;
  }

  function baixar(nome, texto, tipo) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto], { type: tipo }));
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- Aba Dados ----------

  function renderDados() {
    $('#estado-dados').innerHTML = temLocal
      ? '<strong>Você está vendo alterações salvas neste navegador</strong>, que se sobrepõem ao <code>dados.js</code> publicado.'
      : 'Você está vendo o <code>dados.js</code> publicado, sem alterações locais.';
    $('#restaurar').disabled = !temLocal;
  }

  function importar(ev) {
    const arq = ev.target.files[0];
    if (!arq) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const txt = String(leitor.result);
        const ini = txt.indexOf('{', Math.max(0, txt.indexOf('DADOS_PADRAO'))), fim = txt.lastIndexOf('}');
        if (ini < 0 || fim < ini) throw new Error('Não encontrei dados no arquivo.');
        estado = normalizar(JSON.parse(txt.slice(ini, fim + 1)));
        ultimaRolagem = null;
        preencherForm(null);
        renderPatamares();
        salvar();
        $('#msg-dados').textContent = `Importado: ${estado.encontros.length} encontros.`;
      } catch (e) {
        $('#msg-dados').textContent = 'Não foi possível importar: ' + e.message;
      }
      ev.target.value = '';
    };
    leitor.readAsText(arq);
  }

  // ---------- Montagem ----------

  function renderTudo() {
    renderTabela();
    renderEncontros();
    renderDados();
    gerarMacro();
  }

  function trocarAba(nome) {
    $$('.abas button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.aba === nome)));
    $$('.aba').forEach((s) => { s.hidden = s.id !== 'aba-' + nome; });
  }

  function iniciar() {
    carregar();
    $('#f-tipo').innerHTML = TIPOS.map((t) => `<option>${t}</option>`).join('');
    preencherForm(null);
    renderPatamares();
    renderTudo();

    $('.abas').addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-aba]');
      if (b) trocarAba(b.dataset.aba);
    });

    $('#seletor-patamar').addEventListener('click', (ev) => {
      const b = ev.target.closest('button[data-pat]');
      if (!b) return;
      patamarAtual = Number(b.dataset.pat);
      renderTabela();
    });
    $('#jogadores').addEventListener('change', (ev) => {
      estado.jogadores = Math.min(8, Math.max(1, parseInt(ev.target.value, 10) || 4));
      salvar();
    });
    $('#imprimir').addEventListener('click', () => window.print());
    $('#rolar').addEventListener('click', () => {
      const d20 = () => 1 + Math.floor(Math.random() * 20);
      $('#d-esp').value = d20();
      $('#d-medo').value = d20();
      lerDados();
    });
    $('#d-esp').addEventListener('input', lerDados);
    $('#d-medo').addEventListener('input', lerDados);

    $('#form-enc').addEventListener('submit', enviarForm);
    $('#f-cancelar').addEventListener('click', () => preencherForm(null));
    $('#filtro-pat').addEventListener('change', renderEncontros);
    $('#lista-enc').addEventListener('click', acaoLista);

    $('#editor-patamares').addEventListener('change', (ev) => {
      const t = ev.target.closest('textarea[data-efeito]');
      if (!t) return;
      estado.patamares[t.dataset.pat][t.dataset.efeito] = t.value.trim();
      salvar();
    });
    $('#ordem').addEventListener('change', (ev) => { estado.ordem = ev.target.value; salvar(); });

    $$('input[name="x-pat"]').forEach((c) => c.addEventListener('change', gerarMacro));
    $('#x-sussurro').addEventListener('change', gerarMacro);
    $('#copiar-macro').addEventListener('click', async () => {
      const area = $('#macro');
      try {
        await navigator.clipboard.writeText(area.value);
      } catch (e) {
        area.select();
        document.execCommand('copy');
      }
      $('#msg-macro').textContent = 'Macro copiada.';
    });
    $('#baixar-macro').addEventListener('click', () => baixar('salas-de-encontro-foundry.js', $('#macro').value, 'text/javascript'));

    $('#baixar-dados').addEventListener('click', () => {
      const cab = '// Dados do gerador de salas. Substitua o docs/dados.js por este arquivo para publicar.\n';
      baixar('dados.js', `${cab}window.DADOS_PADRAO = ${JSON.stringify(estado, null, 2)};\n`, 'text/javascript');
    });
    $('#importar').addEventListener('change', importar);
    $('#restaurar').addEventListener('click', () => {
      if (!confirm('Descartar as alterações salvas neste navegador e voltar ao dados.js publicado?')) return;
      try { localStorage.removeItem(CHAVE); } catch (e) { /* nada a limpar */ }
      carregar();
      ultimaRolagem = null;
      preencherForm(null);
      renderPatamares();
      renderTudo();
      $('#msg-dados').textContent = 'Alterações locais descartadas.';
    });
  }

  iniciar();
})();
