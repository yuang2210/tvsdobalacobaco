const palco = document.getElementById("palco");
const abas = document.getElementById("abas");
const controles = document.getElementById("controles");
const info = document.getElementById("info");
const texto = document.getElementById("texto");

// O navegador só deixa fechar abas abertas por script; nas outras, vai para uma página em branco.
document.getElementById("fechar").onclick = () => {
  window.close();
  setTimeout(() => { location.href = "about:blank"; }, 150);
};

let estado, ruido;

// Uma TV só precisa de "imagem". O resto usa estes valores quando não for informado.
const PADRAO = {
  ano: "",
  tela: { x: 20, y: 20, w: 60, h: 60 },
  canais: [{ tipo: "html", conteudo: "" }],
  funcoes: ["ligar", "canal", "chuvisco"],
  texto: ""
};
TVS.forEach((tv, i) => {
  const arquivo = tv.id || "TV";
  TVS[i] = { ...PADRAO, nome: arquivo, ...tv };
});

const rotulo = tv => [tv.ano, tv.nome].filter(Boolean).join(" · ");

// ---------- chuvisco ----------
function iniciarChuvisco(canvas) {
  const c = canvas.getContext("2d");
  canvas.width = 160; canvas.height = 120;
  const img = c.createImageData(160, 120);
  return setInterval(() => {
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);
  }, 50);
}

function mostrarChuvisco(ms) {
  if (!estado.tv.funcoes.includes("chuvisco")) return Promise.resolve();
  estado.chuvisco.style.display = "block";
  return new Promise(r => setTimeout(() => { estado.chuvisco.style.display = "none"; r(); }, ms));
}

// ---------- tela ----------
// iframe de jogo (canal com "virtual: [largura, altura]"): o START GAME do site só funciona com o iframe de pelo menos
// uns 480x360, então ele é desenhado nesse tamanho e reduzido para caber na tela da TV
function escalarJogo() {
  const f = estado?.tela?.querySelector("iframe[data-virtual]");
  if (!f) return;
  const [w, h] = f.dataset.virtual.split("x").map(Number);
  const k = Math.min(estado.tela.clientWidth / w, estado.tela.clientHeight / h);
  Object.assign(f.style, { inset: "auto", left: "0", top: "0", width: w + "px", height: h + "px", transformOrigin: "0 0", transform: `scale(${k})` });
}
addEventListener("resize", escalarJogo);
new ResizeObserver(escalarJogo).observe(palco);

// tela inicial simulada de um serviço que não deixa o site abrir dentro de um iframe: só o nome, a cor e retângulos
// com títulos genéricos, sem logotipo nem capas de verdade
function desenharSimulacao(c) {
  const s = document.createElement("div");
  s.className = "sim";
  s.style.setProperty("--cor", c.cor || "#888");
  const topo = document.createElement("div");
  topo.className = "sim-topo";
  const nome = document.createElement("span");
  nome.className = "sim-nome"; nome.textContent = c.nome;
  topo.append(nome);
  ["Início", "Séries", "Filmes", "Minha lista"].forEach(t => { const a = document.createElement("span"); a.textContent = t; topo.append(a); });
  s.append(topo);
  ["Continuar assistindo", "Em alta"].forEach(titulo => {
    const linha = document.createElement("div");
    const h = document.createElement("div");
    h.className = "sim-titulo"; h.textContent = titulo;
    const cartoes = document.createElement("div");
    cartoes.className = "sim-cartoes";
    for (let i = 1; i <= 6; i++) { const k = document.createElement("div"); k.className = "sim-cartao"; k.textContent = `Título ${i}`; cartoes.append(k); }
    linha.append(h, cartoes); s.append(linha);
  });
  const rodape = document.createElement("div");
  rodape.className = "sim-rodape";
  rodape.append("Simulação da tela inicial: o site oficial não permite abrir aqui. ");
  const a = document.createElement("a");
  a.href = c.src; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = "Abrir o site oficial";
  rodape.append(a);
  s.append(rodape);
  return s;
}

// menu inicial de uma smart TV (tv.menu): uma grade de atalhos, um por canal, escolhida com as setas e o OK do controle
function desenharMenu() {
  const m = document.createElement("div");
  m.className = "menu-tv";
  const marca = document.createElement("div");
  marca.className = "menu-tv-marca"; marca.textContent = estado.tv.nome;
  const faixa = document.createElement("div");
  faixa.className = "menu-tv-faixa";
  estado.tv.canais.forEach((c, i) => {
    const t = document.createElement("div");
    t.className = "menu-tv-item" + (i === estado.sel ? " sel" : "");
    t.textContent = c.nome || `Canal ${i + 1}`;
    t.onclick = () => abrirDoMenu(i);
    faixa.append(t);
  });
  m.append(marca, faixa);
  return m;
}

