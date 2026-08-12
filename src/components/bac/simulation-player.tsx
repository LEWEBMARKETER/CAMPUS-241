"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { QuestionType } from "@prisma/client";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { submitSimulation } from "@/lib/actions/bac-simulations";

type ChoiceOption = { id: string; label: string };
export type SimQuestion = {
  answerId: string;
  questionId: string;
  prompt: string;
  type: QuestionType;
  choices: ChoiceOption[];
};
type AnswerState = { selectedChoiceIds?: string[]; answerText?: string };

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SimulationPlayer({
  simulationId,
  questions,
  durationSeconds,
}: {
  simulationId: string;
  questions: SimQuestion[];
  durationSeconds: number | null;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [remaining, setRemaining] = useState(durationSeconds ?? 0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!durationSeconds) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          formRef.current?.requestSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [durationSeconds]);

  const question = questions[index];
  const answersJson = useMemo(() => JSON.stringify(answers), [answers]);

  function setAnswer(questionId: string, value: AnswerState) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  const answeredCount = Object.keys(answers).filter((id) => {
    const a = answers[id];
    return a.selectedChoiceIds?.length || a.answerText?.trim();
  }).length;

  return (
    <form ref={formRef} action={submitSimulation.bind(null, simulationId)}>
      <input type="hidden" name="answersJson" value={answersJson} />

      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-4">
          <span>{answeredCount} répondue(s)</span>
          {durationSeconds !== null && (
            <span className="flex items-center gap-1 font-medium text-brand-blue">
              <Clock className="size-4" />
              {formatTime(remaining)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100">
        <div
          className="h-1.5 rounded-full bg-brand-blue transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6">
        <p className="text-lg font-medium text-neutral-900">{question.prompt}</p>

        <div className="mt-6 flex flex-col gap-3">
          {(question.type === "QCM" || question.type === "QCM_MULTIPLE") &&
            question.choices.map((choice) => {
              const current = answers[question.questionId]?.selectedChoiceIds ?? [];
              const checked = current.includes(choice.id);
              return (
                <label
                  key={choice.id}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm cursor-pointer ${
                    checked
                      ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                      : "border-black/10 text-neutral-700"
                  }`}
                >
                  <input
                    type={question.type === "QCM" ? "radio" : "checkbox"}
                    name={`q-${question.questionId}`}
                    checked={checked}
                    onChange={() => {
                      if (question.type === "QCM") {
                        setAnswer(question.questionId, { selectedChoiceIds: [choice.id] });
                      } else {
                        const next = checked
                          ? current.filter((id) => id !== choice.id)
                          : [...current, choice.id];
                        setAnswer(question.questionId, { selectedChoiceIds: next });
                      }
                    }}
                  />
                  {choice.label}
                </label>
              );
            })}

          {question.type === "VRAI_FAUX" && (
            <div className="grid grid-cols-2 gap-3">
              {["vrai", "faux"].map((value) => {
                const checked = answers[question.questionId]?.answerText === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAnswer(question.questionId, { answerText: value })}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium capitalize ${
                      checked
                        ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                        : "border-black/10 text-neutral-700"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === "REPONSE_COURTE" && (
            <input
              type="text"
              value={answers[question.questionId]?.answerText ?? ""}
              onChange={(event) =>
                setAnswer(question.questionId, { answerText: event.target.value })
              }
              placeholder="Votre réponse"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Précédent
        </Button>

        <div className="flex gap-2">
          {index < questions.length - 1 && (
            <Button
              type="button"
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            >
              Suivant
            </Button>
          )}
          <Button type="submit" variant={index === questions.length - 1 ? "default" : "outline"}>
            Terminer la simulation
          </Button>
        </div>
      </div>
    </form>
  );
}
