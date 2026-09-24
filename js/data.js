/* Conteúdo do site Bow. Textos marcados como provisórios no design
   (Cliente 03–06, textos dos cases, fotos de banco) ficam aqui para troca fácil. */

const WA_NUMBER = "5551989373400";
const wa = (msg) => "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);

const CONTACT = {
  phone: "+55 51 98937-3400",
  email: "bowagencydesign@gmail.com",
  instagram: "@agencia.bow",
  instagramUrl: "https://instagram.com/agencia.bow",
  linkedinUrl: "https://www.linkedin.com/",
  waHref: wa("Olá! Vim pelo site da Bow e quero falar sobre um projeto."),
  waOrcamento: wa("Olá! Quero um orçamento com a Bow."),
  waTech: wa("Olá! Quero criar uma solução em SaaS/tecnologia com a Bow."),
};

/* Imagens: um número é uma foto de banco (Pexels, provisória); um texto é um
   caminho de imagem enviada pelo painel (ex.: "uploads/abc.jpg"). */
const px = (ref, w) => typeof ref === "string" ? ref : "https://images.pexels.com/videos/" + ref + "/pexels-photo-" + ref + ".jpeg?auto=compress&cs=tinysrgb&w=" + (w || 1800);

/* Cases padrão. Depois que o painel salva, a lista vem de api/content.php. */
let CASES = [
  { slug: "attualize", name: "Attualize", segment: "Esquadrias de alumínio", services: "Posicionamento, Social Media", year: "2025", imgs: [6615058, 6803583, 5717294, 33170797],
    card: "Posicionamento e presença que fortalecem a marca",
    lead: "Posicionamento e presença que fortalecem a marca.",
    challengeH: "Uma marca forte no mercado, pouco percebida no digital.", challenge: "A Attualize tinha qualidade e reputação, mas a comunicação online não refletia o nível do trabalho entregue nas obras.",
    solutionH: "Uma linguagem visual à altura do produto.", solution: "Redefinimos o posicionamento, criamos uma direção visual consistente e estruturamos um calendário de conteúdo focado em projetos reais.",
    resultH: "Uma presença que representa a empresa.", deliver: ["Posicionamento de marca", "Direção visual para redes", "Planejamento e produção de conteúdo", "Gestão de Social Media"] },
  { slug: "ioa-blumenau", name: "IOA Blumenau", segment: "Saúde", services: "Estratégia, Campanhas", year: "2025", imgs: [6803583, 6615514, 5647320, 6615058],
    card: "Campanhas e conteúdo que aproximam pacientes",
    lead: "Estratégia e campanhas para aproximar a clínica de novos pacientes.",
    challengeH: "Muita informação técnica, pouca conexão.", challenge: "A comunicação era correta, mas distante. Faltava traduzir a especialidade da clínica em algo próximo do paciente.",
    solutionH: "Conteúdo que educa e aproxima.", solution: "Criamos uma estratégia de conteúdo educativo e campanhas segmentadas, com uma identidade de comunicação mais humana.",
    resultH: "Uma comunicação mais próxima de quem importa.", deliver: ["Estratégia de comunicação", "Campanhas de mídia paga", "Conteúdo educativo", "Gestão de Social Media"] },
  { slug: "cliente-03", name: "Cliente 03", segment: "Varejo", services: "Identidade Visual", year: "2025", imgs: [5717294, 33170797, 6615058, 5647320],
    card: "Uma identidade visual com personalidade própria",
    lead: "Uma identidade visual construída para ser reconhecida.",
    challengeH: "Uma marca sem unidade.", challenge: "Cada ponto de contato comunicava de um jeito diferente, e a marca não era lembrada.",
    solutionH: "Um sistema visual completo.", solution: "Desenvolvemos logo, paleta, tipografia e aplicações, criando um sistema coerente do digital ao físico.",
    resultH: "Uma marca coerente em cada ponto de contato.", deliver: ["Estratégia de marca", "Logo e identidade visual", "Manual de marca", "Aplicações"] },
  { slug: "cliente-04", name: "Cliente 04", segment: "Serviços", services: "Site, UX/UI", year: "2025", imgs: [33170797, 5647320, 6803583, 6615514],
    card: "Um site pensado para converter visitas",
    lead: "Um site que apresenta, convence e gera oportunidades.",
    challengeH: "Um site que não acompanhava a empresa.", challenge: "O site antigo era lento, difícil de navegar e não gerava contatos.",
    solutionH: "Experiência pensada para conversão.", solution: "Redesenhamos a arquitetura, a interface e o conteúdo, com foco em clareza e velocidade.",
    resultH: "Um site à altura do negócio.", deliver: ["Arquitetura de informação", "UX/UI design", "Desenvolvimento", "Otimização de performance"] },
  { slug: "cliente-05", name: "Cliente 05", segment: "Indústria", services: "Sistema sob medida", year: "2026", imgs: [5647320, 6615514, 33170797, 5717294],
    card: "Sistema sob medida para a operação",
    lead: "Um sistema sob medida para organizar a operação.",
    challengeH: "Processos espalhados em planilhas.", challenge: "Pedidos, produção e entregas eram controlados manualmente, com retrabalho e pouca visibilidade.",
    solutionH: "Tudo em um só lugar.", solution: "Criamos um sistema que acompanha o pedido do início à entrega, com dashboards e automações.",
    resultH: "Uma operação mais simples de acompanhar.", deliver: ["Mapeamento de processos", "Sistema web sob medida", "Dashboards", "Automações"] },
  { slug: "cliente-06", name: "Cliente 06", segment: "Educação", services: "Marketing, Tráfego", year: "2026", imgs: [6615514, 5717294, 6615058, 6803583],
    card: "Social media que constrói comunidade",
    lead: "Marketing e tráfego para colocar a marca em movimento.",
    challengeH: "Investimento em anúncios sem direção.", challenge: "As campanhas rodavam sem estratégia clara e sem acompanhamento de resultado.",
    solutionH: "Canais conectados a um objetivo.", solution: "Estruturamos funil, campanhas e acompanhamento contínuo, conectando conteúdo e mídia paga.",
    resultH: "Campanhas com direção e acompanhamento.", deliver: ["Planejamento de marketing", "Gestão de tráfego pago", "Criativos para campanhas", "Relatórios mensais"] },
];