function abrirDoMenu(i) {
  estado.canal = estado.sel = i; estado.emMenu = false;
  desenharCanal();
  info.textContent = `${rotulo(estado.tv)} — ${estado.tv.canais[i].nome || "canal " + (i + 1)}`;
}

function desenharCanal() {
  const { tela, tv, canal, ligada } = estado;
  [...tela.children].forEach(e => { if (e !== estado.chuvisco) e.remove(); });
  estado.midia = null;
  const acabouDeLigar = ligada && !estado.eraLigada;
  estado.eraLigada = ligada;
  if (!ligada) return;
  if (acabouDeLigar && tv.menu) estado.emMenu = true;
  if (tv.menu && estado.emMenu) { tela.insertBefore(desenharMenu(), estado.chuvisco); aplicarAjustes(); return; }
  const c = tv.canais[canal];
  let el;
  if (c.tipo === "video") {
    // c.partes: vários arquivos tocados em sequência (e voltando ao primeiro); c.src: um arquivo só
    const partes = c.partes || [c.src];
    let p = 0;
    el = document.createElement("video");
    el.src = partes[0]; el.autoplay = true; el.playsInline = true;
    el.onended = () => { p = (p + 1) % partes.length; el.src = partes[p]; el.play(); };
    el.volume = estado.volume; estado.midia = el;
  } else if (c.tipo === "odyssey") {
    el = Sinais.criar();
  } else if (c.tipo === "imagem") {
    el = document.createElement("img"); el.src = c.src;
  } else if (c.tipo === "youtube") {
    // c.src: link do vídeo ou só o ID
    const id = (c.src.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [, c.src])[1];
    el = document.createElement("iframe");
    el.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
    el.allow = "autoplay; fullscreen";
  } else if (c.tipo === "simulacao") {
    el = desenharSimulacao(c);
  } else if (c.tipo === "pagina") {
    // vale para um jogo em HTML (ex.: "jogo/index.html") ou um site que aceite ser incorporado
    el = document.createElement("iframe"); el.src = c.src;
    el.allow = "autoplay; fullscreen; gamepad";
    if (c.virtual) el.dataset.virtual = c.virtual.join("x");
  } else {
    el = document.createElement("div"); el.innerHTML = c.conteudo;
  }
  tela.insertBefore(el, estado.chuvisco);
  aplicarAjustes();
  escalarJogo();
}

// brilho, foco e sincronismo mexem no que aparece na tela
function aplicarAjustes() {
  const { tela, chuvisco, brilho, contraste, saturacao, matiz, foco, sinc, midia, volume } = estado;
  tela.style.filter = `brightness(${brilho}) contrast(${contraste}) saturate(${saturacao}) hue-rotate(${matiz}deg) blur(${(1 - foco) * 6}px)`;
  if (midia) midia.volume = volume;
  [...tela.children].forEach(c => { if (c !== chuvisco && !c.dataset.virtual) c.style.transform = `translateY(${(sinc - 50) * 2}%)`; });
}

// ---------- funções (cada uma monta seus botões) ----------
const FUNCOES = {
  ligar() {
    const b = botao("Ligar / Desligar", async () => {
      estado.ligada = !estado.ligada;
      if (estado.ligada) await mostrarChuvisco(400);
      desenharCanal();
    });
    return [b];
  },
  canal() {
    // cada TV pode trocar os nomes: rotulos: { canal: { nome: "imagem", anterior: "...", proximo: "..." } }
    const { nome = "canal", anterior = "Canal −", proximo = "Canal +" } = estado.tv.rotulos?.canal || {};
    const troca = async d => {
      if (!estado.ligada) return;
      const n = estado.tv.canais.length;
      estado.canal = (estado.canal + d + n) % n;
      await mostrarChuvisco(250);
      desenharCanal();
      info.textContent = `${rotulo(estado.tv)} — ${nome} ${estado.canal + 1}`;
    };
    return [botao(anterior, () => troca(-1)), botao(proximo, () => troca(1))];
  },
  volume() {
    const r = document.createElement("input");
    r.type = "range"; r.min = 0; r.max = 1; r.step = 0.05; r.value = estado.volume;
    r.oninput = () => { estado.volume = +r.value; if (estado.midia) estado.midia.volume = estado.volume; };
    return [r];
  },
  brilho: () => [ajuste("Brilho", 0.3, 1.5, 0.05, "brilho")],
  foco: () => [ajuste("Foco", 0, 1, 0.05, "foco")],
  sincronismo: () => [ajuste("Sincronismo", 0, 100, 1, "sinc")],
  contraste: () => [ajuste("Contraste", 0.5, 1.6, 0.05, "contraste")],
  saturacao: () => [ajuste("Saturação de cor", 0, 2.5, 0.05, "saturacao")],
  matiz: () => [ajuste("Matiz", -60, 60, 1, "matiz")],
  chuvisco() { return []; }, // usada por ligar/canal; sem botão próprio
  "tela-cheia"() {
    return [botao("Tela cheia", () => palco.requestFullscreen())];
  }
};

