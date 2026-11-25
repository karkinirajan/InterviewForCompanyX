---
title: "Document AI: OCR, extraction and human review"
level: 4
summary: Turning PDFs, scans and faxes into validated structured data with OCR, layout parsing, schema extraction, deterministic validation and review queues.
outcomes: Build an extraction pipeline with evidence and confidence | Validate extracted fields deterministically | Design a review queue whose corrections improve the system
---

## Why this matters

Document processing (invoices, claims, referrals, contracts, forms) is one of the most valuable and common AI use cases in business. It's also unforgiving: a wrong number in an invoice or a wrong patient on a referral has real consequences.

## The pipeline

1. **Intake:** upload, email, fax, scan; store originals immutably (object storage, versioned, encrypted).
2. **OCR and layout:** text, tables, key-value pairs (managed services like Textract or Document AI, or open-source OCR).
3. **Classify** the document type.
4. **Extract** to a strict schema per type, with **evidence spans** (where in the document each value came from) and confidence.
5. **Validate deterministically:** codes exist, totals add up, dates are plausible, identifiers have valid check digits, matches against master data.
6. **Route:** confident and valid → straight through; otherwise → human review.
7. **Review UI:** document and extracted fields side by side, evidence highlighted, quick correction.
8. **Learn:** corrections become eval cases and drive prompt or model changes.

This is design drill [D1](#d1) in practice.

## How to do it

```python
class InvoiceExtraction(BaseModel):
    invoice_number: str
    issue_date: date
    currency: Literal["USD", "EUR", "NPR"]
    line_items: list[LineItem]
    total: Decimal
    evidence: dict[str, str]           # field → quoted source text
    confidence: float = Field(ge=0, le=1)

def validate(x: InvoiceExtraction) -> list[str]:
    problems = []
    if sum(li.amount for li in x.line_items) != x.total:
        problems.append("line items don't sum to total")
    if x.issue_date > date.today():
        problems.append("issue date in the future")
    return problems                    # non-empty → review queue
```

## Metrics

Field-level accuracy on labelled documents, straight-through rate, review-queue age, reviewer correction rate per field, cost per document.

## Common mistakes

- Trusting model-computed totals instead of computing them in code.
- No evidence spans, so reviewers re-read whole documents.
- Corrections that don't flow back into evals.

## Check yourself

<details markdown="1"><summary>Why ask the model for evidence spans?</summary>

They let code verify that values appear in the document (catching fabrication), make human review fast, and give an audit trail of where each value came from.

</details>

## Build it

Extract three fields from 20 sample invoices (public datasets exist), validate deterministically, route failures to a simple review page, and measure field accuracy.

## Confidence routing in practice

Model "confidence" numbers are poorly calibrated on their own. Combine signals into a routing decision you can measure:

| Signal | Example rule |
|---|---|
| Deterministic validation | Any failure → review |
| Evidence check | Value not found verbatim (or normalised) in the OCR text → review |
| Field criticality | Patient/payee/amount fields always need valid evidence |
| Model confidence | Below a threshold calibrated on labelled data → review |
| Document quality | OCR confidence low, pages missing → review |

Calibrate thresholds on a labelled set so that straight-through documents meet the accuracy target (for example 99% field accuracy), then watch the reviewer correction rate per field in production.

## Interview follow-ups

- **"How do you handle duplicates?"** Hash the normalised content plus key fields (sender, subject, date); idempotency keys on downstream writes; show possible duplicates to reviewers rather than silently dropping.
- **"Multi-page documents?"** Classify and split first (one fax can contain several documents); extract per logical document; keep page references in evidence.
- **"How do corrections improve the system?"** Each correction is stored with the original extraction, prompt version and model; periodic review turns them into eval cases; prompt or model changes must improve those cases without regressing others.

## More check-yourself

<details markdown="1"><summary>Why compute totals and check digits in code rather than asking the model?</summary>

Arithmetic and checksums are deterministic; code is exact and auditable, while models can produce plausible but wrong numbers. Use the model to read values, code to verify them.

</details>

<details markdown="1"><summary>What's the straight-through rate and why track it with accuracy?</summary>

The share of documents processed without human review. It measures automation value; tracking it alongside straight-through accuracy prevents "improving" automation by sending wrong results through.

</details>

## What comes next

[11.4 Voice and multimodal](/11-ai-automation/04-voice-and-multimodal).
