// Dados padrão do gerador de salas. Para publicar suas alterações, use
// "Baixar dados.js" na aba Dados e substitua este arquivo.
// Composições de combate pensadas para 4 personagens (14 PB).
window.DADOS_PADRAO = {
  "versao": 1,
  "jogadores": 4,
  "ordem": "piramide",
  "patamares": {
    "1": {
      "esperanca": "O grupo percebe a sala antes de ser notado: os personagens agem primeiro e um deles recebe 1 Esperança.",
      "medo": "A sala percebe o grupo primeiro: o mestre recebe 1 Medo e começa com o foco.",
      "critico": "Sala favorável: o grupo age primeiro, todos recuperam 1 Ponto de Fadiga e há um consumível escondido aqui."
    },
    "2": {
      "esperanca": "O grupo percebe a sala antes de ser notado: os personagens agem primeiro e um deles recebe 1 Esperança.",
      "medo": "A sala percebe o grupo primeiro: o mestre recebe 1 Medo, começa com o foco e adiciona 1 PB ao encontro.",
      "critico": "Sala favorável: o grupo age primeiro, todos recuperam 1 Ponto de Fadiga e há um item ou consumível escondido aqui."
    },
    "3": {
      "esperanca": "O grupo percebe a sala antes de ser notado: os personagens agem primeiro e dois deles recebem 1 Esperança.",
      "medo": "A sala percebe o grupo primeiro: o mestre recebe 2 Medo, começa com o foco e adiciona 1 PB ao encontro.",
      "critico": "Sala favorável: o grupo age primeiro, todos recuperam 2 Pontos de Fadiga e há um item escondido aqui."
    },
    "4": {
      "esperanca": "O grupo percebe a sala antes de ser notado: os personagens agem primeiro e todos recebem 1 Esperança.",
      "medo": "A sala percebe o grupo primeiro: o mestre recebe 2 Medo, começa com o foco e adiciona 2 PB ao encontro.",
      "critico": "Sala favorável: o grupo age primeiro, todos recuperam 2 Pontos de Fadiga e há uma relíquia ou item raro escondido aqui."
    }
  },
  "encontros": [
    { "id": "p1-01", "nome": "Covil dos Punhais Escarpados", "tipo": "Combate", "patamares": [1], "peso": 12, "desc": "Punhal Escarpado, Chefe (3 PB), Brigão (4), 2 Bandidos (4), Seteiro (2) e um grupo de Ladrões lacaios (1)." },
    { "id": "p1-02", "nome": "Cripta inquieta", "tipo": "Combate", "patamares": [1], "peso": 12, "desc": "Esqueleto Cavaleiro (4 PB), 2 Esqueletos Guerreiros (4), 2 Esqueletos Arqueiros (4) e dois grupos de Esqueletos Arruinados (2)." },
    { "id": "p1-03", "nome": "Horda faminta", "tipo": "Combate", "patamares": [1], "peso": 10, "desc": "Zumbi Corpulento (4 PB), Horda de Zumbis (2), 2 Zumbis Famintos (4) e quatro grupos de Zumbis Putrefatos (4)." },
    { "id": "p1-04", "nome": "Ninho de roedores", "tipo": "Combate", "patamares": [1], "peso": 10, "desc": "Roedor Corrosivo (5 PB), 2 Bandos de Ratos (4) e quatro grupos de Ratos Gigantes (4). Luta curta: 13 PB." },
    { "id": "p1-05", "nome": "Câmara dos lodos", "tipo": "Combate", "patamares": [1], "peso": 8, "desc": "2 Lodos Verdes (4 PB), 2 Lodos Vermelhos (4) e 3 Cobras-de-Vidro (6)." },
    { "id": "p1-06", "nome": "Jardim tomado pela floresta", "tipo": "Combate", "patamares": [1], "peso": 8, "desc": "Dríade Jovem (3 PB), Defensor Enraizado (4), 2 Soldados Silvestres (4), Enxame de Arbustos (2) e um grupo de Entes Menores (1)." },
    { "id": "p1-07", "nome": "Toca da fera", "tipo": "Combate", "patamares": [1], "peso": 6, "desc": "Ogro das Cavernas (5 PB), Urso (4), 2 Lobos Atrozes (4) e um grupo de Ratos Gigantes (1)." },
    { "id": "p1-08", "nome": "Guardião da câmara", "tipo": "Combate", "patamares": [1], "peso": 4, "desc": "Construto (5 PB), Guerreiro Arcano (3), 2 Punhais Escarpados, Bruxos (2), Guarda Arqueiro (2) e dois grupos de Mercenários (2)." },
    { "id": "p1-09", "nome": "Círculo de invocação", "tipo": "Combate", "patamares": [1], "peso": 4, "desc": "Demônio Menor (5 PB), Elemental Menor do Fogo (5) e dois grupos de Mercenários (2). Dois solos: 12 PB." },

    { "id": "p2-01", "nome": "Ritual de cultistas", "tipo": "Combate", "patamares": [2], "peso": 12, "desc": "Portador dos Segredos (3 PB), Cultista Adepto (1), Cultista Sicário (2), Matilha Demoníaca (2), 2 Experimentos Fracassados (4) e dois grupos de Cultistas Iniciados (2)." },
    { "id": "p2-02", "nome": "Guarnição do reino", "tipo": "Combate", "patamares": [2], "peso": 12, "desc": "Cavaleiro do Reino (3 PB), 2 Soldados de Elite (4), Esquadrão de Arqueiros (2), Mago de Batalha (2) e três grupos de Conscritos (3)." },
    { "id": "p2-03", "nome": "Salão dos espectros", "tipo": "Combate", "patamares": [2], "peso": 10, "desc": "Espectro Capitão (3 PB), 2 Espectros Guardiões (4), 2 Espectros Arqueiros (4) e Crânio do Caos (2). Luta curta: 13 PB." },
    { "id": "p2-04", "nome": "Esconderijo dos assassinos", "tipo": "Combate", "patamares": [2], "peso": 10, "desc": "Assassino Mestre (3 PB), 3 Assassinos Envenenadores (6), Patife Mascarado (2), Espião (1) e dois grupos de Assassinos Aprendizes (2)." },
    { "id": "p2-05", "nome": "Arena dos gigantes", "tipo": "Combate", "patamares": [2], "peso": 8, "desc": "Minotauro Arrasador (4 PB), Gigante Lutador (4), Gigante Mestre das Feras (3) e três grupos de Gigantes Recrutas (3)." },
    { "id": "p2-06", "nome": "Câmara inundada", "tipo": "Combate", "patamares": [2], "peso": 8, "desc": "2 Tubarões (8 PB), Enguias-Elétricas (2) e 2 Sereias (4)." },
    { "id": "p2-07", "nome": "Laboratório profano", "tipo": "Combate", "patamares": [2], "peso": 6, "desc": "Gigante Disforme (5 PB), Predador Mortal (3) e 3 Experimentos Fracassados (6)." },
    { "id": "p2-08", "nome": "Guardião rúnico", "tipo": "Combate", "patamares": [2], "peso": 4, "desc": "Caixa de Batalha (5 PB), 2 Crânios do Caos (4), 2 Experimentos Fracassados (4) e um grupo de Cultistas Iniciados (1)." },
    { "id": "p2-09", "nome": "Covil da górgona", "tipo": "Combate", "patamares": [2], "peso": 4, "desc": "Górgona (5 PB), 3 Aparições de Pedra (6) e Serpe-Boreal (2). Luta curta: 13 PB." },

    { "id": "p3-01", "nome": "Corte do vampiro", "tipo": "Combate", "patamares": [3], "peso": 12, "desc": "Vampiro Mestre (3 PB), 3 Vampiros (6), 2 Morcegos Atrozes (4) e um grupo de Diabretes Bajuladores (1)." },
    { "id": "p3-02", "nome": "Oficina dos autômatos", "tipo": "Combate", "patamares": [3], "peso": 12, "desc": "2 Autômatos Sentinelas (8 PB), 2 Autômatos Torretas (4) e 2 Autômatos Carcereiros (2)." },
    { "id": "p3-03", "nome": "Pacto dos pecados", "tipo": "Combate", "patamares": [3], "peso": 10, "desc": "Demônio da Soberba (3 PB), Demônio da Ira (4), Demônio da Inveja (2), Demônio do Desespero (2), Demônio da Avareza (1) e dois grupos de Diabretes Bajuladores (2)." },
    { "id": "p3-04", "nome": "Bosque desperto", "tipo": "Combate", "patamares": [3], "peso": 10, "desc": "Dríade (3 PB), Ente Carvalho (4), 2 Cavaleiros Cervos (4) e três grupos de Entes Jovens (3)." },
    { "id": "p3-05", "nome": "Fenda elemental", "tipo": "Combate", "patamares": [3], "peso": 8, "desc": "Grande Elemental da Terra (4 PB), Grande Elemental da Água (1), 3 Lodos Verdes Gigantes (6) e três grupos de Centelhas Elementais (3)." },
    { "id": "p3-06", "nome": "Covil da hidra", "tipo": "Combate", "patamares": [3], "peso": 6, "desc": "Hidra (5 PB), 2 Lodos Verdes Gigantes (4), 2 Morcegos Atrozes (4) e um grupo de Centelhas Elementais (1)." },
    { "id": "p3-07", "nome": "Disputa de território", "tipo": "Combate", "patamares": [3], "peso": 4, "desc": "Dragão do Gelo Jovem (5 PB) e Oscilume Adulto (5) brigando entre si, mais dois grupos de Centelhas Elementais (2). Dois solos: 12 PB." },

    { "id": "p4-01", "nome": "Legião dos mortos", "tipo": "Combate", "patamares": [4], "peso": 12, "desc": "Arquinecromante (3 PB), 2 Zumbis Aperfeiçoados (8), Legião de Zumbis (2) e Caído, Feiticeiro (1)." },
    { "id": "p4-02", "nome": "Hoste exaltada", "tipo": "Combate", "patamares": [4], "peso": 12, "desc": "Serafim Supremo (3 PB), 3 Exaltados, Arqueiros (6) e cinco grupos de Exaltados, Soldados (5)." },
    { "id": "p4-03", "nome": "Rasgo dos Reinos Exteriores", "tipo": "Combate", "patamares": [4], "peso": 10, "desc": "2 Reinos Exteriores, Abominações (8 PB), 2 Corruptores (2) e quatro grupos de Servos (4)." },
    { "id": "p4-04", "nome": "Guarda dos Deuses Caídos", "tipo": "Combate", "patamares": [4], "peso": 8, "desc": "Caído, General Arrasa-Reinos (5 PB), 3 Caídos, Feiticeiros (3), Legião de Zumbis (2) e quatro grupos de Caídos, Defensores (4)." },
    { "id": "p4-05", "nome": "Santuário do oráculo", "tipo": "Combate", "patamares": [4], "peso": 6, "desc": "Oráculo da Perdição (5 PB), 2 Zumbis Aperfeiçoados (8) e Caído, Feiticeiro (1)." },
    { "id": "p4-06", "nome": "Abismo do kraken", "tipo": "Combate", "patamares": [4], "peso": 4, "desc": "Kraken (5 PB) numa câmara alagada, 2 Reinos Exteriores, Abominações (8) e um Corruptor (1)." },
    { "id": "p4-07", "nome": "Covil do dragão vulcânico", "tipo": "Combate", "patamares": [4], "peso": 4, "desc": "Dragão Vulcânico, Predador de Obsidiana (5 PB). Use as três formas do dragão em sequência; complete os PB restantes só se o grupo estiver descansado." },

    { "id": "g-01", "nome": "Patrulha errante", "tipo": "Combate", "patamares": [2, 3, 4], "peso": 8, "desc": "Role de novo na tabela do patamar anterior e some 1 PB ao encontro (adversários de patamar inferior)." },
    { "id": "g-02", "nome": "Sala com armadilha", "tipo": "Exploração", "patamares": [1, 2, 3, 4], "peso": 8, "desc": "Lâminas, dardos, gás ou piso falso. Teste de reação contra a Dificuldade do patamar; em falha, dano do patamar. Desarmar ou contornar exige um teste de ação." },
    { "id": "g-03", "nome": "Passagem perigosa", "tipo": "Travessia", "patamares": [1, 2, 3, 4], "peso": 6, "desc": "Abismo, ponte podre, rio subterrâneo ou corredor desabando. Cruzar pede testes contra a Dificuldade do patamar; falhas custam Fadiga, tempo ou separam o grupo." },
    { "id": "g-04", "nome": "Alguém que não devia estar aqui", "tipo": "Social", "patamares": [1, 2, 3, 4], "peso": 5, "desc": "Prisioneiro, desertor, mercador perdido ou rival. Quer algo do grupo e sabe o que há na próxima sala." },
    { "id": "g-05", "nome": "Tesouro guardado", "tipo": "Tesouro", "patamares": [1, 2, 3, 4], "peso": 4, "desc": "Baú, altar ou cofre com saque do patamar. Trancado, amaldiçoado ou vigiado: abrir sem cuidado dá 1 Medo ao mestre." },
    { "id": "g-06", "nome": "Refúgio silencioso", "tipo": "Descanso", "patamares": [1, 2, 3, 4], "peso": 7, "desc": "Sala vazia e defensável, com sinais de quem passou antes. Segura o bastante para um descanso curto." },
    { "id": "g-07", "nome": "Ecos do que vem adiante", "tipo": "Evento", "patamares": [1, 2, 3, 4], "peso": 4, "desc": "Rastros, restos de combate ou sons distantes. O grupo descobre o que há na próxima sala: role já o próximo encontro e revele uma pista dele." }
  ]
};
