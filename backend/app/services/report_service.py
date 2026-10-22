import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_placement_report_data(student_profile, prediction=None) -> dict:
    """
    Compile comprehensive placement readiness dossier data.
    """
    academic = student_profile.academic_record
    semester_records = list(student_profile.semester_records.all())
    skills = list(student_profile.student_skills.all())
    projects = list(student_profile.projects.all())
    internships = list(student_profile.internships.all())
    certifications = list(student_profile.certifications.all())
    assessments = list(student_profile.assessment_results.all())
    resume = student_profile.resumes.first()
    
    latest_pred = prediction or student_profile.predictions.first()

    return {
        'institution': {
            'name': 'Oriental Group of Institutes / Oriental Institute of Science & Technology (OIST), Bhopal',
            'location': 'Opp. Patel Nagar, Raisen Road, Bhopal, MP - 462021',
            'tagline': 'Placement Intelligence & Career Advancement Cell'
        },
        'student': student_profile.to_dict(),
        'academic': academic.to_dict() if academic else None,
        'semesters': [s.to_dict() for s in semester_records],
        'skills': [s.to_dict() for s in skills],
        'projects': [p.to_dict() for p in projects],
        'internships': [i.to_dict() for i in internships],
        'certifications': [c.to_dict() for c in certifications],
        'assessments': [a.to_dict() for a in assessments],
        'resume': resume.to_dict() if resume else None,
        'prediction': latest_pred.to_dict() if latest_pred else None,
        'generated_at': datetime.utcnow().strftime('%B %d, %Y - %I:%M %p UTC'),
        'disclaimer': 'This Placement Readiness Assessment Report is generated using AI predictive analytics and statistical performance modeling. Results are advisory and do not constitute a legal guarantee of placement.'
    }

def generate_pdf_report(report_data: dict, output_path: str) -> str:
    """
    Generate professional institutional PDF dossier using ReportLab.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=colors.HexColor('#0B192C'),
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#1E3E62'),
        spaceAfter=12
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor('#0056B3'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Italic'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#64748B')
    )

    story = []

    # Header Banner
    story.append(Paragraph("ORIENTAL INSTITUTE OF SCIENCE & TECHNOLOGY, BHOPAL", title_style))
    story.append(Paragraph("TRAINING & PLACEMENT CELL — AI PLACEMENT READINESS REPORT", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0056B3'), spaceAfter=10))

    # Student Info Table
    student = report_data.get('student', {})
    academic = report_data.get('academic', {})
    pred = report_data.get('prediction', {})
    
    student_table_data = [
        [
            Paragraph(f"<b>Candidate:</b> {student.get('full_name', 'N/A')}", body_style),
            Paragraph(f"<b>Enrollment No:</b> {student.get('enrollment_no', 'N/A')}", body_style)
        ],
        [
            Paragraph(f"<b>Branch & Degree:</b> {student.get('branch', 'CSE')} ({student.get('degree', 'B.Tech')})", body_style),
            Paragraph(f"<b>Passing Year / Sem:</b> {student.get('passing_year', 2026)} (Sem {student.get('current_semester', 7)})", body_style)
        ],
        [
            Paragraph(f"<b>Current CGPA:</b> {academic.get('current_cgpa', 'N/A') if academic else 'N/A'}", body_style),
            Paragraph(f"<b>Target Role:</b> {student.get('target_role', 'Software Developer')}", body_style)
        ]
    ]
    t1 = Table(student_table_data, colWidths=[270, 270])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F1F5F9')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    story.append(t1)
    story.append(Spacer(1, 10))

    # Placement Intelligence Summary
    story.append(Paragraph("AI Placement Prediction & Readiness Overview", section_heading))
    if pred:
        sub = pred.get('subscores', {})
        pred_table_data = [
            [
                Paragraph("<b>Placement Probability</b>", body_style),
                Paragraph(f"<b><font color='#008080' size=12>{pred.get('placement_probability', 'N/A')}%</font></b>", body_style),
                Paragraph("<b>Readiness Tier</b>", body_style),
                Paragraph(f"<b>{pred.get('readiness_level', 'N/A')}</b> ({pred.get('readiness_score', 'N/A')}/100)", body_style)
            ],
            [
                Paragraph("<b>Best-Fit Role</b>", body_style),
                Paragraph(f"<b>{pred.get('best_fit_role', 'N/A')}</b>", body_style),
                Paragraph("<b>Model Confidence</b>", body_style),
                Paragraph(f"{pred.get('confidence_score', 'N/A')}% (Calibrated Ensemble)", body_style)
            ]
        ]
        t2 = Table(pred_table_data, colWidths=[140, 130, 130, 140])
        t2.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#E2E8F0')),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#94A3B8'))
        ]))
        story.append(t2)
        story.append(Spacer(1, 8))

        # Subscores Table
        sub_data = [
            ["Academic", "Technical", "Coding", "Communication", "Projects", "Internships", "Certifications", "Resume ATS"],
            [
                f"{sub.get('academic', 0)}%",
                f"{sub.get('technical', 0)}%",
                f"{sub.get('coding', 0)}%",
                f"{sub.get('communication', 0)}%",
                f"{sub.get('projects', 0)}%",
                f"{sub.get('internships', 0)}%",
                f"{sub.get('certifications', 0)}%",
                f"{sub.get('resume', 0)}%"
            ]
        ]
        t3 = Table(sub_data, colWidths=[67.5]*8)
        t3.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B192C')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F8FAFC')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0, 0), (-1, -1), 5)
        ]))
        story.append(t3)
    else:
        story.append(Paragraph("Placement prediction snapshot pending. Please run predictive assessment.", body_style))

    story.append(Spacer(1, 12))

    # Skills & Projects Summary
    story.append(Paragraph("Candidate Technical Profile & Projects", section_heading))
    skills = report_data.get('skills', [])
    skills_text = ", ".join([f"{s['skill_name']} ({s['proficiency']})" for s in skills[:12]]) if skills else "No skills logged."
    story.append(Paragraph(f"<b>Key Proficiencies:</b> {skills_text}", body_style))
    story.append(Spacer(1, 6))

    projects = report_data.get('projects', [])
    if projects:
        proj_data = [["Project Title", "Category", "Technologies", "Complexity"]]
        for p in projects[:3]:
            proj_data.append([p['title'], p.get('category', 'Web'), p['technologies'], p['complexity']])
        t_proj = Table(proj_data, colWidths=[150, 100, 200, 90])
        t_proj.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E3E62')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('PADDING', (0, 0), (-1, -1), 4)
        ]))
        story.append(t_proj)

    story.append(Spacer(1, 14))

    # Footer Disclaimer
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#CBD5E1'), spaceAfter=6))
    story.append(Paragraph(f"Report Generated: {report_data.get('generated_at')}", disclaimer_style))
    story.append(Paragraph(report_data.get('disclaimer', ''), disclaimer_style))

    doc.build(story)
    return output_path