/* Degradês do hover dos cards de case (um por card). */
const WORK_GRADS = [
  "radial-gradient(110% 90% at 20% 80%,#06e006 0%,transparent 55%),radial-gradient(90% 80% at 85% 10%,#b8ff5c 0%,transparent 55%),linear-gradient(160deg,#0f7a1a,#043d0a)",
  "radial-gradient(110% 90% at 80% 85%,#3cf13c 0%,transparent 55%),radial-gradient(80% 70% at 20% 15%,#021a04 0%,transparent 60%),linear-gradient(150deg,#0a5c12,#06a806)",
  "radial-gradient(100% 90% at 50% 100%,#06e006 0%,transparent 60%),radial-gradient(90% 70% at 90% 0%,#0b2e0b 0%,transparent 60%),linear-gradient(170deg,#031a03,#0b8a14)",
  "radial-gradient(110% 90% at 10% 20%,#9dff6a 0%,transparent 50%),radial-gradient(100% 90% at 90% 90%,#034d0a 0%,transparent 60%),linear-gradient(140deg,#06c406,#0a3d0a)",
  "radial-gradient(120% 100% at 85% 80%,#06e006 0%,transparent 55%),radial-gradient(80% 70% at 15% 10%,#0c3b3b 0%,transparent 60%),linear-gradient(160deg,#021a0f,#0b7a2a)",
  "radial-gradient(110% 90% at 30% 90%,#3cf13c 0%,transparent 55%),radial-gradient(90% 80% at 80% 15%,#063d06 0%,transparent 60%),linear-gradient(150deg,#0b8a14,#021a04)",
];

