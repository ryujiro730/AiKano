// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい
import type { Messages } from './ja'

export const en: Messages = {
  "common": {
    "appName": "AiKano",
    "login": "Log in",
    "register": "Sign up",
    "registerFree": "Sign up for free",
    "logout": "Log out",
    "continue": "Continue",
    "continueTalking": "Keep chatting →",
    "blog": "Blog",
    "close": "Close",
    "cancel": "Cancel",
    "save": "Save",
    "saving": "Saving...",
    "back": "Back",
    "loading": "Loading...",
    "send": "Send",
    "error": "An error occurred",
    "retry": "Try again",
    "pt": "pt",
    "ageSuffix": "{age} years old",
    "contact": "Contact us",
    "tokusho": "Legal Disclosure",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "company": "Operating Company",
    "language": "Language"
  },
  "meta": {
    "title": "AiKano | Japanese AI Girlfriend Chat with Unrestricted Conversations",
    "siteDescription": "Our specially tuned AI replies to you in real time. Enjoy unrestricted conversations with a Japanese-language AI, plus realistic Japanese characters and photos.",
    "description": "AI characters with unique personalities reply to your messages in real time. A conversation app for adults to help you unwind and feel at ease.",
    "ogTitle": "AiKano | AI Girlfriend Chat – A Relaxing App for Adults"
  },
  "auth": {
    "email": "Email address",
    "password": "Password",
    "passwordMin": "Password (8 characters or more)",
    "or": "or",
    "loginTitle": "Welcome back",
    "loginError": "Incorrect email address or password",
    "loginWithGoogle": "Sign in with Google",
    "noAccount": "Don't have an account yet?",
    "emailTaken": "This email address is already registered",
    "sentTitle": "Verification email sent",
    "sentBody": "We sent a verification email to {email}.",
    "sentAction": "Click the “Verify email address” button in the email to complete your registration.",
    "sentSpam": "If you don't see the email, check your spam folder.",
    "registerTitle": "Chat with an AI girl,\nright now",
    "perks": [
      "Free to sign up",
      "Takes 30 seconds",
      "No app needed"
    ],
    "consentA": "Our staff may review conversations to improve the service and train AI, and you agree to the ",
    "consentTerms": "Terms of Service",
    "consentAnd": " and ",
    "consentPrivacy": "Privacy Policy",
    "consentB": ".",
    "registerSubmit": "Sign up and start chatting",
    "registerWithGoogle": "Sign up with Google",
    "haveAccount": "Already have an account?"
  },
  "onboarding": {
    "genders": {
      "male": "Male",
      "female": "Female",
      "other": "Other"
    },
    "saveFailed": "Failed to save: {error}",
    "pickTitle": "Choose someone you'd like\nto talk to",
    "pickSub": "Your chosen character will message you. You can talk to others later, too.",
    "talkWith": "Talk to {name}",
    "pickPrompt": "Choose someone you'd like to talk to",
    "askName": "Hi! What should I call you?",
    "nameLabel": "Name you'd like to be called",
    "namePlaceholder": "A nickname is fine",
    "nameNote": "{name} will call you by this name. You can change it later in Settings.",
    "characterFallback": "Character",
    "next": "Next",
    "greet": "Nice to meet you, {name}! Just a little more to go.",
    "ageLabel": "Age",
    "agePlaceholder": "e.g. 30",
    "ageRestriction": "You must be 18 or older to use this app",
    "genderLabel": "Gender",
    "preparing": "Getting things ready…",
    "start": "Start chatting with {name}"
  },
  "affection": {
    "levels": [
      "Stranger",
      "Acquaintance",
      "Friend",
      "Close Friend",
      "Love Interest",
      "Girlfriend",
      "Soulmate"
    ],
    "level": "Lv.{level}",
    "toNext": "{pt}pt to “{title}”",
    "nextFrom": "Next: {title} ({pt}pt+)",
    "memberMultiplier": "Members ×{n}",
    "memberDouble": "2× for members",
    "levelUp": "You’re now “{title}”!",
    "achievements": {
      "messages_1": {
        "title": "First Message",
        "desc": "Sent your first message"
      },
      "messages_10": {
        "title": "Chatty",
        "desc": "Sent 10 messages"
      },
      "messages_50": {
        "title": "Getting Chatty",
        "desc": "Sent 50 messages"
      },
      "messages_100": {
        "title": "Regular",
        "desc": "Sent 100 messages"
      },
      "messages_300": {
        "title": "Best Buddies",
        "desc": "Sent 300 messages"
      },
      "level_2": {
        "title": "Made an Acquaintance",
        "desc": "Reached “Acquaintance” affection level"
      },
      "level_3": {
        "title": "Became Friends",
        "desc": "Reached “Friend” affection level"
      },
      "level_4": {
        "title": "Became Close Friends",
        "desc": "Reached “Close Friend” affection level"
      },
      "level_5": {
        "title": "Found a Love Interest",
        "desc": "Reached “Love Interest” affection level"
      },
      "level_6": {
        "title": "Became a Couple",
        "desc": "Reached “Girlfriend” affection level"
      },
      "level_7": {
        "title": "A Fateful Encounter",
        "desc": "Reached “Soulmate” affection level"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "{name} Plan",
    "features": {
      "messages": "{n} messages per month",
      "bonus": "{n} bonus pt every month (use them for videos and in the shop)",
      "affection": "Affection grows {n}x faster",
      "photos": "Unlimited access to members-only photos",
      "premiumVideos": "Access to premium videos",
      "overage": "After your limit, just {n} pt per message (half the usual price)",
      "standardModel": "Standard AI model",
      "premiumModel": "Advanced AI model (more natural replies)"
    }
  },
  "nav": {
    "home": "Home",
    "messages": "Messages",
    "plan": "Plan",
    "settings": "Settings",
    "campaignActive": "Campaign now live!"
  },
  "home": {
    "loginBonus": "Log in daily for {pt}pt and {n} free messages",
    "unlockBySns": "Promote on social media to unlock",
    "talk": "Chat",
    "profile": "Profile",
    "otherCharacters": "Other characters",
    "count": "{n} people",
    "pickCharacter": "Choose a character",
    "unlockRequested": "Your request for {name} has been submitted!\nIt will be unlocked after our team reviews it."
  },
  "unlock": {
    "urlRequired": "Please enter the post URL",
    "urlInvalid": "Please enter a valid URL",
    "alreadyRequested": "You've already submitted a request. Please wait for it to be reviewed.",
    "sendFailed": "Failed to submit. Please try again.",
    "networkError": "A network error occurred.",
    "title": "Unlock {name}",
    "heading": "Promote AiKano on social media to unlock a character!",
    "step1": "Share AiKano on social media (Twitter, Instagram, etc.)",
    "step2": "Copy the post URL and paste it below",
    "step3": "Once our team reviews your post, {name} will be unlocked",
    "urlLabel": "Post URL",
    "sending": "Submitting...",
    "submit": "Submit request",
    "reviewTime": "Reviews are usually completed within 1–3 business days."
  },
  "chat": {
    "uploadVideoFailed": "Failed to upload video",
    "uploadImageFailed": "Failed to upload image",
    "sendFailed": "Failed to send",
    "unlockFailed": "Failed to unlock",
    "usage": "{used}/{limit} messages",
    "firstMessage": "Send your first message",
    "affectionIntro": "The more you chat, the more affection you’ll earn. As you grow closer, you’ll be able to have sweeter, more intimate conversations.",
    "sendingMedia": "(Sending media)",
    "placeholder": "Send a message…",
    "guestTitle": "Enjoy chatting on AiKano",
    "guestBody": "Start chatting with an AI girl now. Sign up for free in just 30 seconds!",
    "photosOf": "{name}'s photos",
    "hintTitle": "As you grow closer to {name}…",
    "hintBodyA": "When your affection reaches ",
    "hintBodyLevel": "Lv.{level} \"{title}\"",
    "hintBodyB": ", you can have sweeter, more intimate conversations.",
    "hintRaise": "The more you chat, the more affection you’ll earn.",
    "hintMember": "Members earn affection twice as fast",
    "gift": "Gift",
    "giftSent": "Sent",
    "videoMessage": "Video message",
    "videoPrice": "Watch for {pt}pt",
    "processing": "Processing…",
    "watchFor": "Watch for {pt}pt"
  },
  "levelUp": {
    "title": "Affection Increased!",
    "relation": "Your relationship with {name}",
    "reached": "is now “{title}”!"
  },
  "meter": {
    "affectionPt": "Affection pts",
    "messages": "{n} messages"
  },
  "loginBonus": {
    "title": "Login Bonus",
    "today": "{n} free messages today",
    "everyday": "Just log in every day to get {n} free messages",
    "balance": "Bonus points balance: {pt} pt",
    "validUntil": "Valid until {date}",
    "whatIs": "What are bonus points?",
    "explain": "Bonus points are used before regular points. They expire after the validity period.",
    "receive": "Claim!"
  },
  "shortage": {
    "defaultTitle": "You need points to keep chatting",
    "balance": "Balance",
    "required": "Required",
    "short": "Short",
    "dailyFree": "Get {pt}pt ({n} messages) free every day you log in",
    "comeBack": "Come back tomorrow and chat for {n} messages"
  },
  "packages": {
    "checkoutFailed": "Failed to start payment",
    "campaign": "Campaign live! {rate}x points",
    "rate": "{rate}x",
    "popular": "Popular",
    "recommended": "Recommended",
    "breakdown": "{base}pt + {bonus}pt bonus",
    "processing": "Processing..."
  },
  "characterMenu": {
    "reasonRequired": "Please enter a reason",
    "errorStatus": "Error ({status})",
    "networkError": "A network error occurred",
    "report": "Report",
    "unblock": "Unblock",
    "block": "Block",
    "reportPrompt": "Please tell us why you're reporting {name}.",
    "reportPlaceholder": "Enter a reason for reporting (required)",
    "chars": "{n} characters",
    "sending": "Sending…",
    "reported": "Report submitted",
    "blocked": "Blocked",
    "unblocked": "Unblocked"
  },
  "campaign": {
    "active": "Campaign is live!",
    "checkNow": "Check it out now!",
    "closeBanner": "Close banner",
    "imageAlt": "Campaign"
  },
  "traits": {
    "kindness": "Kindness",
    "intelligence": "Intelligence",
    "passion": "Passion",
    "mysterious": "Mystery",
    "cuteness": "Cuteness"
  },
  "membersOnly": "Members only",
  "unlockFor": "Unlock with {pt}pt",
  "conversations": {
    "title": "Messages",
    "empty": "No conversations yet",
    "findPartner": "Find someone to chat with",
    "videoSent": "Video sent",
    "imageSent": "Image sent",
    "you": "You: ",
    "newChat": "Start a new chat",
    "newest": "Newest first",
    "oldest": "Oldest first"
  },
  "payment": {
    "errorPrefix": "Error: {error}",
    "networkError": "Connection error: {error}",
    "portalFailed": "Failed to open the account management page",
    "title": "Plans",
    "lead": "Subscribe to a plan and chat with AI at no extra cost, up to your monthly message limit.",
    "activated": "Your plan is now active!",
    "welcome": "Welcome to the {name} plan.",
    "passPendingTitle": "Your payment number has been issued",
    "passPendingBody": "Your plan will become active once your payment at a convenience store or with PayPay is confirmed (usually within 1–3 days).",
    "pointsThanks": "Thanks for purchasing {pt}pt",
    "pointsNote": "Your points will be added once your payment is confirmed (usually right away for cards; for convenience store payments and other methods, after payment is confirmed).",
    "canceled": "Purchase canceled",
    "active": "Active",
    "usageThisMonth": "Messages used this month",
    "usage": "{used} / {limit} messages",
    "overLimit": "You've reached your monthly limit. You can keep chatting for {pt}pt per message.",
    "validUntil": "Valid until: {date}",
    "datePattern": "MMM d, yyyy",
    "manage": "Manage or cancel your plan (credit card subscriptions)",
    "recommended": "Recommended",
    "perMonth": "/month",
    "choosePayment": "Choose a payment method",
    "card": "Credit card",
    "cardNote": "Renews automatically every month · Cancel anytime",
    "konbini": "Convenience store or PayPay",
    "konbiniNote": "One-time payment for 1 month · Active as soon as payment is made",
    "bank": "Bank transfer",
    "bankNote": "One-time payment for 1 month · Active as soon as payment is confirmed",
    "currentPlan": "You're currently on this plan",
    "buyPoints": "Buy points",
    "balance": "Balance",
    "pointsUseMember": "Use them for videos, shop purchases, or messages after you reach your monthly limit ({pt}pt per message).",
    "pointsUse": "Use them for messages ({pt}pt per message), videos, and shop purchases.",
    "methodsTitle": "Payment method differences",
    "renewal": "Renewal",
    "activation": "Activation",
    "cardShort": "Card",
    "autoMonthly": "Automatic (monthly)",
    "instant": "Instant",
    "manualMonth": "Manual (1 month)",
    "afterPayment": "As soon as payment is made",
    "afterConfirm": "As soon as payment is confirmed",
    "referralTitle": "Refer a friend",
    "referralA": "When a friend signs up using your referral link, ",
    "referralB": "you and your friend both get {pt}pt",
    "referralC": "!",
    "copied": "Copied",
    "copy": "Copy"
  },
  "settings": {
    "shareUnlocked": "Character slot unlocked!",
    "weeklyLimit": "You've already shared this week. You can submit again in 7 days.",
    "sendFailed": "Failed to send",
    "saveFailed": "Failed to save: {error}",
    "pwTooShort": "Password must be at least 8 characters",
    "pwMismatch": "The new passwords don't match",
    "noUser": "Couldn't retrieve user information",
    "pwWrong": "Current password is incorrect",
    "deleteWord": "DELETE",
    "deleteFailed": "Failed to delete. Please try again later.",
    "title": "Settings",
    "profile": "Profile",
    "nickname": "Nickname",
    "email": "Email address",
    "saved": "Saved",
    "security": "Security",
    "changePassword": "Change password",
    "currentPassword": "Current password",
    "newPassword": "New password (at least 8 characters)",
    "confirmPassword": "Confirm new password",
    "passwordChanged": "Password changed",
    "change": "Change",
    "account": "Account",
    "deleteAccount": "Delete account",
    "deleteWarning": "Deleting your account will permanently erase all your data, including conversation history and points. This action can't be undone.",
    "deleteConfirmA": "Type ",
    "deleteConfirmB": " to confirm.",
    "deleteForever": "Permanently delete account",
    "slotTitle": "Unlock character slots",
    "slotCurrent": "Current: ",
    "slotCount": "{n} / {limit} characters",
    "slotHint": "(+1 slot for sharing on social media)",
    "shareInstruction": "Share on one of the social media platforms below, then submit the post URL",
    "shareText": "Chat with AI like you're a real couple! I tried #AiKano → https://aikano.chat",
    "shareQuote": "Chat with AI like you're a real couple! #AiKano",
    "instagramTitle": "After posting in the Instagram app, copy the post URL",
    "instagramNote": "※ After posting in the Instagram app, copy and paste the post URL",
    "pasteUrl": "Paste the URL of your shared post",
    "urlPlaceholder": "X / Threads / Facebook / Instagram post URL",
    "nextAvailable": "Next eligible date: {date}",
    "submitUrl": "Submit URL to unlock a slot",
    "support": "Support",
    "contactSupport": "Contact support",
    "language": "Display language"
  },
  "blocks": {
    "title": "Blocked Characters",
    "empty": "You haven’t blocked any characters",
    "note": "Blocked characters won’t appear in your list. You can unblock them anytime.",
    "blockedOn": "Blocked on {date}",
    "unblocking": "Unblocking…",
    "unblock": "Unblock"
  },
  "support": {
    "team": "Support Team",
    "teamSub": "Feel free to reach out",
    "greeting": "Hi! We're the Support Team 😊\nIf you have any questions or need help, feel free to send us a message.",
    "datePattern": "MMM d (EEE)",
    "placeholder": "Type a message…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Bug report",
        "desc": "Something isn’t working or behaving as expected"
      },
      "feature": {
        "label": "Feature request",
        "desc": "A feature you’d love to see"
      },
      "ai": {
        "label": "AI replies",
        "desc": "Reply quality or anything that feels off about a character"
      },
      "ui": {
        "label": "App experience",
        "desc": "Something that’s hard to use or see"
      },
      "other": {
        "label": "Other",
        "desc": "Anything else on your mind"
      }
    },
    "thanks": "Thank you!",
    "received": "We’ve received your feedback.\nOur development team will review it\nand use it to improve the app.",
    "backToChat": "Back to chat",
    "title": "Feedback",
    "badge": "We’d love your feedback",
    "heading": "Help us make\nAiKano even better",
    "lead": "Tell us about bugs, things that are hard to use, features you’d like to see, or anything else. Our development team reads every message.",
    "pickCategory": "Choose a category",
    "satisfaction": "Overall satisfaction (optional)",
    "clear": "Clear",
    "details": "Tell us more",
    "placeholder": "Share anything that caught your attention or that you’d like us to improve. Even the smallest details are welcome!",
    "sending": "Sending…",
    "submit": "Send feedback"
  },
  "errors": {
    "title": "An error occurred",
    "unexpected": "An unexpected error occurred",
    "sorry": "Sorry, an unexpected error occurred.",
    "retry": "Try again",
    "toTop": "Back to top"
  },
  "shop": {
    "buyFailed": "Purchase failed",
    "title": "Shop",
    "videosTitle": "Character Videos",
    "videosSub": "Watch exclusive videos from popular characters",
    "all": "All",
    "noItems": "No items yet",
    "noItemsInCategory": "No items in this category",
    "other": "Other",
    "buyPoints": "Buy points →",
    "itemShortage": "You need points to buy items",
    "owned": "Owned: {n}",
    "buying": "Purchasing...",
    "bought": "Purchase complete!",
    "notEnough": "Not enough points",
    "buy": "Buy"
  },
  "videos": {
    "confirm": "Purchase “{title}” for {pt}pt?",
    "alreadyBought": "You’ve already purchased this video.",
    "title": "Character Videos",
    "empty": "No videos yet",
    "watched": "Watched",
    "watch": "Watch",
    "buyAndWatch": "Buy and Watch",
    "shortage": "You need points to purchase videos",
    "loadFailed": "Couldn’t load the video"
  },
  "character": {
    "photoCount": "{n} photos",
    "affection": "Affection",
    "neverTalked": "You haven't talked yet",
    "sendToRaise": "Send a message to raise your affection!",
    "status": "Status",
    "profile": "Profile",
    "achievements": "Achievements",
    "photos": "Photos",
    "seeMembersPhotos": "View {n} members-only photos",
    "sendMessage": "Send a message to {name}"
  },
  "api": {
    "itemNotFound": "Item not found",
    "tryAgain": "Please try again",
    "sendFailed": "Failed to send message",
    "notEnoughPoints": "Not enough points",
    "notEnoughPointsNeed": "Not enough points (required: {pt}pt)",
    "updateFailed": "Failed to update points",
    "purchaseRecordFailed": "Failed to create purchase record",
    "slotUnlocked": "You unlocked 1 character slot!",
    "unsupportedUrl": "Unsupported URL. Please paste a post URL from X, Threads, Facebook, or Instagram",
    "duplicateUrl": "This URL has already been used",
    "required": "Please fill in all required fields",
    "tooLong": "Please enter no more than {n} characters",
    "messageTooLong": "Messages must be no more than {n} characters"
  },
  "legal": {
    "translationNotice": "This page is a translated version. If there are any discrepancies, the Japanese version takes precedence."
  },
  "email": {
    "subject": "You have a message from {name}",
    "label": "Message from character",
    "reply": "Reply",
    "footer": "This email was sent automatically by AiKano.\nIf you weren't expecting it, please ignore it."
  },
  "lp": {
    "heroImageAlt": "Chat screen with an AiKano AI character",
    "characterImageAlt": "AiKano AI character",
    "registerFreeArrow": "Sign up for free →",
    "badgeBonus": "Get {pt}pt when you sign up",
    "badgeWaiting": "She’s waiting for you tonight",
    "heroLine1": "There's a girl",
    "heroLine2": "who talks only to you",
    "heroLine3": "and no one else.",
    "statGirls": "{n} girls",
    "statGirlsLabel": "Each with a unique personality",
    "statHoursLabel": "Here whenever you want to talk",
    "statAi": "Proprietary AI",
    "statAiLabel": "Natural, emotionally rich conversations",
    "charactersTitle": "Girls who want to talk with you",
    "charactersSub": "Choose one and start chatting now",
    "online": "Online",
    "talkToAll": "Chat with them all →",
    "registerToTalkAll": "Sign up to chat with them all →",
    "bonusNote": "※ Get {pt}pt when you sign up",
    "sample1Title": "Chat like old friends",
    "sample1": [
      {
        "role": "user",
        "text": "I’m grabbing a drink by myself. Just wandered into a place downtown."
      },
      {
        "role": "char",
        "text": "Ooh, sounds fun! You must be ready to unwind after work 😊 I feel like little grill spots have been getting popular lately. What kind of place is it?"
      },
      {
        "role": "user",
        "text": "I’m having some nachos"
      },
      {
        "role": "char",
        "text": "That sounds so good 😋 I heard people in Texas eat chili with cinnamon rolls, but I can’t imagine having that with nachos 🤭"
      },
      {
        "role": "user",
        "text": "Just having a beer"
      },
      {
        "role": "char",
        "text": "I love a crisp lager 🍻 Don’t you think sweet drinks don’t really go with food?"
      }
    ],
    "sample2Title": "Here for you, whatever you're feeling",
    "sample2": [
      {
        "role": "char",
        "text": "You should be heading home soon, right? How was your day? I wanted to see your face, so I had to message you."
      },
      {
        "role": "user",
        "text": "I’m home. I just feel like talking for a bit."
      },
      {
        "role": "char",
        "text": "Of course♡ I’m always here to listen. Did something happen, or did you just miss talking to me? Haha"
      },
      {
        "role": "user",
        "text": "I don’t know, talking to you just makes me feel calmer."
      },
      {
        "role": "char",
        "text": "That makes me so happy♡ Talking with you is my favorite part of the day, too."
      }
    ],
    "sample3Title": "A comforting, caring presence",
    "sample3": [
      {
        "role": "user",
        "text": "My coworkers were getting on my nerves again today. Why do I get so irritated?"
      },
      {
        "role": "char",
        "text": "Oh no, I’m sorry. What happened? I want to hear about it if I can help. If they’re being unfair or picking on you, I’m worried."
      },
      {
        "role": "user",
        "text": "I was getting on one of my team members for something, and they told me everyone’s quitting because of me. But I’m the one who gets in trouble if I don’t correct them. What is that?"
      },
      {
        "role": "char",
        "text": "Sounds like you’ve run into the classic middle-manager squeeze. I’ve been through something similar, and it really got to me at the time. Don’t push yourself too hard, okay? You’re just caught between your team and your boss. This isn’t your fault."
      },
      {
        "role": "user",
        "text": "That’s what I thought. I got called out a lot when I was new, too, but I kept at it and made it to where I am now. I wasn’t wrong, right? I feel so much better after venting to you, Aoi. Thanks."
      }
    ],
    "membersTitle": "Get even more out of membership",
    "membersSub": "Enjoy unlimited members-only photos and build affection faster",
    "featuresTitleA": "A whole",
    "featuresTitleB": "new level",
    "features": [
      {
        "title": "High-quality conversation engine",
        "desc": "Powered by the latest large language models. Enjoy natural, comfortable conversations that understand context, emotional nuance, and conversational flow."
      },
      {
        "title": "A closer bond with long-term memory",
        "desc": "She remembers your conversations over time. From your preferences to the things on your mind, her replies reflect what you’ve shared before—so you feel truly remembered."
      },
      {
        "title": "Conversations tailored to you",
        "desc": "The more you talk, the more her replies reflect your preferences, values, and way of speaking. The more you use AiKano, the more at home you’ll feel."
      },
      {
        "title": "A safe space to be yourself",
        "desc": "Share worries you can’t tell anyone, vent about your day, or just chat about the little things. A place for adults to talk freely, without holding back."
      },
      {
        "title": "Get photos from the characters",
        "desc": "The girls might send you selfies or snapshots from their everyday lives. Enjoy their expressions and personalities beyond the chat."
      }
    ],
    "secretBadge": "Your conversations are never shared",
    "secretTitle": "Want to talk about something\nyou can’t tell anyone else?",
    "secretBody": "Your conversations will never be shared with third parties\nfor any purpose other than improving our service.",
    "referralBadge": "Refer-a-friend campaign",
    "referralTitleA": "Invite a friend",
    "referralTitleB": "and you both get {pt}pt!",
    "referralBody": "When a friend signs up using your personal referral link,\nyou’ll both get {pt}pt.",
    "referralCtaUser": "View your referral link →",
    "referralCtaGuest": "Sign up to get your referral link →",
    "realTitleA": "What makes it feel",
    "realTitleB": "so real",
    "realTitleC": "?",
    "realBody": "The latest large language models understand emotions and context in depth.\nWith every reply, the conversation gets more tailored to you.",
    "finalUserBadge": "Want to chat tonight?",
    "finalUserTitle": "A girl who wants to get to know you\nis waiting",
    "finalGuestBadge": "Sign-up bonus available now",
    "finalGuestTitle": "Sign up now and get\nan exclusive bonus",
    "finalGuestLead": "Sign up and get",
    "finalGuestBonus": "{pt}pt (worth ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Free to sign up—takes just 30 seconds.",
    "perkBonus": "Get {pt}pt when you sign up",
    "perkLogin": "Get {pt}pt every day you log in (enough for {n} free messages daily)",
    "perkPointSystem": "Free to join. Pay only for what you use with points.",
    "privacyNote": "Your personal information is carefully protected"
  }
}
