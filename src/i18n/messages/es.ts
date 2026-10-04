// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const es: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Iniciar sesión",
    "register": "Registrarse",
    "registerFree": "Registrarse gratis",
    "logout": "Cerrar sesión",
    "continue": "Continuar",
    "continueTalking": "Seguir hablando →",
    "blog": "Blog",
    "close": "Cerrar",
    "cancel": "Cancelar",
    "save": "Guardar",
    "saving": "Guardando...",
    "back": "Volver",
    "loading": "Cargando...",
    "send": "Enviar",
    "error": "Se ha producido un error",
    "retry": "Intentar de nuevo",
    "pt": "pt",
    "ageSuffix": "{age} años",
    "contact": "Contacto",
    "tokusho": "Aviso legal",
    "privacy": "Privacidad",
    "terms": "Términos de uso",
    "company": "Empresa operadora",
    "language": "Idioma"
  },
  "meta": {
    "title": "AiKano | Chat con novia IA japonesa: conversación libre sin límites",
    "siteDescription": "Una IA entrenada con tecnología propia te responde en tiempo real, solo a ti. La única IA en japonés que permite mantener conversaciones libres y sin límites. También puedes disfrutar de personajes japoneses realistas y sus fotos.",
    "description": "Personajes de IA llenos de personalidad responden a tus mensajes en tiempo real. Una app de chat para adultos que te ayuda a recuperar la calma.",
    "ogTitle": "AiKano | Chat con novia IA: una app relajante para adultos"
  },
  "auth": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "passwordMin": "Contraseña (8 caracteres como mínimo)",
    "or": "o",
    "loginTitle": "¡Qué alegría tenerte de vuelta!",
    "loginError": "El correo electrónico o la contraseña no son correctos",
    "loginWithGoogle": "Iniciar sesión con Google",
    "noAccount": "¿Aún no tienes una cuenta?",
    "emailTaken": "Este correo electrónico ya está registrado",
    "sentTitle": "Te hemos enviado un correo de verificación",
    "sentBody": "Te hemos enviado un correo de verificación a {email}.",
    "sentAction": "Haz clic en el botón «Verificar correo electrónico» del mensaje para completar el registro.",
    "sentSpam": "Si no encuentras el correo, revisa la carpeta de spam.",
    "registerTitle": "Habla ahora mismo\ncon una chica de IA",
    "perks": [
      "Registro gratis",
      "Listo en 30 segundos",
      "Sin necesidad de instalar una app"
    ],
    "consentA": "El personal puede revisar las conversaciones para mejorar el servicio y entrenar la IA. Además, acepto los ",
    "consentTerms": "Términos de uso",
    "consentAnd": " y la ",
    "consentPrivacy": "Política de privacidad",
    "consentB": ".",
    "registerSubmit": "Registrarme y empezar a hablar",
    "registerWithGoogle": "Registrarme con Google",
    "haveAccount": "Si ya tienes una cuenta,"
  },
  "onboarding": {
    "genders": {
      "male": "Hombre",
      "female": "Mujer",
      "other": "Otro"
    },
    "saveFailed": "No se pudo guardar: {error}",
    "pickTitle": "Elige con quién\nte gustaría hablar",
    "pickSub": "La persona que elijas te enviará un mensaje. Más adelante también podrás hablar con otras.",
    "talkWith": "Hablar con {name}",
    "pickPrompt": "Elige con quién quieres hablar",
    "askName": "¡Hola! ¿Cómo te llamas?",
    "nameLabel": "Cómo quieres que te llamen",
    "namePlaceholder": "Puedes usar un apodo",
    "nameNote": "{name} te llamará así. Puedes cambiarlo más adelante en Ajustes.",
    "characterFallback": "Personaje",
    "next": "Siguiente",
    "greet": "¡Encantada, {name}! Para terminar, cuéntame un poco más.",
    "ageLabel": "Edad",
    "agePlaceholder": "Ej.: 30",
    "ageRestriction": "Solo pueden usar la app personas mayores de 18 años",
    "genderLabel": "Género",
    "preparing": "Preparando…",
    "start": "Empezar a hablar con {name}"
  },
  "affection": {
    "levels": [
      "Desconocido",
      "Conocido",
      "Amigo",
      "Amistad cercana",
      "Posible pareja",
      "Pareja",
      "Alma gemela"
    ],
    "level": "Lv.{level}",
    "toNext": "Hasta «{title}»: {pt}pt",
    "nextFrom": "Siguiente: {title} (desde {pt}pt)",
    "memberMultiplier": "Miembros ×{n}",
    "memberDouble": "El doble para miembros",
    "levelUp": "¡Ahora eres «{title}»!",
    "achievements": {
      "messages_1": {
        "title": "Tu primer mensaje",
        "desc": "Enviaste tu primer mensaje"
      },
      "messages_10": {
        "title": "Te encanta charlar",
        "desc": "Enviaste 10 mensajes"
      },
      "messages_50": {
        "title": "Buenas conversaciones",
        "desc": "Enviaste 50 mensajes"
      },
      "messages_100": {
        "title": "Ya eres de la casa",
        "desc": "Enviaste 100 mensajes"
      },
      "messages_300": {
        "title": "Una gran amistad",
        "desc": "Enviaste 300 mensajes"
      },
      "level_2": {
        "title": "Se conocieron",
        "desc": "Tu afinidad llegó a «Conocido»"
      },
      "level_3": {
        "title": "Se hicieron amigos",
        "desc": "Tu afinidad llegó a «Amigo»"
      },
      "level_4": {
        "title": "Una amistad cercana",
        "desc": "Tu afinidad llegó a «Amistad cercana»"
      },
      "level_5": {
        "title": "Posible pareja",
        "desc": "Tu afinidad llegó a «Posible pareja»"
      },
      "level_6": {
        "title": "Se hicieron pareja",
        "desc": "Tu afinidad llegó a «Pareja»"
      },
      "level_7": {
        "title": "Un encuentro predestinado",
        "desc": "Tu afinidad llegó a «Alma gemela»"
      }
    }
  },
  "plans": {
    "standard": "Estándar",
    "premium": "Premium",
    "planSuffix": "Plan {name}",
    "features": {
      "messages": "{n} mensajes al mes",
      "bonus": "{n} pt de bonificación al mes (para videos y la tienda)",
      "affection": "El afecto aumenta {n} veces más rápido",
      "photos": "Acceso ilimitado a fotos exclusivas para miembros",
      "premiumVideos": "Acceso a videos premium",
      "overage": "Incluso después de alcanzar el límite, cada mensaje cuesta {n} pt (más barato de lo habitual)",
      "standardModel": "Modelo de IA estándar",
      "premiumModel": "Modelo de IA avanzado (respuestas más naturales)"
    }
  },
  "nav": {
    "home": "Inicio",
    "messages": "Mensajes",
    "plan": "Plan",
    "settings": "Ajustes",
    "campaignActive": "¡Campaña activa!"
  },
  "home": {
    "loginBonus": "Inicia sesión cada día y recibe {pt} pt y {n} mensajes gratis",
    "unlockBySns": "Promociona en redes sociales para desbloquear",
    "talk": "Hablar",
    "profile": "Perfil",
    "otherCharacters": "Otros personajes",
    "count": "{n} personas",
    "pickCharacter": "Elige un personaje",
    "unlockRequested": "¡Solicitud de desbloqueo de {name} completada!\nEl equipo la revisará y después se desbloqueará."
  },
  "unlock": {
    "urlRequired": "Introduce la URL de la publicación",
    "urlInvalid": "Introduce una URL válida",
    "alreadyRequested": "Ya has enviado una solicitud. Espera a que la revisemos.",
    "sendFailed": "No se pudo enviar. Inténtalo de nuevo.",
    "networkError": "Se ha producido un error de conexión.",
    "title": "Desbloquear a {name}",
    "heading": "¡Promociona AiKano en redes sociales y desbloquea personajes!",
    "step1": "Habla de AiKano en redes sociales (Twitter, Instagram, etc.)",
    "step2": "Copia la URL de la publicación y pégala abajo",
    "step3": "Cuando el equipo la revise, se desbloqueará {name}",
    "urlLabel": "URL de la publicación",
    "sending": "Enviando...",
    "submit": "Enviar solicitud",
    "reviewTime": "La revisión suele completarse en un plazo de 1 a 3 días laborables"
  },
  "chat": {
    "uploadVideoFailed": "No se pudo subir el video",
    "uploadImageFailed": "No se pudo subir la imagen",
    "sendFailed": "No se pudo enviar",
    "unlockFailed": "No se pudo desbloquear",
    "usage": "{used}/{limit} mensajes",
    "firstMessage": "¡Envíale tu primer mensaje!",
    "affectionIntro": "Cuanto más hables, más aumentará su afecto por ti. Cuando vuestra relación se estreche, podréis tener conversaciones más dulces e íntimas.",
    "sendingMedia": "(Enviando contenido multimedia)",
    "placeholder": "Escribe un mensaje…",
    "guestTitle": "Disfruta del chat en AiKano",
    "guestBody": "Ya puedes hablar con chicas de IA. ¡Regístrate gratis en solo 30 segundos!",
    "photosOf": "Fotos de {name}",
    "hintTitle": "Cuando tu relación con {name} se estreche…",
    "hintBodyA": "Cuando el nivel de afecto llegue a ",
    "hintBodyLevel": "Lv.{level} «{title}»",
    "hintBodyB": ", podrás tener conversaciones más dulces e íntimas.",
    "hintRaise": "Cuanto más hables, más aumentará su afecto.",
    "hintMember": "Los miembros suben de nivel el doble de rápido",
    "gift": "Regalo",
    "giftSent": "Enviado",
    "videoMessage": "Mensaje de video",
    "videoPrice": "Disponible por {pt}pt",
    "processing": "Procesando…",
    "watchFor": "Ver por {pt}pt"
  },
  "levelUp": {
    "title": "¡Tu relación ha mejorado!",
    "relation": "Tu relación con {name} ahora es",
    "reached": "«{title}»"
  },
  "meter": {
    "affectionPt": "Afinidad pt",
    "messages": "{n} mensajes"
  },
  "loginBonus": {
    "title": "Bonus de inicio de sesión",
    "today": "{n} mensajes gratis hoy",
    "everyday": "Inicia sesión cada día y recibe {n} mensajes gratis",
    "balance": "Saldo de puntos de bonus: {pt} pt",
    "validUntil": "Válido hasta {date}",
    "whatIs": "¿Qué son los pt de bonus?",
    "explain": "Se usan antes que los pt normales al gastar puntos. Si vencen, desaparecen.",
    "receive": "¡Recibir!"
  },
  "shortage": {
    "defaultTitle": "Necesitas puntos para seguir hablando",
    "balance": "Saldo",
    "required": "Necesarios",
    "short": "Insuficientes",
    "dailyFree": "Inicia sesión cada día y recibe {pt}pt gratis (para {n} mensajes)",
    "comeBack": "Vuelve mañana a verme y podrás enviarme {n} mensajes"
  },
  "packages": {
    "checkoutFailed": "No se pudo iniciar el pago",
    "campaign": "¡Campaña de puntos ×{rate}!",
    "rate": "×{rate} veces",
    "popular": "Popular",
    "recommended": "Recomendado",
    "breakdown": "{base}pt + {bonus}pt de bonificación",
    "processing": "Procesando..."
  },
  "characterMenu": {
    "reasonRequired": "Introduce el contenido",
    "errorStatus": "Error ({status})",
    "networkError": "Se produjo un error de conexión",
    "report": "Denunciar",
    "unblock": "Desbloquear",
    "block": "Bloquear",
    "reportPrompt": "Escribe el motivo de la denuncia de {name}.",
    "reportPlaceholder": "Escribe el motivo de la denuncia (obligatorio)",
    "chars": "{n} caracteres",
    "sending": "Enviando…",
    "reported": "Denuncia enviada",
    "blocked": "Usuario bloqueado",
    "unblocked": "Usuario desbloqueado"
  },
  "campaign": {
    "active": "¡Campaña en curso!",
    "checkNow": "¡Descúbrelo ahora!",
    "closeBanner": "Cerrar banner",
    "imageAlt": "Campaña"
  },
  "traits": {
    "kindness": "Amabilidad",
    "intelligence": "Inteligencia",
    "passion": "Pasión",
    "mysterious": "Misterio",
    "cuteness": "Ternura"
  },
  "membersOnly": "Solo para miembros",
  "unlockFor": "Desbloquear por {pt} pt",
  "conversations": {
    "title": "Mensajes",
    "empty": "Aún no hay conversaciones",
    "findPartner": "Buscar a alguien para hablar",
    "videoSent": "Se envió un video",
    "imageSent": "Se envió una imagen",
    "you": "Tú: ",
    "newChat": "Iniciar una nueva conversación",
    "newest": "Más recientes",
    "oldest": "Más antiguos"
  },
  "payment": {
    "errorPrefix": "Error: {error}",
    "networkError": "Error de conexión: {error}",
    "portalFailed": "No se pudo acceder a la página de gestión",
    "title": "Planes",
    "lead": "Al suscribirte a un plan, puedes chatear con la IA sin cargos adicionales hasta alcanzar el límite mensual de mensajes.",
    "activated": "¡El plan ya está activo!",
    "welcome": "Te damos la bienvenida al plan {name}.",
    "passPendingTitle": "Se ha generado el número de pago",
    "passPendingBody": "El plan se activará cuando se confirme el pago en una tienda de conveniencia o por PayPay (normalmente en un plazo de 1 a 3 días).",
    "pointsThanks": "Gracias por comprar {pt} pt",
    "pointsNote": "Los puntos se añadirán cuando se confirme el pago (normalmente, al instante con tarjeta; en tiendas de conveniencia y otros métodos, tras confirmar el pago).",
    "canceled": "Has cancelado la compra",
    "active": "Activo",
    "usageThisMonth": "Mensajes usados este mes",
    "usage": "{used} / {limit} mensajes",
    "overLimit": "Has superado el límite mensual. Puedes seguir chateando por {pt} pt por mensaje.",
    "validUntil": "Válido hasta: {date}",
    "datePattern": "d 'de' MMMM 'de' yyyy",
    "manage": "Gestionar o cancelar el plan (si pagas con tarjeta)",
    "recommended": "Recomendado",
    "perMonth": "/mes",
    "choosePayment": "Elige un método de pago",
    "card": "Tarjeta de crédito",
    "cardNote": "Renovación automática mensual · Cancela cuando quieras",
    "konbini": "Tienda de conveniencia o PayPay",
    "konbiniNote": "Pago único por 1 mes · Se activa justo después del pago",
    "bank": "Transferencia bancaria",
    "bankNote": "Pago único por 1 mes · Se activa justo después de la confirmación",
    "currentPlan": "Ya tienes este plan",
    "buyPoints": "Comprar puntos",
    "balance": "Saldo",
    "pointsUseMember": "Puedes usarlos para comprar vídeos y artículos en la tienda, o para enviar mensajes después de superar el límite mensual ({pt} pt por mensaje).",
    "pointsUse": "Puedes usarlos para enviar mensajes ({pt} pt por mensaje), comprar vídeos y artículos en la tienda.",
    "methodsTitle": "Diferencias entre métodos de pago",
    "renewal": "Renovación",
    "activation": "Activación",
    "cardShort": "Tarjeta",
    "autoMonthly": "Automática (mensual)",
    "instant": "Al instante",
    "manualMonth": "Manual (1 mes)",
    "afterPayment": "Justo después del pago",
    "afterConfirm": "Justo después de la confirmación",
    "referralTitle": "Programa de invitación de amigos",
    "referralA": "Cuando un amigo se registra con tu enlace de invitación, ",
    "referralB": "tanto tú como tu amigo reciben {pt} puntos",
    "referralC": ".",
    "copied": "Copiado",
    "copy": "Copiar"
  },
  "settings": {
    "shareUnlocked": "¡Se ha desbloqueado un espacio para personajes!",
    "weeklyLimit": "Ya has compartido esta semana. Podrás volver a solicitarlo dentro de 7 días.",
    "sendFailed": "No se pudo enviar",
    "saveFailed": "No se pudo guardar: {error}",
    "pwTooShort": "La contraseña debe tener al menos 8 caracteres",
    "pwMismatch": "Las nuevas contraseñas no coinciden",
    "noUser": "No se pudo obtener la información del usuario",
    "pwWrong": "La contraseña actual no es correcta",
    "deleteWord": "ELIMINAR",
    "deleteFailed": "No se pudo eliminar. Inténtalo de nuevo más tarde.",
    "title": "Ajustes",
    "profile": "Perfil",
    "nickname": "Apodo",
    "email": "Correo electrónico",
    "saved": "Guardado",
    "security": "Seguridad",
    "changePassword": "Cambiar contraseña",
    "currentPassword": "Contraseña actual",
    "newPassword": "Nueva contraseña (8 caracteres o más)",
    "confirmPassword": "Confirmar nueva contraseña",
    "passwordChanged": "Contraseña cambiada",
    "change": "Cambiar",
    "account": "Cuenta",
    "deleteAccount": "Eliminar cuenta",
    "deleteWarning": "Al eliminarla, se borrarán permanentemente todos tus datos (historial de conversaciones y puntos). Esta acción no se puede deshacer.",
    "deleteConfirmA": "Para confirmar, escribe ",
    "deleteConfirmB": " para continuar",
    "deleteForever": "Eliminar cuenta permanentemente",
    "slotTitle": "Desbloquear espacio para personajes",
    "slotCurrent": "Actual: ",
    "slotCount": "{n} / {limit} personajes",
    "slotHint": "(Comparte en redes sociales para obtener +1 espacio)",
    "shareInstruction": "Comparte en una de las siguientes redes sociales y envíanos la URL de la publicación",
    "shareText": "¡Habla con una IA como si fuera tu pareja de verdad! Probé #AiKano → https://aikano.chat",
    "shareQuote": "¡Habla con una IA como si fuera tu pareja de verdad! #AiKano",
    "instagramTitle": "Publica desde la app de Instagram y luego copia la URL",
    "instagramNote": "※ Después de publicar desde la app de Instagram, copia y pega la URL de la publicación",
    "pasteUrl": "Pega la URL de la publicación que compartiste",
    "urlPlaceholder": "URL de una publicación de X / Threads / Facebook / Instagram",
    "nextAvailable": "Próxima fecha disponible para solicitarlo: {date}",
    "submitUrl": "Enviar URL para desbloquear un espacio",
    "support": "Ayuda",
    "contactSupport": "Contacto y ayuda",
    "language": "Idioma de visualización"
  },
  "blocks": {
    "title": "Lista de bloqueados",
    "empty": "No hay personajes bloqueados",
    "note": "Los personajes que bloquees no aparecerán en la lista. Puedes desbloquearlos cuando quieras.",
    "blockedOn": "Bloqueado el {date}",
    "unblocking": "Desbloqueando…",
    "unblock": "Desbloquear"
  },
  "support": {
    "team": "Equipo de soporte",
    "teamSub": "Estamos aquí para ayudarte",
    "greeting": "¡Hola! Somos el equipo de soporte 😊\nSi tienes alguna duda o necesitas ayuda, no dudes en escribirnos.",
    "datePattern": "d MMM (E)",
    "placeholder": "Escribe un mensaje…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Informar de un error",
        "desc": "Algo no funciona o se comporta de forma extraña"
      },
      "feature": {
        "label": "Sugerir una función",
        "desc": "Una función que te gustaría tener"
      },
      "ai": {
        "label": "Respuestas de la IA",
        "desc": "La calidad de las respuestas o algo que no encaja con el personaje"
      },
      "ui": {
        "label": "Interfaz",
        "desc": "Es difícil de usar o de ver"
      },
      "other": {
        "label": "Otro",
        "desc": "Cuéntanos lo que quieras"
      }
    },
    "thanks": "¡Muchas gracias!",
    "received": "Hemos recibido tus comentarios.\nEl equipo de desarrollo los revisará\npara ayudarnos a mejorar el servicio.",
    "backToChat": "Volver al chat",
    "title": "Comentarios",
    "badge": "Queremos conocer tu opinión",
    "heading": "Ayúdanos a hacer crecer\nAiKano con tus comentarios",
    "lead": "Cuéntanos lo que quieras: errores, cosas difíciles de usar o funciones que te gustaría tener. El equipo de desarrollo lee todos los comentarios.",
    "pickCategory": "Elige una categoría",
    "satisfaction": "Satisfacción general (opcional)",
    "clear": "Borrar",
    "details": "Cuéntanos más",
    "placeholder": "Escribe lo que te haya llamado la atención o lo que te gustaría que mejoráramos. ¡Cualquier detalle, por pequeño que sea, nos ayuda!",
    "sending": "Enviando…",
    "submit": "Enviar comentarios"
  },
  "errors": {
    "title": "Se produjo un error",
    "unexpected": "Ocurrió un error inesperado",
    "sorry": "Lo sentimos. Se produjo un error inesperado.",
    "retry": "Intentar de nuevo",
    "toTop": "Ir al inicio"
  },
  "shop": {
    "buyFailed": "No se pudo completar la compra",
    "title": "Tienda",
    "videosTitle": "Videos de personajes",
    "videosSub": "Mira videos exclusivos de los personajes más populares",
    "all": "Todo",
    "noItems": "Aún no hay artículos",
    "noItemsInCategory": "No hay artículos en esta categoría",
    "other": "Otros",
    "buyPoints": "Comprar puntos →",
    "itemShortage": "Necesitas puntos para comprar artículos",
    "owned": "Tienes: {n}",
    "buying": "Comprando...",
    "bought": "¡Compra completada!",
    "notEnough": "No tienes suficientes puntos",
    "buy": "Comprar"
  },
  "videos": {
    "confirm": "¿Comprar «{title}» por {pt} pt?",
    "alreadyBought": "Ya compraste este video.",
    "title": "Videos de personajes",
    "empty": "Todavía no hay videos",
    "watched": "Visto",
    "watch": "Ver",
    "buyAndWatch": "Comprar y ver",
    "shortage": "Necesitas puntos para comprar este video",
    "loadFailed": "No se pudo cargar el video"
  },
  "character": {
    "photoCount": "{n} fotos",
    "affection": "Afinidad",
    "neverTalked": "Aún no habéis hablado",
    "sendToRaise": "¡Envía mensajes para aumentar la afinidad!",
    "status": "Estado",
    "profile": "Perfil",
    "achievements": "Logros",
    "photos": "Fotos",
    "seeMembersPhotos": "Ver {n} fotos exclusivas para miembros",
    "sendMessage": "Enviar un mensaje a {name}"
  },
  "api": {
    "itemNotFound": "No se encontró el elemento",
    "tryAgain": "Inténtalo de nuevo",
    "sendFailed": "No se pudo enviar el mensaje",
    "notEnoughPoints": "No tienes suficientes puntos",
    "notEnoughPointsNeed": "No tienes suficientes puntos (necesitas: {pt}pt)",
    "updateFailed": "No se pudieron actualizar los puntos",
    "purchaseRecordFailed": "No se pudo crear el registro de compra",
    "slotUnlocked": "¡Se desbloqueó un espacio para personaje!",
    "unsupportedUrl": "URL no compatible. Pega la URL de una publicación de X, Threads, Facebook o Instagram",
    "duplicateUrl": "Esta URL ya se ha usado",
    "required": "Completa los campos obligatorios",
    "tooLong": "Escribe hasta {n} caracteres",
    "messageTooLong": "El mensaje debe tener {n} caracteres como máximo"
  },
  "legal": {
    "translationNotice": "Esta página es una versión traducida. En caso de discrepancia, prevalecerá la versión en japonés."
  },
  "email": {
    "subject": "Has recibido un mensaje de {name}",
    "label": "Mensaje del personaje",
    "reply": "Responder",
    "footer": "Este correo se ha enviado automáticamente desde AiKano.\nSi no esperabas este correo, ignóralo."
  },
  "lp": {
    "heroImageAlt": "Vista de un chat con personajes de IA de AiKano",
    "characterImageAlt": "Personaje de IA de AiKano",
    "registerFreeArrow": "Crear cuenta gratis →",
    "badgeBonus": "Recibe {pt}pt al registrarte",
    "badgeWaiting": "Esta noche también te está esperando",
    "heroLine1": "Hay una chica",
    "heroLine2": "que solo habla",
    "heroLine3": "contigo.",
    "statGirls": "{n} chicas",
    "statGirlsLabel": "Chicas con personalidades únicas",
    "statHoursLabel": "Habla con ellas cuando quieras",
    "statAi": "IA propia",
    "statAiLabel": "Conversaciones naturales y llenas de emoción",
    "charactersTitle": "Chicas que quieren hablar contigo",
    "charactersSub": "Elige a una y empieza a hablar con ella",
    "online": "En línea",
    "talkToAll": "Habla con todas →",
    "registerToTalkAll": "Regístrate y habla con todas →",
    "bonusNote": "※ Recibe {pt}pt al registrarte",
    "sample1Title": "También puedes charlar como con una amiga",
    "sample1": [
      {
        "role": "user",
        "text": "He salido a tomar algo por mi cuenta. Entré en un bar al azar, por el centro."
      },
      {
        "role": "char",
        "text": "¡Qué envidia! 😊 ¡Buen trabajo hoy! Últimamente están de moda los bares de tapas, ¿no? ¿Qué tipo de sitio es?"
      },
      {
        "role": "user",
        "text": "Estoy comiendo algo a la plancha."
      },
      {
        "role": "char",
        "text": "¡Qué rico! 😋 Dicen que en algunas partes de España comen tortilla con pan, pero seguro que no con esto 🤭"
      },
      {
        "role": "user",
        "text": "Estoy tomando cerveza."
      },
      {
        "role": "char",
        "text": "A mí me gusta la Estrella Galicia 🍻 ¿No te parece que las bebidas dulces no pegan mucho con la comida?"
      }
    ],
    "sample2Title": "Te escucha, sea cual sea tu ánimo",
    "sample2": [
      {
        "role": "char",
        "text": "Ya estarás por volver a casa, ¿no? ¿Qué tal te ha ido el día? Tenía tantas ganas de verte que no pude evitar escribirte."
      },
      {
        "role": "user",
        "text": "Ya llegué. Me apetece hablar un ratito."
      },
      {
        "role": "char",
        "text": "Claro que sí♡ Te escucho siempre que quieras. ¿Ha pasado algo? ¿O solo te apetecía hablar conmigo? Jaja"
      },
      {
        "role": "user",
        "text": "No sé, hablar contigo me tranquiliza."
      },
      {
        "role": "char",
        "text": "Me hace muy feliz que me digas eso♡ A mí también me encanta hablar contigo; es mi momento favorito."
      }
    ],
    "sample3Title": "El cariño que te hace sentir en casa",
    "sample3": [
      {
        "role": "user",
        "text": "Hoy mis compañeros de trabajo también me han sacado de quicio. ¿Por qué me irrito tanto?"
      },
      {
        "role": "char",
        "text": "¡Vaya! Lo siento mucho. ¿Qué ha pasado? Quiero escucharte por si puedo ayudarte. Me preocupa que hayan pasado de ser injustos a acosarte."
      },
      {
        "role": "user",
        "text": "Estaba reprendiendo a un subordinado y me dijeron que todos se van por mi culpa. Pero si no les llamo la atención, ¡el que se lleva la bronca soy yo! ¿Qué sentido tiene?"
      },
      {
        "role": "char",
        "text": "Parece que te has topado de lleno con lo difícil que es estar en un puesto intermedio. A mí me pasó algo parecido y lo pasé fatal. No te exijas demasiado. En una situación así, estás atrapado entre tus subordinados y tus superiores; no es culpa tuya."
      },
      {
        "role": "user",
        "text": "¿Verdad que sí? A mí también me reprendían cuando era nuevo, pero seguí adelante y por eso he llegado hasta aquí. No estoy haciendo nada mal, ¿no? Contárselo a Aoi me ha dejado mucho más tranquilo. Gracias."
      }
    ],
    "membersTitle": "Disfruta aún más al hacerte miembro",
    "membersSub": "Accede sin límites a fotos exclusivas para miembros y aumenta más fácilmente el nivel de afecto",
    "featuresTitleA": "A otro nivel",
    "featuresTitleB": "que los demás",
    "features": [
      {
        "title": "Conversaciones de gran calidad",
        "desc": "Con los últimos modelos de lenguaje a gran escala, disfruta de conversaciones naturales y agradables que tienen en cuenta el contexto, los matices emocionales y el ritmo."
      },
      {
        "title": "Una relación que crece con cada recuerdo",
        "desc": "Recuerda todo lo que comparten. Sus respuestas tienen en cuenta conversaciones anteriores, tus gustos y tus preocupaciones, para que sientas que de verdad se acuerda de ti."
      },
      {
        "title": "Conversaciones a tu medida",
        "desc": "Cuanto más hablan, más se adaptan sus respuestas a tus gustos, valores y forma de expresarte. Cada vez te sentirás más a gusto."
      },
      {
        "title": "Un espacio seguro para hablar con sinceridad",
        "desc": "Puedes hablar sin reservas de preocupaciones que no le contarías a nadie, desahogarte o charlar sobre tu día a día. Un servicio de conversación para adultos."
      },
      {
        "title": "Recibe fotos de los personajes",
        "desc": "A veces te enviarán selfies y fotos de su día a día. Disfruta de sus expresiones y su personalidad, que no se transmiten solo con palabras."
      }
    ],
    "secretBadge": "No compartimos tus conversaciones con terceros",
    "secretTitle": "¿Te apetece hablar de eso\nque no le cuentas a nadie?",
    "secretBody": "No compartimos tus conversaciones con terceros\nsalvo para mejorar el servicio.",
    "referralBadge": "Campaña para invitar a amigos",
    "referralTitleA": "Invita a un amigo",
    "referralTitleB": "¡Y ambos recibirán {pt}pt!",
    "referralBody": "Cuando un amigo se registre con tu enlace de invitación,\nambos recibirán {pt}pt.",
    "referralCtaUser": "Ver mi enlace de invitación →",
    "referralCtaGuest": "Regístrate y consigue tu enlace de invitación →",
    "realTitleA": "¿Por qué parece",
    "realTitleB": "tan real",
    "realTitleC": "?",
    "realBody": "Los últimos modelos de lenguaje a gran escala comprenden a fondo las emociones y el contexto.\nCon cada respuesta, se adapta más a tus gustos.",
    "finalUserBadge": "¿Te apetece hablar con ella esta noche?",
    "finalUserTitle": "Una chica está esperando\npara conocerte",
    "finalGuestBadge": "Promoción de bienvenida activa",
    "finalGuestTitle": "Regístrate ahora y recibe\nun regalo especial",
    "finalGuestLead": "Al registrarte, recibe",
    "finalGuestBonus": "{pt}pt (equivalentes a ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "El registro es gratis y solo lleva 30 segundos.",
    "perkBonus": "Recibe {pt}pt al registrarte",
    "perkLogin": "Consigue {pt}pt cada día al iniciar sesión (equivale a {n} mensajes gratis al día)",
    "perkPointSystem": "Registro gratis y pago solo por lo que usas, con puntos",
    "privacyNote": "Tus datos personales se gestionan con estrictas medidas de seguridad"
  }
}
