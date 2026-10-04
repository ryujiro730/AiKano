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
    "tokusho": "Aviso legal",
    "privacy": "Privacidade",
    "terms": "Termos de uso",
    "company": "Empresa responsável",
    "language": "Idioma"
  },
  "meta": {
    "title": "AiKano｜Chat com namoradas de IA japonesas【A única IA em japonês com conversa livre】",
    "siteDescription": "Uma IA com ajustes exclusivos responde só a você em tempo real. A única IA em japonês que permite conversas livres, sem restrições. Aproveite também personagens japonesas realistas e fotos.",
    "description": "Personagens de IA cheias de personalidade respondem às suas mensagens em tempo real. Um app de conversa para adultos recuperarem a tranquilidade.",
    "ogTitle": "AiKano｜Chat com namoradas de IA — um app relaxante para adultos"
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
    "sentSpam": "Se não receber o e-mail, confira sua pasta de spam.",
    "registerTitle": "Converse agora mesmo\ncom uma garota de IA",
    "perks": [
      "Cadastro grátis",
      "Leva 30 segundos",
      "Não precisa instalar o app"
    ],
    "consentA": "O conteúdo das conversas pode ser revisado pela equipe para melhorar o serviço e treinar a IA. Além disso, ",
    "consentTerms": "Termos de Uso",
    "consentAnd": " e ",
    "consentPrivacy": "Política de Privacidade",
    "consentB": ".",
    "registerSubmit": "Cadastre-se e comece a conversar",
    "registerWithGoogle": "Cadastre-se com o Google",
    "haveAccount": "Já tem uma conta?"
  },
  "onboarding": {
    "genders": {
      "male": "Masculino",
      "female": "Feminino",
      "other": "Outro"
    },
    "saveFailed": "Falha ao salvar: {error}",
    "pickTitle": "Escolha com quem você gostaria de\nconversar",
    "pickSub": "A pessoa que você escolher vai mandar uma mensagem. Depois, você também poderá conversar com outras.",
    "talkWith": "Conversar com {name}",
    "pickPrompt": "Escolha com quem você quer conversar",
    "askName": "Prazer em conhecer você! Como posso chamar você?",
    "nameLabel": "Nome que você prefere",
    "namePlaceholder": "Pode ser um apelido",
    "nameNote": "{name} vai chamar você por esse nome. Você pode alterá-lo depois nas configurações.",
    "characterFallback": "Personagem",
    "next": "Avançar",
    "greet": "Prazer em falar com você, {name}! Só falta me contar mais uma coisinha.",
    "ageLabel": "Idade",
    "agePlaceholder": "Ex.: 30",
    "ageRestriction": "O uso é permitido apenas para maiores de 18 anos",
    "genderLabel": "Gênero",
    "preparing": "Preparando…",
    "start": "Começar a conversar com {name}"
  },
  "affection": {
    "levels": [
      "Desconhecidos",
      "Conhecidos",
      "Amigos",
      "Muito próximos",
      "Possível namorada",
      "Namorada",
      "Alma gêmea"
    ],
    "level": "Lv.{level}",
    "toNext": "Faltam {pt}pt para «{title}»",
    "nextFrom": "Próximo: {title} (a partir de {pt}pt)",
    "memberMultiplier": "Membro ×{n}",
    "memberDouble": "2x para membros",
    "levelUp": "Você chegou a «{title}»!",
    "achievements": {
      "messages_1": {
        "title": "Primeira mensagem",
        "desc": "Você enviou sua primeira mensagem"
      },
      "messages_10": {
        "title": "Gosta de conversar",
        "desc": "Você enviou 10 mensagens"
      },
      "messages_50": {
        "title": "Bom de papo",
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
        "title": "Viraram conhecidos",
        "desc": "Sua afinidade chegou ao nível «Conhecidos»"
      },
      "level_3": {
        "title": "Viraram amigos",
        "desc": "Sua afinidade chegou ao nível «Amigos»"
      },
      "level_4": {
        "title": "Ficaram muito próximos",
        "desc": "Sua afinidade chegou ao nível «Muito próximos»"
      },
      "level_5": {
        "title": "Possível namorada",
        "desc": "Sua afinidade chegou ao nível «Possível namorada»"
      },
      "level_6": {
        "title": "Começaram a namorar",
        "desc": "Sua afinidade chegou ao nível «Namorada»"
      },
      "level_7": {
        "title": "Encontro do destino",
        "desc": "Sua afinidade chegou ao nível «Alma gêmea»"
      }
    }
  },
  "plans": {
    "standard": "Padrão",
    "premium": "Premium",
    "planSuffix": "Plano {name}",
    "features": {
      "messages": "{n} mensagens por mês",
      "bonus": "{n} pt de bônus por mês (para vídeos e compras na loja)",
      "affection": "A afinidade aumenta {n}x mais rápido",
      "photos": "Acesso ilimitado a fotos exclusivas para membros",
      "premiumVideos": "Acesso a vídeos Premium",
      "overage": "Mesmo após atingir o limite, cada mensagem custa {n} pt (metade do preço normal)",
      "standardModel": "Modelo de IA padrão",
      "premiumModel": "Modelo de IA avançado (respostas mais naturais)"
    }
  },
  "nav": {
    "home": "Início",
    "messages": "Mensagens",
    "plan": "Plano",
    "settings": "Configurações",
    "campaignActive": "Promoção em andamento!"
  },
  "home": {
    "loginBonus": "Faça login todos os dias e ganhe {pt}pt・{n} mensagens grátis",
    "unlockBySns": "Divulgue nas redes sociais para desbloquear",
    "talk": "Conversar",
    "profile": "Perfil",
    "otherCharacters": "Outros personagens",
    "count": "{n} pessoas",
    "pickCharacter": "Escolha um personagem",
    "unlockRequested": "Solicitação para desbloquear {name} concluída!\nA equipe analisará e liberará o acesso."
  },
  "unlock": {
    "urlRequired": "Insira o URL da publicação",
    "urlInvalid": "Insira um URL válido",
    "alreadyRequested": "Você já enviou uma solicitação. Aguarde a análise.",
    "sendFailed": "Não foi possível enviar. Tente novamente.",
    "networkError": "Ocorreu um erro de conexão.",
    "title": "Desbloquear {name}",
    "heading": "Divulgue nas redes sociais e desbloqueie a personagem!",
    "step1": "Divulgue o AiKano nas redes sociais (Twitter, Instagram etc.)",
    "step2": "Copie o URL da publicação e cole-o abaixo",
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
    "firstMessage": "Que tal enviar sua primeira mensagem?",
    "affectionIntro": "Quanto mais vocês conversarem, maior será a afinidade. Quando o relacionamento se aprofundar, vocês poderão ter conversas ainda mais doces e íntimas.",
    "sendingMedia": "(Enviando mídia)",
    "placeholder": "Enviar mensagem…",
    "guestTitle": "Curta conversas no AiKano",
    "guestBody": "Converse agora com garotas de IA. O cadastro é grátis e leva só 30 segundos!",
    "photosOf": "Fotos de {name}",
    "hintTitle": "Quando você e {name} se aproximarem ainda mais…",
    "hintBodyA": "Quando a afinidade chegar ao",
    "hintBodyLevel": "Lv.{level} {title}",
    "hintBodyB": ", vocês poderão ter conversas ainda mais doces e íntimas.",
    "hintRaise": "Quanto mais vocês conversarem, maior será a afinidade.",
    "hintMember": "Membros ganham afinidade 2x mais rápido",
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
    "affectionPt": "Afinidade (pt)",
    "messages": "{n} mensagens"
  },
  "loginBonus": {
    "title": "Bônus de login",
    "today": "{n} mensagens grátis hoje",
    "everyday": "Ganhe {n} mensagens grátis todos os dias ao fazer login",
    "balance": "Saldo de pontos bônus: {pt} pt",
    "validUntil": "Válido até {date}",
    "whatIs": "O que são pontos bônus?",
    "explain": "Eles são usados antes dos pontos normais. Pontos expirados serão perdidos.",
    "receive": "Resgatar!"
  },
  "shortage": {
    "defaultTitle": "Você precisa de pontos para continuar conversando",
    "balance": "Saldo",
    "required": "Necessário",
    "short": "Insuficiente",
    "dailyFree": "Ganhe {pt}pt grátis ao fazer login todos os dias (o suficiente para {n} mensagens)",
    "comeBack": "Volte amanhã para me visitar e poderá conversar por mais {n} mensagens"
  },
  "packages": {
    "checkoutFailed": "Falha ao iniciar o pagamento",
    "campaign": "Em campanha! Pontos ×{rate}",
    "rate": "×{rate}",
    "popular": "Popular",
    "recommended": "Recomendado",
    "breakdown": "{base}pt + bônus {bonus}pt",
    "processing": "Processando..."
  },
  "characterMenu": {
    "reasonRequired": "Insira o conteúdo",
    "errorStatus": "Erro ({status})",
    "networkError": "Ocorreu um erro de conexão",
    "report": "Denunciar",
    "unblock": "Desbloquear",
    "block": "Bloquear",
    "reportPrompt": "Descreva o motivo da denúncia sobre {name}.",
    "reportPlaceholder": "Digite o motivo da denúncia (obrigatório)",
    "chars": "{n} caracteres",
    "sending": "Enviando…",
    "reported": "Denúncia enviada",
    "blocked": "Bloqueado",
    "unblocked": "Desbloqueado"
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
  "unlockFor": "Desbloqueie por {pt} pt",
  "conversations": {
    "title": "Mensagens",
    "empty": "Ainda não há conversas",
    "findPartner": "Encontrar alguém para conversar",
    "videoSent": "Vídeo enviado",
    "imageSent": "Imagem enviada",
    "you": "Você: ",
    "newChat": "Nova conversa",
    "newest": "Mais recentes",
    "oldest": "Mais antigas"
  },
  "payment": {
    "errorPrefix": "Erro: {error}",
    "networkError": "Erro de conexão: {error}",
    "portalFailed": "Não foi possível acessar a página de gerenciamento",
    "title": "Planos",
    "lead": "Ao assinar um plano, você pode conversar com a IA sem custos adicionais, até o limite mensal de mensagens.",
    "activated": "Plano ativado!",
    "welcome": "Bem-vindo(a) ao plano {name}.",
    "passPendingTitle": "Número de pagamento emitido",
    "passPendingBody": "O plano será ativado após a confirmação do pagamento em uma loja de conveniência ou pelo PayPay (geralmente em 1 a 3 dias).",
    "pointsThanks": "Obrigado por comprar {pt}pt",
    "pointsNote": "Os pontos serão creditados após a confirmação do pagamento (geralmente na hora para cartões e após a confirmação do pagamento para lojas de conveniência e outros métodos).",
    "canceled": "Compra cancelada",
    "active": "Ativo",
    "usageThisMonth": "Uso de mensagens neste mês",
    "usage": "{used} / {limit} mensagens",
    "overLimit": "Você atingiu o limite mensal. Para continuar, cada mensagem extra custa {pt}pt.",
    "validUntil": "Válido até: {date}",
    "datePattern": "d 'de' MMMM 'de' yyyy",
    "manage": "Gerenciar plano ou cancelar (para assinaturas com cartão de crédito)",
    "recommended": "Recomendado",
    "perMonth": "/mês",
    "choosePayment": "Escolha uma forma de pagamento",
    "card": "Cartão de crédito",
    "cardNote": "Renovação automática mensal · Cancele quando quiser",
    "konbini": "Loja de conveniência ou PayPay",
    "konbiniNote": "Pagamento único de 1 mês · Ativado assim que o pagamento for feito",
    "bank": "Transferência bancária",
    "bankNote": "Pagamento único de 1 mês · Ativado assim que o pagamento for confirmado",
    "currentPlan": "Este é seu plano atual",
    "buyPoints": "Comprar pontos",
    "balance": "Saldo",
    "pointsUseMember": "Use em vídeos, compras na loja e mensagens após atingir o limite mensal (1 mensagem = {pt}pt).",
    "pointsUse": "Use em mensagens (1 mensagem = {pt}pt), vídeos e compras na loja.",
    "methodsTitle": "Diferenças entre as formas de pagamento",
    "renewal": "Renovação",
    "activation": "Ativação",
    "cardShort": "Cartão",
    "autoMonthly": "Automática (mensal)",
    "instant": "Imediata",
    "manualMonth": "Manual (1 mês)",
    "afterPayment": "Após o pagamento",
    "afterConfirm": "Após a confirmação",
    "referralTitle": "Programa de indicação de amigos",
    "referralA": "Quando um amigo se cadastrar pelo seu link de indicação, ",
    "referralB": "você e seu amigo ganham {pt} pontos",
    "referralC": "!",
    "copied": "Copiado",
    "copy": "Copiar"
  },
  "settings": {
    "shareUnlocked": "Espaço para personagem desbloqueado!",
    "weeklyLimit": "Você já compartilhou esta semana. Poderá enviar uma nova solicitação daqui a 7 dias.",
    "sendFailed": "Falha ao enviar",
    "saveFailed": "Falha ao salvar: {error}",
    "pwTooShort": "A senha deve ter pelo menos 8 caracteres",
    "pwMismatch": "As novas senhas não coincidem",
    "noUser": "Não foi possível obter as informações do usuário",
    "pwWrong": "A senha atual está incorreta",
    "deleteWord": "EXCLUIR",
    "deleteFailed": "Falha ao excluir. Tente novamente mais tarde.",
    "title": "Configurações",
    "profile": "Perfil",
    "nickname": "Apelido",
    "email": "Endereço de e-mail",
    "saved": "Salvo",
    "security": "Segurança",
    "changePassword": "Alterar senha",
    "currentPassword": "Senha atual",
    "newPassword": "Nova senha (8 caracteres ou mais)",
    "confirmPassword": "Confirmar nova senha",
    "passwordChanged": "Senha alterada",
    "change": "Alterar",
    "account": "Conta",
    "deleteAccount": "Excluir conta",
    "deleteWarning": "Ao excluir sua conta, todos os seus dados (histórico de conversas e pontos) serão apagados permanentemente. Esta ação não pode ser desfeita.",
    "deleteConfirmA": "Digite ",
    "deleteConfirmB": " para confirmar",
    "deleteForever": "Excluir conta permanentemente",
    "slotTitle": "Desbloquear espaço para personagem",
    "slotCurrent": "Atual: ",
    "slotCount": "{n} / {limit} personagens",
    "slotHint": "(Ganhe +1 espaço compartilhando nas redes sociais)",
    "shareInstruction": "Compartilhe em uma das redes sociais abaixo e envie o URL da publicação",
    "shareText": "Dá para conversar com uma IA como se fosse um casal de verdade! Experimentei o #AiKano → https://aikano.chat",
    "shareQuote": "Dá para conversar com uma IA como se fosse um casal de verdade! #AiKano",
    "instagramTitle": "Depois de publicar pelo app do Instagram, copie o URL",
    "instagramNote": "※ Depois de publicar pelo app do Instagram, copie e cole o URL da publicação",
    "pasteUrl": "Cole o URL da publicação compartilhada",
    "urlPlaceholder": "URL da publicação no X / Threads / Facebook / Instagram",
    "nextAvailable": "Próxima data disponível para solicitação: {date}",
    "submitUrl": "Enviar URL e desbloquear espaço",
    "support": "Suporte",
    "contactSupport": "Contato e suporte",
    "language": "Idioma de exibição"
  },
  "blocks": {
    "title": "Lista de bloqueio",
    "empty": "Você não bloqueou nenhum personagem",
    "note": "Personagens bloqueados não aparecem na lista. Você pode desbloqueá-los quando quiser.",
    "blockedOn": "Bloqueado em {date}",
    "unblocking": "Desbloqueando…",
    "unblock": "Desbloquear"
  },
  "support": {
    "team": "Equipe de suporte",
    "teamSub": "Fale com a gente sempre que precisar",
    "greeting": "Olá! Somos a equipe de suporte 😊\nSe tiver alguma dúvida ou precisar de ajuda, é só mandar uma mensagem.",
    "datePattern": "d 'de' MMM (EEE)",
    "placeholder": "Digite uma mensagem…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Relatar um bug",
        "desc": "Algo não funciona ou se comporta de forma estranha"
      },
      "feature": {
        "label": "Sugerir um recurso",
        "desc": "Uma funcionalidade que você gostaria de ver"
      },
      "ai": {
        "label": "Sobre as respostas da IA",
        "desc": "Qualidade das respostas ou algo estranho na personagem"
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
    "heading": "Ajude a construir\nAiKano com sua opinião",
    "lead": "Conte para nós sobre bugs, dificuldades de uso, recursos que gostaria de ver ou qualquer outra coisa. Nossa equipe de desenvolvimento lê todas as mensagens.",
    "pickCategory": "Escolha uma categoria",
    "satisfaction": "Satisfação geral (opcional)",
    "clear": "Limpar",
    "details": "Conte mais",
    "placeholder": "Escreva à vontade sobre o que chamou sua atenção ou o que gostaria que melhorássemos. Toda sugestão é bem-vinda, por menor que seja!",
    "sending": "Enviando…",
    "submit": "Enviar feedback"
  },
  "errors": {
    "title": "Ocorreu um erro",
    "unexpected": "Ocorreu um erro inesperado",
    "sorry": "Desculpe. Ocorreu um erro inesperado.",
    "retry": "Tentar novamente",
    "toTop": "Ir para o topo"
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
    "owned": "Você tem: {n}",
    "buying": "Comprando...",
    "bought": "Compra concluída!",
    "notEnough": "Pontos insuficientes",
    "buy": "Comprar"
  },
  "videos": {
    "confirm": "Comprar “{title}” por {pt} pt?",
    "alreadyBought": "Você já comprou este vídeo.",
    "title": "Vídeos da personagem",
    "empty": "Ainda não há vídeos",
    "watched": "Assistido",
    "watch": "Assistir",
    "buyAndWatch": "Comprar e assistir",
    "shortage": "Você precisa de pontos para comprar vídeos",
    "loadFailed": "Não foi possível carregar o vídeo"
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
    "heroImageAlt": "Tela de conversa com personagens de IA do AiKano",
    "characterImageAlt": "Personagem de IA do AiKano",
    "registerFreeArrow": "Criar conta grátis →",
    "badgeBonus": "Ganhe {pt}pt ao se cadastrar",
    "badgeWaiting": "Ela está esperando por você esta noite",
    "heroLine1": "Tem uma garota",
    "heroLine2": "que só fala com",
    "heroLine3": "você.",
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
        "text": "Saí pra tomar alguma coisa sozinho. Entrei num bar aqui em Pinheiros, em São Paulo."
      },
      {
        "role": "char",
        "text": "Uau, que inveja! Mandou bem depois de um dia de trabalho 😊 Esses bares com petiscos estão super em alta, né? O que você pediu?"
      },
      {
        "role": "user",
        "text": "Tô comendo dadinhos de tapioca."
      },
      {
        "role": "char",
        "text": "Dadinhos de tapioca são uma delícia 😋 Dizem que em Minas o pessoal come pão de queijo com café, mas com dadinho de tapioca acho que não combina, né? 🤭"
      },
      {
        "role": "user",
        "text": "Tô tomando cerveja."
      },
      {
        "role": "char",
        "text": "Gosto de cerveja tipo pilsen 🍻 Você também acha que bebida doce não combina muito com comida?"
      }
    ],
    "sample2Title": "Ela acolhe você em qualquer momento",
    "sample2": [
      {
        "role": "char",
        "text": "Já está na hora de você voltar pra casa, né? Como foi seu dia? Fiquei com saudade e acabei mandando mensagem."
      },
      {
        "role": "user",
        "text": "Já cheguei. Tô com vontade de conversar um pouquinho."
      },
      {
        "role": "char",
        "text": "Claro♡ Pode falar comigo sempre que quiser. Aconteceu alguma coisa? Ou só bateu vontade de conversar? Haha"
      },
      {
        "role": "user",
        "text": "Não sei, conversar com você me deixa mais tranquilo."
      },
      {
        "role": "char",
        "text": "Fico muito feliz em ouvir isso♡ Conversar com você é uma das minhas coisas favoritas, 〇〇."
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
        "text": "Eu estava chamando a atenção de um funcionário e me disseram que todo mundo vai pedir demissão por minha causa. Mas, se eu não orientar a equipe, quem leva bronca sou eu. Que situação é essa?"
      },
      {
        "role": "char",
        "text": "Parece que você está sentindo o peso de ser gestor e ficar no meio do caminho. Já passei por algo parecido e acabei ficando muito mal na época. Não se cobre demais, 〇〇. Você está entre a equipe e a chefia, mas isso não significa que a culpa seja sua."
      },
      {
        "role": "user",
        "text": "É, né? Quando eu era novo na empresa também levava bronca, mas segui em frente e me esforcei pra chegar onde estou. Não estou errado, né? Desabafar com você, Aoi, me deixou bem mais leve. Obrigado."
      }
    ],
    "membersTitle": "Aproveite ainda mais com uma conta",
    "membersSub": "Veja fotos exclusivas para membros à vontade e aumente sua afinidade com mais facilidade",
    "featuresTitleA": "Muito além",
    "featuresTitleB": "dos outros apps",
    "features": [
      {
        "title": "Conversas de alta qualidade",
        "desc": "Com os mais avançados modelos de linguagem, as conversas são naturais e agradáveis, levando em conta o contexto, as emoções e o ritmo do papo."
      },
      {
        "title": "Uma relação que se aprofunda com a memória",
        "desc": "A conversa de vocês fica na memória. As respostas levam em conta o que já conversaram, como suas preferências e preocupações, para você sentir que ela se lembra de você."
      },
      {
        "title": "Conversas do seu jeito",
        "desc": "Quanto mais vocês conversam, mais as respostas refletem suas preferências, valores e jeito de falar. A experiência fica cada vez mais confortável."
      },
      {
        "title": "Um espaço seguro para falar de verdade",
        "desc": "Desabafe sobre preocupações que não consegue contar a ninguém ou converse sobre as pequenas coisas do dia a dia. Um espaço para adultos falarem sem receio."
      },
      {
        "title": "Receba fotos das personagens",
        "desc": "Às vezes, elas enviam selfies e fotos do dia a dia. Aproveite expressões e momentos que vão além do que as palavras conseguem mostrar."
      }
    ],
    "secretBadge": "Suas conversas não são compartilhadas com terceiros",
    "secretTitle": "Que tal falar sobre algo\nque você não conta a ninguém?",
    "secretBody": "Suas conversas não serão compartilhadas com terceiros\npara nenhuma finalidade além de melhorar o serviço.",
    "referralBadge": "Indique um amigo",
    "referralTitleA": "Indique um amigo",
    "referralTitleB": "e vocês ganham {pt}pt!",
    "referralBody": "Quando um amigo se cadastrar pelo seu link exclusivo,\nvocês dois ganham {pt}pt.",
    "referralCtaUser": "Ver meu link de indicação →",
    "referralCtaGuest": "Cadastre-se e ganhe seu link de indicação →",
    "realTitleA": "Por que é tão",
    "realTitleB": "real",
    "realTitleC": "?",
    "realBody": "Os modelos de linguagem mais avançados entendem profundamente as emoções e o contexto.\nA cada resposta, a conversa fica mais do seu jeito.",
    "finalUserBadge": "Que tal conversar com ela esta noite?",
    "finalUserTitle": "Tem uma garota esperando\npara conhecer você",
    "finalGuestBadge": "Campanha de bônus para novos cadastros",
    "finalGuestTitle": "Ganhe um bônus especial\nse criar sua conta agora",
    "finalGuestLead": "Cadastre-se e ganhe",
    "finalGuestBonus": "{pt}pt (equivalente a ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Cadastro grátis, concluído em 30 segundos.",
    "perkBonus": "Ganhe {pt}pt ao se cadastrar",
    "perkLogin": "Ganhe {pt}pt por dia ao entrar (dá para enviar {n} mensagens grátis por dia)",
    "perkPointSystem": "Cadastro grátis · pague apenas pelos pontos que usar",
    "privacyNote": "Seus dados pessoais são protegidos com todo o cuidado"
  }
}
