"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

type QuestionKey = "goal" | "experience" | "readiness";

const goalOptions: Option[] = [
  { value: "desenvolvimento-pessoal", label: "Desenvolvimento pessoal" },
  { value: "lideranca-performance", label: "Liderança & Performance" },
  { value: "equilibrio-vida-trabalho", label: "Equilíbrio vida-trabalho" },
  { value: "outro", label: "Outro" }
];

const experienceOptions: Option[] = [
  { value: "ja-investeu", label: "Já investi em coaching/mentoria antes" },
  { value: "primeira-vez", label: "É a minha primeira vez" },
  { value: "a-explorar", label: "Estou apenas a explorar opções" }
];

const readinessOptions: Option[] = [
  { value: "quero-avancar", label: "Sim, quero avançar já" },
  { value: "a-avaliar", label: "Talvez, ainda estou a avaliar" },
  { value: "sem-planos", label: "Não tenho planos no imediato" }
];

interface SubmissionState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

const whatsappLink = (message: string) => {
  const phone = "351912187975";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const goalLabelMap: Record<string, string> = {
  "desenvolvimento-pessoal": "Desenvolvimento pessoal",
  "lideranca-performance": "Liderança & Performance",
  "equilibrio-vida-trabalho": "Equilíbrio vida-trabalho",
  outro: "Outro"
};

const experienceLabelMap: Record<string, string> = {
  "ja-investeu": "Já investi em coaching/mentoria antes",
  "primeira-vez": "É a minha primeira vez",
  "a-explorar": "Estou a explorar opções"
};

const readinessLabelMap: Record<string, string> = {
  "quero-avancar": "Sim, quero avançar já",
  "a-avaliar": "Talvez, ainda estou a avaliar",
  "sem-planos": "Não tenho planos no imediato"
};

const QualificationQuiz = () => {
  const [answers, setAnswers] = useState<Record<QuestionKey, string>>({
    goal: "",
    experience: "",
    readiness: ""
  });
  const [otherGoal, setOtherGoal] = useState("");
  const [contact, setContact] = useState({ name: "", email: "" });
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [isWithinHours, setIsWithinHours] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isReadyToSubmit = useMemo(() => {
    if (!answers.goal || !answers.experience || !answers.readiness) {
      return false;
    }

    if (answers.goal === "outro" && !otherGoal.trim()) {
      return false;
    }

    if (!contact.name.trim()) {
      return false;
    }

    if (!contact.email.trim()) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  }, [answers, otherGoal, contact]);

  const handleSelect = (key: QuestionKey, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isReadyToSubmit) return;

    setSubmission({ status: "submitting" });

    try {
      const response = await fetch("/api/mentorship-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: contact.name.trim(),
          email: contact.email.trim(),
          goal: answers.goal,
          goalOther: answers.goal === "outro" ? otherGoal.trim() : null,
          experience: answers.experience,
          readiness: answers.readiness
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Não foi possível enviar as suas respostas. Tente novamente.");
      }

      setSubmission({ status: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado. Tente novamente.";
      setSubmission({ status: "error", message });
    }
  };

  useEffect(() => {
    const checkAvailability = () => {
      const lisbonNow = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Lisbon" }));
      const day = lisbonNow.getDay();
      const hour = lisbonNow.getHours();
      const isWeekday = day >= 1 && day <= 5;
      const inBusinessHours = hour >= 10 && hour < 18;
      setIsWithinHours(isWeekday && inBusinessHours);
    };

    checkAvailability();
    const interval = window.setInterval(checkAvailability, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (submission.status === "success" || submission.status === "error") {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submission.status]);

  const formattedGoal = useMemo(() => {
    if (answers.goal === "outro") {
      return otherGoal.trim() ? `Outro: ${otherGoal.trim()}` : "Outro";
    }
    return goalLabelMap[answers.goal] ?? answers.goal;
  }, [answers.goal, otherGoal]);

  const formattedExperience = useMemo(() => experienceLabelMap[answers.experience] ?? answers.experience, [answers.experience]);

  const formattedReadiness = useMemo(() => readinessLabelMap[answers.readiness] ?? answers.readiness, [answers.readiness]);

  const shouldShowWhatsApp = submission.status === "success" && answers.readiness === "quero-avancar" && isWithinHours;
  const shouldShowWhatsappSoon = submission.status === "success" && answers.readiness === "quero-avancar" && !isWithinHours;

  const whatsappMessage = `Olá Adriana, acabei de responder ao questionário e quero avançar com a mentoria.
Nome: ${contact.name.trim()}
Email: ${contact.email.trim()}
Objetivo: ${formattedGoal}
Experiência: ${formattedExperience}
Disponibilidade: ${formattedReadiness}`;

  return (
    <section className="bg-white py-20" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-[#F5F5FA] p-8 shadow-lg">
          <h2 className="text-center text-2xl font-semibold text-gray-900 md:text-3xl">
            Gostaria de falar diretamente com a Adriana?
          </h2>
          <p className="mt-3 text-center text-sm text-gray-600 md:text-base">
            Responda a 3 perguntas rápidas. Levamos a sua intenção a sério e só entraremos em contacto se for o momento certo para si.
          </p>

          {submission.status === "success" ? (
            <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-md">
              <p className="text-lg font-semibold text-gray-900">Obrigado por responder.</p>
              <p className="mt-2 text-sm text-gray-600">
                A nossa equipa vai rever o seu pedido e será contactada em breve se o seu perfil estiver alinhado com a mentoria.
              </p>

              {shouldShowWhatsApp && (
                <a
                  href={whatsappLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#25D366] px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#1DA851]"
                >
                  Falar agora via WhatsApp
                </a>
              )}
              {shouldShowWhatsappSoon && (
                <p className="mt-4 text-sm text-gray-600">
                  O atendimento via WhatsApp está disponível em dias úteis, das 10h às 18h (hora de Lisboa). Entraremos em contacto por email assim que possível.
                </p>
              )}
              {!shouldShowWhatsApp && (
                <p className="mt-4 text-xs text-gray-500">
                  Caso seja o momento certo, entraremos em contacto via email.
                </p>
              )}
            </div>
          ) : (
            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
              <fieldset className="rounded-2xl bg-white p-6 shadow-sm">
                <legend className="text-lg font-semibold text-gray-900">
                  1. Qual é o principal objetivo que gostaria de trabalhar com a Adriana?
                </legend>
                <div className="mt-4 space-y-3">
                  {goalOptions.map(option => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 px-4 py-3 transition-colors ${
                        answers.goal === option.value ? "border-[#6B1FBF] bg-[#F3EDFF]" : "hover:border-[#6B1FBF]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={option.value}
                        className="mt-1 h-4 w-4"
                        checked={answers.goal === option.value}
                        onChange={() => handleSelect("goal", option.value)}
                        required
                      />
                      <span className="text-sm text-gray-800">{option.label}</span>
                    </label>
                  ))}
                </div>
                {answers.goal === "outro" && (
                  <textarea
                    className="mt-4 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 focus:border-[#6B1FBF] focus:outline-none focus:ring-2 focus:ring-[#6B1FBF]/40"
                    placeholder="Partilhe brevemente o que gostaria de trabalhar"
                    value={otherGoal}
                    onChange={event => setOtherGoal(event.target.value)}
                    rows={3}
                    required
                  />
                )}
              </fieldset>

              <fieldset className="rounded-2xl bg-white p-6 shadow-sm">
                <legend className="text-lg font-semibold text-gray-900">
                  2. Em que fase está neste momento?
                </legend>
                <div className="mt-4 space-y-3">
                  {experienceOptions.map(option => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 px-4 py-3 transition-colors ${
                        answers.experience === option.value ? "border-[#6B1FBF] bg-[#F3EDFF]" : "hover:border-[#6B1FBF]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={option.value}
                        className="mt-1 h-4 w-4"
                        checked={answers.experience === option.value}
                        onChange={() => handleSelect("experience", option.value)}
                        required
                      />
                      <span className="text-sm text-gray-800">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="rounded-2xl bg-white p-6 shadow-sm">
                <legend className="text-lg font-semibold text-gray-900">
                  3. Está disponível para investir tempo e recursos nesta jornada?
                </legend>
                <div className="mt-4 space-y-3">
                  {readinessOptions.map(option => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 px-4 py-3 transition-colors ${
                        answers.readiness === option.value ? "border-[#6B1FBF] bg-[#F3EDFF]" : "hover:border-[#6B1FBF]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="readiness"
                        value={option.value}
                        className="mt-1 h-4 w-4"
                        checked={answers.readiness === option.value}
                        onChange={() => handleSelect("readiness", option.value)}
                        required
                      />
                      <span className="text-sm text-gray-800">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="rounded-2xl bg-white p-6 shadow-sm">
                <legend className="text-lg font-semibold text-gray-900">Como podemos contactar?</legend>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="quiz-name">
                      Nome completo
                    </label>
                    <input
                      id="quiz-name"
                      type="text"
                      value={contact.name}
                      onChange={event => setContact(prev => ({ ...prev, name: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 focus:border-[#6B1FBF] focus:outline-none focus:ring-2 focus:ring-[#6B1FBF]/40"
                      placeholder="Ex.: Ana Martins"
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="quiz-email">
                      Email
                    </label>
                    <input
                      id="quiz-email"
                      type="email"
                      value={contact.email}
                      onChange={event => setContact(prev => ({ ...prev, email: event.target.value }))}
                      className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 focus:border-[#6B1FBF] focus:outline-none focus:ring-2 focus:ring-[#6B1FBF]/40"
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Usamos estes dados apenas para responder ao seu pedido sobre a mentoria.
                </p>
              </fieldset>

              {submission.status === "error" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submission.message}
                </div>
              )}

              <button
                type="submit"
                disabled={!isReadyToSubmit || submission.status === "submitting"}
                className="w-full rounded-xl bg-[#6B1FBF] px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.01] hover:bg-[#5814A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B1FBF] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submission.status === "submitting" ? "A enviar..." : "Enviar as minhas respostas"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default QualificationQuiz;
