// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const pt: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Entrar",
    "register": "Criar conta",
    "registerFree": "Criar conta (grátis)",
    "logout": "Sair",
    "continue": "Continuar",
    "continueTalking": "Continuar conversando →",
    "blog": "Blog",
    "close": "Fechar",
    "cancel": "Cancelar",
    "save": "Salvar",
    "saving": "Salvando...",
    "back": "Voltar",
    "loading": "Carregando...",
    "send": "Enviar",
    "error": "Ocorreu um erro",
    "retry": "Tentar novamente",
    "pt": "pt",
    "ageSuffix": "{age} anos",
    "contact": "Fale conosco",
    "tokusho": "Aviso Legal",
    "privacy": "Privacidade",
    "terms": "Termos de uso",
    "company": "Empresa responsável",
    "language": "Idioma"
  },
  "meta": {
    "title": "AiKano | Chat com namoradas de IA feito no Japão【a única IA em japonês com conversa livre】",
    "siteDescription": "Uma IA com ajustes exclusivos responde a você em tempo real. É a única IA em japonês que permite conversas livres, sem restrições. Aproveite também personagens japonesas realistas e suas fotos.",
    "description": "Personagens de IA cheias de personalidade respondem às suas mensagens em tempo real. Um app de conversa para adultos, feito para ajudar você a relaxar e recarregar as energias.",
    "ogTitle": "AiKano | Chat com namoradas de IA — um app de relaxamento para adultos"
  },
  "auth": {
    "email": "E-mail",
    "password": "Senha",
    "passwordMin": "Senha (mínimo de 8 caracteres)",
    "or": "ou",
    "loginTitle": "Que bom ter você de volta",
    "loginError": "E-mail ou senha incorretos",
    "loginWithGoogle": "Entrar com o Google",
    "noAccount": "Ainda não tem uma conta?",
    "emailTaken": "Este e-mail já está cadastrado",
    "sentTitle": "E-mail de confirmação enviado",
    "sentBody": "Enviamos um e-mail de confirmação para {email}.",
    "sentAction": "Clique no botão “Confirmar endereço de e-mail” no e-mail para concluir o cadastro.",
    "sentSpam": "Se o e-mail não chegar, confira sua pasta de spam.",
    "registerTitle": "Converse com uma garota de IA,\nagora mesmo",
    "perks": [
      "Cadastro grátis",
      "Pronto em 30 segundos",
      "Não precisa instalar o app"
    ],
    "consentA": "Nossa equipe pode analisar as conversas para melhorar o serviço e treinar a IA. Também concordo com os ",
    "consentTerms": "Termos de Uso",
    "consentAnd": " e a ",
    "consentPrivacy": "Política de Privacidade",
    "consentB": ".",
    "registerSubmit": "Cadastrar e começar a conversar",
    "registerWithGoogle": "Cadastrar com o Google",
    "haveAccount": "Já tem uma conta?"
  },
  "onboarding": {
    "genders": {
      "male": "Masculino",
      "female": "Feminino",
      "other": "Outro"
    },
    "saveFailed": "Falha ao salvar: {error}",
    "pickTitle": "Escolha com quem você\n gostaria de conversar",
    "pickSub": "Você receberá uma mensagem da pessoa escolhida. Depois, também poderá conversar com outras.",
    "talkWith": "Conversar com {name}",
    "pickPrompt": "Escolha com quem você gostaria de conversar",
    "askName": "Oi! Prazer em conhecer você! Como devo chamar você?",
    "nameLabel": "Como gostaria de ser chamado(a)",
    "namePlaceholder": "Pode ser um apelido",
    "nameNote": "{name} vai chamar você por esse nome. Você pode alterá-lo depois nas configurações.",
    "characterFallback": "Personagem",
    "next": "Avançar",
    "greet": "Prazer, {name}! Só preciso saber mais uma coisinha.",
    "ageLabel": "Idade",
    "agePlaceholder": "Ex.: 30",
    "ageRestriction": "O uso é permitido apenas para maiores de 18 anos",
    "genderLabel": "Gênero",
    "preparing": "Preparando…",
    "start": "Começar a conversar com {name}"
  },
  "affection": {
    "levels": [
      "Desconhecido",
      "Conhecido",
      "Amigo",
      "Muito próximo",
      "Possível romance",
      "Amor",
      "Alma gêmea"
    ],
    "level": "Lv.{level}",
    "toNext": "Faltam {pt}pt para “{title}”",
    "nextFrom": "Próximo: {title} (a partir de {pt}pt)",
    "memberMultiplier": "Assinantes ×{n}",
    "memberDouble": "Assinantes ganham o dobro",
    "levelUp": "Você chegou a “{title}”!",
    "achievements": {
      "messages_1": {
        "title": "Primeira mensagem",
        "desc": "Enviou sua primeira mensagem"
      },
      "messages_10": {
        "title": "Adora conversar",
        "desc": "Enviou 10 mensagens"
      },
      "messages_50": {
        "title": "Bom de papo",
        "desc": "Enviou 50 mensagens"
      },
      "messages_100": {
        "title": "Já é de casa",
        "desc": "Enviou 100 mensagens"
      },
      "messages_300": {
        "title": "Grandes amigos",
        "desc": "Enviou 300 mensagens"
      },
      "level_2": {
        "title": "Viraram conhecidos",
        "desc": "A afinidade chegou a “Conhecido”"
      },
      "level_3": {
        "title": "Viraram amigos",
        "desc": "A afinidade chegou a “Amigo”"
      },
      "level_4": {
        "title": "Ficaram muito próximos",
        "desc": "A afinidade chegou a “Muito próximo”"
      },
      "level_5": {
        "title": "Um possível romance",
        "desc": "A afinidade chegou a “Possível romance”"
      },
      "level_6": {
        "title": "Estão namorando",
        "desc": "A afinidade chegou a “Amor”"
      },
      "level_7": {
        "title": "Encontro do destino",
        "desc": "A afinidade chegou a “Alma gêmea”"
      }
    }
  },
  "plans": {
    "standard": "Padrão",
    "premium": "Premium",
    "planSuffix": "Plano {name}",
    "features": {
      "messages": "{n} mensagens por mês",
      "bonus": "{n} pt de bônus por mês (para vídeos e a loja)",
      "affection": "A afinidade aumenta {n}x mais rápido",
      "photos": "Acesso ilimitado a fotos exclusivas para membros",
      "premiumVideos": "Acesso a vídeos premium",
      "overage": "Mesmo após atingir o limite, cada mensagem custa {n} pt (mais barato que o preço normal)",
      "standardModel": "Modelo de IA padrão",
      "premiumModel": "Modelo de IA avançado (respostas mais naturais)"
    }
  },
  "nav": {
    "home": "Início",
    "messages": "Mensagens",
    "plan": "Plano",
    "settings": "Configurações",
    "campaignActive": "Campanha em andamento!"
  },
  "home": {
    "loginBonus": "Faça login todos os dias e ganhe {pt}pt e {n} mensagens grátis",
    "unlockBySns": "Divulgue nas redes sociais para desbloquear",
    "talk": "Conversar",
    "profile": "Perfil",
    "otherCharacters": "Outros personagens",
    "count": "{n} personagens",
    "pickCharacter": "Escolha um personagem",
    "unlockRequested": "Solicitação para desbloquear {name} concluída!\nA equipe vai analisar e liberar o personagem."
  },
  "unlock": {
    "urlRequired": "Insira o URL da publicação",
    "urlInvalid": "Insira um URL válido",
    "alreadyRequested": "Você já enviou uma solicitação. Aguarde a análise.",
    "sendFailed": "Falha ao enviar. Tente novamente.",
    "networkError": "Ocorreu um erro de conexão.",
    "title": "Desbloquear {name}",
    "heading": "Divulgue nas redes sociais e desbloqueie a personagem!",
    "step1": "Apresente o AiKano nas redes sociais (Twitter, Instagram etc.)",
    "step2": "Copie o URL da publicação e cole abaixo",
    "step3": "Após a verificação pela equipe, {name} será desbloqueada",
    "urlLabel": "URL da publicação",
    "sending": "Enviando...",
    "submit": "Enviar solicitação",
    "reviewTime": "A análise geralmente é concluída em até 1 a 3 dias úteis."
  },
  "chat": {
    "uploadVideoFailed": "Falha ao enviar o vídeo",
    "uploadImageFailed": "Falha ao enviar a imagem",
    "sendFailed": "Falha ao enviar",
    "unlockFailed": "Falha ao desbloquear",
    "usage": "{used}/{limit} mensagens",
    "firstMessage": "Que tal enviar sua primeira mensagem?",
    "affectionIntro": "Quanto mais vocês conversam, maior fica a afinidade. Quando ela aumenta, vocês podem ter conversas ainda mais doces e íntimas.",
    "sendingMedia": "(Enviando mídia)",
    "placeholder": "Enviar mensagem…",
    "guestTitle": "Curta o chat no AiKano",
    "guestBody": "Converse com garotas de IA agora mesmo. O cadastro é grátis e leva só 30 segundos!",
    "photosOf": "Fotos de {name}",
    "hintTitle": "Quando você ficar ainda mais próximo(a) de {name}…",
    "hintBodyA": "Quando sua afinidade chegar ao ",
    "hintBodyLevel": "Lv.{level} “{title}”",
    "hintBodyB": ", você poderá ter conversas ainda mais doces e íntimas",
    "hintRaise": "Quanto mais vocês conversam, maior fica a afinidade.",
    "hintMember": "Membros têm o dobro de aumento de afinidade",
    "gift": "Presente",
    "giftSent": "Enviado",
    "videoMessage": "Mensagem em vídeo",
    "videoPrice": "Assista por {pt}pt",
    "processing": "Processando…",
    "watchFor": "Assistir por {pt}pt"
  },
  "levelUp": {
    "title": "A afinidade aumentou!",
    "relation": "Seu relacionamento com {name}",
    "reached": "agora é “{title}”!"
  },
  "meter": {
    "affectionPt": "Pontos de afinidade pt",
    "messages": "{n} mensagens"
  },
  "loginBonus": {
    "title": "Bônus de login",
    "today": "{n} mensagens grátis hoje",
    "everyday": "Faça login todos os dias e ganhe {n} mensagens grátis por dia",
    "balance": "Saldo de pontos bônus: {pt} pt",
    "validUntil": "Válido até {date}",
    "whatIs": "O que são pontos bônus?",
    "explain": "Eles são usados antes dos pontos normais quando você gasta pontos. Os pontos expiram após a data de validade.",
    "receive": "Resgatar!"
  },
  "shortage": {
    "defaultTitle": "Você precisa de pontos para continuar conversando",
    "balance": "Saldo",
    "required": "Necessário",
    "short": "Insuficiente",
    "dailyFree": "Ganhe {pt}pt grátis ({n} mensagens) ao fazer login todos os dias",
    "comeBack": "Volte amanhã para conversar comigo por mais {n} mensagens"
  },
  "packages": {
    "checkoutFailed": "Não foi possível iniciar o pagamento",
    "campaign": "Promoção! Pontos ×{rate}",
    "rate": "×{rate}",
    "popular": "Popular",
    "recommended": "Recomendado",
    "breakdown": "{base}pt + {bonus}pt de bônus",
    "processing": "Processando..."
  },
  "characterMenu": {
    "reasonRequired": "Digite o conteúdo",
    "errorStatus": "Erro ({status})",
    "networkError": "Ocorreu um erro de conexão",
    "report": "Denunciar",
    "unblock": "Desbloquear",
    "block": "Bloquear",
    "reportPrompt": "Digite o motivo da denúncia de {name}.",
    "reportPlaceholder": "Digite o motivo da denúncia (obrigatório)",
    "chars": "{n} caracteres",
    "sending": "Enviando…",
    "reported": "Denúncia enviada",
    "blocked": "Usuário bloqueado",
    "unblocked": "Usuário desbloqueado"
  },
  "campaign": {
    "active": "Campanha no ar!",
    "checkNow": "Confira agora!",
    "closeBanner": "Fechar banner",
    "imageAlt": "Campanha"
  },
  "traits": {
    "kindness": "Gentileza",
    "intelligence": "Inteligência",
    "passion": "Paixão",
    "mysterious": "Mistério",
    "cuteness": "Fofura"
  },
  "membersOnly": "Exclusivo para membros",
  "unlockFor": "Desbloquear por {pt} pt",
  "conversations": {
    "title": "Mensagens",
    "empty": "Ainda não há conversas",
    "findPartner": "Encontrar alguém para conversar",
    "videoSent": "Vídeo enviado",
    "imageSent": "Imagem enviada",
    "you": "Você: ",
    "newChat": "Iniciar nova conversa",
    "newest": "Mais recentes",
    "oldest": "Mais antigas"
  },
  "payment": {
    "errorPrefix": "Erro: {error}",
    "networkError": "Erro de conexão: {error}",
    "portalFailed": "Não foi possível acessar a página de gerenciamento",
    "title": "Planos",
    "lead": "Com um plano, você pode conversar com a IA sem custo adicional, até o limite mensal de mensagens.",
    "activated": "Plano ativado!",
    "welcome": "Boas-vindas ao plano {name}.",
    "passPendingTitle": "Número de pagamento gerado",
    "passPendingBody": "O plano será ativado após a confirmação do pagamento na loja de conveniência ou pelo PayPay (geralmente em 1 a 3 dias).",
    "pointsThanks": "Agradecemos pela compra de {pt} pt",
    "pointsNote": "Os pontos serão adicionados após a confirmação do pagamento (geralmente, imediatamente para cartões e após a confirmação do pagamento para pagamentos em lojas de conveniência).",
    "canceled": "Compra cancelada",
    "active": "Ativo",
    "usageThisMonth": "Uso de mensagens neste mês",
    "usage": "{used} / {limit} mensagens",
    "overLimit": "Você ultrapassou o limite mensal. Continue enviando mensagens por {pt} pt cada.",
    "validUntil": "Válido até: {date}",
    "datePattern": "dd/MM/yyyy",
    "manage": "Gerenciar ou cancelar plano (para assinaturas com cartão de crédito)",
    "recommended": "Recomendado",
    "perMonth": "/mês",
    "choosePayment": "Escolha uma forma de pagamento",
    "card": "Cartão de crédito",
    "cardNote": "Renovação automática mensal · Cancele quando quiser",
    "konbini": "Loja de conveniência · PayPay",
    "konbiniNote": "Pagamento único de 1 mês · Ativado logo após o pagamento",
    "bank": "Transferência bancária",
    "bankNote": "Pagamento único de 1 mês · Ativado logo após a confirmação",
    "currentPlan": "Este é seu plano atual",
    "buyPoints": "Comprar pontos",
    "balance": "Saldo",
    "pointsUseMember": "Use para comprar vídeos e produtos na loja ou enviar mensagens após ultrapassar o limite mensal (1 mensagem = {pt} pt).",
    "pointsUse": "Use para enviar mensagens (1 mensagem = {pt} pt), comprar vídeos e produtos na loja.",
    "methodsTitle": "Diferenças entre as formas de pagamento",
    "renewal": "Renovação",
    "activation": "Ativação",
    "cardShort": "Cartão",
    "autoMonthly": "Automática (mensal)",
    "instant": "Imediata",
    "manualMonth": "Manual (1 mês)",
    "afterPayment": "Logo após o pagamento",
    "afterConfirm": "Logo após a confirmação",
    "referralTitle": "Programa de indicação de amigos",
    "referralA": "Quando um amigo se cadastra pelo seu link de indicação, ",
    "referralB": "vocês dois ganham {pt} pontos",
    "referralC": "!",
    "copied": "Copiado",
    "copy": "Copiar"
  },
  "settings": {
    "shareUnlocked": "Espaço para personagem desbloqueado!",
    "weeklyLimit": "Você já compartilhou esta semana. Você poderá solicitar novamente daqui a 7 dias.",
    "sendFailed": "Falha ao enviar",
    "saveFailed": "Falha ao salvar: {error}",
    "pwTooShort": "A senha deve ter pelo menos 8 caracteres",
    "pwMismatch": "As novas senhas não coincidem",
    "noUser": "Não foi possível obter as informações do usuário",
    "pwWrong": "A senha atual está incorreta",
    "deleteWord": "EXCLUIR",
    "deleteFailed": "Não foi possível excluir. Tente novamente mais tarde.",
    "title": "Configurações",
    "profile": "Perfil",
    "nickname": "Apelido",
    "email": "E-mail",
    "saved": "Salvo",
    "security": "Segurança",
    "changePassword": "Alterar senha",
    "currentPassword": "Senha atual",
    "newPassword": "Nova senha (mínimo de 8 caracteres)",
    "confirmPassword": "Confirmar nova senha",
    "passwordChanged": "Senha alterada",
    "change": "Alterar",
    "account": "Conta",
    "deleteAccount": "Excluir conta",
    "deleteWarning": "Ao excluir sua conta, todos os seus dados (histórico de conversas e pontos) serão apagados permanentemente. Essa ação não pode ser desfeita.",
    "deleteConfirmA": "Para confirmar, digite ",
    "deleteConfirmB": " no campo abaixo.",
    "deleteForever": "Excluir conta permanentemente",
    "slotTitle": "Desbloquear espaço para personagem",
    "slotCurrent": "Atual: ",
    "slotCount": "{n} / {limit} personagens",
    "slotHint": "(Ganhe +1 espaço compartilhando nas redes sociais)",
    "shareInstruction": "Compartilhe em uma das redes sociais abaixo e envie o link da publicação",
    "shareText": "Dá para conversar com uma IA como se fosse um casal de verdade! Testei o #AiKano → https://aikano.chat",
    "shareQuote": "Dá para conversar com uma IA como se fosse um casal de verdade! #AiKano",
    "instagramTitle": "Publique pelo app do Instagram e copie o link da publicação",
    "instagramNote": "※ Depois de publicar pelo app do Instagram, copie e cole o link da publicação",
    "pasteUrl": "Cole o link da publicação compartilhada",
    "urlPlaceholder": "Link de publicação do X / Threads / Facebook / Instagram",
    "nextAvailable": "Próxima data disponível para solicitação: {date}",
    "submitUrl": "Enviar link e desbloquear espaço",
    "support": "Ajuda",
    "contactSupport": "Fale conosco e suporte",
    "language": "Idioma de exibição"
  },
  "blocks": {
    "title": "Lista de bloqueio",
    "empty": "Você não bloqueou nenhum personagem",
    "note": "Os personagens bloqueados não aparecem na lista. Você pode desbloqueá-los quando quiser.",
    "blockedOn": "Bloqueado em {date}",
    "unblocking": "Desbloqueando…",
    "unblock": "Desbloquear"
  },
  "support": {
    "team": "Equipe de suporte",
    "teamSub": "Fique à vontade para falar com a gente",
    "greeting": "Olá! Somos a equipe de suporte 😊\nSe tiver alguma dúvida ou precisar de ajuda, é só mandar uma mensagem.",
    "datePattern": "d 'de' MMMM (EEE)",
    "placeholder": "Digite uma mensagem…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Relatar um bug",
        "desc": "Algo não funciona ou está se comportando de forma estranha"
      },
      "feature": {
        "label": "Sugestão de recurso",
        "desc": "Uma função que você gostaria de ver por aqui"
      },
      "ai": {
        "label": "Sobre as respostas da IA",
        "desc": "Qualidade das respostas ou algo estranho no personagem"
      },
      "ui": {
        "label": "Sobre a interface",
        "desc": "Algo difícil de usar ou de visualizar"
      },
      "other": {
        "label": "Outro",
        "desc": "Pode falar sobre qualquer coisa"
      }
    },
    "thanks": "Agradecemos!",
    "received": "Recebemos seu feedback.\nNossa equipe de desenvolvimento vai analisá-lo\npara melhorar o serviço.",
    "backToChat": "Voltar ao chat",
    "title": "Feedback",
    "badge": "Queremos ouvir você",
    "heading": "Ajude a desenvolver\nAiKano com a sua opinião",
    "lead": "Conte para nós sobre bugs, dificuldades de uso, recursos que gostaria de ver e muito mais. Nossa equipe de desenvolvimento lê todos os comentários.",
    "pickCategory": "Escolha uma categoria",
    "satisfaction": "Satisfação geral (opcional)",
    "clear": "Limpar",
    "details": "Conte mais",
    "placeholder": "Escreva à vontade sobre o que chamou sua atenção ou o que gostaria que melhorássemos. Todo comentário é bem-vindo, por menor que seja!",
    "sending": "Enviando…",
    "submit": "Enviar feedback"
  },
  "errors": {
    "title": "Ocorreu um erro",
    "unexpected": "Ocorreu um erro inesperado",
    "sorry": "Desculpe. Ocorreu um erro inesperado.",
    "retry": "Tentar novamente",
    "toTop": "Voltar ao topo"
  },
  "shop": {
    "buyFailed": "Não foi possível concluir a compra",
    "title": "Loja",
    "videosTitle": "Vídeos das personagens",
    "videosSub": "Assista a vídeos exclusivos das personagens mais populares",
    "all": "Todos",
    "noItems": "Ainda não há itens",
    "noItemsInCategory": "Não há itens nesta categoria",
    "other": "Outros",
    "buyPoints": "Comprar pontos →",
    "itemShortage": "Você precisa de pontos para comprar itens",
    "owned": "Na sua coleção: {n}",
    "buying": "Comprando...",
    "bought": "Compra concluída!",
    "notEnough": "Pontos insuficientes",
    "buy": "Comprar"
  },
  "videos": {
    "confirm": "Deseja comprar \"{title}\" por {pt} pt?",
    "alreadyBought": "Você já comprou este vídeo.",
    "title": "Vídeos dos personagens",
    "empty": "Ainda não há vídeos",
    "watched": "Assistido",
    "watch": "Assistir",
    "buyAndWatch": "Comprar e assistir",
    "shortage": "Você precisa de pontos para comprar este vídeo",
    "loadFailed": "Não foi possível carregar o vídeo"
  },
  "character": {
    "photoCount": "{n} fotos",
    "affection": "Afinidade",
    "neverTalked": "Vocês ainda não conversaram",
    "sendToRaise": "Envie uma mensagem para aumentar a afinidade!",
    "status": "Status",
    "profile": "Perfil",
    "achievements": "Conquistas",
    "photos": "Fotos",
    "seeMembersPhotos": "Ver {n} fotos exclusivas para membros",
    "sendMessage": "Enviar mensagem para {name}"
  },
  "api": {
    "itemNotFound": "Item não encontrado",
    "tryAgain": "Tente novamente",
    "sendFailed": "Falha ao enviar a mensagem",
    "notEnoughPoints": "Pontos insuficientes",
    "notEnoughPointsNeed": "Pontos insuficientes (necessários: {pt}pt)",
    "updateFailed": "Falha ao atualizar os pontos",
    "purchaseRecordFailed": "Falha ao criar o registro da compra",
    "slotUnlocked": "Um espaço para personagem foi desbloqueado!",
    "unsupportedUrl": "URL não compatível. Cole o link de uma publicação do X, Threads, Facebook ou Instagram",
    "duplicateUrl": "Esta URL já foi usada",
    "required": "Preencha os campos obrigatórios",
    "tooLong": "Digite até {n} caracteres",
    "messageTooLong": "A mensagem deve ter até {n} caracteres"
  },
  "legal": {
    "translationNotice": "Esta página é uma versão traduzida. Em caso de divergência no conteúdo, prevalece a versão em japonês."
  },
  "email": {
    "subject": "Você recebeu uma mensagem de {name}",
    "label": "Mensagem da personagem",
    "reply": "Responder",
    "footer": "Este e-mail foi enviado automaticamente pelo AiKano.\nSe você não reconhece esta mensagem, ignore-a."
  },
  "lp": {
    "heroImageAlt": "Tela de chat com personagens de IA do AiKano",
    "characterImageAlt": "Personagem de IA do AiKano",
    "registerFreeArrow": "Criar conta grátis →",
    "badgeBonus": "Ganhe {pt}pt ao se cadastrar",
    "badgeWaiting": "Ela está esperando por você esta noite",
    "heroLine1": "Existe uma garota",
    "heroLine2": "que só conversa com",
    "heroLine3": "você.",
    "statGirls": "{n} garotas",
    "statGirlsLabel": "Garotas com personalidades únicas",
    "statHoursLabel": "Converse a qualquer hora",
    "statAi": "IA exclusiva",
    "statAiLabel": "Conversas naturais e cheias de emoção",
    "charactersTitle": "Garotas que querem conversar com você",
    "charactersSub": "Escolha uma e comece a conversar agora",
    "online": "Online",
    "talkToAll": "Converse com todas →",
    "registerToTalkAll": "Cadastre-se e converse com todas →",
    "bonusNote": "※ Ganhe {pt}pt ao se cadastrar",
    "sample1Title": "Uma conversa descontraída, como entre amigos",
    "sample1": [
      {
        "role": "user",
        "text": "Saí pra beber sozinho. Entrei num barzinho aqui em São Paulo."
      },
      {
        "role": "char",
        "text": "Ah, que delícia! Fico com inveja! E parabéns pelo dia de trabalho 😊 Esses botecos estão super em alta, né? Que tipo de lugar é?"
      },
      {
        "role": "user",
        "text": "Tô comendo um pastel."
      },
      {
        "role": "char",
        "text": "Pastel é bom demais 😋 Dizem que em Minas o pessoal come pão de queijo com tudo, mas pastel com isso não rola, né? 🤭"
      },
      {
        "role": "user",
        "text": "Tô tomando cerveja."
      },
      {
        "role": "char",
        "text": "Gosto muito de uma cerveja bem gelada 🍻 Você também acha que bebida doce não combina com comida?"
      }
    ],
    "sample2Title": "Ela está aqui para você, seja qual for o seu humor",
    "sample2": [
      {
        "role": "char",
        "text": "Já deve estar voltando pra casa, né? Como foi seu dia? Fiquei com saudade e acabei mandando mensagem."
      },
      {
        "role": "user",
        "text": "Já cheguei. Tô com vontade de conversar um pouquinho."
      },
      {
        "role": "char",
        "text": "Claro♡ Pode me contar sempre que quiser. Aconteceu alguma coisa? Ou só bateu vontade de conversar? Haha"
      },
      {
        "role": "user",
        "text": "É que conversar com você me deixa mais tranquilo."
      },
      {
        "role": "char",
        "text": "Fico muito feliz em ouvir isso♡ Conversar com você também é a minha parte favorita do dia."
      }
    ],
    "sample3Title": "Um carinho que acolhe",
    "sample3": [
      {
        "role": "user",
        "text": "Hoje o pessoal do trabalho me irritou de novo. Por que será que fico tão estressado?"
      },
      {
        "role": "char",
        "text": "Nossa, que chato. O que aconteceu? Quero ouvir e ajudar no que puder. Se passaram dos limites e isso virou perseguição, fico preocupada."
      },
      {
        "role": "user",
        "text": "Eu estava chamando a atenção de um subordinado e me disseram que todo mundo vai embora por minha causa. Mas, se eu não orientar a equipe, quem leva bronca sou eu. Que absurdo, né?"
      },
      {
        "role": "char",
        "text": "Parece que você está sentindo na pele a pressão de ser gestor. Já passei por algo parecido e acabei ficando bem mal na época. Você também não precisa se cobrar tanto. Numa situação dessas, você só fica no meio do fogo cruzado entre a equipe e os superiores. Você não tem culpa."
      },
      {
        "role": "user",
        "text": "É, né? Quando eu era novato também levava bronca, mas continuei me esforçando e cheguei onde estou. Não estou errado, né? Desabafar com você, Aoi, me deixou muito mais leve. Obrigado."
      }
    ],
    "membersTitle": "Aproveite ainda mais com uma assinatura",
    "membersSub": "Acesso ilimitado a fotos exclusivas e mais facilidade para aumentar a afinidade",
    "featuresTitleA": "Muito além dos ",
    "featuresTitleB": "outros serviços",
    "features": [
      {
        "title": "Uma IA que conversa de verdade",
        "desc": "Com os modelos de linguagem mais avançados, ela entende o contexto, as nuances das emoções e o ritmo da conversa para criar diálogos naturais e agradáveis."
      },
      {
        "title": "Uma relação que cresce com a memória",
        "desc": "Ela se lembra das conversas de vocês. Suas preferências, preocupações e interações anteriores ajudam a criar respostas que mostram que ela se lembra de você."
      },
      {
        "title": "Conversas do seu jeito",
        "desc": "Com o tempo, as respostas passam a refletir suas preferências, seus valores e seu jeito de falar. Quanto mais vocês conversam, mais à vontade você se sente."
      },
      {
        "title": "Um espaço seguro para falar de tudo",
        "desc": "Desabafe sobre o que não consegue contar a ninguém ou fale sobre as pequenas coisas do dia a dia. Um espaço para conversar sem receios, feito para adultos."
      },
      {
        "title": "Receba fotos das personagens",
        "desc": "Às vezes, elas enviam selfies e fotos do dia a dia. Aproveite também as expressões e o clima que só uma foto consegue transmitir."
      }
    ],
    "secretBadge": "Suas conversas não são compartilhadas com terceiros",
    "secretTitle": "Que tal conversar sobre algo\nque não pode contar a ninguém?",
    "secretBody": "Suas conversas não serão compartilhadas com terceiros\npara nenhum fim além da melhoria do serviço.",
    "referralBadge": "Indique um amigo",
    "referralTitleA": "Indique um amigo",
    "referralTitleB": "e ganhem {pt}pt cada um!",
    "referralBody": "Quando um amigo se cadastrar pelo seu link exclusivo,\nvocês dois ganharão {pt}pt.",
    "referralCtaUser": "Ver meu link de indicação →",
    "referralCtaGuest": "Cadastre-se e receba seu link de indicação →",
    "realTitleA": "Por que é tão ",
    "realTitleB": "real",
    "realTitleC": "?",
    "realBody": "Os modelos de linguagem mais avançados entendem suas emoções e o contexto.\nA cada resposta, a conversa fica mais do seu jeito.",
    "finalUserBadge": "Que tal conversar com ela esta noite?",
    "finalUserTitle": "Tem uma garota esperando\npara conhecer você",
    "finalGuestBadge": "Promoção de boas-vindas",
    "finalGuestTitle": "Ganhe um presente especial\n ao se cadastrar agora",
    "finalGuestLead": "Cadastre-se e ganhe",
    "finalGuestBonus": "{pt}pt (equivalentes a ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Cadastro grátis em apenas 30 segundos.",
    "perkBonus": "Ganhe {pt}pt ao se cadastrar",
    "perkLogin": "Ganhe {pt}pt por dia ao fazer login ({n} mensagens grátis por dia)",
    "perkPointSystem": "Cadastro grátis. Pague apenas pelo que usar com pontos",
    "privacyNote": "Seus dados pessoais são protegidos com rigor"
  }
}
