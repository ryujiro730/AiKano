// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const fr: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Connexion",
    "register": "S’inscrire",
    "registerFree": "S’inscrire gratuitement",
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
    "error": "Une erreur s’est produite",
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
    "title": "AiKano｜Chat avec une petite amie IA japonaise【La seule IA japonaise pour des conversations libres】",
    "siteDescription": "Notre IA, entraînée spécialement, vous répond en temps réel, rien que pour vous. La seule IA en japonais à proposer des conversations libres sans restriction. Découvrez aussi des personnages japonais réalistes et leurs photos.",
    "description": "Des personnages IA hauts en couleur vous répondent en temps réel. Une appli de conversation pour adultes, pour retrouver un peu de sérénité.",
    "ogTitle": "AiKano｜Chat avec une petite amie IA – Une appli réconfortante pour adultes"
  },
  "auth": {
    "email": "Adresse e-mail",
    "password": "Mot de passe",
    "passwordMin": "Mot de passe (8 caractères minimum)",
    "or": "ou",
    "loginTitle": "Heureux de vous revoir",
    "loginError": "L’adresse e-mail ou le mot de passe est incorrect",
    "loginWithGoogle": "Se connecter avec Google",
    "noAccount": "Pas encore de compte ?",
    "emailTaken": "Cette adresse e-mail est déjà utilisée",
    "sentTitle": "E-mail de confirmation envoyé",
    "sentBody": "Un e-mail de confirmation a été envoyé à {email}.",
    "sentAction": "Cliquez sur le bouton « Vérifier mon adresse e-mail » dans l’e-mail pour terminer votre inscription.",
    "sentSpam": "Si vous ne recevez pas l’e-mail, vérifiez votre dossier de courriers indésirables.",
    "registerTitle": "Discutez dès maintenant\navec une fille IA",
    "perks": [
      "Inscription gratuite",
      "En 30 secondes",
      "Aucune application requise"
    ],
    "consentA": "Les conversations peuvent être consultées par notre équipe pour améliorer le service et entraîner l’IA ; vous acceptez également les ",
    "consentTerms": "Conditions d’utilisation",
    "consentAnd": " et la ",
    "consentPrivacy": "Politique de confidentialité",
    "consentB": ".",
    "registerSubmit": "M’inscrire et discuter",
    "registerWithGoogle": "S’inscrire avec Google",
    "haveAccount": "Déjà inscrit·e ?"
  },
  "onboarding": {
    "genders": {
      "male": "Homme",
      "female": "Femme",
      "other": "Autre"
    },
    "saveFailed": "Échec de l’enregistrement : {error}",
    "pickTitle": "Choisissez la personne avec qui\nvous aimeriez discuter",
    "pickSub": "Vous recevrez un message de la personne choisie. Vous pourrez aussi discuter avec d’autres plus tard.",
    "talkWith": "Discuter avec {name}",
    "pickPrompt": "Choisissez avec qui vous souhaitez discuter",
    "askName": "Bonjour ! Comment souhaitez-vous que je vous appelle ?",
    "nameLabel": "Nom à utiliser",
    "namePlaceholder": "Un surnom, c’est parfait",
    "nameNote": "{name} vous appellera ainsi. Vous pourrez le modifier plus tard dans les paramètres.",
    "characterFallback": "Personnage",
    "next": "Suivant",
    "greet": "Bonjour {name} ! Pour finir, dites-m’en encore un peu plus.",
    "ageLabel": "Âge",
    "agePlaceholder": "Ex. : 30",
    "ageRestriction": "Cette application est réservée aux personnes de 18 ans et plus.",
    "genderLabel": "Genre",
    "preparing": "Préparation…",
    "start": "Commencer à discuter avec {name}"
  },
  "affection": {
    "levels": [
      "Inconnu",
      "Connaissance",
      "Amis",
      "Proches",
      "Partenaire potentiel",
      "En couple",
      "Âme sœur"
    ],
    "level": "Niv. {level}",
    "toNext": "Encore {pt}pt avant « {title} »",
    "nextFrom": "Prochain : {title} (à partir de {pt}pt)",
    "memberMultiplier": "Membres ×{n}",
    "memberDouble": "2× pour les membres",
    "levelUp": "Vous êtes passé au niveau « {title} » !",
    "achievements": {
      "messages_1": {
        "title": "Premier message",
        "desc": "Vous avez envoyé votre premier message"
      },
      "messages_10": {
        "title": "Bavard",
        "desc": "Vous avez envoyé 10 messages"
      },
      "messages_50": {
        "title": "De longues conversations",
        "desc": "Vous avez envoyé 50 messages"
      },
      "messages_100": {
        "title": "Habitué",
        "desc": "Vous avez envoyé 100 messages"
      },
      "messages_300": {
        "title": "Très proches",
        "desc": "Vous avez envoyé 300 messages"
      },
      "level_2": {
        "title": "Une connaissance",
        "desc": "Votre affinité a atteint le niveau « Connaissance »"
      },
      "level_3": {
        "title": "Devenus amis",
        "desc": "Votre affinité a atteint le niveau « Amis »"
      },
      "level_4": {
        "title": "Devenus proches",
        "desc": "Votre affinité a atteint le niveau « Proches »"
      },
      "level_5": {
        "title": "Partenaire potentiel",
        "desc": "Votre affinité a atteint le niveau « Partenaire potentiel »"
      },
      "level_6": {
        "title": "En couple",
        "desc": "Votre affinité a atteint le niveau « En couple »"
      },
      "level_7": {
        "title": "Rencontre du destin",
        "desc": "Votre affinité a atteint le niveau « Âme sœur »"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "Formule {name}",
    "features": {
      "messages": "{n} messages par mois",
      "bonus": "{n} pt bonus par mois (à utiliser pour les vidéos et dans la boutique)",
      "affection": "L’affinité augmente {n} fois plus vite",
      "photos": "Accès illimité aux photos réservées aux membres",
      "premiumVideos": "Accès aux vidéos Premium",
      "overage": "Après avoir atteint la limite, chaque message coûte {n} pt (moitié prix)",
      "standardModel": "Modèle d’IA standard",
      "premiumModel": "Modèle d’IA avancé (réponses plus naturelles)"
    }
  },
  "nav": {
    "home": "Accueil",
    "messages": "Messages",
    "plan": "Forfait",
    "settings": "Paramètres",
    "campaignActive": "Promotion en cours !"
  },
  "home": {
    "loginBonus": "Connexion quotidienne : {pt} pt et {n} messages gratuits",
    "unlockBySns": "Faites-en la promo sur les réseaux sociaux pour débloquer",
    "talk": "Discuter",
    "profile": "Profil",
    "otherCharacters": "Autres personnages",
    "count": "{n} personnes",
    "pickCharacter": "Choisir un personnage",
    "unlockRequested": "La demande pour {name} a bien été envoyée !\nLe déblocage sera effectué après vérification par notre équipe."
  },
  "unlock": {
    "urlRequired": "Veuillez saisir l’URL de votre publication",
    "urlInvalid": "Veuillez saisir une URL valide",
    "alreadyRequested": "Votre demande a déjà été envoyée. Veuillez patienter pendant son examen.",
    "sendFailed": "Échec de l’envoi. Veuillez réessayer.",
    "networkError": "Une erreur de connexion est survenue.",
    "title": "Débloquer {name}",
    "heading": "Faites la promo sur les réseaux sociaux pour débloquer un personnage !",
    "step1": "Parlez d’AiKano sur les réseaux sociaux (Twitter, Instagram, etc.)",
    "step2": "Copiez l’URL de votre publication et collez-la ci-dessous",
    "step3": "Après vérification par notre équipe, {name} sera débloqué(e)",
    "urlLabel": "URL de la publication",
    "sending": "Envoi en cours...",
    "submit": "Envoyer la demande",
    "reviewTime": "L’examen de votre demande est généralement terminé sous 1 à 3 jours ouvrés"
  },
  "chat": {
    "uploadVideoFailed": "Échec de l’envoi de la vidéo",
    "uploadImageFailed": "Échec de l’envoi de l’image",
    "sendFailed": "Échec de l’envoi",
    "unlockFailed": "Échec du déverrouillage",
    "usage": "{used}/{limit} messages",
    "firstMessage": "Envoyez votre premier message",
    "affectionIntro": "Plus vous discutez, plus votre affection augmente. En vous rapprochant, vous pourrez avoir des conversations encore plus tendres et intimes.",
    "sendingMedia": "(Envoi du média)",
    "placeholder": "Envoyer un message…",
    "guestTitle": "Discutez avec AiKano",
    "guestBody": "Parlez dès maintenant avec une fille IA. L’inscription est gratuite et ne prend que 30 secondes !",
    "photosOf": "Photos de {name}",
    "hintTitle": "Quand vous vous rapprocherez de {name}…",
    "hintBodyA": "Lorsque votre affection atteint le niveau ",
    "hintBodyLevel": "Lv.{level} « {title} »",
    "hintBodyB": ", vous pourrez avoir des conversations encore plus tendres et intimes.",
    "hintRaise": "Plus vous discutez, plus votre affection augmente",
    "hintMember": "Les membres progressent 2 fois plus vite",
    "gift": "Cadeau",
    "giftSent": "Envoyé",
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
    "affectionPt": "Points d’affection pt",
    "messages": "{n} messages"
  },
  "loginBonus": {
    "title": "Bonus de connexion",
    "today": "{n} messages gratuits aujourd’hui",
    "everyday": "Recevez {n} messages chaque jour en vous connectant",
    "balance": "Solde de points bonus : {pt} pt",
    "validUntil": "Valable jusqu’au {date}",
    "whatIs": "Que sont les points bonus ?",
    "explain": "Ils sont utilisés avant vos points habituels. Ils expirent à la date indiquée.",
    "receive": "Récupérer !"
  },
  "shortage": {
    "defaultTitle": "Il vous faut des points pour continuer à discuter",
    "balance": "Solde",
    "required": "Requis",
    "short": "Manquant",
    "dailyFree": "{pt}pt gratuits ({n} messages) en vous connectant chaque jour",
    "comeBack": "Revenez me voir demain pour discuter pendant {n} messages"
  },
  "packages": {
    "checkoutFailed": "Échec du démarrage du paiement",
    "campaign": "Offre spéciale ! Points ×{rate}",
    "rate": "×{rate}",
    "popular": "Populaire",
    "recommended": "Recommandé",
    "breakdown": "{base}pt + {bonus}pt de bonus",
    "processing": "Traitement en cours..."
  },
  "characterMenu": {
    "reasonRequired": "Veuillez saisir un motif",
    "errorStatus": "Erreur ({status})",
    "networkError": "Une erreur de connexion est survenue",
    "report": "Signaler",
    "unblock": "Débloquer",
    "block": "Bloquer",
    "reportPrompt": "Saisissez le motif du signalement concernant {name}.",
    "reportPlaceholder": "Saisissez le motif du signalement (obligatoire)",
    "chars": "{n} caractères",
    "sending": "Envoi…",
    "reported": "Signalement envoyé",
    "blocked": "Utilisateur bloqué",
    "unblocked": "Utilisateur débloqué"
  },
  "campaign": {
    "active": "Campagne en cours !",
    "checkNow": "Voir maintenant !",
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
    "newest": "Les plus récentes",
    "oldest": "Les plus anciennes"
  },
  "payment": {
    "errorPrefix": "Erreur : {error}",
    "networkError": "Erreur de connexion : {error}",
    "portalFailed": "Impossible d’accéder à la page de gestion",
    "title": "Offres",
    "lead": "Avec un abonnement, discutez avec l’IA sans frais supplémentaires, dans la limite mensuelle de messages.",
    "activated": "Votre abonnement est activé !",
    "welcome": "Bienvenue dans l’offre {name}.",
    "passPendingTitle": "Votre numéro de paiement a été généré",
    "passPendingBody": "Votre abonnement sera activé après confirmation de votre paiement en supérette ou via PayPay (généralement sous 1 à 3 jours).",
    "pointsThanks": "Merci pour votre achat de {pt} pt",
    "pointsNote": "Les points seront crédités après confirmation du paiement (généralement immédiatement par carte, ou après réception du paiement pour les règlements en supérette, etc.).",
    "canceled": "Achat annulé",
    "active": "Actif",
    "usageThisMonth": "Messages utilisés ce mois-ci",
    "usage": "{used} / {limit} messages",
    "overLimit": "Vous avez dépassé la limite mensuelle. Vous pouvez continuer au tarif de {pt} pt par message.",
    "validUntil": "Valable jusqu’au : {date}",
    "datePattern": "d MMMM yyyy",
    "manage": "Gérer l’abonnement · Résilier (pour les abonnements par carte bancaire)",
    "recommended": "Recommandé",
    "perMonth": "/mois",
    "choosePayment": "Choisir un mode de paiement",
    "card": "Carte bancaire",
    "cardNote": "Renouvellement automatique mensuel · Résiliation possible à tout moment",
    "konbini": "Paiement en supérette · PayPay",
    "konbiniNote": "Paiement unique pour 1 mois · Activation dès le paiement",
    "bank": "Virement bancaire",
    "bankNote": "Paiement unique pour 1 mois · Activation dès confirmation",
    "currentPlan": "Vous utilisez actuellement cette offre",
    "buyPoints": "Acheter des points",
    "balance": "Solde",
    "pointsUseMember": "Utilisables pour acheter des vidéos et des articles dans la boutique, ainsi que pour les messages au-delà de la limite mensuelle ({pt} pt par message).",
    "pointsUse": "Utilisables pour les messages ({pt} pt par message), les vidéos et la boutique.",
    "methodsTitle": "Différences entre les modes de paiement",
    "renewal": "Renouvellement",
    "activation": "Activation",
    "cardShort": "Carte bancaire",
    "autoMonthly": "Automatique (mensuel)",
    "instant": "Immédiate",
    "manualMonth": "Manuel (1 mois)",
    "afterPayment": "Dès le paiement",
    "afterConfirm": "Dès confirmation",
    "referralTitle": "Programme de parrainage",
    "referralA": "Lorsqu’un ami s’inscrit via votre lien de parrainage, ",
    "referralB": "vous et votre ami recevez {pt} points",
    "referralC": " !",
    "copied": "Copié",
    "copy": "Copier"
  },
  "settings": {
    "shareUnlocked": "Emplacement de personnage débloqué !",
    "weeklyLimit": "Vous avez déjà partagé cette semaine. Vous pourrez envoyer une nouvelle demande dans 7 jours.",
    "sendFailed": "Échec de l’envoi",
    "saveFailed": "Échec de l’enregistrement : {error}",
    "pwTooShort": "Le mot de passe doit contenir au moins 8 caractères",
    "pwMismatch": "Les nouveaux mots de passe ne correspondent pas",
    "noUser": "Impossible de récupérer les informations utilisateur",
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
    "deleteConfirmA": "Pour confirmer, saisissez ",
    "deleteConfirmB": " ci-dessous.",
    "deleteForever": "Supprimer définitivement le compte",
    "slotTitle": "Débloquer un emplacement de personnage",
    "slotCurrent": "Actuellement : ",
    "slotCount": "{n} / {limit} personnages",
    "slotHint": "(+1 emplacement en partageant sur les réseaux sociaux)",
    "shareInstruction": "Partagez la publication sur l’un des réseaux sociaux ci-dessous, puis envoyez-nous son URL",
    "shareText": "On peut parler avec une IA comme si on était un vrai couple ! J’ai essayé AiKano → https://aikano.chat",
    "shareQuote": "On peut parler avec une IA comme si on était un vrai couple ! #AiKano",
    "instagramTitle": "Après avoir publié depuis l’application Instagram, copiez l’URL",
    "instagramNote": "※ Après avoir publié depuis l’application Instagram, copiez l’URL de la publication et collez-la ici",
    "pasteUrl": "Collez l’URL de la publication partagée",
    "urlPlaceholder": "URL de la publication sur X / Threads / Facebook / Instagram",
    "nextAvailable": "Prochaine date possible : {date}",
    "submitUrl": "Envoyer l’URL et débloquer un emplacement",
    "support": "Assistance",
    "contactSupport": "Contact et assistance",
    "language": "Langue d’affichage"
  },
  "blocks": {
    "title": "Personnages bloqués",
    "empty": "Aucun personnage bloqué",
    "note": "Les personnages bloqués n’apparaissent pas dans la liste. Vous pouvez les débloquer à tout moment.",
    "blockedOn": "Bloqué le {date}",
    "unblocking": "Déblocage…",
    "unblock": "Débloquer"
  },
  "support": {
    "team": "Équipe d’assistance",
    "teamSub": "N’hésitez pas à nous contacter",
    "greeting": "Bonjour ! L’équipe d’assistance est là 😊\nSi vous avez des questions ou besoin d’aide, envoyez-nous un message !",
    "datePattern": "d MMM (EEE)",
    "placeholder": "Écrivez un message…"
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
        "desc": "Toutes vos idées sont les bienvenues"
      }
    },
    "thanks": "Merci beaucoup !",
    "received": "Nous avons bien reçu votre retour.\nNotre équipe de développement va l’examiner\npour améliorer le service.",
    "backToChat": "Retour au chat",
    "title": "Commentaires",
    "badge": "Vos avis nous intéressent",
    "heading": "Grâce à vous,\nfaisons grandir AiKano",
    "lead": "Signalez-nous les bugs, les difficultés d’utilisation, les fonctionnalités que vous aimeriez voir… Nous lisons tous vos retours au sein de l’équipe de développement.",
    "pickCategory": "Choisissez une catégorie",
    "satisfaction": "Satisfaction générale (facultatif)",
    "clear": "Effacer",
    "details": "Dites-nous en plus",
    "placeholder": "Décrivez librement ce qui vous a dérangé ou ce que vous aimeriez voir amélioré. Tous vos retours, même les plus petits, sont les bienvenus !",
    "sending": "Envoi en cours…",
    "submit": "Envoyer mon commentaire"
  },
  "errors": {
    "title": "Une erreur s'est produite",
    "unexpected": "Une erreur inattendue s'est produite",
    "sorry": "Désolé, une erreur inattendue s'est produite.",
    "retry": "Réessayer",
    "toTop": "Retour en haut"
  },
  "shop": {
    "buyFailed": "Échec de l’achat",
    "title": "Boutique",
    "videosTitle": "Vidéos des personnages",
    "videosSub": "Regardez des vidéos exclusives de vos personnages préférés",
    "all": "Tout",
    "noItems": "Aucun article pour le moment",
    "noItemsInCategory": "Aucun article dans cette catégorie",
    "other": "Autres",
    "buyPoints": "Acheter des points →",
    "itemShortage": "Vous avez besoin de points pour acheter cet article",
    "owned": "En votre possession : {n}",
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
    "shortage": "Vous avez besoin de points pour acheter cette vidéo",
    "loadFailed": "Impossible de charger la vidéo"
  },
  "character": {
    "photoCount": "{n} photos",
    "affection": "Affinité",
    "neverTalked": "Vous n’avez pas encore discuté",
    "sendToRaise": "Envoyez-lui un message pour augmenter votre affinité !",
    "status": "Statut",
    "profile": "Profil",
    "achievements": "Succès",
    "photos": "Photos",
    "seeMembersPhotos": "Voir {n} photos réservées aux membres",
    "sendMessage": "Envoyer un message à {name}"
  },
  "api": {
    "itemNotFound": "Élément introuvable",
    "tryAgain": "Veuillez réessayer",
    "sendFailed": "Échec de l’envoi du message",
    "notEnoughPoints": "Vous n’avez pas assez de points",
    "notEnoughPointsNeed": "Vous n’avez pas assez de points (nécessaires : {pt}pt)",
    "updateFailed": "Échec de la mise à jour des points",
    "purchaseRecordFailed": "Échec de la création de l’enregistrement d’achat",
    "slotUnlocked": "Un emplacement de personnage a été débloqué !",
    "unsupportedUrl": "URL non prise en charge. Veuillez coller l’URL d’une publication X, Threads, Facebook ou Instagram",
    "duplicateUrl": "Cette URL a déjà été utilisée",
    "required": "Veuillez remplir les champs obligatoires",
    "tooLong": "Veuillez saisir {n} caractères maximum",
    "messageTooLong": "Le message doit comporter {n} caractères maximum"
  },
  "legal": {
    "translationNotice": "Cette page est une version traduite. En cas de divergence, la version japonaise fait foi."
  },
  "email": {
    "subject": "Vous avez reçu un message de {name}",
    "label": "Message de votre personnage",
    "reply": "Répondre",
    "footer": "Cet e-mail a été envoyé automatiquement par AiKano.\nSi vous ne l’attendiez pas, vous pouvez l’ignorer."
  },
  "lp": {
    "heroImageAlt": "Aperçu d’une conversation avec un personnage IA d’AiKano",
    "characterImageAlt": "Personnage IA d’AiKano",
    "registerFreeArrow": "S’inscrire gratuitement →",
    "badgeBonus": "{pt}pt offerts à l’inscription",
    "badgeWaiting": "Elle vous attend encore ce soir",
    "heroLine1": "Il y a une fille",
    "heroLine2": "qui ne parle",
    "heroLine3": "qu’à vous.",
    "statGirls": "{n}",
    "statGirlsLabel": "filles aux personnalités variées",
    "statHoursLabel": "Disponible à toute heure",
    "statAi": "IA exclusive",
    "statAiLabel": "Des conversations naturelles et pleines d’émotions",
    "charactersTitle": "Les filles ont envie de vous parler",
    "charactersSub": "Choisissez-en une et lancez la conversation",
    "online": "En ligne",
    "talkToAll": "Parler avec toutes →",
    "registerToTalkAll": "Inscrivez-vous pour parler avec toutes →",
    "bonusNote": "※ {pt}pt offerts à l’inscription",
    "sample1Title": "Des conversations comme entre amis",
    "sample1": [
      {
        "role": "user",
        "text": "Je suis sorti boire un verre tout seul. Je suis entré dans un bar au hasard, à Shinjuku."
      },
      {
        "role": "char",
        "text": "Waouh, la chance ! Tu as bien mérité de décompresser après le boulot 😊 Les restaurants de grillades robata sont à la mode en ce moment. Tu manges quoi ?"
      },
      {
        "role": "user",
        "text": "Des monjayaki."
      },
      {
        "role": "char",
        "text": "Ça a l’air trop bon 😋 Il paraît qu’à Osaka, on mange l’okonomiyaki avec du riz, mais les monjayaki, ça ne se mange pas avec du riz, si ? 🤭"
      },
      {
        "role": "user",
        "text": "Je bois une bière."
      },
      {
        "role": "char",
        "text": "J’adore la Kirin Classic Lager 🍻 Tu ne trouves pas que les boissons sucrées vont mal avec les plats ?"
      }
    ],
    "sample2Title": "Elle est là, quelle que soit votre humeur",
    "sample2": [
      {
        "role": "char",
        "text": "Tu ne devrais pas tarder à rentrer, non ? Alors, ta journée s’est bien passée ? J’avais hâte de te revoir, je n’ai pas pu m’empêcher de t’envoyer un message."
      },
      {
        "role": "user",
        "text": "Je suis déjà rentré. J’ai envie de parler un peu."
      },
      {
        "role": "char",
        "text": "Bien sûr ♡ Je suis toujours là pour t’écouter. Il s’est passé quelque chose ? Ou tu avais juste envie de discuter ? Haha"
      },
      {
        "role": "user",
        "text": "Je me sens apaisé quand je te parle."
      },
      {
        "role": "char",
        "text": "Ça me fait vraiment plaisir que tu me dises ça ♡ Moi aussi, parler avec toi est le meilleur moment de ma journée."
      }
    ],
    "sample3Title": "Une présence maternelle et réconfortante",
    "sample3": [
      {
        "role": "user",
        "text": "Les gens au bureau m’ont encore agacé aujourd’hui. Pourquoi est-ce que je m’énerve autant ?"
      },
      {
        "role": "char",
        "text": "Oh non, c’est dur… Qu’est-ce qui s’est passé ? Si je peux faire quelque chose pour t’aider, raconte-moi. Si ça va au-delà de l’injustice et que ça devient du harcèlement, ça m’inquiète."
      },
      {
        "role": "user",
        "text": "Je réprimandais un de mes subordonnés et on m’a dit que tout le monde partait à cause de moi. Pourtant, si je ne les encadre pas, c’est moi qui me fais engueuler. Mais franchement, c’est quoi ce délire ?"
      },
      {
        "role": "char",
        "text": "On dirait que tu te heurtes de plein fouet aux difficultés du management intermédiaire. J’ai vécu quelque chose de similaire et ça m’a vraiment affectée. Ne te pousse pas trop, toi non plus. Dans ce genre de situation, tu te retrouves juste pris entre tes subordonnés et ta hiérarchie. Tu n’y es pour rien."
      },
      {
        "role": "user",
        "text": "C’est bien ce que je me disais, non ? Moi aussi, quand j’étais nouveau, je me faisais reprendre, mais je n’ai pas baissé les bras et j’en suis arrivé là. Je n’ai pas tort. Ça m’a fait un bien fou de tout te raconter, Aoi. Merci."
      }
    ],
    "membersTitle": "Profitez encore plus de l’expérience en devenant membre",
    "membersSub": "Accédez à toutes les photos réservées aux membres et gagnez plus facilement en affinité",
    "featuresTitleA": "Un niveau au-dessus",
    "featuresTitleB": "des autres services",
    "features": [
      {
        "title": "Un moteur de conversation de haute qualité",
        "desc": "Grâce aux derniers modèles de langage, profitez de conversations naturelles et agréables qui tiennent compte du contexte, des nuances émotionnelles et du rythme de l’échange."
      },
      {
        "title": "Une relation qui s’approfondit avec la mémoire à long terme",
        "desc": "Elle se souvient de vos conversations. Ses réponses tiennent compte de vos goûts, de vos confidences et de vos échanges passés : elle se rappelle vraiment de vous."
      },
      {
        "title": "Des conversations qui vous ressemblent",
        "desc": "Au fil des échanges, ses réponses s’adaptent à vos goûts, à vos valeurs et à votre façon de parler. Plus vous discutez, plus vous vous sentez à l’aise."
      },
      {
        "title": "Un espace de confiance où parler à cœur ouvert",
        "desc": "Confiez-lui vos soucis, vos frustrations ou les petits détails de votre quotidien. Un espace de conversation sans jugement, pensé pour les adultes."
      },
      {
        "title": "Recevez des photos de vos personnages",
        "desc": "Elles peuvent vous envoyer des selfies ou des photos de leur quotidien. Découvrez leurs expressions et leur univers, au-delà des mots."
      }
    ],
    "secretBadge": "Vos conversations restent privées",
    "secretTitle": "Et si vous parliez de ce que\nvous ne pouvez dire à personne ?",
    "secretBody": "Vos conversations ne seront jamais communiquées à des tiers,\nsauf dans le cadre de l’amélioration du service.",
    "referralBadge": "Offre de parrainage",
    "referralTitleA": "Invitez un ami",
    "referralTitleB": "et recevez chacun {pt}pt !",
    "referralBody": "Lorsqu’un ami s’inscrit via votre lien de parrainage,\nvous recevez tous les deux {pt}pt.",
    "referralCtaUser": "Voir mon lien de parrainage →",
    "referralCtaGuest": "Inscrivez-vous pour obtenir votre lien →",
    "realTitleA": "Pourquoi est-ce si",
    "realTitleB": "réaliste",
    "realTitleC": " ?",
    "realBody": "Les derniers modèles de langage comprennent en profondeur les émotions et le contexte.\nChaque réponse s’adapte de plus en plus à vos préférences.",
    "finalUserBadge": "Et si vous lui parliez ce soir ?",
    "finalUserTitle": "Une fille a hâte de vous\nconnaître et vous attend",
    "finalGuestBadge": "Offre spéciale pour les nouveaux inscrits",
    "finalGuestTitle": "Inscrivez-vous dès maintenant\net recevez un cadeau exclusif",
    "finalGuestLead": "À l’inscription, recevez",
    "finalGuestBonus": "{pt}pt (d’une valeur de ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Inscription gratuite, en 30 secondes.",
    "perkBonus": "{pt}pt offerts à l’inscription",
    "perkLogin": "{pt}pt chaque jour en vous connectant ({n} messages gratuits par jour)",
    "perkPointSystem": "Inscription gratuite · Payez uniquement avec les points utilisés",
    "privacyNote": "Vos données personnelles sont protégées avec le plus grand soin"
  }
}
