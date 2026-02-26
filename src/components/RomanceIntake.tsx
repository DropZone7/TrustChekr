"use client";

import { useState } from "react";

interface RomanceData {
  timeline: string;
  platform: string;
  movedOffApp: string;
  videoCall: string;
  moneyAsked: string;
  moneySent: string;
  moneyAmount: string;
  messages: string;
}

const initialData: RomanceData = {
  timeline: "",
  platform: "",
  movedOffApp: "",
  videoCall: "",
  moneyAsked: "",
  moneySent: "",
  moneyAmount: "",
  messages: "",
};

const steps = [
  {
    key: "platform" as keyof RomanceData,
    question: "Where did you meet this person?",
    hint: "For example: Tinder, Bumble, Facebook, Instagram, or somewhere else",
    type: "input" as const,
  },
  {
    key: "timeline" as keyof RomanceData,
    question: "Roughly how long have you been talking?",
    hint: "It's okay to estimate — days, weeks, or months",
    type: "choices" as const,
    choices: ["Less than a week", "1–2 weeks", "1–3 months", "More than 3 months"],
  },
  {
    key: "movedOffApp" as keyof RomanceData,
    question: "Did they ask you to move to WhatsApp, Telegram, or another app?",
    hint: "",
    type: "choices" as const,
    choices: ["Yes", "No", "I'm not sure"],
  },
  {
    key: "videoCall" as keyof RomanceData,
    question: "Have you ever had a live video call where you could clearly see their face?",
    hint: "A real-time call, not a pre-recorded video or photo",
    type: "choices" as const,
    choices: ["Yes, we video called", "No, they always had an excuse", "I never asked"],
  },
  {
    key: "moneyAsked" as keyof RomanceData,
    question: "Have they asked you for money, crypto, gift cards, or to invest in something?",
    hint: "",
    type: "choices" as const,
    choices: ["Yes", "No", "They hinted but didn't ask directly"],
  },
  {
    key: "moneySent" as keyof RomanceData,
    question: "Have you already sent any money?",
    hint: "You don't have to answer this if you're not comfortable — we can still help",
    type: "choices" as const,
    choices: ["Yes", "No", "I'd rather not say"],
  },
  {
    key: "messages" as keyof RomanceData,
    question: "If you'd like, paste some of their messages below.",
    hint: "You can remove names or anything personal. This helps us spot common scam scripts.",
    type: "textarea" as const,
  },
];

export default function RomanceIntake({ onComplete }: { onComplete: (data: RomanceData) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<RomanceData>(initialData);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const canProceed = step.type === "textarea" || data[step.key].trim().length > 0;

  const handleNext = () => {
    if (isLast) {
      onComplete(data);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleChoice = (choice: string) => {
    setData((d) => ({ ...d, [step.key]: choice }));
    // Auto-advance on choice selection
    setTimeout(() => {
      if (isLast) {
        onComplete({ ...data, [step.key]: choice });
      } else {
        setCurrentStep((s) => s + 1);
      }
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium" style={{ color: "var(--tc-text-muted)" }}>
          Question {currentStep + 1} of {steps.length}
        </span>
        <div className="flex-1 h-2 rounded-full" style={{ background: "var(--tc-border)" }}>
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              background: "var(--tc-primary)",
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Reassurance */}
      {currentStep === 0 && (
        <div className="p-4 rounded-xl" style={{ background: "var(--tc-primary-soft)" }}>
          <p className="text-sm" style={{ color: "var(--tc-primary)" }}>
            💙 Take your time. You can skip any question you're not comfortable with.
            Everything you share here stays private — we don't store it.
          </p>
        </div>
      )}

      {/* Question */}
      <div>
        <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--tc-text-main)" }}>
          {step.question}
        </h2>
        {step.hint && (
          <p className="text-sm" style={{ color: "var(--tc-text-muted)" }}>{step.hint}</p>
        )}
      </div>

      {/* Answer area */}
      {step.type === "choices" && (
        <div className="flex flex-col gap-2">
          {step.choices!.map((choice) => (
            <button
              key={choice}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer"
              style={{
                borderColor: data[step.key] === choice ? "var(--tc-primary)" : "var(--tc-border)",
                background: data[step.key] === choice ? "var(--tc-primary-soft)" : "var(--tc-surface)",
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {step.type === "input" && (
        <input
          type="text"
          className="w-full p-4 rounded-xl border-2 text-base"
          style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
          placeholder="Type your answer here"
          value={data[step.key]}
          onChange={(e) => setData((d) => ({ ...d, [step.key]: e.target.value }))}
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
        />
      )}

      {step.type === "textarea" && (
        <textarea
          className="w-full min-h-[150px] p-4 rounded-xl border-2 text-base resize-y"
          style={{ borderColor: "var(--tc-border)", background: "var(--tc-surface)" }}
          placeholder="Paste messages here (optional)"
          value={data[step.key]}
          onChange={(e) => setData((d) => ({ ...d, [step.key]: e.target.value }))}
          autoFocus
        />
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="px-6 py-3 rounded-xl border-2 font-medium cursor-pointer"
            style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-muted)" }}
          >
            Back
          </button>
        )}

        {step.type !== "choices" && (
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-semibold text-white cursor-pointer disabled:opacity-40"
            style={{ background: "var(--tc-primary)" }}
          >
            {isLast ? "Check this for me" : "Next"}
          </button>
        )}

        {step.type === "textarea" && (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl border-2 font-medium cursor-pointer"
            style={{ borderColor: "var(--tc-border)", color: "var(--tc-text-muted)" }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
