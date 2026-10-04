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
    "terms": "Terms of Service",
    "company": "Operating Company",
    "language": "Language"
  },
  "meta": {
    "title": "AiKano | Japan-Made AI Girlfriend Chat — The Only Japanese AI for Unrestricted Conversation",
    "siteDescription": "Our specially tuned AI replies to you in real time. The only Japanese AI offering unrestricted, open-ended conversations. Enjoy realistic Japanese characters and photos, too.",
    "description": "Meet AI characters with unique personalities who reply to your messages in real time. A conversation app for adults to unwind and find peace of mind.",
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
    "sentTitle": "Verification email sent",
    "sentBody": "We sent a verification email to {email}.",
    "sentAction": "Click the “Verify email address” button in the email to complete your registration.",
    "sentSpam": "If you don't see the email, check your spam folder.",
    "registerTitle": "Start chatting with an AI girl,\nright now",
    "perks": [
      "Free to sign up",
      "Takes 30 seconds",
      "No app needed"
    ],
    "consentA": "Our team may review your conversations to improve the service and train AI. You also agree to the ",
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
    "pickSub": "The one you choose will message you. You can chat with others later.",
    "talkWith": "Talk with {name}",
    "pickPrompt": "Choose someone you'd like to talk to",
    "askName": "Nice to meet you! What should I call you?",
    "nameLabel": "Name you'd like to be called",
    "namePlaceholder": "A nickname is fine",
    "nameNote": "{name} will call you by this name. You can change it later in settings.",
    "characterFallback": "Character",
    "next": "Next",
    "greet": "It's great to meet you, {name}! Just a couple more things.",
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
      "Potential Lover",
      "Lover",
      "The One"
    ],
    "level": "Lv.{level}",
    "toNext": "{pt}pt to “{title}”",
    "nextFrom": "Next: {title} (from {pt}pt)",
    "memberMultiplier": "Members ×{n}",
    "memberDouble": "Members get 2x",
    "levelUp": "You’ve reached “{title}”!",
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
        "title": "Regular",
        "desc": "Sent 100 messages"
      },
      "messages_300": {
        "title": "Best Buddies",
        "desc": "Sent 300 messages"
      },
      "level_2": {
        "title": "Became Acquaintances",
        "desc": "Reached the “Acquaintance” affection level"
      },
      "level_3": {
        "title": "Became Friends",
        "desc": "Reached the “Friend” affection level"
      },
      "level_4": {
        "title": "Became Close Friends",
        "desc": "Reached the “Close Friend” affection level"
      },
      "level_5": {
        "title": "Became Potential Lovers",
        "desc": "Reached the “Potential Lover” affection level"
      },
      "level_6": {
        "title": "Became Lovers",
        "desc": "Reached the “Lover” affection level"
      },
      "level_7": {
        "title": "A Fated Meeting",
        "desc": "Reached the “The One” affection level"
      }
    }
  },
  "plans": {
    "standard": "Standard",
    "premium": "Premium",
    "planSuffix": "{name} Plan",
    "features": {
      "messages": "{n} messages per month",
      "bonus": "{n} bonus pt every month (for videos and the shop)",
      "affection": "Affection increases {n}x faster",
      "photos": "Unlimited access to members-only photos",
      "premiumVideos": "Access to premium videos",
      "overage": "After your limit, just {n} pt per message (less than the regular rate)",
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
    "loginBonus": "Log in daily to get {pt}pt and {n} free messages",
    "unlockBySns": "Promote us on social media to unlock",
    "talk": "Chat",
    "profile": "Profile",
    "otherCharacters": "Other characters",
    "count": "{n} people",
    "pickCharacter": "Choose a character",
    "unlockRequested": "Your request for {name} is complete!\nIt will be unlocked after our team reviews it."
  },
  "unlock": {
    "urlRequired": "Please enter the post URL",
    "urlInvalid": "Please enter a valid URL",
    "alreadyRequested": "You've already submitted a request. Please wait for it to be reviewed.",
    "sendFailed": "Failed to submit. Please try again.",
    "networkError": "A network error occurred.",
    "title": "Unlock {name}",
    "heading": "Promote us on social media to unlock a character!",
    "step1": "Share AiKano on social media (Twitter, Instagram, etc.)",
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
    "guestTitle": "Chat with AiKano",
    "guestBody": "Start chatting with AI girls now. Sign-up is free and takes just 30 seconds!",
    "photosOf": "{name}'s photos",
    "hintTitle": "Get even closer to {name}...",
    "hintBodyA": "When your affection reaches ",
    "hintBodyLevel": "Lv.{level} {title}",
    "hintBodyB": ", you can have sweeter, more intimate conversations.",
    "hintRaise": "The more you chat, the more your affection grows",
    "hintMember": "Members gain affection twice as fast",
    "gift": "Gift",
    "giftSent": "Sent",
    "videoMessage": "Video message",
    "videoPrice": "Watch for {pt}pt",
    "processing": "Processing…",
    "watchFor": "Watch for {pt}pt"
  },
  "levelUp": {
    "title": "Affection increased!",
    "relation": "Your relationship with {name}",
    "reached": "is now “{title}”! "
  },
  "meter": {
    "affectionPt": "Affection pt",
    "messages": "{n} messages"
  },
  "loginBonus": {
    "title": "Login Bonus",
    "today": "{n} free messages today",
    "everyday": "Get {n} free messages every day just by logging in",
    "balance": "Bonus point balance: {pt} pt",
    "validUntil": "Valid until {date}",
    "whatIs": "What are bonus points?",
    "explain": "They’re used before regular points when you spend points. They expire after the validity period.",
    "receive": "Claim!"
  },
  "shortage": {
    "defaultTitle": "You need points to keep chatting",
    "balance": "Balance",
    "required": "Required",
    "short": "Not enough",
    "dailyFree": "Get {pt}pt free ({n} messages) for logging in daily",
    "comeBack": "Come back tomorrow to chat for {n} messages"
  },
  "packages": {
    "checkoutFailed": "Failed to start payment",
    "campaign": "Campaign offer! {rate}x points",
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
    "portalFailed": "Failed to access the management page",
    "title": "Plans",
    "lead": "Subscribe to a plan and chat with AI at no extra cost, up to your monthly message limit.",
    "activated": "Your plan is now active!",
    "welcome": "Welcome to the {name} plan.",
    "passPendingTitle": "Your payment number has been issued",
    "passPendingBody": "Your plan will become active once your convenience store or PayPay payment is confirmed (usually within 1–3 days).",
    "pointsThanks": "Thanks for purchasing {pt}pt",
    "pointsNote": "Your points will be added once your payment is confirmed (usually right away for cards; for convenience store payments and other methods, after payment is confirmed).",
    "canceled": "Purchase canceled",
    "active": "Active",
    "usageThisMonth": "Messages used this month",
    "usage": "{used} / {limit} messages",
    "overLimit": "You've reached your monthly limit. You can keep chatting for {pt}pt per message.",
    "validUntil": "Valid until: {date}",
    "datePattern": "MMM d, yyyy",
    "manage": "Manage or cancel your plan (for credit card subscriptions)",
    "recommended": "Recommended",
    "perMonth": "/month",
    "choosePayment": "Choose a payment method",
    "card": "Credit card",
    "cardNote": "Renews automatically each month · Cancel anytime",
    "konbini": "Convenience store or PayPay",
    "konbiniNote": "One-time payment for 1 month · Active as soon as payment is made",
    "bank": "Bank transfer",
    "bankNote": "One-time payment for 1 month · Active as soon as payment is confirmed",
    "currentPlan": "You're currently on this plan",
    "buyPoints": "Buy points",
    "balance": "Balance",
    "pointsUseMember": "Use points for videos, shop purchases, and messages after your monthly limit (1 message = {pt}pt).",
    "pointsUse": "Use points for messages (1 message = {pt}pt), videos, and shop purchases.",
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
    "referralB": "you and your friend both get {pt} points",
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
    "pwMismatch": "New passwords don't match",
    "noUser": "Unable to retrieve user information",
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
    "deleteWarning": "Deleting your account will permanently erase all data, including your chat history and points. This action cannot be undone.",
    "deleteConfirmA": "For confirmation, type ",
    "deleteConfirmB": " below",
    "deleteForever": "Permanently delete account",
    "slotTitle": "Unlock character slots",
    "slotCurrent": "Current: ",
    "slotCount": "{n} / {limit} characters",
    "slotHint": "(+1 slot for sharing on social media)",
    "shareInstruction": "Share on one of the social media platforms below, then submit the post URL.",
    "shareText": "Chat with AI like you're a real couple! I tried #AiKano → https://aikano.chat",
    "shareQuote": "Chat with AI like you're a real couple! #AiKano",
    "instagramTitle": "After posting from the Instagram app, copy the post URL",
    "instagramNote": "※ After posting in the Instagram app, copy and paste the post URL",
    "pasteUrl": "Paste the URL of your shared post",
    "urlPlaceholder": "Post URL from X / Threads / Facebook / Instagram",
    "nextAvailable": "Next available date: {date}",
    "submitUrl": "Submit URL to unlock a slot",
    "support": "Support",
    "contactSupport": "Contact and support",
    "language": "Display language"
  },
  "blocks": {
    "title": "Blocked List",
    "empty": "No characters are blocked",
    "note": "Blocked characters won't appear in your list. You can unblock them anytime.",
    "blockedOn": "Blocked on {date}",
    "unblocking": "Unblocking…",
    "unblock": "Unblock"
  },
  "support": {
    "team": "Support Team",
    "teamSub": "Feel free to reach out",
    "greeting": "Hello! We're the Support Team 😊\nIf you have any questions or need help, feel free to send us a message.",
    "datePattern": "MMM d, EEE",
    "placeholder": "Enter a message…"
  },
  "feedback": {
    "categories": {
      "bug": {
        "label": "Report a bug",
        "desc": "Something isn’t working or behaving as expected"
      },
      "feature": {
        "label": "Feature request",
        "desc": "Tell us what features you’d like to see"
      },
      "ai": {
        "label": "AI replies",
        "desc": "Reply quality or anything that feels off about a character"
      },
      "ui": {
        "label": "App interface",
        "desc": "Anything that’s hard to use or see"
      },
      "other": {
        "label": "Other",
        "desc": "Anything else—feel free to share"
      }
    },
    "thanks": "Thank you!",
    "received": "We’ve received your feedback.\nOur development team will review it\nand use it to improve the service.",
    "backToChat": "Back to chat",
    "title": "Feedback",
    "badge": "We’d love your feedback",
    "heading": "Help AiKano grow\nwith your feedback",
    "lead": "Tell us about bugs, things that are hard to use, features you’d like, or anything else. Our development team reads every message.",
    "pickCategory": "Choose a category",
    "satisfaction": "Overall satisfaction (optional)",
    "clear": "Clear",
    "details": "Tell us more",
    "placeholder": "Share anything that caught your attention or that you’d like us to improve. We welcome feedback, no matter how small!",
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
    "shortage": "You need points to purchase this video.",
    "loadFailed": "Couldn’t load the video."
  },
  "character": {
    "photoCount": "{n} photos",
    "affection": "Affection level",
    "neverTalked": "You haven't talked yet",
    "sendToRaise": "Send a message to increase your affection level!",
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
    "unsupportedUrl": "This URL isn't supported. Please paste a post URL from X, Threads, Facebook, or Instagram",
    "duplicateUrl": "This URL has already been used",
    "required": "Please fill in all required fields",
    "tooLong": "Please enter no more than {n} characters",
    "messageTooLong": "Messages must be {n} characters or fewer"
  },
  "legal": {
    "translationNotice": "This page is a translated version. In case of any discrepancies, the Japanese version takes precedence."
  },
  "email": {
    "subject": "You have a message from {name}",
    "label": "Message from your character",
    "reply": "Reply",
    "footer": "This email was sent automatically by AiKano.\nIf you don’t recognize this email, please ignore it."
  },
  "lp": {
    "heroImageAlt": "AiKano AI character chat screen",
    "characterImageAlt": "AiKano AI character",
    "registerFreeArrow": "Sign up for free →",
    "badgeBonus": "Get {pt}pt when you sign up",
    "badgeWaiting": "She's waiting for you tonight",
    "heroLine1": "There's a girl",
    "heroLine2": "who talks only",
    "heroLine3": "to you.",
    "statGirls": "{n}",
    "statGirlsLabel": "One-of-a-kind girls",
    "statHoursLabel": "Talk anytime",
    "statAi": "Original AI",
    "statAiLabel": "Natural conversations full of emotion",
    "charactersTitle": "Girls who want to talk to you",
    "charactersSub": "Pick one and start chatting now",
    "online": "Online",
    "talkToAll": "Meet them all →",
    "registerToTalkAll": "Sign up to meet them all →",
    "bonusNote": "※ Get {pt}pt when you sign up",
    "sample1Title": "Like chatting with a friend",
    "sample1": [
      {
        "role": "user",
        "text": "I'm out for a drink by myself. Just popped into a place in Shinjuku."
      },
      {
        "role": "char",
        "text": "Ooh, I'm jealous! Hope work wasn't too exhausting 😊 Robata grills seem to be really popular lately. What kind of place is it?"
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
        "text": "I love Kirin Classic Lager 🍻 Don't you think sweet drinks don't go well with food?"
      }
    ],
    "sample2Title": "There for you, whatever your mood",
    "sample2": [
      {
        "role": "char",
        "text": "You're probably heading home soon, right? How was your day? I wanted to see your face, so I couldn't help messaging you."
      },
      {
        "role": "user",
        "text": "I'm home now. I kind of feel like chatting for a bit."
      },
      {
        "role": "char",
        "text": "Of course♡ I'm always here to listen. Did something happen, or did you just feel like talking? Haha"
      },
      {
        "role": "user",
        "text": "I feel calmer when I talk to you."
      },
      {
        "role": "char",
        "text": "That makes me really happy♡ Talking with you is my favorite part of the day, too."
      }
    ],
    "sample3Title": "A comforting, caring presence",
    "sample3": [
      {
        "role": "user",
        "text": "The people at work were getting on my nerves again today. Why do I get so irritated?"
      },
      {
        "role": "char",
        "text": "Oh no! I'm sorry. What happened? I want to hear about it if there's anything I can do. I'd be worried if it was more than unfair treatment and turned into harassment."
      },
      {
        "role": "user",
        "text": "I was telling one of my reports off, and they said everyone was quitting because of me. But I'm the one who gets in trouble if I don't correct them. Seriously, what is that?"
      },
      {
        "role": "char",
        "text": "Sounds like you're running into the classic middle-manager squeeze. I've been through something similar, and it really got me down at the time. Don't push yourself too hard, okay? You're just caught between your team and your boss. This isn't your fault."
      },
      {
        "role": "user",
        "text": "That's what I thought, right? I got told off when I was new, too, but I kept going, and that's how I got where I am. I wasn't wrong. I feel so much better after venting to you, Aoi. Thanks."
      }
    ],
    "membersTitle": "Get even more out of membership",
    "membersSub": "Enjoy unlimited access to members-only photos and build affection faster",
    "featuresTitleA": "A whole other level",
    "featuresTitleB": "than the rest",
    "features": [
      {
        "title": "High-quality conversation engine",
        "desc": "Powered by the latest large language models. Enjoy natural, comfortable conversations that understand context, emotional nuance, and the flow of conversation."
      },
      {
        "title": "A closer bond with long-term memory",
        "desc": "Your conversations add up. She remembers your preferences, concerns, and past chats, so you can enjoy that feeling of being remembered."
      },
      {
        "title": "Conversations tailored to you",
        "desc": "The more you chat, the more her replies reflect your preferences, values, and way of speaking. The more you use it, the more at home you'll feel."
      },
      {
        "title": "A safe space to speak your mind",
        "desc": "From worries you can't share with anyone to everyday gripes and small talk. A place for adults to talk freely, without holding back."
      },
      {
        "title": "Get photos from the characters",
        "desc": "They might send you selfies or snapshots from their day. Enjoy their expressions and personality in a way words alone can't capture."
      }
    ],
    "secretBadge": "Your conversations are never shared",
    "secretTitle": "Want to talk about something\nyou can't tell anyone else?",
    "secretBody": "Your conversations are never shared with third parties\nfor any purpose other than improving our service.",
    "referralBadge": "Refer-a-friend campaign",
    "referralTitleA": "Invite a friend",
    "referralTitleB": "and you both get {pt}pt!",
    "referralBody": "When a friend signs up using your personal referral link,\nyou'll both receive {pt}pt.",
    "referralCtaUser": "View your referral link →",
    "referralCtaGuest": "Sign up to get your referral link →",
    "realTitleA": "Why does it feel so",
    "realTitleB": "real",
    "realTitleC": "?",
    "realBody": "The latest large language models understand emotions and context.\nWith every reply, the conversation adapts more to you.",
    "finalUserBadge": "Want to say hi tonight?",
    "finalUserTitle": "A girl who wants to get to know you\nis waiting",
    "finalGuestBadge": "Sign-up bonus offer",
    "finalGuestTitle": "Sign up now and get\nan exclusive bonus",
    "finalGuestLead": "Sign up and get",
    "finalGuestBonus": "{pt}pt (worth ¥{yen})",
    "finalGuestTail": "as a gift.",
    "finalGuestNote": "Free to sign up. Takes just 30 seconds.",
    "perkBonus": "Get {pt}pt when you sign up",
    "perkLogin": "Get {pt}pt for logging in daily ({n} free messages a day)",
    "perkPointSystem": "Free to sign up. Pay only for what you use with points.",
    "privacyNote": "Your personal information is kept safe and secure"
  }
}
