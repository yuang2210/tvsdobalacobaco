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
      <p><b>Controles:</b> os botões estão sobre a foto. Ligar vem da chave visível na foto. Os marcados com * (brilho, foco e sincronismo) são hipótese, sem fonte para este aparelho. Gire arrastando, com a roda do mouse ou com as setas.</p>
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
      <p><b>Os vídeos abaixo são exemplos.</b> Não são transmissões de TV da época. Nenhum efeito de resolução foi aplicado.
        Suásticas e saudações nazistas foram tampadas.</p>
      <ul>
        <li><b>Kater Lampe</b> (1936), filme inteiro. Na TV, em 6/1/1938, passou 21:18–21:51, ou seja, um trecho
          (<a href="https://de.wikipedia.org/wiki/Deutscher_Fernseh_Rundfunk">Wikipedia</a>).
          Arquivo: <a href="https://archive.org/details/kater-lampe-1936">Archive.org</a></li>
        <li><b>Abertura das Olimpíadas de Berlim</b> (1936): vídeo colorizado que você baixou, de origem que não sei. Não é a transmissão de TV de 1936.</li>
      </ul>
      <p><b>Controles:</b> todos os botões sobre a foto são hipótese (*), sem fonte para este aparelho. O aparelho recebia um único canal, então não há botão de canal. Os botões "Vídeo" abaixo trocam o exemplo.</p>`,
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
];
