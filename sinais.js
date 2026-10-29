// Jogos do Magnavox Odyssey (1972), pelas regras do manual original:
// https://archive.org/details/manual-magnavox-odyssey
// O motor.js chama Sinais.criar() e põe o elemento devolvido dentro da tela da TV.
// As folhas de plástico vêm de sinais-folhas.js, geradas das ilustrações do manual.
const Sinais = (() => {
  const L = 320, A = 240;                  // tela, em unidades do canvas
  const LUZ = 12, BOLA = 6;
  const V_LUZ = 120, V_BOLA = 140, VY_MAX = 140;
  const V_GIRO = 1.2;                      // o botão de English vai de -1 a 1; segurar a tecla gira, soltar deixa onde está

  // O manual diz só que a bola que sai por cima ou por baixo está "off the table" e o ponto é perdido,
  // sem dizer quem perde. "remetente": perde quem mandou a bola (o dono do English). "lado": perde quem está
  // na metade da tela por onde ela saiu.
  const FORA_PERDE = "remetente";

  const TECLAS = [
    { cima: "KeyW", baixo: "KeyS", esq: "KeyA", dir: "KeyD", englishCima: "KeyQ", englishBaixo: "KeyE", reset: "KeyF" },
    { cima: "ArrowUp", baixo: "ArrowDown", esq: "ArrowLeft", dir: "ArrowRight", englishCima: "Comma", englishBaixo: "Period", reset: "Enter" }
  ];
  const NOME_RESET = ["F", "Enter"];
  const USADAS = new Set([...TECLAS.flatMap(t => Object.values(t)), "KeyM", "KeyO", "KeyT", "KeyY"]);
  const numeroDaTecla = code => (/^(?:Digit|Numpad)([1-9])$/.exec(code) || [])[1];

  // as folhas ficam em outro arquivo, ao lado deste
  if (typeof SINAIS_FOLHAS === "undefined" && document.currentScript) {
    const s = document.createElement("script");
    s.src = document.currentScript.src.replace(/[^/]*$/, "sinais-folhas.js");
    document.head.append(s);
  }
  const imagens = {};
  function folha(nome) {
    if (typeof SINAIS_FOLHAS === "undefined") return null;
    if (!imagens[nome]) { imagens[nome] = new Image(); imagens[nome].src = SINAIS_FOLHAS[nome]; }
    return imagens[nome].complete ? imagens[nome] : null;
  }

  const limitar = (v, min, max) => Math.min(max, Math.max(min, v));
  const eixo = (teclas, mais, menos) => (teclas.has(mais) ? 1 : 0) - (teclas.has(menos) ? 1 : 0);

  // máscaras (trilhas do Ski, pistas do Submarine): PNGs de alfa lidos uma vez para um vetor de pixels
  const mascaras = {};
  function mascara(uri) {
    if (!uri) return null;
    if (!mascaras[uri]) {
      const m = mascaras[uri] = { dados: null };
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = L; c.height = A;
        const x = c.getContext("2d");
        x.drawImage(img, 0, 0);
        m.dados = x.getImageData(0, 0, L, A).data;
      };
      img.src = uri;
    }
    return mascaras[uri].dados;
  }
  const naMascara = (d, x, y) => !!d && d[(limitar(Math.round(y), 0, A - 1) * L + limitar(Math.round(x), 0, L - 1)) * 4 + 3] > 0;
  const centroDe = l => ({ x: l.x + LUZ / 2, y: l.y + LUZ / 2 });
  const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function mover(luz, i, teclas, dt, caixa = { x0: 0, x1: L - LUZ, y0: 0, y1: A - LUZ }, v = V_LUZ) {
    const t = TECLAS[i];
    luz.x = limitar(luz.x + eixo(teclas, t.dir, t.esq) * v * dt, caixa.x0, caixa.x1);
    luz.y = limitar(luz.y + eixo(teclas, t.baixo, t.cima) * v * dt, caixa.y0, caixa.y1);
  }
  function girar(e, teclas, dt) {
    e.english.forEach((v, i) => {
      const t = TECLAS[i];
      e.english[i] = limitar(v + eixo(teclas, t.englishBaixo, t.englishCima) * V_GIRO * dt, -1, 1);
    });
  }

  // anda a bola um quadro. Só o English de quem mandou a bola age nela, e só quem recebe a devolve.
  // Devolve null, ou { perdeu, lado } quando a bola sai da tela (lado: 0 esquerda, 1 direita).
  function andarBola(e, dt) {
    const b = e.bola;
    const dono = b.vx > 0 ? 0 : 1;
    b.vy = e.english[dono] * VY_MAX;       // quanto mais girado o botão, mais a bola desvia
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    const r = e.luzes[1 - dono];
    if (b.x < r.x + LUZ && b.x + BOLA > r.x && b.y < r.y + LUZ && b.y + BOLA > r.y) {
      b.vx = -b.vx;
      b.x = b.vx > 0 ? r.x + LUZ : r.x - BOLA;
      return null;
    }
    if (b.x > L) return { perdeu: 1, lado: 1 };      // quem recebia a bola e errou
    if (b.x + BOLA < 0) return { perdeu: 0, lado: 0 };
    if (b.y + BOLA < 0 || b.y > A) {
      const lado = b.x + BOLA / 2 < L / 2 ? 0 : 1;
      return { perdeu: FORA_PERDE === "lado" ? lado : dono, lado };
    }
    return null;
  }

  // texto com uma faixa preta atrás, para ler por cima da folha
  function texto(c, s, x, y, tam = 10, negrito = false, alinhar = "center") {
    c.font = `${negrito ? "bold " : ""}${tam}px monospace`;
    c.textAlign = alinhar;
    const w = c.measureText(s).width;
    const x0 = alinhar === "center" ? x - w / 2 : alinhar === "left" ? x : x - w;
    c.fillStyle = "#000";
    c.fillRect(x0 - 2, y - tam, w + 4, tam + 3);
    c.fillStyle = "#f2f2f2";
    c.fillText(s, x, y);
  }
  const luz = (c, l) => c.fillRect(Math.round(l.x), Math.round(l.y), LUZ, LUZ);

  // ---------- Table Tennis (manual p. 10) ----------
  const PONTOS_POR_SAQUE = 5, PONTOS_JOGO = 21, DIFERENCA = 2;
  const mesa = {
    nome: "Table Tennis",
    folha: null,
    novo() {
      const y = A / 2 - LUZ / 2;
      return {
        luzes: [{ x: 24, y }, { x: L - 24 - LUZ, y }],
        placar: [0, 0],
        english: [0, 0],  // posição do botão de English de cada jogador
        bola: null,
        fase: "espera",   // "espera" (bola fora), "jogando" ou "fim"
        lado: null,       // lado em que a bola sumiu: só o Reset desse lado solta a bola (null: os dois)
        vencedor: null
      };
    },
    // quem saca: o jogador 1 começa, e a cada 5 pontos feitos o saque troca
    sacador: e => Math.floor((e.placar[0] + e.placar[1]) / PONTOS_POR_SAQUE) % 2,
    reset(e, lado) {
      if (e.fase === "fim") { Object.assign(e, mesa.novo()); return; }
      if (e.fase !== "espera" || (e.lado !== null && e.lado !== lado)) return;
      const s = mesa.sacador(e), j = e.luzes[s];
      e.bola = {
        x: s === 0 ? j.x + LUZ : j.x - BOLA,
        y: j.y + LUZ / 2 - BOLA / 2,
        vx: s === 0 ? V_BOLA : -V_BOLA,
        vy: e.english[s] * VY_MAX
      };
      e.fase = "jogando";
    },
    atualizar(e, dt, teclas) {
      e.luzes.forEach((l, i) => mover(l, i, teclas, dt));
      girar(e, teclas, dt);
      if (e.fase !== "jogando") return;
      const fim = andarBola(e, dt);
      if (!fim) return;
      const ganhou = 1 - fim.perdeu;
      e.placar[ganhou]++;
      e.bola = null;
      e.lado = fim.lado;
      const p = e.placar[ganhou], o = e.placar[1 - ganhou];
      if (p >= PONTOS_JOGO && p - o >= DIFERENCA) { e.fase = "fim"; e.vencedor = ganhou; e.lado = null; }
      else e.fase = "espera";
    },
    desenhar(c, e) {
      c.fillStyle = "#f2f2f2";
      c.textAlign = "center";
      c.font = "bold 24px monospace";
      c.fillText(String(e.placar[0]).padStart(2, "0"), L / 4, 32);
      c.fillText(String(e.placar[1]).padStart(2, "0"), 3 * L / 4, 32);
      e.luzes.forEach(l => luz(c, l));
      if (e.bola) c.fillRect(Math.round(e.bola.x), Math.round(e.bola.y), BOLA, BOLA);
      if (e.fase === "fim") {
        texto(c, `Jogador ${e.vencedor + 1} venceu`, L / 2, A / 2, 16, true);
        texto(c, "aperte F ou Enter para novo jogo", L / 2, A - 14);
      } else if (e.fase === "espera") {
        texto(c, `aperte ${e.lado === null ? "F ou Enter" : NOME_RESET[e.lado]} para soltar a bola`, L / 2, A - 14);
      }
    }
  };

  // ---------- Tennis (manual pp. 11-12) ----------
  // Geometria da folha, em unidades da tela (medida na ilustração do manual).
  const REDE = 160, LINHA_SAQUE = [75, 246], Y_TOPO = 31, Y_MEIO = 123, Y_BASE = 213;
  const TERMOS = ["LOVE", "15", "30", "40"];
  const tenis = {
    nome: "Tennis",
    folha: "tenis",
    novo() {
      const e = {
        luzes: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        english: [0, 0],
        bola: null,
        fase: "espera",
        pontos: [0, 0], jogos: [0, 0], sets: [0, 0],
        sacador: 0,       // o jogador 1 saca primeiro (o manual decide numa troca de bolas)
        lado: 0,          // 0: direita da linha de fundo de quem saca, 1: esquerda; alterna a cada ponto
        tentativa: 1,
        saque: false,     // true até a bola passar da linha de saque
        alvo: null,
        aviso: "",
        vencedor: null
      };
      tenis.preparar(e);
      return e;
    },
    // o sacador fica atrás da linha de fundo e saca em diagonal; o recebedor fica fora da caixa de saque
    preparar(e) {
      const s = e.sacador, direita = e.lado === 0;
      const sacadorEmCima = s === 0 ? !direita : direita;     // o jogador 1 vê a direita embaixo, o 2 vê em cima
      const yCima = (Y_TOPO + Y_MEIO) / 2 - LUZ / 2, yBaixo = (Y_MEIO + Y_BASE) / 2 - LUZ / 2;
      const xSacador = s === 0 ? 1 : L - LUZ - 1, xReceptor = s === 0 ? L - LUZ - 1 : 1;
      e.luzes[s] = { x: xSacador, y: sacadorEmCima ? yCima : yBaixo };
      e.luzes[1 - s] = { x: xReceptor, y: sacadorEmCima ? yBaixo : yCima };
      e.alvo = { x: LINHA_SAQUE[1 - s], dir: s === 0 ? 1 : -1, y0: sacadorEmCima ? Y_MEIO : Y_TOPO, y1: sacadorEmCima ? Y_BASE : Y_MEIO };
      e.fase = "espera";
    },
    reset(e, i) {
      if (e.fase === "fim") { Object.assign(e, tenis.novo()); return; }
      // depois de um ponto a bola tem que voltar para o lado de quem saca: só o Reset do sacador a solta
      if (e.fase !== "espera" || i !== e.sacador) return;
      const l = e.luzes[i];
      e.bola = {
        x: i === 0 ? l.x + LUZ : l.x - BOLA,
        y: l.y + LUZ / 2 - BOLA / 2,
        vx: i === 0 ? V_BOLA : -V_BOLA,
        vy: e.english[i] * VY_MAX
      };
      e.saque = true;
      e.aviso = "";
      e.fase = "jogando";
    },
    falta(e) {
      e.bola = null;
      if (e.tentativa === 1) { e.tentativa = 2; e.aviso = "falta: segundo saque"; tenis.preparar(e); }
      else { e.aviso = "dupla falta"; tenis.ponto(e, 1 - e.sacador); }
    },
    ponto(e, ganhou) {
      e.bola = null;
      e.tentativa = 1;
      e.lado = 1 - e.lado;
      const p = ++e.pontos[ganhou], o = e.pontos[1 - ganhou];
      if (p >= 4 && p - o >= 2) {                                // GAME só com 2 pontos de diferença
        e.pontos = [0, 0];
        const j = ++e.jogos[ganhou];
        e.sacador = 1 - e.sacador;                               // quem recebia passa a sacar no jogo seguinte
        e.lado = 0;                                              // o saque sempre começa pela direita
        if (j >= 6 && j - e.jogos[1 - ganhou] >= 2) {            // SET: 6 jogos, com 2 de diferença
          e.jogos = [0, 0];
          if (++e.sets[ganhou] === 2) { e.fase = "fim"; e.vencedor = ganhou; return; }   // MATCH: 2 de 3 sets
        }
      }
      tenis.preparar(e);
    },
    atualizar(e, dt, teclas) {
      // cada jogador fica no seu lado da rede, e só se mexe depois do saque (manual p. 12, ilustração D)
      if (e.fase === "jogando") e.luzes.forEach((l, i) => mover(l, i, teclas, dt, { x0: i === 0 ? 0 : REDE, x1: i === 0 ? REDE - LUZ : L - LUZ, y0: 0, y1: A - LUZ }));
      girar(e, teclas, dt);
      if (e.fase !== "jogando") return;
      const fim = andarBola(e, dt);
      if (e.saque) {
        // o saque só vale se a bola chegar à caixa de saque
        const x = e.bola.x + BOLA / 2, y = e.bola.y + BOLA / 2;
        if (e.alvo.dir > 0 ? x >= e.alvo.x : x <= e.alvo.x) {
          if (y >= e.alvo.y0 && y <= e.alvo.y1) e.saque = false;
          else return tenis.falta(e);
        } else if (fim) return tenis.falta(e);
      }
      if (fim && !e.saque) tenis.ponto(e, 1 - fim.perdeu);
    },
    // o sacador anuncia o placar primeiro (manual p. 12)
    placar(e) {
      const [a, b] = [e.pontos[e.sacador], e.pontos[1 - e.sacador]];
      if (a >= 3 && b >= 3) return a === b ? "40-ALL" : `VANT. J${(a > b ? e.sacador : 1 - e.sacador) + 1}`;
      return `${TERMOS[a]}-${TERMOS[b]}`;
    },
    desenhar(c, e, camada) {
      c.fillStyle = "#f2f2f2";
      e.luzes.forEach(l => luz(c, l));
      if (e.bola) c.fillRect(Math.round(e.bola.x), Math.round(e.bola.y), BOLA, BOLA);
      camada();
      texto(c, `SETS ${e.sets[0]}-${e.sets[1]}   JOGOS ${e.jogos[0]}-${e.jogos[1]}`, L / 2, 12);
      if (e.fase === "fim") {
        texto(c, `Jogador ${e.vencedor + 1} venceu a partida`, L / 2, A / 2, 12, true);
        texto(c, "aperte F ou Enter para nova partida", L / 2, A - 14);
        return;
      }
      texto(c, `J${e.sacador + 1} saca   ${tenis.placar(e)}`, L / 2, 25);
      if (e.aviso) texto(c, e.aviso, L / 2, A / 2, 12, true);
      if (e.fase === "espera") texto(c, `${e.tentativa === 2 ? "segundo saque: " : ""}aperte ${NOME_RESET[e.sacador]} para sacar`, L / 2, A - 14);
    }
  };

  // ---------- Cat and Mouse (manual p. 24) ----------
  const COLUNAS = 14, LINHAS = 11, CW = L / COLUNAS, CH = A / LINHAS;
  const RATO_INICIO = [5, 3], GATO_INICIO = [9, 10], CASA = [14, 11];       // coluna, linha (1 a 14, 1 a 11)
  const centro = ([c, l]) => ({ x: (c - 0.5) * CW - LUZ / 2, y: (l - 0.5) * CH - LUZ / 2 });
  const celula = l => [Math.floor((l.x + LUZ / 2) / CW) + 1, Math.floor((l.y + LUZ / 2) / CH) + 1];
  const parede = ([c, l]) => typeof SINAIS_FOLHAS !== "undefined" && !!SINAIS_FOLHAS.gatoMapa[l - 1]?.[c - 1];
  const CONTAGEM = ["1", "2", "3", "VAI"];
  const gato = {
    nome: "Cat and Mouse",
    folha: "gato",
    novo() {
      const e = { conjunto: 0, gato: 0, corrida: 0, pontos: [0, 0], fase: "espera", t: 0, aviso: "", rato: true, luzes: [{ x: 0, y: 0 }, { x: 0, y: 0 }] };
      gato.posicionar(e);
      return e;
    },
    inicio(e, i) { return centro(i === e.gato ? GATO_INICIO : RATO_INICIO); },
    posicionar(e) { e.luzes = [0, 1].map(i => gato.inicio(e, i)); e.rato = true; },
    reset(e) {
      if (e.fase === "fim") { Object.assign(e, gato.novo()); return; }
      if (e.fase === "fim-corrida") {
        if (++e.corrida === 3) {                       // o rato tem 3 corridas por conjunto; depois trocam os controles
          if (e.conjunto === 1) { e.fase = "fim"; return; }
          e.conjunto = 1; e.gato = 1 - e.gato; e.corrida = 0;
        }
        e.aviso = "";
        gato.posicionar(e);
        e.fase = "espera";
      } else if (e.fase === "espera") { e.fase = "contando"; e.t = 0; }
    },
    atualizar(e, dt, teclas) {
      if (e.fase === "contando") { e.t += dt; if (e.t >= CONTAGEM.length * 0.6) e.fase = "correndo"; return; }
      if (e.fase !== "correndo") return;
      e.luzes.forEach((l, i) => {
        mover(l, i, teclas, dt);
        // quem entra num quadrado azul volta na hora para a posição de partida
        if (parede(celula(l))) Object.assign(l, gato.inicio(e, i));
      });
      const g = e.luzes[e.gato], r = e.luzes[1 - e.gato];
      if (Math.abs(g.x - r.x) < LUZ - 2 && Math.abs(g.y - r.y) < LUZ - 2) {
        // o gato apaga o rato: o rato ganha o valor do quadrado (coluna + linha)
        const [c, l] = celula(r), v = c + l;
        e.pontos[1 - e.gato] += v;
        e.aviso = `pego em ${c}+${l} = ${v} pontos`;
        e.rato = false;
        e.fase = "fim-corrida";
      } else if (celula(r).join() === CASA.join()) {
        e.aviso = "o rato chegou em casa";           // o manual não diz quantos pontos vale
        e.fase = "fim-corrida";
      }
    },
    desenhar(c, e, camada) {
      c.fillStyle = "#f2f2f2";
      e.luzes.forEach((l, i) => { if (e.rato || i === e.gato) luz(c, l); });
      camada();
      // adesivos numerados do manual: colunas na linha de cima e linhas na coluna da direita
      c.fillStyle = "#d33"; c.textAlign = "center"; c.font = "bold 8px monospace";
      const adesivo = (n, x, y) => { c.fillStyle = "#d33"; c.beginPath(); c.arc(x, y, 5.5, 0, 7); c.fill(); c.fillStyle = "#fff"; c.fillText(n, x, y + 3); };
      if (c.canvas.folhaLigada) {
        for (let k = 1; k <= COLUNAS; k++) adesivo(k, (k - 0.5) * CW, 6);
        for (let k = 1; k <= LINHAS; k++) adesivo(k, L - 6, (k - 0.5) * CH);
      }
      texto(c, `rato J${(1 - e.gato) + 1} ${e.pontos[1 - e.gato]}  |  gato J${e.gato + 1} ${e.pontos[e.gato]}  |  corrida ${Math.min(e.corrida + 1, 3)}/3  conjunto ${e.conjunto + 1}/2`, L / 2, A - 3, 8);
      if (e.fase === "contando") texto(c, CONTAGEM[Math.min(3, Math.floor(e.t / 0.6))], L / 2, A / 2, 24, true);
      if (e.aviso) texto(c, e.aviso, L / 2, A / 2 + 20, 12, true);
      if (e.fase === "espera") texto(c, "aperte F ou Enter para começar a corrida", L / 2, A - 16);
      if (e.fase === "fim-corrida") texto(c, "aperte F ou Enter para seguir", L / 2, A - 16);
      if (e.fase === "fim") {
        const [a, b] = e.pontos;
        texto(c, a === b ? "empate" : `Jogador ${a > b ? 1 : 2} venceu`, L / 2, A / 2 - 14, 16, true);
        texto(c, `J1 ${a}   J2 ${b}   (F ou Enter: novo jogo)`, L / 2, A - 16);
      }
    }
  };

  // ---------- Hockey (manual pp. 19-20) ----------
  // Geometria medida na folha: linha vermelha no centro, 4 círculos de face-off (mais o centro) e as redes (polígonos).
  const VERMELHA = 160;
  const CENTRO = { x: 160, y: 116 };
  const CIRCULOS = [{ x: 80, y: 56 }, { x: 240, y: 56 }, { x: 80, y: 175 }, { x: 240, y: 175 }];
  const REDES = [[[21, 79], [2, 98], [2, 140], [22, 158]], [[299, 79], [318, 98], [318, 140], [298, 158]]];   // rede do jogador 1 e do 2
  const ABERTURA = [21.5, 298.5];                  // a bola só entra de verdade pelo lado aberto da rede, nunca pela linha preta
  const PERIODOS = 3, JOGADAS = 20;
  function noPoligono(x, y, p) {
    let dentro = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) dentro = !dentro;
    }
    return dentro;
  }
  const maisPerto = (lista, p) => lista.reduce((a, c) => (distancia(c, p) < distancia(a, p) ? c : a));
  const hockey = {
    nome: "Hockey",
    folha: "hockey",
    novo() {
      const e = {
        luzes: [{ x: 0, y: 0 }, { x: 0, y: 0 }], english: [0, 0], puck: null, fase: "espera",
        placar: [0, 0], periodo: 1, jogada: 0, circulo: CENTRO,
        tiro: null,        // última rebatida: quem bateu e se estava do outro lado da linha vermelha
        fora: false,       // o disco saiu por cima ou por baixo e ainda não voltou
        saida: null, faltou: false, aviso: "", vencedor: null
      };
      hockey.faceoff(e, CENTRO);
      return e;
    },
    faceoff(e, c) {
      e.luzes[0] = { x: c.x - 30 - LUZ / 2, y: c.y - LUZ / 2 };
      e.luzes[1] = { x: c.x + 30 - LUZ / 2, y: c.y - LUZ / 2 };
      e.circulo = c; e.puck = null; e.fase = "espera";
    },
    // fim de uma jogada: nova disputa de bola; a cada 20 jogadas, novo período; depois de 3 períodos, acaba
    fimDaJogada(e, c) {
      e.puck = null;
      if (e.jogada >= JOGADAS) {
        if (e.periodo === PERIODOS) { e.fase = "fim"; e.vencedor = e.placar[0] === e.placar[1] ? null : e.placar[0] > e.placar[1] ? 0 : 1; return; }
        e.periodo++; e.jogada = 0;
      }
      hockey.faceoff(e, c);
    },
    reset(e, i) {
      if (e.fase === "fim") { Object.assign(e, hockey.novo()); return; }
      if (e.fase !== "espera") return;
      e.jogada++;                                 // cada Reset começa uma jogada nova
      e.aviso = ""; e.tiro = null; e.fora = false; e.faltou = false;
      e.puck = { x: e.circulo.x - BOLA / 2, y: e.circulo.y - BOLA / 2, vx: i === 0 ? V_BOLA : -V_BOLA, vy: e.english[i] * VY_MAX };
      e.fase = "jogando";
    },
    gol(e, k) {
      const quem = 1 - k;                         // o disco entrou na rede do jogador k
      if (e.tiro && e.tiro.por === quem && e.tiro.cruzou) { e.placar[quem]++; e.aviso = `gol do jogador ${quem + 1}`; }
      else e.aviso = "gol não vale: o chute saiu antes da linha vermelha";
      hockey.fimDaJogada(e, CENTRO);              // depois de um gol, nova disputa no centro
    },
    atualizar(e, dt, teclas) {
      if (e.fase === "jogando") e.luzes.forEach((l, i) => mover(l, i, teclas, dt));
      girar(e, teclas, dt);
      if (e.fase !== "jogando") return;
      const b = e.puck, dono = b.vx > 0 ? 0 : 1;
      const antes = { x: b.x + BOLA / 2, y: b.y + BOLA / 2 };
      b.vy = e.english[dono] * VY_MAX;
      b.x += b.vx * dt; b.y += b.vy * dt;
      const agora = { x: b.x + BOLA / 2, y: b.y + BOLA / 2 };
      const noRinque = b.y >= 0 && b.y + BOLA <= A;
      const r = e.luzes[1 - dono], rc = centroDe(r);
      // o goleiro que entra na própria rede comete falta (a regra de usar uma só mão não dá para impor no teclado)
      if (!e.faltou && noPoligono(rc.x, rc.y, REDES[1 - dono])) { e.faltou = true; e.aviso = `falta do goleiro J${2 - dono}: uma mão só nas próximas 2 jogadas`; }
      if (noRinque && b.x < r.x + LUZ && b.x + BOLA > r.x && b.y < r.y + LUZ && b.y + BOLA > r.y) {
        b.vx = -b.vx;
        b.x = b.vx > 0 ? r.x + LUZ : r.x - BOLA;
        // quem bateu é o dono da nova direção; o chute só vale se ele estava no gelo do adversário
        e.tiro = { por: 1 - dono, cruzou: 1 - dono === 0 ? rc.x > VERMELHA : rc.x < VERMELHA };
        return;
      }
      for (const k of [0, 1]) {
        if (noPoligono(agora.x, agora.y, REDES[k]) && !noPoligono(antes.x, antes.y, REDES[k]) && (k === 0 ? antes.x >= ABERTURA[0] : antes.x <= ABERTURA[1])) return hockey.gol(e, k);
      }
      if (!noRinque) { if (!e.fora) e.saida = { ...agora }; e.fora = true; }
      else if (e.fora) { e.fora = false; e.aviso = "passe pela tabela"; }
      if (b.x > L || b.x + BOLA < 0) {
        const lado = b.x > L ? 1 : 0;
        const y = limitar(agora.y, 0, A);
        if (e.fora) {                                                    // impedimento: face-off perto de onde saiu do gelo
          e.aviso = "impedimento";
          return hockey.fimDaJogada(e, maisPerto(CIRCULOS, e.saida));
        }
        if (e.tiro && e.tiro.por === dono && e.tiro.cruzou) {            // passou da rede depois de um chute válido
          e.aviso = "passou da rede";
          return hockey.fimDaJogada(e, maisPerto(CIRCULOS.filter(c => (c.x < VERMELHA) === (lado === 0)), { x: 0, y }));
        }
        e.aviso = "icing";                                               // face-off na ala do atacante
        const ly = centroDe(e.luzes[dono]).y;
        return hockey.fimDaJogada(e, maisPerto(CIRCULOS.filter(c => (c.x < VERMELHA) === (dono === 0)), { x: 0, y: ly }));
      }
    },
    desenhar(c, e, camada) {
      c.fillStyle = "#f2f2f2";
      e.luzes.forEach(l => luz(c, l));
      if (e.puck) c.fillRect(Math.round(e.puck.x), Math.round(e.puck.y), BOLA, BOLA);
      camada();
      texto(c, `PERÍODO ${e.periodo}/${PERIODOS}   JOGADA ${e.jogada}/${JOGADAS}   J1 ${e.placar[0]} x ${e.placar[1]} J2`, L / 2, 12, 9);
      if (e.aviso) texto(c, e.aviso, L / 2, 26, 10, true);
      if (e.fase === "fim") {
        texto(c, e.vencedor === null ? "empate" : `Jogador ${e.vencedor + 1} venceu`, L / 2, A / 2, 16, true);
        texto(c, "aperte F ou Enter para novo jogo", L / 2, A - 14);
      } else if (e.fase === "espera") texto(c, "face-off: aperte F ou Enter para soltar o disco", L / 2, A - 14);
    }
  };

  // ---------- Ski (manual pp. 21-22) ----------
  const V_SKI = 70;
  const FIM_SKI = { x: 303, y: 217 };                  // a figura do esquiador no fim da trilha
  const TRILHAS = [["stmoritz", "St. Moritz"], ["aspen", "Aspen"], ["olimpica", "Olympic"]];
  const METODOS = ["pontos", "tempo"];
  const MONTANHA_PONTOS = [25, 30, 25];                // oeste, central, leste
  const folhas = () => (typeof SINAIS_FOLHAS === "undefined" ? {} : SINAIS_FOLHAS);
  const ski = {
    nome: "Ski",
    folha: "ski",
    novo() {
      return { fase: "escolha", trilha: 0, metodo: 0, corrida: 0, luz: { x: 4, y: 98 }, entrou: false, fora: false,
               penal: 0, extra: 0, t: 0, desq: false, tocados: [], resultados: [[], []], aviso: "" };
    },
    jogador: e => e.corrida % 2,                        // os jogadores se alternam; cada um faz 3 corridas
    posicionar(e) {
      const p = (folhas().skiPartida || [[10, 104]])[0];
      Object.assign(e, { luz: { x: p[0] - LUZ / 2, y: p[1] - LUZ / 2 }, entrou: false, fora: false, penal: 0, extra: 0, t: 0, desq: false, tocados: [], aviso: "", fase: "pronto" });
    },
    tecla(e, code) {
      if (e.fase !== "escolha") return;
      if (code === "KeyT") e.trilha = (e.trilha + 1) % TRILHAS.length;
      if (code === "KeyY") e.metodo = (e.metodo + 1) % METODOS.length;
    },
    reset(e) {
      if (e.fase === "escolha") ski.posicionar(e);
      else if (e.fase === "pronto") { e.fase = "contando"; e.t = 0; }
      else if (e.fase === "fim-corrida") { if (++e.corrida === 6) e.fase = "fim"; else ski.posicionar(e); }
      else if (e.fase === "fim") Object.assign(e, ski.novo());
    },
    toca(e, id, penal, extra) {
      if (e.tocados.includes(id)) return;
      e.tocados.push(id); e.penal += penal; e.extra += extra;
    },
    atualizar(e, dt, teclas) {
      if (e.fase === "contando") { e.t += dt; if (e.t >= CONTAGEM.length * 0.6) { e.fase = "descendo"; e.t = 0; } return; }
      if (e.fase !== "descendo") return;
      e.t += dt;
      mover(e.luz, ski.jogador(e), teclas, dt, undefined, V_SKI);
      const p = centroDe(e.luz), f = folhas();
      const na = naMascara(mascara((f.skiTrilhas || {})[TRILHAS[e.trilha][0]]), p.x, p.y);
      if (na) { e.entrou = true; e.fora = false; }
      else if (e.entrou && !e.fora) { e.fora = true; e.penal += 5; e.extra += 1; }   // cada saída da trilha: 5 pontos ou 1 segundo
      (f.skiObjetos || []).forEach((o, i) => {
        if (Math.abs(o.x - p.x) < LUZ / 2 + 3 && Math.abs(o.y - p.y) < LUZ / 2 + 3) {
          if (o.tipo === "portao") ski.toca(e, `o${i}`, 10, 2); else ski.toca(e, `o${i}`, 15, 3);
        }
      });
      (f.skiMontanhas || []).forEach((m, i) => {
        const [x0, y0, x1, y1] = m.caixa;
        if (e.luz.x < x1 && e.luz.x + LUZ > x0 && e.luz.y < y1 && e.luz.y + LUZ > y0 && !e.tocados.includes(`m${i}`)) {
          e.tocados.push(`m${i}`);
          if (METODOS[e.metodo] === "pontos") e.penal += MONTANHA_PONTOS[i]; else e.desq = true;    // no tempo, montanha desclassifica a corrida
        }
      });
      if (distancia(p, FIM_SKI) < 10) {
        e.fase = "fim-corrida";
        const r = { pontos: e.penal, tempo: Math.round((e.t + e.extra) * 10) / 10, desq: e.desq };
        e.resultados[ski.jogador(e)].push(r);
        e.aviso = e.desq ? "desclassificado: tocou numa montanha" : METODOS[e.metodo] === "pontos" ? `${r.pontos} pontos de penalidade` : `${r.tempo} s`;
      }
    },
    // o tempo vale o melhor tempo válido de cada esquiador; os pontos, a soma das 3 corridas (vence quem tem menos)
    total(e, j) {
      const r = e.resultados[j];
      if (METODOS[e.metodo] === "pontos") return r.reduce((s, x) => s + x.pontos, 0);
      const v = r.filter(x => !x.desq).map(x => x.tempo);
      return v.length ? Math.min(...v) : Infinity;
    },
    desenhar(c, e, camada) {
      c.fillStyle = "#f2f2f2";
      if (["pronto", "contando", "descendo"].includes(e.fase) && (!e.entrou || !e.fora)) luz(c, e.luz);    // fora da trilha a luz some
      camada();
      const j = ski.jogador(e), n = Math.floor(e.corrida / 2) + 1;
      if (e.fase === "escolha") {
        texto(c, "SKI", L / 2, 40, 16, true);
        texto(c, `T  trilha: ${TRILHAS[e.trilha][1]}`, L / 2, 90, 12);
        texto(c, `Y  método: ${METODOS[e.metodo]}`, L / 2, 110, 12);
        texto(c, "F ou Enter: começar (J1 e J2 se alternam, 3 corridas cada)", L / 2, A - 14, 9);
        return;
      }
      if (e.fase === "fim") {
        const a = ski.total(e, 0), b = ski.total(e, 1);
        texto(c, a === b ? "empate" : `Jogador ${a < b ? 1 : 2} venceu`, L / 2, A / 2 - 10, 16, true);
        const fmt = v => (v === Infinity ? "desclassificado" : v);
        texto(c, `J1 ${fmt(a)}   J2 ${fmt(b)}${METODOS[e.metodo] === "tempo" ? " s" : ""}   (F ou Enter: novo jogo)`, L / 2, A - 14, 9);
        return;
      }
      texto(c, `J${j + 1} corrida ${n}/3   ${TRILHAS[e.trilha][1]}   ` + (METODOS[e.metodo] === "pontos" ? `penalidade ${e.penal}` : `tempo ${(e.t + e.extra).toFixed(1)}`), L / 2, 12, 9);
      if (e.fase === "contando") texto(c, CONTAGEM[Math.min(3, Math.floor(e.t / 0.6))], L / 2, A / 2, 24, true);
      if (e.aviso) texto(c, e.aviso, L / 2, A / 2, 12, true);
      if (e.fase === "pronto") texto(c, `J${j + 1}: aperte F ou Enter para largar`, L / 2, A - 14);
      if (e.fase === "fim-corrida") texto(c, "aperte F ou Enter para seguir", L / 2, A - 14);
    }
  };

  // ---------- Submarine (manual p. 23) ----------
  const COMBOIO = { x: 258.1, y: 34.8 }, SUBMARINO = { x: 12.6, y: 114.5 }, PORTO = { x: 12.5, y: 218.5 };   // medidos na folha
  const V_COMBOIO = 60;
  const submarino = {
    nome: "Submarine",
    folha: "submarino",
    novo() {
      const e = { capitao: 0, conjunto: 0, missao: 0, total: [0, 0], perdidos: 0, english: [0, 0], fase: "espera",
                  navio: { x: 0, y: 0 }, visivel: true, pronto: true, torpedo: null, entrou: false, fora: false, aviso: "" };
      submarino.posicionar(e);
      return e;
    },
    posicionar(e) {
      Object.assign(e, { navio: { x: COMBOIO.x - LUZ / 2, y: COMBOIO.y - LUZ / 2 }, visivel: true, pronto: true, torpedo: null, entrou: false, fora: false, perdidos: 0, aviso: "", fase: "espera" });
    },
    reset(e, i) {
      if (e.fase === "fim") { Object.assign(e, submarino.novo()); return; }
      if (e.fase === "espera") { e.fase = "navegando"; return; }
      if (e.fase === "fim-missao") {
        if (++e.missao === 3) {                          // 3 missões por capitão; depois os jogadores trocam os controles
          if (e.conjunto === 1) { e.fase = "fim"; return; }
          e.conjunto = 1; e.capitao = 1 - e.capitao; e.missao = 0;
        }
        submarino.posicionar(e);
        return;
      }
      if (e.fase !== "navegando") return;
      if (i === e.capitao && e.pronto && !e.torpedo) {   // o Reset do capitão lança o torpedo
        e.torpedo = { x: SUBMARINO.x + LUZ / 2, y: SUBMARINO.y - BOLA / 2, vx: V_BOLA, vy: e.english[e.capitao] * VY_MAX };
      } else if (i !== e.capitao && !e.pronto) {         // o Reset do comandante recarrega o tubo
        e.pronto = true; e.visivel = true; e.aviso = "";
      }
    },
    atualizar(e, dt, teclas) {
      girar(e, teclas, dt);
      if (e.fase !== "navegando") return;
      const cmd = 1 - e.capitao;
      if (e.visivel) mover(e.navio, cmd, teclas, dt, undefined, V_COMBOIO);
      const p = centroDe(e.navio);
      if (e.torpedo) {
        const t = e.torpedo;
        t.vy = e.english[e.capitao] * VY_MAX;           // o English do capitão dirige o torpedo
        t.x += t.vx * dt; t.y += t.vy * dt;
        if (e.visivel && t.x < e.navio.x + LUZ && t.x + BOLA > e.navio.x && t.y < e.navio.y + LUZ && t.y + BOLA > e.navio.y) {
          e.torpedo = null; e.visivel = false; e.pronto = false; e.perdidos++;      // torpedo e navio somem
          e.aviso = "acertou: o comandante recarrega com o Reset dele";
        } else if (t.x > L || t.y < -BOLA || t.y > A) e.torpedo = null;
      }
      if (!e.visivel) return;
      // sair da pista é bater em minas: um navio perdido
      const na = naMascara(mascara(folhas().subPista), p.x, p.y);
      if (na) { e.entrou = true; e.fora = false; }
      else if (e.entrou && !e.fora) { e.fora = true; e.perdidos++; e.aviso = "mina: navio perdido"; }
      if (distancia(p, PORTO) < 10) {                    // o fim da pista é o porto seguro
        e.total[e.capitao] += e.perdidos;
        e.aviso = `comboio a salvo: ${e.perdidos} navios perdidos`;
        e.fase = "fim-missao";
      }
    },
    desenhar(c, e, camada) {
      c.fillStyle = "#f2f2f2";
      luz(c, { x: SUBMARINO.x - LUZ / 2, y: SUBMARINO.y - LUZ / 2 });
      if (e.visivel) luz(c, e.navio);
      if (e.torpedo) c.fillRect(Math.round(e.torpedo.x), Math.round(e.torpedo.y), BOLA, BOLA);
      camada();
      texto(c, `capitão J${e.capitao + 1}   missão ${Math.min(e.missao + 1, 3)}/3   navios perdidos ${e.perdidos}   total J1 ${e.total[0]}  J2 ${e.total[1]}`, L / 2, 12, 8);
      if (e.aviso) texto(c, e.aviso, L / 2, 26, 9, true);
      if (e.fase === "espera") texto(c, `capitão J${e.capitao + 1}: English e ${NOME_RESET[e.capitao]}. comandante J${2 - e.capitao}: mover. aperte F ou Enter`, L / 2, A - 14, 8);
      if (e.fase === "fim-missao") texto(c, "aperte F ou Enter para seguir", L / 2, A - 14);
      if (e.fase === "fim") {
        const [a, b] = e.total;
        texto(c, a === b ? "empate" : `Jogador ${a > b ? 1 : 2} venceu`, L / 2, A / 2, 16, true);
        texto(c, `navios afundados: J1 ${a}   J2 ${b}   (F ou Enter: novo jogo)`, L / 2, A - 14, 9);
      }
    }
  };

  const JOGOS = [mesa, tenis, hockey, ski, submarino, gato];

  function criar() {
    const canvas = document.createElement("canvas");
    canvas.width = L; canvas.height = A;
    canvas.style.objectFit = "contain";     // sem cortar a tela se a da TV não for 4:3
    canvas.style.imageRendering = "pixelated";
    const c = canvas.getContext("2d");
    const teclas = new Set();
    const jogo = { atual: null, e: null };    // atual: null é o menu
    canvas.folhaLigada = true;
    canvas.sinais = jogo;                     // estado, para conferir nos testes

    function escolher(n) {
      jogo.atual = JOGOS[n] || null;
      jogo.e = jogo.atual && jogo.atual.novo();
    }

    const aoApertar = ev => {
      const n = numeroDaTecla(ev.code);
      if ((!USADAS.has(ev.code) && !n) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      ev.preventDefault();
      teclas.add(ev.code);
      if (ev.repeat) return;
      if (n) escolher(n - 1);
      else if (ev.code === "KeyM") escolher(-1);
      else if (ev.code === "KeyO") canvas.folhaLigada = !canvas.folhaLigada;
      else if (jogo.atual) {
        TECLAS.forEach((t, i) => { if (ev.code === t.reset) jogo.atual.reset(jogo.e, i); });
        if (jogo.atual.tecla) jogo.atual.tecla(jogo.e, ev.code);
      }
    };
    const aoSoltar = ev => teclas.delete(ev.code);
    const limpar = () => teclas.clear();
    addEventListener("keydown", aoApertar);
    addEventListener("keyup", aoSoltar);
    addEventListener("blur", limpar);

    function menu() {
      c.fillStyle = "#f2f2f2";
      texto(c, "MAGNAVOX ODYSSEY", L / 2, 40, 16, true);
      JOGOS.forEach((j, i) => texto(c, `${i + 1}  ${j.nome}`, L / 2, 80 + i * 18, 12));
      texto(c, "tecle o número do jogo", L / 2, A - 40);
      texto(c, "M: volta ao menu   O: tira ou põe a folha", L / 2, A - 26, 9);
    }

    // o motor tira o canvas da tela ao desligar ou trocar de canal
    let antes = performance.now();
    function quadro(agora) {
      if (!canvas.isConnected) {
        removeEventListener("keydown", aoApertar);
        removeEventListener("keyup", aoSoltar);
        removeEventListener("blur", limpar);
        return;
      }
      const dt = Math.min((agora - antes) / 1000, 0.05);
      antes = agora;
      c.fillStyle = "#000";
      c.fillRect(0, 0, L, A);
      if (!jogo.atual) menu();
      else {
        jogo.atual.atualizar(jogo.e, dt, teclas);
        // a folha fica por cima das luzes, como o plástico sobre a tela
        const camada = () => {
          const img = jogo.atual.folha && canvas.folhaLigada && folha(jogo.atual.folha);
          if (img) c.drawImage(img, 0, 0, L, A);
        };
        c.save();
        jogo.atual.desenhar(c, jogo.e, camada);
        c.restore();
        if (!jogo.atual.folha) camada();
      }
      requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
    return canvas;
  }

  return { criar };
})();
