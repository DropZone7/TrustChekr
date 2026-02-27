"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── Module Data ──────────────────────────────────────────────
const modules: Record<string, ModuleData> = {
  "phone-scams": {
    number: 1,
    icon: "📞",
    title: "Phone & Grandparent Scams",
    objectives: [
      "Recognize the \"emergency call\" pattern used in grandparent scams",
      "Know that real emergencies never require gift cards or wire transfers",
      "Learn the one-step verification: hang up and call the person directly",
    ],
    videoId: "uq3KBkHFMBY", // CAFC fraud prevention - replace with best match
    videoTitle: "Protect Yourself From Fraud",
    videoSource: "Canadian Anti-Fraud Centre",
    keyPoints: [
      "Scammers call pretending to be a grandchild, police officer, or lawyer",
      "They create panic with fake emergencies (accident, arrest, hospital)",
      "They demand immediate payment by gift card, wire transfer, or crypto",
      "Real family members can wait for you to verify — scammers can't",
      "The CRA, police, and courts will NEVER call demanding gift cards",
      "Always hang up and call your family member at their REAL number",
      "Set up a family code word that only your real family knows",
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
    ],
    grokipediaQueries: [
      { label: "What is a grandparent scam?", query: "grandparent scam Canada" },
      { label: "How does caller ID spoofing work?", query: "caller ID spoofing how it works" },
      { label: "How to report phone scams in Canada", query: "CAFC phone scam reporting Canada" },
    ],
    nextModule: { id: "bank-cra-scams", title: "Bank & CRA Impersonation" },
    prevModule: null,
  },
  "bank-cra-scams": {
    number: 2,
    icon: "🏦",
    title: "Bank & CRA Impersonation",
    objectives: [
      "Understand that the CRA never threatens arrest by phone or text",
      "Know how to verify a real bank communication from a fake one",
      "Learn the \"hang up and call back\" verification method",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "CRA Scam Awareness",
    videoSource: "Government of Canada",
    keyPoints: [
      "The CRA will NEVER call threatening arrest, demanding gift cards, or asking for crypto",
      "Banks will NEVER ask for your password, PIN, or one-time code by phone/text/email",
      "If a bank texts you, don't click the link — open your banking app directly",
      "Caller ID and email addresses can be faked to look like real bank/CRA numbers",
      "When in doubt: hang up, find the real number (on your card/statement), call back yourself",
      "CRA communicates primarily through My Account (online) and regular mail",
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
    ],
    grokipediaQueries: [
      { label: "How do CRA scams work?", query: "CRA scam Canada 2026" },
      { label: "How to verify CRA communication", query: "how to verify CRA communication legitimate" },
      { label: "Bank phishing in Canada", query: "bank phishing scam Canada" },
    ],
    nextModule: { id: "tech-support-scams", title: "Tech Support & Fake Warnings" },
    prevModule: { id: "phone-scams", title: "Phone & Grandparent Scams" },
  },
  "tech-support-scams": {
    number: 3,
    icon: "💻",
    title: "Tech Support & Fake Warnings",
    objectives: [
      "Recognize fake virus pop-ups and \"your computer is infected\" warnings",
      "Know that Microsoft, Apple, and Google will never call you about viruses",
      "Learn how to safely close a scary pop-up without clicking anything in it",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "Tech Support Scam Awareness",
    videoSource: "Competition Bureau of Canada",
    keyPoints: [
      "Pop-ups saying \"YOUR COMPUTER IS INFECTED\" with a phone number are ALWAYS fake",
      "Microsoft, Apple, and Google will never call you about a virus",
      "Never call a phone number shown in a pop-up warning",
      "If a pop-up won't close: press Ctrl+Alt+Delete (Windows) or Cmd+Q (Mac)",
      "If you gave someone remote access, disconnect from internet immediately",
      "Real antivirus software doesn't display phone numbers in pop-ups",
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
    ],
    grokipediaQueries: [
      { label: "What are tech support scams?", query: "tech support scam how it works" },
      { label: "How to close fake virus popup", query: "how to close fake virus popup safely" },
      { label: "Remote access scam recovery steps", query: "what to do after remote access scam" },
    ],
    nextModule: { id: "romance-scams", title: "Romance & Friendship Scams" },
    prevModule: { id: "bank-cra-scams", title: "Bank & CRA Impersonation" },
  },
  "romance-scams": {
    number: 4,
    icon: "💔",
    title: "Romance & Friendship Scams",
    objectives: [
      "Recognize the pattern: fast love + excuses + money requests = scam",
      "Understand that romance scammers invest weeks or months building trust",
      "Know how to verify someone's identity using reverse image search",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "Romance Scam Awareness",
    videoSource: "Canadian Anti-Fraud Centre",
    keyPoints: [
      "Romance scammers build intense emotional connections over weeks or months before asking for money",
      "They always have excuses for not video calling — military deployment, oil rig, poor internet connection",
      "The first money request is small to test you. It always escalates from there",
      "They move conversations off dating platforms quickly (to WhatsApp, Telegram, or email)",
      "Reverse image search their profile photos — stolen photos from real people are extremely common",
      "Anyone who asks for money, crypto, or gift cards in an online relationship is very likely a scammer",
      "Romance scam victims in Canada lost $50.3 million in 2024 — you are not alone",
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
    ],
    grokipediaQueries: [
      { label: "How do romance scams work?", query: "romance scam red flags patterns" },
      { label: "How to reverse image search", query: "reverse image search dating profile how to" },
      { label: "Romance scam statistics Canada", query: "romance scam losses Canada statistics" },
    ],
    nextModule: { id: "too-good-to-be-true", title: "Lotteries, Fake Jobs & Crypto" },
    prevModule: { id: "tech-support-scams", title: "Tech Support & Fake Warnings" },
  },
  "too-good-to-be-true": {
    number: 5,
    icon: "🎰",
    title: "Lotteries, Fake Jobs & Crypto Scams",
    objectives: [
      "Recognize lottery, prize, and inheritance scams",
      "Spot fake job offers and 'work from home' schemes",
      "Understand basic crypto and investment fraud red flags",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "Too Good to Be True Scams",
    videoSource: "Competition Bureau of Canada",
    keyPoints: [
      "You cannot win a lottery or contest you never entered",
      "Real prizes never require you to pay a 'processing fee' or 'taxes' upfront",
      "Legitimate employers never ask you to pay for training, equipment, or a background check",
      "If investment returns are 'guaranteed,' it's a scam — no investment is risk-free",
      "Cryptocurrency is not regulated like banks — once sent, it's almost impossible to recover",
      "'Inheritance from a distant relative' emails are always scams",
      "If it sounds too good to be true, it is. Every time.",
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
    ],
    grokipediaQueries: [
      { label: "Advance fee fraud explained", query: "advance fee fraud how it works" },
      { label: "Fake job scams in Canada", query: "fake job scam Canada warning signs" },
      { label: "Crypto investment scam red flags", query: "cryptocurrency investment scam warning signs" },
    ],
    nextModule: { id: "phishing", title: "Phishing Emails, Texts & Fake Sites" },
    prevModule: { id: "romance-scams", title: "Romance & Friendship Scams" },
  },
  "phishing": {
    number: 6,
    icon: "🎣",
    title: "Phishing Emails, Texts & Fake Websites",
    objectives: [
      "Check sender email addresses to spot fakes",
      "Learn to hover over links before clicking them",
      "Spot fake websites by checking the URL carefully",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "How to Spot Phishing",
    videoSource: "Government of Canada",
    keyPoints: [
      "Check the ACTUAL email address, not just the display name — 'RBC Security' could be from scammer@gmail.com",
      "Hover over links (don't click!) to see where they really go — the text can say one thing but link to another",
      "Look for typos, odd grammar, and generic greetings like 'Dear Customer' instead of your name",
      "Real companies don't ask you to 'verify your account' through an email link",
      "When in doubt, type the company's website address directly into your browser — never click the email link",
      "Check for the padlock icon AND the correct domain name — scam sites can have padlocks too",
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
    ],
    grokipediaQueries: [
      { label: "How to identify phishing emails", query: "phishing email identification tips" },
      { label: "What is URL spoofing?", query: "URL spoofing fake website how to spot" },
      { label: "How to check if a website is real", query: "how to verify website legitimacy" },
    ],
    nextModule: { id: "social-media", title: "Social Media Red Flags" },
    prevModule: { id: "too-good-to-be-true", title: "Lotteries, Fake Jobs & Crypto" },
  },
  "social-media": {
    number: 7,
    icon: "📱",
    title: "Social Media & Messaging Red Flags",
    objectives: [
      "Recognize fake profiles and impersonation accounts",
      "Understand social engineering through direct messages",
      "Know basic privacy settings to protect yourself",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "Social Media Safety",
    videoSource: "Canadian Centre for Cyber Security",
    keyPoints: [
      "Verify accounts before trusting DMs — check follower count, post history, and account age",
      "Don't share your location, school, workplace, or daily routine with strangers online",
      "'Friend of a friend' requests are often fake — scammers clone real profiles",
      "Free giveaways that ask you to 'click a link' or 'enter your details' are almost always scams",
      "If a celebrity or brand DMs you first, it's almost certainly an impersonator",
      "Report and block suspicious accounts — it protects others too",
      "Review your privacy settings: limit who can see your posts, friends list, and personal info",
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
    ],
    grokipediaQueries: [
      { label: "How to spot fake social media profiles", query: "how to identify fake social media profile" },
      { label: "Social media scam types", query: "social media scams common types 2026" },
      { label: "Privacy settings guide", query: "social media privacy settings guide Facebook Instagram" },
    ],
    nextModule: { id: "what-to-do", title: "What to Do If You're Scammed" },
    prevModule: { id: "phishing", title: "Phishing Emails, Texts & Fake Sites" },
  },
  "what-to-do": {
    number: 8,
    icon: "🆘",
    title: "What to Do If You've Been Scammed",
    objectives: [
      "Know the exact steps to take immediately after being scammed",
      "Understand how to report to CAFC, police, and your bank",
      "Learn about credit monitoring and fraud alerts",
    ],
    videoId: "uq3KBkHFMBY",
    videoTitle: "I've Been Scammed — What Now?",
    videoSource: "Canadian Anti-Fraud Centre",
    keyPoints: [
      "STOP all contact with the scammer immediately",
      "Call your bank or card issuer — they may be able to reverse charges",
      "Change passwords on any affected accounts (email, banking, social media)",
      "Report to CAFC: call 1-888-495-8501 or visit antifraudcentre-centreantifraude.ca",
      "File a police report — even if they can't recover funds, it's on record",
      "Place fraud alerts: Equifax (1-800-465-7166) and TransUnion (1-800-663-9980)",
      "Don't be ashamed — scammers are professionals and anyone can be targeted",
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
    ],
    grokipediaQueries: [
      { label: "What to do after being scammed", query: "what to do after scam Canada steps" },
      { label: "How to report fraud to CAFC", query: "CAFC fraud report process Canada" },
      { label: "How to place a credit freeze in Canada", query: "credit freeze fraud alert Canada Equifax TransUnion" },
    ],
    nextModule: null,
    prevModule: { id: "social-media", title: "Social Media Red Flags" },
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

  useEffect(() => {
    if (mod) {
      try {
        const stored = localStorage.getItem("tc-academy-progress");
        const progress = stored ? JSON.parse(stored) : { modulesViewed: [] };
        if (!progress.modulesViewed.includes(moduleId)) {
          progress.modulesViewed.push(moduleId);
          localStorage.setItem("tc-academy-progress", JSON.stringify(progress));
        }
      } catch { /* */ }
    }
  }, [mod, moduleId]);

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

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: "var(--tc-text-muted)" }}>
        This educational content is provided as a public service by TrustChekr. It is not legal or financial advice.
        If you believe you are a victim of fraud, contact CAFC at 1-888-495-8501.
      </p>
    </div>
  );
}
