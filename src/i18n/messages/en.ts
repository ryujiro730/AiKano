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
    "continueTalking": "Continue chatting →",
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
    "privacy": "Privacy",
    "terms": "Terms of Use",
    "company": "Operating Company",
    "language": "Language"
  },
  "meta": {
    "title": "AiKano | Japanese AI Girlfriend Chat — The Only Japanese AI for Unrestricted Conversations",
    "siteDescription": "Our specially tuned AI replies to you in real time. The only Japanese-language AI that lets you chat freely without restrictions. Enjoy realistic Japanese characters and photos, too.",
    "description": "Unique AI characters reply to your messages in real time. A chat app for adults to relax and unwind.",
    "ogTitle": "AiKano | AI Girlfriend Chat — A Relaxing App for Adults"
  },
  "auth": {
    "email": "Email address",
    "password": "Password",
    "passwordMin": "Password (8+ characters)",
    "or": "or",
    "loginTitle": "Welcome back",
    "loginError": "Incorrect email address or password",
    "loginWithGoogle": "Sign in with Google",
    "noAccount": "Don't have an account yet?",
    "emailTaken": "This email address is already registered",
    "sentTitle": "Confirmation email sent",
    "sentBody": "We sent a confirmation email to {email}.",
    "sentAction": "Click the “Verify email address” button in the email to complete your registration.",
    "sentSpam": "If you don't see the email, check your spam folder.",
    "registerTitle": "Start chatting with AI girls\nnow",
    "perks": [
      "Free to join",
      "Takes 30 seconds",
      "No app needed"
    ],
    "consentA": "Our staff may review conversations to improve the service and train AI. By continuing, you agree to the ",
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
    "pickTitle": "Choose someone you'd\nlike to talk to",
    "pickSub": "The character you choose will message you. You can talk to others later, too.",
    "talkWith": "Talk with {name}",
    "pickPrompt": "Choose someone you'd like to talk to",
    "askName": "Nice to meet you! What should I call you?",
    "nameLabel": "Name you'd like to go by",
    "namePlaceholder": "A nickname is fine",
    "nameNote": "{name} will call you by this name. You can change it later in Settings.",
    "characterFallback": "Character",
    "next": "Next",
    "greet": "Nice to meet you, {name}! Just a little more to go.",
    "ageLabel": "Age",
    "agePlaceholder": "e.g. 30",
    "ageRestriction": "You must be 18 or older to use this app.",
    "genderLabel": "Gender",
    "preparing": "Getting things ready…",
    "start": "Start talking with {name}"
  },
  "affection": {
    "levels": [
      "Stranger",
      "Acquaintance",
      "Friend",
      "Close Friend",
      "Love Interest",
      "Partner",
      "Soulmate"
    ],
    "level": "Lv.{level}",
    "toNext": "{pt}pt to reach “{title}”",
    "nextFrom": "Next: {title} ({pt}pt+)",
    "memberMultiplier": "Members ×{n}",
    "memberDouble": "Members earn 2×",
    "levelUp": "You reached “{title}”!",
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
        "title": "Deep in Conversation",
        "desc": "Sent 50 messages"
      },
      "messages_100": {
        "title": "Regular Chatter",
        "desc": "Sent 100 messages"
      },
      "messages_300": {
        "title": "Best Buddies",
        "desc": "Sent 300 messages"
      },
      "level_2": {
        "title": "Acquaintances",
        "desc": "Reached “Acquaintance” affection level"
      },
      "level_3": {
        "title": "Friends",
        "desc": "Reached “Friend” affection level"
      },
      "level_4": {
        "title": "Close Friends",
        "desc": "Reached “Close Friend” affection level"
      },
      "level_5": {
        "title": "Love Interest",
        "desc": "Reached “Love Interest” affection level"
      },
      "level_6": {
        "title": "A Couple",
        "desc": "Reached “Partner” affection level"
      },
      "level_7": {
        "title": "A Fateful Meeting",
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
      "affection": "Affection increases {n}x faster",
      "photos": "Unlimited access to members-only photos",
      "premiumVideos": "Access to premium videos",
      "overage": "After reaching your limit, messages cost just {n} pt each (less than the regular price)",
      "standardModel": "Standard AI model",
      "premiumModel": "Advanced AI model (more natural responses)"
    }
  },
  "nav": {
    "home": "Home",
    "messages": "Messages",
    "plan": "Plan",
    "settings": "Settings",
    "gacha": "Gacha",
    "campaignActive": "Campaign now on!"
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
    "heading": "Promote us on social media to unlock this character!",
    "step1": "Post about AiKano on social media (Twitter, Instagram, etc.)",
    "step2": "Copy the post URL and paste it below",
    "step3": "Once our team reviews it, {name} will be unlocked",
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
    "affectionIntro": "The more you chat, the more your affection grows. As you get closer, you can have sweeter, more intimate conversations.",
    "sendingMedia": "(Sending media)",
    "placeholder": "Send a message…",
    "guestTitle": "Enjoy chatting on AiKano",
    "guestBody": "Chat with AI girls now. Sign up for free in just 30 seconds!",
    "photosOf": "Photos of {name}",
    "hintTitle": "As you get closer to {name}...",
    "hintBodyA": "When your affection reaches",
    "hintBodyLevel": "Lv.{level} “{title}”",
    "hintBodyB": ", you can have sweeter, more intimate conversations.",
    "hintRaise": "The more you chat, the more your affection grows",
    "hintMember": "Members earn affection twice as fast",
    "gift": "Gift",
    "giftSent": "Sent",
    "videoMessage": "Video message",
    "videoPrice": "Watch for {pt}pt",
    "processing": "Processing…",
    "watchFor": "Watch for {pt}pt",
    "wishLabel": "Wish list",
    "wishGive": "Give · {pt}pt",
    "wishDone": "Given"
  },
  "levelUp": {
    "title": "Affection increased!",
    "relation": "Your relationship with {name}",
    "reached": "is now \"{title}\"!"
  },
  "meter": {
    "affectionPt": "Affection pt",
    "messages": "{n} messages"
  },
  "loginBonus": {
    "title": "Login Bonus",
    "today": "{n} free messages today",
    "everyday": "Get {n} messages every day just by logging in!",
    "balance": "Bonus point balance: {pt} pt",
    "validUntil": "Valid until {date}",
    "whatIs": "What are bonus pts?",
    "explain": "They’re used before regular pts when you spend points. They expire after the validity period.",
    "receive": "Claim!"
  },
  "shortage": {
    "defaultTitle": "You need points to keep chatting",
    "balance": "Balance",
    "required": "Required",
    "short": "Insufficient",
    "dailyFree": "Get {pt}pt free ({n} messages) when you log in every day",
    "comeBack": "Come back tomorrow and chat for {n} messages"
  },
  "packages": {
    "checkoutFailed": "Failed to start payment",
    "campaign": "Campaign on! {rate}x points",
    "campaignUpTo": "Campaign on! Up to {rate}x points",
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
    "active": "Campaign now live!",
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
  "unlockFor": "Unlock for {pt} pt",
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
    "networkError": "Network error: {error}",
    "portalFailed": "Couldn't access the management page",
    "title": "Plans",
    "lead": "Subscribe to a plan and chat with AI at no extra cost, up to your monthly message limit.",
    "activated": "Your plan is now active!",
    "welcome": "Welcome to the {name} plan.",
    "passPendingTitle": "Your payment code is ready",
    "passPendingBody": "Your plan will become active once your convenience store or PayPay payment is confirmed (usually within 1–3 days).",
    "pointsThanks": "Thanks for purchasing {pt}pt",
    "pointsNote": "Your points will be added once your payment is confirmed (usually right away for cards, and after payment confirmation for convenience store payments and other methods).",
    "canceled": "Purchase canceled",
    "active": "Active",
    "usageThisMonth": "Messages used this month",
    "usage": "{used} / {limit} messages",
    "overLimit": "You've reached your monthly limit. Keep chatting for {pt}pt per message.",
    "validUntil": "Valid until: {date}",
    "datePattern": "MMM d, yyyy",
    "manage": "Manage or cancel your plan (for credit card subscriptions)",
    "recommended": "Recommended",
    "perMonth": "/month",
    "choosePayment": "Choose a payment method",
    "card": "Credit card",
    "cardNote": "Automatically renews monthly · Cancel anytime",
    "konbini": "Convenience store or PayPay",
    "konbiniNote": "One-time payment for 1 month · Active as soon as payment is made",
    "bank": "Bank transfer",
    "bankNote": "One-time payment for 1 month · Active as soon as payment is confirmed",
    "currentPlan": "You're currently on this plan",
    "buyPoints": "Buy points",
    "balance": "Balance",
    "pointsUseMember": "Use points for video and shop purchases, or for messages after you reach your monthly limit ({pt}pt per message).",
    "pointsUse": "Use points for messages ({pt}pt per message), videos, and shop purchases.",
    "methodsTitle": "Payment method differences",
    "renewal": "Renewal",
    "activation": "Activation",
    "cardShort": "Credit card",
    "autoMonthly": "Automatic (monthly)",
    "instant": "Instant",
    "manualMonth": "Manual (1 month)",
    "afterPayment": "As soon as payment is made",
    "afterConfirm": "As soon as payment is confirmed",
    "referralTitle": "Refer a friend",
    "referralA": "When a friend signs up using your referral link, ",
    "referralB": "you and your friend each get {pt} points",
    "referralC": "!",
    "copied": "Copied",
    "copy": "Copy"
  },
  "settings": {
    "shareUnlocked": "Character slot unlocked!",
    "weeklyLimit": "You've already shared this week. You can submit another request in 7 days.",
    "sendFailed": "Failed to send",
    "saveFailed": "Failed to save: {error}",
    "pwTooShort": "Password must be at least 8 characters",
    "pwMismatch": "The new passwords don't match",
    "noUser": "Unable to retrieve user information",
    "pwWrong": "The current password is incorrect",
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
    "deleteWarning": "Deleting your account will permanently erase all your data (including chat history and points). This action can't be undone.",
    "deleteConfirmA": "Type ",
    "deleteConfirmB": " to confirm",
    "deleteForever": "Permanently delete account",
    "slotTitle": "Unlock character slots",
    "slotCurrent": "Current: ",
    "slotCount": "{n} / {limit} characters",
    "slotHint": "(+1 slot for sharing on social media)",
    "shareInstruction": "Share on one of the social media platforms below, then submit the post URL",
    "shareText": "Chat with an AI like you're a real couple! I tried #AiKano → https://aikano.chat",
    "shareQuote": "Chat with an AI like you're a real couple! #AiKano",
    "instagramTitle": "After posting from the Instagram app, copy the post URL",
    "instagramNote": "※ After posting from the Instagram app, copy and paste the post URL",
    "pasteUrl": "Paste the URL of your shared post",
    "urlPlaceholder": "Post URL from X / Threads / Facebook / Instagram",
    "nextAvailable": "Next available request date: {date}",
    "submitUrl": "Submit URL to unlock a slot",
    "support": "Support",
    "contactSupport": "Contact & support",
    "language": "Display language"
  },
  "blocks": {
    "title": "Blocked List",
    "empty": "You haven't blocked any characters",
    "note": "Blocked characters won't appear in your list. You can unblock them anytime.",
    "blockedOn": "Blocked on {date}",
    "unblocking": "Unblocking…",
    "unblock": "Unblock"
  },
  "support": {
    "team": "Support Team",
    "teamSub": "Feel free to reach out",
    "greeting": "Hello! We're the support team 😊\nIf you have any questions or need help, feel free to send us a message.",
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
        "desc": "Reply quality or character behavior"
      },
      "ui": {
        "label": "App experience",
        "desc": "Something is hard to use or see"
      },
      "other": {
        "label": "Other",
        "desc": "Anything else"
      }
    },
    "thanks": "Thank you!",
    "received": "We’ve received your feedback.\nOur development team will review it\nand use it to improve the service.",
    "backToChat": "Back to chat",
    "title": "Feedback",
    "badge": "We’d love to hear from you",
    "heading": "Help shape\nAiKano with your feedback",
    "lead": "Tell us about bugs, anything that’s hard to use, features you’d like to see, or anything else. Our development team reads every message.",
    "pickCategory": "Choose a category",
    "satisfaction": "Overall satisfaction (optional)",
    "clear": "Clear",
    "details": "Tell us more",
    "placeholder": "Tell us what stood out or what you’d like us to improve. We’d love to hear even the smallest things!",
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
    "videosSub": "Watch exclusive videos featuring popular characters",
    "all": "All",
    "noItems": "No items yet",
    "noItemsInCategory": "No items in this category",
    "other": "Other",
    "buyPoints": "Buy points →",
    "itemShortage": "You need points to purchase items",
    "owned": "Owned: {n}",
    "buying": "Purchasing...",
    "bought": "Purchase complete!",
    "notEnough": "Not enough points",
    "buy": "Purchase"
  },
  "videos": {
    "confirm": "Buy “{title}” for {pt}pt?",
    "alreadyBought": "You’ve already purchased this video.",
    "title": "Character Videos",
    "empty": "No videos yet",
    "watched": "Watched",
    "watch": "Watch",
    "buyAndWatch": "Buy and Watch",
    "shortage": "You need points to buy this video",
    "loadFailed": "Couldn’t load the video"
  },
  "character": {
    "photoCount": "{n} photos",
    "affection": "Affection",
    "neverTalked": "You haven't talked yet",
    "sendToRaise": "Send a message to increase affection!",
    "status": "Status",
    "profile": "Profile",
    "achievements": "Achievements",
    "photos": "Photos",
    "seeMembersPhotos": "View {n} members-only photos",
    "sendMessage": "Send {name} a message"
  },
  "api": {
    "itemNotFound": "Item not found",
    "tryAgain": "Please try again",
    "sendFailed": "Failed to send message",
    "notEnoughPoints": "Not enough points",
    "notEnoughPointsNeed": "Not enough points (required: {pt}pt)",
    "updateFailed": "Failed to update points",
    "purchaseRecordFailed": "Failed to create purchase record",
    "slotUnlocked": "1 character slot unlocked!",
    "unsupportedUrl": "Unsupported URL. Please paste a post URL from X, Threads, Facebook, or Instagram",
    "duplicateUrl": "This URL has already been used",
    "required": "This field is required",
    "tooLong": "Please enter no more than {n} characters",
    "messageTooLong": "Messages must be {n} characters or fewer"
  },
  "legal": {
    "translationNotice": "This page is a translated version. If there are any discrepancies, the Japanese version takes precedence."
  },
  "email": {
    "subject": "You have a message from {name}",
    "label": "Message from your character",
    "reply": "Reply",
    "footer": "This email was sent automatically by AiKano.\nIf you don't recognize this, please ignore it."
  },
  "gift": {
    "sentMessage": "🎁 You gave {item} as a gift",
    "title": "A gift for {name}",
    "lead": "Giving a gift raises affection and makes {name} happy",
    "owned": "×{n}",
    "affectionValue": "Affection +{n}",
    "empty": "You don't have any gifts yet",
    "goShop": "Choose one in the shop",
    "send": "Give",
    "sending": "Giving…",
    "sent": "You gave {item} as a gift!",
    "affectionUp": "Affection +{n}",
    "replyArrived": "You got a reply from {name}",
    "openChat": "View conversation"
  },
  "hud": {
    "shop": "Shop",
    "gift": "Gift",
    "album": "Collection",
    "videos": "Videos"
  },
  "media": {
    "viewFor": "View for {pt}pt",
    "watchFor": "Play for {pt}pt",
    "levelLocked": "Unlocks at affection Lv.{level}",
    "bundle": "See all {n} for {pt}pt",
    "bundleOff": "{pct}% off",
    "priceChanged": "The photos available to unlock have changed. Please try again.",
    "photo": "Photo",
    "video": "Video",
    "shortageTitle": "Not enough points",
    "membersOnlyHint": "Become a member to see this"
  },
  "gacha": {
    "indexTitle": "Photo gacha",
    "indexLead": "Pick a character and draw. You only get photos you don't have yet.",
    "completeShort": "Complete",
    "entry": "Photo gacha {pt}pt ({n} left)",
    "title": "{name}'s photo gacha",
    "lead": "You get photos you don't have yet. The same photo never comes twice.",
    "drawOne": "Draw 1",
    "drawTen": "Draw 10",
    "tenBonus": "1 draw free",
    "progress": "{owned} / {total} photos",
    "complete": "Complete! You've collected every photo",
    "odds": "Odds: each of the {n} photos you don't have yet has the same chance ({pct}%)",
    "tenNeeds": "10-draw is available when 10 or more photos are left",
    "tapToSkip": "Tap to skip",
    "again": "Draw again",
    "newPhoto": "NEW",
    "lineup": "Lineup",
    "shortageTitle": "Not enough points",
    "empty": "No photos for this character yet",
    "membersOnlyNote": "Members-only photos join the gacha when you become a member"
  },
  "album": {
    "title": "Collection",
    "lead": "Your collected photos appear here. Mosaic photos are ones you don't have yet.",
    "totalLabel": "Collection progress",
    "total": "{owned} / {total} photos",
    "remaining": "{n} left",
    "complete": "Complete",
    "collect": "Collect with gacha",
    "tabGacha": "Gacha",
    "tabCollection": "Collection",
    "count": "{n} photos",
    "locked": "Members only · {n} photos",
    "empty": "No photos yet"
  },
  "lp": {
    "heroImageAlt": "Chat screen with an AiKano AI character",
    "characterImageAlt": "AiKano AI character",
    "registerFreeArrow": "Sign up for free →",
    "badgeBonus": "Get {pt}pt when you sign up",
    "badgeWaiting": "Waiting for you again tonight",
    "heroLine1": "A girl",
    "heroLine2": "who talks only to you",
    "heroLine3": "is waiting.",
    "statGirls": "{n} girls",
    "statGirlsLabel": "Each with her own personality",
    "statHoursLabel": "Available anytime",
    "statAi": "Unique AI",
    "statAiLabel": "Natural conversations full of emotion",
    "charactersTitle": "Girls who want to talk with you",
    "charactersSub": "Choose one and start chatting now",
    "online": "Online",
    "talkToAll": "Try chatting with them all →",
    "registerToTalkAll": "Sign up to chat with them all →",
    "bonusNote": "* Sign up and get {pt}pt",
    "sample1Title": "Chat like old friends",
    "sample1": [
      {
        "role": "user",
        "text": "I'm out for a drink by myself. Just ducked into a place in Shinjuku."
      },
      {
        "role": "char",
        "text": "Ooh, I'm jealous! Hope work wasn't too tiring 😊 Robata grill spots have been popular lately. What kind of place is it?"
      },
      {
        "role": "user",
        "text": "I'm having monjayaki."
      },
      {
        "role": "char",
        "text": "Monjayaki sounds so good 😋 I hear people in Osaka eat okonomiyaki with rice, but surely nobody does that with monjayaki 🤭"
      },
      {
        "role": "user",
        "text": "I'm having beer."
      },
      {
        "role": "char",
        "text": "I love Kirin Classic Lager 🍻 Don't you think sweet drinks don't really go with food?"
      }
    ],
    "sample2Title": "Here for you, whatever you're feeling",
    "sample2": [
      {
        "role": "char",
        "text": "It's about time you got home, right? How was your day? I wanted to see your face, so I couldn't help messaging you."
      },
      {
        "role": "user",
        "text": "I'm home now. I feel like talking for a little."
      },
      {
        "role": "char",
        "text": "Of course♡ I'm always here to listen. Did something happen, or did you just feel like talking? Haha"
      },
      {
        "role": "user",
        "text": "I feel calmer whenever I talk to you."
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
        "text": "The people at work were getting on my nerves again today. Why am I so irritable?"
      },
      {
        "role": "char",
        "text": "Oh no, that's awful. What happened? If there's anything I can do, I want to hear about it. If it's gone beyond unfairness into harassment, I'd be worried."
      },
      {
        "role": "user",
        "text": "When I was reprimanding my team, someone told me, “Everyone's quitting because of you.” But if I don't give them guidance, I'm the one who gets in trouble. What is this?"
      },
      {
        "role": "char",
        "text": "Sounds like you're running into the classic middle-manager squeeze. I've been through something similar, and it really got me down. Don't push yourself too hard, either. You're just caught between your team and your boss—you haven't done anything wrong."
      },
      {
        "role": "user",
        "text": "That's what I thought, right? I got scolded when I was new too, but I kept at it, and that's how I got where I am. I wasn't wrong, was I? I feel so much better after venting to you, Aoi. Thanks."
      }
    ],
    "membersTitle": "Get even more out of membership",
    "membersSub": "Enjoy unlimited access to members-only photos and build affection faster",
    "featuresTitleA": "Unlike other services, it's",
    "featuresTitleB": "on another level",
    "features": [
      {
        "title": "High-quality conversation engine",
        "desc": "Powered by the latest large language models. Enjoy natural, comfortable conversations that understand context, emotional nuances, and the flow of your chat."
      },
      {
        "title": "A closer bond through long-term memory",
        "desc": "Your conversations build on each other. From your preferences to personal worries, she remembers what you've shared and responds with it in mind."
      },
      {
        "title": "Conversations tailored to you",
        "desc": "As you chat, her replies reflect your preferences, values, and way of speaking. The more you use it, the more at home you'll feel."
      },
      {
        "title": "A private space to speak your mind",
        "desc": "From worries and frustrations you can't share with anyone to everyday small talk. A place for adults to talk freely and without hesitation."
      },
      {
        "title": "Photos sent by the characters",
        "desc": "The girls may send selfies and snapshots from their everyday lives. Enjoy their expressions and the little details that text alone can't convey."
      }
    ],
    "secretBadge": "Your conversations are never shared outside the service",
    "secretTitle": "Want to talk about\nwhat you can't tell anyone else?",
    "secretBody": "Your conversations won't be shared with third parties\nfor any purpose other than improving our service.",
    "referralBadge": "Refer-a-friend campaign",
    "referralTitleA": "Invite a friend and",
    "referralTitleB": "you both get {pt}pt!",
    "referralBody": "When a friend signs up using your personal referral link,\nyou and your friend will both receive {pt}pt.",
    "referralCtaUser": "View your referral link →",
    "referralCtaGuest": "Sign up to get your referral link →",
    "realTitleA": "Why does it feel so",
    "realTitleB": "real",
    "realTitleC": "?",
    "realBody": "The latest large language models deeply understand emotions and context.\nWith every reply, the conversation adapts to you.",
    "finalUserBadge": "Want to start a conversation tonight?",
    "finalUserTitle": "A girl who wants to know you\nis waiting",
    "finalGuestBadge": "Sign-up bonus campaign now on",
    "finalGuestTitle": "Sign up now to get\nan exclusive bonus",
    "finalGuestLead": "Sign up and get",
    "finalGuestBonus": "{pt}pt (worth ¥{yen})",
    "finalGuestTail": ".",
    "finalGuestNote": "Free to sign up—it takes just 30 seconds.",
    "perkBonus": "Get {pt}pt when you sign up",
    "perkLogin": "Get {pt}pt every day you log in ({n} free messages daily)",
    "perkPointSystem": "Free to sign up. Pay only for the points you use.",
    "privacyNote": "Your personal information is kept strictly confidential."
  }
}
