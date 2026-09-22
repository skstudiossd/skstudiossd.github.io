#!/usr/bin/env python3
"""Build the portable handoff. Install reportlab, then run from any directory."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/HANDOFF.md"
OUTPUT = ROOT / "docs/portfolio-handoff.pdf"
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleSK", fontName="Helvetica-Bold", fontSize=22, leading=26, textColor=colors.HexColor("#222222"), spaceAfter=16))
styles.add(ParagraphStyle(name="HeadSK", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=colors.HexColor("#b63b27"), spaceBefore=11, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name="BodySK", fontName="Helvetica", fontSize=9, leading=12.5, spaceAfter=6))
styles.add(ParagraphStyle(name="BulletSK", parent=styles["BodySK"], leftIndent=10, firstLineIndent=-7))
def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D64A32"))
    canvas.line(44, 42, 568, 42)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawString(44, 29, "SHANTHANU KELSO  /  PORTFOLIO HANDOFF")
    canvas.drawRightString(568, 29, str(doc.page))
    canvas.restoreState()
story = []
for line in SOURCE.read_text().splitlines():
    if line == "---":
        story.append(PageBreak())
    elif line.startswith("# "):
        story.append(Paragraph(escape(line[2:]), styles["TitleSK"]))
    elif line.startswith("## "):
        story.append(Paragraph(escape(line[3:]), styles["HeadSK"]))
    elif line.startswith("- "):
        story.append(Paragraph("- " + escape(line[2:]), styles["BulletSK"]))
    elif line.strip():
        story.append(Paragraph(escape(line), styles["BodySK"]))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
SimpleDocTemplate(str(OUTPUT), pagesize=(612,792), rightMargin=44,leftMargin=44,topMargin=42,bottomMargin=56,title="Shanthanu Kelso - Portfolio Handoff",author="Shanthanu Kelso").build(story,onFirstPage=footer,onLaterPages=footer)
print(OUTPUT)
