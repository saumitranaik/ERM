# User Journeys

Guided walkthroughs a stakeholder can follow in the running prototype. Each
journey demonstrates the maker-checker pattern end to end using the persona
switcher — no logout/login required.

## 1. Risk assessment approval (Risk Manager → Chief Risk Officer)

1. Log in as **Arjun Mehta (Risk Manager)**.
2. Go to **Risk Management → Risk Register**, open a risk in `ACTIVE` status
   (e.g. RSK-2026-0004, credit default risk).
3. Click **Submit for Assessment Approval** (or **Submit Re-assessment** for an
   already-active risk), enter a justification, submit.
4. Notice the risk's status badge changes to **Under Review** and an
   "Awaiting checker" badge appears; the action buttons disappear (GOV-07:
   one pending action at a time).
5. Open the persona switcher, switch to **Priya Raghunathan (Chief Risk
   Officer)** — the `RISK_CHECKER` role.
6. Go to **Approvals** (sidebar badge shows the new pending count) → **Checker
   Queue**. Approve or reject the item, with an optional/mandatory comment.
7. Return to the risk's detail page: status has updated, a new History entry
   and a notification back to Arjun Mehta both exist.

## 2. Control exception lifecycle (Control Owner → Head of Compliance)

1. Log in as **Sneha Kulkarni (Control Owner)**.
2. Open **Controls Management → Exceptions**, pick an `OPEN` exception.
3. Walk it through **Start Remediation → Submit for Verification** (both
   direct, ungoverned transitions).
4. Click **Propose Closure** (governed) with a justification.
5. Switch to **Deepak Malhotra (Head of Compliance)**, the `CONTROLS_CHECKER`.
6. Approve from the Approvals queue or from the exception's own Approvals tab.
7. Confirm the exception is now `CLOSED` and appears in Decision History.

## 3. Cross-module drill-down

1. As any persona, open **Risk Management → Risk Register → RSK-2026-0007**
   (ransomware exposure).
2. Open the **Relationships** tab: linked Controls (patch management, EDR),
   an escalation, and a treatment plan are all real, cross-linked records.
3. Click through to the linked Control — you're now in the Controls module,
   looking at that control's own detail tabs, including *its own* linked
   risks and exceptions.
4. Use **Global Search** (sidebar) to search "ransomware" — results span
   Risk, Security Findings, and Incident records that all reference the same
   underlying scenario.

## 4. Vendor onboarding due diligence (Vendor Risk Manager → COO)

1. Log in as **Farhan Qureshi (Vendor Risk Manager)**.
2. Open **Third-Party Risk → Vendors**, pick a `PROSPECTIVE` vendor (Quantum
   Analytics Labs).
3. Create a due-diligence assessment (**Third-Party Risk → Assessments → New**),
   then submit the vendor's due diligence for approval from the vendor
   detail page.
4. Switch to **Rajesh Iyer (COO)**, the `TPR_CHECKER`, and approve from the
   Approvals queue.
5. Confirm the vendor's status advances to `ACTIVE`.

## 5. Business continuity exercise → exception → CAPA thread

1. Log in as **Suresh Menon (BCM Manager)**.
2. Open **Business Continuity → Exercises → H1 DR Failover Exercise** — note
   its `PARTIAL` outcome and the actual vs. target RTO.
3. Follow the linked **Continuity Exception** (DR failover exceeded RTO) — see
   its remediation plan and target close date.
4. Cross to **Incident, Issue & CAPA** and open the linked Issue
   (interface subnet segmentation gap) → its CAPA → its action items, to see
   how a single control weakness threads through Security, Incident, and BCP.

## 6. Reset and repeat

Any journey can be replayed from a clean slate via the persona switcher's
**Reset demo data** action — useful between stakeholder walkthroughs.
