"""
Capture the real screenshots for the ERM Summary Video from the running, unmodified prototype.

Prereq: `npm run dev` in prototype/ (http://localhost:3100). Fresh browser context => seed data,
no stored state. Read-only walk: the script signs in as two personas and opens screens; it never
submits, approves or edits anything.

Usage: python capture_screenshots.py [--base http://localhost:3100]
Requires Python Playwright with a cached Chromium (installed outside the repository).
"""
import argparse
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).resolve().parent.parent / "screenshots"

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="http://localhost:3100")
BASE = ap.parse_args().base


def shot(page, name, wait=900):
    page.wait_for_timeout(wait)
    page.screenshot(path=str(OUT / name))
    print("captured", name)


with sync_playwright() as p:
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = ctx.new_page()

    # Sign-in screen (persona picker), then act as the Risk Manager (maker)
    page.goto(f"{BASE}/login")
    page.wait_for_selector("text=Meridian Asset Management Ltd.")
    shot(page, "00-login-persona-picker.png")
    page.get_by_role("button", name="Arjun Mehta").first.click()
    page.wait_for_url("**/protected")
    shot(page, "01-platform-dashboard.png", 1500)

    page.goto(f"{BASE}/modules/RISK")
    shot(page, "02-risk-dashboard-heatmap.png", 1800)
    page.goto(f"{BASE}/modules/RISK/risks")
    shot(page, "03-risk-register.png", 1500)
    page.goto(f"{BASE}/modules/RISK/risks/r-001")
    shot(page, "04-risk-detail-scores-and-provenance.png", 1500)
    page.goto(f"{BASE}/modules/RISK/assessments/ra-001")
    shot(page, "05-assessment-scoring-snapshot.png", 1500)
    page.goto(f"{BASE}/modules/RISK/risks/new")
    shot(page, "06-log-risk-form.png", 1500)

    # Switch persona via the app's own login screen: the Chief Risk Officer (checker)
    page.goto(f"{BASE}/login")
    page.get_by_role("button", name="Priya Raghunathan").first.click()
    page.wait_for_url("**/protected")
    page.goto(f"{BASE}/protected/approvals")
    shot(page, "07-checker-approvals-queue.png", 1800)

    for i, (code, name) in enumerate([
        ("CONTROLS", "08-controls-dashboard.png"),
        ("COMPLIANCE", "09-compliance-dashboard.png"),
        ("AUDIT", "10-audit-dashboard.png"),
        ("INCIDENT", "11-incident-dashboard.png"),
        ("ANALYTICS", "12-analytics-dashboard.png"),
    ]):
        page.goto(f"{BASE}/modules/{code}")
        shot(page, name, 1800)
    browser.close()