const SVC_PAGES = [
  { slug: "social-media", title: "Social Media", headline: "Conteúdo que constrói presença.", intro: "Planejamos, criamos e gerenciamos conteúdos que transformam suas redes sociais em uma extensão real da sua marca.",
    listDesc: "Planejamos, criamos e gerenciamos conteúdos que transformam suas redes sociais em uma extensão real da sua marca.",
    tags: ["Planejamento", "Conteúdo", "Design", "Reels", "Gestão"], img: 6615514, img2: 6803583,
    deliverIntro: "Tudo o que sua marca precisa para aparecer com consistência, do planejamento à análise.",
    items: [["Planejamento editorial", "Linha editorial, pilares de conteúdo e calendário mensal alinhados ao seu objetivo."], ["Conteúdo e design", "Posts, carrosséis e stories com a identidade da sua marca."], ["Reels e vídeos curtos", "Roteiros e edição pensados para alcance e retenção."], ["Gestão e publicação", "Agendamento, publicação e acompanhamento das redes."], ["Relatórios", "Leitura dos resultados e ajustes para o mês seguinte."]],
    steps: [["Diagnóstico", "Entendemos seu público, suas redes e seus concorrentes."], ["Linha editorial", "Definimos pilares, tom de voz e cadência."], ["Produção", "Criamos, revisamos e aprovamos com você."], ["Publicação e análise", "Publicamos, medimos e ajustamos a rota."]],
    statement: "Presença não é postar todo dia. É ser lembrado." },
  { slug: "identidade-visual", title: "Identidade Visual", headline: "Marcas com presença antes mesmo de falar.", intro: "Criamos identidades visuais que traduzem posicionamento, personalidade e valor em cada ponto de contato.",
    listDesc: "Criamos identidades visuais que traduzem posicionamento, personalidade e valor em cada ponto de contato.",
    tags: ["Estratégia", "Logo", "Identidade", "Direção visual", "Aplicações"], img: 5717294, img2: 27980029,
    deliverIntro: "Um sistema visual completo, pronto para ser usado com coerência em qualquer canal.",
    items: [["Estratégia de marca", "Posicionamento, personalidade e atributos que guiam o design."], ["Logo e símbolo", "Uma assinatura única, pensada para funcionar em qualquer tamanho."], ["Cores e tipografia", "Paleta e famílias tipográficas que dão consistência à marca."], ["Manual de marca", "Regras claras de uso para o seu time e seus parceiros."], ["Aplicações", "Papelaria, redes sociais, embalagens e peças do dia a dia."]],
    steps: [["Imersão", "Conhecemos sua história, seu mercado e seu público."], ["Conceito", "Definimos a ideia central que a marca vai comunicar."], ["Design", "Desenvolvemos e refinamos o sistema visual."], ["Entrega", "Manual e arquivos prontos para uso."]],
    statement: "Estética chama atenção. Estratégia dá sentido." },
  { slug: "sites", title: "Sites", headline: "Experiências digitais que geram oportunidades.", intro: "Criamos sites que combinam estratégia, design e tecnologia para apresentar sua empresa, fortalecer sua marca e transformar visitas em oportunidades.",
    listDesc: "Criamos sites que combinam estratégia, design e tecnologia para transformar visitas em oportunidades.",
    tags: ["UX/UI", "Design", "Desenvolvimento", "Landing pages", "Performance"], img: 33170797, img2: 6615514,
    deliverIntro: "Do planejamento da navegação ao site no ar, rápido e fácil de atualizar.",
    items: [["UX e arquitetura", "Estrutura de páginas e jornada pensadas para converter."], ["UI design", "Interfaces com a cara da sua marca, em todas as telas."], ["Desenvolvimento", "Sites rápidos, responsivos e fáceis de gerenciar."], ["Landing pages", "Páginas focadas em campanhas e captação."], ["Performance", "Velocidade, SEO técnico e métricas configuradas."]],
    steps: [["Briefing", "Objetivos, público e conteúdo do site."], ["Wireframe", "Estrutura e hierarquia de cada página."], ["Design", "Layout final com a identidade da marca."], ["Desenvolvimento", "Programação, testes e lançamento."]],
    statement: "Seu site é a primeira impressão. Faça valer." },
  { slug: "saas-tecnologia", title: "SaaS & Tecnologia", headline: "Ideias que viram produtos.", intro: "Transformamos processos, problemas e oportunidades em ferramentas digitais feitas para simplificar operações e criar novas possibilidades.",
    listDesc: "Transformamos processos, problemas e oportunidades em ferramentas digitais feitas sob medida.",
    tags: ["SaaS", "Sistemas", "Dashboards", "Automações", "Integrações"], img: 5647320, img2: 33170797,
    deliverIntro: "Tecnologia sob medida para a sua operação, do conceito ao produto funcionando.",
    items: [["SaaS", "Produtos digitais prontos para escalar e gerar receita recorrente."], ["Sistemas sob medida", "Ferramentas internas feitas para o jeito que sua empresa trabalha."], ["Dashboards", "Indicadores do negócio reunidos em um só painel."], ["Automações", "Tarefas repetitivas rodando sozinhas, sem retrabalho."], ["Integrações", "CRM, planilhas, pagamentos e canais conversando entre si."]],
    steps: [["Descoberta", "Mapeamos o processo e o problema a resolver."], ["Protótipo", "Validamos a solução antes de desenvolver."], ["Desenvolvimento", "Construímos em etapas, com entregas frequentes."], ["Evolução", "Acompanhamos o uso e melhoramos continuamente."]],
    statement: "Do conceito à interface. Da ideia ao funcionamento." },
  { slug: "marketing", title: "Marketing", headline: "Estratégia para colocar sua marca em movimento.", intro: "Conectamos diferentes canais, ideias e ações para construir presença, gerar demanda e aproximar sua marca das pessoas certas.",
    listDesc: "Conectamos canais, ideias e ações para construir presença, gerar demanda e aproximar sua marca das pessoas certas.",
    tags: ["Estratégia", "Campanhas", "Tráfego", "Conteúdo", "Performance"], img: 6615058, img2: 5647320,
    deliverIntro: "Canais e ações conectados ao mesmo objetivo de crescimento.",
    items: [["Planejamento", "Metas, público e canais definidos a partir do seu objetivo."], ["Campanhas", "Conceito criativo e peças para cada etapa da jornada."], ["Tráfego pago", "Meta Ads e Google Ads com otimização contínua."], ["Conteúdo", "Materiais que educam, atraem e convertem."], ["Performance", "Acompanhamento de indicadores e relatórios claros."]],
    steps: [["Diagnóstico", "Entendemos onde sua marca está e onde pode chegar."], ["Plano", "Definimos canais, verba e cronograma."], ["Execução", "Colocamos as campanhas no ar."], ["Otimização", "Medimos, aprendemos e ajustamos."]],
    statement: "Menos achismo. Mais intenção." },
];

