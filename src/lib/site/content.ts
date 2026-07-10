export type SiteNavItem = {
  href: string
  label: string
}

export type IconItem = {
  description?: string
  icon: string
  title: string
}

export type PracticeArea = {
  featureImage?: string
  heroImage: string
  icon: string
  intro: string[]
  services: IconItem[]
  shortTitle: string
  slug: string
  subtitle: string
  title: string
  workIntro: string
}

export type TeamMember = {
  image: string
  name: string
  profile?: {
    paragraphs: string[]
    subtitle: string
    title: string
  }
  role: string
}

export function asset(fileName: string) {
  return `/jales-assets/${fileName}`
}

export const siteConfig = {
  name: "Jales & Jales",
  legalName: "Jales & Jales Advogados Associados",
  phone: "61 3879-7990",
  whatsappHref: "https://wa.me/556138797990",
  address:
    "Rua Copaíba – Lote 01 – Sala 819 e 820 Centro Empresarial DF Century Plaza Águas Claras, Brasília – DF",
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/wilkerjales/",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/jalesadvogados",
    },
    {
      label: "Linkedin",
      href: "https://www.linkedin.com/company/jales-jales-advogados",
    },
  ],
}

export const mainNav: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/o-jales-e-jales-advogados", label: "Quem Somos" },
  { href: "/nossa-equipe", label: "Nossa Equipe" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/contato", label: "Contato" },
]

export const homeContent = {
  heroImage: asset("hero-home.jpg"),
  heroTitle: "Soluções jurídicas que caminham com você e resolvem por você",
  aboutTitle: "Jales Advogados",
  about: [
    "O Jales Advogados é um escritório jurídico moderno, fundado com o propósito de oferecer soluções jurídicas eficientes, éticas e personalizadas.",
    "Contamos com uma estrutura sólida e uma equipe jurídica altamente qualificada, constantemente atualizada e comprometida em aplicar conhecimento técnico aliado a soluções inteligentes.",
    "Nosso trabalho é pautado por ética, eficiência e clareza na comunicação, sempre com foco na prevenção de litígios e no fortalecimento da segurança jurídica dos nossos clientes.",
  ],
  values: [
    "Integridade",
    "Ética",
    "Eficácia",
    "Comprometimento",
    "Transparência",
    "Inovação",
    "Aperfeiçoamento constante",
  ],
  mission:
    "Superar as expectativas dos nossos clientes com soluções jurídicas responsáveis e inovadoras, sempre com foco na preservação de seus direitos e na realização profissional de toda a equipe Jales Advogados.",
  vision:
    "Ser reconhecido como centro de excelência pela qualidade técnica e inovação nas soluções jurídicas oferecidas, garantindo a satisfação do cliente e a sustentabilidade do seu negócio ou patrimônio.",
  helpImage: asset("img-como-podemos-ajudar.jpg"),
  helpText: [
    "Nosso escritório oferece assessoria jurídica completa — tanto preventiva quanto contenciosa — com atuação especializada em todas as instâncias. Participamos ativamente das decisões estratégicas dos nossos clientes, com foco na prevenção de litígios e proteção patrimonial, especialmente para empresas, síndicos, condomínios e gestores públicos ou privados.",
    "Nosso compromisso é garantir segurança jurídica, reduzir riscos e custos, evitar conflitos desnecessários e, quando inevitáveis, aumentar as chances de êxito em qualquer tipo de disputa.",
  ],
  bookCutout: asset("livro-sou-sindico-e-agora-wilker-jales-recorte.png"),
  bookImage: asset("livro-sou-sindico-e-agora-wilker-jales.jpg"),
  ebookHref:
    "https://www.amazon.com.br/Sou-S%C3%ADndico-agora-diminuir-responsabilidade-ebook/dp/B0DJ3GBM9G/",
  physicalBookHref:
    "https://www.mercadolivre.com.br/sou-sindico-e-agora/up/MLBU2339631757",
}

