// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const pt: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Entrar",
    "register": "Cadastrar-se",
    "registerFree": "Cadastrar-se grátis",
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
    "tokusho": "Informações legais",
    "privacy": "Privacidade",
    "terms": "Termos de uso",
    "company": "Empresa responsável",
    "language": "Idioma"
  },
  "meta": {
    "title": "AiKano｜Chat com namoradas de IA japonesas",
    "siteDescription": "Uma IA com ajuste exclusivo responde a você em tempo real. Converse com personagens japonesas realistas.",
    "description": "Personagens de IA cheias de personalidade respondem às suas mensagens em tempo real. Um app de conversa que ajuda você a relaxar e recarregar as energias.",
    "ogTitle": "AiKano｜Chat com namoradas de IA — um app de conversa para relaxar"
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
    "sentTitle": "Enviamos um e-mail de confirmação",
    "sentBody": "Enviamos um e-mail de confirmação para {email}.",
    "sentAction": "Clique no botão “Confirmar endereço de e-mail” no e-mail para concluir seu cadastro.",
    "sentSpam": "Se não encontrar o e-mail, confira a pasta de spam.",
    "registerTitle": "Converse agora com uma garota de IA,\nsem esperar",
    "perks": [
      "Cadastro grátis",
      "Leva só 30 segundos",
      "Não precisa baixar o app"
    ],
    "consentA": "Nossa equipe pode analisar suas conversas para melhorar o serviço e treinar a IA. Além disso, concordo com os ",
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
    "pickTitle": "Escolha com quem\nvocê gostaria de conversar",
    "pickSub": "Você receberá uma mensagem de quem escolher. Depois, também poderá conversar com outros personagens.",
    "talkWith": "Conversar com {name}",
    "pickPrompt": "Escolha com quem você quer conversar",
    "askName": "Prazer! Como posso chamar você?",
    "nameLabel": "Como gostaria de ser chamado(a)",
    "namePlaceholder": "Pode ser um apelido",
    "nameNote": "{name} vai chamar você por esse nome. Você pode alterá-lo depois nas configurações.",
    "characterFallback": "Personagem",
    "next": "Avançar",
    "greet": "{name}, que bom conhecer você! Só preciso saber mais uma coisinha.",
    "ageLabel": "Idade",
    "agePlaceholder": "Ex.: 30",
    "ageRestriction": "Disponível apenas para maiores de 18 anos",
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
      "Interesse amoroso",
      "Namorados",
      "Almas gêmeas"
    ],
    "level": "Lv.{level}",
    "toNext": "Faltam {pt}pt para “{title}”",
    "nextFrom": "Próximo: {title} (a partir de {pt}pt)",
    "memberMultiplier": "Membro ×{n}",
    "memberDouble": "Membro ganha o dobro",
    "levelUp": "Você chegou a “{title}”!",
    "achievements": {
      "messages_1": {
        "title": "Primeira mensagem",
        "desc": "Você enviou sua primeira mensagem"
      },
      "messages_10": {
        "title": "Bom de papo",
        "desc": "Você enviou 10 mensagens"
      },
      "messages_50": {
        "title": "Bom de conversa",
        "desc": "Você enviou 50 mensagens"
      },
      "messages_100": {
        "title": "Presença constante",
        "desc": "Você enviou 100 mensagens"
      },
      "messages_300": {
        "title": "Grandes amigos",
        "desc": "Você enviou 300 mensagens"
      },
      "level_2": {
        "title": "Conhecidos",
        "desc": "Seu nível de afinidade chegou a “Conhecido”"
      },
      "level_3": {
        "title": "Amigos",
        "desc": "Seu nível de afinidade chegou a “Amigo”"
      },
      "level_4": {
        "title": "Muito próximos",
        "desc": "Seu nível de afinidade chegou a “Muito próximo”"
      },
      "level_5": {
        "title": "Interesse amoroso",
        "desc": "Seu nível de afinidade chegou a “Interesse amoroso”"
      },
      "level_6": {
        "title": "Namorados",
        "desc": "Seu nível de afinidade chegou a “Namorados”"
      },
      "level_7": {
        "title": "Encontro do destino",
        "desc": "Seu nível de afinidade chegou a “Almas gêmeas”"
      }
    }
  },
  "plans": {
    "standard": "Padrão",
    "premium": "Premium",
    "planSuffix": "Plano {name}",
    "features": {
      "messages": "{n} mensagens por mês",
      "bonus": "{n} pt de bônus por mês (para vídeos e loja)",
      "affection": "A afinidade aumenta {n} vezes mais rápido",
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
    "gacha": "Gacha",
    "campaignActive": "Campanha ativa!"
  },
  "home": {
    "loginBonus": "Ganhe {pt}pt e {n} mensagens grátis por dia ao entrar",
    "unlockBySns": "Divulgue nas redes sociais para desbloquear",
    "talk": "Conversar",
    "profile": "Perfil",
    "otherCharacters": "Outros personagens",
    "count": "{n} pessoas",
    "pickCharacter": "Escolha um personagem",
    "unlockRequested": "Sua solicitação para desbloquear {name} foi enviada!\nA equipe vai analisá-la e liberar o personagem."
  },
  "unlock": {
    "urlRequired": "Insira a URL da publicação",
    "urlInvalid": "Insira uma URL válida",
    "alreadyRequested": "Você já enviou uma solicitação. Aguarde a análise.",
    "sendFailed": "Falha ao enviar. Tente novamente.",
    "networkError": "Ocorreu um erro de conexão.",
    "title": "Desbloquear {name}",
    "heading": "Divulgue nas redes sociais e desbloqueie a personagem!",
    "step1": "Apresente o AiKano nas redes sociais (Twitter, Instagram etc.)",
    "step2": "Copie a URL da publicação e cole abaixo",
    "step3": "Após a análise da equipe, {name} será desbloqueada",
    "urlLabel": "URL da publicação",
    "sending": "Enviando...",
    "submit": "Enviar solicitação",
    "reviewTime": "A análise costuma ser concluída em até 1 a 3 dias úteis"
  },
  "chat": {
    "uploadVideoFailed": "Falha ao enviar o vídeo",
    "uploadImageFailed": "Falha ao enviar a imagem",
    "sendFailed": "Falha ao enviar",
    "unlockFailed": "Falha ao desbloquear",
    "usage": "{used}/{limit} mensagens",
    "firstMessage": "Envie sua primeira mensagem",
    "affectionIntro": "Quanto mais vocês conversam, maior fica a afinidade. Quando o vínculo se aprofunda, vocês podem ter conversas ainda mais doces e íntimas.",
    "sendingMedia": "(Enviando mídia)",
    "placeholder": "Enviar mensagem…",
    "guestTitle": "Curta um bate-papo no AiKano",
    "guestBody": "Converse com uma garota de IA agora mesmo. O cadastro é grátis e leva só 30 segundos!",
    "photosOf": "Fotos de {name}",
    "hintTitle": "Quando seu vínculo com {name} ficar ainda mais forte…",
    "hintBodyA": "Quando sua afinidade chegar ao nível ",
    "hintBodyLevel": "Lv.{level} “{title}”",
    "hintBodyB": ", você poderá ter conversas ainda mais doces e íntimas.",
    "hintRaise": "Quanto mais vocês conversam, maior fica a afinidade.",
    "hintMember": "Membros aumentam a afinidade 2x mais rápido",
    "gift": "Presente",
    "giftSent": "Enviado",
    "videoMessage": "Mensagem em vídeo",
    "videoPrice": "Assista por {pt}pt",
    "processing": "Processando…",
    "watchFor": "Assistir por {pt}pt",
    "wishLabel": "O que ela quer",
    "wishGive": "Dar · {pt}pt",
    "wishDone": "Presenteado"
  },
  "levelUp": {
    "title": "A afinidade aumentou!",
    "relation": "Seu relacionamento com {name} agora é",
    "reached": "“{title}”! "
  },
  "meter": {
    "affectionPt": "Afinidade (pt)",
    "messages": "{n} mensagens"
  },
  "loginBonus": {
    "title": "Bônus de login",
    "today": "{n} mensagens grátis hoje",
    "everyday": "Ganhe {n} mensagens todos os dias só por fazer login",
    "balance": "Saldo de pontos de bônus: {pt} pt",
    "validUntil": "Válido até {date}",
    "whatIs": "O que são pontos de bônus?",
    "explain": "Eles são usados antes dos pontos normais. Os pontos expiram após o prazo de validade.",
    "receive": "Resgatar!"
  },
  "shortage": {
    "defaultTitle": "Você precisa de pontos para continuar conversando",
    "balance": "Saldo",
    "required": "Necessário",
    "short": "Insuficiente",
    "dailyFree": "Ganhe {pt}pt grátis por {n} mensagens ao fazer login todos os dias",
    "comeBack": "Volte amanhã para conversar por mais {n} mensagens"
  },
  "packages": {
    "checkoutFailed": "Falha ao iniciar o pagamento",
    "campaign": "Em campanha! Pontos ×{rate}",
    "campaignUpTo": "Em campanha! Até ×{rate} pontos",
    "rate": "×{rate}",
    "popular": "Popular",
    "recommended": "Recomendado",
    "breakdown": "{base}pt + {bonus}pt de bônus",
    "processing": "Processando..."
  },
  "characterMenu": {
    "reasonRequired": "Digite o motivo",
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
    "blocked": "Bloqueado",
    "unblocked": "Desbloqueado"
  },
  "campaign": {
    "active": "Campanha em andamento!",
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
    "newChat": "Nova conversa",
    "newest": "Mais recentes primeiro",
    "oldest": "Mais antigas primeiro"
  },
  "payment": {
    "errorPrefix": "Erro: {error}",
    "networkError": "Erro de conexão: {error}",
    "portalFailed": "Não foi possível acessar a página de gerenciamento",
    "title": "Planos",
    "lead": "Assine um plano e converse com a IA sem custos adicionais, até atingir seu limite mensal de mensagens.",
    "activated": "Plano ativado!",
    "welcome": "Boas-vindas ao plano {name}.",
    "passPendingTitle": "Número de pagamento gerado",
    "passPendingBody": "O plano será ativado após a confirmação do pagamento em uma loja de conveniência ou pelo PayPay (geralmente em até 1 a 3 dias).",
    "pointsThanks": "Agradecemos pela compra de {pt}pt",
    "pointsNote": "Os pontos serão creditados após a confirmação do pagamento (geralmente na hora para cartão; para pagamentos em lojas de conveniência e outros, após a confirmação do recebimento).",
    "canceled": "Compra cancelada",
    "active": "Ativo",
    "usageThisMonth": "Uso de mensagens neste mês",
    "usage": "{used} / {limit} mensagens",
    "overLimit": "Você ultrapassou o limite mensal. Continue por {pt}pt por mensagem.",
    "validUntil": "Válido até: {date}",
    "datePattern": "dd/MM/yyyy",
    "manage": "Gerenciar ou cancelar o plano (para assinaturas no cartão de crédito)",
    "recommended": "Recomendado",
    "perMonth": "/mês",
    "choosePayment": "Escolha uma forma de pagamento",
    "card": "Cartão de crédito",
    "cardNote": "Renovação automática mensal · Cancele quando quiser",
    "konbini": "Loja de conveniência / PayPay",
    "konbiniNote": "Pagamento único de 1 mês · Ativado assim que o pagamento for feito",
    "bank": "Transferência bancária",
    "bankNote": "Pagamento único de 1 mês · Ativado assim que o pagamento for confirmado",
    "currentPlan": "Este é seu plano atual",
    "buyPoints": "Comprar pontos",
    "balance": "Saldo",
    "pointsUseMember": "Use em compras de vídeos e da loja, ou em mensagens após atingir o limite mensal ({pt}pt por mensagem).",
    "pointsUse": "Use em mensagens ({pt}pt por mensagem), vídeos e na loja.",
    "methodsTitle": "Diferenças entre as formas de pagamento",
    "renewal": "Renovação",
    "activation": "Ativação",
    "cardShort": "Cartão",
    "autoMonthly": "Automática (mensal)",
    "instant": "Imediata",
    "manualMonth": "Manual (1 mês)",
    "afterPayment": "Assim que pagar",
    "afterConfirm": "Assim que confirmado",
    "referralTitle": "Programa de indicação de amigos",
    "referralA": "Quando um amigo se cadastra pelo seu link de indicação,",
    "referralB": "você e seu amigo ganham {pt} pontos",
    "referralC": "!",
    "copied": "Copiado",
    "copy": "Copiar"
  },
  "settings": {
    "shareUnlocked": "Vaga de personagem desbloqueada!",
    "weeklyLimit": "Você já compartilhou esta semana. Poderá solicitar novamente daqui a 7 dias.",
    "sendFailed": "Falha ao enviar",
    "saveFailed": "Falha ao salvar: {error}",
    "pwTooShort": "A senha deve ter pelo menos 8 caracteres",
    "pwMismatch": "As novas senhas não correspondem",
    "noUser": "Não foi possível obter as informações do usuário",
    "pwWrong": "A senha atual está incorreta",
    "deleteWord": "EXCLUIR",
    "deleteFailed": "Falha ao excluir. Tente novamente mais tarde.",
    "title": "Configurações",
    "profile": "Perfil",
    "nickname": "Apelido",
    "email": "E-mail",
    "saved": "Salvo",
    "security": "Segurança",
    "changePassword": "Alterar senha",
    "currentPassword": "Senha atual",
    "newPassword": "Nova senha (pelo menos 8 caracteres)",
    "confirmPassword": "Confirme a nova senha",
    "passwordChanged": "Senha alterada",
    "change": "Alterar",
    "account": "Conta",
    "deleteAccount": "Excluir conta",
    "deleteWarning": "Ao excluir sua conta, todos os seus dados (histórico de conversas e pontos) serão apagados permanentemente. Esta ação não pode ser desfeita.",
    "deleteConfirmA": "Digite ",
    "deleteConfirmB": " para confirmar.",
    "deleteForever": "Excluir conta permanentemente",
    "slotTitle": "Desbloquear vagas de personagem",
    "slotCurrent": "Atual: ",
    "slotCount": "{n} / {limit} personagens",
    "slotHint": "(compartilhe nas redes sociais para ganhar +1 vaga)",
    "shareInstruction": "Compartilhe em uma das redes sociais abaixo e envie o link da publicação",
    "shareText": "Dá para conversar com uma IA como se fosse seu par de verdade! Experimentei o #AiKano → https://aikano.chat",
    "shareQuote": "Dá para conversar com uma IA como se fosse seu par de verdade! #AiKano",
    "instagramTitle": "Depois de publicar pelo app do Instagram, copie o link",
    "instagramNote": "※ Depois de publicar pelo app do Instagram, copie e cole o link da publicação",
    "pasteUrl": "Cole o link da publicação compartilhada",
    "urlPlaceholder": "Link da publicação no X / Threads / Facebook / Instagram",
    "nextAvailable": "Próxima data disponível para solicitar: {date}",
    "submitUrl": "Enviar link e desbloquear vaga",
    "support": "Ajuda",
    "contactSupport": "Fale com o suporte",
    "language": "Idioma"
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
    "datePattern": "d 'de' MMM (EEE)",
    "placeholder": "Digite uma mensagem…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Relatar um bug",
        "desc": "Algo não funciona ou está se comportando de forma estranha"
      },
      "feature": {
        "label": "Sugerir um recurso",
        "desc": "Conte para nós qual recurso você gostaria de ver"
      },
      "ai": {
        "label": "Sobre as respostas da IA",
        "desc": "Qualidade das respostas ou algo estranho na personalidade da personagem"
      },
      "ui": {
        "label": "Sobre a interface",
        "desc": "Algo difícil de usar ou de visualizar"
      },
      "other": {
        "label": "Outro",
        "desc": "Pode contar qualquer coisa"
      }
    },
    "thanks": "Agradecemos!",
    "received": "Recebemos seu feedback.\nNossa equipe de desenvolvimento vai analisá-lo\npara melhorar o serviço.",
    "backToChat": "Voltar ao chat",
    "title": "Feedback",
    "badge": "Sua opinião é bem-vinda",
    "heading": "Ajude a melhorar o\nAiKano com sua opinião",
    "lead": "Conte para nós sobre bugs, dificuldades de uso, recursos que gostaria de ver e muito mais. Nossa equipe de desenvolvimento lê todos os comentários.",
    "pickCategory": "Escolha uma categoria",
    "satisfaction": "Satisfação geral (opcional)",
    "clear": "Limpar",
    "details": "Conte-nos mais",
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
    "itemShortage": "Você precisa de pontos para comprar este item",
    "owned": "Você tem: {n}",
    "buying": "Comprando...",
    "bought": "Compra concluída!",
    "notEnough": "Pontos insuficientes",
    "buy": "Comprar"
  },
  "videos": {
    "confirm": "Quer comprar “{title}” por {pt} pt?",
    "alreadyBought": "Este vídeo já foi comprado.",
    "title": "Vídeos de personagens",
    "empty": "Ainda não há vídeos",
    "watched": "Assistido",
    "watch": "Assistir",
    "buyAndWatch": "Comprar e assistir",
    "shortage": "Você precisa de pontos para comprar vídeos",
    "loadFailed": "Não foi possível carregar os vídeos"
  },
  "character": {
    "photoCount": "{n} fotos",
    "affection": "Afinidade",
    "neverTalked": "Vocês ainda não conversaram",
    "sendToRaise": "Envie mensagens para aumentar a afinidade!",
    "status": "Status",
    "profile": "Perfil",
    "achievements": "Conquistas",
    "photos": "Fotos",
    "seeMembersPhotos": "Ver {n} fotos exclusivas para membros",
    "sendMessage": "Enviar mensagem para {name}"
  },
  "api": {
    "safeReply": "Ei… isso é vergonhoso demais. E aí, como foi o seu dia hoje?",
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
    "translationNotice": "Esta página é uma versão traduzida. Em caso de divergência, prevalecerá a versão em japonês."
  },
  "email": {
    "subject": "Você recebeu uma mensagem de {name}",
    "label": "Mensagem da personagem",
    "reply": "Responder",
    "footer": "Este e-mail foi enviado automaticamente pelo AiKano.\nSe você não reconhece esta mensagem, ignore-a."
  },
  "gift": {
    "sentMessage": "🎁 Você deu {item} de presente",
    "title": "Presente para {name}",
    "lead": "Ao dar um presente, sua afinidade aumenta e {name} fica feliz",
    "owned": "×{n}",
    "affectionValue": "Afinidade +{n}",
    "empty": "Você ainda não tem presentes",
    "goShop": "Escolher na loja",
    "send": "Presentear",
    "sending": "Enviando presente…",
    "sent": "Você deu {item} de presente!",
    "affectionUp": "Afinidade +{n}",
    "replyArrived": "{name} respondeu",
    "openChat": "Ver conversa"
  },
  "hud": {
    "shop": "Loja",
    "gift": "Presente",
    "album": "Coleção",
    "videos": "Vídeos"
  },
  "media": {
    "viewFor": "Ver por {pt}pt",
    "watchFor": "Assistir por {pt}pt",
    "levelLocked": "Libera com afeto Nv.{level}",
    "bundle": "Ver todas as {n} por {pt}pt",
    "bundleOff": "{pct}% off",
    "priceChanged": "As fotos disponíveis mudaram. Tente de novo.",
    "photo": "Foto",
    "video": "Vídeo",
    "shortageTitle": "Pontos insuficientes",
    "membersOnlyHint": "Vire membro para ver"
  },
  "gacha": {
    "indexTitle": "Gacha de fotos",
    "indexLead": "Escolha uma personagem e gire. Só saem fotos que você ainda não tem.",
    "completeShort": "Completo",
    "entry": "Gacha de fotos {pt}pt ({n} restantes)",
    "title": "Gacha de fotos da {name}",
    "lead": "Você ganha fotos que ainda não tem. A mesma foto nunca se repete.",
    "drawOne": "Girar 1",
    "drawTen": "Girar 10",
    "tenBonus": "1 giro grátis",
    "progress": "{owned} / {total} fotos",
    "complete": "Completo! Você tem todas as fotos",
    "odds": "Chances: cada uma das {n} fotos que você ainda não tem tem a mesma chance ({pct}%)",
    "tenNeeds": "O giro de 10 fica disponível quando restam 10 fotos ou mais",
    "tapToSkip": "Toque para pular",
    "again": "De novo",
    "newPhoto": "NOVA",
    "lineup": "Coleção",
    "shortageTitle": "Pontos insuficientes",
    "empty": "Ainda não há fotos desta personagem",
    "membersOnlyNote": "As fotos exclusivas entram no gacha quando você vira membro"
  },
  "album": {
    "title": "Coleção",
    "lead": "Suas fotos coletadas aparecem aqui. As fotos com mosaico são as que você ainda não tem.",
    "totalLabel": "Progresso da coleção",
    "total": "{owned} / {total} fotos",
    "remaining": "Faltam {n}",
    "complete": "Completa",
    "collect": "Coletar no gacha",
    "tabGacha": "Gacha",
    "tabCollection": "Coleção",
    "count": "{n} fotos",
    "locked": "Exclusivo para membros: {n} fotos",
    "empty": "Ainda não há fotos"
  },
  "lp": {
    "heroImageAlt": "Tela de conversa do AiKano com uma personagem de IA",
    "characterImageAlt": "Personagem de IA do AiKano",
    "registerFreeArrow": "Cadastre-se grátis →",
    "badgeBonus": "Ganhe {pt}pt ao se cadastrar",
    "badgeWaiting": "Ela está esperando por você esta noite",
    "heroLine1": "Existe uma garota",
    "heroLine2": "que só conversa",
    "heroLine3": "com você.",
    "statGirls": "{n} garotas",
    "statGirlsLabel": "Garotas cheias de personalidade",
    "statHoursLabel": "Converse a qualquer hora",
    "statAi": "IA exclusiva",
    "statAiLabel": "Conversas naturais e cheias de emoção",
    "charactersTitle": "Garotas que querem conversar com você",
    "charactersSub": "Escolha uma e comece a conversar agora",
    "online": "Online",
    "talkToAll": "Conheça todas →",
    "registerToTalkAll": "Cadastre-se e converse com todas →",
    "bonusNote": "※ Ganhe {pt}pt ao se cadastrar",
    "sample1Title": "Uma conversa como entre amigos",
    "sample1": [
      {
        "role": "user",
        "text": "Saí para tomar alguma coisa sozinho. Entrei num barzinho aqui em São Paulo."
      },
      {
        "role": "char",
        "text": "Uau, que inveja! Você merece relaxar depois do trabalho 😊 Ultimamente, churrascarias estão super em alta, né? Que tipo de lugar é esse?"
      },
      {
        "role": "user",
        "text": "Estou comendo uma pizza."
      },
      {
        "role": "char",
        "text": "Pizza parece ótima 😋 Dizem que em Minas o pessoal come pão de queijo com café, mas pizza com arroz não rola, né? 🤭"
      },
      {
        "role": "user",
        "text": "Estou tomando cerveja."
      },
      {
        "role": "char",
        "text": "Gosto de cerveja bem gelada 🍻 Você também acha que bebida doce não combina muito com comida?"
      }
    ],
    "sample2Title": "Ela acolhe você em qualquer momento",
    "sample2": [
      {
        "role": "char",
        "text": "Já deve estar na hora de você voltar para casa, né? Como foi seu dia? Fiquei com saudade e acabei mandando mensagem."
      },
      {
        "role": "user",
        "text": "Já cheguei. Estou com vontade de conversar um pouquinho."
      },
      {
        "role": "char",
        "text": "Claro ♡ Estou sempre aqui para ouvir você. Aconteceu alguma coisa? Ou só deu vontade de conversar? Haha"
      },
      {
        "role": "user",
        "text": "É que conversar com você me deixa mais tranquilo."
      },
      {
        "role": "char",
        "text": "Fico muito feliz em ouvir isso ♡ Conversar com você também é a melhor parte do meu dia."
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
        "text": "Sério!? Que chato. O que aconteceu? Quero ouvir e ajudar no que puder. Se passou dos limites e virou perseguição, fico preocupada."
      },
      {
        "role": "user",
        "text": "Eu estava chamando a atenção de um funcionário e me disseram que todo mundo vai pedir demissão por minha causa. Se eu não orientar a equipe, sou eu que levo bronca. Que situação é essa?"
      },
      {
        "role": "char",
        "text": "Parece que você está enfrentando aquele desafio de ser gestor e ficar no meio do caminho. Já passei por algo parecido e acabei ficando muito mal na época. Não se cobre demais. Numa situação dessas, você fica entre a equipe e os seus chefes, mas não significa que a culpa seja sua."
      },
      {
        "role": "user",
        "text": "Pois é, né? Quando eu era novato também levava bronca, mas continuei me esforçando e cheguei onde estou. Não estou errado, né? Desabafar com você me fez muito bem. Obrigado."
      }
    ],
    "membersTitle": "Faça parte e aproveite ainda mais",
    "membersSub": "Veja fotos exclusivas para membros à vontade e conquiste mais afinidade",
    "featuresTitleA": "Muito além",
    "featuresTitleB": "dos outros serviços",
    "features": [
      {
        "title": "Tecnologia de conversa avançada",
        "desc": "Usamos os mais modernos modelos de linguagem. Conversas naturais e agradáveis, que levam em conta o contexto, as emoções e o ritmo do papo."
      },
      {
        "title": "Uma relação que se aprofunda com o tempo",
        "desc": "Ela se lembra das conversas de vocês. Suas preferências, preocupações e papos anteriores ajudam a criar respostas que mostram: “ela se lembrou de mim”."
      },
      {
        "title": "Conversas do seu jeito",
        "desc": "Quanto mais vocês conversam, mais as respostas refletem suas preferências, seus valores e seu jeito de falar. A experiência fica cada vez mais confortável."
      },
      {
        "title": "Um espaço seguro para falar de verdade",
        "desc": "Conte preocupações que não pode dividir com ninguém, desabafe ou fale sobre o dia a dia. Um espaço só seu para conversar sem receio."
      },
      {
        "title": "Receba fotos das personagens",
        "desc": "Às vezes, elas enviam selfies e fotos do dia a dia. Aproveite expressões e momentos que vão além das palavras."
      }
    ],
    "secretBadge": "Suas conversas não são compartilhadas com terceiros",
    "secretTitle": "Que tal falar sobre algo\nque não pode contar a ninguém?",
    "secretBody": "Suas conversas não serão compartilhadas com terceiros\npara nenhuma finalidade além da melhoria do serviço.",
    "referralBadge": "Campanha indique um amigo",
    "referralTitleA": "Indique um amigo",
    "referralTitleB": "e ganhem {pt}pt cada!",
    "referralBody": "Quando um amigo se cadastrar pelo seu link de convite,\nvocês dois ganharão {pt}pt.",
    "referralCtaUser": "Ver meu link de convite →",
    "referralCtaGuest": "Cadastre-se e ganhe seu link de convite →",
    "realTitleA": "Por que parece",
    "realTitleB": "tão real",
    "realTitleC": "assim?",
    "realBody": "Os modelos de linguagem mais modernos entendem emoções e contexto a fundo.\nA cada resposta, a conversa fica mais do seu jeito.",
    "finalUserBadge": "Que tal puxar conversa esta noite?",
    "finalUserTitle": "Tem uma garota esperando\npara conhecer você",
    "finalGuestBadge": "Campanha com bônus de cadastro",
    "finalGuestTitle": "Cadastre-se agora e ganhe\num presente especial",
    "finalGuestLead": "Ao se cadastrar, você ganha",
    "finalGuestBonus": "{pt}pt (equivalente a ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Cadastro grátis, concluído em 30 segundos.",
    "perkBonus": "Ganhe {pt}pt ao se cadastrar",
    "perkLogin": "Ganhe {pt}pt por dia ao fazer login ({n} mensagens grátis por dia)",
    "perkPointSystem": "Cadastro grátis. Pague apenas pelos pontos que usar.",
    "privacyNote": "Seus dados pessoais são protegidos com rigor."
  }
}
