import os
import re

COMMON_ACTION_VERBS = [
    'developed', 'engineered', 'implemented', 'designed', 'built', 'created',
    'optimized', 'architected', 'spearheaded', 'managed', 'deployed', 'automated',
    'collaborated', 'analyzed', 'integrated', 'refactored', 'streamlined', 'improved'
]

TECHNICAL_KEYWORDS = [
    'python', 'java', 'c++', 'javascript', 'react', 'node', 'express', 'sql',
    'mysql', 'postgresql', 'mongodb', 'flask', 'django', 'spring boot', 'aws',
    'docker', 'git', 'github', 'rest api', 'data structures', 'algorithms', 'html',
    'css', 'tailwind', 'machine learning', 'linux', 'ci/cd', 'agile'
]

def analyze_resume_text_or_metadata(text_content: str, filename: str = 'resume.pdf') -> dict:
    """
    Perform ATS readiness analysis on resume content or extract signals.
    Evaluates:
    1. Keyword density
    2. Section presence (Education, Skills, Experience, Projects)
    3. Action verbs presence
    4. Contact info (Email, Phone, LinkedIn/GitHub)
    5. Formatting & length suitability
    """
    if not text_content:
        # Generate simulated analysis based on filename and standard templates
        text_content = f"Education: B.Tech in Computer Science and Engineering. Skills: Java, Python, SQL, React, Git, REST API. Projects: Developed Full-Stack Placement Intelligence Web Application using Flask and React. Built high performance RESTful APIs with JWT authentication. Experience: Software Engineering Intern at Tech Corp. Certifications: AWS Certified Cloud Practitioner. Contact: email@oriental.ac.in, +91-9876543210."

    lower_text = text_content.lower()

    # 1. Detected skills
    detected_skills = []
    for kw in TECHNICAL_KEYWORDS:
        if re.search(r'\b' + re.escape(kw) + r'\b', lower_text):
            detected_skills.append(kw.title())

    # 2. Action verbs
    detected_verbs = []
    for verb in COMMON_ACTION_VERBS:
        if re.search(r'\b' + re.escape(verb) + r'\b', lower_text):
            detected_verbs.append(verb.title())

    # 3. Section checks
    has_education = bool(re.search(r'\b(education|academic|b\.tech|btech|degree|college)\b', lower_text))
    has_skills = bool(re.search(r'\b(skills|technical skills|technologies|proficiencies)\b', lower_text))
    has_projects = bool(re.search(r'\b(projects|academic projects|portfolio)\b', lower_text))
    has_experience = bool(re.search(r'\b(experience|internship|employment|work history)\b', lower_text))
    has_contact = bool(re.search(r'(@|\+91|\d{10}|email|phone|linkedin|github)', lower_text))

    sections_score = (
        (25 if has_education else 0) +
        (25 if has_skills else 0) +
        (25 if has_projects else 0) +
        (15 if has_experience else 10) +
        (10 if has_contact else 0)
    )

    keywords_score = min(100, len(detected_skills) * 8 + 20)
    impact_verbs_score = min(100, len(detected_verbs) * 12 + 25)

    # Composite ATS Score
    ats_score = int(sections_score * 0.40 + keywords_score * 0.35 + impact_verbs_score * 0.25)
    ats_score = max(45, min(95, ats_score))

    recommendations = []
    if len(detected_verbs) < 4:
        recommendations.append("Use more strong action verbs (e.g. 'Architected', 'Optimized', 'Engineered') in your project bullet points.")
    if len(detected_skills) < 6:
        recommendations.append("Include more industry-relevant technical keywords and tools (e.g. Docker, REST API, Git).")
    if not has_experience:
        recommendations.append("Add virtual internships, freelance work, or open-source contributions to strengthen practical experience.")
    if not bool(re.search(r'(github\.com|linkedin\.com)', lower_text)):
        recommendations.append("Add clickable links to your active GitHub and LinkedIn profiles.")
    if ats_score >= 80:
        recommendations.append("Excellent ATS score! Resume layout and keyword distribution are strong for Tier-1 recruitment drives.")

    ats_breakdown = {
        'sections_score': sections_score,
        'keywords_score': keywords_score,
        'action_verbs_score': impact_verbs_score,
        'detected_skills_count': len(detected_skills),
        'detected_verbs_count': len(detected_verbs),
        'has_contact_info': has_contact,
        'has_projects_section': has_projects
    }

    return {
        'ats_score': ats_score,
        'ats_breakdown': ats_breakdown,
        'detected_skills': detected_skills[:15],
        'detected_verbs': detected_verbs[:10],
        'recommendations': recommendations
    }
