"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ReportForm } from "@/components/user-reports/ReportForm";
import { GrokipediaLink } from "@/components/grokipedia/GrokipediaLink";
import { useAcademyProgress } from "@/hooks/useAcademyProgress";
import { slugToModuleId } from "@/lib/academy/progress";

// ── Module Data ──────────────────────────────────────────────
const modules: Record<string, ModuleData> = {
  "phone-scams": {
    number: 1,
    icon: "📞",
    title: "Phone & Grandparent Scams",
    objectives: [
      "After this module, you will be able to recognize grandparent scams, emergency phone scams, and AI voice clone attacks",
      "After this module, you will be able to explain why real emergencies never require gift cards, wire transfers, or crypto",
      "After this module, you will be able to use the hang-up-and-call-back method to verify any urgent phone request",
      "After this module, you will be able to set up a family code word and teach your household to use it",
    ],
    videoId: "iii_MtlKOrs",
    videoTitle: "Fraud Fighters: Hackers expose illegal call centres (Marketplace)",
    videoSource: "CBC Marketplace",
    keyPoints: [
      "Canadians lost over $569 million to fraud in 2023 according to the CAFC, and the FTC reported $12.5 billion in total U.S. fraud losses in 2024 — phone scams are one of the biggest categories on both sides of the border",
      "Scammers call pretending to be a grandchild, police officer, or lawyer and create panic with fake emergencies like arrests or hospital stays",
      "In 2023, a Mississauga senior lost $180,000 to a grandparent scam after criminals posed as her grandson and a fake bail officer — these cases happen across Canada every week",
      "Scammers now use AI voice cloning to mimic a real family member's voice — a McAfee study found just 3 seconds of audio is enough for an 85% voice match, and Toronto Police said AI-powered phone scams 'took off like a rocket' in mid-2025",
      "They demand immediate payment by gift card, wire transfer, or crypto and insist you keep the situation secret from other family members",
      "Real family members can wait for you to verify — scammers cannot, because delay kills the scam",
      "The CRA, RCMP, and courts will NEVER call demanding gift cards or threatening arrest over the phone",
      "Always hang up and call your family member at their REAL number — do not trust the number that called you",
      "Set up a family code word today that only your real family knows — agree on it at your next dinner together",
      "Scammers often call late at night or early morning when you are tired and less alert — if a call feels urgent and scary, that is exactly when to slow down",
      "If you are unsure, say \"I need to check on something\" and hang up — a real loved one will understand",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📞 Phone call: \"Grandma, it's me, I was in an accident and need $2,000 in iTunes gift cards to get out of jail.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Police don't accept gift cards as bail. Always hang up and call your grandchild's real number." },
          { text: "This might be real", correct: false, feedback: "This is a scam. No police force or court accepts gift cards as payment. Hang up and call your grandchild at their real number to verify." },
        ],
      },
      {
        id: "q2",
        scenario: "📞 Phone call: \"This is Constable Smith from your local police. Your grandson has been arrested. Please remain calm. We need you to post bail via wire transfer.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Real police will never ask for bail payment over the phone or by wire transfer. Call your local station directly." },
          { text: "This could be legitimate", correct: false, feedback: "This is a scam. Police will never call demanding bail payment by wire transfer. If concerned, hang up and call your local police station's main number." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 Text message: \"Hi Mom, I dropped my phone in water. This is my new number. Can you text me back?\"",
        options: [
          { text: "Definitely a scam", correct: false, feedback: "While this IS a very common scam opening, it could also be real. The safest response: call your child's original number to verify before responding to the new one." },
          { text: "Suspicious — verify first", correct: true, feedback: "Smart thinking! This is a very common scam tactic, but it could be real. Always call your child's original number to verify before responding." },
        ],
      },
      {
        id: "q4",
        scenario: "📞 Phone call from your bank's number on caller ID, asking you to verify a suspicious charge on your account.",
        options: [
          { text: "Safe to proceed", correct: false, feedback: "Be careful! Caller ID can be faked — this is called \"spoofing.\" Hang up and call your bank using the number on the back of your card." },
          { text: "Suspicious — hang up and call back", correct: true, feedback: "Excellent! Caller ID can be faked. The safest thing is to hang up, find your bank's real number (on your card or statement), and call them yourself." },
        ],
      },
      {
        id: "q5",
        scenario: "📞 Your grandchild calls from their known number asking if you can pick them up from a friend's house.",
        options: [
          { text: "This is normal", correct: true, feedback: "Correct! This is a normal family call. Key differences: they called from their real number, they're not asking for money, and there's no panic or urgency." },
          { text: "Could be a scam", correct: false, feedback: "This is actually fine! They called from their known number, aren't asking for money, and there's no artificial urgency. Trust your family's real phone numbers." },
        ],
      },
      {
        id: "q6",
        scenario: "📞 You get a call and hear your granddaughter's exact voice crying: \"Grandpa, I'm in trouble, please don't tell Mom.\" But something feels slightly off — she called you Grandpa instead of Papa like she usually does.",
        options: [
          { text: "This is likely an AI voice clone scam", correct: true, feedback: "Correct! AI can now clone anyone's voice from a few seconds of audio. The small detail — using the wrong nickname — is a clue. Hang up and call your granddaughter's real number." },
          { text: "She sounds real so it must be her", correct: false, feedback: "AI voice cloning can now perfectly mimic a loved one's voice using clips from social media. Trust your gut when something feels off — like the wrong nickname — and always call back on their real number." },
        ],
      },
      {
        id: "q7",
        scenario: "📞 You receive a voicemail that sounds exactly like your son saying: \"Mom, I got into a car accident. I can't talk right now but I need you to send $3,000 by e-Transfer to my lawyer. I'll text you the details.\" Seconds later, a text arrives from an unknown number with an email address for the transfer.",
        options: [
          { text: "This is an AI voice clone scam", correct: true, feedback: "Correct! Scammers now use AI to clone voices from social media clips and pair the voicemail with a follow-up text to create urgency. Call your son directly on his real number — do not reply to the unknown text or send any money." },
          { text: "It sounds like him so I should send the money quickly", correct: false, feedback: "AI voice cloning can replicate anyone's voice convincingly. The voicemail-plus-text combo is a new tactic designed to prevent you from calling back. Always verify by calling your family member's real number before sending anything." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What is a grandparent scam?", query: "grandparent scam Canada CAFC 2026" },
      { label: "How does AI voice cloning work in scams?", query: "AI voice clone phone scam how it works 2026" },
      { label: "How to report phone scams in Canada", query: "CAFC phone scam reporting Canada 2026" },
    ],
    nextModule: { id: "bank-cra-scams", title: "Bank & CRA Impersonation" },
    prevModule: null,
  },
  "bank-cra-scams": {
    number: 2,
    icon: "🏦",
    title: "Bank & Government Impersonation",
    objectives: [
      "After this module, you will be able to identify fake bank and CRA messages across phone, email, and text",
      "After this module, you will be able to list five things real banks and the CRA will never ask you to do",
      "After this module, you will be able to use the hang-up-and-call-back method to verify any financial request",
      "After this module, you will be able to tell the difference between real CRA mail and a phishing attempt",
    ],
    videoId: "-r8SdNVICRg",
    videoTitle: "How to deal with tax scam calls (Marketplace)",
    videoSource: "CBC Marketplace",
    keyPoints: [
      "The CRA will NEVER call threatening arrest, demanding gift cards, or asking for crypto — they send notices by mail or through My Account",
      "Banks will NEVER ask for your password, PIN, or one-time code by phone, text, or email — any request for these is a scam",
      "In 2023 alone, Canadians lost over $30 million to bank and government impersonation scams reported to the CAFC",
      "A Calgary man lost $12,000 after scammers posing as his bank convinced him to move money to a \"safe account\" — banks never ask you to do this",
      "Scammers threaten account closures, legal action, or missed refunds to create panic — real institutions give you time to respond",
      "If a bank texts you a link, do not click it — open your banking app directly or type your bank's URL into your browser",
      "Know your bank's real SMS short codes — RBC uses 722373, TD uses 74836 — any text from a random number claiming to be your bank is a red flag",
      "In May 2024, Interac raised the daily e-Transfer limit from $3,000 to $10,000 — scammers who hack your banking login can now drain three times as much per day, which is why the CAFC saw bank investigator scams jump 16.5% in 2024",
      "Caller ID and email addresses can be faked to look exactly like real bank or CRA numbers — this is called spoofing",
      "Interac interception fraud is real — scammers hack email accounts, intercept e-Transfer notifications, and answer the security question before the real recipient does, which is why CIBC and other banks push auto-deposit as the safer option",
      "When in doubt, hang up, find the real number on the back of your card or on your statement, and call back yourself",
      "CRA communicates primarily through My Account online and regular mail — bookmark canada.ca/my-cra-account so you always go to the real site",
      "If someone tells you to buy gift cards or Bitcoin to pay a tax debt, hang up immediately — the CRA accepts payment through banks, not retail stores",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📧 Email from \"CRA\" saying you owe $3,400 and linking to a \"secure payment portal\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! The CRA does not send payment demands by email with links. Log into your CRA My Account directly to check your status." },
          { text: "Could be real", correct: false, feedback: "This is a scam. The CRA does not demand payment through email links. Always check your CRA My Account by typing the URL yourself." },
        ],
      },
      {
        id: "q2",
        scenario: "📬 Letter in your mailbox from CRA with your SIN partially masked, asking you to file your return",
        options: [
          { text: "Likely legitimate", correct: true, feedback: "Correct! The CRA does send physical mail. A partially masked SIN is a good sign — scammers usually don't have your real SIN." },
          { text: "Probably a scam", correct: false, feedback: "This is likely real! The CRA does send official letters by mail. The partially masked SIN shows they have your real info. You can verify at canada.ca/cra." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 Text: \"TD Alert: Unusual activity on your account. Click here to verify: td-secure-login.com\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! The real TD website is td.com, not td-secure-login.com. Never click links in texts — open your banking app or type td.com directly." },
          { text: "This looks official", correct: false, feedback: "This is a scam! The real TD domain is td.com. \"td-secure-login.com\" is a fake lookalike. Always open your banking app directly instead of clicking text links." },
        ],
      },
      {
        id: "q4",
        scenario: "🖥️ You log into your CRA My Account and see a message about a reassessment",
        options: [
          { text: "This is normal", correct: true, feedback: "Correct! Messages inside your actual CRA My Account are legitimate. You accessed it yourself through the real website." },
          { text: "This could be fake", correct: false, feedback: "This is legitimate! If you logged into CRA My Account yourself (not through an emailed link), messages there are real." },
        ],
      },
      {
        id: "q5",
        scenario: "📞 Phone call: \"This is the fraud department at RBC. We need your debit card PIN to block a suspicious transaction\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Your bank will NEVER ask for your PIN — not over the phone, not by text, not by email. Ever." },
          { text: "This could be my bank", correct: false, feedback: "This is a scam! No legitimate bank employee will ever ask for your PIN. Hang up and call the number on the back of your card." },
        ],
      },
      {
        id: "q6",
        scenario: "📧 Email: \"Interac e-Transfer: You have received $750.00 from JOHN SMITH. Click here to deposit: interac-etransfer-deposit.com\"",
        options: [
          { text: "This is a phishing scam", correct: true, feedback: "Correct! Real Interac e-Transfer notifications come from specific Interac domains and your bank. The fake domain 'interac-etransfer-deposit.com' is a trap. Log into your banking app directly to check for pending transfers." },
          { text: "I should click to deposit the money", correct: false, feedback: "This is a phishing scam! The link leads to a fake site that will steal your banking login. Real e-Transfers show up inside your banking app. Never click deposit links in emails — log into your bank directly." },
        ],
      },
      {
        id: "q7",
        scenario: "📱 Text message: \"CRA Notice: You are eligible for a $847.63 Climate Action Incentive refund. Deposit will be sent via Interac e-Transfer. Confirm your banking details here: cra-refund-etransfer.ca\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! The CRA never sends refunds by Interac e-Transfer — refunds go through direct deposit or cheque. The fake domain 'cra-refund-etransfer.ca' is designed to steal your banking credentials. Check My CRA Account directly if you expect a refund." },
          { text: "The CRA does send refunds so this could be real", correct: false, feedback: "While the CRA does issue refunds, they NEVER use Interac e-Transfer or ask you to confirm banking details through a text link. Refunds are sent by direct deposit or cheque. Log into My CRA Account at canada.ca to verify." },
        ],
      },
      {
        id: "q8",
        scenario: "📞 You get a call from someone claiming to be your bank's Zelle fraud department. They say someone is trying to drain your account and you need to send $1,500 via Zelle to a \"secure holding account\" to protect your funds. The caller ID shows your bank's real number.",
        options: [
          { text: "This is a scam — hang up and call your bank directly", correct: true, feedback: "Correct. Your bank will never ask you to send money via Zelle to \"protect\" your account — that is not how fraud departments work. Caller ID can be spoofed to show any number. Hang up and call the number on the back of your debit card." },
          { text: "The caller ID matches my bank so it must be real", correct: false, feedback: "Caller ID can be faked — this is called spoofing. No bank will ever ask you to Zelle money to a \"secure account.\" The NY Attorney General sued Zelle's parent company in 2025 over $1 billion in losses from scams like this one. Hang up and call your bank yourself." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How do CRA scams work?", query: "CRA scam Canada how to spot 2026" },
      { label: "How to verify CRA communication", query: "how to verify CRA communication legitimate canada.ca" },
      { label: "Fake Interac e-Transfer scams", query: "fake Interac e-Transfer phishing email Canada 2026" },
    ],
    nextModule: { id: "tech-support-scams", title: "Tech Support & Fake Warnings" },
    prevModule: { id: "phone-scams", title: "Phone & Grandparent Scams" },
  },
  "tech-support-scams": {
    number: 3,
    icon: "💻",
    title: "Tech Support & Fake Virus Warnings",
    objectives: [
      "After this module, you will be able to recognize fake virus pop-ups and tell them apart from real antivirus alerts",
      "After this module, you will be able to safely force-close a scary pop-up without clicking anything inside it",
      "After this module, you will be able to explain why Microsoft, Apple, and Google will never call you about viruses",
      "After this module, you will be able to take the right steps immediately if you already gave someone remote access to your computer",
    ],
    videoId: "nAVSq2BAUkM",
    videoTitle: "Phone scammers posing as your bank (Marketplace)",
    videoSource: "CBC Marketplace",
    keyPoints: [
      "Pop-ups saying \"YOUR COMPUTER IS INFECTED\" with a phone number are ALWAYS fake — real antivirus never shows phone numbers",
      "Microsoft, Apple, and Google will never call you about a virus — they have said so publicly and repeatedly",
      "The CAFC received over 50,000 tech support reports in 2024, making it a top-10 scam by volume — cyber-enabled fraud accounted for 75% of the $641 million in total reported losses that year",
      "A Winnipeg couple lost $14,000 after a fake Microsoft agent convinced them to install remote access software and log into their bank — the criminals drained the account in minutes",
      "Never call a phone number shown in a pop-up warning — real security software handles threats automatically without asking you to phone anyone",
      "If a pop-up locks your screen, press Ctrl+Alt+Delete on Windows or Cmd+Option+Esc on Mac to force-close the browser — do not click anything inside the pop-up",
      "If you gave someone remote access, disconnect from the internet immediately by unplugging your cable or turning off WiFi",
      "After disconnecting, use a different device to change your banking and email passwords right away",
      "Scammers sometimes leave hidden software on your computer after a remote session — run a full antivirus scan or take your computer to a trusted repair shop",
      "When websites ask to send you notifications, click Block unless you specifically want alerts from that site — scammers use notification permissions to flood you with fake warnings later",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "🖥️ Full-screen browser alert: \"WINDOWS DEFENDER ALERT! Your PC is infected. Call 1-888-555-0123 immediately!\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Real Windows Defender never shows phone numbers. Close the browser with Ctrl+Alt+Delete → End Task." },
          { text: "I should call the number", correct: false, feedback: "This is a scam! Real antivirus software never displays phone numbers in pop-ups. Force-close your browser instead." },
        ],
      },
      {
        id: "q2",
        scenario: "🔔 Your antivirus app (that you installed) shows a notification about an update available",
        options: [
          { text: "This is normal", correct: true, feedback: "Correct! Software you intentionally installed sending update notifications is normal behavior." },
          { text: "This might be a scam", correct: false, feedback: "This is normal! If it's software you installed yourself, update notifications are expected. The key: you recognize the software." },
        ],
      },
      {
        id: "q3",
        scenario: "📞 Someone calls saying \"We're from Microsoft and detected a virus on your computer\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Microsoft does not monitor individual computers and will never make unsolicited calls about viruses. Hang up." },
          { text: "Microsoft might do this", correct: false, feedback: "This is a scam! Microsoft has stated they never make unsolicited calls about computer problems. Hang up immediately." },
        ],
      },
      {
        id: "q4",
        scenario: "🌐 A website asks if you want to allow notifications",
        options: [
          { text: "Always a scam", correct: false, feedback: "Not always a scam, but be cautious! Allowing notifications from unknown sites can lead to spam pop-ups. Click 'Block' unless you trust the site." },
          { text: "Suspicious — usually click Block", correct: true, feedback: "Good instinct! While not always a scam, saying 'Block' is almost always the right choice unless you specifically want notifications from that site." },
        ],
      },
      {
        id: "q5",
        scenario: "📧 Email from \"Apple Support\" with a link to \"verify your iCloud account or it will be deleted\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Apple will never threaten to delete your account by email. If concerned, go to appleid.apple.com directly." },
          { text: "Apple might send this", correct: false, feedback: "This is a scam! Apple does not threaten account deletion via email. Visit appleid.apple.com directly to check your account status." },
        ],
      },
      {
        id: "q6",
        scenario: "🖥️ A pop-up appears while browsing: \"Your Norton Antivirus subscription has expired! Renew now for $399.99 or your computer will be unprotected.\" You don't have Norton installed.",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! If you never installed Norton, you don't have a subscription to renew. This is a fake renewal pop-up designed to steal your credit card info. Close the tab or force-close your browser." },
          { text: "I should renew to stay protected", correct: false, feedback: "This is a scam! You can't renew software you never bought. Scammers use fake subscription renewals to trick people into entering credit card details. Close the browser and ignore it." },
        ],
      },
      {
        id: "q7",
        scenario: "📧 Email: \"Your McAfee subscription — $549.99 — has been auto-renewed. If you did not authorize this charge, call 1-866-555-0199 within 24 hours for a full refund.\" You have never used McAfee.",
        options: [
          { text: "This is a refund scam — do not call", correct: true, feedback: "Correct! This is a fake invoice scam. You were never charged because you never had McAfee. If you call, they will ask for remote access to your computer or your banking details to \"process the refund\" — and steal your money. Delete the email." },
          { text: "I should call to make sure I wasn't charged", correct: false, feedback: "Do not call! You were never charged — there is no subscription. The phone number connects you to scammers who will ask for remote access or banking details to \"refund\" you. Check your bank statement directly if you are worried, but do not call the number in the email." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What are tech support scams?", query: "tech support scam how it works Canada 2026" },
      { label: "How to close fake virus popup", query: "how to close fake virus popup safely Windows Mac" },
      { label: "Fake antivirus subscription renewal scam", query: "fake antivirus subscription renewal popup scam 2026" },
    ],
    nextModule: { id: "romance-scams", title: "Romance & Friendship Scams" },
    prevModule: { id: "bank-cra-scams", title: "Bank & CRA Impersonation" },
  },
  "romance-scams": {
    number: 4,
    icon: "💔",
    title: "Romance & Friendship Scams",
    objectives: [
      "After this module, you will be able to recognize the romance scam pattern — fast love, excuses, then money requests",
      "After this module, you will be able to explain how scammers build trust over weeks or months before asking for anything",
      "After this module, you will be able to use reverse image search to verify someone's profile photos",
      "After this module, you will be able to spot AI-generated dating profiles and deepfake video calls",
    ],
    videoId: "cHzVXm5EKCM",
    videoTitle: "Exposing fraudsters stealing life savings (Marketplace)",
    videoSource: "CBC Marketplace",
    keyPoints: [
      "Romance scammers build intense emotional connections over weeks or months before asking for money — they are patient and skilled",
      "They always have excuses for not video calling — military deployment, oil rig, poor internet connection, broken camera",
      "The first money request is small — maybe $200 for an emergency — to test you, and it always escalates from there",
      "They move conversations off dating platforms quickly to WhatsApp, Telegram, or email to avoid the platform's fraud detection",
      "Reverse image search their profile photos by uploading to images.google.com — stolen photos from real people are extremely common",
      "AI can now generate realistic fake profile photos that have never been used before — look for oddly smooth skin, weird earrings, or blurry backgrounds",
      "Anyone who asks for money, crypto, or gift cards in an online relationship is very likely a scammer — no matter how real the connection feels",
      "The CAFC reported over $250 million in romance-related losses in 2024 — the FBI calls them 'pig butchering' scams, and the average victim loses $170,000 before they realize what happened",
      "Recovery scams are the cruel follow-up — fraudsters posing as lawyers or investigators promise to get your money back for a fee, and these doubled to $1.6 million in CAFC reports in 2023",
      "A Vancouver woman lost $750,000 over 18 months to a romance scammer pretending to be a European engineer — the emotional manipulation was so strong she borrowed against her home",
      "If someone you have never met in person asks for money, the answer is always no — no matter how urgent the story sounds",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "💕 You've been talking to someone online for 3 weeks. They say \"I love you\" and want to meet, but first they need $500 for a plane ticket.",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Saying 'I love you' after 3 weeks AND asking for money is a textbook romance scam pattern. Real partners don't ask for money before meeting." },
          { text: "They might really need help", correct: false, feedback: "This is a classic romance scam pattern. The combination of fast emotional attachment + money request is the #1 red flag. A real person would find another way to meet." },
        ],
      },
      {
        id: "q2",
        scenario: "💕 Someone you met on a dating app wants to video call next week when they're back from a work trip.",
        options: [
          { text: "This seems reasonable", correct: true, feedback: "This is actually normal! They're willing to video call and gave a specific timeframe. The key difference from scams: no excuses, no rush, no money involved." },
          { text: "This is suspicious", correct: false, feedback: "This is actually fine! Being willing to video call is a good sign. Scammers avoid video calls entirely — they always have excuses." },
        ],
      },
      {
        id: "q3",
        scenario: "💕 Your online partner of 2 months says they're a US soldier deployed overseas. Their camera is broken. They need you to invest in their 'crypto trading platform.'",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Military deployment + broken camera + crypto investment = three major red flags. The US military provides communication equipment. This is a classic script." },
          { text: "Military life is tough — they might need support", correct: false, feedback: "This hits three major red flags: fake military deployment (a top cover story), refusing video calls, and pushing a crypto 'investment.' This is a well-known scam script." },
        ],
      },
      {
        id: "q4",
        scenario: "💕 Someone you've been chatting with asks to move the conversation from the dating app to WhatsApp 'because it's easier.'",
        options: [
          { text: "Normal — many people prefer WhatsApp", correct: false, feedback: "While some people do prefer WhatsApp, moving off the dating platform quickly is a red flag. Dating platforms have fraud detection — scammers want to avoid that oversight." },
          { text: "Suspicious — scammers do this to avoid detection", correct: true, feedback: "Good instinct! Scammers move conversations off dating platforms to avoid the platform's fraud detection systems. It's fine to stay on the app until you've verified who they are." },
        ],
      },
      {
        id: "q5",
        scenario: "💕 Your online partner sends you a gift and then says they're in a medical emergency overseas and need $3,000 for hospital bills.",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Sending a small gift first builds trust and creates a sense of obligation. The 'emergency' that follows is designed to make you feel guilty if you don't help. This is textbook manipulation." },
          { text: "They sent a gift — they must be real", correct: false, feedback: "The gift is the trap! Scammers invest $50-100 in a gift to create a sense of obligation, then ask for thousands. Real emergencies don't require your online partner to pay hospital bills." },
        ],
      },
      {
        id: "q6",
        scenario: "💕 You match with someone on a dating app. Their photos look perfect — like a model. They message first with a long, thoughtful message about your profile. Their bio mentions loving hiking, dogs, and travel. You do a reverse image search and get zero results.",
        options: [
          { text: "Could be an AI-generated fake profile", correct: true, feedback: "Good instinct! AI can now create realistic photos that have never appeared online before — so reverse image search finds nothing. Look for other red flags: too-perfect photos, generic interests, and unusually polished messages early on. Ask for a live video call before investing emotionally." },
          { text: "No results means the photos are real", correct: false, feedback: "Not anymore! AI-generated photos are brand new images that won't appear in reverse image search. Scammers use AI to create fake profiles that pass the old verification tricks. Ask for a live video call to confirm they are a real person." },
        ],
      },
      {
        id: "q7",
        scenario: "💕 Someone you've been flirting with online for a week asks you to share an intimate photo \"just between us.\" A few hours later, they send a screenshot of your photo and threaten to share it with your entire contact list unless you send $2,000 in Bitcoin within 48 hours.",
        options: [
          { text: "This is sextortion — do not pay", correct: true, feedback: "Correct! This is sextortion — a form of blackmail. Do NOT pay — paying usually leads to more demands, not silence. Block the person, save evidence, and report to the RCMP and CAFC. You can also report to the Canadian Centre for Child Protection at cybertip.ca if a minor is involved. You are the victim here — there is no shame in getting help." },
          { text: "I should pay to make it go away", correct: false, feedback: "Do NOT pay. In most cases, paying leads to more demands — not relief. Block the scammer, screenshot the threats as evidence, and report to the RCMP and CAFC at 1-888-495-8501. Sextortion is a crime and you are the victim. If you or someone you know is under 18, also report to cybertip.ca." },
        ],
      },
      {
        id: "q8",
        scenario: "💕 Someone you have been chatting with on WhatsApp for six weeks says: \"I have been making great returns on this trading app — let me show you how.\" They send a link to download an app called CryptoVault Pro. You install it, deposit $1,000, and within days the app shows your balance at $4,200. When you try to withdraw, the app says you must pay a 20% \"withdrawal tax\" first.",
        options: [
          { text: "This is a pig butchering scam — the app and the profits are fake", correct: true, feedback: "Correct. The app is controlled by scammers — the balance is just numbers on a screen. The \"withdrawal tax\" is another way to extract money. Real platforms never require upfront tax payments to release your own funds. The FBI reported $5.8 billion in pig butchering losses in 2024." },
          { text: "A 20% tax on profits sounds like a real requirement", correct: false, feedback: "No legitimate trading platform requires you to pay taxes to them before withdrawing. Capital gains taxes are handled through your tax return — not paid to an app. The entire platform is fake. The person who introduced you is part of the scam." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How do romance scams work?", query: "romance scam red flags patterns Canada 2026" },
      { label: "AI-generated fake dating profiles", query: "AI generated fake dating profile how to spot 2026" },
      { label: "How to reverse image search", query: "reverse image search dating profile Google Images" },
      { label: "What is sextortion?", query: "sextortion scam Canada how to respond RCMP 2026" },
    ],
    nextModule: { id: "too-good-to-be-true", title: "Lotteries, Fake Jobs & Crypto" },
    prevModule: { id: "tech-support-scams", title: "Tech Support & Fake Warnings" },
  },
  "too-good-to-be-true": {
    number: 5,
    icon: "🎰",
    title: "Lotteries, Fake Jobs & Crypto Scams",
    objectives: [
      "After this module, you will be able to recognize lottery, prize, and inheritance scams on sight",
      "After this module, you will be able to spot fake job offers and work-from-home schemes before you lose money",
      "After this module, you will be able to identify crypto and investment fraud red flags — including pig butchering scams",
      "After this module, you will be able to explain why any investment with guaranteed returns is a scam",
    ],
    videoId: "9cwcyLvoMps",
    videoTitle: "Tax scammers traced back to India (Marketplace)",
    videoSource: "CBC Marketplace",
    keyPoints: [
      "You cannot win a lottery or contest you never entered — full stop",
      "Real prizes never require you to pay a processing fee, taxes, or shipping upfront — that is always a scam",
      "Legitimate employers never ask you to pay for training, equipment, or a background check before starting work",
      "If investment returns are guaranteed, it is a scam — no investment is risk-free, and anyone who says otherwise is lying",
      "Cash flipping scams on social media promise to turn $100 into $1,000 through a 'money hack' — you send real money via Cash App or e-Transfer and get nothing back",
      "Cryptocurrency is not regulated like banks — once you send crypto, it is almost impossible to recover",
      "Pig butchering scams are a growing threat — scammers build trust over weeks, then lure you into a fake crypto trading app that shows fake profits until you try to withdraw",
      "Investment fraud accounted for 49% of the CAFC's $644 million in reported losses in 2024 — and fake job scams saw the largest dollar-loss increase of any category that year",
      "An Ottawa man lost $400,000 to a pig butchering scam after a person he met on a dating app introduced him to a fake crypto trading platform — the app looked completely real",
      "Inheritance from a distant relative emails are always scams — no legitimate lawyer contacts strangers by email about millions of dollars",
      "If it sounds too good to be true, it is — every single time",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📧 Email: \"Congratulations! You've been selected to receive $2.4 million from the Canadian National Lottery. Pay $250 processing fee to claim.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! There is no 'Canadian National Lottery' that contacts winners by email. Real lotteries never require upfront payment to claim prizes." },
          { text: "Could be real — it's only $250", correct: false, feedback: "This is a classic advance fee scam. There's no such lottery. And once you pay $250, they'll ask for more 'fees' — it never ends." },
        ],
      },
      {
        id: "q2",
        scenario: "💼 Job posting: \"Work from home! Make $5,000/week reshipping packages. No experience needed. Send $200 for your starter kit.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Reshipping scams use you to launder stolen goods. The 'starter kit' fee is theft, and you could face criminal charges for reshipping stolen merchandise." },
          { text: "Might be a legitimate opportunity", correct: false, feedback: "This is a reshipping scam — one of the most common job fraud types. You'd be unknowingly laundering stolen goods, and the 'kit fee' is pure theft." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 Instagram ad: \"New crypto token launching — guaranteed 500% returns in 30 days! Join now before it's too late!\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! No investment can 'guarantee' 500% returns. The urgency ('before it's too late') is designed to stop you from thinking critically." },
          { text: "Crypto can have big returns", correct: false, feedback: "While crypto can be volatile, NO legitimate investment 'guarantees' 500% returns. The word 'guaranteed' combined with urgency is always a scam signal." },
        ],
      },
      {
        id: "q4",
        scenario: "💼 You apply for a job on Indeed. The company emails you for an interview, asks about your experience, and invites you to their office downtown.",
        options: [
          { text: "This seems legitimate", correct: true, feedback: "This looks normal! They found you on a real job site, asked about qualifications, and want an in-person meeting. No upfront payments, no urgency." },
          { text: "Could be a scam", correct: false, feedback: "This is likely legitimate! Key signs: real job platform, interest in your qualifications, in-person interview. No money requested, no 'act now' pressure." },
        ],
      },
      {
        id: "q5",
        scenario: "📧 Email from a 'lawyer' in Nigeria: \"Your distant uncle passed away and left you an inheritance of $4.7 million. We need your bank details to transfer the funds.\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! This is the classic 'Nigerian prince' / advance fee scam. No legitimate lawyer contacts you by unsolicited email about an inheritance." },
          { text: "I should look into it", correct: false, feedback: "This is one of the oldest email scams in existence. They'll ask for 'transfer fees' that escalate endlessly. Delete and ignore." },
        ],
      },
      {
        id: "q6",
        scenario: "💬 Someone you met online a month ago says: \"I've been making great money on this trading app — look at my returns!\" They show you screenshots of huge profits and offer to teach you. They send you a link to download the app.",
        options: [
          { text: "This is a pig butchering scam", correct: true, feedback: "Correct! This is a pig butchering scam — they build trust, show fake profits on a fake app, and convince you to deposit more and more. When you try to withdraw, the money is gone. The app, the profits, and the person are all fake." },
          { text: "The screenshots prove it works", correct: false, feedback: "Screenshots of profits are easily faked. This is called a pig butchering scam — the app is fake, the profits are fake, and when you try to withdraw your money, you will be told to pay 'taxes' or 'fees' first. Your money is already gone." },
        ],
      },
      {
        id: "q7",
        scenario: "📱 You download a slick-looking trading app recommended by someone you've been chatting with for two months on WhatsApp. You deposit $500 and the app shows your balance growing to $2,300 within a week. When you try to withdraw, the app says you must pay a 15% 'capital gains tax' before funds can be released.",
        options: [
          { text: "This is a pig butchering scam — the profits and the app are fake", correct: true, feedback: "Correct! The app is completely fake — the balance is just numbers on a screen controlled by the scammers. The 'tax' is another way to extract money from you. Real trading platforms deduct taxes automatically or report to the CRA — they never demand upfront tax payments to unlock withdrawals. Canadians lost over $309 million to investment fraud in 2023." },
          { text: "Paying 15% tax on gains sounds reasonable", correct: false, feedback: "No legitimate platform requires you to pay 'taxes' before withdrawing your own money. This is a pig butchering scam — the app, the profits, and the person who introduced you are all part of the fraud. Real capital gains taxes are handled through your tax return, not paid to an app." },
        ],
      },
      {
        id: "q8",
        scenario: "💼 You receive an email: \"Congratulations! You've been hired as a Remote Quality Assurance Specialist for Amazon. Salary: $35/hour. To get started, please purchase your equipment kit ($475) from our approved vendor. You'll be reimbursed on your first paycheque.\"",
        options: [
          { text: "This is a fake job scam — real employers never ask you to pay for equipment upfront", correct: true, feedback: "Correct! Amazon and other legitimate employers provide equipment at no cost to you. Any job that requires you to spend money before you start — for equipment, training, background checks, or 'activation fees' — is a scam. The CAFC reported over $30 million lost to job scams in Canada in 2023." },
          { text: "Amazon is a big company so this is probably real", correct: false, feedback: "Scammers impersonate Amazon, Shopify, and other trusted brands constantly. No legitimate employer asks new hires to buy their own equipment from a specific vendor. Amazon provides all work equipment directly. If you did not apply through amazon.jobs, it is not real." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What is a pig butchering scam?", query: "pig butchering scam how it works Canada 2026" },
      { label: "Fake job scams in Canada", query: "fake job scam Canada warning signs 2026" },
      { label: "Crypto investment scam red flags", query: "cryptocurrency investment scam warning signs 2026" },
    ],
    nextModule: { id: "phishing", title: "Phishing Emails, Texts & Fake Sites" },
    prevModule: { id: "romance-scams", title: "Romance & Friendship Scams" },
  },
  "phishing": {
    number: 6,
    icon: "🎣",
    title: "Phishing Emails, Texts & Fake Websites",
    objectives: [
      "After this module, you will be able to check sender email addresses and spot fake domains",
      "After this module, you will be able to hover over links to see where they really go before clicking",
      "After this module, you will be able to spot fake websites by checking the URL carefully",
      "After this module, you will be able to recognize AI-written phishing emails that have no typos or grammar errors",
    ],
    videoId: "g2QZT89aRCs",
    videoTitle: "Busting phone scammers: RCMP investigation (Marketplace)",
    videoSource: "CBC Marketplace",
    keyPoints: [
      "Check the ACTUAL email address, not just the display name — \"RBC Security\" could be from scammer@gmail.com",
      "Hover over links without clicking to see where they really go — the visible text can say one thing but link somewhere else entirely",
      "AI-written phishing emails now have perfect grammar, no typos, and sound completely professional — you can no longer rely on bad spelling to spot fakes",
      "Look for urgency, threats, and generic greetings like \"Dear Customer\" instead of your name — these are still the biggest red flags",
      "Real companies do not ask you to verify your account through an email link — they tell you to log in through their app or website",
      "When in doubt, type the company's website address directly into your browser — never click the email link",
      "Check for the padlock icon AND the correct domain name — scam sites can have padlocks too, so the padlock alone means nothing",
      "Coinbase users lost over $65 million to social engineering and phishing in just two months (December 2024 to January 2025) according to blockchain investigator ZachXBT — fake login pages and support impersonation were the top tactics",
      "Fake Interac e-Transfer confirmation emails are a growing Canadian threat — scammers send them from Gmail addresses mimicking Interac to trick sellers into shipping items before the 'deposit' actually clears",
      "CAFC phishing reports climbed another 6.8% in 2024 — and QR code phishing ('quishing') hit at least 10 confirmed cases in Montreal and Ottawa, with police issuing public alerts about fake codes on parking meters and utility letters",
      "AI now generates polished phishing emails in a 19-second cadence — double the speed of 2024 — making spam filters increasingly ineffective against personalized attacks",
      "A Brampton family lost $28,000 after clicking a fake Scotiabank text link and entering their login on a lookalike site — the scammers drained the account within an hour",
      "On a phone, press and hold a link to preview the URL before opening it — this is the mobile version of hovering",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📧 Email from: \"Amazon Customer Service\" <orders-update@amazn-secure.com>. Subject: \"Your order has been cancelled — verify your payment method.\"",
        options: [
          { text: "This is phishing", correct: true, feedback: "Correct! The email is from 'amazn-secure.com' — not amazon.com. Scammers use lookalike domains. Always check the actual email address, not just the display name." },
          { text: "This could be from Amazon", correct: false, feedback: "Look at the email address carefully: 'amazn-secure.com' is NOT amazon.com. One missing letter makes it a scam domain. Real Amazon emails come from @amazon.com or @amazon.ca." },
        ],
      },
      {
        id: "q2",
        scenario: "📱 Text from your phone carrier: \"Your bill is overdue. Pay now to avoid service interruption: https://rogers-bill-pay.net\"",
        options: [
          { text: "This is phishing", correct: true, feedback: "Correct! 'rogers-bill-pay.net' is not Rogers' real website (rogers.com). Always go to your carrier's website directly or use their app." },
          { text: "I should pay my bill", correct: false, feedback: "The link 'rogers-bill-pay.net' is NOT Rogers' real website. Log into rogers.com directly or call the number on your bill to check if you owe anything." },
        ],
      },
      {
        id: "q3",
        scenario: "📧 Email from your actual boss's email address asking you to review an attached document about next week's meeting.",
        options: [
          { text: "Probably safe", correct: true, feedback: "If it's truly from your boss's real email address and the context makes sense (you have meetings), this is likely legitimate. But if anything feels off, verify with a quick call." },
          { text: "Could be a spear-phishing attack", correct: false, feedback: "While spear-phishing exists, if the email is from your boss's verified address and the context is normal, it's likely fine. Trust but verify if something feels unusual." },
        ],
      },
      {
        id: "q4",
        scenario: "📧 Email: \"Dear Valued Customer, We detected unusual activity. Click here to secure your account immediately or it will be permanently locked.\"",
        options: [
          { text: "This is phishing", correct: true, feedback: "Correct! Multiple red flags: generic greeting ('Valued Customer'), urgency ('immediately'), threat ('permanently locked'), and a vague 'click here' link. Real companies address you by name." },
          { text: "I should check my account", correct: false, feedback: "This is phishing! 'Dear Valued Customer' (not your name), urgency, and threats are classic signs. If concerned, go to the company's website directly — don't click the email link." },
        ],
      },
      {
        id: "q5",
        scenario: "🌐 You're on a website that looks like your bank's login page. The URL bar shows: https://td-banking-secure.com with a padlock icon.",
        options: [
          { text: "This is a fake site", correct: true, feedback: "Correct! The padlock only means the connection is encrypted — it does NOT mean the site is legitimate. TD's real website is td.com. 'td-banking-secure.com' is a scam domain." },
          { text: "The padlock means it's safe", correct: false, feedback: "Common misconception! The padlock means the connection is encrypted, but scam sites can have padlocks too. Always check the domain: td.com is real, td-banking-secure.com is fake." },
        ],
      },
      {
        id: "q6",
        scenario: "📧 Email from \"Canada Post\" with perfect grammar, your correct name, and a tracking number: \"Your package could not be delivered. Please confirm your address and pay a $2.49 redelivery fee.\" The sender address is noreply@canadapost-delivery.com.",
        options: [
          { text: "This is a phishing scam", correct: true, feedback: "Correct! Even though the grammar is perfect and it uses your real name, the domain 'canadapost-delivery.com' is not Canada Post's real domain (canadapost-postescanada.ca). AI helps scammers write flawless emails now — perfect grammar no longer means it is safe." },
          { text: "It looks professional so it might be real", correct: false, feedback: "AI now writes phishing emails with perfect grammar and correct names. The giveaway is the domain: 'canadapost-delivery.com' is fake. Canada Post's real domain is canadapost-postescanada.ca. Always check the sender domain, not the quality of the writing." },
        ],
      },
      {
        id: "q7",
        scenario: "📧 Email from \"Netflix Support\" <support@netflix.com> with perfect grammar, your full name, and your correct account email: \"We were unable to process your payment of $16.49. Please update your billing information within 24 hours to avoid service interruption.\" The email has no typos, includes the Netflix logo, and links to a page that looks exactly like the Netflix login.",
        options: [
          { text: "Still suspicious — verify by going to netflix.com directly, not through the email link", correct: true, feedback: "Correct! AI-written phishing emails are now flawless — perfect grammar, real logos, and accurate personal details scraped from data breaches. Even the sender address can be spoofed. The ONLY safe approach is to never click email links — open netflix.com yourself or use the app. Over 70,000 phishing reports were filed with the CAFC in 2023." },
          { text: "It has my real info and perfect grammar so it must be Netflix", correct: false, feedback: "Scammers now use AI to write perfect emails and pull your real name and email from data breaches. The sender address can be spoofed to look exactly like netflix.com. Always go to the website directly — type netflix.com in your browser or open the app — never click the link in the email." },
        ],
      },
      {
        id: "q8",
        scenario: "📱 You receive a letter in your mailbox from your electricity provider with a QR code: \"Scan to pay your overdue balance of $127.50 and avoid disconnection.\" You don't remember being behind on payments.",
        options: [
          { text: "Do not scan — call your provider directly to verify the bill", correct: true, feedback: "Correct! QR code phishing — called 'quishing' — is a fast-growing scam. Fraudulent QR codes can appear in physical mail, on parking meters, or on posters. Scanning takes you to a fake payment page that steals your card details. Always verify bills by calling the number on your real statement or logging into your account directly." },
          { text: "QR codes in physical mail must be safe", correct: false, feedback: "Physical mail can be faked too. Scammers send professional-looking letters with QR codes that lead to phishing sites — this is called 'quishing.' A QR code is just a link you cannot read with your eyes, which makes it even more dangerous than a clickable link. Call your provider using the number on a previous bill to verify." },
        ],
      },
      {
        id: "q9",
        scenario: "📱 Text message: \"IRS ALERT: Your tax account is past due. Purchase $2,000 in Apple gift cards and text the codes to this number to resolve your balance immediately or a warrant will be issued.\"",
        options: [
          { text: "This is a scam — the IRS never demands gift cards by text", correct: true, feedback: "Correct. The IRS contacts taxpayers by mail — never by text or phone demanding gift cards. No government agency in any country accepts Apple gift cards as payment. Delete the text and report it to TIGTA at 1-800-366-4484." },
          { text: "I should check with the IRS just in case", correct: false, feedback: "The IRS will never text you demanding gift card payments. This is a well-documented scam — the FTC reported $789 million in government imposter losses in 2024. If you are concerned about your tax account, log into IRS.gov directly." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How to identify phishing emails", query: "phishing email identification tips 2026" },
      { label: "AI-written phishing emails", query: "AI generated phishing email how to spot 2026" },
      { label: "How to check if a website is real", query: "how to verify website legitimacy check URL domain" },
    ],
    nextModule: { id: "social-media", title: "Social Media Red Flags" },
    prevModule: { id: "too-good-to-be-true", title: "Lotteries, Fake Jobs & Crypto" },
  },
  "social-media": {
    number: 7,
    icon: "📱",
    title: "Social Media & Messaging Red Flags",
    objectives: [
      "After this module, you will be able to recognize fake profiles, cloned accounts, and impersonation scams",
      "After this module, you will be able to explain how scammers use direct messages for social engineering",
      "After this module, you will be able to adjust your privacy settings on major platforms to limit what strangers see",
      "After this module, you will be able to identify deepfake video and AI-generated content on social media",
    ],
    videoId: "-hRKTYxK8xQ",
    videoTitle: "How to avoid the one-ring phone scam",
    videoSource: "CTV News",
    keyPoints: [
      "Verify accounts before trusting DMs — check follower count, post history, and account age before responding",
      "Do not share your location, school, workplace, or daily routine with strangers online — scammers use these details to build targeted attacks",
      "Friend-of-a-friend requests are often fake — scammers clone real profiles using stolen photos and names",
      "Free giveaways that ask you to click a link or enter your details are almost always scams — real brands announce winners publicly",
      "If a celebrity or brand DMs you first, it is almost certainly an impersonator — real celebrities do not message strangers about money",
      "Deepfake video is now cheap and easy to make — scammers can create realistic video calls using a single photo of someone's face",
      "Cyber-enabled fraud — most of it originating on social media — cost Canadians $482 million in 2024, accounting for 75% of all reported losses to the CAFC",
      "The OPP issued a June 2025 bulletin warning of a sharp rise in deepfake investment videos on YouTube and social media ads featuring AI-generated news anchors and Canadian politicians",
      "A Halifax teenager lost $2,000 after a scammer cloned her friend's Instagram account and sent a fake emergency message asking for an e-Transfer",
      "Report and block suspicious accounts — it protects others too, and platforms use reports to shut down fraud rings",
      "Review your privacy settings today — limit who can see your posts, friends list, and personal info on Facebook, Instagram, and TikTok",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "📱 A Facebook account with your friend's name and photo sends you a friend request. You're already friends with them.",
        options: [
          { text: "This is a cloned/fake profile", correct: true, feedback: "Correct! If you're already friends with this person, the new request is from a cloned profile. Report it and warn your real friend — their photos are being used." },
          { text: "They might have made a new account", correct: false, feedback: "While possible, a duplicate account with the same name and photo is almost always a cloned profile. Check with your real friend through their verified account before accepting." },
        ],
      },
      {
        id: "q2",
        scenario: "📱 Instagram DM from a brand account: \"Congratulations! You've won our $500 giveaway! Click this link to claim your prize: bit.ly/win500now\"",
        options: [
          { text: "This is a scam", correct: true, feedback: "Correct! Real brands announce winners publicly and don't use shortened links in DMs. Also check: is this the verified brand account (blue checkmark)?" },
          { text: "I did enter a giveaway recently", correct: false, feedback: "Even if you entered a giveaway, legitimate brands announce winners publicly and never use URL shorteners in DMs. Check for the verification badge and contact the brand through their official website." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 Someone on a Facebook group you're in comments on your post with helpful advice about a topic you asked about.",
        options: [
          { text: "Normal community interaction", correct: true, feedback: "Correct! This is normal social media behavior. People helping in groups they're part of is fine. Just be cautious if they then DM you with links or money requests." },
          { text: "They might be targeting me", correct: false, feedback: "This is normal! Helpful comments in groups are standard social media. Only be cautious if they follow up with unsolicited DMs containing links or requests." },
        ],
      },
      {
        id: "q4",
        scenario: "📱 A TikTok account claiming to be Elon Musk DMs you about a 'special crypto opportunity' just for his followers.",
        options: [
          { text: "This is an impersonation scam", correct: true, feedback: "Correct! Celebrities and billionaires do not DM random people about investment opportunities. This is a very common impersonation scam on every platform." },
          { text: "It could be real — he does talk about crypto", correct: false, feedback: "Elon Musk (and every other celebrity) does NOT DM random people about crypto. These impersonation accounts exist on every platform and are always scams." },
        ],
      },
      {
        id: "q5",
        scenario: "📱 A classmate you know in real life tags you in a post saying \"OMG check out these amazing deals!\" with a link to an unknown website.",
        options: [
          { text: "Their account may be hacked", correct: true, feedback: "Good thinking! When real friends post unusual promotional content, their account may be compromised. Message them through another channel to check." },
          { text: "They're just sharing a deal", correct: false, feedback: "When friends suddenly start posting promotional links, their account may be hacked. The scammer uses their trusted account to spread malicious links. Verify through text or in person." },
        ],
      },
      {
        id: "q6",
        scenario: "📹 A family member shares a video on Facebook of a famous Canadian politician endorsing a new investment platform. The politician is speaking directly to camera and it looks completely real.",
        options: [
          { text: "This is likely a deepfake video scam", correct: true, feedback: "Correct! Deepfake technology can create realistic videos of anyone — including politicians and celebrities — endorsing products they have never heard of. Always check the original source. If a politician endorsed something real, it would be on official news sites, not just social media ads." },
          { text: "If they are on video it must be real", correct: false, feedback: "Deepfake videos can make anyone appear to say anything. Scammers create fake endorsement videos of trusted public figures to promote fraudulent investments. Always verify through official news sources before believing video endorsements shared on social media." },
        ],
      },
      {
        id: "q7",
        scenario: "📹 Your close friend video-calls you on WhatsApp. It looks and sounds exactly like them. They say they're stuck abroad and need you to e-Transfer $1,500 for an emergency flight home. But when you ask about something only they would know, they dodge the question.",
        options: [
          { text: "This could be a deepfake video call — verify through another channel before sending money", correct: true, feedback: "Correct! Deepfake video calls can now be generated in real time using a single photo of someone's face. If anything feels off — dodging personal questions, unusual urgency, or unexpected money requests — hang up and contact your friend through a different method like calling their phone number directly or texting them separately." },
          { text: "I can see their face on video so it must be them", correct: false, feedback: "Real-time deepfake video is now accessible to scammers. They can hijack or fake a video call using AI trained on your friend's photos from social media. Always verify through a separate channel — call their real phone number or ask a question only the real person could answer. Social media fraud cost Canadians over $120 million in 2023." },
        ],
      },
      {
        id: "q8",
        scenario: "📱 A verified Instagram account with a blue checkmark DMs you: \"Hey! I have 2 extra Drake concert tickets for tonight — $150 each, way below face value. E-Transfer only, first come first served.\" The account has 45,000 followers and posts that look legitimate.",
        options: [
          { text: "This is likely a scam — do not send money via e-Transfer for tickets from a stranger", correct: true, feedback: "Correct! Blue checkmarks can be purchased on most platforms now and do not guarantee trustworthiness. Scammers create or buy verified accounts to sell fake tickets, especially for sold-out events. Once you send an e-Transfer, the money is gone. Buy tickets only through official platforms like Ticketmaster or verified resale sites that offer buyer protection." },
          { text: "The blue checkmark and followers mean the account is trustworthy", correct: false, feedback: "Blue checkmarks can now be purchased on Instagram, X, and Facebook — they no longer mean the account is verified as authentic. Scammers invest in followers and checkmarks to look credible. Never send e-Transfers to strangers for event tickets. Use official ticket platforms with buyer protection — if the deal sounds too good, it is." },
        ],
      },
      {
        id: "q9",
        scenario: "📱 You post regularly on Reddit using an anonymous username. You never share your real name. One day, someone DMs you: \"Hey [your real name], interesting post about your neighbourhood.\" They figured out who you are from your writing style and the details in your posts — the coffee shop you mentioned, the intersection you complained about, your job industry.",
        options: [
          { text: "This is a real risk — your anonymous posts can be used to identify you", correct: true, feedback: "Correct. A 2025 ETH Zurich study showed AI can match anonymous writing to real identities with 68% accuracy. Small details — your neighbourhood, job, commute, opinions — add up fast. Scammers and stalkers can piece together your identity from posts you thought were anonymous. Review your post history and remove anything that narrows down where you live or work." },
          { text: "If I never shared my real name, no one can find me", correct: false, feedback: "AI-powered de-anonymization can match your writing style and the details you share — neighbourhood landmarks, job references, daily routines — to identify you. A 2025 ETH Zurich study achieved 68% accuracy at this. Your name is not the only thing that identifies you. Review your posts and remove location-specific details." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How to spot fake social media profiles", query: "how to identify fake social media profile 2026" },
      { label: "Deepfake video scams on social media", query: "deepfake video scam social media how to spot 2026" },
      { label: "Privacy settings guide", query: "social media privacy settings guide Facebook Instagram TikTok 2026" },
    ],
    nextModule: { id: "what-to-do", title: "What to Do If You're Scammed" },
    prevModule: { id: "phishing", title: "Phishing Emails, Texts & Fake Sites" },
  },
  "what-to-do": {
    number: 8,
    icon: "🆘",
    title: "What to Do If You've Been Scammed",
    objectives: [
      "After this module, you will be able to take the exact right steps immediately after being scammed",
      "After this module, you will be able to contact your bank and credit card company to freeze accounts and reverse charges",
      "After this module, you will be able to report scams to the CAFC, police, and both Canadian credit bureaus",
      "After this module, you will be able to help a friend or family member recover from a scam without blame or shame",
    ],
    videoId: "Rlfsm8Y-ZCE",
    videoTitle: "How CBC tracked down CRA scammers (The Investigators)",
    videoSource: "CBC News",
    keyPoints: [
      "STOP all contact with the scammer immediately — do not send more money, even if they threaten you",
      "Call your bank or card issuer RIGHT AWAY — they may be able to reverse charges or freeze your account before the money is gone",
      "Change passwords on all important accounts — email first, then banking, then social media — using a device you trust",
      "Enable two-factor authentication on every account that supports it — this makes it much harder for scammers to break in even if they have your password",
      "Report to the CAFC by calling 1-888-495-8501 or visiting antifraudcentre-centreantifraude.ca — your report helps them track patterns and warn others",
      "File a police report with your local force — even if they cannot recover the funds, the record matters for insurance claims and investigations",
      "Place fraud alerts with both credit bureaus — Equifax at 1-800-465-7166 and TransUnion at 1-800-663-9980 — this makes it harder for scammers to open accounts in your name",
      "Only 5 to 10 percent of fraud victims in Canada report to the CAFC — every unreported scam lets criminals keep operating, and the CAFC managed to freeze just $2.9 million across 40 cases in 2022",
      "Credit bureau disputes after identity theft can drag on for 18 months or more — one Edmonton victim spent that long fighting $20,000 in fraudulent accounts through Equifax and TransUnion before their credit was restored",
      "A retired teacher in Hamilton lost $90,000 to a romance scam but was afraid to report it out of embarrassment — when she finally did, the RCMP connected her case to a larger fraud ring",
      "Do not be ashamed — scammers are skilled criminals who target people of all ages, incomes, and education levels, and reporting helps stop them",
      "If you shared crypto wallet keys or a seed phrase, transfer any remaining funds to a brand-new wallet immediately — the old wallet is permanently compromised",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "😰 You just realized you sent $500 in gift cards to a scammer pretending to be your grandchild. What should you do FIRST?",
        options: [
          { text: "Call the gift card company", correct: true, feedback: "Yes! Contact the gift card company immediately — they may be able to freeze the cards if the scammer hasn't used them yet. Then report to CAFC and police." },
          { text: "Wait and see if they call back", correct: false, feedback: "Don't wait! Call the gift card company right away — if the cards haven't been redeemed yet, they might be able to freeze them. Every minute counts." },
        ],
      },
      {
        id: "q2",
        scenario: "😰 You gave a \"tech support\" caller remote access to your computer and they asked for your banking login. What steps do you take?",
        options: [
          { text: "Disconnect internet, change passwords, call bank, scan for malware", correct: true, feedback: "Perfect order! Disconnect from the internet first (unplug or turn off WiFi), then use a different device to change your banking password, call your bank, and run a malware scan." },
          { text: "Just change your banking password", correct: false, feedback: "Changing your password is important but not enough. You need to: 1) Disconnect from internet, 2) Change ALL passwords from a different device, 3) Call your bank, 4) Run a full malware scan." },
        ],
      },
      {
        id: "q3",
        scenario: "😰 You clicked a link in a phishing text and entered your credit card number on a fake site. What now?",
        options: [
          { text: "Call your credit card company to report fraud and request a new card", correct: true, feedback: "Exactly right! Your card company can cancel the card and reverse fraudulent charges. Also change your online passwords and report to CAFC." },
          { text: "Monitor your statements and see if anything suspicious appears", correct: false, feedback: "Don't wait for fraud to appear — call your card company NOW to cancel the compromised card and get a new one. The scammer has your full card number." },
        ],
      },
      {
        id: "q4",
        scenario: "A friend is embarrassed about being scammed and doesn't want to report it. What should you tell them?",
        options: [
          { text: "Reporting helps protect others — and anyone can be targeted", correct: true, feedback: "Exactly! Reporting to CAFC helps them track scam patterns and warn others. Remind your friend that scammers are professionals — there's no shame in being targeted." },
          { text: "It's their choice — respect their privacy", correct: false, feedback: "While it is their choice, gently encourage reporting. Every unreported scam lets the scammer continue targeting others. CAFC reports are confidential." },
        ],
      },
      {
        id: "q5",
        scenario: "After being scammed, which of these should you do?",
        options: [
          { text: "Place fraud alerts with Equifax AND TransUnion", correct: true, feedback: "Yes! Contact both credit bureaus: Equifax (1-800-465-7166) and TransUnion (1-800-663-9980). A fraud alert makes it harder for scammers to open accounts in your name." },
          { text: "Only contact one credit bureau — they share information", correct: false, feedback: "Contact BOTH bureaus to be safe. While they may share some data, placing alerts with both ensures complete coverage. Equifax: 1-800-465-7166, TransUnion: 1-800-663-9980." },
        ],
      },
      {
        id: "q6",
        scenario: "😰 You sent Bitcoin to a scammer and also shared your wallet's seed phrase with them when they said they needed it to \"verify your account.\" What should you do?",
        options: [
          { text: "Create a brand-new wallet and move any remaining funds there immediately", correct: true, feedback: "Correct! A seed phrase gives full control of your wallet. Anyone with it can drain your funds at any time. Create a new wallet on a trusted device, transfer any remaining crypto there, and never use the old wallet again. Then report to the CAFC and local police." },
          { text: "Change your wallet password — that should be enough", correct: false, feedback: "A seed phrase overrides any password. Anyone with your seed phrase has permanent access to that wallet. You must create a brand-new wallet, move remaining funds, and abandon the compromised one entirely. Report to the CAFC and police." },
        ],
      },
      {
        id: "q7",
        scenario: "😰 During a phone scam, you gave the caller your Social Insurance Number (SIN) before realizing it was fraud. What should you do immediately?",
        options: [
          { text: "Contact both credit bureaus, report to Service Canada, file a police report, and monitor your credit", correct: true, feedback: "Correct! A compromised SIN is serious. Contact Equifax (1-800-465-7166) and TransUnion (1-800-663-9980) to place fraud alerts. Call Service Canada at 1-866-274-6627 to report the compromised SIN. File a police report and report to the CAFC. Monitor your credit reports closely for at least 6 years — fraudsters may wait months before using a stolen SIN." },
          { text: "There's nothing you can do once someone has your SIN", correct: false, feedback: "You absolutely can take action. Place fraud alerts with Equifax and TransUnion immediately. Report to Service Canada at 1-866-274-6627 — in severe cases, they may issue a new SIN. File a police report and CAFC report. Check your credit reports regularly. Acting fast limits the damage a stolen SIN can cause." },
        ],
      },
      {
        id: "q8",
        scenario: "😰 A stranger online tricked you into sharing an intimate image and is now threatening to send it to your family and coworkers unless you pay $3,000 in Bitcoin. You feel panicked and ashamed. What should you do?",
        options: [
          { text: "Do NOT pay — block the scammer, save evidence, and report to police and the CAFC", correct: true, feedback: "Correct! This is sextortion — a crime, and you are the victim. Paying almost always leads to more demands, not silence. Screenshot the threats, block the scammer on all platforms, and report to your local police and the CAFC at 1-888-495-8501. If you are under 18, also report to cybertip.ca. You can contact needhelpnow.ca for support. There is no shame — sextortion affects thousands of Canadians every year." },
          { text: "Pay quickly so they don't follow through on the threat", correct: false, feedback: "Do NOT pay. In most cases, paying leads to more demands for more money. Block the scammer, screenshot all threats as evidence, and report to police and the CAFC. If you are under 18, report to cybertip.ca. Visit needhelpnow.ca for support. Remember: you are the victim of a crime, and help is available. The RCMP reports sextortion complaints have increased over 300% in recent years." },
        ],
      },
      {
        id: "q9",
        scenario: "😰 You paid an immigration consultant $15,000 to file your permanent residency application. Six months later, you discover they were never registered with the CICC and never filed anything. Your work permit expires in 60 days. What should you do?",
        options: [
          { text: "Report to the CICC, file a CAFC complaint, contact a licensed consultant or immigration lawyer immediately", correct: true, feedback: "Correct. File a complaint with the CICC at college-ic.ca — they investigate unlicensed consultants and have issued fines up to $66,000. Report to the CAFC at 1-888-495-8501 and your local police. Then contact a CICC-registered consultant or immigration lawyer urgently to assess your options before your work permit expires. Keep all receipts and communications as evidence." },
          { text: "There is nothing you can do — the money is gone and your status is at risk", correct: false, feedback: "You can take action. Report the consultant to the CICC — they have the power to investigate and fine unlicensed operators. File with the CAFC and police. Most importantly, contact a legitimate immigration lawyer or CICC-registered consultant right away. Your immigration status may still be salvageable, but you need qualified help fast." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "What to do after being scammed in Canada", query: "what to do after scam Canada steps recovery 2026" },
      { label: "How to report fraud to CAFC", query: "CAFC fraud report process Canada 2026" },
      { label: "How to place a credit freeze in Canada", query: "credit freeze fraud alert Canada Equifax TransUnion 2026" },
    ],
    nextModule: { id: "crypto-basics", title: "Crypto Basics — Without the Jargon" },
    prevModule: { id: "social-media", title: "Social Media Red Flags" },
  },
  "crypto-basics": {
    number: 9,
    icon: "🪙",
    title: "Crypto Basics — Without the Jargon",
    objectives: [
      "Understand what cryptocurrency actually is — in plain English, no tech background needed",
      "Know the difference between Bitcoin, Ethereum, and other common coins",
      "Set up and use a crypto wallet safely — and understand what a wallet really does",
      "Recognize which crypto platforms are regulated in Canada and how to verify them",
    ],
    videoId: "rYQgy8QDEBI",
    videoTitle: "How cryptocurrency actually works (3Blue1Brown)",
    videoSource: "3Blue1Brown",
    keyPoints: [
      "Cryptocurrency is digital money that works without a bank in the middle — instead of TD or RBC verifying your transaction, a network of computers does it",
      "Bitcoin was the first cryptocurrency — created in 2009, it is the most widely used and has a 15-year track record of working as designed",
      "You do not need to buy a whole Bitcoin — you can buy $20 worth, just like you do not need to buy an entire gold bar to own gold",
      "A crypto wallet is not like a physical wallet — it does not actually hold your coins, it holds the keys that prove the coins are yours, like a deed proves you own a house",
      "There are two types of wallets — hot wallets are apps on your phone or computer that connect to the internet, and cold wallets are physical devices that stay offline and are much harder to hack",
      "In Canada, legitimate crypto exchanges must register with provincial securities regulators — Wealthsimple Crypto, Bitbuy, Newton, Shakepay, and Coinbase (registered as a Restricted Dealer in 2024) are all registered",
      "The CAFC reported $224 million in crypto investment losses in 2024, with another $103 million in the first half of 2025 alone — and 48 Ontario platforms were registered with the CSA by 2025, so there is no excuse to use an unregistered one",
      "Check any exchange at aretheyregistered.ca or securities-administrators.ca before sending money — if they are not on the list, do not use them, no matter how professional the website looks",
      "Over 2.5 million Canadians own cryptocurrency according to the Bank of Canada's 2023 survey — this is not a fringe technology, it is part of the financial system now",
      "Crypto prices go up and down — sometimes dramatically — and that is normal, not a sign that something is broken or a scam, the same way stock prices move every day",
      "You will never need to send crypto to someone to 'verify' your account, 'unlock' your funds, or 'prove' your identity — anyone asking you to do this is trying to steal from you",
      "The biggest risk with crypto is not the technology — it is people who lie about the technology to take your money",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "🪙 Your nephew says he bought $50 of Bitcoin. You thought you had to buy a whole coin. Is he wrong?",
        options: [
          { text: "No — you can buy any dollar amount of Bitcoin", correct: true, feedback: "Correct! Bitcoin can be divided into tiny fractions. Buying $50 of Bitcoin is completely normal — like buying $50 of gold without needing an entire bar." },
          { text: "You need to buy at least one whole Bitcoin", correct: false, feedback: "Bitcoin can be divided into 100 million pieces (called satoshis). You can buy $5, $50, or $5,000 worth — whatever you are comfortable with." },
        ],
      },
      {
        id: "q2",
        scenario: "🪙 You hear that cryptocurrency is 'not regulated' in Canada. Is that true?",
        options: [
          { text: "Not exactly — crypto exchanges must register with securities regulators in Canada", correct: true, feedback: "Correct! While crypto itself is decentralized, exchanges operating in Canada must register with provincial regulators. Wealthsimple Crypto, Newton, Bitbuy, and Coinbase are all registered. Check any platform at securities-administrators.ca." },
          { text: "True — there are no rules for crypto in Canada", correct: false, feedback: "Canada actually has clear rules. Crypto exchanges must register with provincial securities regulators. The CSA, FINTRAC, and OSC all oversee crypto activity. Unregistered platforms are breaking the law." },
        ],
      },
      {
        id: "q3",
        scenario: "🪙 Someone tells you that because Bitcoin dropped 20% last month, it must be a scam. What do you think?",
        options: [
          { text: "Price drops are normal — stocks drop too and nobody calls them scams", correct: true, feedback: "Exactly! Bitcoin has dropped 20% or more dozens of times since 2009 and recovered every time. Volatility is a feature of young markets, not evidence of fraud. The stock market crashes too." },
          { text: "A 20% drop sounds like something is wrong", correct: false, feedback: "Large price swings are normal for crypto — and for stocks, oil, and gold. Bitcoin has dropped 50%+ multiple times and always recovered. A price drop is not the same as a scam." },
        ],
      },
      {
        id: "q4",
        scenario: "🪙 You want to buy crypto in Canada. Which of these is the safest approach?",
        options: [
          { text: "Use a platform registered with Canadian securities regulators like Wealthsimple or Newton", correct: true, feedback: "Correct! Registered platforms must follow Canadian investor protection rules, hold funds securely, and comply with FINTRAC anti-money-laundering laws. Always verify at securities-administrators.ca." },
          { text: "Search Google for 'best crypto exchange' and pick the top result", correct: false, feedback: "Google ads can be bought by anyone — including scammers. The top search result might be a paid ad for a fraudulent platform. Always verify registration with the CSA at securities-administrators.ca before sending money." },
        ],
      },
      {
        id: "q5",
        scenario: "🪙 Your friend says she keeps her crypto in a 'cold wallet' she bought from Ledger. Is that smart?",
        options: [
          { text: "Yes — a hardware wallet from a reputable company is the most secure option", correct: true, feedback: "Correct! Cold wallets like Ledger and Trezor store your keys offline, making them nearly impossible to hack remotely. For any significant amount of crypto, a hardware wallet is the gold standard." },
          { text: "Keeping money on a device sounds risky — better to leave it on an exchange", correct: false, feedback: "Exchanges can be hacked — several major ones have lost customer funds. A hardware wallet gives you direct control. The crypto saying is 'not your keys, not your coins.' For large amounts, a hardware wallet is safer." },
        ],
      },
      {
        id: "q6",
        scenario: "🪙 A website called 'CryptoCanadaTrades.com' says they are 'fully licensed in Canada' and offers 15% monthly returns. What do you do?",
        options: [
          { text: "Check securities-administrators.ca — if they are not listed, do not use them", correct: true, feedback: "Correct! Any platform can claim to be licensed. Only trust what you can verify. 15% monthly returns is also a massive red flag — that would be 180% per year, which no legitimate investment offers." },
          { text: "The website says it is licensed so it must be safe", correct: false, feedback: "Anyone can write 'fully licensed' on a website. Always verify at securities-administrators.ca. And 15% monthly returns is impossible to sustain legitimately — this is almost certainly a scam." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How to buy crypto safely in Canada", query: "how to buy cryptocurrency safely Canada 2026 registered exchange" },
      { label: "What is a crypto wallet", query: "crypto wallet explained beginners hot wallet cold wallet" },
      { label: "Is crypto regulated in Canada", query: "cryptocurrency regulation Canada CSA FINTRAC 2026" },
    ],
    nextModule: { id: "crypto-safety", title: "Protecting Your Crypto" },
    prevModule: { id: "what-to-do", title: "What to Do If You're Scammed" },
  },
  "crypto-safety": {
    number: 10,
    icon: "🛡️",
    title: "Protecting Your Crypto — Scams, Wallets & Red Flags",
    objectives: [
      "Identify the 5 most common crypto scams targeting Canadians right now",
      "Protect your wallet, seed phrase, and accounts with proper security practices",
      "Know exactly what to do if you think you have been scammed with crypto",
      "Evaluate whether a crypto opportunity is legitimate or a trap — using a simple checklist",
    ],
    videoId: "s8V3_7AmFcg",
    videoTitle: "Pig Butchering: How Online Romance Scams Steal Billions (CNBC)",
    videoSource: "CNBC",
    keyPoints: [
      "The #1 crypto scam in Canada is the romance-investment hybrid — a stranger builds a relationship with you online, then introduces a 'trading platform' that shows fake profits until you try to withdraw",
      "The FBI calls it 'pig butchering' because scammers spend weeks or months fattening you with fake gains before taking everything — average losses are $170,000 per victim",
      "Your seed phrase — the 12 or 24 words you received when you set up your wallet — is the master key to everything you own, and stolen phrases accounted for an estimated 20% of 2024's $9.3 billion in IC3-reported crypto thefts",
      "Write your seed phrase on paper and store it somewhere safe like a fireproof box — never save it in a screenshot, a notes app, an email, or a cloud drive where it can be hacked",
      "No legitimate exchange, wallet, or support agent will ever ask for your seed phrase — not Coinbase, not MetaMask, not anyone, and there are zero exceptions to this rule",
      "Fake crypto exchanges look professional — they have live charts, customer support chatbots, and mobile apps, but the balance you see is not real and you will never be able to withdraw",
      "Bitcoin ATM scams are surging in Canada — the CAFC reported $14.2 million in ATM-specific losses in 2024, with FINTRAC flagging the country's 3,500-plus machines as a top money laundering vector",
      "If someone says you need to 'act now' or 'the opportunity closes today,' that pressure is the scam — real investments do not have countdown timers",
      "The FBI's IC3 reported $5.6 billion in crypto fraud losses in 2023 — a 45% jump from the year before — and blockchain investigator ZachXBT tracked over $65 million stolen from Coinbase users alone in just December 2024 through January 2025",
      "Two-factor authentication should be on every crypto account — use an authenticator app like Google Authenticator or Authy, never SMS, because SIM swap attacks can hijack your text messages",
      "If you sent crypto to a scammer, report to the CAFC at 1-888-495-8501, your local police, and the exchange you used to buy the crypto — exchanges can sometimes flag or freeze receiving wallets",
      "If you shared your seed phrase, create a brand-new wallet on a clean device and move any remaining funds immediately — the compromised wallet is permanently unsafe",
      "Use the TrustChekr 5-point checklist before sending crypto anywhere — Is the platform registered? Do they guarantee returns? Did you find them through an unsolicited message? Are they rushing you? Did anyone ask for your seed phrase? If any answer is yes, stop.",
    ],
    quiz: [
      {
        id: "q1",
        scenario: "💕 Someone you met on Hinge three weeks ago suggests you both try a 'new trading app' they have been using. They show you screenshots of their profits.",
        options: [
          { text: "This is a romance-investment scam (pig butchering)", correct: true, feedback: "Correct! This is the textbook pattern — build trust through a dating app, then introduce a fake trading platform. The screenshots are fake. The app is fake. The 'profits' are fake. The FBI reports average losses of $170,000." },
          { text: "They are just sharing something that works for them", correct: false, feedback: "This is the #1 crypto scam worldwide — called 'pig butchering.' Someone you met online introduces a trading platform that shows fake profits. When you try to withdraw, they ask for 'fees' and eventually disappear with everything." },
        ],
      },
      {
        id: "q2",
        scenario: "🔐 A pop-up appears when you open MetaMask saying 'Your wallet needs to be re-verified. Enter your 12-word recovery phrase to continue.'",
        options: [
          { text: "This is a phishing attack — never enter your seed phrase", correct: true, feedback: "Correct! MetaMask will never ask for your seed phrase in a pop-up. This is a phishing page designed to steal your wallet. Close it immediately. If in doubt, go to metamask.io directly." },
          { text: "MetaMask sometimes requires re-verification", correct: false, feedback: "MetaMask NEVER asks you to re-enter your seed phrase in a pop-up or website. This is a phishing attack. Anyone who gets your 12 words can steal everything in your wallet instantly." },
        ],
      },
      {
        id: "q3",
        scenario: "📱 You receive a text saying 'Your Coinbase account has been locked. Call 1-800-XXX-XXXX to restore access.'",
        options: [
          { text: "This is a scam — Coinbase does not send texts with phone numbers to call", correct: true, feedback: "Correct! Coinbase communicates through their app and email, not unsolicited texts with phone numbers. If you call that number, a scammer will try to get your login credentials or seed phrase. Log into Coinbase directly through the app." },
          { text: "I should call to make sure my account is safe", correct: false, feedback: "Do NOT call the number. Coinbase does not send texts asking you to call a phone number. The person on the other end is a scammer. Open the Coinbase app directly or go to coinbase.com to check your account." },
        ],
      },
      {
        id: "q4",
        scenario: "🏧 Your phone rings. The caller says they are from the CRA and you owe $4,200 in taxes. They say you can pay immediately at a Bitcoin ATM to avoid arrest.",
        options: [
          { text: "This is a scam — the CRA never asks for payment via Bitcoin ATM", correct: true, feedback: "Correct! The CRA will never demand payment by Bitcoin, gift cards, or cryptocurrency of any kind. They communicate through My Account and mail. Hang up and report to the CAFC." },
          { text: "The CRA might use new payment methods now", correct: false, feedback: "The CRA accepts payment through banks, online banking, and cheques. They will NEVER ask you to go to a Bitcoin ATM. This is one of the most common phone scams in Canada — hang up immediately." },
        ],
      },
      {
        id: "q5",
        scenario: "📈 A crypto exchange you have never heard of is advertising '25% guaranteed monthly returns' on Instagram with celebrity endorsement videos.",
        options: [
          { text: "This is a scam — guaranteed returns do not exist and the celebrity videos are likely deepfakes", correct: true, feedback: "Correct! No legitimate investment guarantees 25% monthly returns (that would be 300% per year). Celebrity endorsement videos are increasingly deepfakes — AI-generated fakes. Check securities-administrators.ca for any platform before investing." },
          { text: "High returns are possible in crypto", correct: false, feedback: "While crypto can have large price swings, no one can GUARANTEE returns. '25% guaranteed' is mathematically impossible to sustain. The celebrity endorsements are likely deepfakes. This is a classic fraud scheme." },
        ],
      },
      {
        id: "q6",
        scenario: "✅ You want to send Bitcoin to a friend to split a dinner bill. You use Shakepay — a platform registered with Canadian regulators. Is this safe?",
        options: [
          { text: "Yes — using a registered Canadian platform for a transaction you initiated is fine", correct: true, feedback: "Correct! Shakepay is registered with securities regulators and FINTRAC. You initiated the transaction, you know the recipient, and the amount is reasonable. This is normal, safe crypto usage." },
          { text: "Sending crypto is always risky", correct: false, feedback: "Sending crypto through a registered platform to someone you know is no different from sending an e-Transfer. The risk comes from sending to strangers or unregistered platforms — not from the technology itself." },
        ],
      },
    ],
    grokipediaQueries: [
      { label: "How pig butchering crypto scams work", query: "pig butchering romance crypto scam how it works 2026" },
      { label: "How to protect your seed phrase", query: "seed phrase security best practices crypto wallet 2026" },
      { label: "Bitcoin ATM scams in Canada", query: "bitcoin ATM scam Canada CRA fraud 2026" },
    ],
    nextModule: null,
    prevModule: { id: "crypto-basics", title: "Crypto Basics — Without the Jargon" },
  },
};

// ── Types ────────────────────────────────────────────────────
interface QuizOption { text: string; correct: boolean; feedback: string; }
interface QuizItem { id: string; scenario: string; options: QuizOption[]; }
interface GrokQuery { label: string; query: string; }
interface ModuleLink { id: string; title: string; }
interface ModuleData {
  number: number; icon: string; title: string; objectives: string[];
  videoId: string; videoTitle: string; videoSource: string;
  keyPoints: string[]; quiz: QuizItem[];
  grokipediaQueries: GrokQuery[];
  nextModule: ModuleLink | null; prevModule: ModuleLink | null;
}

// ── Quiz Component ───────────────────────────────────────────
function SpotTheScam({ items }: { items: QuizItem[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = items[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (item.options[idx].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= items.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (finished) {
    return (
      <div className="p-5 rounded-xl border text-center" style={{ borderColor: "var(--tc-safe)", background: "#eafaf1" }}>
        <p className="text-3xl mb-2">🎉</p>
        <p className="text-xl font-bold" style={{ color: "var(--tc-safe)" }}>
          You got {score} out of {items.length} correct!
        </p>
        <p className="mt-2" style={{ color: "var(--tc-text-muted)" }}>
          {score === items.length ? "Perfect score! You're scam-savvy." : score >= 3 ? "Great job! You're getting better at spotting scams." : "Keep learning — every bit of awareness helps protect you."}
        </p>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false); }}
          className="mt-4 px-6 py-2 rounded-lg border font-medium cursor-pointer"
          style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium" style={{ color: "var(--tc-text-muted)" }}>
          Question {current + 1} of {items.length}
        </span>
        <span className="text-sm font-medium" style={{ color: "var(--tc-safe)" }}>
          Score: {score}/{current}
        </span>
      </div>

      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
        <p className="font-semibold text-lg" style={{ color: "var(--tc-text-main)" }}>{item.scenario}</p>
      </div>

      <div className="flex flex-col gap-2">
        {item.options.map((opt, idx) => {
          let borderColor = "var(--tc-border)";
          let bg = "var(--tc-surface)";
          if (selected !== null) {
            if (opt.correct) { borderColor = "var(--tc-safe)"; bg = "#eafaf1"; }
            else if (idx === selected && !opt.correct) { borderColor = "var(--tc-danger)"; bg = "#fdedec"; }
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="p-4 rounded-xl border text-left font-medium cursor-pointer transition-all"
              style={{ borderColor, background: bg, color: "var(--tc-text-main)" }}
            >
              {opt.text}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="p-4 rounded-xl border" style={{ borderColor: item.options[selected].correct ? "var(--tc-safe)" : "var(--tc-warning)", background: item.options[selected].correct ? "#eafaf1" : "#fef9e7" }}>
          <p className="font-semibold mb-1">{item.options[selected].correct ? "✅ Correct!" : "⚠️ Not quite"}</p>
          <p>{item.options[selected].feedback}</p>
        </div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl font-semibold cursor-pointer"
          style={{ background: "var(--tc-primary)", color: "white" }}
        >
          {current + 1 >= items.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ── Module Page ──────────────────────────────────────────────
export default function ModulePage() {
  const params = useParams();
  const moduleId = params.module as string;
  const mod = modules[moduleId];
  const { progress, setModuleStatus } = useAcademyProgress();
  const academyModuleId = slugToModuleId(moduleId);
  const currentStatus = academyModuleId && progress ? progress.modules[academyModuleId] : "not_started";

  useEffect(() => {
    if (mod && academyModuleId) {
      // Auto-mark as in_progress when viewing (won't downgrade completed)
      setModuleStatus(academyModuleId, "in_progress");
    }
  }, [mod, academyModuleId, setModuleStatus]);

  if (!mod) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">🚧</p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--tc-primary)" }}>Coming Soon</h1>
        <p style={{ color: "var(--tc-text-muted)" }}>This module is still being built. Check back soon!</p>
        <Link href="/academy" className="mt-4 inline-block underline" style={{ color: "var(--tc-primary)" }}>
          ← Back to Academy
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Link href="/academy" className="text-sm underline" style={{ color: "var(--tc-text-muted)" }}>
        ← Back to Academy
      </Link>

      <div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--tc-primary-soft)", color: "var(--tc-primary)" }}>
          Module {mod.number}
        </span>
        <h1 className="text-2xl font-bold mt-2" style={{ color: "var(--tc-primary)" }}>
          {mod.icon} {mod.title}
        </h1>
      </div>

      {/* Objectives */}
      <div className="p-4 rounded-xl border" style={{ borderColor: "var(--tc-accent)", background: "#eaf2f8" }}>
        <p className="font-semibold mb-2" style={{ color: "var(--tc-accent)" }}>📚 What you'll learn</p>
        <ul className="flex flex-col gap-1">
          {mod.objectives.map((obj, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span>✓</span><span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Video */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>🎬 Watch: {mod.videoTitle}</h2>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--tc-border)", aspectRatio: "16/9" }}>
          <iframe
            src={`https://www.youtube.com/embed/${mod.videoId}`}
            title={mod.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--tc-text-muted)" }}>
          Source: {mod.videoSource}
        </p>
      </section>

      {/* Key Points */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>📌 Key Takeaways</h2>
        <div className="flex flex-col gap-2">
          {mod.keyPoints.map((point, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
              <span className="font-bold" style={{ color: "var(--tc-primary)" }}>{i + 1}</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>🧩 Spot the Scam</h2>
        <p className="text-sm mb-4" style={{ color: "var(--tc-text-muted)" }}>
          Can you tell which of these are scams? Tap your answer to find out.
        </p>
        <SpotTheScam items={mod.quiz} />
      </section>

      {/* Grokipedia / Research Links */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>🔍 Learn More</h2>
        <p className="text-sm mb-3" style={{ color: "var(--tc-text-muted)" }}>
          Want to dig deeper? Search these topics for more information:
        </p>
        <div className="flex flex-col gap-2">
          {mod.grokipediaQueries.map((q, i) => (
            <a
              key={i}
              href={`https://www.google.com/search?q=${encodeURIComponent(q.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all"
              style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
            >
              <span>🔍</span>
              <span className="font-medium" style={{ color: "var(--tc-primary)" }}>{q.label}</span>
              <span className="ml-auto text-sm" style={{ color: "var(--tc-text-muted)" }}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section>
        <h2 className="text-lg font-bold mb-3" style={{ color: "var(--tc-text-main)" }}>📄 Resources</h2>
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-lg border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
            <p className="font-medium">📋 Printable Checklist</p>
            <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>Keep this by your phone or computer — coming soon</p>
          </div>
          <div className="p-3 rounded-lg border" style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}>
            <p className="font-medium">👨‍👩‍👧 Family Discussion Guide</p>
            <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>How to talk about this topic with your family — coming soon</p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex gap-3 mt-4">
        {mod.prevModule && (
          <Link
            href={`/academy/${mod.prevModule.id}`}
            className="flex-1 p-4 rounded-xl border text-center font-medium cursor-pointer"
            style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-main)" }}
          >
            ← {mod.prevModule.title}
          </Link>
        )}
        {mod.nextModule && (
          <Link
            href={`/academy/${mod.nextModule.id}`}
            className="flex-1 p-4 rounded-xl text-center font-semibold cursor-pointer"
            style={{ background: "var(--tc-primary)", color: "white" }}
          >
            Next: {mod.nextModule.title} →
          </Link>
        )}
      </div>

      {/* Back to Academy */}
      <Link
        href="/academy"
        className="w-full py-3 rounded-xl border-2 text-center font-medium"
        style={{ borderColor: "var(--tc-primary)", color: "var(--tc-primary)" }}
      >
        Back to All Modules
      </Link>

      {/* Mark as Completed */}
      {academyModuleId && (
        <div className="flex items-center justify-between p-4 rounded-xl border" style={{ borderColor: currentStatus === "completed" ? "var(--tc-safe)" : "var(--tc-border)", background: currentStatus === "completed" ? "#eafaf1" : "var(--tc-surface)" }}>
          {currentStatus === "completed" ? (
            <p className="font-semibold" style={{ color: "var(--tc-safe)" }}>
              ✅ You've completed this module!
            </p>
          ) : (
            <>
              <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>
                Finished the quiz? Mark this module as done.
              </p>
              <button
                onClick={() => setModuleStatus(academyModuleId, "completed")}
                className="px-4 py-2 rounded-lg font-semibold cursor-pointer"
                style={{ background: "var(--tc-safe)", color: "white" }}
              >
                ✅ Mark as Completed
              </button>
            </>
          )}
        </div>
      )}

      {/* Grokipedia */}
      <GrokipediaLink query={mod.title} label={`Research "${mod.title}" on Grokipedia`} />

      {/* Report Form */}
      <ReportForm sourcePage="academy_module" sourceRef={moduleId} />

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: "var(--tc-text-muted)" }}>
        This educational content is provided as a public service by TrustChekr. It is not legal or financial advice.
        If you believe you are a victim of fraud, contact CAFC at 1-888-495-8501.
      </p>
    </div>
  );
}
