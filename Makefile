.PHONY: vuln-report vuln-open vuln-serve clean

IMAGE_TAG ?= ssb-dataportal:local
RISK_THRESHOLD ?= 0.1

vuln-report:
    docker build . -f Dockerfile -t $(IMAGE_TAG)
    grype $(IMAGE_TAG) -o json > grype-report.json
    jq --arg t "$(RISK_THRESHOLD)" '\
    [ \
      .matches[] \
      | select((.vulnerability.severity == "High" or .vulnerability.severity == "Critical") \
        and ((.vulnerability.risk // 0) > ($$t | tonumber))) \
      | { \
          package: .artifact.name, \
          version: .artifact.version, \
          vulnerability: .vulnerability.id, \
          severity: .vulnerability.severity, \
          risk: (.vulnerability.risk // 0), \
          fix: (.vulnerability.fix.versions[0] // "none") \
        } \
    ] | sort_by(.risk) | reverse' grype-report.json > filtered-vulns.json
    mkdir -p report
    python3 - << 'PY'
import json, html
from pathlib import Path
data = json.loads(Path("filtered-vulns.json").read_text())
rows = []
for d in data:
    rows.append(
        "<tr>"
        f"<td>{html.escape(str(d.get('package','')))}</td>"
        f"<td>{html.escape(str(d.get('version','')))}</td>"
        f"<td>{html.escape(str(d.get('vulnerability','')))}</td>"
        f"<td>{html.escape(str(d.get('severity','')))}</td>"
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
body {{ font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; margin:24px; }}
table {{ border-collapse: collapse; width: 100%; }}
th, td {{ border:1px solid #ddd; padding:8px; font-size:14px; }}
th {{ background:#f6f8fa; text-align:left; }}
tr:nth-child(even) {{ background:#fafafa; }}
</style>
</head><body>
<h1>Grype Vulnerability Report</h1>
<p>High/Critical with risk &gt; {0.1} • Findings: <strong>{len(data)}</strong></p>
<table>
<thead><tr><th>Package</th><th>Version</th><th>Vulnerability</th><th>Severity</th><th>Risk</th><th>Fix</th></tr></thead>
<tbody>{''.join(rows) if rows else '<tr><td colspan="6">No matching findings.</td></tr>'}</tbody>
</table>
</body></html>"""
Path("report/index.html").write_text(doc)
print("Wrote report/index.html")
PY

vuln-open: vuln-report
    open report/index.html

vuln-serve: vuln-report
    python3 -m http.server 8000 --directory report

clean:
    rm -f grype-report.json filtered-vulns.json
    rm -rf report