/* Carrossel "O que fazemos" e menu Soluções. */
const SERVICES = [
  { title: "Social Media", desc: "Conteúdo que constrói presença. Planejamento, design, Reels e gestão." },
  { title: "Identidade Visual", desc: "Marcas com presença antes mesmo de falar. Estratégia, logo e aplicações." },
  { title: "Sites", desc: "Experiências digitais que apresentam sua empresa e geram oportunidades." },
  { title: "SaaS & Tecnologia", desc: "Ideias que viram produtos: sistemas, dashboards e automações." },
  { title: "Marketing", desc: "Estratégia para colocar sua marca em movimento: campanhas e performance." },
];
const MENU_ICONS = ["◈", "◇", "▣", "◎", "✦"];
const SVC_ICONS = [
  "M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z",
  "M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z",
  "M3 5h18v14H3zM3 9h18M7 7h.01",
  "M4 17l6-6 4 4 6-8M14 7h6v6",
  "M3 11v2l13 5V6L3 11zM16 9a3 3 0 0 1 0 6",
];
const SVC_GRADS = [
  "radial-gradient(120% 90% at 15% 85%,#06e006 0%,transparent 55%),radial-gradient(90% 80% at 85% 10%,#b8ff5c 0%,transparent 55%),linear-gradient(160deg,#0f7a1a,#043d0a)",
  "radial-gradient(110% 90% at 80% 85%,#3cf13c 0%,transparent 55%),radial-gradient(80% 70% at 20% 15%,#021a04 0%,transparent 60%),linear-gradient(150deg,#0a5c12,#06a806)",
  "radial-gradient(100% 90% at 50% 100%,#06e006 0%,transparent 60%),radial-gradient(90% 70% at 90% 0%,#0b2e0b 0%,transparent 60%),linear-gradient(170deg,#031a03,#0b8a14)",
  "radial-gradient(110% 90% at 10% 20%,#9dff6a 0%,transparent 50%),radial-gradient(100% 90% at 90% 90%,#034d0a 0%,transparent 60%),linear-gradient(140deg,#06c406,#0a3d0a)",
  "radial-gradient(120% 100% at 85% 80%,#06e006 0%,transparent 55%),radial-gradient(80% 70% at 15% 10%,#0c3b3b 0%,transparent 60%),linear-gradient(160deg,#021a0f,#0b7a2a)",
];

const METHOD = [
  ["001", "Entender", "Conhecemos sua empresa, seu mercado, seu público, seus desafios e seus objetivos. Uma boa solução começa fazendo as perguntas certas."],
  ["002", "Estrategizar", "Definimos posicionamento, linguagem, prioridades e caminhos para transformar objetivos em ações. Menos achismo, mais intenção."],
  ["003", "Criar", "Transformamos estratégia em algo que pode ser visto, usado e lembrado: marcas, conteúdos, sites, campanhas e produtos digitais."],
  ["004", "Colocar no ar", "Ideia parada não gera impacto. Conteúdo publicado, site no ar, campanha rodando, produto funcionando."],
  ["005", "Evoluir", "O projeto não termina quando vai para o ar. Analisamos, aprendemos e ajustamos, porque marcas crescem e o digital nunca fica parado."],
];

