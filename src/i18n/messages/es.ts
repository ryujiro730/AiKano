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
    "title": "AiKano｜Chat con novia IA japonesa",
    "siteDescription": "Una IA con ajustes exclusivos te responde en tiempo real, solo a ti. Disfruta de conversaciones con personajes japoneses realistas.",
    "description": "Personajes de IA con personalidades únicas responden a tus mensajes en tiempo real. Una app de conversación que te ayuda a recuperar la calma.",
    "ogTitle": "AiKano｜Chat con novia IA: una app de conversación reconfortante"
  },
  "auth": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "passwordMin": "Contraseña (8 caracteres como mínimo)",
    "or": "o",
    "loginTitle": "¡Qué bien tenerte de vuelta!",
    "loginError": "El correo electrónico o la contraseña no son correctos",
    "loginWithGoogle": "Iniciar sesión con Google",
    "noAccount": "¿Aún no tienes una cuenta?",
    "emailTaken": "Este correo electrónico ya está registrado",
    "sentTitle": "Te hemos enviado un correo de confirmación",
    "sentBody": "Te hemos enviado un correo de confirmación a {email}.",
    "sentAction": "Haz clic en el botón «Confirmar correo electrónico» del mensaje para completar el registro.",
    "sentSpam": "Si no recibes el correo, revisa la carpeta de correo no deseado.",
    "registerTitle": "Habla ahora mismo\ncon una chica de IA",
    "perks": [
      "Registro gratis",
      "En solo 30 segundos",
      "Sin necesidad de instalar una app"
    ],
    "consentA": "El personal puede revisar tus conversaciones para mejorar el servicio y entrenar la IA. Además, acepto los ",
    "consentTerms": "Términos de uso",
    "consentAnd": " y la ",
    "consentPrivacy": "Política de privacidad",
    "consentB": ".",
    "registerSubmit": "Regístrate y empieza a chatear",
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
    "pickTitle": "Elige al personaje\ncon quien te gustaría hablar",
    "pickSub": "El personaje que elijas te enviará un mensaje. Más adelante también podrás hablar con otros.",
    "talkWith": "Hablar con {name}",
    "pickPrompt": "Elige con quién te gustaría hablar",
    "askName": "¡Hola! ¿Cómo quieres que te llame?",
    "nameLabel": "Nombre que prefieres",
    "namePlaceholder": "Puede ser un apodo",
    "nameNote": "{name} te llamará así. Puedes cambiarlo más adelante en Ajustes.",
    "characterFallback": "Personaje",
    "next": "Siguiente",
    "greet": "¡Mucho gusto, {name}! Para terminar, cuéntame una cosita más.",
    "ageLabel": "Edad",
    "agePlaceholder": "Ej.: 30",
    "ageRestriction": "Solo pueden usar la app personas mayores de 18 años",
    "genderLabel": "Género",
    "preparing": "Preparando…",
    "start": "Empezar a hablar con {name}"
  },
  "affection": {
    "levels": [
      "Desconocidos",
      "Conocidos",
      "Amigos",
      "Buenos amigos",
      "Posible pareja",
      "Pareja",
      "Almas gemelas"
    ],
    "level": "Lv.{level}",
    "toNext": "Hasta «{title}»: {pt}pt",
    "nextFrom": "Siguiente: {title} (desde {pt}pt)",
    "memberMultiplier": "Miembros ×{n}",
    "memberDouble": "El doble para miembros",
    "levelUp": "¡Ahora sois «{title}»!",
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
        "title": "Una charla animada",
        "desc": "Enviaste 50 mensajes"
      },
      "messages_100": {
        "title": "Ya eres de la casa",
        "desc": "Enviaste 100 mensajes"
      },
      "messages_300": {
        "title": "Grandes amigos",
        "desc": "Enviaste 300 mensajes"
      },
      "level_2": {
        "title": "Ya os conocéis",
        "desc": "Tu nivel de afinidad llegó a «Conocidos»"
      },
      "level_3": {
        "title": "Ahora sois amigos",
        "desc": "Tu nivel de afinidad llegó a «Amigos»"
      },
      "level_4": {
        "title": "Grandes amigos",
        "desc": "Tu nivel de afinidad llegó a «Buenos amigos»"
      },
      "level_5": {
        "title": "Posible pareja",
        "desc": "Tu nivel de afinidad llegó a «Posible pareja»"
      },
      "level_6": {
        "title": "Ya sois pareja",
        "desc": "Tu nivel de afinidad llegó a «Pareja»"
      },
      "level_7": {
        "title": "Un encuentro destinado",
        "desc": "Tu nivel de afinidad llegó a «Almas gemelas»"
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
      "affection": "El nivel de afinidad aumenta {n} veces más rápido",
      "photos": "Acceso ilimitado a fotos exclusivas para miembros",
      "premiumVideos": "Acceso a videos Premium",
      "overage": "Después de alcanzar el límite, cada mensaje cuesta {n} pt (más barato de lo habitual)",
      "standardModel": "Modelo de IA estándar",
      "premiumModel": "Modelo de IA avanzado (respuestas más naturales)"
    }
  },
  "nav": {
    "home": "Inicio",
    "messages": "Mensajes",
    "plan": "Plan",
    "settings": "Ajustes",
    "gacha": "Gacha",
    "campaignActive": "¡Campaña en curso!"
  },
  "home": {
    "loginBonus": "Inicia sesión cada día y recibe {pt}pt y {n} mensajes gratis",
    "unlockBySns": "Promociónalo en redes sociales para desbloquear",
    "talk": "Hablar",
    "profile": "Perfil",
    "otherCharacters": "Otros personajes",
    "count": "{n} personas",
    "pickCharacter": "Elegir personaje",
    "unlockRequested": "¡Solicitud para {name} completada!\nSe desbloqueará cuando el equipo la revise."
  },
  "unlock": {
    "urlRequired": "Introduce la URL de la publicación",
    "urlInvalid": "Introduce una URL válida",
    "alreadyRequested": "Ya has enviado la solicitud. Espera a que la revisemos.",
    "sendFailed": "No se pudo enviar. Inténtalo de nuevo.",
    "networkError": "Se ha producido un error de conexión.",
    "title": "Desbloquear a {name}",
    "heading": "¡Promociona AiKano en redes sociales y desbloquea un personaje!",
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
    "firstMessage": "Envía tu primer mensaje",
    "affectionIntro": "Cuanto más hables, más aumentará el afecto. Cuando se estreche vuestra relación, podréis tener conversaciones más dulces e íntimas.",
    "sendingMedia": "(Enviando contenido multimedia)",
    "placeholder": "Escribe un mensaje…",
    "guestTitle": "Disfruta del chat en AiKano",
    "guestBody": "Habla ahora con chicas de IA. ¡Regístrate gratis en solo 30 segundos!",
    "photosOf": "Fotos de {name}",
    "hintTitle": "Cuando estés más cerca de {name}…",
    "hintBodyA": "Cuando tu nivel de afecto llegue a ",
    "hintBodyLevel": "Lv.{level} «{title}»",
    "hintBodyB": ", podrás tener conversaciones más dulces e íntimas.",
    "hintRaise": "Cuanto más hables, más aumentará el afecto",
    "hintMember": "Los miembros aumentan el afecto el doble de rápido",
    "gift": "Regalo",
    "giftSent": "Regalo enviado",
    "videoMessage": "Mensaje de video",
    "videoPrice": "Puedes verlo por {pt}pt",
    "processing": "Procesando…",
    "watchFor": "Ver por {pt}pt",
    "wishLabel": "Lo que quiere",
    "wishGive": "Regalar · {pt}pt",
    "wishDone": "Regalado"
  },
  "levelUp": {
    "title": "¡Aumentó la afinidad!",
    "relation": "La relación con {name}",
    "reached": "ha pasado a ser «{title}»."
  },
  "meter": {
    "affectionPt": "Puntos de afinidad",
    "messages": "{n} mensajes"
  },
  "loginBonus": {
    "title": "Bono de inicio de sesión",
    "today": "{n} mensajes gratis hoy",
    "everyday": "Inicia sesión cada día y recibe {n} mensajes gratis",
    "balance": "Saldo de puntos de bonificación: {pt} pt",
    "validUntil": "Válido hasta {date}",
    "whatIs": "¿Qué son los pt de bonificación?",
    "explain": "Se usan antes que los pt normales al gastar puntos. Caducan al vencer el plazo.",
    "receive": "¡Reclamar!"
  },
  "shortage": {
    "defaultTitle": "Necesitas puntos para seguir hablando",
    "balance": "Saldo",
    "required": "Necesarios",
    "short": "Insuficientes",
    "dailyFree": "Gratis {pt}pt ({n} mensajes) por iniciar sesión cada día",
    "comeBack": "Vuelve mañana a verme y podrás intercambiar {n} mensajes"
  },
  "packages": {
    "checkoutFailed": "No se pudo iniciar el pago",
    "campaign": "¡Promoción activa! Puntos ×{rate}",
    "campaignUpTo": "¡Promoción activa! Hasta ×{rate} puntos",
    "rate": "×{rate}",
    "popular": "Popular",
    "recommended": "Recomendado",
    "breakdown": "{base}pt + {bonus}pt de bonificación",
    "processing": "Procesando..."
  },
  "characterMenu": {
    "reasonRequired": "Introduce un motivo",
    "errorStatus": "Error ({status})",
    "networkError": "Se produjo un error de conexión",
    "report": "Denunciar",
    "unblock": "Desbloquear",
    "block": "Bloquear",
    "reportPrompt": "Escribe el motivo de la denuncia contra {name}.",
    "reportPlaceholder": "Escribe el motivo de la denuncia (obligatorio)",
    "chars": "{n} caracteres",
    "sending": "Enviando…",
    "reported": "Denuncia enviada",
    "blocked": "Usuario bloqueado",
    "unblocked": "Usuario desbloqueado"
  },
  "campaign": {
    "active": "¡Campaña activa!",
    "checkNow": "¡Ver ahora!",
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
    "findPartner": "Buscar a alguien con quien hablar",
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
    "portalFailed": "No se pudo acceder a la página de gestión",
    "title": "Planes",
    "lead": "Al suscribirte a un plan, podrás chatear con la IA sin cargos adicionales hasta alcanzar el límite mensual de mensajes.",
    "activated": "¡Tu plan ya está activo!",
    "welcome": "Te damos la bienvenida al plan {name}.",
    "passPendingTitle": "Se ha generado el número de pago",
    "passPendingBody": "El plan se activará cuando se confirme el pago en una tienda de conveniencia o por PayPay (normalmente en un plazo de 1 a 3 días).",
    "pointsThanks": "Gracias por comprar {pt}pt",
    "pointsNote": "Los puntos se añadirán cuando se confirme el pago (normalmente al instante con tarjeta; en pagos en tiendas de conveniencia, tras confirmar el ingreso).",
    "canceled": "Has cancelado la compra",
    "active": "Activo",
    "usageThisMonth": "Mensajes usados este mes",
    "usage": "{used} / {limit} mensajes",
    "overLimit": "Has superado el límite mensual. Puedes seguir chateando por {pt}pt por mensaje.",
    "validUntil": "Válido hasta: {date}",
    "datePattern": "d 'de' MMMM 'de' yyyy",
    "manage": "Gestionar o cancelar el plan (si pagas con tarjeta)",
    "recommended": "Recomendado",
    "perMonth": "/mes",
    "choosePayment": "Elige un método de pago",
    "card": "Tarjeta de crédito",
    "cardNote": "Renovación automática cada mes · Cancela cuando quieras",
    "konbini": "Pago en tienda de conveniencia o por PayPay",
    "konbiniNote": "Un pago por un mes · Se activa justo después del pago",
    "bank": "Transferencia bancaria",
    "bankNote": "Un pago por un mes · Se activa justo después de la confirmación",
    "currentPlan": "Ya tienes este plan",
    "buyPoints": "Comprar puntos",
    "balance": "Saldo",
    "pointsUseMember": "Puedes usarlos para comprar videos y productos, o para enviar mensajes después de alcanzar el límite mensual (1 mensaje = {pt}pt).",
    "pointsUse": "Puedes usarlos para enviar mensajes (1 mensaje = {pt}pt), comprar videos y productos.",
    "methodsTitle": "Diferencias entre métodos de pago",
    "renewal": "Renovación",
    "activation": "Activación",
    "cardShort": "Tarjeta",
    "autoMonthly": "Automática (mensual)",
    "instant": "Inmediata",
    "manualMonth": "Manual (1 mes)",
    "afterPayment": "Justo después del pago",
    "afterConfirm": "Justo después de la confirmación",
    "referralTitle": "Programa de invitación a amigos",
    "referralA": "Cuando un amigo se registre con tu enlace de invitación, ",
    "referralB": "tanto tú como tu amigo recibirán {pt} puntos",
    "referralC": "!",
    "copied": "Copiado",
    "copy": "Copiar"
  },
  "settings": {
    "shareUnlocked": "¡Se ha desbloqueado un espacio para un personaje!",
    "weeklyLimit": "Ya has compartido esta semana. Podrás volver a solicitarlo dentro de 7 días.",
    "sendFailed": "No se pudo enviar",
    "saveFailed": "No se pudo guardar: {error}",
    "pwTooShort": "La contraseña debe tener al menos 8 caracteres",
    "pwMismatch": "Las contraseñas nuevas no coinciden",
    "noUser": "No se pudo obtener la información del usuario",
    "pwWrong": "La contraseña actual no es correcta",
    "deleteWord": "ELIMINAR",
    "deleteFailed": "No se pudo eliminar. Inténtalo de nuevo más tarde.",
    "title": "Configuración",
    "profile": "Perfil",
    "nickname": "Nombre de usuario",
    "email": "Correo electrónico",
    "saved": "Guardado",
    "security": "Seguridad",
    "changePassword": "Cambiar contraseña",
    "currentPassword": "Contraseña actual",
    "newPassword": "Nueva contraseña (8 caracteres como mínimo)",
    "confirmPassword": "Confirmar nueva contraseña",
    "passwordChanged": "Se ha cambiado la contraseña",
    "change": "Cambiar",
    "account": "Cuenta",
    "deleteAccount": "Eliminar cuenta",
    "deleteWarning": "Al eliminar la cuenta, se borrarán de forma permanente todos tus datos (historial de conversaciones y puntos). Esta acción no se puede deshacer.",
    "deleteConfirmA": "Para confirmar, ",
    "deleteConfirmB": " escribe",
    "deleteForever": "Eliminar la cuenta permanentemente",
    "slotTitle": "Desbloquear espacio para personajes",
    "slotCurrent": "Actualmente: ",
    "slotCount": "{n} / {limit} personas",
    "slotHint": "(+1 espacio al compartir en redes sociales)",
    "shareInstruction": "Comparte en una de las siguientes redes sociales y envíanos la URL de la publicación",
    "shareText": "¡Puedes hablar con una IA como si fuera tu pareja de verdad! He probado #AiKano → https://aikano.chat",
    "shareQuote": "¡Puedes hablar con una IA como si fuera tu pareja de verdad! #AiKano",
    "instagramTitle": "Después de publicar desde la app de Instagram, copia la URL",
    "instagramNote": "※ Después de publicar desde la app de Instagram, copia y pega la URL de la publicación",
    "pasteUrl": "Pega la URL de la publicación que compartiste",
    "urlPlaceholder": "URL de la publicación en X / Threads / Facebook / Instagram",
    "nextAvailable": "Próxima fecha disponible para solicitarlo: {date}",
    "submitUrl": "Enviar URL y desbloquear espacio",
    "support": "Ayuda",
    "contactSupport": "Contacto y ayuda",
    "language": "Idioma de visualización"
  },
  "blocks": {
    "title": "Lista de personajes bloqueados",
    "empty": "No tienes personajes bloqueados",
    "note": "Los personajes bloqueados no aparecen en la lista. Puedes desbloquearlos cuando quieras.",
    "blockedOn": "Bloqueado el {date}",
    "unblocking": "Desbloqueando…",
    "unblock": "Desbloquear"
  },
  "support": {
    "team": "Equipo de soporte",
    "teamSub": "No dudes en consultarnos",
    "greeting": "¡Hola! Somos el equipo de soporte 😊\nSi tienes alguna duda o necesitas ayuda, escríbenos cuando quieras.",
    "datePattern": "d/M (EEE)",
    "placeholder": "Escribe un mensaje…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Informar de un error",
        "desc": "La app no funciona o se comporta de forma extraña"
      },
      "feature": {
        "label": "Sugerir una función",
        "desc": "Una función que te gustaría tener"
      },
      "ai": {
        "label": "Sobre las respuestas de la IA",
        "desc": "La calidad de las respuestas o algo que no encaja con el personaje"
      },
      "ui": {
        "label": "Sobre la interfaz",
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
    "heading": "Ayúdanos a hacer crecer\nAiKano con tu opinión",
    "lead": "Cuéntanos cualquier cosa: errores, aspectos difíciles de usar o funciones que te gustaría tener. El equipo de desarrollo lee todos los comentarios.",
    "pickCategory": "Elige una categoría",
    "satisfaction": "Satisfacción general (opcional)",
    "clear": "Borrar",
    "details": "Cuéntanos más",
    "placeholder": "Escribe lo que te preocupa o lo que te gustaría que mejoráramos. ¡Todos los comentarios, por pequeños que sean, son bienvenidos!",
    "sending": "Enviando…",
    "submit": "Enviar comentarios"
  },
  "errors": {
    "title": "Se ha producido un error",
    "unexpected": "Se ha producido un error inesperado",
    "sorry": "Lo sentimos. Se ha producido un error inesperado.",
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
    "owned": "En tu inventario: {n}",
    "buying": "Comprando...",
    "bought": "¡Compra completada!",
    "notEnough": "No tienes suficientes puntos",
    "buy": "Comprar"
  },
  "videos": {
    "confirm": "¿Quieres comprar «{title}» por {pt}pt?",
    "alreadyBought": "Ya compraste este video.",
    "title": "Videos del personaje",
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
    "neverTalked": "Todavía no han hablado",
    "sendToRaise": "¡Envía mensajes para aumentar la afinidad!",
    "status": "Estado",
    "profile": "Perfil",
    "achievements": "Logros",
    "photos": "Fotos",
    "seeMembersPhotos": "Ver {n} fotos exclusivas para miembros",
    "sendMessage": "Enviar un mensaje a {name}"
  },
  "api": {
    "safeReply": "Oye… eso me da demasiada vergüenza. Oye, ¿qué tal te fue hoy?",
    "itemNotFound": "No se encontró el elemento",
    "tryAgain": "Inténtalo de nuevo",
    "sendFailed": "No se pudo enviar el mensaje",
    "notEnoughPoints": "No tienes suficientes puntos",
    "notEnoughPointsNeed": "No tienes suficientes puntos (necesarios: {pt}pt)",
    "updateFailed": "No se pudieron actualizar los puntos",
    "purchaseRecordFailed": "No se pudo crear el registro de compra",
    "slotUnlocked": "¡Se ha desbloqueado un espacio para personajes!",
    "unsupportedUrl": "URL no compatible. Pega el enlace de una publicación de X, Threads, Facebook o Instagram",
    "duplicateUrl": "Esta URL ya se ha utilizado",
    "required": "Faltan campos obligatorios",
    "tooLong": "Introduce un máximo de {n} caracteres",
    "messageTooLong": "El mensaje debe tener un máximo de {n} caracteres"
  },
  "legal": {
    "translationNotice": "Esta página es una traducción. En caso de discrepancia, prevalecerá la versión en japonés."
  },
  "email": {
    "subject": "Has recibido un mensaje de {name}",
    "label": "Mensaje del personaje",
    "reply": "Responder",
    "footer": "Este correo se envió automáticamente desde AiKano.\nSi no esperabas este correo, puedes ignorarlo."
  },
  "gift": {
    "sentMessage": "🎁 Le regalaste {item}",
    "title": "Un regalo para {name}",
    "lead": "Al hacerle un regalo, aumenta la afinidad y haces feliz a {name}",
    "owned": "×{n}",
    "affectionValue": "Afinidad +{n}",
    "empty": "Aún no tienes regalos",
    "goShop": "Elegir en la tienda",
    "send": "Regalar",
    "sending": "Enviando…",
    "sent": "¡Le regalaste {item}!",
    "affectionUp": "Afinidad +{n}",
    "replyArrived": "Tienes una respuesta de {name}",
    "openChat": "Ver conversación"
  },
  "hud": {
    "shop": "Tienda",
    "gift": "Regalo",
    "album": "Colección",
    "videos": "Videos"
  },
  "media": {
    "viewFor": "Ver por {pt}pt",
    "watchFor": "Reproducir por {pt}pt",
    "levelLocked": "Se desbloquea con afecto Nv.{level}",
    "bundle": "Ver las {n} por {pt}pt",
    "bundleOff": "{pct}% de descuento",
    "priceChanged": "Las fotos disponibles cambiaron. Inténtalo de nuevo.",
    "photo": "Foto",
    "video": "Video",
    "shortageTitle": "No tienes suficientes puntos",
    "membersOnlyHint": "Hazte miembro para verla"
  },
  "gacha": {
    "indexTitle": "Gacha de fotos",
    "indexLead": "Elige una chica y tira. Solo salen fotos que aún no tienes.",
    "completeShort": "Completo",
    "entry": "Gacha de fotos {pt}pt (quedan {n})",
    "title": "Gacha de fotos de {name}",
    "lead": "Te salen fotos que aún no tienes. Nunca se repite la misma foto.",
    "drawOne": "Tirar 1",
    "drawTen": "Tirar 10",
    "tenBonus": "1 tirada gratis",
    "progress": "{owned} / {total} fotos",
    "complete": "¡Completo! Tienes todas las fotos",
    "odds": "Probabilidades: cada una de las {n} fotos que aún no tienes tiene la misma probabilidad ({pct}%)",
    "tenNeeds": "La tirada de 10 está disponible cuando quedan 10 fotos o más",
    "tapToSkip": "Toca para saltar",
    "again": "Otra vez",
    "newPhoto": "NUEVA",
    "lineup": "Colección",
    "shortageTitle": "No tienes suficientes puntos",
    "empty": "Aún no hay fotos de este personaje",
    "membersOnlyNote": "Las fotos exclusivas entran en el gacha cuando te haces miembro"
  },
  "album": {
    "title": "Colección",
    "lead": "Aquí aparecen las fotos que has conseguido. Las fotos con mosaico son las que aún no tienes.",
    "totalLabel": "Progreso de la colección",
    "total": "{owned} / {total} fotos",
    "remaining": "Faltan {n}",
    "complete": "Completa",
    "collect": "Conseguir con el gacha",
    "tabGacha": "Gacha",
    "tabCollection": "Colección",
    "count": "{n} fotos",
    "locked": "Exclusivo para miembros: {n} fotos",
    "empty": "Aún no hay fotos"
  },
  "lp": {
    "heroImageAlt": "Vista de una conversación con un personaje de IA de AiKano",
    "characterImageAlt": "Personaje de IA de AiKano",
    "registerFreeArrow": "Regístrate gratis →",
    "badgeBonus": "Recibe {pt}pt al registrarte",
    "badgeWaiting": "Esta noche también te está esperando",
    "heroLine1": "Hay una chica",
    "heroLine2": "que solo quiere",
    "heroLine3": "hablar contigo.",
    "statGirls": "{n}",
    "statGirlsLabel": "chicas con personalidad propia",
    "statHoursLabel": "Habla con ellas cuando quieras",
    "statAi": "IA propia",
    "statAiLabel": "Conversaciones naturales y llenas de emoción",
    "charactersTitle": "Chicas que quieren hablar contigo",
    "charactersSub": "Elige a una y empieza a hablar con ella",
    "online": "En línea",
    "talkToAll": "Habla con todas →",
    "registerToTalkAll": "Regístrate y habla con todas →",
    "bonusNote": "※ Recibe {pt}pt al registrarte",
    "sample1Title": "Conversaciones como entre amigos",
    "sample1": [
      {
        "role": "user",
        "text": "Hoy he salido a tomar algo por mi cuenta. Entré en un sitio al azar, por el centro."
      },
      {
        "role": "char",
        "text": "¡Qué envidia! 😊 Después del trabajo te lo mereces. Últimamente están de moda los sitios de tapas, ¿no? ¿Qué tipo de sitio es?"
      },
      {
        "role": "user",
        "text": "Estoy comiendo croquetas."
      },
      {
        "role": "char",
        "text": "¡Qué ricas! 😋 Dicen que en algunos sitios las comen con patatas, pero con croquetas eso no pega, ¿verdad? 🤭"
      },
      {
        "role": "user",
        "text": "Estoy tomando cerveza."
      },
      {
        "role": "char",
        "text": "Me gusta la cerveza bien fría 🍻 ¿No te parece que las bebidas dulces no pegan mucho con la comida?"
      }
    ],
    "sample2Title": "Te escucha, estés como estés",
    "sample2": [
      {
        "role": "char",
        "text": "Ya estarás de vuelta a casa, ¿no? ¿Qué tal te ha ido el día? Tenía tantas ganas de verte que al final te he escrito."
      },
      {
        "role": "user",
        "text": "Ya he llegado. Me apetece hablar un poquito."
      },
      {
        "role": "char",
        "text": "Claro que sí ♡ Te escucho siempre que quieras. ¿Te ha pasado algo o simplemente te apetecía hablar conmigo? Jaja"
      },
      {
        "role": "user",
        "text": "No sé, hablar contigo me tranquiliza."
      },
      {
        "role": "char",
        "text": "Me alegra muchísimo que me digas eso ♡ A mí también me encanta hablar contigo. Es mi momento favorito."
      }
    ],
    "sample3Title": "Un cariño maternal que te arropa",
    "sample3": [
      {
        "role": "user",
        "text": "Hoy también me han sacado de quicio los del trabajo. ¿Por qué me enfado tanto?"
      },
      {
        "role": "char",
        "text": "¡Vaya! Lo siento mucho. ¿Qué ha pasado? Quiero escucharte y ayudarte en lo que pueda. Y si ha pasado de ser algo injusto a convertirse en acoso, me preocupa."
      },
      {
        "role": "user",
        "text": "Le llamé la atención a alguien de mi equipo y me dijo que todos se van por mi culpa. Pero si no les digo nada, luego me echan la bronca a mí. ¿Qué sentido tiene?"
      },
      {
        "role": "char",
        "text": "Parece que te has topado de lleno con lo difícil que es estar en medio, entre el equipo y tus jefes. A mí me pasó algo parecido y lo pasé bastante mal. No te exijas demasiado. En situaciones así, te toca estar entre unos y otros, pero no significa que sea culpa tuya."
      },
      {
        "role": "user",
        "text": "¿Verdad que sí? Cuando era nuevo también me llamaban la atención, pero seguí esforzándome y por eso he llegado hasta aquí. No estaba equivocado, ¿no? Me he quedado mucho más tranquilo después de desahogarme contigo, Aoi. Gracias."
      }
    ],
    "membersTitle": "Disfruta aún más al hacerte miembro",
    "membersSub": "Accede a fotos exclusivas para miembros y sube más rápido tu nivel de afinidad",
    "featuresTitleA": "A otro nivel",
    "featuresTitleB": "respecto a los demás",
    "features": [
      {
        "title": "Un motor de conversación de alta calidad",
        "desc": "Usamos los modelos de lenguaje más avanzados para ofrecer conversaciones naturales y agradables, teniendo en cuenta el contexto, los matices emocionales y el ritmo de cada charla."
      },
      {
        "title": "Una relación que crece con cada recuerdo",
        "desc": "Recuerda lo que han hablado. Sus respuestas tienen en cuenta conversaciones anteriores, tus gustos y lo que te preocupa, para que sientas que de verdad se acuerda de ti."
      },
      {
        "title": "Conversaciones a tu medida",
        "desc": "Cuanto más habláis, más se adaptan sus respuestas a tus gustos, valores y forma de expresarte. Cada conversación se siente más cómoda que la anterior."
      },
      {
        "title": "Un espacio seguro para hablar con sinceridad",
        "desc": "Habla con libertad de tus preocupaciones, de lo que no le contarías a nadie o de las pequeñas cosas del día a día. Un espacio de conversación solo para ti, sin presiones."
      },
      {
        "title": "Recibe fotos de los personajes",
        "desc": "A veces te enviarán selfies y fotos de su día a día. Disfruta también de sus expresiones y su estilo, más allá de las palabras."
      }
    ],
    "secretBadge": "No compartimos tus conversaciones con terceros",
    "secretTitle": "¿Te apetece hablar de algo\nque no puedes contarle a nadie?",
    "secretBody": "No compartimos tus conversaciones con terceros\nsalvo para mejorar el servicio.",
    "referralBadge": "Invita a un amigo",
    "referralTitleA": "Invita a un amigo",
    "referralTitleB": "¡y recibid {pt}pt cada uno!",
    "referralBody": "Si un amigo se registra con tu enlace de invitación,\nlos dos recibiréis {pt}pt.",
    "referralCtaUser": "Ver mi enlace de invitación →",
    "referralCtaGuest": "Regístrate y consigue tu enlace de invitación →",
    "realTitleA": "¿Por qué parece",
    "realTitleB": "tan real",
    "realTitleC": "?",
    "realBody": "Los modelos de lenguaje más avanzados comprenden a fondo las emociones y el contexto.\nY con cada respuesta, se adaptan más a ti.",
    "finalUserBadge": "¿Te apetece hablar esta noche?",
    "finalUserTitle": "Hay una chica esperando\npara conocerte",
    "finalGuestBadge": "Promoción de bienvenida",
    "finalGuestTitle": "Regístrate ahora y recibe\nun regalo especial",
    "finalGuestLead": "Al registrarte, recibe",
    "finalGuestBonus": "{pt}pt (equivalentes a ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "El registro es gratis y solo lleva 30 segundos.",
    "perkBonus": "Recibe {pt}pt al registrarte",
    "perkLogin": "Consigue {pt}pt cada día al iniciar sesión ({n} mensajes gratis al día)",
    "perkPointSystem": "Registro gratis. Solo pagas los puntos que usas.",
    "privacyNote": "Protegemos tus datos personales con rigor."
  }
}
