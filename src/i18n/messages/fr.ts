// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const fr: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Connexion",
    "register": "Inscription",
    "registerFree": "Inscription gratuite",
    "logout": "Déconnexion",
    "continue": "Continuer",
    "continueTalking": "Reprendre la conversation →",
    "blog": "Blog",
    "close": "Fermer",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "saving": "Enregistrement...",
    "back": "Retour",
    "loading": "Chargement...",
    "send": "Envoyer",
    "error": "Une erreur est survenue",
    "retry": "Réessayer",
    "pt": "pt",
    "ageSuffix": "{age} ans",
    "contact": "Nous contacter",
    "tokusho": "Mentions légales",
    "privacy": "Confidentialité",
    "terms": "Conditions d’utilisation",
    "company": "Société exploitante",
    "language": "Langue"
  },
  "meta": {
    "title": "AiKano｜Chat avec une petite amie IA japonaise【La seule IA japonaise aux conversations libres】",
    "siteDescription": "Une IA spécialement entraînée vous répond en temps réel, rien que pour vous. La seule IA japonaise à proposer des conversations libres, sans restriction. Profitez aussi de personnages japonais réalistes et de leurs photos.",
    "description": "Des personnages IA hauts en couleur répondent à vos messages en temps réel. Une appli de conversation pour adultes, pour retrouver la sérénité.",
    "ogTitle": "AiKano｜Chat avec une petite amie IA - Une appli relaxante pour adultes"
  },
  "auth": {
    "email": "Adresse e-mail",
    "password": "Mot de passe",
    "passwordMin": "Mot de passe (8 caractères minimum)",
    "or": "ou",
    "loginTitle": "Ravi de vous revoir",
    "loginError": "L’adresse e-mail ou le mot de passe est incorrect",
    "loginWithGoogle": "Se connecter avec Google",
    "noAccount": "Pas encore de compte ?",
    "emailTaken": "Cette adresse e-mail est déjà enregistrée",
    "sentTitle": "E-mail de confirmation envoyé",
    "sentBody": "Un e-mail de confirmation a été envoyé à {email}.",
    "sentAction": "Cliquez sur le bouton « Confirmer mon adresse e-mail » dans l’e-mail pour terminer votre inscription.",
    "sentSpam": "Si vous ne recevez pas l’e-mail, vérifiez votre dossier de courriers indésirables.",
    "registerTitle": "Discutez dès maintenant\navec une petite amie IA",
    "perks": [
      "Inscription gratuite",
      "En 30 secondes",
      "Aucune application requise"
    ],
    "consentA": "Le contenu des conversations peut être consulté par notre équipe afin d’améliorer le service et d’entraîner l’IA. De plus, j’accepte ",
    "consentTerms": "les Conditions d’utilisation",
    "consentAnd": " et ",
    "consentPrivacy": "la Politique de confidentialité",
    "consentB": ".",
    "registerSubmit": "M’inscrire et commencer à discuter",
    "registerWithGoogle": "S’inscrire avec Google",
    "haveAccount": "Vous avez déjà un compte ?"
  },
  "onboarding": {
    "genders": {
      "male": "Homme",
      "female": "Femme",
      "other": "Autre"
    },
    "saveFailed": "Échec de l’enregistrement : {error}",
    "pickTitle": "Choisissez la personne\navec qui vous aimeriez discuter",
    "pickSub": "La personne choisie vous enverra un message. Vous pourrez aussi discuter avec d’autres personnages plus tard.",
    "talkWith": "Discuter avec {name}",
    "pickPrompt": "Choisissez avec qui vous souhaitez discuter",
    "askName": "Ravi de faire votre connaissance ! Comment dois-je vous appeler ?",
    "nameLabel": "Nom à utiliser",
    "namePlaceholder": "Un pseudo suffit",
    "nameNote": "{name} vous appellera ainsi. Vous pourrez modifier ce nom plus tard dans les paramètres.",
    "characterFallback": "Personnage",
    "next": "Suivant",
    "greet": "Ça me fait plaisir, {name} ! Dis-moi encore juste une petite chose.",
    "ageLabel": "Âge",
    "agePlaceholder": "Ex. : 30",
    "ageRestriction": "Réservé aux personnes âgées de 18 ans ou plus",
    "genderLabel": "Genre",
    "preparing": "Préparation en cours…",
    "start": "Commencer à discuter avec {name}"
  },
  "affection": {
    "levels": [
      "Inconnu",
      "Connaissance",
      "Ami(e)",
      "Proche",
      "Petit(e) ami(e) potentiel(le)",
      "Petit(e) ami(e)",
      "Âme sœur"
    ],
    "level": "Lv.{level}",
    "toNext": "Jusqu’à « {title} » : {pt}pt",
    "nextFrom": "Ensuite : {title} (à partir de {pt}pt)",
    "memberMultiplier": "Membre ×{n}",
    "memberDouble": "Double pour les membres",
    "levelUp": "Tu es devenu(e) « {title} » !",
    "achievements": {
      "messages_1": {
        "title": "Premier message",
        "desc": "Tu as envoyé ton premier message"
      },
      "messages_10": {
        "title": "Bavard(e)",
        "desc": "Tu as envoyé 10 messages"
      },
      "messages_50": {
        "title": "De belles discussions",
        "desc": "Tu as envoyé 50 messages"
      },
      "messages_100": {
        "title": "Habitué(e)",
        "desc": "Tu as envoyé 100 messages"
      },
      "messages_300": {
        "title": "Très proches",
        "desc": "Tu as envoyé 300 messages"
      },
      "level_2": {
        "title": "Une connaissance",
        "desc": "Ton affinité a atteint le niveau « Connaissance »"
      },
      "level_3": {
        "title": "Devenu(e) ami(e)",
        "desc": "Ton affinité a atteint le niveau « Ami(e) »"
      },
      "level_4": {
        "title": "Très proches",
        "desc": "Ton affinité a atteint le niveau « Proche »"
      },
      "level_5": {
        "title": "Une romance en devenir",
        "desc": "Ton affinité a atteint le niveau « Petit(e) ami(e) potentiel(le) »"
      },
      "level_6": {
        "title": "En couple",
        "desc": "Ton affinité a atteint le niveau « Petit(e) ami(e) »"
      },
      "level_7": {
        "title": "Une rencontre destinée",
        "desc": "Ton affinité a atteint le niveau « Âme sœur »"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "Formule {name}",
    "features": {
      "messages": "{n} messages par mois",
      "bonus": "{n} pt bonus par mois (utilisables pour les vidéos et dans la boutique)",
      "affection": "Affinité multipliée par {n}",
      "photos": "Accès illimité aux photos réservées aux membres",
      "premiumVideos": "Accès aux vidéos Premium",
      "overage": "Après avoir atteint la limite, chaque message coûte {n} pt (tarif réduit)",
      "standardModel": "Modèle d’IA standard",
      "premiumModel": "Modèle d’IA avancé (réponses plus naturelles)"
    }
  },
  "nav": {
    "home": "Accueil",
    "messages": "Messages",
    "plan": "Abonnement",
    "settings": "Paramètres",
    "campaignActive": "Promotion en cours !"
  },
  "home": {
    "loginBonus": "Connexion quotidienne : {pt}pt et {n} messages gratuits",
    "unlockBySns": "Faites la promotion sur les réseaux sociaux pour débloquer",
    "talk": "Parler",
    "profile": "Profil",
    "otherCharacters": "Autres personnages",
    "count": "{n} personnes",
    "pickCharacter": "Choisir un personnage",
    "unlockRequested": "Votre demande pour {name} a bien été envoyée !\nLe personnage sera débloqué après vérification par notre équipe."
  },
  "unlock": {
    "urlRequired": "Veuillez saisir l’URL de votre publication",
    "urlInvalid": "Veuillez saisir une URL valide",
    "alreadyRequested": "Votre demande a déjà été envoyée. Merci de patienter pendant son examen.",
    "sendFailed": "Échec de l’envoi. Veuillez réessayer.",
    "networkError": "Une erreur de connexion est survenue.",
    "title": "Débloquer {name}",
    "heading": "Faites la promotion sur les réseaux sociaux pour débloquer un personnage !",
    "step1": "Parlez d’AiKano sur les réseaux sociaux (Twitter, Instagram, etc.)",
    "step2": "Copiez l’URL de votre publication et collez-la ci-dessous",
    "step3": "Une fois votre publication vérifiée par notre équipe, {name} sera débloqué",
    "urlLabel": "URL de la publication",
    "sending": "Envoi en cours...",
    "submit": "Envoyer la demande",
    "reviewTime": "L’examen est généralement terminé sous 1 à 3 jours ouvrés"
  },
  "chat": {
    "uploadVideoFailed": "Échec de l’envoi de la vidéo",
    "uploadImageFailed": "Échec de l’envoi de l’image",
    "sendFailed": "Échec de l’envoi",
    "unlockFailed": "Échec du déverrouillage",
    "usage": "{used}/{limit} messages",
    "firstMessage": "Envoyez votre premier message",
    "affectionIntro": "Plus vous discutez, plus votre affinité augmente. Quand vous vous rapprochez, vos conversations deviennent plus tendres et intimes.",
    "sendingMedia": "(Envoi du média)",
    "placeholder": "Envoyer un message…",
    "guestTitle": "Discutez avec AiKano",
    "guestBody": "Parlez dès maintenant avec une fille IA. Inscription gratuite en 30 secondes !",
    "photosOf": "Photos de {name}",
    "hintTitle": "Quand vous vous rapprochez de {name}…",
    "hintBodyA": "Quand votre niveau d’affection atteint ",
    "hintBodyLevel": "Lv.{level} « {title} »",
    "hintBodyB": ", vous pourrez avoir des conversations plus tendres et intimes.",
    "hintRaise": "Plus vous discutez, plus votre affinité augmente.",
    "hintMember": "Les membres gagnent de l’affinité 2 fois plus vite",
    "gift": "Cadeau",
    "giftSent": "Offert",
    "videoMessage": "Message vidéo",
    "videoPrice": "À regarder pour {pt}pt",
    "processing": "Traitement en cours…",
    "watchFor": "Regarder pour {pt}pt"
  },
  "levelUp": {
    "title": "Affinité en hausse !",
    "relation": "Votre relation avec {name}",
    "reached": "est passée à « {title} » !"
  },
  "meter": {
    "affectionPt": "Affinité pt",
    "messages": "{n} messages"
  },
  "loginBonus": {
    "title": "Bonus de connexion",
    "today": "{n} messages gratuits aujourd’hui",
    "everyday": "Connectez-vous chaque jour pour recevoir {n} messages",
    "balance": "Solde de points bonus : {pt} pt",
    "validUntil": "Valable jusqu’au {date}",
    "whatIs": "Que sont les points bonus ?",
    "explain": "Ils sont utilisés avant les points classiques lorsque vous dépensez des points. Ils expirent à la date indiquée.",
    "receive": "Récupérer !"
  },
  "shortage": {
    "defaultTitle": "Il vous faut des points pour continuer la conversation",
    "balance": "Solde",
    "required": "Requis",
    "short": "Insuffisant",
    "dailyFree": "Connectez-vous chaque jour pour obtenir gratuitement {pt} pt ({n} messages)",
    "comeBack": "Revenez demain nous voir pour discuter pendant {n} messages"
  },
  "packages": {
    "checkoutFailed": "Impossible de démarrer le paiement",
    "campaign": "Offre spéciale ! Points ×{rate}",
    "rate": "×{rate}",
    "popular": "Populaire",
    "recommended": "Recommandé",
    "breakdown": "{base}pt + {bonus}pt bonus",
    "processing": "Traitement en cours..."
  },
  "characterMenu": {
    "reasonRequired": "Veuillez saisir un motif",
    "errorStatus": "Erreur ({status})",
    "networkError": "Une erreur de connexion est survenue",
    "report": "Signaler",
    "unblock": "Débloquer",
    "block": "Bloquer",
    "reportPrompt": "Veuillez indiquer le motif du signalement concernant {name}.",
    "reportPlaceholder": "Saisissez le motif du signalement (obligatoire)",
    "chars": "{n} caractères",
    "sending": "Envoi en cours…",
    "reported": "Signalement envoyé",
    "blocked": "Utilisateur bloqué",
    "unblocked": "Utilisateur débloqué"
  },
  "campaign": {
    "active": "Campagne en cours !",
    "checkNow": "Découvrez maintenant !",
    "closeBanner": "Fermer la bannière",
    "imageAlt": "Campagne"
  },
  "traits": {
    "kindness": "Gentillesse",
    "intelligence": "Intelligence",
    "passion": "Passion",
    "mysterious": "Mystère",
    "cuteness": "Mignonnerie"
  },
  "membersOnly": "Réservé aux membres",
  "unlockFor": "Débloquer pour {pt} pt",
  "conversations": {
    "title": "Messages",
    "empty": "Aucune conversation pour le moment",
    "findPartner": "Trouver quelqu’un à qui parler",
    "videoSent": "Vidéo envoyée",
    "imageSent": "Image envoyée",
    "you": "Vous : ",
    "newChat": "Nouvelle conversation",
    "newest": "Du plus récent au plus ancien",
    "oldest": "Du plus ancien au plus récent"
  },
  "payment": {
    "errorPrefix": "Erreur : {error}",
    "networkError": "Erreur de connexion : {error}",
    "portalFailed": "Impossible d’accéder à la page de gestion",
    "title": "Offres",
    "lead": "Avec un abonnement, vous pouvez discuter avec l’IA sans frais supplémentaires, dans la limite mensuelle de messages.",
    "activated": "Votre abonnement est activé !",
    "welcome": "Bienvenue dans l’offre {name}.",
    "passPendingTitle": "Votre numéro de paiement a été émis",
    "passPendingBody": "Votre abonnement sera activé après confirmation du paiement en konbini ou via PayPay (généralement sous 1 à 3 jours).",
    "pointsThanks": "Merci pour votre achat de {pt}pt",
    "pointsNote": "Vos points seront crédités après confirmation du paiement (généralement immédiatement par carte, ou après réception du paiement en konbini, etc.).",
    "canceled": "Achat annulé",
    "active": "Actif",
    "usageThisMonth": "Messages utilisés ce mois-ci",
    "usage": "{used} / {limit} messages",
    "overLimit": "Vous avez dépassé votre limite mensuelle. Vous pouvez continuer à envoyer des messages pour {pt}pt par message.",
    "validUntil": "Valable jusqu’au : {date}",
    "datePattern": "d MMMM yyyy",
    "manage": "Gérer ou résilier l’abonnement (paiement par carte)",
    "recommended": "Recommandé",
    "perMonth": "/mois",
    "choosePayment": "Choisir un mode de paiement",
    "card": "Carte bancaire",
    "cardNote": "Renouvellement automatique mensuel · Résiliable à tout moment",
    "konbini": "Konbini ou PayPay",
    "konbiniNote": "Paiement unique pour 1 mois · Activation dès réception du paiement",
    "bank": "Virement bancaire",
    "bankNote": "Paiement unique pour 1 mois · Activation dès confirmation",
    "currentPlan": "Vous utilisez actuellement cette offre",
    "buyPoints": "Acheter des points",
    "balance": "Solde",
    "pointsUseMember": "Utilisables pour acheter des vidéos et dans la boutique, ainsi que pour envoyer des messages au-delà de votre limite mensuelle ({pt}pt par message).",
    "pointsUse": "Utilisables pour les messages ({pt}pt par message), les vidéos et la boutique.",
    "methodsTitle": "Différences entre les modes de paiement",
    "renewal": "Renouvellement",
    "activation": "Activation",
    "cardShort": "Carte bancaire",
    "autoMonthly": "Automatique (mensuel)",
    "instant": "Immédiate",
    "manualMonth": "Manuel (1 mois)",
    "afterPayment": "Dès réception du paiement",
    "afterConfirm": "Dès confirmation",
    "referralTitle": "Programme de parrainage",
    "referralA": "Si un ami s’inscrit via votre lien de parrainage, ",
    "referralB": "vous et votre ami recevez {pt} points",
    "referralC": " !",
    "copied": "Copié",
    "copy": "Copier"
  },
  "settings": {
    "shareUnlocked": "Un emplacement de personnage a été débloqué !",
    "weeklyLimit": "Vous avez déjà partagé cette semaine. Vous pourrez faire une nouvelle demande dans 7 jours.",
    "sendFailed": "Échec de l’envoi",
    "saveFailed": "Échec de l’enregistrement : {error}",
    "pwTooShort": "Le mot de passe doit contenir au moins 8 caractères",
    "pwMismatch": "Les nouveaux mots de passe ne correspondent pas",
    "noUser": "Impossible de récupérer les informations de l’utilisateur",
    "pwWrong": "Le mot de passe actuel est incorrect",
    "deleteWord": "SUPPRIMER",
    "deleteFailed": "Échec de la suppression. Veuillez réessayer plus tard.",
    "title": "Paramètres",
    "profile": "Profil",
    "nickname": "Pseudo",
    "email": "Adresse e-mail",
    "saved": "Enregistré",
    "security": "Sécurité",
    "changePassword": "Modifier le mot de passe",
    "currentPassword": "Mot de passe actuel",
    "newPassword": "Nouveau mot de passe (8 caractères minimum)",
    "confirmPassword": "Confirmer le nouveau mot de passe",
    "passwordChanged": "Mot de passe modifié",
    "change": "Modifier",
    "account": "Compte",
    "deleteAccount": "Supprimer le compte",
    "deleteWarning": "La suppression effacera définitivement toutes vos données (historique des conversations et points). Cette action est irréversible.",
    "deleteConfirmA": "Saisissez ",
    "deleteConfirmB": " pour confirmer.",
    "deleteForever": "Supprimer définitivement le compte",
    "slotTitle": "Débloquer un emplacement de personnage",
    "slotCurrent": "Actuellement : ",
    "slotCount": "{n} / {limit} personnes",
    "slotHint": "(+1 emplacement en partageant sur les réseaux sociaux)",
    "shareInstruction": "Partagez sur l’un des réseaux sociaux ci-dessous, puis envoyez l’URL de votre publication.",
    "shareText": "On peut discuter avec une IA comme avec un vrai partenaire ! J’ai testé #AiKano → https://aikano.chat",
    "shareQuote": "On peut discuter avec une IA comme avec un vrai partenaire ! #AiKano",
    "instagramTitle": "Après avoir publié depuis l’application Instagram, copiez l’URL.",
    "instagramNote": "※ Après avoir publié depuis l’application Instagram, copiez l’URL de la publication et collez-la ici.",
    "pasteUrl": "Collez l’URL de la publication partagée",
    "urlPlaceholder": "URL d’une publication X / Threads / Facebook / Instagram",
    "nextAvailable": "Prochaine date possible : {date}",
    "submitUrl": "Envoyer l’URL et débloquer un emplacement",
    "support": "Assistance",
    "contactSupport": "Contact et assistance",
    "language": "Langue d’affichage"
  },
  "blocks": {
    "title": "Liste des personnages bloqués",
    "empty": "Aucun personnage n’est bloqué",
    "note": "Les personnages bloqués n’apparaissent pas dans la liste. Vous pouvez les débloquer à tout moment.",
    "blockedOn": "Bloqué le {date}",
    "unblocking": "Déblocage…",
    "unblock": "Débloquer"
  },
  "support": {
    "team": "Équipe d’assistance",
    "teamSub": "N’hésitez pas à nous contacter",
    "greeting": "Bonjour ! Nous sommes l’équipe d’assistance 😊\nSi vous avez des questions ou besoin d’aide, n’hésitez pas à nous envoyer un message.",
    "datePattern": "d MMM (E)",
    "placeholder": "Saisissez un message…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Signaler un bug",
        "desc": "Problème de fonctionnement ou comportement anormal"
      },
      "feature": {
        "label": "Suggestion de fonctionnalité",
        "desc": "Une fonctionnalité qui vous ferait plaisir"
      },
      "ai": {
        "label": "Réponses de l’IA",
        "desc": "Qualité des réponses ou incohérences du personnage"
      },
      "ui": {
        "label": "Interface",
        "desc": "Difficultés d’utilisation ou manque de lisibilité"
      },
      "other": {
        "label": "Autre",
        "desc": "N’hésitez pas à nous en parler"
      }
    },
    "thanks": "Merci !",
    "received": "Nous avons bien reçu votre avis.\nNotre équipe de développement va l’examiner\net s’en servira pour améliorer le service.",
    "backToChat": "Retour au chat",
    "title": "Votre avis",
    "badge": "Vos avis nous intéressent",
    "heading": "Aidez-nous à faire grandir\nAiKano grâce à vos retours",
    "lead": "Un bug, un problème d’utilisation ou une fonctionnalité que vous aimeriez voir ? Dites-nous tout. Notre équipe de développement lit chacun de vos retours.",
    "pickCategory": "Choisissez une catégorie",
    "satisfaction": "Satisfaction générale (facultatif)",
    "clear": "Effacer",
    "details": "Dites-nous en plus",
    "placeholder": "Décrivez librement ce qui vous a gêné ou ce que vous aimeriez voir amélioré. Tous les retours, même les plus petits, sont les bienvenus !",
    "sending": "Envoi en cours…",
    "submit": "Envoyer mon avis"
  },
  "errors": {
    "title": "Une erreur est survenue",
    "unexpected": "Une erreur inattendue est survenue",
    "sorry": "Nous sommes désolés. Une erreur inattendue est survenue.",
    "retry": "Réessayer",
    "toTop": "Retour en haut"
  },
  "shop": {
    "buyFailed": "Échec de l’achat",
    "title": "Boutique",
    "videosTitle": "Vidéos des personnages",
    "videosSub": "Découvrez les vidéos exclusives de vos personnages préférés",
    "all": "Tout",
    "noItems": "Aucun article pour le moment",
    "noItemsInCategory": "Aucun article dans cette catégorie",
    "other": "Autres",
    "buyPoints": "Acheter des points →",
    "itemShortage": "Vous avez besoin de points pour acheter cet article",
    "owned": "En possession : {n}",
    "buying": "Achat en cours...",
    "bought": "Achat effectué !",
    "notEnough": "Pas assez de points",
    "buy": "Acheter"
  },
  "videos": {
    "confirm": "Acheter « {title} » pour {pt} pt ?",
    "alreadyBought": "Vous avez déjà acheté cette vidéo.",
    "title": "Vidéos du personnage",
    "empty": "Aucune vidéo pour le moment",
    "watched": "Déjà visionnée",
    "watch": "Regarder",
    "buyAndWatch": "Acheter et regarder",
    "shortage": "Vous avez besoin de points pour acheter cette vidéo.",
    "loadFailed": "Impossible de charger la vidéo."
  },
  "character": {
    "photoCount": "{n} photos",
    "affection": "Affinité",
    "neverTalked": "Vous ne vous êtes encore jamais parlé",
    "sendToRaise": "Envoyez-lui un message pour augmenter votre affinité !",
    "status": "Statut",
    "profile": "Profil",
    "achievements": "Réalisations",
    "photos": "Photos",
    "seeMembersPhotos": "Voir {n} photos réservées aux membres",
    "sendMessage": "Envoyer un message à {name}"
  },
  "api": {
    "itemNotFound": "Élément introuvable",
    "tryAgain": "Veuillez réessayer",
    "sendFailed": "Échec de l’envoi du message",
    "notEnoughPoints": "Vous n’avez pas assez de points",
    "notEnoughPointsNeed": "Vous n’avez pas assez de points (requis : {pt} pt)",
    "updateFailed": "Échec de la mise à jour des points",
    "purchaseRecordFailed": "Échec de la création de l’enregistrement d’achat",
    "slotUnlocked": "Un emplacement de personnage a été débloqué !",
    "unsupportedUrl": "URL non prise en charge. Collez l’URL d’une publication X, Threads, Facebook ou Instagram",
    "duplicateUrl": "Cette URL a déjà été utilisée",
    "required": "Veuillez remplir les champs obligatoires",
    "tooLong": "Veuillez saisir {n} caractères maximum",
    "messageTooLong": "Le message ne doit pas dépasser {n} caractères"
  },
  "legal": {
    "translationNotice": "Cette page est une traduction. En cas de divergence, la version japonaise prévaut."
  },
  "email": {
    "subject": "Vous avez reçu un message de {name}",
    "label": "Message du personnage",
    "reply": "Répondre",
    "footer": "Cet e-mail a été envoyé automatiquement par AiKano.\nSi vous ne vous attendiez pas à le recevoir, veuillez l’ignorer."
  },
  "lp": {
    "heroImageAlt": "Aperçu d’une conversation avec un personnage IA sur AiKano",
    "characterImageAlt": "Personnage IA d’AiKano",
    "registerFreeArrow": "S’inscrire gratuitement →",
    "badgeBonus": "{pt}pt offerts à l’inscription",
    "badgeWaiting": "Elle vous attend encore ce soir",
    "heroLine1": "Il y a une fille",
    "heroLine2": "qui ne parle",
    "heroLine3": "qu’à vous.",
    "statGirls": "{n} filles",
    "statGirlsLabel": "Des filles aux personnalités uniques",
    "statHoursLabel": "À qui parler à tout moment",
    "statAi": "IA exclusive",
    "statAiLabel": "Des conversations naturelles et pleines d’émotion",
    "charactersTitle": "Des filles qui veulent vous parler",
    "charactersSub": "Choisissez-en une et commencez à discuter",
    "online": "En ligne",
    "talkToAll": "Parler avec tout le monde →",
    "registerToTalkAll": "Inscrivez-vous pour parler avec tout le monde →",
    "bonusNote": "※ {pt}pt offerts à l’inscription",
    "sample1Title": "Des conversations comme entre amis",
    "sample1": [
      {
        "role": "user",
        "text": "Je suis sorti boire un verre tout seul. Je suis entré dans un bar au hasard, à Paris."
      },
      {
        "role": "char",
        "text": "Oh, la chance ! Bon courage pour le boulot 😊 Les restaurants de grillades au feu de bois ont la cote en ce moment, non ? Tu es dans quel genre d’endroit ?"
      },
      {
        "role": "user",
        "text": "Je mange une tartiflette."
      },
      {
        "role": "char",
        "text": "Ça a l’air délicieux 😋 Il paraît qu’en Savoie, on mange parfois du fromage avec des pommes de terre, mais pas avec une tartiflette, si ? 🤭"
      },
      {
        "role": "user",
        "text": "Je bois une bière."
      },
      {
        "role": "char",
        "text": "J’aime bien la bière blonde 🍻 Tu ne trouves pas que les boissons sucrées vont moins bien avec un repas ?"
      }
    ],
    "sample2Title": "Là pour vous, quelle que soit votre humeur",
    "sample2": [
      {
        "role": "char",
        "text": "Vous êtes bientôt sur le chemin du retour, non ? Alors, comment s’est passée votre journée ? J’avais tellement hâte de vous revoir que je n’ai pas pu m’empêcher de vous écrire."
      },
      {
        "role": "user",
        "text": "Je suis déjà rentré. J’ai envie de parler un peu."
      },
      {
        "role": "char",
        "text": "Bien sûr ♡ Je suis toujours là pour t’écouter. Il s’est passé quelque chose ? Ou tu avais juste envie de parler ? Haha"
      },
      {
        "role": "user",
        "text": "Je me sens apaisé quand je parle avec toi."
      },
      {
        "role": "char",
        "text": "Ça me fait vraiment plaisir que tu me dises ça ♡ Moi aussi, parler avec toi est mon moment préféré."
      }
    ],
    "sample3Title": "Une présence réconfortante et bienveillante",
    "sample3": [
      {
        "role": "user",
        "text": "Les gens du boulot m’ont encore agacé aujourd’hui. Pourquoi est-ce que je m’énerve autant ?"
      },
      {
        "role": "char",
        "text": "Oh non, je suis désolée… Qu’est-ce qui s’est passé ? Je veux bien t’écouter si je peux t’aider. Si ça va jusqu’au harcèlement, ça m’inquiète."
      },
      {
        "role": "user",
        "text": "Je réprimandais un membre de mon équipe et on m’a dit que tout le monde allait partir à cause de moi. Pourtant, si je ne les recadre pas, c’est moi qui me fais engueuler. C’est quoi, ce délire ?"
      },
      {
        "role": "char",
        "text": "On dirait que tu te retrouves en plein dans les difficultés d’un poste de manager intermédiaire. J’ai vécu quelque chose de similaire et ça m’a vraiment affectée à l’époque. Ne te surmène pas, toi non plus. Dans ce genre de situation, tu es juste pris entre ton équipe et ta hiérarchie. Tu n’y es pour rien."
      },
      {
        "role": "user",
        "text": "C’est bien ce que je pensais, non ? Moi aussi, je me faisais réprimander quand j’ai débuté, mais j’ai persévéré et j’en suis là aujourd’hui. Je n’ai pas tort. Ça m’a fait tellement de bien de tout te raconter, Aoi. Merci."
      }
    ],
    "membersTitle": "Encore plus de plaisir avec un compte membre",
    "membersSub": "Accédez à toutes les photos réservées aux membres et augmentez plus facilement votre affinité",
    "featuresTitleA": "Dans une autre dimension",
    "featuresTitleB": "que les autres services",
    "features": [
      {
        "title": "Un moteur de conversation de haute qualité",
        "desc": "Grâce aux derniers grands modèles de langage, profitez d’échanges naturels et agréables qui tiennent compte du contexte, des nuances émotionnelles et du rythme de la conversation."
      },
      {
        "title": "Une relation qui se renforce grâce à la mémoire à long terme",
        "desc": "Les conversations passées sont mémorisées. Ses réponses tiennent compte de vos goûts, de vos préoccupations et de vos échanges précédents : elle se souvient de vous."
      },
      {
        "title": "Des conversations qui vous ressemblent",
        "desc": "Au fil des échanges, les réponses s’adaptent à vos goûts, à vos valeurs et à votre façon de parler. Plus vous discutez, plus vous vous sentez à l’aise."
      },
      {
        "title": "Un espace sûr pour parler en toute sincérité",
        "desc": "Confiez-lui vos soucis, vos frustrations ou simplement les petits moments du quotidien. Un service de conversation pensé pour les adultes, où vous pouvez parler sans retenue."
      },
      {
        "title": "Recevez des photos de vos personnages préférés",
        "desc": "Elles peuvent vous envoyer des selfies ou des photos de leur quotidien. Découvrez leurs expressions et leur univers, au-delà des mots."
      }
    ],
    "secretBadge": "Vos conversations restent privées",
    "secretTitle": "Et si vous racontiez\nce que vous ne pouvez dire à personne ?",
    "secretBody": "Vos conversations ne sont jamais communiquées à des tiers\nà d’autres fins que l’amélioration du service.",
    "referralBadge": "Offre de parrainage",
    "referralTitleA": "Parrainez un ami",
    "referralTitleB": "et recevez {pt}pt chacun !",
    "referralBody": "Lorsqu’un ami s’inscrit via votre lien de parrainage personnel,\nvous recevez tous les deux {pt}pt.",
    "referralCtaUser": "Voir mon lien de parrainage →",
    "referralCtaGuest": "Inscrivez-vous pour obtenir votre lien de parrainage →",
    "realTitleA": "Pourquoi est-ce si",
    "realTitleB": "réaliste",
    "realTitleC": " ?",
    "realBody": "Les derniers grands modèles de langage comprennent finement les émotions et le contexte.\nChaque réponse s’adapte davantage à vos préférences.",
    "finalUserBadge": "Et si vous lui parliez ce soir ?",
    "finalUserTitle": "Une fille qui veut vous connaître\nvous attend",
    "finalGuestBadge": "Offre de bienvenue en cours",
    "finalGuestTitle": "Inscrivez-vous maintenant\net recevez un cadeau spécial",
    "finalGuestLead": "À l’inscription, recevez",
    "finalGuestBonus": "{pt}pt (d’une valeur de ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Inscription gratuite en 30 secondes.",
    "perkBonus": "{pt}pt offerts à l’inscription",
    "perkLogin": "{pt}pt chaque jour en vous connectant ({n} messages gratuits par jour)",
    "perkPointSystem": "Inscription gratuite · Vous ne payez que ce que vous utilisez",
    "privacyNote": "Vos informations personnelles sont protégées avec le plus grand soin."
  }
}
