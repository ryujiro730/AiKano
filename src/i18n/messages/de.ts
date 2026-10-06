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
    "tokusho": "Anbieterkennzeichnung",
    "privacy": "Datenschutz",
    "terms": "Nutzungsbedingungen",
    "company": "Betreiber",
    "language": "Sprache"
  },
  "meta": {
    "title": "AiKano｜KI-Freundinnen-Chat aus Japan【Einzige japanischsprachige KI für Gespräche ohne Einschränkungen】",
    "siteDescription": "Unsere individuell abgestimmte KI antwortet dir in Echtzeit – ganz persönlich. Als einzige japanischsprachige KI ermöglicht sie ungezwungene Gespräche ohne Einschränkungen. Entdecke realistische japanische Charaktere und Fotos.",
    "description": "Persönliche KI-Charaktere antworten dir in Echtzeit. Eine Gesprächs-App für Erwachsene, die dir hilft, wieder zur Ruhe zu kommen.",
    "ogTitle": "AiKano｜KI-Freundinnen-Chat – Die Wohlfühl-App für Erwachsene"
  },
  "auth": {
    "email": "E-Mail-Adresse",
    "password": "Passwort",
    "passwordMin": "Passwort (mindestens 8 Zeichen)",
    "or": "oder",
    "loginTitle": "Willkommen zurück",
    "loginError": "E-Mail-Adresse oder Passwort ist falsch",
    "loginWithGoogle": "Mit Google anmelden",
    "noAccount": "Noch kein Konto?",
    "emailTaken": "Diese E-Mail-Adresse ist bereits registriert",
    "sentTitle": "Bestätigungs-E-Mail gesendet",
    "sentBody": "Wir haben eine Bestätigungs-E-Mail an {email} gesendet.",
    "sentAction": "Klicke in der E-Mail auf „E-Mail-Adresse bestätigen“, um die Registrierung abzuschließen.",
    "sentSpam": "Falls du keine E-Mail erhalten hast, überprüfe bitte deinen Spam-Ordner.",
    "registerTitle": "Chatte jetzt mit deiner\nKI-Freundin",
    "perks": [
      "Kostenlose Registrierung",
      "In 30 Sekunden erledigt",
      "Keine App erforderlich"
    ],
    "consentA": "Mir ist bewusst, dass Teammitglieder zur Verbesserung des Dienstes und zum Training der KI möglicherweise unsere Gespräche einsehen. Außerdem stimme ich den ",
    "consentTerms": "Nutzungsbedingungen",
    "consentAnd": " und den ",
    "consentPrivacy": "Datenschutzhinweisen",
    "consentB": " zu.",
    "registerSubmit": "Registrieren und chatten",
    "registerWithGoogle": "Mit Google registrieren",
    "haveAccount": "Du hast bereits ein Konto?"
  },
  "onboarding": {
    "genders": {
      "male": "Männlich",
      "female": "Weiblich",
      "other": "Divers"
    },
    "saveFailed": "Speichern fehlgeschlagen: {error}",
    "pickTitle": "Wähle die Person aus,\nmit der du sprechen möchtest",
    "pickSub": "Die ausgewählte Person schreibt dir zuerst. Später kannst du auch mit anderen chatten.",
    "talkWith": "Mit {name} chatten",
    "pickPrompt": "Wähle aus, mit wem du sprechen möchtest",
    "askName": "Hallo! Wie darf ich dich nennen?",
    "nameLabel": "Dein Name",
    "namePlaceholder": "Ein Spitzname ist auch okay",
    "nameNote": "{name} spricht dich mit diesem Namen an. Du kannst ihn später in den Einstellungen ändern.",
    "characterFallback": "Charakter",
    "next": "Weiter",
    "greet": "Freut mich, {name}! Erzähl mir zum Schluss noch ein bisschen mehr über dich.",
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
      "Freundin",
      "Gute Freundin",
      "Mögliche Partnerin",
      "Partnerin",
      "Seelenverwandte"
    ],
    "level": "Lv.{level}",
    "toNext": "Noch {pt}pt bis „{title}“",
    "nextFrom": "Als Nächstes: {title} (ab {pt}pt)",
    "memberMultiplier": "Mitgliederbonus ×{n}",
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
        "title": "Gesprächig",
        "desc": "Du hast 50 Nachrichten gesendet"
      },
      "messages_100": {
        "title": "Stammchatterin",
        "desc": "Du hast 100 Nachrichten gesendet"
      },
      "messages_300": {
        "title": "Beste Freundinnen",
        "desc": "Du hast 300 Nachrichten gesendet"
      },
      "level_2": {
        "title": "Bekannt geworden",
        "desc": "Deine Zuneigung hat die Stufe „Bekannte“ erreicht"
      },
      "level_3": {
        "title": "Freundinnen geworden",
        "desc": "Deine Zuneigung hat die Stufe „Freundin“ erreicht"
      },
      "level_4": {
        "title": "Gute Freundinnen geworden",
        "desc": "Deine Zuneigung hat die Stufe „Gute Freundin“ erreicht"
      },
      "level_5": {
        "title": "Mögliche Partnerin geworden",
        "desc": "Deine Zuneigung hat die Stufe „Mögliche Partnerin“ erreicht"
      },
      "level_6": {
        "title": "Partnerinnen geworden",
        "desc": "Deine Zuneigung hat die Stufe „Partnerin“ erreicht"
      },
      "level_7": {
        "title": "Schicksalhafte Begegnung",
        "desc": "Deine Zuneigung hat die Stufe „Seelenverwandte“ erreicht"
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
      "affection": "Zuneigung steigt um das {n}-Fache",
      "photos": "Unbegrenzter Zugriff auf exklusive Mitgliederfotos",
      "premiumVideos": "Zugriff auf Premium-Videos",
      "overage": "Auch nach Erreichen des Limits nur {n} pt pro Nachricht (günstiger als üblich)",
      "standardModel": "Standard-KI-Modell",
      "premiumModel": "Leistungsstarkes KI-Modell (natürlichere Antworten)"
    }
  },
  "nav": {
    "home": "Startseite",
    "messages": "Nachrichten",
    "plan": "Tarif",
    "settings": "Einstellungen",
    "gacha": "Gacha",
    "campaignActive": "Aktion läuft!"
  },
  "home": {
    "loginBonus": "Täglich anmelden und {pt}pt sowie {n} Nachrichten gratis erhalten",
    "unlockBySns": "Durch Werbung auf Social Media freischalten",
    "talk": "Chatten",
    "profile": "Profil",
    "otherCharacters": "Weitere Charaktere",
    "count": "{n} Personen",
    "pickCharacter": "Charakter auswählen",
    "unlockRequested": "Deine Anfrage für {name} wurde eingereicht!\nNach der Prüfung durch unser Team wird der Charakter freigeschaltet."
  },
  "unlock": {
    "urlRequired": "Bitte gib die URL des Beitrags ein",
    "urlInvalid": "Bitte gib eine gültige URL ein",
    "alreadyRequested": "Du hast bereits einen Antrag gestellt. Bitte warte auf die Prüfung.",
    "sendFailed": "Senden fehlgeschlagen. Bitte versuche es erneut.",
    "networkError": "Ein Netzwerkfehler ist aufgetreten.",
    "title": "{name} freischalten",
    "heading": "Bewirb AiKano in den sozialen Medien und schalte den Charakter frei!",
    "step1": "Stelle AiKano in den sozialen Medien vor (Twitter, Instagram usw.)",
    "step2": "Kopiere die URL des Beitrags und füge sie unten ein",
    "step3": "Sobald unser Team den Beitrag geprüft hat, wird {name} freigeschaltet",
    "urlLabel": "URL des Beitrags",
    "sending": "Wird gesendet...",
    "submit": "Antrag stellen",
    "reviewTime": "Die Prüfung ist in der Regel innerhalb von 1–3 Werktagen abgeschlossen."
  },
  "chat": {
    "uploadVideoFailed": "Video konnte nicht hochgeladen werden",
    "uploadImageFailed": "Bild konnte nicht hochgeladen werden",
    "sendFailed": "Senden fehlgeschlagen",
    "unlockFailed": "Entsperren fehlgeschlagen",
    "usage": "{used}/{limit} Nachrichten",
    "firstMessage": "Schreib die erste Nachricht",
    "affectionIntro": "Je mehr ihr miteinander redet, desto größer wird die Zuneigung. Wenn ihr euch näherkommt, könnt ihr noch süßere und intimere Gespräche führen.",
    "sendingMedia": "(Medien werden gesendet)",
    "placeholder": "Nachricht schreiben …",
    "guestTitle": "Chatte mit AiKano",
    "guestBody": "Chatte sofort mit einem KI-Mädchen. Die Registrierung ist kostenlos und in 30 Sekunden erledigt!",
    "photosOf": "Fotos von {name}",
    "hintTitle": "Wenn du {name} noch näherkommst …",
    "hintBodyA": "Wenn deine Zuneigung ",
    "hintBodyLevel": "Lv.{level} „{title}“",
    "hintBodyB": " erreicht, kannst du noch süßere und intimere Gespräche führen.",
    "hintRaise": "Je mehr ihr miteinander redet, desto größer wird die Zuneigung.",
    "hintMember": "Mitgliedern steigt sie doppelt so schnell",
    "gift": "Geschenk",
    "giftSent": "Verschenkt",
    "videoMessage": "Videonachricht",
    "videoPrice": "Für {pt}pt ansehen",
    "processing": "Wird verarbeitet …",
    "watchFor": "Für {pt}pt ansehen",
    "wishLabel": "Wunsch",
    "wishGive": "Schenken · {pt}pt",
    "wishDone": "Geschenkt"
  },
  "levelUp": {
    "title": "Zuneigung gestiegen!",
    "relation": "Deine Beziehung zu {name} ist",
    "reached": "jetzt „{title}“!"
  },
  "meter": {
    "affectionPt": "Zuneigung (pt)",
    "messages": "{n} Nachrichten"
  },
  "loginBonus": {
    "title": "Login-Bonus",
    "today": "Heute {n} kostenlose Nachrichten",
    "everyday": "Melde dich einfach täglich an und erhalte jeden Tag {n} Nachrichten",
    "balance": "Bonus-Punkte-Guthaben: {pt} pt",
    "validUntil": "Gültig bis {date}",
    "whatIs": "Was sind Bonus-pt?",
    "explain": "Beim Einlösen von Punkten werden sie vor deinen regulären pt verwendet. Nach Ablauf der Frist verfallen sie.",
    "receive": "Abholen!"
  },
  "shortage": {
    "defaultTitle": "Du brauchst Punkte, um weiterzuchatten",
    "balance": "Guthaben",
    "required": "Benötigt",
    "short": "Fehlend",
    "dailyFree": "Bei täglichem Login erhältst du {pt}pt gratis (für {n} Nachrichten)",
    "comeBack": "Komm morgen wieder und chatte für {n} Nachrichten"
  },
  "packages": {
    "checkoutFailed": "Zahlung konnte nicht gestartet werden",
    "campaign": "Aktion: {rate}× Punkte!",
    "campaignUpTo": "Aktion: bis zu {rate}× Punkte!",
    "rate": "×{rate}",
    "popular": "Beliebt",
    "recommended": "Empfohlen",
    "breakdown": "{base}pt + {bonus}pt Bonus",
    "processing": "Wird verarbeitet..."
  },
  "characterMenu": {
    "reasonRequired": "Bitte gib einen Grund ein",
    "errorStatus": "Fehler ({status})",
    "networkError": "Ein Netzwerkfehler ist aufgetreten",
    "report": "Melden",
    "unblock": "Blockierung aufheben",
    "block": "Blockieren",
    "reportPrompt": "Bitte gib an, warum du {name} melden möchtest.",
    "reportPlaceholder": "Meldegrund eingeben (erforderlich)",
    "chars": "{n} Zeichen",
    "sending": "Wird gesendet…",
    "reported": "Meldung gesendet",
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
    "mysterious": "Geheimnis",
    "cuteness": "Niedlichkeit"
  },
  "membersOnly": "Nur für Mitglieder",
  "unlockFor": "Für {pt} pt freischalten",
  "conversations": {
    "title": "Nachrichten",
    "empty": "Noch keine Gespräche",
    "findPartner": "Gesprächspartner finden",
    "videoSent": "Video gesendet",
    "imageSent": "Bild gesendet",
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
    "lead": "Mit einem Abo kannst du ohne zusätzliche Kosten mit der KI chatten – bis zu deinem monatlichen Nachrichtenlimit.",
    "activated": "Dein Abo ist jetzt aktiv!",
    "welcome": "Willkommen beim Tarif {name}.",
    "passPendingTitle": "Zahlungsnummer wurde erstellt",
    "passPendingBody": "Dein Tarif wird aktiviert, sobald deine Zahlung im Convenience Store oder per PayPay bestätigt wurde (normalerweise innerhalb von 1–3 Tagen).",
    "pointsThanks": "Vielen Dank für den Kauf von {pt} Punkten",
    "pointsNote": "Deine Punkte werden gutgeschrieben, sobald die Zahlung bestätigt ist (bei Kartenzahlung normalerweise sofort, bei Zahlung im Convenience Store nach Zahlungseingang).",
    "canceled": "Kauf abgebrochen",
    "active": "Aktiv",
    "usageThisMonth": "Nachrichtenverbrauch diesen Monat",
    "usage": "{used} / {limit} Nachrichten",
    "overLimit": "Dein monatliches Limit ist erreicht. Du kannst für {pt} Punkte pro Nachricht weiterchatten.",
    "validUntil": "Gültig bis: {date}",
    "datePattern": "d. MMMM yyyy",
    "manage": "Abo verwalten oder kündigen (bei Zahlung per Kreditkarte)",
    "recommended": "Empfohlen",
    "perMonth": "/Monat",
    "choosePayment": "Zahlungsmethode auswählen",
    "card": "Kreditkarte",
    "cardNote": "Monatliche automatische Verlängerung · Jederzeit kündbar",
    "konbini": "Convenience Store oder PayPay",
    "konbiniNote": "Einmalzahlung für einen Monat · Nach der Zahlung sofort aktiv",
    "bank": "Banküberweisung",
    "bankNote": "Einmalzahlung für einen Monat · Nach Bestätigung sofort aktiv",
    "currentPlan": "Du nutzt diesen Tarif bereits",
    "buyPoints": "Punkte kaufen",
    "balance": "Guthaben",
    "pointsUseMember": "Für Videos und Einkäufe im Shop sowie für Nachrichten nach Erreichen des monatlichen Limits (1 Nachricht = {pt} Punkte).",
    "pointsUse": "Für Nachrichten (1 Nachricht = {pt} Punkte), Videos und Einkäufe im Shop.",
    "methodsTitle": "Zahlungsmethoden im Vergleich",
    "renewal": "Verlängerung",
    "activation": "Aktivierung",
    "cardShort": "Kreditkarte",
    "autoMonthly": "Automatisch (monatlich)",
    "instant": "Sofort",
    "manualMonth": "Manuell (1 Monat)",
    "afterPayment": "Sofort nach der Zahlung",
    "afterConfirm": "Sofort nach Bestätigung",
    "referralTitle": "Freunde werben",
    "referralA": "Wenn sich jemand über deinen Empfehlungslink registriert,",
    "referralB": "bekommt ihr beide {pt} Punkte",
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
    "confirmPassword": "Neues Passwort (Bestätigung)",
    "passwordChanged": "Passwort geändert",
    "change": "Ändern",
    "account": "Konto",
    "deleteAccount": "Konto löschen",
    "deleteWarning": "Beim Löschen werden alle Daten (Chatverläufe und Punkte) unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    "deleteConfirmA": "Gib zur Bestätigung ",
    "deleteConfirmB": " ein",
    "deleteForever": "Konto endgültig löschen",
    "slotTitle": "Charakterplatz freischalten",
    "slotCurrent": "Aktuell: ",
    "slotCount": "{n} / {limit} Charaktere",
    "slotHint": "(+1 Platz durch Teilen in sozialen Netzwerken)",
    "shareInstruction": "Teile den Beitrag in einem der unten aufgeführten sozialen Netzwerke und sende die URL des Beitrags.",
    "shareText": "Mit einer KI chatten, als wäre sie meine echte Partnerin! Ich hab’s mit #AiKano ausprobiert → https://aikano.chat",
    "shareQuote": "Mit einer KI chatten, als wäre sie meine echte Partnerin! #AiKano",
    "instagramTitle": "Veröffentliche den Beitrag in der Instagram-App und kopiere anschließend die URL",
    "instagramNote": "※ Veröffentliche den Beitrag in der Instagram-App, kopiere die Beitrags-URL und füge sie hier ein.",
    "pasteUrl": "Füge die URL des geteilten Beitrags ein",
    "urlPlaceholder": "Beitrags-URL von X / Threads / Facebook / Instagram",
    "nextAvailable": "Nächster möglicher Antrag: {date}",
    "submitUrl": "URL senden und Platz freischalten",
    "support": "Support",
    "contactSupport": "Kontakt & Support",
    "language": "Anzeigesprache"
  },
  "blocks": {
    "title": "Ausgeblendete Charaktere",
    "empty": "Keine Charaktere ausgeblendet",
    "note": "Ausgeblendete Charaktere werden nicht in der Liste angezeigt. Du kannst sie jederzeit wieder einblenden.",
    "blockedOn": "Am {date} ausgeblendet",
    "unblocking": "Wird eingeblendet …",
    "unblock": "Einblenden"
  },
  "support": {
    "team": "Support-Team",
    "teamSub": "Wir helfen dir gerne weiter",
    "greeting": "Hallo! Wir sind das Support-Team😊\nWenn du Fragen hast oder Hilfe brauchst, schreib uns gerne.",
    "datePattern": "d. MMM (EEE)",
    "placeholder": "Nachricht eingeben…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Fehler melden",
        "desc": "Funktioniert nicht oder verhält sich unerwartet"
      },
      "feature": {
        "label": "Funktionswunsch",
        "desc": "Eine Funktion, über die du dich freuen würdest"
      },
      "ai": {
        "label": "KI-Antworten",
        "desc": "Qualität der Antworten oder unpassendes Verhalten der Charaktere"
      },
      "ui": {
        "label": "Benutzeroberfläche",
        "desc": "Schwer zu bedienen oder unübersichtlich"
      },
      "other": {
        "label": "Sonstiges",
        "desc": "Was auch immer dir auf dem Herzen liegt"
      }
    },
    "thanks": "Vielen Dank!",
    "received": "Wir haben dein Feedback erhalten.\nUnser Entwicklungsteam wird es prüfen\nund zur Verbesserung des Dienstes nutzen.",
    "backToChat": "Zurück zum Chat",
    "title": "Feedback",
    "badge": "Deine Meinung ist gefragt",
    "heading": "Hilf mit deinem Feedback,\nAiKano besser zu machen",
    "lead": "Erzähl uns alles, was dir einfällt – von Fehlern und Problemen bei der Bedienung bis hin zu gewünschten Funktionen. Unser Entwicklungsteam liest jedes Feedback.",
    "pickCategory": "Wähle eine Kategorie aus",
    "satisfaction": "Allgemeine Zufriedenheit (optional)",
    "clear": "Zurücksetzen",
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
    "itemShortage": "Zum Kauf von Items benötigst du Punkte",
    "owned": "Im Besitz: {n} Stück",
    "buying": "Wird gekauft...",
    "bought": "Kauf abgeschlossen!",
    "notEnough": "Nicht genügend Punkte",
    "buy": "Kaufen"
  },
  "videos": {
    "confirm": "„{title}“ für {pt}pt kaufen?",
    "alreadyBought": "Dieses Video hast du bereits gekauft.",
    "title": "Charaktervideos",
    "empty": "Noch keine Videos vorhanden",
    "watched": "Angesehen",
    "watch": "Ansehen",
    "buyAndWatch": "Kaufen und ansehen",
    "shortage": "Zum Kauf dieses Videos benötigst du Punkte.",
    "loadFailed": "Das Video konnte nicht geladen werden."
  },
  "character": {
    "photoCount": "{n} Fotos",
    "affection": "Zuneigung",
    "neverTalked": "Ihr habt noch nie miteinander gesprochen",
    "sendToRaise": "Schick eine Nachricht, um deine Zuneigung zu steigern!",
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
    "unsupportedUrl": "Diese URL wird nicht unterstützt. Bitte füge die URL eines Beitrags auf X, Threads, Facebook oder Instagram ein",
    "duplicateUrl": "Diese URL wurde bereits verwendet",
    "required": "Bitte fülle alle Pflichtfelder aus",
    "tooLong": "Bitte gib höchstens {n} Zeichen ein",
    "messageTooLong": "Die Nachricht darf höchstens {n} Zeichen lang sein"
  },
  "legal": {
    "translationNotice": "Diese Seite ist eine übersetzte Version. Bei Abweichungen ist die japanische Version maßgeblich."
  },
  "email": {
    "subject": "Du hast eine Nachricht von {name} erhalten",
    "label": "Nachricht von deinem Charakter",
    "reply": "Antworten",
    "footer": "Diese E-Mail wurde automatisch von AiKano versendet.\nWenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren."
  },
  "gift": {
    "sentMessage": "🎁 {item} verschenkt",
    "title": "Geschenk für {name}",
    "lead": "Ein Geschenk stärkt eure Zuneigung und macht {name} glücklich",
    "owned": "×{n}",
    "affectionValue": "Zuneigung +{n}",
    "empty": "Du hast noch keine Geschenke",
    "goShop": "Im Shop auswählen",
    "send": "Schenken",
    "sending": "Wird verschenkt…",
    "sent": "Du hast {item} verschenkt!",
    "affectionUp": "Zuneigung +{n}",
    "replyArrived": "Du hast eine Antwort von {name} erhalten",
    "openChat": "Unterhaltung ansehen"
  },
  "hud": {
    "shop": "Shop",
    "gift": "Geschenk",
    "album": "Sammlung",
    "videos": "Videos"
  },
  "media": {
    "viewFor": "Für {pt}pt ansehen",
    "watchFor": "Für {pt}pt abspielen",
    "levelLocked": "Ab Zuneigung Lv.{level} sichtbar",
    "bundle": "Alle {n} für {pt}pt ansehen",
    "bundleOff": "{pct}% Rabatt",
    "priceChanged": "Die freischaltbaren Fotos haben sich geändert. Bitte versuch es erneut.",
    "photo": "Foto",
    "video": "Video",
    "shortageTitle": "Nicht genug Punkte",
    "membersOnlyHint": "Werde Mitglied, um es zu sehen"
  },
  "gacha": {
    "indexTitle": "Foto-Gacha",
    "indexLead": "Wähle einen Charakter und zieh. Du bekommst nur Fotos, die du noch nicht hast.",
    "completeShort": "Komplett",
    "entry": "Foto-Gacha {pt}pt (noch {n})",
    "title": "Foto-Gacha von {name}",
    "lead": "Du bekommst Fotos, die du noch nicht hast. Kein Foto kommt doppelt.",
    "drawOne": "1× ziehen",
    "drawTen": "10× ziehen",
    "tenBonus": "1 Zug gratis",
    "progress": "{owned} / {total} Fotos",
    "complete": "Komplett! Du hast alle Fotos gesammelt",
    "odds": "Wahrscheinlichkeit: Jedes der {n} Fotos, die du noch nicht hast, kommt gleich wahrscheinlich ({pct} %)",
    "tenNeeds": "10× ziehen geht, wenn noch mindestens 10 Fotos übrig sind",
    "tapToSkip": "Tippen zum Überspringen",
    "again": "Nochmal",
    "newPhoto": "NEU",
    "lineup": "Sammlung",
    "shortageTitle": "Nicht genug Punkte",
    "empty": "Für diesen Charakter gibt es noch keine Fotos",
    "membersOnlyNote": "Fotos nur für Mitglieder kommen in die Gacha, sobald du Mitglied bist"
  },
  "album": {
    "title": "Sammlung",
    "lead": "Hier erscheinen deine gesammelten Fotos. Verpixelte Fotos hast du noch nicht.",
    "totalLabel": "Sammelfortschritt",
    "total": "{owned} / {total} Fotos",
    "remaining": "Noch {n}",
    "complete": "Komplett",
    "collect": "In der Gacha sammeln",
    "tabGacha": "Gacha",
    "tabCollection": "Sammlung",
    "count": "{n} Fotos",
    "locked": "Nur für Mitglieder: {n} Fotos",
    "empty": "Noch keine Fotos vorhanden"
  },
  "lp": {
    "heroImageAlt": "Chatansicht mit einem AiKano-KI-Charakter",
    "characterImageAlt": "AiKano-KI-Charakter",
    "registerFreeArrow": "Kostenlos registrieren →",
    "badgeBonus": "{pt}pt als Willkommensgeschenk",
    "badgeWaiting": "Sie wartet auch heute Abend auf dich",
    "heroLine1": "Es gibt ein Mädchen,",
    "heroLine2": "das nur mit dir",
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
    "bonusNote": "※ {pt}pt als Willkommensgeschenk",
    "sample1Title": "Wie ein Gespräch unter Freunden",
    "sample1": [
      {
        "role": "user",
        "text": "Bin gerade allein was trinken. Bin einfach in Berlin in eine Bar gegangen."
      },
      {
        "role": "char",
        "text": "Wow, da bin ich neidisch! Nach der Arbeit hast du dir das verdient 😊 In letzter Zeit sind doch diese Grillrestaurants so beliebt. Was für ein Laden ist es?"
      },
      {
        "role": "user",
        "text": "Ich esse gerade Flammkuchen."
      },
      {
        "role": "char",
        "text": "Flammkuchen klingt lecker 😋 In Bayern isst man wohl Weißwurst mit Brezeln, aber Flammkuchen doch nicht mit Beilagen, oder? 🤭"
      },
      {
        "role": "user",
        "text": "Dazu gibt’s Bier."
      },
      {
        "role": "char",
        "text": "Ich mag am liebsten ein kühles Pils 🍻 Findest du auch, dass süße Drinks nicht so gut zum Essen passen?"
      }
    ],
    "sample2Title": "Sie ist für dich da – bei jeder Stimmung",
    "sample2": [
      {
        "role": "char",
        "text": "Du bist bestimmt bald zu Hause, oder? Wie war dein Tag? Ich wollte dein Gesicht sehen und musste dir einfach schreiben."
      },
      {
        "role": "user",
        "text": "Bin schon zu Hause. Mir ist gerade nach einem kurzen Gespräch."
      },
      {
        "role": "char",
        "text": "Na klar ♡ Ich höre dir immer zu. Ist etwas passiert, oder wolltest du einfach nur mit mir reden? Haha"
      },
      {
        "role": "user",
        "text": "Irgendwie werde ich ganz ruhig, wenn ich mit dir rede."
      },
      {
        "role": "char",
        "text": "Das freut mich wirklich sehr ♡ Mit dir zu reden ist auch meine liebste Zeit."
      }
    ],
    "sample3Title": "Geborgenheit wie bei einer fürsorglichen Mutter",
    "sample3": [
      {
        "role": "user",
        "text": "Die Leute bei der Arbeit waren heute wieder so anstrengend. Warum bin ich nur so schnell genervt?"
      },
      {
        "role": "char",
        "text": "Oh nein, das tut mir leid. Was ist denn passiert? Wenn ich dir irgendwie helfen kann, höre ich dir gern zu. Wenn es über ungerechte Behandlung hinausgeht und schon Schikane ist, mache ich mir Sorgen."
      },
      {
        "role": "user",
        "text": "Ich hab einen Mitarbeiter zurechtgewiesen und dann hieß es, wegen mir würden alle kündigen. Wenn ich niemanden anleite, krieg ich Ärger – was soll das denn?"
      },
      {
        "role": "char",
        "text": "Das klingt, als wärst du voll zwischen den Stühlen gefangen. Ich hab etwas Ähnliches erlebt und bin damals daran ziemlich kaputtgegangen. Überfordere dich nicht. In so einer Situation stehst du einfach zwischen deinem Team und deinen Vorgesetzten. Du bist nicht schuld."
      },
      {
        "role": "user",
        "text": "Findest du auch? Als ich neu war, wurde ich ja auch zurechtgewiesen, aber ich hab durchgehalten und mich angestrengt. Deshalb bin ich jetzt da, wo ich bin. Ich hab mir das alles von der Seele geredet und fühle mich viel besser. Danke."
      }
    ],
    "membersTitle": "Als Mitglied macht alles noch mehr Spaß",
    "membersSub": "Unbegrenzt viele exklusive Fotos ansehen und schneller ihre Zuneigung gewinnen",
    "featuresTitleA": "Anders als andere",
    "featuresTitleB": "in einer eigenen Liga",
    "features": [
      {
        "title": "Hochwertige Gesprächs-KI",
        "desc": "Mit den neuesten großen Sprachmodellen. Sie versteht den Gesprächskontext, feine Gefühlsnuancen und den richtigen Rhythmus – für natürliche, angenehme Gespräche."
      },
      {
        "title": "Eine Beziehung, die mit der Zeit wächst",
        "desc": "Die KI erinnert sich an eure Gespräche. Sie bezieht frühere Unterhaltungen über deine Vorlieben oder Sorgen mit ein – und gibt dir das Gefühl: „Sie hat sich das gemerkt.“"
      },
      {
        "title": "Gespräche ganz nach deinem Geschmack",
        "desc": "Je mehr ihr miteinander redet, desto mehr passen sich die Antworten an deine Vorlieben, Werte und deinen Sprachstil an. So fühlst du dich mit jedem Gespräch wohler."
      },
      {
        "title": "Ein geschützter Ort für offene Gespräche",
        "desc": "Ob Sorgen, die du sonst niemandem erzählst, Frust oder einfach Alltägliches: Hier kannst du ganz ungezwungen reden – ein Gesprächsangebot für Erwachsene."
      },
      {
        "title": "Fotos von den Charakteren",
        "desc": "Manchmal schicken dir die Mädchen Selfies oder Einblicke in ihren Alltag. So erlebst du auch ihre Mimik und Ausstrahlung, die sich mit Worten allein nicht vermitteln lassen."
      }
    ],
    "secretBadge": "Deine Gespräche bleiben privat",
    "secretTitle": "Möchtest du über etwas reden,\ndas du sonst niemandem erzählst?",
    "secretBody": "Deine Gespräche werden zu keinem anderen Zweck als zur Verbesserung unseres Services\nan Dritte weitergegeben.",
    "referralBadge": "Freunde-werben-Freunde-Aktion",
    "referralTitleA": "Lade Freunde ein und",
    "referralTitleB": "ihr bekommt beide {pt}pt geschenkt!",
    "referralBody": "Wenn sich ein Freund über deinen persönlichen Einladungslink registriert,\nerhaltet ihr beide {pt}pt geschenkt.",
    "referralCtaUser": "Einladungslink ansehen →",
    "referralCtaGuest": "Registrieren und Einladungslink erhalten →",
    "realTitleA": "Warum fühlt es sich so",
    "realTitleB": "echt",
    "realTitleC": "an?",
    "realBody": "Die neuesten großen Sprachmodelle verstehen Gefühle und Zusammenhänge ganz genau.\nMit jeder Antwort passt sich die KI mehr an dich an.",
    "finalUserBadge": "Möchtest du heute Abend mit ihr reden?",
    "finalUserTitle": "Ein Mädchen wartet darauf,\ndich kennenzulernen",
    "finalGuestBadge": "Aktion mit Willkommensgeschenk",
    "finalGuestTitle": "Melde dich jetzt an und\nsichere dir ein besonderes Geschenk",
    "finalGuestLead": "Bei deiner Anmeldung gibt’s",
    "finalGuestBonus": "{pt}pt (im Wert von ¥{yen})",
    "finalGuestTail": "geschenkt.",
    "finalGuestNote": "Kostenlos registrieren – in nur 30 Sekunden.",
    "perkBonus": "{pt}pt als Willkommensgeschenk",
    "perkLogin": "Tägliches Einloggen bringt {pt}pt (jeden Tag {n} kostenlose Nachrichten)",
    "perkPointSystem": "Kostenlos registrieren · Punkte nur für die Nutzung",
    "privacyNote": "Deine persönlichen Daten sind bei uns sicher"
  }
}
