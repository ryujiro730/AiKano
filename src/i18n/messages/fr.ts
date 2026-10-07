// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const fr: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Se connecter",
    "register": "S’inscrire",
    "registerFree": "S’inscrire gratuitement",
    "logout": "Se déconnecter",
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
    "title": "AiKano｜Chat avec une petite amie IA japonaise",
    "siteDescription": "Notre IA, spécialement entraînée, vous répond en temps réel, rien que pour vous. Discutez avec des personnages japonais réalistes.",
    "description": "Des personnages IA hauts en couleur répondent à vos messages en temps réel. Une appli de conversation pour retrouver la sérénité.",
    "ogTitle": "AiKano｜Chat avec une petite amie IA – Une appli de conversation relaxante"
  },
  "auth": {
    "email": "Adresse e-mail",
    "password": "Mot de passe",
    "passwordMin": "Mot de passe (8 caractères minimum)",
    "or": "ou",
    "loginTitle": "Ravi de vous revoir",
    "loginError": "Adresse e-mail ou mot de passe incorrect",
    "loginWithGoogle": "Se connecter avec Google",
    "noAccount": "Vous n’avez pas encore de compte ?",
    "emailTaken": "Cette adresse e-mail est déjà utilisée",
    "sentTitle": "E-mail de confirmation envoyé",
    "sentBody": "Un e-mail de confirmation a été envoyé à {email}.",
    "sentAction": "Cliquez sur le bouton « Confirmer mon adresse e-mail » dans l’e-mail pour terminer votre inscription.",
    "sentSpam": "Si vous ne recevez pas l’e-mail, vérifiez votre dossier de courrier indésirable.",
    "registerTitle": "Discutez dès maintenant\navec une fille IA",
    "perks": [
      "Inscription gratuite",
      "En 30 secondes",
      "Aucune appli nécessaire"
    ],
    "consentA": "Le personnel peut consulter vos conversations afin d’améliorer le service et d’entraîner l’IA. En outre, j’accepte les ",
    "consentTerms": "Conditions d’utilisation",
    "consentAnd": " et la ",
    "consentPrivacy": "Politique de confidentialité",
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
    "pickTitle": "Choisis la personne avec qui\ntu aimerais discuter",
    "pickSub": "La personne que tu as choisie t’enverra un message. Tu pourras discuter avec d’autres plus tard.",
    "talkWith": "Parler avec {name}",
    "pickPrompt": "Choisis la personne avec qui tu veux discuter",
    "askName": "Salut, ravie de te rencontrer ! Comment dois-je t’appeler ?",
    "nameLabel": "Nom que tu souhaites qu’on utilise",
    "namePlaceholder": "Un surnom convient aussi",
    "nameNote": "{name} t’appellera ainsi. Tu pourras le modifier plus tard dans les paramètres.",
    "characterFallback": "Personnage",
    "next": "Suivant",
    "greet": "Ravie de faire ta connaissance, {name} ! Pour finir, dis-moi juste encore une petite chose.",
    "ageLabel": "Âge",
    "agePlaceholder": "Ex. : 30",
    "ageRestriction": "Réservé aux personnes de 18 ans et plus",
    "genderLabel": "Genre",
    "preparing": "Préparation en cours…",
    "start": "Commencer à discuter avec {name}"
  },
  "affection": {
    "levels": [
      "Inconnu",
      "Connaissance",
      "Ami",
      "Ami proche",
      "Partenaire potentiel",
      "Partenaire",
      "Âme sœur"
    ],
    "level": "Lv.{level}",
    "toNext": "Jusqu’à « {title} » : {pt}pt",
    "nextFrom": "Suivant : {title} (à partir de {pt}pt)",
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
        "title": "De longues conversations",
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
        "title": "Une nouvelle connaissance",
        "desc": "Votre affinité a atteint le niveau « Connaissance »"
      },
      "level_3": {
        "title": "Devenus amis",
        "desc": "Votre affinité a atteint le niveau « Ami »"
      },
      "level_4": {
        "title": "Devenus très proches",
        "desc": "Votre affinité a atteint le niveau « Ami proche »"
      },
      "level_5": {
        "title": "Partenaire potentiel",
        "desc": "Votre affinité a atteint le niveau « Partenaire potentiel »"
      },
      "level_6": {
        "title": "En couple",
        "desc": "Votre affinité a atteint le niveau « Partenaire »"
      },
      "level_7": {
        "title": "Une rencontre destinée",
        "desc": "Votre affinité a atteint le niveau « Âme sœur »"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "Offre {name}",
    "features": {
      "messages": "{n} messages par mois",
      "bonus": "{n} pt bonus chaque mois (utilisables pour les vidéos et la boutique)",
      "affection": "L’affinité augmente {n} fois plus vite",
      "photos": "Accès illimité aux photos réservées aux membres",
      "premiumVideos": "Accès aux vidéos Premium",
      "overage": "Après avoir atteint la limite, chaque message coûte {n}pt (moins cher que le tarif habituel)",
      "standardModel": "Modèle d’IA standard",
      "premiumModel": "Modèle d’IA avancé (réponses plus naturelles)"
    }
  },
  "nav": {
    "home": "Accueil",
    "messages": "Messages",
    "plan": "Offre",
    "settings": "Paramètres",
    "gacha": "Gacha",
    "campaignActive": "Campagne en cours !"
  },
  "home": {
    "loginBonus": "Connectez-vous chaque jour pour recevoir {pt} pt et {n} messages gratuits",
    "unlockBySns": "Faites-en la promotion sur les réseaux sociaux pour débloquer",
    "talk": "Parler",
    "profile": "Profil",
    "otherCharacters": "Autres personnages",
    "count": "{n} personnages",
    "pickCharacter": "Choisir un personnage",
    "unlockRequested": "La demande pour {name} a bien été envoyée !\nLe personnage sera débloqué après vérification par notre équipe."
  },
  "unlock": {
    "urlRequired": "Veuillez saisir l’URL de la publication",
    "urlInvalid": "Veuillez saisir une URL valide",
    "alreadyRequested": "Votre demande a déjà été envoyée. Veuillez patienter pendant son examen.",
    "sendFailed": "Échec de l’envoi. Veuillez réessayer.",
    "networkError": "Une erreur de connexion est survenue.",
    "title": "Débloquer {name}",
    "heading": "Faites la promotion sur les réseaux sociaux pour débloquer un personnage !",
    "step1": "Présentez AiKano sur les réseaux sociaux (Twitter, Instagram, etc.)",
    "step2": "Copiez l’URL de votre publication et collez-la ci-dessous",
    "step3": "Après vérification par notre équipe, {name} sera débloqué",
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
    "affectionIntro": "Plus vous discutez, plus votre affection grandit. Quand vous vous rapprochez, vos conversations deviennent plus tendres et intimes.",
    "sendingMedia": "(Envoi du média)",
    "placeholder": "Envoyer un message…",
    "guestTitle": "Discutez sur AiKano",
    "guestBody": "Parlez dès maintenant avec une fille IA. Inscription gratuite en 30 secondes !",
    "photosOf": "Photos de {name}",
    "hintTitle": "Quand vous vous rapprocherez de {name}…",
    "hintBodyA": "Quand votre affection atteint le niveau ",
    "hintBodyLevel": "Lv.{level} « {title} »",
    "hintBodyB": ", vous pourrez avoir des conversations plus tendres et intimes.",
    "hintRaise": "Plus vous discutez, plus votre affection grandit.",
    "hintMember": "Les membres progressent 2 fois plus vite",
    "gift": "Cadeau",
    "giftSent": "a été offert",
    "videoMessage": "Message vidéo",
    "videoPrice": "À regarder pour {pt}pt",
    "processing": "Traitement en cours…",
    "watchFor": "Regarder pour {pt}pt",
    "wishLabel": "Son souhait",
    "wishGive": "Offrir · {pt} pts",
    "wishDone": "Offert"
  },
  "levelUp": {
    "title": "Affinité en hausse !",
    "relation": "Votre relation avec {name}",
    "reached": "est passée à « {title} » !"
  },
  "meter": {
    "affectionPt": "Affection pt",
    "messages": "{n} messages"
  },
  "loginBonus": {
    "title": "Bonus de connexion",
    "today": "{n} messages gratuits aujourd’hui",
    "everyday": "Connectez-vous chaque jour pour recevoir {n} messages gratuits",
    "balance": "Solde de points bonus : {pt} pt",
    "validUntil": "Valable jusqu’au {date}",
    "whatIs": "Que sont les points bonus ?",
    "explain": "Ils sont utilisés avant vos points habituels. Ils expirent à la date indiquée.",
    "receive": "Récupérer !"
  },
  "shortage": {
    "defaultTitle": "Vous avez besoin de points pour continuer à discuter",
    "balance": "Solde",
    "required": "Nécessaire",
    "short": "Insuffisant",
    "dailyFree": "Connectez-vous chaque jour pour obtenir {pt} pt gratuits ({n} messages)",
    "comeBack": "Reviens me voir demain et tu pourras discuter pendant {n} messages"
  },
  "packages": {
    "checkoutFailed": "Échec du démarrage du paiement",
    "campaign": "Offre en cours ! Points ×{rate}",
    "campaignUpTo": "Offre en cours ! Jusqu'à ×{rate} points",
    "rate": "×{rate}",
    "popular": "Populaire",
    "recommended": "Recommandé",
    "breakdown": "{base} pt + {bonus} pt bonus",
    "processing": "Traitement en cours..."
  },
  "characterMenu": {
    "reasonRequired": "Veuillez saisir un motif",
    "errorStatus": "Erreur ({status})",
    "networkError": "Une erreur réseau s’est produite",
    "report": "Signaler",
    "unblock": "Débloquer",
    "block": "Bloquer",
    "reportPrompt": "Veuillez expliquer pourquoi vous signalez {name}.",
    "reportPlaceholder": "Motif du signalement (obligatoire)",
    "chars": "{n} caractères",
    "sending": "Envoi…",
    "reported": "Signalement envoyé",
    "blocked": "Utilisateur bloqué",
    "unblocked": "Utilisateur débloqué"
  },
  "campaign": {
    "active": "Campagne en cours !",
    "checkNow": "Découvrez-la maintenant !",
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
    "findPartner": "Trouver quelqu’un avec qui discuter",
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
    "title": "Forfaits",
    "lead": "Avec un forfait, vous pouvez discuter avec l’IA sans frais supplémentaires, dans la limite mensuelle de messages.",
    "activated": "Votre forfait est activé !",
    "welcome": "Bienvenue avec le forfait {name}.",
    "passPendingTitle": "Votre numéro de paiement a été généré",
    "passPendingBody": "Votre forfait sera activé après confirmation du paiement en konbini ou par PayPay (généralement sous 1 à 3 jours).",
    "pointsThanks": "Merci pour votre achat de {pt} pt",
    "pointsNote": "Vos points seront crédités après confirmation du paiement (généralement immédiatement par carte, ou après réception du paiement en konbini, etc.).",
    "canceled": "Achat annulé",
    "active": "Actif",
    "usageThisMonth": "Messages utilisés ce mois-ci",
    "usage": "{used} / {limit} messages",
    "overLimit": "Vous avez dépassé la limite mensuelle. Vous pouvez continuer pour {pt} pt par message.",
    "validUntil": "Valable jusqu’au : {date}",
    "datePattern": "d MMMM yyyy",
    "manage": "Gérer ou résilier le forfait (abonnement par carte bancaire)",
    "recommended": "Recommandé",
    "perMonth": "/mois",
    "choosePayment": "Choisir un mode de paiement",
    "card": "Carte bancaire",
    "cardNote": "Renouvellement automatique chaque mois · Résiliation possible à tout moment",
    "konbini": "Konbini · PayPay",
    "konbiniNote": "Paiement unique pour 1 mois · Activation dès le paiement",
    "bank": "Virement bancaire",
    "bankNote": "Paiement unique pour 1 mois · Activation dès confirmation",
    "currentPlan": "Vous utilisez actuellement ce forfait",
    "buyPoints": "Acheter des points",
    "balance": "Solde",
    "pointsUseMember": "Utilisables pour acheter des vidéos et des articles dans la boutique, ainsi que pour les messages au-delà de la limite mensuelle ({pt} pt par message).",
    "pointsUse": "Utilisables pour les messages ({pt} pt par message), les vidéos et la boutique.",
    "methodsTitle": "Comparer les modes de paiement",
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
    "referralB": "vous et votre ami recevez {pt} pt",
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
    "deleteConfirmA": "Pour confirmer, saisissez ",
    "deleteConfirmB": " ci-dessous.",
    "deleteForever": "Supprimer définitivement le compte",
    "slotTitle": "Débloquer un emplacement de personnage",
    "slotCurrent": "Actuellement : ",
    "slotCount": "{n} / {limit} personnes",
    "slotHint": "(+1 emplacement en partageant sur les réseaux sociaux)",
    "shareInstruction": "Partagez sur l’un des réseaux sociaux ci-dessous, puis envoyez l’URL de votre publication.",
    "shareText": "On peut parler à une IA comme à son vrai partenaire ! J’ai essayé #AiKano → https://aikano.chat",
    "shareQuote": "On peut parler à une IA comme à son vrai partenaire ! #AiKano",
    "instagramTitle": "Après avoir publié depuis l’application Instagram, copiez l’URL.",
    "instagramNote": "※ Après avoir publié depuis l’application Instagram, copiez l’URL de la publication et collez-la ici.",
    "pasteUrl": "Collez l’URL de la publication partagée",
    "urlPlaceholder": "URL d’une publication X / Threads / Facebook / Instagram",
    "nextAvailable": "Prochaine date de demande possible : {date}",
    "submitUrl": "Envoyer l’URL et débloquer un emplacement",
    "support": "Assistance",
    "contactSupport": "Contact et assistance",
    "language": "Langue d’affichage"
  },
  "blocks": {
    "title": "Personnages bloqués",
    "empty": "Aucun personnage n’est bloqué",
    "note": "Les personnages bloqués n’apparaissent pas dans la liste. Vous pouvez les débloquer à tout moment.",
    "blockedOn": "Bloqué le {date}",
    "unblocking": "Déblocage…",
    "unblock": "Débloquer"
  },
  "support": {
    "team": "Équipe d’assistance",
    "teamSub": "N’hésitez pas à nous contacter",
    "greeting": "Bonjour ! L’équipe d’assistance 😊\nSi vous avez des questions ou besoin d’aide, envoyez-nous un message.",
    "datePattern": "d MMM (E)",
    "placeholder": "Écrivez un message…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Signaler un bug",
        "desc": "L’application ne fonctionne pas ou se comporte de façon inattendue"
      },
      "feature": {
        "label": "Suggestion de fonctionnalité",
        "desc": "Une fonctionnalité qui vous ferait plaisir"
      },
      "ai": {
        "label": "Réponses de l’IA",
        "desc": "Qualité des réponses ou incohérences dans le personnage"
      },
      "ui": {
        "label": "Interface",
        "desc": "Difficultés d’utilisation ou manque de lisibilité"
      },
      "other": {
        "label": "Autre",
        "desc": "N’hésitez pas à nous faire part de tout autre retour"
      }
    },
    "thanks": "Merci !",
    "received": "Nous avons bien reçu votre retour.\nL’équipe de développement va l’examiner\npour améliorer le service.",
    "backToChat": "Retour au chat",
    "title": "Votre avis",
    "badge": "Vos retours nous intéressent",
    "heading": "Aidez-nous à faire grandir\nAiKano grâce à vos retours",
    "lead": "Faites-nous part de tout ce que vous souhaitez : bugs, difficultés d’utilisation, fonctionnalités que vous aimeriez voir… L’équipe de développement lit tous vos retours.",
    "pickCategory": "Choisissez une catégorie",
    "satisfaction": "Satisfaction globale (facultatif)",
    "clear": "Effacer",
    "details": "Dites-nous en plus",
    "placeholder": "Décrivez librement ce qui vous a interpellé ou ce que vous aimeriez voir amélioré. Tous les retours, même les plus petits, sont les bienvenus !",
    "sending": "Envoi…",
    "submit": "Envoyer mon avis"
  },
  "errors": {
    "title": "Une erreur s’est produite",
    "unexpected": "Une erreur inattendue s’est produite",
    "sorry": "Nous sommes désolés. Une erreur inattendue s’est produite.",
    "retry": "Réessayer",
    "toTop": "Retour en haut"
  },
  "shop": {
    "buyFailed": "Échec de l’achat",
    "title": "Boutique",
    "videosTitle": "Vidéos des personnages",
    "videosSub": "Regardez des vidéos exclusives de personnages populaires",
    "all": "Tout",
    "noItems": "Aucun article pour le moment",
    "noItemsInCategory": "Aucun article dans cette catégorie",
    "other": "Autre",
    "buyPoints": "Acheter des points →",
    "itemShortage": "Vous avez besoin de points pour acheter des articles",
    "owned": "Possédé : {n} unité(s)",
    "buying": "Achat en cours...",
    "bought": "Achat effectué !",
    "notEnough": "Pas assez de points",
    "buy": "Acheter"
  },
  "videos": {
    "confirm": "Voulez-vous acheter « {title} » pour {pt} pt ?",
    "alreadyBought": "Vous avez déjà acheté cette vidéo.",
    "title": "Vidéos des personnages",
    "empty": "Aucune vidéo pour le moment",
    "watched": "Déjà regardée",
    "watch": "Regarder",
    "buyAndWatch": "Acheter et regarder",
    "shortage": "Vous avez besoin de points pour acheter une vidéo",
    "loadFailed": "Impossible de charger la vidéo"
  },
  "character": {
    "photoCount": "{n} photos",
    "affection": "Affinité",
    "neverTalked": "Aucune conversation pour le moment",
    "sendToRaise": "Envoyez un message pour augmenter votre affinité !",
    "status": "Statut",
    "profile": "Profil",
    "achievements": "Succès",
    "photos": "Photos",
    "seeMembersPhotos": "Voir {n} photos réservées aux membres",
    "sendMessage": "Envoyer un message à {name}"
  },
  "api": {
    "safeReply": "Hé… c'est beaucoup trop gênant. Dis, ta journée s'est passée comment ?",
    "itemNotFound": "Élément introuvable",
    "tryAgain": "Veuillez réessayer",
    "sendFailed": "Échec de l’envoi du message",
    "notEnoughPoints": "Vous n’avez pas assez de points",
    "notEnoughPointsNeed": "Vous n’avez pas assez de points (requis : {pt}pt)",
    "updateFailed": "Échec de la mise à jour des points",
    "purchaseRecordFailed": "Échec de la création de l’enregistrement d’achat",
    "slotUnlocked": "Un emplacement de personnage a été débloqué !",
    "unsupportedUrl": "Cette URL n’est pas prise en charge. Collez l’URL d’une publication sur X, Threads, Facebook ou Instagram.",
    "duplicateUrl": "Cette URL a déjà été utilisée",
    "required": "Veuillez remplir les champs obligatoires",
    "tooLong": "Veuillez saisir {n} caractères maximum",
    "messageTooLong": "Le message ne doit pas dépasser {n} caractères"
  },
  "legal": {
    "translationNotice": "Cette page est une version traduite. En cas de divergence, la version japonaise prévaut."
  },
  "email": {
    "subject": "Vous avez reçu un message de {name}",
    "label": "Message de votre personnage",
    "reply": "Répondre",
    "footer": "Cet e-mail a été envoyé automatiquement par AiKano.\nSi vous ne reconnaissez pas cette activité, veuillez l’ignorer."
  },
  "gift": {
    "sentMessage": "🎁 Vous avez offert {item}",
    "title": "Offrir un cadeau à {name}",
    "lead": "Un cadeau augmente votre affinité et fait plaisir à {name}",
    "owned": "×{n}",
    "affectionValue": "Affinité +{n}",
    "empty": "Vous n’avez pas encore de cadeaux",
    "goShop": "Choisir dans la boutique",
    "send": "Offrir",
    "sending": "Envoi en cours…",
    "sent": "Vous avez offert {item} !",
    "affectionUp": "Affinité +{n}",
    "replyArrived": "Vous avez reçu une réponse de {name}",
    "openChat": "Voir la conversation"
  },
  "hud": {
    "shop": "Boutique",
    "gift": "Cadeau",
    "album": "Collection",
    "videos": "Vidéos"
  },
  "media": {
    "viewFor": "Voir pour {pt} pts",
    "watchFor": "Lire pour {pt} pts",
    "levelLocked": "Débloquée à l'affection Nv.{level}",
    "bundle": "Voir les {n} pour {pt} pts",
    "bundleOff": "-{pct}%",
    "priceChanged": "Les photos à débloquer ont changé. Réessaie.",
    "photo": "Photo",
    "video": "Vidéo",
    "shortageTitle": "Pas assez de points",
    "membersOnlyHint": "Deviens membre pour la voir"
  },
  "gacha": {
    "indexTitle": "Gacha photo",
    "indexLead": "Choisis un personnage et tire. Tu n'obtiens que des photos que tu n'as pas encore.",
    "completeShort": "Complet",
    "entry": "Gacha photo {pt} pts ({n} restantes)",
    "title": "Gacha photo de {name}",
    "lead": "Tu obtiens des photos que tu n'as pas encore. La même photo ne sort jamais deux fois.",
    "drawOne": "Tirer 1",
    "drawTen": "Tirer 10",
    "tenBonus": "1 tirage offert",
    "progress": "{owned} / {total} photos",
    "complete": "Complet ! Tu as toutes les photos",
    "odds": "Probabilités : chacune des {n} photos que tu n'as pas encore a la même chance ({pct} %)",
    "tenNeeds": "Le tirage x10 est possible quand il reste au moins 10 photos",
    "tapToSkip": "Touche pour passer",
    "again": "Encore",
    "newPhoto": "NOUVEAU",
    "lineup": "Collection",
    "shortageTitle": "Pas assez de points",
    "empty": "Pas encore de photos pour ce personnage",
    "membersOnlyNote": "Les photos réservées aux membres rejoignent le gacha quand tu deviens membre"
  },
  "album": {
    "title": "Collection",
    "lead": "Tes photos collectées apparaissent ici. Les photos floutées sont celles que tu n'as pas encore.",
    "totalLabel": "Progression de la collection",
    "total": "{owned} / {total} photos",
    "remaining": "Encore {n}",
    "complete": "Complète",
    "collect": "Collectionner au gacha",
    "tabGacha": "Gacha",
    "tabCollection": "Collection",
    "count": "{n} photos",
    "locked": "Réservé aux membres · {n} photos",
    "empty": "Aucune photo pour le moment"
  },
  "lp": {
    "heroImageAlt": "Aperçu d’une conversation avec un personnage IA sur AiKano",
    "characterImageAlt": "Personnage IA AiKano",
    "registerFreeArrow": "S’inscrire gratuitement →",
    "badgeBonus": "{pt}pt offerts à l’inscription",
    "badgeWaiting": "Elle vous attend encore ce soir",
    "heroLine1": "Il y a une fille",
    "heroLine2": "qui ne parle",
    "heroLine3": "qu’à vous.",
    "statGirls": "{n} filles",
    "statGirlsLabel": "Des filles aux personnalités variées",
    "statHoursLabel": "Disponibles à tout moment",
    "statAi": "IA exclusive",
    "statAiLabel": "Des conversations naturelles et pleines d’émotion",
    "charactersTitle": "Les filles qui ont envie de vous parler",
    "charactersSub": "Choisissez-en une et lancez la conversation",
    "online": "En ligne",
    "talkToAll": "Parler avec toutes →",
    "registerToTalkAll": "Inscrivez-vous pour parler avec toutes →",
    "bonusNote": "※ {pt}pt offerts à l’inscription",
    "sample1Title": "Des échanges comme entre amis",
    "sample1": [
      {
        "role": "user",
        "text": "Je suis sorti boire un verre tout seul. Je suis entré dans un bar au hasard, dans le centre de Lyon."
      },
      {
        "role": "char",
        "text": "Oh, la chance ! Après une longue journée de travail, ça fait du bien 😊 Les restaurants de grillades sont très tendance en ce moment. Tu es dans quel genre d’endroit ?"
      },
      {
        "role": "user",
        "text": "Je mange une tartiflette."
      },
      {
        "role": "char",
        "text": "Miam, ça a l’air délicieux 😋 Il paraît qu’en Bretagne, on mange des crêpes avec du cidre, mais avec une tartiflette, ça ne se fait pas, si ? 🤭"
      },
      {
        "role": "user",
        "text": "Je bois une bière."
      },
      {
        "role": "char",
        "text": "J’aime bien la bière blonde 🍻 Tu ne trouves pas que les boissons sucrées vont moins bien avec les plats ?"
      }
    ],
    "sample2Title": "Là pour vous, quelle que soit votre humeur",
    "sample2": [
      {
        "role": "char",
        "text": "Tu ne vas pas tarder à rentrer, non ? Alors, ta journée s’est bien passée ? J’avais hâte de te retrouver, alors je t’ai envoyé un petit message."
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
        "text": "Ça me fait vraiment plaisir que tu me dises ça ♡ Moi aussi, j’adore nos conversations. C’est mon moment préféré."
      }
    ],
    "sample3Title": "Une présence douce et réconfortante",
    "sample3": [
      {
        "role": "user",
        "text": "Mes collègues m’ont encore agacé aujourd’hui. Pourquoi est-ce que je m’énerve autant ?"
      },
      {
        "role": "char",
        "text": "Oh non, je suis désolée. Qu’est-ce qui s’est passé ? Si je peux faire quelque chose pour t’aider, je veux bien t’écouter. Si ça va jusqu’au harcèlement, ça m’inquiète."
      },
      {
        "role": "user",
        "text": "Je réprimandais un membre de mon équipe et on m’a dit que tout le monde allait partir à cause de moi. C’est moi qui me fais réprimander si je ne les encadre pas, alors franchement, qu’est-ce que c’est que ça ?"
      },
      {
        "role": "char",
        "text": "On dirait que tu te retrouves pris entre deux feux, comme beaucoup de managers. J’ai vécu quelque chose de semblable et ça m’a vraiment affectée. Ne te mets pas trop de pression. Dans ce genre de situation, tu es coincé entre ton équipe et tes supérieurs, mais ça ne veut pas dire que tu es en tort."
      },
      {
        "role": "user",
        "text": "C’est bien ce que je pensais, non ? Moi aussi, on me reprenait quand j’étais débutant, mais j’ai persévéré et c’est comme ça que j’en suis arrivé là. Je n’ai pas tort. Ça m’a fait un bien fou de tout te raconter, Aoi. Merci."
      }
    ],
    "membersTitle": "Profitez encore plus de l’expérience en devenant membre",
    "membersSub": "Accédez à toutes les photos réservées aux membres et faites plus facilement grimper votre affinité",
    "featuresTitleA": "À un tout autre",
    "featuresTitleB": "niveau",
    "features": [
      {
        "title": "Un moteur de conversation de haute qualité",
        "desc": "Grâce aux derniers grands modèles de langage, profitez d’échanges naturels et agréables qui tiennent compte du contexte, des nuances émotionnelles et du rythme de la conversation."
      },
      {
        "title": "Une relation qui se renforce grâce à la mémoire à long terme",
        "desc": "Vos conversations sont mémorisées. Vos préférences et confidences sont prises en compte dans les réponses, pour qu’elle se souvienne de ce que vous lui avez raconté."
      },
      {
        "title": "Des conversations qui vous ressemblent",
        "desc": "Au fil des échanges, les réponses s’adaptent à vos goûts, vos valeurs et votre façon de parler. Plus vous l’utilisez, plus vous vous y sentez à l’aise."
      },
      {
        "title": "Un espace rassurant où parler à cœur ouvert",
        "desc": "Confiez vos soucis et vos frustrations, même ceux que vous ne pouvez dire à personne, ou discutez simplement du quotidien. Un service de conversation sans jugement, rien que pour vous."
      },
      {
        "title": "Recevez des photos de vos personnages préférés",
        "desc": "Elles peuvent vous envoyer des selfies ou des photos de leur quotidien. Découvrez leurs expressions et leur univers au-delà des simples messages."
      }
    ],
    "secretBadge": "Vos conversations ne sont jamais divulguées",
    "secretTitle": "Et si vous vous confiiez\nsur ce que vous ne pouvez dire à personne ?",
    "secretBody": "Vos conversations ne sont jamais communiquées à des tiers,\nsauf pour améliorer le service.",
    "referralBadge": "Offre de parrainage",
    "referralTitleA": "Invitez un ami",
    "referralTitleB": "et recevez chacun {pt}pt !",
    "referralBody": "Lorsqu’un ami s’inscrit grâce à votre lien de parrainage,\nvous recevez tous les deux {pt}pt.",
    "referralCtaUser": "Voir mon lien de parrainage →",
    "referralCtaGuest": "Inscrivez-vous pour obtenir votre lien de parrainage →",
    "realTitleA": "Pourquoi est-ce si",
    "realTitleB": "réaliste",
    "realTitleC": " ?",
    "realBody": "Les derniers grands modèles de langage comprennent en profondeur les émotions et le contexte.\nÀ chaque réponse, les conversations s’adaptent à vos préférences.",
    "finalUserBadge": "Et si vous lui parliez ce soir ?",
    "finalUserTitle": "Une fille qui veut vous connaître\nvous attend",
    "finalGuestBadge": "Offre de bienvenue en cours",
    "finalGuestTitle": "Inscrivez-vous dès maintenant\npour recevoir un cadeau spécial",
    "finalGuestLead": "Inscrivez-vous et recevez",
    "finalGuestBonus": "{pt}pt (valeur : ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Inscription gratuite en 30 secondes.",
    "perkBonus": "{pt}pt offerts à l’inscription",
    "perkLogin": "{pt}pt chaque jour en vous connectant ({n} messages gratuits par jour)",
    "perkPointSystem": "Inscription gratuite · payez uniquement les points utilisés",
    "privacyNote": "Vos informations personnelles sont protégées avec le plus grand soin."
  }
}