// controle deslizante que grava o valor em estado[campo]; sufixo mostra se é hipótese
function ajuste(nome, min, max, passo, campo) {
  const l = document.createElement("label");
  const r = document.createElement("input");
  r.type = "range"; r.min = min; r.max = max; r.step = passo; r.value = estado[campo];
  r.oninput = () => { estado[campo] = +r.value; aplicarAjustes(); };
  l.append(`${nome}${estado.tv.hipoteses ? " (hipótese) " : " "}`, r);
  return l;
}

function botao(texto, fn) {
  const b = document.createElement("button");
  b.textContent = texto; b.onclick = fn; return b;
}

// teclas do controle remoto desenhado ao lado da TV: acao = "ligar" | "canal+" | "canal-" | "vol+" | "vol-"
async function teclaDoControle(acao) {
  if (acao === "ligar") {
    estado.ligada = !estado.ligada;
    if (estado.ligada) await mostrarChuvisco(400);
    desenharCanal();
    return;
  }
  if (!estado.ligada) return;
  const noMenu = estado.tv.menu && estado.emMenu;
  if (acao === "home" || acao === "voltar") {
    if (!estado.tv.menu) return;
    estado.emMenu = true; estado.sel = estado.canal; desenharCanal();
    info.textContent = rotulo(estado.tv);
    return;
  }
  if (acao === "esq" || acao === "dir") {
    if (!noMenu) return;
    const n = estado.tv.canais.length;
    estado.sel = (estado.sel + (acao === "dir" ? 1 : -1) + n) % n;
    desenharCanal();
    return;
  }
  if (acao === "cima" || acao === "baixo") {
    // o menu tem 5 atalhos por linha
    if (!noMenu) return;
    const novo = estado.sel + (acao === "baixo" ? 5 : -5);
    if (novo >= 0 && novo < estado.tv.canais.length) { estado.sel = novo; desenharCanal(); }
    return;
  }
  if (acao === "ok") { if (noMenu) abrirDoMenu(estado.sel); return; }
  if (acao.startsWith("canal")) {
    const n = estado.tv.canais.length;
    estado.canal = (estado.canal + (acao === "canal+" ? 1 : -1) + n) % n;
    estado.emMenu = false;
    await mostrarChuvisco(250);
    desenharCanal();
    info.textContent = `${rotulo(estado.tv)} — canal ${estado.canal + 1}`;
  } else {
    estado.volume = Math.min(1, Math.max(0, estado.volume + (acao === "vol+" ? 0.1 : -0.1)));
    aplicarAjustes();
  }
}

