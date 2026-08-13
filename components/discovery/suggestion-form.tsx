"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

export function SuggestionForm() {
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const submit = (formData: FormData) => { const submission = { title: formData.get("title"), country: formData.get("country"), category: formData.get("category"), officialSourceUrl: formData.get("source") || undefined, notes: formData.get("notes") || undefined, submittedAt: new Date().toISOString() }; setOutput(JSON.stringify(submission, null, 2)); setCopied(false); };
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); };
  return <div className="suggest-layout"><form action={submit} className="suggest-form"><label>Title<input name="title" required /></label><label>Country<input name="country" required /></label><label>Category suggestion<select name="category" required><option value="">Choose one</option><option value="bl">BL</option><option value="gl">GL</option><option value="omegaverse">Omegaverse</option><option value="unsure">Unsure</option></select></label><label>Official source URL <span>optional</span><input name="source" type="url" placeholder="https://" /></label><label>Notes <span>optional</span><textarea name="notes" rows={5} /></label><button className="button-primary" type="submit">Create submission</button></form><aside className="submission-output"><h2>Structured submission</h2>{output ? <><pre>{output}</pre><button className="button-secondary" onClick={copy}>{copied ? <Check /> : <Clipboard />}{copied ? "Copied" : "Copy JSON"}</button></> : <p>Complete the form to create review-ready JSON. V1 does not send data to a server.</p>}</aside></div>;
}