export const areaCards: IconItem[] = [
  {
    icon: asset("icon-direito-condominial-1.svg"),
    title: "Direito Condominial",
  },
  {
    icon: asset("icon-direito-imobiliario-1.svg"),
    title: "Direito Imobiliário",
  },
  {
    icon: asset("icon-recuperacao-de-credito-1.svg"),
    title: "Recuperação de Crédito",
  },
  {
    icon: asset("icon-direito-trabalhista-1.svg"),
    title: "Direito Trabalhista",
  },
  {
    icon: asset("icon-direito-civil-1.svg"),
    title: "Direito Civil",
  },
  {
    icon: asset("direito-tributario-1.svg"),
    title: "Direito Tributário",
  },
  {
    icon: asset("icon-direito-publico-1.svg"),
    title: "Direito Público",
  },
  {
    icon: asset("icon-direito-previdenciario-1.svg"),
    title: "Direito Previdenciário",
  },
  {
    icon: asset("direito-bancario-1.svg"),
    title: "Direito Bancário",
  },
  {
    icon: asset("icon-direito-do-agronegocio-1.svg"),
    title: "Direito do Agronegócio",
  },
]

const serviceIcons = {
  assembleias: asset("icon-assessoria-assembleias.svg"),
  barulho: asset("icon-acoes-contra-barulhos.svg"),
  bancario: asset("direito-bancario-1.svg"),
  civil: asset("icon-direito-civil-1.svg"),
  cobranca: asset("icon-cobranca-cotas.svg"),
  cobrancaAlt: asset("icon-cobranca-cotas-1.svg"),
  contratos: asset("icon-elaboracao-analise.svg"),
  revisao: asset("icon-elaboracao-revisao.svg"),
  previdenciario: asset("icon-direito-previdenciario-1.svg"),
  publico: asset("icon-direito-publico-1.svg"),
  agro: asset("icon-direito-do-agronegocio-1.svg"),
  responsabilidade: asset("icon-responsabilizacao-civil.svg"),
  suporte: asset("icon-suporte.svg"),
  tributario: asset("direito-tributario-1.svg"),
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: "advocacia-especializada-em-direito-condominial",
    title: "Advocacia especializada em Direito Condominial",
    shortTitle: "Direito Condominial",
    subtitle: "Proteção jurídica para a gestão eficiente do seu condomínio.",
    heroImage: asset("hero-advocacia-especializada-direito-condominial.jpg"),
    icon: asset("icon-direito-condominial-1.svg"),
    intro: [
      "A administração de condomínios envolve desafios jurídicos que vão desde a cobrança de cotas em atraso até a elaboração de convenções e regimentos internos. Questões como barulho excessivo, obras irregulares e uso indevido das unidades exigem suporte jurídico especializado para garantir a harmonia e o cumprimento das normas condominiais.",
      "Nosso escritório atua de forma preventiva e contenciosa, assegurando a conformidade legal, a resolução de conflitos e a proteção dos interesses do condomínio e de seus gestores.",
    ],
    workIntro:
      "Com ampla experiência em Direito Condominial, oferecemos soluções jurídicas estratégicas para síndicos, administradoras e condôminos, garantindo uma gestão segura e eficiente.",
    services: [
      { title: "Cobrança de cotas condominiais em atraso", icon: serviceIcons.cobranca },
      { title: "Elaboração e revisão de convenções e regimentos internos", icon: serviceIcons.revisao },
      { title: "Assessoria em assembleias e deliberações condominiais", icon: serviceIcons.assembleias },
      { title: "Ações contra barulho, perturbação e uso irregular", icon: serviceIcons.barulho },
      { title: "Responsabilização civil de condôminos, moradores e prestadores de serviço", icon: serviceIcons.responsabilidade },
      { title: "Elaboração e análise de contratos com prestadores terceirizados", icon: serviceIcons.contratos },
      { title: "Suporte jurídico preventivo e contencioso", icon: serviceIcons.suporte },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-imobiliario",
    title: "Advocacia especializada em Direito Imobiliário",
    shortTitle: "Direito Imobiliário",
    subtitle: "Assessoria jurídica na proteção dos seus negócios imobiliários",
    heroImage: asset("hero-direito-imobiliario.jpg"),
    featureImage: asset("img-h2-direito-imobiliario.jpg"),
    icon: asset("icon-direito-imobiliario-1.svg"),
    intro: [
      "A regularização de imóveis, a análise contratual e a resolução de disputas são etapas essenciais para garantir segurança jurídica no setor imobiliário. Atuamos na elaboração e revisão de contratos, usucapião, incorporações, loteamentos, ações possessórias e na suspensão de leilões, sempre focados na proteção dos seus interesses e na prevenção de riscos em transações imobiliárias.",
      "Ter o suporte de uma assessoria jurídica especializada é essencial para minimizar riscos, solucionar conflitos e garantir a proteção dos seus interesses em todas as fases do processo.",
    ],
    workIntro:
      "Com vasta experiência em Direito Imobiliário, oferecemos soluções jurídicas estratégicas e personalizadas para atender às necessidades específicas de cada cliente.",
    services: [
      { title: "Regularização de imóveis urbanos e rurais", icon: asset("icon-direito-imobiliario-1.svg") },
      { title: "Usucapião judicial e extrajudicial", icon: serviceIcons.revisao },
      { title: "Elaboração e análise de contratos", icon: serviceIcons.contratos },
      { title: "Assessoria jurídica em incorporações, loteamentos e registros", icon: asset("icon-direito-condominial-1.svg") },
      { title: "Ações possessórias, reintegração de posse e reivindicatórias", icon: serviceIcons.responsabilidade },
      { title: "Análise de riscos em transações imobiliárias", icon: asset("icon-recuperacao-de-credito-1.svg") },
      { title: "Suspensão de leilão junto à instituição financeira", icon: serviceIcons.cobrancaAlt },
    ],
  },
  {
    slug: "especialistas-em-recuperacao-de-credito",
    title: "Especialistas em Recuperação de Crédito",
    shortTitle: "Recuperação de Crédito",
    subtitle:
      "Estratégias seguras para maximizar a recuperação de valores e manter a saúde financeira do seu negócio",
    heroImage: asset("hero-recuperacao-credito.jpg"),
    featureImage: asset("img-h2-recuperacao-credito.jpg"),
    icon: asset("icon-recuperacao-de-credito-1.svg"),
    intro: [
      "A inadimplência pode comprometer a estabilidade financeira de empresas, condomínios e instituições de ensino. Por isso, atuamos na cobrança extrajudicial e judicial de créditos inadimplidos, empregando estratégias seguras e personalizadas para recuperar valores sem comprometer o relacionamento comercial, sempre que possível.",
      "Nossa estrutura conta com um call center especializado em cobrança, garantindo uma abordagem ética, profissional e voltada à negociação amigável, tornando o processo mais ágil e eficiente.",
    ],
    workIntro:
      "Oferecemos soluções completas para recuperação de créditos, combinando análise estratégica, negociação extrajudicial e medidas judiciais para maximizar a efetividade da cobrança.",
    services: [
      { title: "Cobrança de cotas condominiais em atraso", icon: serviceIcons.cobranca },
      { title: "Cobrança de mensalidades escolares e universitárias", icon: serviceIcons.cobranca },
      { title: "Cobrança de serviços prestados por empresas", icon: serviceIcons.cobrancaAlt },
      { title: "Análise estratégica da viabilidade de cobrança", icon: serviceIcons.revisao },
      { title: "Ações de execução, monitória e cobranças judiciais", icon: serviceIcons.contratos },
      { title: "Call Center especializado em cobrança", icon: serviceIcons.assembleias },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-trabalhista",
    title: "Advocacia especializada em Direito Trabalhista",
    shortTitle: "Direito Trabalhista",
    subtitle:
      "Proteção jurídica para empregados e empregadores, assegurando direitos e prevenindo litígios",
    heroImage: asset("hero-direito-trabalhista.jpg"),
    featureImage: asset("img-h2-direito-trabalhista.jpg"),
    icon: asset("icon-direito-trabalhista-1.svg"),
    intro: [
      "As relações de trabalho envolvem direitos e deveres que precisam ser protegidos e respeitados para evitar conflitos e prejuízos. Seja na defesa de empresas contra ações judiciais ou na busca por direitos trabalhistas não pagos, contar com uma assessoria especializada é fundamental para garantir segurança jurídica e minimizar riscos.",
      "Nosso escritório atua tanto na esfera consultiva quanto na litigiosa, elaborando contratos e políticas internas, representando empresas e empregados em disputas judiciais e prevenindo problemas por meio de estratégias eficazes.",
    ],
    workIntro:
      "Com vasta experiência em Direito Trabalhista, oferecemos soluções jurídicas personalizadas para empresas e trabalhadores, garantindo conformidade legal e defesa estratégica.",
    services: [
      { title: "Reclamatórias trabalhistas e verbas rescisórias não pagas", icon: serviceIcons.cobrancaAlt },
      { title: "Casos de assédio moral e assédio sexual", icon: serviceIcons.publico },
      { title: "Defesa de empregadores em ações judiciais", icon: serviceIcons.assembleias },
      { title: "Elaboração de contratos, políticas internas e pareceres jurídicos", icon: serviceIcons.revisao },
      { title: "Assessoria preventiva para empresas", icon: asset("icon-direito-condominial-1.svg") },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-civil",
    title: "Advocacia especializada em Direito Civil",
    shortTitle: "Direito Civil",
    subtitle:
      "Protegendo seus direitos e garantindo segurança jurídica em todas as suas relações",
    heroImage: asset("hero-direito-civil.jpg"),
    featureImage: asset("img-h2-direito-civil.jpg"),
    icon: asset("icon-direito-civil-1.svg"),
    intro: [
      "O Direito Civil abrange uma ampla gama de questões que impactam diretamente a vida das pessoas e das empresas. Seja na elaboração e revisão de contratos, na defesa em disputas judiciais ou na busca por indenizações, contar com uma assessoria jurídica especializada é essencial para garantir seus direitos e evitar prejuízos.",
      "Nosso escritório atua de forma estratégica e personalizada para oferecer soluções jurídicas seguras, prevenindo conflitos e garantindo a melhor defesa dos seus interesses.",
    ],
    workIntro:
      "Com ampla experiência em Direito Civil, oferecemos suporte jurídico completo para pessoas físicas e jurídicas, assegurando proteção e segurança jurídica em diversas situações.",
    services: [
      { title: "Elaboração, revisão e rescisão de contratos", icon: serviceIcons.contratos },
      { title: "Indenizações por danos morais e materiais", icon: serviceIcons.revisao },
      { title: "Responsabilidade civil contratual e extracontratual", icon: serviceIcons.assembleias },
      { title: "Ações possessórias, de obrigação de fazer ou não fazer", icon: serviceIcons.revisao },
      { title: "Inventários, divórcios e pensões", icon: serviceIcons.tributario },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-tributario",
    title: "Advocacia especializada em Direito Tributário",
    shortTitle: "Direito Tributário",
    subtitle: "Soluções estratégicas para reduzir custos e garantir conformidade fiscal",
    heroImage: asset("hero-direito-tributario.jpg"),
    featureImage: asset("img-h2-direito-tributario.jpg"),
    icon: asset("direito-tributario-1.svg"),
    intro: [
      "A gestão tributária eficiente é essencial para empresas, produtores rurais e pessoas físicas que desejam evitar cobranças indevidas, reduzir encargos e manter a conformidade com a legislação. Uma assessoria jurídica especializada pode ajudar a otimizar a carga tributária, garantir a correta aplicação das leis e recuperar tributos pagos a maior.",
      "Nosso escritório oferece suporte estratégico e técnico para defender seus interesses, minimizar riscos fiscais e potencializar benefícios tributários.",
    ],
    workIntro:
      "Com experiência em Direito Tributário, auxiliamos empresas e contribuintes na gestão de tributos, defesa contra cobranças indevidas e recuperação de créditos, garantindo maior segurança financeira.",
    services: [
      { title: "Defesas administrativas e judiciais contra cobranças indevidas", icon: serviceIcons.cobranca },
      { title: "Planejamento tributário empresarial e rural", icon: serviceIcons.revisao },
      { title: "Revisão de tributos pagos a maior e compensações", icon: serviceIcons.assembleias },
      { title: "Recuperação de créditos tributários", icon: serviceIcons.barulho },
      { title: "Assessoria tributária preventiva", icon: serviceIcons.responsabilidade },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-publico",
    title: "Advocacia especializada em Direito Público",
    shortTitle: "Direito Público",
    subtitle: "Defesa dos seus direitos perante a Administração Pública",
    heroImage: asset("hero-direito-publico.jpg"),
    featureImage: asset("img-h2-direito-publico.jpg"),
    icon: asset("icon-direito-publico-1.svg"),
    intro: [
      "O Direito Público abrange questões que envolvem servidores públicos, contratos administrativos e direitos perante o Estado. Desde mandados de segurança até a revisão de benefícios e restituição de verbas indevidas, atuar com segurança jurídica é essencial para garantir seus direitos.",
      "Nosso escritório possui vasta experiência na defesa de interesses contra ilegalidades administrativas, assegurando conformidade com a legislação e soluções eficazes para servidores públicos, empresas e cidadãos.",
    ],
    workIntro:
      "Com expertise em Direito Público, oferecemos suporte jurídico especializado para garantir a proteção dos seus direitos e o cumprimento da legalidade em todas as instâncias.",
    services: [
      { title: "Mandados de segurança e ações contra ilegalidades administrativas", icon: serviceIcons.revisao },
      { title: "Assessoria em concursos públicos, licitações e contratos administrativos", icon: serviceIcons.revisao },
      { title: "Defesa de direitos de servidores públicos (ativos e inativos)", icon: serviceIcons.assembleias },
      { title: "Restituição de descontos previdenciários indevidos (inativos)", icon: serviceIcons.tributario },
      { title: "Ação revisional de aposentadoria", icon: serviceIcons.previdenciario },
      { title: "Isenção de imposto de renda para servidores inativos", icon: serviceIcons.barulho },
      { title: "Restituição de verbas indevidas (AC3, militares)", icon: asset("icon-direito-trabalhista-1.svg") },
      { title: "Ação de paridade entre ativos e inativos", icon: asset("icon-recuperacao-de-credito-1.svg") },
      { title: "Ação dos 28,86%", icon: asset("icon-recuperacao-de-credito-1.svg") },
      { title: "Ação do PASEP", icon: serviceIcons.cobrancaAlt },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-previdenciario",
    title: "Advocacia especializada em Direito Previdenciário",
    shortTitle: "Direito Previdenciário",
    subtitle: "Protegendo seu futuro e garantindo seus direitos previdenciários",
    heroImage: asset("hero-direito-previdenciario.jpg"),
    featureImage: asset("img-h2-direito-previdenciario.jpg"),
    icon: asset("icon-direito-previdenciario-1.svg"),
    intro: [
      "O acesso a benefícios previdenciários exige planejamento e conhecimento das regras do INSS e dos regimes próprios de previdência. Seja para obter a aposentadoria ideal, revisar valores ou garantir benefícios como auxílio-doença e pensão por morte, contar com assessoria jurídica especializada faz toda a diferença.",
      "Nosso escritório atua na defesa dos direitos de trabalhadores, aposentados e segurados do INSS, garantindo segurança e assertividade na concessão e revisão de benefícios.",
    ],
    workIntro:
      "Com ampla experiência em Direito Previdenciário, oferecemos suporte para garantir o reconhecimento correto de direitos e benefícios.",
    services: [
      { title: "Aposentadorias por tempo de contribuição, idade, invalidez e especial", icon: serviceIcons.previdenciario },
      { title: "Revisão de aposentadorias", icon: serviceIcons.revisao },
      { title: "Concessão e restabelecimento de pensão por morte, auxílio-doença e BPC/LOAS", icon: serviceIcons.suporte },
      { title: "Planejamento previdenciário individual e estratégico", icon: serviceIcons.contratos },
    ],
  },
  {
    slug: "advocacia-especializada-em-direito-bancario",
    title: "Advocacia especializada em Direito Bancário",
    shortTitle: "Direito Bancário",
    subtitle: "Garantindo soluções seguras para sua vida financeira.",
    heroImage: asset("hero-direito-bancario.jpg"),
    featureImage: asset("img-h2-direito-bancario.jpg"),
    icon: asset("direito-bancario-1.svg"),
    intro: [
      "Operações financeiras podem conter cláusulas abusivas, juros excessivos e outras condições que comprometem a estabilidade financeira de empresas e pessoas físicas.",
      "Contar com assessoria jurídica especializada é essencial para revisar contratos, renegociar dívidas e garantir relações bancárias justas.",
      "Nosso escritório atua na defesa dos interesses de clientes contra abusos praticados por instituições financeiras, buscando soluções eficazes para a redução de encargos e a reestruturação de compromissos financeiros.",
    ],
    workIntro:
      "Com ampla experiência em Direito Bancário, oferecemos suporte técnico para garantir mais equilíbrio e segurança em suas relações financeiras.",
    services: [
      { title: "Revisão de contratos com cláusulas abusivas", icon: serviceIcons.civil },
      { title: "Ações para redução de juros excessivos", icon: serviceIcons.cobrancaAlt },
      { title: "Renegociação de dívidas bancárias", icon: serviceIcons.tributario },
      { title: "Defesa em ações de cobrança e busca e apreensão de bens", icon: serviceIcons.agro },
      { title: "Conversão de cartão de crédito consignado em empréstimo pessoal", icon: asset("icon-recuperacao-de-credito-1.svg") },
      { title: "Ações revisionais de juros em consignado", icon: serviceIcons.tributario },
      { title: "Ações envolvendo superendividamento e reestruturação de dívidas", icon: serviceIcons.revisao },
    ],
  },
  {
    slug: "advocacia-especializada-no-setor-agro",
    title: "Advocacia especializada no setor Agro",
    shortTitle: "Direito do Agronegócio",
    subtitle:
      "Segurança jurídica para produtores, empresários rurais e empreendimentos do agronegócio.",
    heroImage: asset("hero-direito-agronegocio.jpg"),
    featureImage: asset("img-h2-direito-agronegocio.jpg"),
    icon: asset("icon-direito-do-agronegocio-1.svg"),
    intro: [
      "O setor agropecuário exige segurança jurídica para garantir operações comerciais, financiamentos e gestão patrimonial eficiente. Questões como contratos agrícolas, regularização fundiária e proteção contra execuções podem impactar diretamente o sucesso do produtor.",
      "Nosso escritório oferece assessoria especializada para produtores rurais, empresas do setor e investidores, garantindo suporte jurídico completo para operações no agronegócio.",
    ],
    workIntro:
      "Com vasta experiência no setor agro, fornecemos soluções jurídicas estratégicas para proteger e impulsionar sua atividade rural.",
    services: [
      { title: "Contratos agrícolas, arrendamento e parceria rural", icon: serviceIcons.civil },
      { title: "Financiamentos e garantias para produtores", icon: serviceIcons.revisao },
      { title: "Regularização fundiária e registros", icon: serviceIcons.contratos },
      { title: "Defesa em execuções judiciais e ações relacionadas à atividade rural", icon: serviceIcons.agro },
      { title: "Planejamento tributário e sucessório para o campo", icon: serviceIcons.contratos },
      { title: "Estruturação e organização de holdings rurais familiares", icon: serviceIcons.responsabilidade },
    ],
  },
]

export const aboutPage = {
  heroImage: asset("escritorio-advocacia-jales.jpg"),
  image: asset("quem-somos-jales-e-jales.jpg"),
  paragraphs: [
    "O Jales Advogados é um escritório jurídico moderno, fundado com o propósito de oferecer soluções jurídicas eficientes, éticas e personalizadas.",
    "Sediado na Capital Federal, o escritório nasceu do sonho de um casal que compartilha não apenas a vida, mas também uma visão inovadora de atuação na advocacia: estratégica, humanizada e comprometida com resultados concretos.",
    "Desde 2013, temos nos consolidado como referência em Direito Imobiliário, Condominial, Trabalhista e Civil, e recentemente ampliamos nossa atuação para áreas estratégicas como Tributário, Público, Previdenciário, Bancário e do Agronegócio, refletindo a evolução das necessidades de nossos clientes e o crescimento técnico da nossa equipe.",
    "Contamos com uma estrutura sólida e uma equipe jurídica altamente qualificada, constantemente atualizada e comprometida em aplicar conhecimento técnico aliado a soluções inteligentes. Nosso trabalho é pautado por ética, eficiência e clareza na comunicação, sempre com foco na prevenção de litígios e no fortalecimento da segurança jurídica dos nossos clientes.",
    "Atuamos em todo o território nacional, com apoio de parceiros estratégicos em diversos estados do Brasil, o que nos permite oferecer atendimento abrangente, dinâmico e resolutivo.",
  ],
  teamText:
    "A equipe do Jales Advogados é composta por profissionais experientes, com sólida formação jurídica e atuação estratégica nas áreas em que se especializam.",
  differentials: [
    {
      title: "Soluções modernas",
      description:
        "Utilizamos técnicas modernas de negociação, mediação e arbitragem para resolver conflitos de forma eficiente e estratégica.",
      icon: asset("icon-solucoes-modernas.svg"),
    },
    {
      title: "Prevenção de conflitos",
      description:
        "Nosso foco vai além de vencer disputas – buscamos soluções sólidas que evitam novos litígios e geram economia de tempo e recursos.",
      icon: asset("icon-prevencao-de-conflitos.svg"),
    },
    {
      title: "Mediação estratégica",
      description:
        "Aplicamos princípios consagrados da mediação, garantindo acordos justos, sustentáveis e tecnicamente viáveis para todas as partes.",
      icon: asset("icon-mediacao-estrategica.svg"),
    },
    {
      title: "Relacionamento de longo prazo",
      description:
        "Priorizamos um atendimento próximo, construindo relações de confiança, compromisso e longo prazo com nossos clientes.",
      icon: asset("icon-relacionamento.svg"),
    },
    {
      title: "Tecnologia",
      description:
        "Investimos em inteligência artificial para otimizar processos, aumentar a precisão das decisões e agilizar a prestação de serviços jurídicos.",
      icon: asset("icon-tecnologia-ia.svg"),
    },
    {
      title: "Atendimento Humanizado",
      description:
        "Garantimos um atendimento próximo, individualizado e personalizado, porque a essência do nosso trabalho é o cuidado com cada cliente.",
      icon: asset("icon-atendimento-humanizado.svg"),
    },
  ],
  responsibilityImage: asset("img-responsabilidade-social.jpg"),
  responsibility: [
    "O Jales Advogados acredita que o sucesso profissional precisa estar alinhado ao propósito social. Por isso, apoiamos iniciativas de transformação e inclusão, como o projeto da implantação de um Centro de Excelência para acolhimento e recuperação de dependentes químicos e pessoas em situação de rua, com reabilitação e reinserção no mercado de trabalho.",
    "Além disso, apoiamos organizações como a AMMME – Agência Mantenedora de Missões Mundiais e Evangelização, que atua internacionalmente levando apoio espiritual e humanitário a povos de diversas línguas e nações.",
    "Acreditamos que responsabilidade social é um dever de todos — e a iniciativa privada tem papel fundamental no desenvolvimento da sociedade.",
  ],
}

export const teamPage = {
  heroImage: asset("equipe-jales-e-jales-1.jpg"),
}

export const teamMembers: TeamMember[] = [
  {
    name: "Dr. Wilker Jales",
    role: "Advogado",
    image: asset("wilker-jales2.jpg"),
    profile: {
      title: "Wilker Lucio Jales",
      subtitle: "Advogado | Especialista em Direito Imobiliário e Condominial",
      paragraphs: [
        "Sócio-fundador da Jales Advogados Associados, atua há mais de 12 anos de forma estratégica e resolutiva no campo do Direito Imobiliário, Condominial, Civil e Processual Civil. Possui experiência consolidada na assessoria a condomínios, síndicos e empresas do setor imobiliário, com foco em prevenção de riscos, eficiência e soluções jurídicas seguras. É pós-graduado em Direito Civil e Processo Civil, áreas que complementam sua prática voltada à defesa técnica e estratégica dos interesses de seus clientes.",
        "Autor do livro “Sou Síndico, e Agora?”, obra reconhecida como guia prático para gestores condominiais em todo o país, alia profundo conhecimento jurídico a uma abordagem clara e acessível, ajudando clientes a compreender responsabilidades e implementar estratégias eficazes de governança.",
        "Com ampla experiência em assembleias condominiais, mediação de conflitos e elaboração de documentos institucionais, sua atuação é pautada pela busca constante de segurança jurídica, transparência e resultados sustentáveis para condomínios e empresas.",
      ],
    },
  },
  { name: "Dra. Rebeca Jales", role: "Advogada", image: asset("rebeca-jales.jpg") },
  { name: "Dr. Pedro Martinez", role: "Advogado", image: asset("dr-pedro.jpg") },
  { name: "Dr. Danillo Ventura", role: "Advogado", image: asset("dr-danilo.jpg") },
  { name: "Dr. Davi Bidô", role: "Advogado", image: asset("dr-davi.jpeg") },
  { name: "Dra. Ingridh dos Santos", role: "Advogada", image: asset("dra-ingrid.jpg") },
  { name: "Dra. Rebeca Santiago", role: "Auxiliar Jurídico", image: asset("dra-rebeca.jpg") },
]

export const contactPage = {
  heroImage: asset("contato-jales-e-jales.jpg"),
}

export function getPracticeArea(slug: string) {
  return practiceAreas.find((area) => area.slug === slug)
}

export function getAreaCardHref(index: number) {
  return `/areas-de-atuacao/${practiceAreas[index]?.slug ?? ""}`
}