// ---------- botões desenhados sobre a foto ----------
const estilo = document.createElement("style");
estilo.textContent = `
  #palco { container-type: inline-size; }
  #botoes { position: absolute; inset: 0; pointer-events: none; }
  .botao-img { position: absolute; transform: translate(-50%, -50%); touch-action: none; cursor: grab; pointer-events: auto; }
  .botao-img.knob { border-radius: 50%; aspect-ratio: 1; }
  .botao-img.knob::before { content: ""; position: absolute; left: 46%; top: 6%; width: 8%; height: 44%; background: #ffe9a0;
    box-shadow: 0 0 0 1px #000; border-radius: 2px; transform-origin: 50% 100%; transform: rotate(var(--ang)); }
  .botao-img.chave { border-radius: 6px; cursor: pointer; }
  .botao-img:hover, .botao-img:focus-visible { outline: 2px solid rgba(255, 233, 160, .8); outline-offset: 1px; }
  .menu-tv { display: flex; flex-direction: column; justify-content: space-between; padding: 4cqw; box-sizing: border-box;
    background: radial-gradient(ellipse at 30% 20%, #2c2c40, #0a0a12 70%); color: #fff; font-family: sans-serif; }
  .menu-tv-marca { font-size: 2.2cqw; font-weight: 700; letter-spacing: .04em; opacity: .9; }
  .menu-tv-faixa { display: flex; flex-wrap: wrap; gap: 1.2cqw; }
  .menu-tv-item { flex: 0 0 calc((100% - 4.8cqw) / 5); min-width: 0; height: 5.2cqw; border-radius: .8cqw; background: #3a3a4c; display: flex; align-items: center;
    justify-content: center; text-align: center; padding: .4cqw; box-sizing: border-box; font-size: 1.3cqw; font-weight: 600; cursor: pointer; }
  .menu-tv-item.sel { background: #a50034; outline: .25cqw solid #fff; }
  .sim { background: #101014; color: #fff; font-family: sans-serif; padding: 2cqw 3cqw; box-sizing: border-box;
    display: flex; flex-direction: column; gap: 1.6cqw; overflow: hidden; }
  .sim-topo { display: flex; align-items: center; gap: 1.8cqw; font-size: 1.1cqw; opacity: .9; }
  .sim-nome { font-size: 2.2cqw; font-weight: 800; color: var(--cor); margin-right: 2cqw; }
  .sim-titulo { font-size: 1.3cqw; font-weight: 700; margin-bottom: .6cqw; }
  .sim-cartoes { display: flex; gap: .8cqw; }
  .sim-cartao { flex: 1; height: 7cqw; border-radius: .5cqw; font-size: .9cqw; display: flex; align-items: flex-end; padding: .5cqw;
    box-sizing: border-box; background: linear-gradient(135deg, #3a3a46, #1b1b22); border-bottom: .3cqw solid var(--cor); }
  .sim-rodape { font-size: .95cqw; opacity: .7; margin-top: auto; }
  .sim-rodape a { color: #8cf; }
  .rotulo { position: absolute; transform: translate(-50%, -50%); background: #0c0c0c; color: #e8e2c8; font: 600 1.15cqw/1 sans-serif;
    padding: .3cqw .6cqw; letter-spacing: .05em; white-space: nowrap; border-radius: 2px; pointer-events: none; }
`;
document.head.append(estilo);

const ACOES = {
  brilho: { campo: "brilho", min: 0.3, max: 1.5 },
  contraste: { campo: "contraste", min: 0.5, max: 1.6 },
  saturacao: { campo: "saturacao", min: 0, max: 2.5 },
  matiz: { campo: "matiz", min: -60, max: 60 },
  volume: { campo: "volume", min: 0, max: 1 },
  foco: { campo: "foco", min: 0, max: 1 },
  sincronismo: { campo: "sinc", min: 0, max: 100 }
};

