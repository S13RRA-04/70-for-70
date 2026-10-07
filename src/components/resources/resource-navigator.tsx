"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, ShieldAlert } from "lucide-react";
import { ResourceCard } from "@/components/resources/resource-card";
import { RESOURCES } from "@/lib/content/resources";
import { NAVIGATOR_SITUATIONS, rankResources, resourceKey, type NavigatorAnswers } from "@/lib/resources/navigator";

const AUDIENCES = ["Veteran", "Active Military", "National Guard / Reserve", "Law Enforcement", "Fire", "EMS", "Dispatch", "Corrections", "Family", "Caregiver"];
const PRIORITIES = [["low-cost","Free or low-cost"],["virtual","Virtual / online"],["local","Near me"],["family","Family-focused"],["peer","Peer-led"],["professional","Professional / clinical"],["faith","Faith-based"],["non-faith","Non-faith-based"],["anonymous","Anonymous or low-profile access"],["no-employer","No employer involvement"],["no-insurance","No insurance required"],["quick","Quick access"]];
const STATES = "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" ");
const INITIAL: NavigatorAnswers = { audiences: [], situations: [], priorities: [], privacyConcern: "skip", locationMode: "any" };

function Choice({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-sm border p-4 text-left text-sm font-semibold transition ${selected ? "border-bronze bg-bronze/10 text-ink" : "border-ink/15 bg-off-white text-charcoal-light hover:border-bronze/50"}`}>{children}</button>;
}

export function ResourceNavigator() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL);
  const [visible, setVisible] = useState(5);
  const results = useMemo(() => rankResources(RESOURCES, answers), [answers]);
  const toggle = (field: "audiences" | "situations" | "priorities", value: string) => setAnswers((a) => ({ ...a, [field]: a[field].includes(value) ? a[field].filter((v) => v !== value) : [...a[field], value] }));
  const restart = () => { setStarted(false); setStep(0); setAnswers(INITIAL); setVisible(5); };

  if (!started) return <div className="rounded-sm border border-bronze/30 bg-sand-light p-6 sm:p-9">
    <p className="text-xs font-semibold uppercase tracking-widest text-bronze-text">A clearer place to begin</p>
    <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-ink">Not sure where to start?</h2>
    <p className="mt-3 max-w-2xl text-base leading-relaxed text-charcoal-light">You don&apos;t need to know exactly what kind of help you need. Answer a few private, non-clinical questions and we&apos;ll narrow the directory to a few relevant options.</p>
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setStarted(true)} data-analytics-event="resource_navigator_started" className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white">Help Me Find Support <ArrowRight size={15}/></button><a href="#browse-resources" className="rounded-sm border border-ink/20 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-ink">Browse All Resources</a></div>
    <p className="mt-4 text-xs text-charcoal-light">No account required. Your answers stay in this browser and are not submitted.</p>
  </div>;

  const questions = [
    { title: "Who needs support?", hint: "Choose every description that fits.", body: <div className="grid gap-2 sm:grid-cols-2">{AUDIENCES.map((v) => <Choice key={v} selected={answers.audiences.includes(v)} onClick={() => toggle("audiences", v)}>{v}</Choice>)}</div> },
    { title: "What's going on right now?", hint: "Use your own understanding; this isn't a diagnosis.", body: <div className="grid gap-2 sm:grid-cols-2">{NAVIGATOR_SITUATIONS.map((v) => <Choice key={v.id} selected={answers.situations.includes(v.id)} onClick={() => toggle("situations", v.id)}>{v.label}</Choice>)}</div> },
    { title: "What matters most?", hint: "Choose as many as you want, or skip.", body: <div className="grid gap-2 sm:grid-cols-2">{PRIORITIES.map(([id,label]) => <Choice key={id} selected={answers.priorities.includes(id)} onClick={() => toggle("priorities", id)}>{label}</Choice>)}</div> },
    { title: "Any privacy or career concerns?", hint: "We cannot guarantee confidentiality, but can prioritize published access details.", body: <div className="grid gap-2 sm:grid-cols-2">{[["yes","Yes"],["maybe","Maybe"],["no","No"],["skip","Prefer not to say"]].map(([id,label]) => <Choice key={id} selected={answers.privacyConcern === id} onClick={() => setAnswers((a) => ({ ...a, privacyConcern: id as NavigatorAnswers["privacyConcern"] }))}>{label}</Choice>)}</div> },
    { title: "What location works for you?", hint: "A precise address is never needed.", body: <><div className="grid gap-2 sm:grid-cols-2">{[["any","No preference"],["national","Nationwide only"],["virtual","Virtual is fine"],["local","Local preferred"],["state","Use my state"]].map(([id,label]) => <Choice key={id} selected={answers.locationMode === id} onClick={() => setAnswers((a) => ({ ...a, locationMode: id as NavigatorAnswers["locationMode"] }))}>{label}</Choice>)}</div>{["state","local"].includes(answers.locationMode) && <label className="mt-4 block text-sm font-semibold text-ink">State<select value={answers.state ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, state: e.target.value || undefined }))} className="mt-2 block w-full rounded-sm border border-ink/20 bg-off-white p-3"><option value="">Select a state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>}</> },
  ];

  if (step >= questions.length) return <div className="rounded-sm border border-ink/10 bg-sand-light p-6 sm:p-9" data-analytics-event="resource_navigator_completed">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-bronze-text">Your results</p><h2 className="mt-2 font-display text-3xl font-bold uppercase text-ink">A few places to start</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-light">Ranked by your selections, geography, published access details, and record freshness. Sponsorship never affects the order.</p></div><button type="button" onClick={restart} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-bronze"><RotateCcw size={14}/>Restart</button></div>
    {answers.situations.includes("worried") && <div className="mt-6 flex gap-3 border border-red-700/25 bg-red-50 p-4"><ShieldAlert className="shrink-0 text-red-800"/><p className="text-sm text-ink"><strong>If someone may be in immediate danger:</strong> call 911, or visit <a className="font-semibold underline" href="/crisis">Need Help Now</a> for crisis contacts. For the 22 is not a crisis service.</p></div>}
    <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{results.slice(0, visible).map(({resource,reasons}) => <div key={resourceKey(resource)} data-analytics-event="resource_recommendation_shown"><ResourceCard resource={resource}/><p className="border-x border-b border-ink/10 bg-off-white px-5 pb-4 text-xs leading-relaxed text-charcoal-light"><strong className="text-ink">Why this may fit:</strong> {reasons.length ? reasons.join(", ") : "it is a current directory option related to your selections"}.</p></div>)}</div>
    <div className="mt-6 flex flex-wrap gap-3">{visible < results.length && <button type="button" onClick={() => setVisible((n) => n + 6)} className="rounded-sm bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-wide text-off-white">Show more options</button>}<a href="#browse-resources" className="rounded-sm border border-ink/20 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink">Browse manually</a></div>
  </div>;

  const current = questions[step];
  return <div className="rounded-sm border border-ink/10 bg-sand-light p-6 sm:p-9"><div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-charcoal-light"><span>Step {step + 1} of {questions.length}</span><button type="button" onClick={restart} className="text-bronze">Exit</button></div><div className="mt-3 h-1 bg-ink/10"><div className="h-full bg-bronze transition-all" style={{width: `${((step + 1) / questions.length) * 100}%`}}/></div><h2 className="mt-7 font-display text-2xl font-bold uppercase text-ink">{current.title}</h2><p className="mt-1 text-sm text-charcoal-light">{current.hint}</p><div className="mt-5">{current.body}</div><div className="mt-7 flex justify-between"><button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink disabled:opacity-30"><ArrowLeft size={15}/>Back</button><button type="button" onClick={() => setStep((s) => s + 1)} className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-off-white">{step === questions.length - 1 ? "See results" : "Continue"}<ArrowRight size={15}/></button></div></div>;
}
