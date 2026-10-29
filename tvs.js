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
  ,
  {
    id: "kv1310",
    nome: "Sony Trinitron KV-1310",
    ano: 1968,
    imagem: IMG.kv1310,
    largura: 640,
    tela: { x: 13.6, y: 17.2, w: 55, h: 58.5, formato: "arredondado" },
    texto: `
      <h2>Sony Trinitron KV-1310 (1968)</h2>
      <ul>
        <li><b>15/4/1968:</b> a Sony apresenta o Trinitron, modelo KV-1310. Venda em pequena quantidade a partir de outubro de 1968.
          <a href="https://spectrum.ieee.org/the-consumer-electronics-hall-of-fame-sony-trinitron">IEEE Spectrum</a> ·
          <a href="https://avpreservation.si.edu/object/nmah_706163">Smithsonian</a></li>
        <li><b>Magnavox Odyssey (1972):</b> o primeiro console doméstico, ligado à TV no canal 3 ou 4. Os 12 jogos que vinham nos EUA, de acordo com o manual original.
          <a href="https://archive.org/details/manual-magnavox-odyssey">Manual no Archive.org</a> ·
          <a href="https://en.wikipedia.org/wiki/Magnavox_Odyssey">Wikipedia</a></li>
        <li><b>26/12/1967:</b> Magical Mystery Tour, dos Beatles, estreia na BBC1; reprise em cores na BBC Two em janeiro de 1968.
          <a href="https://www.beatlesbible.com/1967/12/26/">Beatles Bible</a></li>
        <li><b>16/11/1969:</b> o Creedence Clearwater Revival toca "Fortunate Son" no Ed Sullivan Show (CBS). A data é a que a maioria das fontes cita; uma outra lista dá 19/11 para outras músicas do mesmo programa.
          <a href="https://www.edsullivan.com/press/page/2">Ed Sullivan</a> ·
          <a href="https://www.goldminemag.com/music-history/flashback/see-creedence-clearwater-revival-play-fiery-fortunate-son-on-ed-sullivan-in-1969/">Goldmine</a></li>
      </ul>
      <p>As folhas de plástico são desenhos aproximados. Cartas, dados, fichas e tabuleiros dos jogos não estão incluídos.</p>`,
    canais: [
      { tipo: "odyssey" },
      { tipo: "video", partes: Array.from({ length: 17 }, (_, i) => `video/magical-mystery-tour-parts/magical-mystery-tour-${String(i).padStart(2, "0")}.mp4`) },
      { tipo: "video", src: "video/ccr-fortunate-son.mp4" }
    ],
    // * = hipótese: rótulos lidos na foto, sem fonte para este aparelho.
    botoes: [
      { funcao: "ligar", tipo: "chave", x: 85.4, y: 89.4, w: 5, h: 8, texto: "LIGAR*", rx: 85.4, ry: 84.6 },
      { funcao: "matiz", tipo: "knob", x: 10.1, y: 89.4, tam: 6, texto: "MATIZ*", rx: 10.1, ry: 85 },
      { funcao: "saturacao", tipo: "knob", x: 17.5, y: 89.4, tam: 6, texto: "COR*", rx: 17.5, ry: 85 },
      { funcao: "brilho", tipo: "knob", x: 24.8, y: 89.4, tam: 6, texto: "BRILHO*", rx: 24.8, ry: 85 },
      { funcao: "contraste", tipo: "knob", x: 32.2, y: 89.4, tam: 6, texto: "CONTRASTE*", rx: 32.2, ry: 85 }
    ],
    funcoes: ["canal"]
  }
  ,
  {
    id: "gradiente",
    nome: "Gradiente Next",
    imagem: IMG.gradiente,
    largura: 640,
    tela: { x: 9.1, y: 14.1, w: 53.8, h: 48, formato: "arredondado" },
    texto: `
      <h2>Gradiente Next</h2>
      <ul>
        <li><b>Modelo e ano não confirmados.</b> A foto mostra o nome "Next" no canto e a marca Gradiente. Não achei ficha com o ano de fabricação, e este aparelho não é a TV de tela grande de 1990.</li>
        <li><b>1989 e 1990:</b> a Gradiente compra a filial brasileira da Telefunken em 1989 e lança a primeira TV de tela grande do país em 1990.
          <a href="https://www.tecmundo.com.br/mercado/124706-historia-gradiente-marca-historica-brasil-video.htm">TecMundo</a></li>
        <li><b>5/2/1990:</b> estreia do Rá-Tim-Bum, da TV Cultura. O canal 1 passa o episódio de 6/2/1990.
          <a href="https://en.wikipedia.org/wiki/R%C3%A1-Tim-Bum">Wikipedia</a> ·
          <a href="https://archive.org/details/programa-ra-tim-bum-episodio-raro-06-02-1990">Archive.org</a></li>
        <li><b>18/9/1990:</b> o canal 2 passa um trecho de 1min39 do Jornal Nacional, da Globo, em gravação particular com a marca "Arquivo Marckezini". A data vem do título do arquivo; o Archive.org tem um item com o mesmo título.
          <a href="https://archive.org/details/documentario_20231116_2343">Archive.org</a></li>
        <li><b>Mega Drive no Brasil:</b> a Tectoy lança o console em dezembro de 1990.
          <a href="https://en.wikipedia.org/wiki/Tectoy">Wikipedia</a>. O canal 3 é o Sonic, de um site de terceiros: clique em START GAME dentro da tela. Depois de apertar uma tecla do controle, clique na tela de novo para o teclado voltar ao jogo.</li>
      </ul>
      <p>* Os botões sobre a foto da TV são hipótese: os rótulos pequenos da frente não dá para ler. O controle ao lado é um de reposição da MXT, modelo G-29FM, e não o original deste aparelho; as teclas POWER, CHANNEL e VOLUME funcionam.</p>`,
    canais: [
      { tipo: "video", partes: Array.from({ length: 9 }, (_, i) => `video/ra-tim-bum-parts/ra-tim-bum-${String(i).padStart(2, "0")}.mp4`) },
      { tipo: "video", src: "video/jornal-nacional-1990.mp4" },
      { tipo: "pagina", src: "https://megadrive-emulator.com/game/?game=Sonic_the_Hedgehog.bin", virtual: [640, 480] }
    ],
    // * = hipótese
    botoes: [
      { funcao: "ligar", tipo: "chave", x: 13.9, y: 69.8, w: 4.3, h: 5, texto: "LIGAR*", rx: 13.9, ry: 63.5 },
      { tipo: "tecla", acao: "ligar", x: 80.5, y: 8.8, w: 4.3, h: 5.1 },
      { tipo: "tecla", acao: "canal+", x: 80.7, y: 25.9, w: 3.7, h: 4.8 },
      { tipo: "tecla", acao: "canal-", x: 80.7, y: 32.1, w: 3.7, h: 4.8 },
      { tipo: "tecla", acao: "vol+", x: 93.9, y: 25.9, w: 4.3, h: 4.8 },
      { tipo: "tecla", acao: "vol-", x: 93.9, y: 32.1, w: 4.3, h: 4.8 }
    ],
    rotulos: { canal: { nome: "canal", anterior: "Canal −", proximo: "Canal +" } },
    funcoes: ["canal"]
  }
  ,
  {
    id: "samsung",
    nome: "Samsung UN46B7000",
    ano: 2009,
    imagem: IMG.samsung,
    largura: 960,
    tela: { x: 6.7, y: 7.2, w: 45.5, h: 64.9 },
    texto: `
      <h2>Samsung UN46B7000 (2009)</h2>
      <ul>
        <li><b>Janeiro de 2009:</b> a Samsung anuncia no CES as séries 6000, 7000 e 8000 de TVs LCD com luz de fundo de LED. A série 7000 tem o UN55B7000 e o UN46B7000.
          <a href="https://www.engadget.com/2009-01-07-samsung-stuns-with-6000-7000-and-8000-series-led-lcd-hdtvs.html">Engadget</a></li>
        <li><b>Julho de 2009:</b> o Engadget testa o UN46B7000.
          <a href="https://www.engadget.com/2009-07-23-samsung-un46b7000-led-backlit-lcd-review.html">Engadget</a></li>
      </ul>
      <p>Não confirmei a data em que a TV chegou às lojas, nem que foi a primeira com LED. A foto é de divulgação do modelo.</p>
      <ul>
        <li><b>20/1/2008:</b> estreia de Breaking Bad na AMC, segundo uma única fonte, a confirmar.
          <a href="https://www.serienjunkies.de/news/serienjunkies-stichtag-jahren-breaking-105269.html">Serienjunkies</a>.
          O canal passa uma cena em português, do canal "Breaking Bad em Português" no YouTube: "Jesse Pinkman acha que Gustavo Fring paga mal | Kafkiano".
          <a href="https://www.youtube.com/watch?v=_7xmZljv0NU">YouTube</a></li>
        <li><b>1/10/2006:</b> estreia de Dexter na Showtime; alguns resultados dão 7/10/2006, então a data não é unânime.
          <a href="https://en.wikipedia.org/wiki/Dexter_(episode)">Wikipedia</a>.
          O canal 2 passa uma cena em português, do canal oficial Paramount+ Brasil: "Doakes chega perto de descobrir tudo | Dexter".
          <a href="https://www.youtube.com/watch?v=0-So4_O4lzc">YouTube</a></li>
      </ul>
      <p>O controle ao lado é um genérico da Samsung, e não sei se é o original deste modelo. POWER liga e desliga, CHANNEL troca de canal; o VOLUME não mexe no vídeo do YouTube.</p>
      <p>Desculpa, não consegui colocar direto na TV. Clica no botão.</p>
      <p><a href="https://nfsu2.xyz/" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#e8e8ee;color:#111;padding:10px 18px;border-radius:4px;text-decoration:none;font-weight:600">Abrir o Underground 2 Revived (projeto de fãs)</a></p>`,
    canais: [
      { tipo: "youtube", src: "_7xmZljv0NU" },
      { tipo: "youtube", src: "0-So4_O4lzc" }
    ],
    rotulos: { canal: { nome: "canal", anterior: "Canal −", proximo: "Canal +" } },
    // controle ao lado da TV: um genérico da Samsung, não necessariamente o original deste modelo
    botoes: [
      { tipo: "tecla", acao: "ligar", x: 91.7, y: 9.7, w: 2.6, h: 6.5 },
      { tipo: "tecla", acao: "vol+", x: 83.8, y: 31.5, w: 2.3, h: 5.8 },
      { tipo: "tecla", acao: "vol-", x: 81.3, y: 37.8, w: 2.3, h: 5.8 },
      { tipo: "tecla", acao: "canal+", x: 87.8, y: 41.4, w: 2.3, h: 5.8 },
      { tipo: "tecla", acao: "canal-", x: 85.5, y: 47.7, w: 2.3, h: 5.8 }
    ],
    funcoes: ["ligar", "canal"]
  }
  ,
  {
    id: "lg",
    nome: "LG OLED65CX",
    ano: 2020,
    imagem: IMG.lg,
    largura: 1100,
    tela: { x: 7.9, y: 15.6, w: 57.6, h: 66.8 },
    menu: true,
    texto: `
      <h2>LG OLED65CX (2020)</h2>
      <ul>
        <li><b>Janeiro de 2020:</b> a LG apresenta a série OLED CX no CES, com um tamanho novo de 48".
          <a href="https://www.wepc.com/news/lg-reveal-cxtv">WePC</a></li>
        <li><b>Março de 2020:</b> a LG divulga preços e datas de lançamento da linha OLED de 2020.
          <a href="https://www.engadget.com/2020/03/17/lg-2020-4k-oled-pricing/">Engadget</a></li>
        <li><b>Menu:</b> ao ligar, a TV mostra um menu de atalhos. No controle, as setas esquerda e direita escolhem, o OK abre, e HOME ou o botão de voltar retornam ao menu. CH ▲▼ trocam de canal direto.</li>
        <li><b>Serviços de streaming:</b> Disney+, Paramount+, Crunchyroll e Pluto TV abrem a página deles dentro da tela. Netflix, Prime Video, Max, Apple TV+, Globoplay e o site do YouTube recusam ser abertos assim, então a TV mostra uma <b>simulação</b> da tela inicial, desenhada por mim, só com o nome, a cor e títulos genéricos, e um link para o site oficial. Eu testei isso em um Firefox sem login; as páginas reais mostram o que o site mostra para quem não entrou.</li>
        <li><b>PokeTube, Google e Bing</b> abrem dentro da tela, sem outra aba. Clique na tela para usar o mouse e o teclado nesses sites; as setas do controle só mexem no menu da TV, não dentro deles. O Google entra pelo parâmetro <code>igu=1</code>, que não é documentado e pode parar de funcionar; a busca dele pode pedir uma verificação. A página inicial do Bing recusa ser incorporada, então o atalho abre uma busca já pronta ("pesquisar"), e dali você digita a sua.</li>
      </ul>
      <p>O modelo (OLED65CX, 65") vem do nome do arquivo da foto; não confirmei o tamanho. O controle é o Magic Remote da LG, que não precisa ser o original deste aparelho; POWER, CH ▲▼, as setas, o OK, o HOME e o voltar funcionam, e o VOLUME não mexe no vídeo do YouTube.</p>`,
    canais: [
      // tipo "simulacao": o site recusa abrir dentro de um iframe, então a TV mostra uma tela inicial desenhada, com títulos genéricos
      { nome: "Netflix", tipo: "simulacao", cor: "#e50914", src: "https://www.netflix.com/br/" },
      { nome: "Prime Video", tipo: "simulacao", cor: "#00a8e1", src: "https://www.primevideo.com/" },
      { nome: "Disney+", tipo: "pagina", src: "https://www.disneyplus.com/pt-br", virtual: [1024, 576] },
      { nome: "Max", tipo: "simulacao", cor: "#4d6bff", src: "https://www.max.com/br/pt" },
      { nome: "Globoplay", tipo: "simulacao", cor: "#ff5252", src: "https://globoplay.globo.com/" },
      { nome: "Apple TV+", tipo: "simulacao", cor: "#d0d0d8", src: "https://tv.apple.com/br" },
      { nome: "Paramount+", tipo: "pagina", src: "https://www.paramountplus.com/br/", virtual: [1024, 576] },
      { nome: "YouTube", tipo: "simulacao", cor: "#ff0000", src: "https://www.youtube.com/" },
      { nome: "Crunchyroll", tipo: "pagina", src: "https://www.crunchyroll.com/pt-br", virtual: [1024, 576] },
      { nome: "Pluto TV", tipo: "pagina", src: "https://pluto.tv/br", virtual: [1024, 576] },
      { nome: "PokeTube", tipo: "pagina", src: "https://poketube.fun/", virtual: [1024, 576] },
      { nome: "Google", tipo: "pagina", src: "https://www.google.com/webhp?igu=1", virtual: [1024, 576] },
      { nome: "Bing", tipo: "pagina", src: "https://www.bing.com/search?q=pesquisar", virtual: [1024, 576] }
    ],
    botoes: [
      { tipo: "tecla", acao: "ligar", x: 84.9, y: 12.6, w: 2.4, h: 4.8 },
      { tipo: "tecla", acao: "vol+", x: 84.4, y: 35.6, w: 2.5, h: 5.2 },
      { tipo: "tecla", acao: "vol-", x: 84.4, y: 42.2, w: 2.5, h: 4.4 },
      { tipo: "tecla", acao: "canal+", x: 90.4, y: 35.8, w: 2.4, h: 5.2 },
      { tipo: "tecla", acao: "canal-", x: 90.4, y: 42.2, w: 2.4, h: 4.4 },
      { tipo: "tecla", acao: "home", x: 83.9, y: 46.7, w: 2.7, h: 4.6 },
      { tipo: "tecla", acao: "cima", x: 87.3, y: 50.2, w: 2.9, h: 3.6 },
      { tipo: "tecla", acao: "baixo", x: 87.3, y: 61.6, w: 2.9, h: 3.6 },
      { tipo: "tecla", acao: "esq", x: 84.3, y: 55.8, w: 2.4, h: 5.2 },
      { tipo: "tecla", acao: "dir", x: 90.5, y: 55.8, w: 2.5, h: 5.2 },
      { tipo: "tecla", acao: "ok", x: 87.4, y: 55.8, w: 3.5, h: 7.6 },
      { tipo: "tecla", acao: "voltar", x: 83.9, y: 65.1, w: 2.7, h: 4.6 }
    ],
    funcoes: ["ligar"]
  }
];