function montarBotoes(tv) {
  const camada = document.createElement("div"); camada.id = "botoes"; palco.append(camada);
  tv.botoes.forEach(b => {
    const rot = document.createElement("div");
    rot.className = "rotulo"; rot.textContent = b.texto;
    Object.assign(rot.style, { left: b.rx + "%", top: b.ry + "%" });
    const el = document.createElement("div");
    el.className = `botao-img ${b.tipo}`; el.tabIndex = 0; el.title = b.texto;
    el.style.left = b.x + "%"; el.style.top = b.y + "%";
    el.style.width = (b.w ?? b.tam) + "%";
    camada.append(rot, el);
    if (!b.texto) rot.style.display = "none";

    if (b.tipo === "tecla") {
      el.style.aspectRatio = "auto";
      el.style.height = b.h + "%";
      el.style.cursor = "pointer";
      el.onclick = () => teclaDoControle(b.acao);
      return;
    }

    if (b.tipo === "chave") {
      el.style.aspectRatio = "auto";
      el.style.height = b.h + "%";
      el.onclick = async () => {
        estado.ligada = !estado.ligada;
        if (estado.ligada) await mostrarChuvisco(400);
        desenharCanal();
      };
      return;
    }

    // knob: arrastar, rolar a roda ou usar as setas
    const acao = ACOES[b.funcao];
    const n = tv.canais.length;
    const ler = () => (b.funcao === "imagem" || b.funcao === "canal") ? estado.canal / Math.max(n - 1, 1)
      : (estado[acao.campo] - acao.min) / (acao.max - acao.min);
    const escrever = v => {
      v = Math.min(1, Math.max(0, v));
      if ((b.funcao === "imagem" || b.funcao === "canal")) {
        const i = Math.round(v * (n - 1));
        v = i / Math.max(n - 1, 1);
        if (i !== estado.canal) { estado.canal = i; desenharCanal(); info.textContent = `${rotulo(tv)} — imagem ${i + 1}`; }
      } else {
        estado[acao.campo] = acao.min + v * (acao.max - acao.min);
        aplicarAjustes();
      }
      el.style.setProperty("--ang", -135 + v * 270 + "deg");
    };
    el.style.setProperty("--ang", -135 + ler() * 270 + "deg");
    let inicio;
    el.onpointerdown = e => { el.setPointerCapture(e.pointerId); inicio = { x: e.clientX, y: e.clientY, v: ler() }; el.style.cursor = "grabbing"; };
    el.onpointermove = e => { if (inicio && Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) > 4) moveu = true; if (inicio) escrever(inicio.v + ((e.clientX - inicio.x) - (e.clientY - inicio.y)) / 150); };
    let moveu = false;
    el.onpointerup = async () => {
      el.style.cursor = "";
      const toque = inicio && !moveu;
      inicio = null; moveu = false;
      if (toque && b.liga) {
        estado.ligada = !estado.ligada;
        if (estado.ligada) await mostrarChuvisco(400);
        desenharCanal();
      }
    };
    el.onwheel = e => { e.preventDefault(); escrever(ler() - Math.sign(e.deltaY) * ((b.funcao === "imagem" || b.funcao === "canal") ? 1 / Math.max(n - 1, 1) : 0.05)); };
    el.onkeydown = e => {
      const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (d) { e.preventDefault(); escrever(ler() + d * ((b.funcao === "imagem" || b.funcao === "canal") ? 1 / Math.max(n - 1, 1) : 0.05)); }
    };
  });
}

// ---------- montar uma TV ----------
function abrirTV(i) {
  clearInterval(ruido);
  const tv = TVS[i];
  [...abas.children].forEach((b, j) => b.classList.toggle("ativa", i === j));
  palco.innerHTML = ""; controles.innerHTML = "";
  palco.style.width = tv.largura ? `min(90vw, ${tv.largura}px)` : "";

  if (tv.imagem) {
    const img = document.createElement("img"); img.src = tv.imagem; palco.append(img);
  } else {
    const m = document.createElement("div"); m.style.aspectRatio = "4 / 3"; palco.append(m);
  }
  const tela = document.createElement("div");
  tela.id = "tela";
  Object.assign(tela.style, { left: tv.tela.x + "%", top: tv.tela.y + "%", width: tv.tela.w + "%", height: tv.tela.h + "%" });
  if (tv.tela.formato === "redondo") tela.style.borderRadius = "50%";
  if (tv.tela.formato === "arredondado") tela.style.borderRadius = "7% / 9%";
  if (tv.tela.formato === "oval") tela.style.borderRadius = "42% / 52%";
  const chuvisco = document.createElement("canvas"); chuvisco.id = "chuvisco";
  tela.append(chuvisco); palco.append(tela);
  ruido = iniciarChuvisco(chuvisco);

  estado = { tv, tela, chuvisco, canal: 0, sel: 0, emMenu: false, eraLigada: false, ligada: false, volume: 0.5, midia: null, brilho: 1, contraste: 1, saturacao: 1, matiz: 0, foco: 1, sinc: 50 };
  // "botoes" ficam sobre a foto; "funcoes" ficam em um painel abaixo
  if (tv.botoes) montarBotoes(tv);
  tv.funcoes.forEach(f => FUNCOES[f]().forEach(el => controles.append(el)));
  info.textContent = rotulo(tv);
  texto.innerHTML = tv.texto || "";
}

// /ID abre só essa TV, sem as abas (cada TV tem um ID.html). Em index.html ou na raiz, ficam as abas.
const ultimo = location.pathname.split("/").filter(Boolean).pop()?.replace(/\.html$/, "");
const escolhida = TVS.findIndex(t => t.id === ultimo);
if (escolhida >= 0) {
  abas.style.display = "none";
  abrirTV(escolhida);
} else {
  TVS.forEach((tv, i) => {
    const b = botao(rotulo(tv), () => abrirTV(i));
    abas.append(b);
  });
  abrirTV(0);
}
