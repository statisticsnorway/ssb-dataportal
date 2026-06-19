#!/usr/bin/env bash
set -euo pipefail

IMAGE_TAG="${1:-ssb-dataportal:latest}"
RISK_THRESHOLD="${RISK_THRESHOLD:-0.1}"
SEVERITIES="${SEVERITIES:-High,Critical}"

mkdir -p report

docker build . -f Dockerfile -t "$IMAGE_TAG"
grype "$IMAGE_TAG" -o json > grype-report.json

SEVERITIES_JSON="$(printf '%s' "$SEVERITIES" | jq -R 'split(",") | map(gsub("^\\s+|\\s+$"; "")) | map(select(length>0))')"

jq --arg t "$RISK_THRESHOLD" --argjson s "$SEVERITIES_JSON" '
  [
    .matches[]
    | select(
        (.vulnerability.severity == "High" or .vulnerability.severity == "Critical")
        and ((.vulnerability.risk // 0) > ($t | tonumber))
      )
    | {
        package: .artifact.name,
        version: .artifact.version,
        vulnerability: .vulnerability.id,
        severity: .vulnerability.severity,
        risk: (.vulnerability.risk // 0),
        fix: (.vulnerability.fix.versions[0] // "none")
      }
  ] | sort_by(.risk) | reverse
' grype-report.json > filtered-vulns.json
RISK_THRESHOLD="$RISK_THRESHOLD" SEVERITIES="$SEVERITIES" python3 - << 'PY'
import json, html, os
from pathlib import Path
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

def vuln_url(vuln_id: str) -> str:
    v = (vuln_id or "").strip()
    if v.startswith("CVE-"):
        return f"https://nvd.nist.gov/vuln/detail/{v}"
    if v.startswith("GHSA-"):
        return f"https://github.com/advisories/{v}"
    return ""
threshold = os.getenv("RISK_THRESHOLD", "0.1")
severities = os.getenv("SEVERITIES", "High,Critical")
generated_at = datetime.now(ZoneInfo("Europe/Oslo")).strftime("%Y-%m-%d %H:%M:%S %Z (%z)")
data = json.loads(Path("filtered-vulns.json").read_text())
rows = []
for d in data:
    vid = str(d.get("vulnerability", ""))
    url = vuln_url(vid)
    vuln_cell = f'<a href="{html.escape(url)}" target="_blank" rel="noopener noreferrer">{html.escape(vid)}</a>' if url else html.escape(vid)
    severity = str(d.get('severity', ''))
    rows.append(
        "<tr>"
        f"<td>{html.escape(str(d.get('package','')))}</td>"
        f"<td>{html.escape(str(d.get('version','')))}</td>"
        f"<td>{vuln_cell}</td>"
        f"<td data-severity=\"{html.escape(severity)}\">{html.escape(severity)}</td>"
        f"<td>{d.get('risk',0):.3f}</td>"
        f"<td>{html.escape(str(d.get('fix','none')))}</td>"
        "</tr>"
    )

doc = f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Grype Vulnerability Report</title>
<style>
  body {{
    font-family: 'Open Sans', sans-serif;
    margin: 2rem;
    background: #f9f9f9;
    color: #222;
  }}
  h1 {{
    font-size: 1.6rem;
    margin-bottom: 0.3rem;
  }}
  p {{
    color: #555;
    margin-bottom: 1.5rem;
  }}
  table {{
    border-collapse: collapse;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }}
  th {{
    background: #0f488c;
    color: #fff;
    padding: 1rem 1.5rem;
    text-align: left;
    font-size: 1rem;
  }}
  td {{
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-bottom: 1px solid #eee;
  }}
  tr:nth-child(even) td {{
    background: #f6f8fa;
  }}
  tr:hover td {{
    background: #eef2ff;
  }}
  a {{
    color: #0969da;
    text-decoration: none;
  }}
  a:hover {{
    text-decoration: underline;
  }}
  /* severity badge colors */
  td[data-severity="Critical"] {{ color: #d9534f; font-weight: bold; }}
  td[data-severity="High"]     {{ color: #f0ad4e; font-weight: bold; }}
  td[data-severity="Medium"]   {{ color: #5bc0de; font-weight: bold; }}
  td[data-severity="Low"]      {{ color: #5cb85c; font-weight: bold; }}
  td[data-severity="Unknown"] {{ color: #777; font-weight: bold; }}
</style>
</head><body>
<h1>Grype Vulnerability Report</h1>
<h2>SSB Dataportal</h2>
<p>Generated: {generated_at}</p>
<p>High/Critical with risk &gt; {threshold}</p>
<p>Findings: <strong>{len(data)}</strong></p>
<table>
<thead><tr>
  <th>Package</th><th>Version</th><th>Vulnerability</th>
  <th>Severity</th><th>Risk</th><th>Fix</th>
</tr></thead>
<tbody>{''.join(rows) if rows else '<tr><td colspan="6">No matching findings.</td></tr>'}</tbody>
</table>
</body></html>"""
Path("report/index.html").write_text(doc)
PY

echo "Report written to report/index.html"