const HOME_CLIENTS = ["CLIENTE 01", "CLIENTE 02", "CLIENTE 03", "CLIENTE 04", "CLIENTE 05", "CLIENTE 06"];

const PRINCIPLES = [
  ["01", "Resultado", "Criatividade precisa gerar impacto.", 5647320],
  ["02", "Design", "Tudo comunica.", 5717294],
  ["03", "Estratégia", "Não criamos por criar.", 6615514],
  ["04", "Tecnologia", "Usamos tecnologia para ampliar ideias.", 33170797],
  ["05", "Parceria", "Trabalhamos junto com nossos clientes.", 6803583],
];

/* Galeria "Nosso universo": [foto, legenda, velocidade parallax, clip-reveal, estilo de posição, proporção] */
const UNIVERSE = [
  [6615058, "Branding", 0.14, true, "left:4%;top:5%;width:clamp(150px,22vw,360px)", "4/5"],
  [33170797, "Campanhas", 0.3, false, "right:6%;top:3%;width:clamp(120px,15vw,250px)", "1/1"],
  [5647320, "Tecnologia", 0.08, false, "left:30%;top:36%;width:clamp(110px,13vw,210px)", "3/4"],
  [6615514, "Websites", 0.1, true, "right:3%;top:34%;width:clamp(170px,26vw,420px)", "16/11"],
  [27980029, "Bastidores", 0.24, false, "left:7%;top:62%;width:clamp(130px,18vw,290px)", "1/1"],
  [6803583, "Design", 0.16, true, "right:22%;top:70%;width:clamp(140px,19vw,310px)", "4/5"],
  [5717294, "Social", 0.34, false, "left:46%;top:86%;width:clamp(100px,11vw,190px)", "3/4"],
];

/* ---------- Imagens e vídeos editáveis pelo painel ---------- */
/* [chave, grupo, nome, padrão, tipo]. Vídeo é opcional: quando existe, toca no
   lugar da foto do topo, e a foto vira a imagem de espera enquanto ele carrega. */
const VIDEO_LABEL = "Vídeo do topo (opcional)";
const IMAGE_SLOTS = [
  ["home.hero", "Home", "Fundo do topo", 6615058, "image"],
  ["home.heroVideo", "Home", VIDEO_LABEL, null, "video"],
  ["cases.heroVideo", "Página Cases", VIDEO_LABEL, null, "video"],
  ...SVC_PAGES.flatMap((s) => [
    ["sol." + s.slug + ".hero", "Solução: " + s.title, "Fundo do topo", s.img, "image"],
    ["sol." + s.slug + ".heroVideo", "Solução: " + s.title, VIDEO_LABEL, null, "video"],
    ["sol." + s.slug + ".statement", "Solução: " + s.title, "Foto da frase de impacto", s.img2, "image"],
  ]),
  ["sobre.hero", "Sobre", "Foto do topo", 6803583, "image"],
  ["sobre.heroVideo", "Sobre", "Vídeo no lugar da foto do topo (opcional)", null, "video"],
  ["sobre.who", "Sobre", "Quem é a Bow (grande)", 6615058, "image"],
  ["sobre.whoSmall", "Sobre", "Quem é a Bow (pequena)", 5717294, "image"],
  ...UNIVERSE.map(([id, label], i) => ["sobre.uni." + i, "Sobre: Nosso universo", label, id, "image"]),
  ...PRINCIPLES.map(([, t, , id], i) => ["sobre.prin." + i, "Sobre: No que acreditamos", t, id, "image"]),
];
const SLOT_DEFAULTS = Object.fromEntries(IMAGE_SLOTS.map(([k, , , d]) => [k, d]));
let IMAGES = {};
const slot = (key) => (IMAGES[key] != null ? IMAGES[key] : SLOT_DEFAULTS[key]);

/* Aplica o conteúdo salvo pelo painel (api/content.php) por cima dos padrões. */
function applyContent(c) {
  if (!c || typeof c !== "object") return;
  if (Array.isArray(c.cases) && c.cases.length) CASES = c.cases;
  if (c.images && typeof c.images === "object" && !Array.isArray(c.images)) IMAGES = c.images;
}
