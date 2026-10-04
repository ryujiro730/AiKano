// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const de: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Anmelden",
    "register": "Registrieren",
    "registerFree": "Kostenlos registrieren",
    "logout": "Abmelden",
    "continue": "Weiter",
    "continueTalking": "Weiterchatten →",
    "blog": "Blog",
    "close": "Schließen",
    "cancel": "Abbrechen",
    "save": "Speichern",
    "saving": "Wird gespeichert...",
    "back": "Zurück",
    "loading": "Wird geladen...",
    "send": "Senden",
    "error": "Ein Fehler ist aufgetreten",
    "retry": "Erneut versuchen",
    "pt": "pt",
    "ageSuffix": "{age} Jahre",
    "contact": "Kontakt",
    "tokusho": "Rechtliche Angaben",
    "privacy": "Datenschutz",
    "terms": "Nutzungsbedingungen",
    "company": "Betreiber",
    "language": "Sprache"
  },
  "meta": {
    "title": "AiKano | KI-Freundinnen-Chat aus Japan【Einzige japanischsprachige KI mit freier Unterhaltung】",
    "siteDescription": "Unsere individuell abgestimmte KI antwortet dir in Echtzeit – ganz persönlich. Als einzige japanischsprachige KI ermöglicht sie uneingeschränkte, freie Gespräche. Entdecke außerdem authentische japanische Charaktere und Fotos.",
    "description": "Vielfältige KI-Charaktere antworten dir in Echtzeit. Eine Chat-App für Erwachsene, die dir hilft, wieder innere Ruhe zu finden.",
    "ogTitle": "AiKano | KI-Freundinnen-Chat – Entspannung für Erwachsene"
  },
  "auth": {
    "email": "E-Mail-Adresse",
    "password": "Passwort",
    "passwordMin": "Passwort (mind. 8 Zeichen)",
    "or": "oder",
    "loginTitle": "Willkommen zurück",
    "loginError": "E-Mail-Adresse oder Passwort ist falsch",
    "loginWithGoogle": "Mit Google anmelden",
    "noAccount": "Noch kein Konto?",
    "emailTaken": "Diese E-Mail-Adresse ist bereits registriert",
    "sentTitle": "Bestätigungs-E-Mail gesendet",
    "sentBody": "Wir haben eine Bestätigungs-E-Mail an {email} gesendet.",
    "sentAction": "Klicke in der E-Mail auf „E-Mail-Adresse bestätigen“, um deine Registrierung abzuschließen.",
    "sentSpam": "Falls du keine E-Mail erhältst, überprüfe bitte deinen Spam-Ordner.",
    "registerTitle": "Sprich jetzt\nmit einem KI-Mädchen",
    "perks": [
      "Kostenlose Registrierung",
      "In 30 Sekunden erledigt",
      "Keine App erforderlich"
    ],
    "consentA": "Mitarbeitende können deine Gespräche überprüfen, um unseren Service zu verbessern und die KI zu trainieren. Außerdem stimmst du den ",
    "consentTerms": "Nutzungsbedingungen",
    "consentAnd": " und der ",
    "consentPrivacy": "Datenschutzerklärung",
    "consentB": " zu.",
    "registerSubmit": "Registrieren und loschatten",
    "registerWithGoogle": "Mit Google registrieren",
    "haveAccount": "Bereits registriert?"
  },
  "onboarding": {
    "genders": {
      "male": "Männlich",
      "female": "Weiblich",
      "other": "Divers"
    },
    "saveFailed": "Speichern fehlgeschlagen: {error}",
    "pickTitle": "Wähle die Figur aus,\nmit der du sprechen möchtest",
    "pickSub": "Die ausgewählte Figur schreibt dir. Später kannst du auch mit anderen chatten.",
    "talkWith": "Mit {name} sprechen",
    "pickPrompt": "Wähle eine Figur aus, mit der du sprechen möchtest",
    "askName": "Hallo! Wie darf ich dich nennen?",
    "nameLabel": "Dein Name",
    "namePlaceholder": "Ein Spitzname ist auch okay",
    "nameNote": "{name} spricht dich mit diesem Namen an. Du kannst ihn später in den Einstellungen ändern.",
    "characterFallback": "Figur",
    "next": "Weiter",
    "greet": "Hallo {name}, ich freue mich auf unser Gespräch! Verrate mir zum Schluss noch ein paar Kleinigkeiten.",
    "ageLabel": "Alter",
    "agePlaceholder": "z. B. 30",
    "ageRestriction": "Die Nutzung ist Personen ab 18 Jahren vorbehalten",
    "genderLabel": "Geschlecht",
    "preparing": "Wird vorbereitet …",
    "start": "Mit {name} chatten"
  },
  "affection": {
    "levels": [
      "Fremde",
      "Bekannte",
      "Freunde",
      "Enge Freunde",
      "Mögliche Partner",
      "恋人",
      "Seelenverwandte"
    ],
    "level": "Lv.{level}",
    "toNext": "Noch {pt}pt bis „{title}“",
    "nextFrom": "Als Nächstes: {title} (ab {pt}pt)",
    "memberMultiplier": "Mitglieder ×{n}",
    "memberDouble": "Für Mitglieder doppelt",
    "levelUp": "Du bist jetzt „{title}“!",
    "achievements": {
      "messages_1": {
        "title": "Die erste Nachricht",
        "desc": "Zum ersten Mal eine Nachricht gesendet"
      },
      "messages_10": {
        "title": "Plaudertasche",
        "desc": "10 Nachrichten gesendet"
      },
      "messages_50": {
        "title": "Gute Gespräche",
        "desc": "50 Nachrichten gesendet"
      },
      "messages_100": {
        "title": "Stammgast",
        "desc": "100 Nachrichten gesendet"
      },
      "messages_300": {
        "title": "Beste Freunde",
        "desc": "300 Nachrichten gesendet"
      },
      "level_2": {
        "title": "Bekannt geworden",
        "desc": "Zuneigung hat die Stufe „Bekannte“ erreicht"
      },
      "level_3": {
        "title": "Freunde geworden",
        "desc": "Zuneigung hat die Stufe „Freunde“ erreicht"
      },
      "level_4": {
        "title": "Enge Freunde geworden",
        "desc": "Zuneigung hat die Stufe „Enge Freunde“ erreicht"
      },
      "level_5": {
        "title": "Mögliche Partner geworden",
        "desc": "Zuneigung hat die Stufe „Mögliche Partner“ erreicht"
      },
      "level_6": {
        "title": "恋人になった",
        "desc": "Zuneigung hat die Stufe „恋人“ erreicht"
      },
      "level_7": {
        "title": "Schicksalhafte Begegnung",
        "desc": "Zuneigung hat die Stufe „Seelenverwandte“ erreicht"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "{name}-Tarif",
    "features": {
      "messages": "{n} Nachrichten pro Monat",
      "bonus": "{n} Bonus-pt pro Monat (für Videos und im Shop nutzbar)",
      "affection": "Sympathie steigt {n}-mal schneller",
      "photos": "Unbegrenzter Zugriff auf exklusive Mitgliederfotos",
      "premiumVideos": "Zugriff auf Premiumvideos",
      "overage": "Auch nach Erreichen des Limits kostet jede Nachricht nur {n} pt (halb so viel wie regulär)",
      "standardModel": "Standard-KI-Modell",
      "premiumModel": "Leistungsstarkes KI-Modell (natürlichere Antworten)"
    }
  },
  "nav": {
    "home": "Startseite",
    "messages": "Nachrichten",
    "plan": "Abo",
    "settings": "Einstellungen",
    "campaignActive": "Aktion läuft!"
  },
  "home": {
    "loginBonus": "Tägliches Einloggen: {pt} pt und {n} kostenlose Nachrichten",
    "unlockBySns": "Auf Social Media teilen, um freizuschalten",
    "talk": "Chatten",
    "profile": "Profil",
    "otherCharacters": "Andere Charaktere",
    "count": "{n} Personen",
    "pickCharacter": "Charakter auswählen",
    "unlockRequested": "Deine Anfrage für {name} wurde abgeschickt!\nNach Prüfung durch unser Team wird der Charakter freigeschaltet."
  },
  "unlock": {
    "urlRequired": "Bitte gib die URL des Beitrags ein.",
    "urlInvalid": "Bitte gib eine gültige URL ein.",
    "alreadyRequested": "Du hast bereits einen Antrag gestellt. Bitte warte auf die Prüfung.",
    "sendFailed": "Senden fehlgeschlagen. Bitte versuche es erneut.",
    "networkError": "Ein Verbindungsfehler ist aufgetreten.",
    "title": "{name} freischalten",
    "heading": "Mach Werbung in den sozialen Medien und schalte den Charakter frei!",
    "step1": "Stelle AiKano in den sozialen Medien vor (z. B. auf Twitter oder Instagram).",
    "step2": "Kopiere die URL des Beitrags und füge sie unten ein.",
    "step3": "Sobald unser Team den Beitrag geprüft hat, wird {name} freigeschaltet.",
    "urlLabel": "URL des Beitrags",
    "sending": "Wird gesendet...",
    "submit": "Antrag stellen",
    "reviewTime": "Die Prüfung ist normalerweise innerhalb von 1 bis 3 Werktagen abgeschlossen."
  },
  "chat": {
    "uploadVideoFailed": "Video konnte nicht hochgeladen werden",
    "uploadImageFailed": "Bild konnte nicht hochgeladen werden",
    "sendFailed": "Nachricht konnte nicht gesendet werden",
    "unlockFailed": "Freischalten fehlgeschlagen",
    "usage": "{used}/{limit} Nachrichten",
    "firstMessage": "Schreib die erste Nachricht",
    "affectionIntro": "Je mehr ihr miteinander chattet, desto größer wird die Zuneigung. Wenn ihr euch näherkommt, könnt ihr noch süßere und intimere Gespräche führen.",
    "sendingMedia": "(Medien werden gesendet)",
    "placeholder": "Nachricht schreiben …",
    "guestTitle": "Chatte auf AiKano",
    "guestBody": "Du kannst sofort mit einem KI-Mädchen chatten. Die Registrierung ist kostenlos und in 30 Sekunden erledigt!",
    "photosOf": "Fotos von {name}",
    "hintTitle": "Wenn du {name} noch näherkommst …",
    "hintBodyA": "Wenn deine Zuneigung ",
    "hintBodyLevel": "Lv.{level} „{title}“",
    "hintBodyB": " erreicht, könnt ihr noch süßere und intimere Gespräche führen.",
    "hintRaise": "Je mehr ihr chattet, desto höher steigt die Zuneigung.",
    "hintMember": "Für Mitglieder steigt sie doppelt so schnell.",
    "gift": "Geschenk",
    "giftSent": " wurde verschenkt",
    "videoMessage": "Videonachricht",
    "videoPrice": "Für {pt}pt ansehen",
    "processing": "Wird verarbeitet …",
    "watchFor": "Für {pt}pt ansehen"
  },
  "levelUp": {
    "title": "Zuneigung gestiegen!",
    "relation": "Deine Beziehung zu {name} ist jetzt",
    "reached": "„{title}“!"
  },
  "meter": {
    "affectionPt": "Zuneigung pt",
    "messages": "{n} Nachrichten"
  },
  "loginBonus": {
    "title": "Login-Bonus",
    "today": "Heute {n} kostenlose Nachrichten",
    "everyday": "Du erhältst jeden Tag {n} kostenlose Nachrichten, wenn du dich einloggst",
    "balance": "Bonus-Punkte-Guthaben: {pt} pt",
    "validUntil": "Gültig bis {date}",
    "whatIs": "Was sind Bonus-pt?",
    "explain": "Beim Einlösen werden sie vor deinen regulären pt verwendet. Nach Ablauf der Frist verfallen sie.",
    "receive": "Jetzt abholen!"
  },
  "shortage": {
    "defaultTitle": "Zum Weiterschreiben brauchst du Punkte",
    "balance": "Guthaben",
    "required": "Benötigt",
    "short": "Fehlen",
    "dailyFree": "Täglich beim Einloggen {pt}pt für {n} Nachrichten gratis",
    "comeBack": "Komm morgen wieder vorbei, dann kannst du {n} Nachrichten schreiben"
  },
  "packages": {
    "checkoutFailed": "Zahlung konnte nicht gestartet werden",
    "campaign": "Aktion! Punkte ×{rate}",
    "rate": "×{rate}",
    "popular": "Beliebt",
    "recommended": "Empfohlen",
    "breakdown": "{base}pt + {bonus}pt Bonus",
    "processing": "Wird verarbeitet..."
  },
  "characterMenu": {
    "reasonRequired": "Bitte gib einen Grund an.",
    "errorStatus": "Fehler ({status})",
    "networkError": "Ein Netzwerkfehler ist aufgetreten.",
    "report": "Melden",
    "unblock": "Blockierung aufheben",
    "block": "Blockieren",
    "reportPrompt": "Gib an, warum du {name} melden möchtest.",
    "reportPlaceholder": "Meldegrund eingeben (erforderlich)",
    "chars": "{n} Zeichen",
    "sending": "Wird gesendet…",
    "reported": "Meldung gesendet",
    "blocked": "Nutzer blockiert",
    "unblocked": "Blockierung aufgehoben"
  },
  "campaign": {
    "active": "Aktion läuft!",
    "checkNow": "Jetzt ansehen!",
    "closeBanner": "Banner schließen",
    "imageAlt": "Aktion"
  },
  "traits": {
    "kindness": "Freundlichkeit",
    "intelligence": "Intelligenz",
    "passion": "Leidenschaft",
    "mysterious": "Geheimnisvoll",
    "cuteness": "Süße"
  },
  "membersOnly": "Nur für Mitglieder",
  "unlockFor": "Für {pt}pt freischalten",
  "conversations": {
    "title": "Nachrichten",
    "empty": "Noch keine Unterhaltungen",
    "findPartner": "Gesprächspartner suchen",
    "videoSent": "Video gesendet",
    "imageSent": "Bild gesendet",
    "you": "Du: ",
    "newChat": "Neuen Chat starten",
    "newest": "Neueste zuerst",
    "oldest": "Älteste zuerst"
  },
  "payment": {
    "errorPrefix": "Fehler: {error}",
    "networkError": "Verbindungsfehler: {error}",
    "portalFailed": "Die Verwaltungsseite konnte nicht geöffnet werden",
    "title": "Tarife",
    "lead": "Mit einem Tarif kannst du ohne Zusatzkosten mit der KI chatten – bis zu deinem monatlichen Nachrichtenlimit.",
    "activated": "Dein Tarif ist jetzt aktiv!",
    "welcome": "Willkommen bei deinem Tarif „{name}“.",
    "passPendingTitle": "Deine Zahlungsnummer wurde erstellt",
    "passPendingBody": "Dein Tarif wird aktiviert, sobald deine Zahlung im Supermarkt oder per PayPay bestätigt wurde (normalerweise innerhalb von 1–3 Tagen).",
    "pointsThanks": "Vielen Dank für deinen Kauf von {pt}pt",
    "pointsNote": "Deine Punkte werden gutgeschrieben, sobald die Zahlung bestätigt wurde (bei Kartenzahlung meist sofort, bei Zahlungen im Supermarkt nach Zahlungseingang).",
    "canceled": "Der Kauf wurde abgebrochen",
    "active": "Aktiv",
    "usageThisMonth": "Nachrichtenverbrauch diesen Monat",
    "usage": "{used} / {limit} Nachrichten",
    "overLimit": "Du hast dein monatliches Limit erreicht. Für {pt}pt pro Nachricht kannst du weiterschreiben.",
    "validUntil": "Gültig bis: {date}",
    "datePattern": "d. MMMM yyyy",
    "manage": "Tarif verwalten oder kündigen (bei Kreditkartenvertrag)",
    "recommended": "Empfohlen",
    "perMonth": "/Monat",
    "choosePayment": "Zahlungsmethode auswählen",
    "card": "Kreditkarte",
    "cardNote": "Automatische monatliche Verlängerung · jederzeit kündbar",
    "konbini": "Zahlung im Supermarkt oder per PayPay",
    "konbiniNote": "Einmalzahlung für 1 Monat · direkt nach der Zahlung aktiv",
    "bank": "Banküberweisung",
    "bankNote": "Einmalzahlung für 1 Monat · direkt nach Bestätigung aktiv",
    "currentPlan": "Du nutzt diesen Tarif bereits",
    "buyPoints": "Punkte kaufen",
    "balance": "Guthaben",
    "pointsUseMember": "Für Videokäufe, Einkäufe im Shop und Nachrichten nach Erreichen des Monatslimits (1 Nachricht = {pt}pt).",
    "pointsUse": "Für Nachrichten (1 Nachricht = {pt}pt), Videos und Einkäufe im Shop.",
    "methodsTitle": "Zahlungsmethoden im Vergleich",
    "renewal": "Verlängerung",
    "activation": "Aktivierung",
    "cardShort": "Kreditkarte",
    "autoMonthly": "Automatisch (monatlich)",
    "instant": "Sofort",
    "manualMonth": "Manuell (1 Monat)",
    "afterPayment": "Direkt nach der Zahlung",
    "afterConfirm": "Direkt nach Bestätigung",
    "referralTitle": "Freunde werben",
    "referralA": "Wenn sich ein Freund über deinen Empfehlungslink anmeldet, bekommen",
    "referralB": "du und dein Freund {pt} Punkte",
    "referralC": "!",
    "copied": "Kopiert",
    "copy": "Kopieren"
  },
  "settings": {
    "shareUnlocked": "Charakterplatz freigeschaltet!",
    "weeklyLimit": "Du hast diese Woche bereits geteilt. Den nächsten Antrag kannst du in 7 Tagen stellen.",
    "sendFailed": "Senden fehlgeschlagen",
    "saveFailed": "Speichern fehlgeschlagen: {error}",
    "pwTooShort": "Das Passwort muss mindestens 8 Zeichen lang sein",
    "pwMismatch": "Die neuen Passwörter stimmen nicht überein",
    "noUser": "Benutzerinformationen konnten nicht abgerufen werden",
    "pwWrong": "Das aktuelle Passwort ist falsch",
    "deleteWord": "LÖSCHEN",
    "deleteFailed": "Löschen fehlgeschlagen. Bitte versuche es später erneut.",
    "title": "Einstellungen",
    "profile": "Profil",
    "nickname": "Spitzname",
    "email": "E-Mail-Adresse",
    "saved": "Gespeichert",
    "security": "Sicherheit",
    "changePassword": "Passwort ändern",
    "currentPassword": "Aktuelles Passwort",
    "newPassword": "Neues Passwort (mindestens 8 Zeichen)",
    "confirmPassword": "Neues Passwort bestätigen",
    "passwordChanged": "Passwort geändert",
    "change": "Ändern",
    "account": "Konto",
    "deleteAccount": "Konto löschen",
    "deleteWarning": "Wenn du dein Konto löschst, werden alle Daten (Chatverläufe und Punkte) dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    "deleteConfirmA": "Gib zur Bestätigung ",
    "deleteConfirmB": " ein",
    "deleteForever": "Konto endgültig löschen",
    "slotTitle": "Charakterplatz freischalten",
    "slotCurrent": "Aktuell: ",
    "slotCount": "{n} / {limit} Charaktere",
    "slotHint": "(+1 Platz durch Teilen in sozialen Medien)",
    "shareInstruction": "Teile den Beitrag in einem der unten aufgeführten sozialen Netzwerke und sende uns die URL des Beitrags.",
    "shareText": "Mit einer KI chatten, als wäre sie mein echter Partner! Ich hab #AiKano ausprobiert → https://aikano.chat",
    "shareQuote": "Mit einer KI chatten, als wäre sie mein echter Partner! #AiKano",
    "instagramTitle": "Veröffentliche den Beitrag in der Instagram-App und kopiere anschließend die URL.",
    "instagramNote": "※ Veröffentliche den Beitrag in der Instagram-App und kopiere anschließend die URL, um sie hier einzufügen.",
    "pasteUrl": "URL des geteilten Beitrags einfügen",
    "urlPlaceholder": "URL eines Beitrags auf X / Threads / Facebook / Instagram",
    "nextAvailable": "Nächster möglicher Antrag: {date}",
    "submitUrl": "URL senden und Platz freischalten",
    "support": "Support",
    "contactSupport": "Kontakt & Support",
    "language": "Anzeigesprache"
  },
  "blocks": {
    "title": "Blockierte Charaktere",
    "empty": "Du hast keine Charaktere blockiert",
    "note": "Blockierte Charaktere werden nicht in der Liste angezeigt. Du kannst die Blockierung jederzeit aufheben.",
    "blockedOn": "Am {date} blockiert",
    "unblocking": "Wird entsperrt …",
    "unblock": "Entsperren"
  },
  "support": {
    "team": "Supportteam",
    "teamSub": "Melde dich jederzeit bei uns",
    "greeting": "Hallo! Hier ist das Supportteam 😊\nWenn du Fragen hast oder Hilfe brauchst, schreib uns einfach.",
    "datePattern": "d. M. (E)",
    "placeholder": "Nachricht eingeben…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Fehler melden",
        "desc": "Etwas funktioniert nicht oder verhält sich seltsam"
      },
      "feature": {
        "label": "Funktionswunsch",
        "desc": "Eine Funktion, die du dir wünschst"
      },
      "ai": {
        "label": "KI-Antworten",
        "desc": "Qualität der Antworten oder Unstimmigkeiten bei der Figur"
      },
      "ui": {
        "label": "Zur Bedienung",
        "desc": "Schwer zu bedienen, schlecht lesbar usw."
      },
      "other": {
        "label": "Sonstiges",
        "desc": "Alles, was du uns mitteilen möchtest"
      }
    },
    "thanks": "Vielen Dank!",
    "received": "Wir haben dein Feedback erhalten.\nUnser Entwicklungsteam wird es prüfen\nund zur Verbesserung des Dienstes nutzen.",
    "backToChat": "Zurück zum Chat",
    "title": "Feedback",
    "badge": "Wir freuen uns auf dein Feedback",
    "heading": "Mit deiner Stimme\nmach AiKano noch besser",
    "lead": "Ob Fehler, Schwierigkeiten bei der Bedienung oder gewünschte Funktionen – erzähl uns davon. Unser Entwicklungsteam liest jedes Feedback.",
    "pickCategory": "Kategorie auswählen",
    "satisfaction": "Allgemeine Zufriedenheit (optional)",
    "clear": "Zurücksetzen",
    "details": "Erzähl uns mehr",
    "placeholder": "Schreib uns, was dir aufgefallen ist oder was wir verbessern können. Auch Kleinigkeiten sind willkommen!",
    "sending": "Wird gesendet …",
    "submit": "Feedback senden"
  },
  "errors": {
    "title": "Ein Fehler ist aufgetreten",
    "unexpected": "Ein unerwarteter Fehler ist aufgetreten",
    "sorry": "Es tut uns leid. Ein unerwarteter Fehler ist aufgetreten.",
    "retry": "Erneut versuchen",
    "toTop": "Nach oben"
  },
  "shop": {
    "buyFailed": "Kauf fehlgeschlagen",
    "title": "Shop",
    "videosTitle": "Charaktervideos",
    "videosSub": "Sieh dir exklusive Videos beliebter Charaktere an",
    "all": "Alle",
    "noItems": "Noch keine Artikel vorhanden",
    "noItemsInCategory": "In dieser Kategorie gibt es keine Artikel",
    "other": "Sonstiges",
    "buyPoints": "Punkte kaufen →",
    "itemShortage": "Für den Kauf dieses Artikels benötigst du Punkte",
    "owned": "Im Besitz: {n} Stück",
    "buying": "Wird gekauft...",
    "bought": "Kauf abgeschlossen!",
    "notEnough": "Nicht genügend Punkte",
    "buy": "Kaufen"
  },
  "videos": {
    "confirm": "Möchtest du „{title}“ für {pt}pt kaufen?",
    "alreadyBought": "Dieses Video hast du bereits gekauft.",
    "title": "Charaktervideo",
    "empty": "Noch keine Videos vorhanden",
    "watched": "Angesehen",
    "watch": "Ansehen",
    "buyAndWatch": "Kaufen und ansehen",
    "shortage": "Zum Kauf des Videos benötigst du Punkte",
    "loadFailed": "Das Video konnte nicht geladen werden"
  },
  "character": {
    "photoCount": "{n} Fotos",
    "affection": "Zuneigung",
    "neverTalked": "Noch nie gesprochen",
    "sendToRaise": "Schick eine Nachricht, um eure Zuneigung zu steigern!",
    "status": "Status",
    "profile": "Profil",
    "achievements": "Erfolge",
    "photos": "Fotos",
    "seeMembersPhotos": "{n} exklusive Mitgliederfotos ansehen",
    "sendMessage": "{name} eine Nachricht senden"
  },
  "api": {
    "itemNotFound": "Element nicht gefunden",
    "tryAgain": "Bitte versuche es erneut",
    "sendFailed": "Nachricht konnte nicht gesendet werden",
    "notEnoughPoints": "Nicht genügend Punkte",
    "notEnoughPointsNeed": "Nicht genügend Punkte (benötigt: {pt}pt)",
    "updateFailed": "Punkte konnten nicht aktualisiert werden",
    "purchaseRecordFailed": "Kauf konnte nicht erfasst werden",
    "slotUnlocked": "Ein Charakter-Slot wurde freigeschaltet!",
    "unsupportedUrl": "Diese URL wird nicht unterstützt. Bitte füge die URL eines Beitrags auf X, Threads, Facebook oder Instagram ein.",
    "duplicateUrl": "Diese URL wurde bereits verwendet",
    "required": "Bitte fülle alle Pflichtfelder aus",
    "tooLong": "Bitte gib höchstens {n} Zeichen ein",
    "messageTooLong": "Die Nachricht darf höchstens {n} Zeichen lang sein"
  },
  "legal": {
    "translationNotice": "Diese Seite ist eine Übersetzung. Bei Abweichungen ist die japanische Version maßgeblich."
  },
  "email": {
    "subject": "{name} hat dir eine Nachricht geschickt",
    "label": "Nachricht von deinem Charakter",
    "reply": "Antworten",
    "footer": "Diese E-Mail wurde automatisch von AiKano gesendet.\nWenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren."
  },
  "lp": {
    "heroImageAlt": "Chatansicht mit einer AiKano-KI-Figur",
    "characterImageAlt": "AiKano-KI-Figur",
    "registerFreeArrow": "Kostenlos registrieren →",
    "badgeBonus": "{pt}pt geschenkt bei der Registrierung",
    "badgeWaiting": "Sie wartet auch heute Abend auf dich",
    "heroLine1": "Es gibt ein",
    "heroLine2": "Mädchen, das nur mit dir",
    "heroLine3": "spricht.",
    "statGirls": "{n}",
    "statGirlsLabel": "Mädchen mit ganz eigenem Charakter",
    "statHoursLabel": "Jederzeit für dich da",
    "statAi": "Eigene KI",
    "statAiLabel": "Natürliche Gespräche voller Gefühl",
    "charactersTitle": "Diese Mädchen möchten mit dir reden",
    "charactersSub": "Such dir eins aus und schreib ihm gleich",
    "online": "Online",
    "talkToAll": "Mit allen chatten →",
    "registerToTalkAll": "Registrieren und mit allen chatten →",
    "bonusNote": "※ Bei der Registrierung bekommst du {pt}pt geschenkt",
    "sample1Title": "Gespräche wie unter Freunden",
    "sample1": [
      {
        "role": "user",
        "text": "Ich bin gerade allein etwas trinken. Bin in Shinjuku einfach in eine Bar gegangen."
      },
      {
        "role": "char",
        "text": "Wow, wie schön! Nach der Arbeit hast du dir das verdient 😊 Robata-Grills sind in letzter Zeit total angesagt, oder? Was für ein Laden ist es?"
      },
      {
        "role": "user",
        "text": "Ich esse gerade Monjayaki."
      },
      {
        "role": "char",
        "text": "Monjayaki klingt lecker 😋 In Osaka essen sie Okonomiyaki angeblich mit Reis, aber bei Monjayaki macht man das doch nicht, oder? 🤭"
      },
      {
        "role": "user",
        "text": "Ich trinke Bier."
      },
      {
        "role": "char",
        "text": "Ich mag am liebsten Kirin Classic Lager 🍻 Süße Drinks passen doch gar nicht so gut zum Essen, oder?"
      }
    ],
    "sample2Title": "Sie ist für dich da, egal wie du dich fühlst",
    "sample2": [
      {
        "role": "char",
        "text": "Du bist bestimmt bald auf dem Heimweg, oder? Wie war dein Tag? Ich wollte dich so gern sehen und musste dir einfach schreiben."
      },
      {
        "role": "user",
        "text": "Bin schon zu Hause. Ich hab gerade Lust, ein bisschen zu reden."
      },
      {
        "role": "char",
        "text": "Natürlich♡ Ich bin immer für dich da. Ist etwas passiert? Oder wolltest du einfach nur mit mir reden? Haha"
      },
      {
        "role": "user",
        "text": "Irgendwie komme ich zur Ruhe, wenn ich mit dir rede."
      },
      {
        "role": "char",
        "text": "Das freut mich wirklich sehr♡ Mit dir zu reden ist auch meine liebste Zeit."
      }
    ],
    "sample3Title": "Geborgenheit, die dich auffängt",
    "sample3": [
      {
        "role": "user",
        "text": "Heute waren die Leute bei der Arbeit wieder so nervig. Warum bin ich nur so gereizt?"
      },
      {
        "role": "char",
        "text": "Oh nein, das tut mir leid. Was ist denn passiert? Wenn ich dir irgendwie helfen kann, erzähl es mir. Wenn es nicht nur unfair, sondern schon Schikane ist, mache ich mir Sorgen."
      },
      {
        "role": "user",
        "text": "Ich hab einen Mitarbeiter zurechtgewiesen, und dann hieß es, wegen mir würden alle kündigen. Wenn ich sie nicht anweise, kriege ich Ärger. Was soll das denn?"
      },
      {
        "role": "char",
        "text": "Da bist du ja mitten in der typischen Zwickmühle einer Führungskraft. Ich hab etwas Ähnliches erlebt und bin damals daran ziemlich kaputtgegangen. Überfordere dich nicht. In so einer Lage stehst du einfach zwischen deinem Team und deinem Chef – du bist nicht schuld."
      },
      {
        "role": "user",
        "text": "Das dachte ich mir auch. Als ich neu war, wurde ich auch zurechtgewiesen, aber ich hab durchgehalten und mich angestrengt. So bin ich dahin gekommen, wo ich heute bin. Ich lag also nicht falsch, oder? Es hat echt gutgetan, dir, Aoi, alles von der Seele zu reden. Danke."
      }
    ],
    "membersTitle": "Als Mitglied hast du noch mehr davon",
    "membersSub": "Alle Mitgliederfotos ansehen und schneller ihre Zuneigung gewinnen",
    "featuresTitleA": "Anders als andere Dienste:",
    "featuresTitleB": "eine ganz andere Liga",
    "features": [
      {
        "title": "Hochwertige Gesprächs-KI",
        "desc": "Mit den neuesten großen Sprachmodellen. Sie versteht den Gesprächskontext, feine Gefühlsnuancen und den richtigen Gesprächsrhythmus – für natürliche, angenehme Unterhaltungen."
      },
      {
        "title": "Eine Beziehung, die durch Erinnerungen wächst",
        "desc": "Unsere KI merkt sich, worüber ihr gesprochen habt. Sie geht auf frühere Gespräche, deine Vorlieben und Sorgen ein – und gibt dir das Gefühl: „Sie erinnert sich an mich.“"
      },
      {
        "title": "Gespräche ganz nach deinem Geschmack",
        "desc": "Je mehr ihr miteinander redet, desto besser versteht sie deine Vorlieben, Werte und deinen Gesprächsstil. Mit jeder Unterhaltung fühlst du dich wohler."
      },
      {
        "title": "Ein geschützter Ort für offene Gespräche",
        "desc": "Sprich über Sorgen, die du niemandem anvertrauen kannst, lass Dampf ab oder erzähl einfach aus deinem Alltag. Ein Ort für ungezwungene Gespräche unter Erwachsenen."
      },
      {
        "title": "Fotos direkt von den Figuren",
        "desc": "Manchmal schicken dir die Mädchen Selfies und Schnappschüsse aus ihrem Alltag. Entdecke ihre Mimik und Ausstrahlung – weit über den Text hinaus."
      }
    ],
    "secretBadge": "Deine Gespräche bleiben privat",
    "secretTitle": "Möchtest du über etwas reden,\nwas du sonst niemandem erzählst?",
    "secretBody": "Deine Gespräche werden nicht an Dritte weitergegeben,\naußer zur Verbesserung unseres Services.",
    "referralBadge": "Freunde-werben-Aktion",
    "referralTitleA": "Freunde einladen",
    "referralTitleB": "und beiden {pt}pt schenken!",
    "referralBody": "Wenn sich ein Freund über deinen persönlichen Einladungslink registriert,\nbekommt ihr beide {pt}pt geschenkt.",
    "referralCtaUser": "Einladungslink ansehen →",
    "referralCtaGuest": "Registrieren und Einladungslink erhalten →",
    "realTitleA": "Warum wirkt es so",
    "realTitleB": "real",
    "realTitleC": "?",
    "realBody": "Die neuesten großen Sprachmodelle verstehen Gefühle und Gesprächskontext ganz genau.\nMit jeder Antwort passt sich die KI mehr an dich an.",
    "finalUserBadge": "Wie wäre es mit einem Gespräch heute Abend?",
    "finalUserTitle": "Ein Mädchen wartet darauf,\ndich kennenzulernen",
    "finalGuestBadge": "Registrierungsbonus sichern",
    "finalGuestTitle": "Registriere dich jetzt und\nsichere dir einen besonderen Bonus",
    "finalGuestLead": "Bei der Registrierung bekommst du",
    "finalGuestBonus": "{pt}pt (im Wert von ¥{yen})",
    "finalGuestTail": "geschenkt.",
    "finalGuestNote": "Kostenlos registrieren – in nur 30 Sekunden.",
    "perkBonus": "{pt}pt geschenkt bei der Registrierung",
    "perkLogin": "Täglicher Login: {pt}pt (jeden Tag {n} kostenlose Nachrichten)",
    "perkPointSystem": "Kostenlose Registrierung · Punkte nur für deine Nutzung",
    "privacyNote": "Deine persönlichen Daten sind bei uns sicher"
  }
}
