// Cada TV é um objeto. Para adicionar uma TV, copie um bloco e mude.
//
// imagem:  caminho da foto da TV
// tela:    onde fica a tela dentro da imagem, em % (x, y, largura, altura)
//          formato: "redondo" deixa a tela circular (tubo)
// canais:  o que passa na tela. tipo: "video" | "imagem" | "pagina" | "html"
// funcoes: quais controles essa TV tem. Disponíveis (ver motor.js):
//          "ligar", "canal", "volume", "chuvisco", "tela-cheia"

// "id" é o nome usado no link da página genérica: generica.html?tv=ID
// "imagem" é opcional; sem ela aparece só a tela.

const fundo ="display:grid;place-items:center;height:100%;background:#0b1a0b;";

const TVS = [
  {
    id: "farnsworth",
    nome: "Farnsworth",
    ano: 1927,
    imagem: IMG.tv1,
    tela: { x: 40, y: 20.8, w: 16, h: 18.6, formato: "redondo" },
    texto: `
      <h2>Primeiras imagens de Philo Farnsworth</h2>
      <ul>
        <li><b>7/9/1927:</b> primeira imagem transmitida, uma linha reta, em São Francisco.
          <a href="https://en.wikipedia.org/wiki/Image_dissector">Wikipedia</a> ·
          <a href="https://www.lindahall.org/about/news/scientist-of-the-day/philo-farnsworth/">Linda Hall Library</a></li>
        <li><b>Depois, sem data:</b> triângulo e cifrão.
          <a href="https://www.lindahall.org/about/news/scientist-of-the-day/philo-farnsworth/">Linda Hall Library</a></li>
        <li><b>3/9/1928:</b> demonstração para a imprensa.
          <a href="https://en.wikipedia.org/wiki/Image_dissector">Wikipedia</a></li>
        <li><b>1929:</b> imagem de Elma Farnsworth, de olhos fechados.
          <a href="https://en.wikipedia.org/wiki/Philo_Farnsworth">Wikipedia</a></li>
      </ul>
      <p>Tela: tubo de raios catódicos chamado "image oscillite".
        <a href="https://en.wikipedia.org/wiki/Philo_Farnsworth">Wikipedia</a></p>`,
    canais: [
      // 7/9/1927: uma linha reta (Wikipedia, "Image dissector"; Linda Hall Library)
      { tipo: "html", conteudo: `<div style='${fundo}'><div style='width:80%;height:3px;background:#cfc'></div></div>` },
      // Triângulo e cifrão vieram depois da linha, sem data exata (Linda Hall Library)
      { tipo: "html", conteudo: `<div style='${fundo}'><svg viewBox='0 0 100 100' width='70%'><polygon points='50,15 85,80 15,80' fill='none' stroke='#cfc' stroke-width='4'/></svg></div>` },
      { tipo: "html", conteudo: `<div style='${fundo}color:#cfc;font:bold 90px serif'>$</div>` },
      // 1929: imagem de Elma "Pem" Farnsworth (Wikipedia, "Philo Farnsworth")
      { tipo: "imagem", src: IMG.pem }
    ],
    // Controles sobre a foto. Não era TV com canais: as imagens eram demonstrações em sequência.
    // * = hipótese: controles comuns em receptores de tubo, sem fonte para este aparelho.
    // x, y, rx, ry e tam/w/h são % da imagem; rx/ry é onde fica o rótulo escrito sobre a placa.
    botoes: [
      { funcao: "ligar", tipo: "chave", x: 12.1, y: 84.8, w: 4.5, h: 9, texto: "LIGAR", rx: 12.1, ry: 93 },
      { funcao: "brilho", tipo: "knob", x: 38.75, y: 74.9, tam: 9.4, texto: "BRILHO*", rx: 38.5, ry: 82.1 },
      { funcao: "foco", tipo: "knob", x: 49.4, y: 74.9, tam: 9.4, texto: "FOCO*", rx: 49.6, ry: 82.1 },
      { funcao: "sincronismo", tipo: "knob", x: 60.6, y: 74.9, tam: 9.4, texto: "SINCRON.*", rx: 60.3, ry: 82.1 },
      { funcao: "imagem", tipo: "knob", x: 73.75, y: 61.8, tam: 9.4, texto: "IMAGEM", rx: 74, ry: 55.1 }
    ],
    funcoes: []
  }
  ,
  {
    id: "teste",
    nome: "Teste",
    // sem "imagem": aparece só a tela
    tela: { x: 0, y: 0, w: 100, h: 100 },
    canais: [
      { tipo: "html", conteudo: "<div style='display:grid;place-items:center;height:100%;background:#235;color:#fff;font:bold 40px sans-serif'>Canal 1</div>" },
      { tipo: "html", conteudo: "<div style='display:grid;place-items:center;height:100%;background:#522;color:#fff;font:bold 40px sans-serif'>Canal 2</div>" },
      { tipo: "pagina", src: "https://classic.minecraft.net/" },
      { tipo: "pagina", src: "https://poketube.fun/home" }
    ],
    funcoes: ["ligar", "canal", "volume", "chuvisco", "tela-cheia"]
  }
  ,
  {
    id: "telefunken",
    nome: "Telefunken E1",
    ano: 1939,
    imagem: IMG.e1,
    tela: { x: 55.5, y: 17.5, w: 33, h: 52, formato: "arredondado" },
    texto: `
      <h2>Telefunken E1 (1939)</h2>
      <p>Receptor "Einheits-Fernseh-Empfänger E1", 441 linhas, 25 quadros entrelaçados.
        <a href="https://en.wikipedia.org/wiki/441-line_television_system">Wikipedia</a></p>
      <ul>
        <li><b>Kater Lampe</b> (1936). Na TV, em 6/1/1938, das 21:18 às 21:51
          (<a href="https://de.wikipedia.org/wiki/Deutscher_Fernseh_Rundfunk">Wikipedia</a>).
          Arquivo: <a href="https://archive.org/details/kater-lampe-1936">Archive.org</a></li>
        <li><b>Abertura das Olimpíadas de Berlim</b> (1936).</li>
      </ul>`,
    canais: [
      { tipo: "video", partes: ["video/kater-lampe-parts/kater-lampe-00.mp4", "video/kater-lampe-parts/kater-lampe-01.mp4", "video/kater-lampe-parts/kater-lampe-02.mp4", "video/kater-lampe-parts/kater-lampe-03.mp4", "video/kater-lampe-parts/kater-lampe-04.mp4", "video/kater-lampe-parts/kater-lampe-05.mp4", "video/kater-lampe-parts/kater-lampe-06.mp4", "video/kater-lampe-parts/kater-lampe-07.mp4", "video/kater-lampe-parts/kater-lampe-08.mp4", "video/kater-lampe-parts/kater-lampe-09.mp4", "video/kater-lampe-parts/kater-lampe-10.mp4", "video/kater-lampe-parts/kater-lampe-11.mp4", "video/kater-lampe-parts/kater-lampe-12.mp4", "video/kater-lampe-parts/kater-lampe-13.mp4", "video/kater-lampe-parts/kater-lampe-14.mp4", "video/kater-lampe-parts/kater-lampe-15.mp4", "video/kater-lampe-parts/kater-lampe-16.mp4", "video/kater-lampe-parts/kater-lampe-17.mp4", "video/kater-lampe-parts/kater-lampe-18.mp4", "video/kater-lampe-parts/kater-lampe-19.mp4", "video/kater-lampe-parts/kater-lampe-20.mp4", "video/kater-lampe-parts/kater-lampe-21.mp4", "video/kater-lampe-parts/kater-lampe-22.mp4", "video/kater-lampe-parts/kater-lampe-23.mp4", "video/kater-lampe-parts/kater-lampe-24.mp4"] },
      { tipo: "video", partes: ["video/olimpiada-parts/olimpiada-00.mp4", "video/olimpiada-parts/olimpiada-01.mp4", "video/olimpiada-parts/olimpiada-02.mp4"] }
    ],
    // * = hipótese. Posições em % da imagem recortada.
    botoes: [
      { funcao: "ligar", tipo: "chave", x: 50, y: 85.5, w: 3.2, h: 6, texto: "LIGAR*", rx: 50, ry: 95 },
      { funcao: "volume", tipo: "knob", x: 19.8, y: 86.1, tam: 6.4, texto: "VOLUME*", rx: 19.8, ry: 95 },
      { funcao: "brilho", tipo: "knob", x: 37.3, y: 86.1, tam: 6.4, texto: "BRILHO*", rx: 37.3, ry: 95 },
      { funcao: "contraste", tipo: "knob", x: 63.1, y: 86.1, tam: 6.4, texto: "CONTRASTE*", rx: 63.1, ry: 95 },
      { funcao: "foco", tipo: "knob", x: 80.5, y: 86.1, tam: 6.4, texto: "FOCO*", rx: 80.5, ry: 95 }
    ],
    rotulos: { canal: { nome: "vídeo", anterior: "Vídeo anterior", proximo: "Próximo vídeo" } },
    funcoes: ["canal"]
  }
  ,
  {
    id: "ct100",
    nome: "RCA CT-100",
    ano: 1954,
    imagem: IMG.ct100,
    largura: 520,
    tela: { x: 35.2, y: 25.5, w: 33.5, h: 23.5, formato: "oval" },
    texto: `
      <h2>RCA CT-100 (1954)</h2>
      <ul>
        <li><b>Abril de 1954:</b> lançamento por US$ 1.000, a primeira TV colorida produzida em massa. Tubo 15GP22, de 15 polegadas, e 36 válvulas.
          <a href="https://en.wikipedia.org/wiki/RCA_CT-100">Wikipedia</a></li>
        <li><b>1/1/1954:</b> Desfile das Rosas, a primeira transmissão colorida nacional, da NBC.
          <a href="https://en.wikipedia.org/wiki/1954_in_American_television">Wikipedia</a></li>
        <li><b>Producers' Showcase</b> (NBC, a partir de 18/10/1954, em cores compatíveis): <i>The Petrified Forest</i> e <i>Our Town</i>, ambos de 1955. As cópias existentes são em preto e branco, e as cores aqui foram inventadas por IA.
          <a href="https://archive.org/details/proase-s2-e-01-thkin-our-telen-hy-ma55">Archive.org</a></li>
        <li><b>Controles:</b> na frente, canal e sintonia fina à direita, brilho e liga/volume à esquerda. Saturação, contraste e matiz, foco e convergência ficam atrás da tampa e na lateral.
          <a href="https://antiqueradio.org/RCACT-100Television.htm">antiqueradio.org</a></li>
      </ul>`,
    canais: [
      { tipo: "video", partes: ["video/our-town-cor/our-town-cor-00.mp4", "video/our-town-cor/our-town-cor-01.mp4", "video/our-town-cor/our-town-cor-02.mp4", "video/our-town-cor/our-town-cor-03.mp4", "video/our-town-cor/our-town-cor-04.mp4", "video/our-town-cor/our-town-cor-05.mp4", "video/our-town-cor/our-town-cor-06.mp4", "video/our-town-cor/our-town-cor-07.mp4", "video/our-town-cor/our-town-cor-08.mp4", "video/our-town-cor/our-town-cor-09.mp4", "video/our-town-cor/our-town-cor-10.mp4", "video/our-town-cor/our-town-cor-11.mp4", "video/our-town-cor/our-town-cor-12.mp4", "video/our-town-cor/our-town-cor-13.mp4", "video/our-town-cor/our-town-cor-14.mp4", "video/our-town-cor/our-town-cor-15.mp4", "video/our-town-cor/our-town-cor-16.mp4", "video/our-town-cor/our-town-cor-17.mp4", "video/our-town-cor/our-town-cor-18.mp4", "video/our-town-cor/our-town-cor-19.mp4", "video/our-town-cor/our-town-cor-20.mp4", "video/our-town-cor/our-town-cor-21.mp4", "video/our-town-cor/our-town-cor-22.mp4"] },
      { tipo: "video", partes: ["video/petrified-forest-cor/petrified-forest-cor-00.mp4", "video/petrified-forest-cor/petrified-forest-cor-01.mp4", "video/petrified-forest-cor/petrified-forest-cor-02.mp4", "video/petrified-forest-cor/petrified-forest-cor-03.mp4", "video/petrified-forest-cor/petrified-forest-cor-04.mp4", "video/petrified-forest-cor/petrified-forest-cor-05.mp4", "video/petrified-forest-cor/petrified-forest-cor-06.mp4", "video/petrified-forest-cor/petrified-forest-cor-07.mp4", "video/petrified-forest-cor/petrified-forest-cor-08.mp4", "video/petrified-forest-cor/petrified-forest-cor-09.mp4", "video/petrified-forest-cor/petrified-forest-cor-10.mp4", "video/petrified-forest-cor/petrified-forest-cor-11.mp4", "video/petrified-forest-cor/petrified-forest-cor-12.mp4", "video/petrified-forest-cor/petrified-forest-cor-13.mp4", "video/petrified-forest-cor/petrified-forest-cor-14.mp4", "video/petrified-forest-cor/petrified-forest-cor-15.mp4", "video/petrified-forest-cor/petrified-forest-cor-16.mp4", "video/petrified-forest-cor/petrified-forest-cor-17.mp4", "video/petrified-forest-cor/petrified-forest-cor-18.mp4", "video/petrified-forest-cor/petrified-forest-cor-19.mp4", "video/petrified-forest-cor/petrified-forest-cor-20.mp4", "video/petrified-forest-cor/petrified-forest-cor-21.mp4", "video/petrified-forest-cor/petrified-forest-cor-22.mp4"] }
    ],
    botoes: [
      { funcao: "volume", liga: true, tipo: "knob", x: 29.7, y: 62.9, tam: 6.2, texto: "LIGA / VOLUME", rx: 29.7, ry: 70.5 },
      { funcao: "canal", tipo: "knob", x: 73.5, y: 63.8, tam: 8.2, texto: "CANAL", rx: 73.5, ry: 72 }
    ],
    funcoes: ["brilho", "contraste", "saturacao", "matiz", "foco"]
  }
];
