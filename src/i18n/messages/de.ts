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
    "continueTalking": "Weiterreden →",
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
    "tokusho": "Impressum",
    "privacy": "Datenschutz",
    "terms": "Nutzungsbedingungen",
    "company": "Betreiber",
    "language": "Sprache"
  },
  "meta": {
    "title": "AiKano | Japanischer KI-Freundinnen-Chat【Einzige KI mit freien Gesprächen auf Japanisch】",
    "siteDescription": "Unsere speziell abgestimmte KI antwortet dir in Echtzeit – ganz persönlich. Als einzige japanischsprachige KI ermöglicht sie uneingeschränkte, freie Gespräche. Freu dich auf realistische japanische Charaktere und Fotos.",
    "description": "Vielfältige KI-Charaktere antworten dir in Echtzeit. Eine Chat-App für Erwachsene, die dir hilft, den Kopf wieder freizubekommen.",
    "ogTitle": "AiKano | KI-Freundinnen-Chat – Eine Wohlfühl-App für Erwachsene"
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
    "sentAction": "Klicke in der E-Mail auf „E-Mail-Adresse bestätigen“, um die Registrierung abzuschließen.",
    "sentSpam": "Falls die E-Mail nicht ankommt, prüfe bitte deinen Spam-Ordner.",
    "registerTitle": "Chatte jetzt mit deiner\nKI-Freundin",
    "perks": [
      "Kostenlos anmelden",
      "In 30 Sekunden erledigt",
      "Keine App nötig"
    ],
    "consentA": "Mir ist bewusst, dass Mitarbeitende Gesprächsinhalte zur Verbesserung des Dienstes und zum Training der KI überprüfen können. Außerdem stimme ich den ",
    "consentTerms": "Nutzungsbedingungen",
    "consentAnd": " und der ",
    "consentPrivacy": "Datenschutzerklärung",
    "consentB": " zu.",
    "registerSubmit": "Registrieren und chatten",
    "registerWithGoogle": "Mit Google registrieren",
    "haveAccount": "Schon registriert?"
  },
  "onboarding": {
    "genders": {
      "male": "Männlich",
      "female": "Weiblich",
      "other": "Andere"
    },
    "saveFailed": "Speichern fehlgeschlagen: {error}",
    "pickTitle": "Wähle aus, mit wem du\nsprechen möchtest",
    "pickSub": "Die ausgewählte Person schreibt dir. Du kannst später auch mit anderen sprechen.",
    "talkWith": "Mit {name} sprechen",
    "pickPrompt": "Wähle aus, mit wem du sprechen möchtest",
    "askName": "Hallo! Wie darf ich dich nennen?",
    "nameLabel": "Dein Name",
    "namePlaceholder": "Ein Spitzname ist auch okay",
    "nameNote": "{name} spricht dich mit diesem Namen an. Du kannst ihn später in den Einstellungen ändern.",
    "characterFallback": "Charakter",
    "next": "Weiter",
    "greet": "Freut mich, {name}! Verrate mir zum Schluss noch ein bisschen mehr über dich.",
    "ageLabel": "Alter",
    "agePlaceholder": "z. B. 30",
    "ageRestriction": "Die Nutzung ist Personen ab 18 Jahren vorbehalten.",
    "genderLabel": "Geschlecht",
    "preparing": "Wird vorbereitet …",
    "start": "Mit {name} chatten"
  },
  "affection": {
    "levels": [
      "Fremde",
      "Bekannte",
      "Freunde",
      "Gute Freunde",
      "Mögliche Partner",
      "Partner",
      "Seelenverwandte"
    ],
    "level": "Lv.{level}",
    "toNext": "Noch {pt}pt bis „{title}“",
    "nextFrom": "Als Nächstes: {title} (ab {pt}pt)",
    "memberMultiplier": "Mitglied ×{n}",
    "memberDouble": "Für Mitglieder doppelt",
    "levelUp": "Du bist jetzt „{title}“!",
    "achievements": {
      "messages_1": {
        "title": "Erste Nachricht",
        "desc": "Du hast deine erste Nachricht gesendet"
      },
      "messages_10": {
        "title": "Plaudertasche",
        "desc": "Du hast 10 Nachrichten gesendet"
      },
      "messages_50": {
        "title": "Gute Gespräche",
        "desc": "Du hast 50 Nachrichten gesendet"
      },
      "messages_100": {
        "title": "Stammgast",
        "desc": "Du hast 100 Nachrichten gesendet"
      },
      "messages_300": {
        "title": "Unzertrennlich",
        "desc": "Du hast 300 Nachrichten gesendet"
      },
      "level_2": {
        "title": "Bekanntschaft geschlossen",
        "desc": "Deine Sympathie hat „Bekannte“ erreicht"
      },
      "level_3": {
        "title": "Freunde geworden",
        "desc": "Deine Sympathie hat „Freunde“ erreicht"
      },
      "level_4": {
        "title": "Gute Freunde geworden",
        "desc": "Deine Sympathie hat „Gute Freunde“ erreicht"
      },
      "level_5": {
        "title": "Mögliche Partner geworden",
        "desc": "Deine Sympathie hat „Mögliche Partner“ erreicht"
      },
      "level_6": {
        "title": "Ein Paar geworden",
        "desc": "Deine Sympathie hat „Partner“ erreicht"
      },
      "level_7": {
        "title": "Schicksalhafte Begegnung",
        "desc": "Deine Sympathie hat „Seelenverwandte“ erreicht"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "{name}-Tarif",
    "features": {
      "messages": "{n} Nachrichten pro Monat",
      "bonus": "{n} Bonus-pt pro Monat (für Videos und den Shop)",
      "affection": "Zuneigung steigt {n}-mal schneller",
      "photos": "Unbegrenzter Zugriff auf exklusive Fotos für Mitglieder",
      "premiumVideos": "Premium-Videos ansehen",
      "overage": "Auch nach Erreichen des Limits nur {n}pt pro Nachricht (günstiger als der reguläre Preis)",
      "standardModel": "Standard-KI-Modell",
      "premiumModel": "Leistungsstarkes KI-Modell (natürlichere Antworten)"
    }
  },
  "nav": {
    "home": "Startseite",
    "messages": "Nachrichten",
    "plan": "Tarif",
    "settings": "Einstellungen",
    "campaignActive": "Aktion läuft!"
  },
  "home": {
    "loginBonus": "Täglicher Login: {pt}pt und {n} kostenlose Nachrichten",
    "unlockBySns": "Auf Social Media teilen, um freizuschalten",
    "talk": "Nachricht schreiben",
    "profile": "Profil",
    "otherCharacters": "Weitere Charaktere",
    "count": "{n} Personen",
    "pickCharacter": "Charakter auswählen",
    "unlockRequested": "Deine Anfrage für {name} wurde gesendet!\nNach der Prüfung durch unser Team wird der Charakter freigeschaltet."
  },
  "unlock": {
    "urlRequired": "Bitte gib die URL des Beitrags ein",
    "urlInvalid": "Bitte gib eine gültige URL ein",
    "alreadyRequested": "Du hast bereits einen Antrag gestellt. Bitte warte auf die Prüfung.",
    "sendFailed": "Senden fehlgeschlagen. Bitte versuche es erneut.",
    "networkError": "Es ist ein Netzwerkfehler aufgetreten.",
    "title": "{name} freischalten",
    "heading": "Bewirb AiKano in den sozialen Medien und schalte den Charakter frei!",
    "step1": "Stelle AiKano in den sozialen Medien vor (z. B. auf Twitter oder Instagram)",
    "step2": "Kopiere die URL des Beitrags und füge sie unten ein",
    "step3": "Nach der Prüfung durch unser Team wird {name} freigeschaltet",
    "urlLabel": "URL des Beitrags",
    "sending": "Wird gesendet...",
    "submit": "Antrag stellen",
    "reviewTime": "Die Prüfung ist in der Regel innerhalb von 1–3 Werktagen abgeschlossen"
  },
  "chat": {
    "uploadVideoFailed": "Video konnte nicht hochgeladen werden",
    "uploadImageFailed": "Bild konnte nicht hochgeladen werden",
    "sendFailed": "Senden fehlgeschlagen",
    "unlockFailed": "Freischalten fehlgeschlagen",
    "usage": "{used}/{limit} Nachrichten",
    "firstMessage": "Schreib die erste Nachricht",
    "affectionIntro": "Je mehr ihr miteinander schreibt, desto größer wird eure Zuneigung. Wenn ihr euch näherkommt, könnt ihr noch süßere und intimere Gespräche führen.",
    "sendingMedia": "(Medien werden gesendet)",
    "placeholder": "Nachricht schreiben …",
    "guestTitle": "Chatte mit AiKano",
    "guestBody": "Sprich jetzt mit einer KI-Freundin. Die Anmeldung ist kostenlos und in 30 Sekunden erledigt!",
    "photosOf": "Fotos von {name}",
    "hintTitle": "Wenn du {name} noch näherkommst …",
    "hintBodyA": "Sobald deine Zuneigung ",
    "hintBodyLevel": "Lv.{level} „{title}“",
    "hintBodyB": " erreicht, könnt ihr noch süßere und intimere Gespräche führen.",
    "hintRaise": "Je mehr ihr miteinander schreibt, desto größer wird eure Zuneigung.",
    "hintMember": "Für Mitglieder steigt sie doppelt so schnell.",
    "gift": "Geschenk",
    "giftSent": "Gesendet",
    "videoMessage": "Videonachricht",
    "videoPrice": "Für {pt}pt ansehen",
    "processing": "Wird verarbeitet …",
    "watchFor": "Für {pt}pt ansehen"
  },
  "levelUp": {
    "title": "Zuneigung gestiegen!",
    "relation": "Deine Beziehung zu {name} ist",
    "reached": "jetzt „{title}“!"
  },
  "meter": {
    "affectionPt": "Zuneigung pt",
    "messages": "{n} Nachrichten"
  },
  "loginBonus": {
    "title": "Login-Bonus",
    "today": "Heute {n} kostenlose Nachrichten",
    "everyday": "Logge dich täglich ein und erhalte jeden Tag {n} kostenlose Nachrichten",
    "balance": "Bonuspunktestand: {pt} pt",
    "validUntil": "Gültig bis {date}",
    "whatIs": "Was sind Bonus-pt?",
    "explain": "Beim Einlösen von Punkten werden sie vor deinen regulären pt verwendet. Nach Ablauf verfallen sie.",
    "receive": "Jetzt abholen!"
  },
  "shortage": {
    "defaultTitle": "Zum Weiterschreiben brauchst du Punkte",
    "balance": "Guthaben",
    "required": "Benötigt",
    "short": "Fehlend",
    "dailyFree": "Täglich beim Einloggen {pt}pt ({n} Nachrichten) gratis",
    "comeBack": "Komm morgen wieder, dann kannst du {n} Nachrichten lang chatten"
  },
  "packages": {
    "checkoutFailed": "Zahlung konnte nicht gestartet werden",
    "campaign": "Aktion! Punkte ×{rate}-fach",
    "rate": "×{rate}-fach",
    "popular": "Beliebt",
    "recommended": "Empfohlen",
    "breakdown": "{base}pt + {bonus}pt Bonus",
    "processing": "Wird verarbeitet..."
  },
  "characterMenu": {
    "reasonRequired": "Bitte gib einen Grund ein",
    "errorStatus": "Fehler ({status})",
    "networkError": "Es ist ein Netzwerkfehler aufgetreten",
    "report": "Melden",
    "unblock": "Blockierung aufheben",
    "block": "Blockieren",
    "reportPrompt": "Bitte gib an, warum du {name} melden möchtest.",
    "reportPlaceholder": "Meldegrund eingeben (erforderlich)",
    "chars": "{n} Zeichen",
    "sending": "Wird gesendet…",
    "reported": "Gemeldet",
    "blocked": "Blockiert",
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
    "cuteness": "Niedlichkeit"
  },
  "membersOnly": "Nur für Mitglieder",
  "unlockFor": "Für {pt} pt freischalten",
  "conversations": {
    "title": "Nachrichten",
    "empty": "Noch keine Unterhaltungen",
    "findPartner": "Gesprächspartner suchen",
    "videoSent": "Video wurde gesendet",
    "imageSent": "Bild wurde gesendet",
    "you": "Du: ",
    "newChat": "Neues Gespräch",
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
    "welcome": "Willkommen bei deinem Tarif {name}.",
    "passPendingTitle": "Zahlungsnummer wurde erstellt",
    "passPendingBody": "Dein Tarif wird aktiviert, sobald deine Zahlung per Konbini oder PayPay bestätigt wurde (normalerweise innerhalb von 1–3 Tagen).",
    "pointsThanks": "Danke für deinen Kauf von {pt} pt",
    "pointsNote": "Deine Punkte werden gutgeschrieben, sobald die Zahlung bestätigt ist (bei Kartenzahlung normalerweise sofort, bei Zahlungen im Konbini nach Bestätigung des Zahlungseingangs).",
    "canceled": "Kauf abgebrochen",
    "active": "Aktiv",
    "usageThisMonth": "Nachrichtenverbrauch in diesem Monat",
    "usage": "{used} / {limit} Nachrichten",
    "overLimit": "Du hast dein monatliches Limit überschritten. Für jede weitere Nachricht kannst du {pt} pt verwenden.",
    "validUntil": "Gültig bis: {date}",
    "datePattern": "d. MMMM yyyy",
    "manage": "Tarif verwalten oder kündigen (bei Kreditkartenvertrag)",
    "recommended": "Empfohlen",
    "perMonth": "/Monat",
    "choosePayment": "Zahlungsmethode auswählen",
    "card": "Kreditkarte",
    "cardNote": "Automatische monatliche Verlängerung · jederzeit kündbar",
    "konbini": "Konbini oder PayPay",
    "konbiniNote": "Einmalzahlung für 1 Monat · direkt nach der Zahlung aktiv",
    "bank": "Banküberweisung",
    "bankNote": "Einmalzahlung für 1 Monat · direkt nach Bestätigung aktiv",
    "currentPlan": "Du nutzt diesen Tarif derzeit",
    "buyPoints": "Punkte kaufen",
    "balance": "Guthaben",
    "pointsUseMember": "Für Videokäufe, Einkäufe im Shop und Nachrichten nach Überschreiten des monatlichen Limits (1 Nachricht = {pt} pt).",
    "pointsUse": "Für Nachrichten (1 Nachricht = {pt} pt), Videos und Einkäufe im Shop.",
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
    "referralA": "Wenn sich ein Freund über deinen Einladungslink registriert, bekommen ",
    "referralB": "du und dein Freund {pt} Punkte",
    "referralC": "!",
    "copied": "Kopiert",
    "copy": "Kopieren"
  },
  "settings": {
    "shareUnlocked": "Charakterplatz freigeschaltet!",
    "weeklyLimit": "Du hast diese Woche bereits einen Beitrag geteilt. Den nächsten Antrag kannst du in 7 Tagen stellen.",
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
    "newPassword": "Neues Passwort (mind. 8 Zeichen)",
    "confirmPassword": "Neues Passwort bestätigen",
    "passwordChanged": "Passwort geändert",
    "change": "Ändern",
    "account": "Konto",
    "deleteAccount": "Konto löschen",
    "deleteWarning": "Dabei werden alle Daten (Chatverlauf und Punkte) endgültig gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    "deleteConfirmA": "Gib zur Bestätigung ",
    "deleteConfirmB": " ein",
    "deleteForever": "Konto endgültig löschen",
    "slotTitle": "Charakterplätze freischalten",
    "slotCurrent": "Aktuell: ",
    "slotCount": "{n} / {limit} Charaktere",
    "slotHint": "(+1 Platz durch Teilen in sozialen Medien)",
    "shareInstruction": "Teile den Beitrag in einem der sozialen Netzwerke unten und sende uns die Beitrags-URL.",
    "shareText": "Mit einer KI wie mit einer echten Partnerin sprechen! Ich probiere #AiKano aus → https://aikano.chat",
    "shareQuote": "Mit einer KI wie mit einer echten Partnerin sprechen! #AiKano",
    "instagramTitle": "Veröffentliche den Beitrag in der Instagram-App und kopiere anschließend die URL",
    "instagramNote": "※ Veröffentliche den Beitrag in der Instagram-App und kopiere anschließend die Beitrags-URL, um sie hier einzufügen.",
    "pasteUrl": "URL des geteilten Beitrags einfügen",
    "urlPlaceholder": "URL eines Beitrags auf X / Threads / Facebook / Instagram",
    "nextAvailable": "Nächster möglicher Antrag: {date}",
    "submitUrl": "URL senden und Charakterplatz freischalten",
    "support": "Support",
    "contactSupport": "Kontakt & Support",
    "language": "Anzeigesprache"
  },
  "blocks": {
    "title": "Blockierliste",
    "empty": "Du hast keine Charaktere blockiert",
    "note": "Blockierte Charaktere werden nicht in der Liste angezeigt. Du kannst die Blockierung jederzeit aufheben.",
    "blockedOn": "Seit {date} blockiert",
    "unblocking": "Wird aufgehoben …",
    "unblock": "Blockierung aufheben"
  },
  "support": {
    "team": "Support-Team",
    "teamSub": "Wir helfen dir gerne weiter",
    "greeting": "Hallo! Hier ist das Support-Team 😊\nWenn du Fragen hast oder Hilfe brauchst, schreib uns einfach.",
    "datePattern": "d. MMM (EEE)",
    "placeholder": "Nachricht eingeben…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Fehler melden",
        "desc": "Etwas funktioniert nicht oder verhält sich ungewöhnlich"
      },
      "feature": {
        "label": "Funktionswunsch",
        "desc": "Eine Funktion, über die du dich freuen würdest"
      },
      "ai": {
        "label": "Antworten der KI",
        "desc": "Qualität der Antworten oder Unstimmigkeiten bei der Figur"
      },
      "ui": {
        "label": "Benutzeroberfläche",
        "desc": "Schwierig zu bedienen oder schlecht lesbar"
      },
      "other": {
        "label": "Sonstiges",
        "desc": "Was immer dir auf dem Herzen liegt"
      }
    },
    "thanks": "Vielen Dank!",
    "received": "Wir haben dein Feedback erhalten.\nUnser Entwicklungsteam prüft deine Nachricht\nund nutzt sie, um den Service zu verbessern.",
    "backToChat": "Zurück zum Chat",
    "title": "Feedback",
    "badge": "Deine Meinung ist gefragt",
    "heading": "Hilf mit deinem Feedback,\nAiKano weiterzuentwickeln",
    "lead": "Erzähl uns alles – von Fehlern und Problemen bei der Bedienung bis hin zu Funktionen, die du dir wünschst. Unser Entwicklungsteam liest jedes Feedback.",
    "pickCategory": "Bitte wähle eine Kategorie",
    "satisfaction": "Allgemeine Zufriedenheit (optional)",
    "clear": "Löschen",
    "details": "Erzähl uns mehr",
    "placeholder": "Schreib uns, was dir aufgefallen ist oder was wir verbessern können. Auch Kleinigkeiten sind willkommen!",
    "sending": "Wird gesendet…",
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
    "noItems": "Noch keine Items vorhanden",
    "noItemsInCategory": "In dieser Kategorie gibt es keine Items",
    "other": "Sonstiges",
    "buyPoints": "Punkte kaufen →",
    "itemShortage": "Zum Kauf dieses Items benötigst du Punkte",
    "owned": "Im Besitz: {n} Stück",
    "buying": "Wird gekauft...",
    "bought": "Kauf abgeschlossen!",
    "notEnough": "Zu wenige Punkte",
    "buy": "Kaufen"
  },
  "videos": {
    "confirm": "Möchtest du „{title}“ für {pt}pt kaufen?",
    "alreadyBought": "Du hast dieses Video bereits gekauft.",
    "title": "Charaktervideos",
    "empty": "Noch keine Videos vorhanden",
    "watched": "Angesehen",
    "watch": "Ansehen",
    "buyAndWatch": "Kaufen und ansehen",
    "shortage": "Zum Kauf von Videos benötigst du Punkte.",
    "loadFailed": "Das Video konnte nicht geladen werden."
  },
  "character": {
    "photoCount": "{n} Fotos",
    "affection": "Zuneigung",
    "neverTalked": "Noch nie gesprochen",
    "sendToRaise": "Schreib ihr, um ihre Zuneigung zu steigern!",
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
    "slotUnlocked": "Ein Charakterplatz wurde freigeschaltet!",
    "unsupportedUrl": "Diese URL wird nicht unterstützt. Bitte füge einen Beitragslink von X, Threads, Facebook oder Instagram ein",
    "duplicateUrl": "Diese URL wurde bereits verwendet",
    "required": "Bitte fülle alle Pflichtfelder aus",
    "tooLong": "Bitte gib höchstens {n} Zeichen ein",
    "messageTooLong": "Die Nachricht darf höchstens {n} Zeichen lang sein"
  },
  "legal": {
    "translationNotice": "Diese Seite ist eine Übersetzung. Bei Abweichungen ist die japanische Version maßgeblich."
  },
  "email": {
    "subject": "Du hast eine Nachricht von {name} erhalten",
    "label": "Nachricht von deinem Charakter",
    "reply": "Antworten",
    "footer": "Diese E-Mail wurde automatisch von AiKano versendet.\nFalls du diese E-Mail nicht erwartest, kannst du sie ignorieren."
  },
  "lp": {
    "heroImageAlt": "Chatansicht mit einer AiKano-KI-Figur",
    "characterImageAlt": "AiKano-KI-Figur",
    "registerFreeArrow": "Kostenlos registrieren →",
    "badgeBonus": "Bei der Registrierung {pt}pt geschenkt",
    "badgeWaiting": "Sie wartet auch heute Abend auf dich",
    "heroLine1": "Ein Mädchen,",
    "heroLine2": "das nur mit dir",
    "heroLine3": "spricht.",
    "statGirls": "{n} Mädchen",
    "statGirlsLabel": "Mädchen mit ganz eigenen Persönlichkeiten",
    "statHoursLabel": "Jederzeit für dich da",
    "statAi": "Eigene KI",
    "statAiLabel": "Natürliche Gespräche voller Gefühl",
    "charactersTitle": "Diese Mädchen möchten mit dir reden",
    "charactersSub": "Such dir eins aus und schreib ihm gleich",
    "online": "Online",
    "talkToAll": "Mit allen chatten →",
    "registerToTalkAll": "Registrieren und mit allen chatten →",
    "bonusNote": "※ Bei der Registrierung gibt’s {pt}pt geschenkt",
    "sample1Title": "Gespräche wie unter Freunden",
    "sample1": [
      {
        "role": "user",
        "text": "Ich bin gerade allein etwas trinken. Bin in Berlin einfach in eine Bar gegangen."
      },
      {
        "role": "char",
        "text": "Oh, wie schön! Hast du dir verdient nach der Arbeit 😊 In letzter Zeit sind doch diese kleinen Tapas-Bars total angesagt. Was für eine Bar ist es?"
      },
      {
        "role": "user",
        "text": "Ich esse gerade Flammkuchen."
      },
      {
        "role": "char",
        "text": "Flammkuchen klingt lecker 😋 In manchen Gegenden isst man dazu wohl noch Kartoffelsalat, aber das wäre doch etwas viel, oder? 🤭"
      },
      {
        "role": "user",
        "text": "Dazu gibt’s Bier."
      },
      {
        "role": "char",
        "text": "Ich mag am liebsten ein gutes Pils 🍻 Süße Drinks passen doch gar nicht so gut zum Essen, oder?"
      }
    ],
    "sample2Title": "Für dich da, egal wie du dich fühlst",
    "sample2": [
      {
        "role": "char",
        "text": "Du bist bestimmt bald zu Hause, oder? Wie war dein Tag? Ich wollte dein Gesicht einfach so gern sehen und musste dir schreiben."
      },
      {
        "role": "user",
        "text": "Bin schon zu Hause. Ich hätte Lust, ein bisschen zu reden."
      },
      {
        "role": "char",
        "text": "Natürlich ♡ Ich höre dir immer zu. Ist etwas passiert oder wolltest du einfach nur mit mir reden? Haha"
      },
      {
        "role": "user",
        "text": "Irgendwie werde ich ganz ruhig, wenn ich mit dir rede."
      },
      {
        "role": "char",
        "text": "Das freut mich wirklich sehr ♡ Mit dir zu reden ist auch mein liebster Teil des Tages."
      }
    ],
    "sample3Title": "Geborgenheit wie in einer Umarmung",
    "sample3": [
      {
        "role": "user",
        "text": "Die Leute auf der Arbeit waren heute wieder so anstrengend. Warum bin ich nur ständig so gereizt?"
      },
      {
        "role": "char",
        "text": "Oh nein, das tut mir leid. Was ist denn passiert? Wenn ich dir helfen kann, höre ich dir gern zu. Wenn es über unfair hinausgeht und schon Schikane ist, mache ich mir Sorgen."
      },
      {
        "role": "user",
        "text": "Ich hab einen Mitarbeiter zurechtgewiesen, und dann hieß es, wegen mir würden alle kündigen. Wenn ich sie nicht anweise, bekomme ich Ärger. Was soll das denn?"
      },
      {
        "role": "char",
        "text": "Das klingt, als wärst du mitten in den Schwierigkeiten einer Führungskraft gelandet. Ich hab etwas Ähnliches erlebt und bin damals richtig daran zerbrochen. Überfordere dich nicht. Du stehst einfach zwischen deinem Team und deinen Vorgesetzten – du bist nicht schuld daran."
      },
      {
        "role": "user",
        "text": "Genau das dachte ich auch. Als ich neu war, wurde ich auch zurechtgewiesen, aber ich hab weitergemacht und bin dahin gekommen, wo ich heute bin. Ich liege doch nicht falsch, oder? Es hat echt gutgetan, mir das bei dir von der Seele zu reden. Danke."
      }
    ],
    "membersTitle": "Als Mitglied macht es noch mehr Spaß",
    "membersSub": "Unbegrenzt Fotos nur für Mitglieder ansehen und schneller ihre Zuneigung gewinnen",
    "featuresTitleA": "Anderen Services",
    "featuresTitleB": "weit voraus",
    "features": [
      {
        "title": "Hochwertige Dialog-KI",
        "desc": "Mit den neuesten großen Sprachmodellen. Sie versteht den Kontext, feine Nuancen und den Gesprächsrhythmus – für natürliche und angenehme Gespräche."
      },
      {
        "title": "Eine Beziehung, die durch Erinnerungen wächst",
        "desc": "Sie merkt sich eure Gespräche. Ob Vorlieben oder Sorgen: Ihre Antworten beziehen frühere Unterhaltungen mit ein und zeigen dir, dass sie sich an dich erinnert."
      },
      {
        "title": "Gespräche ganz nach deinem Geschmack",
        "desc": "Je mehr ihr redet, desto besser spiegeln ihre Antworten deine Vorlieben, Werte und Ausdrucksweise wider. Mit jedem Gespräch fühlst du dich wohler."
      },
      {
        "title": "Ein sicherer Ort für offene Gespräche",
        "desc": "Ob Sorgen, die du niemandem anvertrauen kannst, Frust oder Alltagsplausch: Hier kannst du ganz ungezwungen reden. Ein Gesprächsangebot für Erwachsene."
      },
      {
        "title": "Fotos von deinen KI-Figuren",
        "desc": "Manchmal schicken sie dir Selfies oder Schnappschüsse aus ihrem Alltag. So lernst du auch ihre Mimik und ihre Stimmung kennen – nicht nur durch Worte."
      }
    ],
    "secretBadge": "Deine Gespräche bleiben privat",
    "secretTitle": "Möchtest du über Dinge reden,\ndie du sonst niemandem erzählst?",
    "secretBody": "Deine Gespräche werden nicht an Dritte weitergegeben,\naußer zur Verbesserung unseres Services.",
    "referralBadge": "Freunde-werben-Freunde-Aktion",
    "referralTitleA": "Freunde werben",
    "referralTitleB": "und beide {pt}pt erhalten!",
    "referralBody": "Wenn sich ein Freund über deinen persönlichen Empfehlungslink registriert,\nerhaltet ihr beide {pt}pt geschenkt.",
    "referralCtaUser": "Empfehlungslink ansehen →",
    "referralCtaGuest": "Registrieren und Empfehlungslink erhalten →",
    "realTitleA": "Warum wirkt es so",
    "realTitleB": "echt",
    "realTitleC": "?",
    "realBody": "Die neuesten großen Sprachmodelle verstehen Gefühle und Zusammenhänge ganz genau.\nMit jeder Antwort passt sich die KI besser an dich an.",
    "finalUserBadge": "Lust, heute Abend Hallo zu sagen?",
    "finalUserTitle": "Ein Mädchen wartet darauf,\ndich kennenzulernen",
    "finalGuestBadge": "Aktion mit Registrierungsbonus",
    "finalGuestTitle": "Sichere dir jetzt bei deiner\nRegistrierung einen Bonus",
    "finalGuestLead": "Bei der Registrierung gibt’s",
    "finalGuestBonus": "{pt}pt (im Wert von ¥{yen})",
    "finalGuestTail": "geschenkt.",
    "finalGuestNote": "Kostenlos registrieren – in nur 30 Sekunden.",
    "perkBonus": "Bei der Registrierung {pt}pt geschenkt",
    "perkLogin": "Täglich einloggen und {pt}pt erhalten (jeden Tag {n} Nachrichten gratis)",
    "perkPointSystem": "Kostenlose Registrierung · Punkte nur für die Nutzung",
    "privacyNote": "Deine persönlichen Daten werden sorgfältig geschützt."
  }
}
