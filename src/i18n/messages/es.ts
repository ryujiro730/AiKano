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
    "terms": "Términos del servicio",
    "company": "Empresa operadora",
    "language": "Idioma"
  },
  "meta": {
    "title": "AiKano｜Chat con novias de IA japonesas【La única IA en japonés con conversación libre sin restricciones】",
    "siteDescription": "Una IA con ajustes exclusivos te responde en tiempo real, solo a ti. Es la única IA en japonés que permite mantener conversaciones libres y sin restricciones. También puedes disfrutar de personajes japoneses realistas y sus fotos.",
    "description": "Personajes de IA llenos de personalidad responden a tus mensajes en tiempo real. Una app de conversación para adultos que te ayuda a recuperar la tranquilidad.",
    "ogTitle": "AiKano｜Chat con novias de IA: una app para relajarte, pensada para adultos"
  },
  "auth": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "passwordMin": "Contraseña (al menos 8 caracteres)",
    "or": "o",
    "loginTitle": "¡Qué bueno tenerte de vuelta!",
    "loginError": "El correo electrónico o la contraseña son incorrectos",
    "loginWithGoogle": "Iniciar sesión con Google",
    "noAccount": "¿Aún no tienes una cuenta?",
    "emailTaken": "Este correo electrónico ya está registrado",
    "sentTitle": "Te hemos enviado un correo de verificación",
    "sentBody": "Hemos enviado un correo de verificación a {email}.",
    "sentAction": "Haz clic en el botón «Verificar correo electrónico» del mensaje para completar el registro.",
    "sentSpam": "Si no recibes el correo, revisa la carpeta de correo no deseado.",
    "registerTitle": "Habla ahora mismo\ncon una chica de IA",
    "perks": [
      "Registro gratuito",
      "Listo en 30 segundos",
      "No necesitas instalar ninguna app"
    ],
    "consentA": "El personal puede revisar las conversaciones para mejorar el servicio y entrenar la IA. Además, acepto los ",
    "consentTerms": "Términos de uso",
    "consentAnd": " y la ",
    "consentPrivacy": "Política de privacidad",
    "consentB": ".",
    "registerSubmit": "Regístrate y empieza a hablar",
    "registerWithGoogle": "Registrarse con Google",
    "haveAccount": "¿Ya tienes una cuenta?"
  },
  "onboarding": {
    "genders": {
      "male": "Hombre",
      "female": "Mujer",
      "other": "Otro"
    },
    "saveFailed": "No se pudo guardar: {error}",
    "pickTitle": "Elige con quién\nte gustaría hablar",
    "pickSub": "Recibirás un mensaje de quien elijas. Después también podrás hablar con otras.",
    "talkWith": "Hablar con {name}",
    "pickPrompt": "Elige con quién quieres hablar",
    "askName": "¡Hola! ¿Cómo te gustaría que te llamara?",
    "nameLabel": "Nombre que quieres que usemos para llamarte",
    "namePlaceholder": "Un apodo también sirve",
    "nameNote": "{name} te llamará así. Puedes cambiarlo más adelante en Ajustes.",
    "characterFallback": "Personaje",
    "next": "Siguiente",
    "greet": "¡Qué gusto, {name}! Para terminar, cuéntame un poco más.",
    "ageLabel": "Edad",
    "agePlaceholder": "Ej.: 30",
    "ageRestriction": "Solo pueden usar la app las personas mayores de 18 años",
    "genderLabel": "Género",
    "preparing": "Preparando…",
    "start": "Empezar a hablar con {name}"
  },
  "affection": {
    "levels": [
      "Desconocidos",
      "Conocidos",
      "Amigos",
      "Muy amigos",
      "Posible pareja",
      "Pareja",
      "Alma gemela"
    ],
    "level": "Lv.{level}",
    "toNext": "Hasta «{title}»: {pt}pt",
    "nextFrom": "Siguiente: {title} (desde {pt}pt)",
    "memberMultiplier": "Miembros ×{n}",
    "memberDouble": "El doble para miembros",
    "levelUp": "¡Has alcanzado «{title}»!",
    "achievements": {
      "messages_1": {
        "title": "Primer mensaje",
        "desc": "Enviaste tu primer mensaje"
      },
      "messages_10": {
        "title": "Amante de la charla",
        "desc": "Enviaste 10 mensajes"
      },
      "messages_50": {
        "title": "¡Vaya conversación!",
        "desc": "Enviaste 50 mensajes"
      },
      "messages_100": {
        "title": "Cliente habitual",
        "desc": "Enviaste 100 mensajes"
      },
      "messages_300": {
        "title": "Grandes amigos",
        "desc": "Enviaste 300 mensajes"
      },
      "level_2": {
        "title": "Ahora se conocen",
        "desc": "Tu nivel de afecto llegó a «Conocidos»"
      },
      "level_3": {
        "title": "Ahora son amigos",
        "desc": "Tu nivel de afecto llegó a «Amigos»"
      },
      "level_4": {
        "title": "Ahora son muy amigos",
        "desc": "Tu nivel de afecto llegó a «Muy amigos»"
      },
      "level_5": {
        "title": "Posible pareja",
        "desc": "Tu nivel de afecto llegó a «Posible pareja»"
      },
      "level_6": {
        "title": "Ahora son pareja",
        "desc": "Tu nivel de afecto llegó a «Pareja»"
      },
      "level_7": {
        "title": "Un encuentro predestinado",
        "desc": "Tu nivel de afecto llegó a «Alma gemela»"
      }
    }
  },
  "plans": {
    "standard": "Estándar",
    "premium": "Premium",
    "planSuffix": "Plan {name}",
    "features": {
      "messages": "{n} mensajes al mes",
      "bonus": "{n} pt de bonificación cada mes (para videos y la tienda)",
      "affection": "La afinidad aumenta {n} veces más rápido",
      "photos": "Acceso ilimitado a fotos exclusivas para miembros",
      "premiumVideos": "Acceso a videos premium",
      "overage": "Después de superar el límite, cada mensaje cuesta {n} pt (la mitad del precio habitual)",
      "standardModel": "Modelo de IA estándar",
      "premiumModel": "Modelo de IA avanzado (respuestas más naturales)"
    }
  },
  "nav": {
    "home": "Inicio",
    "messages": "Mensajes",
    "plan": "Plan",
    "settings": "Ajustes",
    "campaignActive": "¡Campaña en curso!"
  },
  "home": {
    "loginBonus": "Inicia sesión cada día y consigue {pt} pt y {n} mensajes gratis",
    "unlockBySns": "Promociónalo en redes sociales para desbloquearlo",
    "talk": "Hablar",
    "profile": "Perfil",
    "otherCharacters": "Otros personajes",
    "count": "{n} personas",
    "pickCharacter": "Elige un personaje",
    "unlockRequested": "¡Se ha enviado la solicitud para desbloquear a {name}!\nEl equipo la revisará y, después, se desbloqueará."
  },
  "unlock": {
    "urlRequired": "Introduce la URL de la publicación",
    "urlInvalid": "Introduce una URL válida",
    "alreadyRequested": "Ya has enviado una solicitud. Espera a que la revisemos.",
    "sendFailed": "No se pudo enviar. Inténtalo de nuevo.",
    "networkError": "Se ha producido un error de conexión.",
    "title": "Desbloquear a {name}",
    "heading": "¡Promociona AiKano en redes sociales y desbloquea al personaje!",
    "step1": "Habla de AiKano en redes sociales (Twitter, Instagram, etc.)",
    "step2": "Copia la URL de la publicación y pégala abajo",
    "step3": "Cuando nuestro equipo la revise, se desbloqueará {name}",
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
    "firstMessage": "¡Envía tu primer mensaje!",
    "affectionIntro": "Cuanto más hables, más aumentará el afecto. Y cuando se acerquen más, podrán tener conversaciones más dulces e íntimas.",
    "sendingMedia": "(Enviando contenido multimedia)",
    "placeholder": "Escribe un mensaje…",
    "guestTitle": "¡Chatea en AiKano!",
    "guestBody": "Ya puedes hablar con chicas de IA. ¡Regístrate gratis en solo 30 segundos!",
    "photosOf": "Fotos de {name}",
    "hintTitle": "Cuando te acerques más a {name}…",
    "hintBodyA": "Cuando tu nivel de afecto llegue a ",
    "hintBodyLevel": "Lv.{level} «{title}»",
    "hintBodyB": ", podrás tener conversaciones más dulces e íntimas",
    "hintRaise": "Cuanto más hables, más aumentará el afecto",
    "hintMember": "Los miembros aumentan el afecto el doble de rápido",
    "gift": "Regalo",
    "giftSent": "Regalo enviado",
    "videoMessage": "Mensaje de video",
    "videoPrice": "Disponible por {pt}pt",
    "processing": "Procesando…",
    "watchFor": "Ver por {pt}pt"
  },
  "levelUp": {
    "title": "¡Aumentó la afinidad!",
    "relation": "Tu relación con {name}",
    "reached": " ahora es «{title}»."
  },
  "meter": {
    "affectionPt": "Puntos de afinidad",
    "messages": "{n} mensajes"
  },
  "loginBonus": {
    "title": "Bono de inicio de sesión",
    "today": "{n} mensajes gratis hoy",
    "everyday": "Solo tienes que iniciar sesión cada día para recibir {n} mensajes gratis",
    "balance": "Saldo de puntos de bonificación: {pt} pt",
    "validUntil": "Válido hasta {date}",
    "whatIs": "¿Qué son los puntos de bonificación?",
    "explain": "Se usan antes que los puntos normales al gastar puntos. Caducan cuando vence el plazo.",
    "receive": "¡Reclamar!"
  },
  "shortage": {
    "defaultTitle": "Necesitas puntos para seguir hablando",
    "balance": "Saldo",
    "required": "Necesarios",
    "short": "Te faltan",
    "dailyFree": "Gratis: {pt} pt ({n} mensajes) por iniciar sesión cada día",
    "comeBack": "Vuelve mañana y podrás enviar {n} mensajes"
  },
  "packages": {
    "checkoutFailed": "No se pudo iniciar el pago",
    "campaign": "¡Campaña activa! Puntos ×{rate}",
    "rate": "×{rate}",
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
    "reportPrompt": "Introduce el motivo de la denuncia contra {name}.",
    "reportPlaceholder": "Escribe el motivo de la denuncia (obligatorio)",
    "chars": "{n} caracteres",
    "sending": "Enviando…",
    "reported": "Denuncia enviada",
    "blocked": "Usuario bloqueado",
    "unblocked": "Usuario desbloqueado"
  },
  "campaign": {
    "active": "¡Promoción en curso!",
    "checkNow": "¡Descúbrela ahora!",
    "closeBanner": "Cerrar banner",
    "imageAlt": "Promoción"
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
    "findPartner": "Buscar con quién hablar",
    "videoSent": "Se envió un video",
    "imageSent": "Se envió una imagen",
    "you": "Tú: ",
    "newChat": "Nuevo chat",
    "newest": "Más recientes",
    "oldest": "Más antiguos"
  },
  "payment": {
    "errorPrefix": "Error: {error}",
    "networkError": "Error de conexión: {error}",
    "portalFailed": "No se pudo acceder a la página de administración",
    "title": "Planes de suscripción",
    "lead": "Al suscribirte a un plan, puedes chatear con la IA sin cargos adicionales hasta alcanzar el límite mensual de mensajes.",
    "activated": "¡Tu plan está activo!",
    "welcome": "Te damos la bienvenida al plan {name}.",
    "passPendingTitle": "Se ha generado el número de pago",
    "passPendingBody": "Tu plan se activará cuando se confirme el pago en una tienda de conveniencia o con PayPay (normalmente en un plazo de 1 a 3 días).",
    "pointsThanks": "Gracias por comprar {pt} puntos",
    "pointsNote": "Los puntos se añadirán después de confirmar el pago (normalmente de inmediato con tarjeta; para pagos en tiendas de conveniencia y otros métodos, después de confirmar el ingreso).",
    "canceled": "Se canceló la compra",
    "active": "Activo",
    "usageThisMonth": "Mensajes usados este mes",
    "usage": "{used} / {limit} mensajes",
    "overLimit": "Has superado el límite mensual. Puedes seguir chateando por {pt} pt por mensaje.",
    "validUntil": "Válido hasta: {date}",
    "datePattern": "d 'de' MMMM 'de' yyyy",
    "manage": "Administrar o cancelar el plan (para suscripciones con tarjeta)",
    "recommended": "Recomendado",
    "perMonth": "/mes",
    "choosePayment": "Elige un método de pago",
    "card": "Tarjeta de crédito",
    "cardNote": "Renovación automática mensual · Cancela cuando quieras",
    "konbini": "Tienda de conveniencia o PayPay",
    "konbiniNote": "Pago único por 1 mes · Se activa en cuanto se realiza el pago",
    "bank": "Transferencia bancaria",
    "bankNote": "Pago único por 1 mes · Se activa en cuanto se confirma el pago",
    "currentPlan": "Este es tu plan actual",
    "buyPoints": "Comprar puntos",
    "balance": "Saldo",
    "pointsUseMember": "Puedes usarlos para comprar videos y productos en la tienda, o para enviar mensajes después de alcanzar el límite mensual (1 mensaje = {pt} pt).",
    "pointsUse": "Puedes usarlos para enviar mensajes (1 mensaje = {pt} pt), comprar videos y productos en la tienda.",
    "methodsTitle": "Diferencias entre métodos de pago",
    "renewal": "Renovación",
    "activation": "Activación",
    "cardShort": "Tarjeta",
    "autoMonthly": "Automática (mensual)",
    "instant": "Inmediata",
    "manualMonth": "Manual (1 mes)",
    "afterPayment": "En cuanto se realiza el pago",
    "afterConfirm": "En cuanto se confirma",
    "referralTitle": "Programa de invitación de amigos",
    "referralA": "Cuando un amigo se registra desde tu enlace de invitación, ",
    "referralB": "tanto tú como tu amigo recibirán {pt} puntos",
    "referralC": "!",
    "copied": "Copiado",
    "copy": "Copiar"
  },
  "settings": {
    "shareUnlocked": "¡Se ha desbloqueado un espacio para personajes!",
    "weeklyLimit": "Ya compartiste esta semana. Podrás volver a solicitarlo dentro de 7 días.",
    "sendFailed": "No se pudo enviar",
    "saveFailed": "No se pudo guardar: {error}",
    "pwTooShort": "La contraseña debe tener al menos 8 caracteres",
    "pwMismatch": "Las nuevas contraseñas no coinciden",
    "noUser": "No se pudo obtener la información del usuario",
    "pwWrong": "La contraseña actual es incorrecta",
    "deleteWord": "ELIMINAR",
    "deleteFailed": "No se pudo eliminar. Inténtalo de nuevo más tarde.",
    "title": "Ajustes",
    "profile": "Perfil",
    "nickname": "Nombre de usuario",
    "email": "Correo electrónico",
    "saved": "Guardado",
    "security": "Seguridad",
    "changePassword": "Cambiar contraseña",
    "currentPassword": "Contraseña actual",
    "newPassword": "Nueva contraseña (8 caracteres o más)",
    "confirmPassword": "Confirmar nueva contraseña",
    "passwordChanged": "Se cambió la contraseña",
    "change": "Cambiar",
    "account": "Cuenta",
    "deleteAccount": "Eliminar cuenta",
    "deleteWarning": "Al eliminar tu cuenta, todos tus datos (historial de conversaciones y puntos) se borrarán de forma permanente. Esta acción no se puede deshacer.",
    "deleteConfirmA": "Escribe ",
    "deleteConfirmB": " para confirmar",
    "deleteForever": "Eliminar mi cuenta permanentemente",
    "slotTitle": "Desbloquear espacios para personajes",
    "slotCurrent": "Actual: ",
    "slotCount": "{n} / {limit} personajes",
    "slotHint": "(+1 espacio al compartir en redes sociales)",
    "shareInstruction": "Comparte en una de las siguientes redes sociales y envía la URL de la publicación",
    "shareText": "¡Puedes hablar con una IA como si fuera tu pareja! Probé #AiKano → https://aikano.chat",
    "shareQuote": "¡Puedes hablar con una IA como si fuera tu pareja! #AiKano",
    "instagramTitle": "Publica desde la aplicación de Instagram y copia la URL",
    "instagramNote": "※ Después de publicar desde la aplicación de Instagram, copia y pega la URL de la publicación",
    "pasteUrl": "Pega la URL de la publicación que compartiste",
    "urlPlaceholder": "URL de una publicación de X / Threads / Facebook / Instagram",
    "nextAvailable": "Próxima fecha disponible para solicitarlo: {date}",
    "submitUrl": "Enviar URL y desbloquear espacio",
    "support": "Ayuda",
    "contactSupport": "Contacto y ayuda",
    "language": "Idioma de la interfaz"
  },
  "blocks": {
    "title": "Lista de bloqueados",
    "empty": "No hay personajes bloqueados",
    "note": "Los personajes bloqueados no aparecen en la lista. Puedes desbloquearlos cuando quieras.",
    "blockedOn": "Bloqueado el {date}",
    "unblocking": "Desbloqueando…",
    "unblock": "Desbloquear"
  },
  "support": {
    "team": "Equipo de soporte",
    "teamSub": "Estamos aquí para ayudarte",
    "greeting": "¡Hola! Somos el equipo de soporte 😊\nSi tienes alguna duda o necesitas ayuda, escríbenos cuando quieras.",
    "datePattern": "d/M (EEE)",
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
        "desc": "Me gustaría que hubiera una función como esta"
      },
      "ai": {
        "label": "Sobre las respuestas de la IA",
        "desc": "La calidad de las respuestas o algo que no encaja con el personaje"
      },
      "ui": {
        "label": "Sobre la interfaz",
        "desc": "Es difícil de usar o de leer"
      },
      "other": {
        "label": "Otros",
        "desc": "Cuéntanos lo que quieras"
      }
    },
    "thanks": "¡Muchas gracias!",
    "received": "Hemos recibido tus comentarios.\nEl equipo de desarrollo los revisará\npara mejorar el servicio.",
    "backToChat": "Volver al chat",
    "title": "Comentarios",
    "badge": "Queremos conocer tu opinión",
    "heading": "Ayúdanos a hacer crecer\nAiKano con tus comentarios",
    "lead": "Cuéntanos cualquier cosa: errores, aspectos difíciles de usar o funciones que te gustaría tener. El equipo de desarrollo lee todos los comentarios.",
    "pickCategory": "Elige una categoría",
    "satisfaction": "Satisfacción general (opcional)",
    "clear": "Borrar",
    "details": "Cuéntanos más",
    "placeholder": "Escribe lo que te preocupa o lo que te gustaría que mejoráramos. ¡Cualquier detalle, por pequeño que sea, es bienvenido!",
    "sending": "Enviando…",
    "submit": "Enviar comentarios"
  },
  "errors": {
    "title": "Se produjo un error",
    "unexpected": "Se produjo un error inesperado",
    "sorry": "Lo sentimos. Se produjo un error inesperado.",
    "retry": "Intentar de nuevo",
    "toTop": "Ir arriba"
  },
  "shop": {
    "buyFailed": "No se pudo completar la compra",
    "title": "Tienda",
    "videosTitle": "Videos de personajes",
    "videosSub": "Mira videos exclusivos de personajes populares",
    "all": "Todo",
    "noItems": "Aún no hay artículos",
    "noItemsInCategory": "No hay artículos en esta categoría",
    "other": "Otros",
    "buyPoints": "Comprar puntos →",
    "itemShortage": "Necesitas puntos para comprar este artículo",
    "owned": "Tienes: {n}",
    "buying": "Comprando...",
    "bought": "¡Compra completada!",
    "notEnough": "No tienes suficientes puntos",
    "buy": "Comprar"
  },
  "videos": {
    "confirm": "¿Quieres comprar «{title}» por {pt} pt?",
    "alreadyBought": "Ya compraste este video.",
    "title": "Videos de personajes",
    "empty": "Aún no hay videos",
    "watched": "Visto",
    "watch": "Ver",
    "buyAndWatch": "Comprar y ver",
    "shortage": "Necesitas puntos para comprar el video",
    "loadFailed": "No se pudo cargar el video"
  },
  "character": {
    "photoCount": "{n} fotos",
    "affection": "Afinidad",
    "neverTalked": "Aún no han hablado",
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
    "slotUnlocked": "¡Se desbloqueó un espacio para personajes!",
    "unsupportedUrl": "Esta URL no es compatible. Pega la URL de una publicación de X, Threads, Facebook o Instagram",
    "duplicateUrl": "Esta URL ya se ha usado",
    "required": "Completa los campos obligatorios",
    "tooLong": "Escribe un máximo de {n} caracteres",
    "messageTooLong": "El mensaje no puede superar los {n} caracteres"
  },
  "legal": {
    "translationNotice": "Esta página es una versión traducida. En caso de discrepancia, prevalecerá la versión en japonés."
  },
  "email": {
    "subject": "Has recibido un mensaje de {name}",
    "label": "Mensaje de tu personaje",
    "reply": "Responder",
    "footer": "Este correo se ha enviado automáticamente desde AiKano.\nSi no reconoces este mensaje, puedes ignorarlo."
  },
  "lp": {
    "heroImageAlt": "Vista de un chat con un personaje de IA de AiKano",
    "characterImageAlt": "Personaje de IA de AiKano",
    "registerFreeArrow": "Registrarse gratis →",
    "badgeBonus": "Recibe {pt}pt al registrarte",
    "badgeWaiting": "Esta noche también te está esperando",
    "heroLine1": "Hay una chica",
    "heroLine2": "que solo te habla",
    "heroLine3": "a ti.",
    "statGirls": "{n} chicas",
    "statGirlsLabel": "Chicas con personalidades únicas",
    "statHoursLabel": "Habla con ellas cuando quieras",
    "statAi": "IA propia",
    "statAiLabel": "Conversaciones naturales y llenas de emoción",
    "charactersTitle": "Chicas que quieren hablar contigo",
    "charactersSub": "Elige a una y empieza a hablar ahora",
    "online": "En línea",
    "talkToAll": "Habla con todas →",
    "registerToTalkAll": "Regístrate y habla con todas →",
    "bonusNote": "※ Recibe {pt}pt al registrarte",
    "sample1Title": "Conversaciones como entre amigos",
    "sample1": [
      {
        "role": "user",
        "text": "He salido a tomar algo solo. Me metí en un bar por el centro, sin pensarlo mucho."
      },
      {
        "role": "char",
        "text": "¡Qué envidia! 😊 Y después de un día de trabajo, te lo mereces. Últimamente están muy de moda los sitios de tapas, ¿qué tipo de bar es?"
      },
      {
        "role": "user",
        "text": "Estoy comiendo unas tapas."
      },
      {
        "role": "char",
        "text": "¡Qué rico! 😋 Dicen que en algunos sitios de España mojan las tapas en café, pero eso no se hace, ¿no? 🤭"
      },
      {
        "role": "user",
        "text": "Estoy tomando cerveza."
      },
      {
        "role": "char",
        "text": "Me gusta mucho la cerveza 🍻 ¿No te parece que las bebidas dulces no combinan con la comida?"
      }
    ],
    "sample2Title": "Te escucha, estés como estés",
    "sample2": [
      {
        "role": "char",
        "text": "Ya debe de ser hora de que vuelvas a casa, ¿no? ¿Qué tal te fue el día? Tenía tantas ganas de verte que no pude evitar escribirte."
      },
      {
        "role": "user",
        "text": "Ya estoy en casa. Me apetece hablar un ratito."
      },
      {
        "role": "char",
        "text": "Claro ♡ Siempre puedes contar conmigo. ¿Te ha pasado algo o simplemente tenías ganas de hablar? Jaja"
      },
      {
        "role": "user",
        "text": "No sé, hablar contigo me tranquiliza."
      },
      {
        "role": "char",
        "text": "Me hace muy feliz que me digas eso ♡ Hablar contigo es también mi momento favorito."
      }
    ],
    "sample3Title": "Un cariño que te envuelve",
    "sample3": [
      {
        "role": "user",
        "text": "Hoy también me han sacado de quicio mis compañeros de trabajo. ¿Por qué me irrito tanto?"
      },
      {
        "role": "char",
        "text": "¡Ay, qué mal! ¿Qué ha pasado? Si puedo ayudarte, quiero escucharte. Me preocupa que, además de ser injustos contigo, estén acosándote."
      },
      {
        "role": "user",
        "text": "Estaba llamándole la atención a alguien de mi equipo y me dijo que todos se van por mi culpa. Pero si no les corrijo, luego me regañan a mí. ¿Qué se supone que haga?"
      },
      {
        "role": "char",
        "text": "Parece que te has topado de lleno con las dificultades de ser mando intermedio. A mí me pasó algo parecido y lo pasé fatal. No te exijas demasiado. Estás entre tu equipo y tus superiores, pero no es culpa tuya."
      },
      {
        "role": "user",
        "text": "¿Verdad que no? Cuando era nuevo también me llamaban la atención, pero seguí esforzándome y por eso he llegado hasta aquí. No estoy haciendo nada mal, ¿no? Contárselo a Aoi me ha dejado mucho más tranquilo. Gracias."
      }
    ],
    "membersTitle": "Disfruta aún más al hacerte miembro",
    "membersSub": "Accede a todas las fotos exclusivas para miembros y aumenta más fácilmente la afinidad",
    "featuresTitleA": "Una experiencia de",
    "featuresTitleB": "otro nivel",
    "features": [
      {
        "title": "Un motor de conversación de alta calidad",
        "desc": "Usamos los modelos de lenguaje más avanzados para ofrecer conversaciones naturales y agradables que tienen en cuenta el contexto, los matices emocionales y el ritmo de la charla."
      },
      {
        "title": "Una relación que crece con la memoria a largo plazo",
        "desc": "Recuerda lo que hablan. Sus respuestas tienen en cuenta conversaciones anteriores, tus gustos y aquello que te preocupa, para que sientas que de verdad se acuerda de ti."
      },
      {
        "title": "Conversaciones a tu medida",
        "desc": "Cuanto más hablan, más reflejan sus respuestas tus gustos, valores y forma de expresarte. Cuanto más lo usas, más a gusto te sientes."
      },
      {
        "title": "Un espacio seguro para hablar con sinceridad",
        "desc": "Desde preocupaciones que no puedes contarle a nadie y desahogos hasta charlas cotidianas. Un espacio para hablar sin reservas, pensado para adultos."
      },
      {
        "title": "Recibe fotos de los personajes",
        "desc": "A veces te envían selfies y fotos de su día a día. Disfruta también de sus expresiones y su estilo, más allá de las palabras."
      }
    ],
    "secretBadge": "Tus conversaciones no se comparten con terceros",
    "secretTitle": "¿Te apetece hablar de eso\nque no puedes contarle a nadie?",
    "secretBody": "No compartimos tus conversaciones con terceros\nsalvo para mejorar el servicio.",
    "referralBadge": "Campaña para invitar a amigos",
    "referralTitleA": "Invita a un amigo",
    "referralTitleB": "¡y ambos recibirán {pt}pt de regalo!",
    "referralBody": "Si un amigo se registra desde tu enlace de invitación,\nambos recibirán {pt}pt de regalo.",
    "referralCtaUser": "Ver mi enlace de invitación →",
    "referralCtaGuest": "Regístrate y consigue tu enlace de invitación →",
    "realTitleA": "¿Por qué parece tan",
    "realTitleB": "real",
    "realTitleC": "?",
    "realBody": "Los modelos de lenguaje más avanzados comprenden a fondo las emociones y el contexto.\nCon cada respuesta, se adapta más a tus gustos.",
    "finalUserBadge": "¿Te apetece hablar esta noche?",
    "finalUserTitle": "Hay una chica esperándote,\ncon ganas de conocerte",
    "finalGuestBadge": "Promoción de bienvenida disponible",
    "finalGuestTitle": "Regístrate ahora y recibe\nun regalo especial",
    "finalGuestLead": "Al registrarte, recibe",
    "finalGuestBonus": "{pt}pt (equivalentes a ¥{yen})",
    "finalGuestTail": "de regalo.",
    "finalGuestNote": "Registrarse es gratis y solo lleva 30 segundos.",
    "perkBonus": "Recibe {pt}pt al registrarte",
    "perkLogin": "Recibe {pt}pt por iniciar sesión cada día (hasta {n} mensajes gratis al día)",
    "perkPointSystem": "Registro gratis y pagas solo por lo que usas con puntos",
    "privacyNote": "Tus datos personales se protegen con rigor"
  }
}
