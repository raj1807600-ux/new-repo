import numpy as np
import pandas as pd

FEATURE_NAMES = [
    'cgpa',
    'sgpa_trend',
    'tenth_pct',
    'twelfth_pct',
    'active_backlogs',
    'history_backlogs',
    'attendance_pct',
    'aptitude_score',
    'technical_score',
    'coding_score',
    'communication_score',
    'skills_count',
    'advanced_skills_count',
    'projects_score',
    'internships_count',
    'certifications_count',
    'resume_score'
]

ROLES_CATALOG = [
    'Software Developer',
    'Full Stack Developer',
    'Backend Engineer',
    'Frontend Engineer',
    'Data Analyst / AI Engineer',
    'Cloud & DevOps Engineer',
    'QA & Automation Engineer',
    'Embedded & IoT Systems Engineer',
    'Cybersecurity Analyst',
    'Technical Consultant'
]

def extract_features_from_student(student_profile, academic_record=None, semester_records=None,
                                 skills=None, projects=None, internships=None,
                                 certifications=None, assessment_results=None, resume=None):
    """
    Extract a normalized 17-dimensional feature dictionary/vector from student entities.
    """
    # 1. Academic metrics
    cgpa = float(academic_record.current_cgpa) if academic_record else 7.0
    tenth_pct = float(academic_record.tenth_percentage) if academic_record else 75.0
    twelfth_pct = float(academic_record.twelfth_percentage) if (academic_record and academic_record.twelfth_percentage) else tenth_pct
    active_backlogs = int(academic_record.active_backlogs) if academic_record else 0
    history_backlogs = int(academic_record.history_backlogs) if academic_record else 0
    attendance_pct = float(academic_record.attendance_percentage) if academic_record else 75.0

    # 2. SGPA Trend slope
    sgpa_trend = 0.0
    if semester_records and len(semester_records) >= 2:
        sgpas = [s.sgpa for s in sorted(semester_records, key=lambda x: x.semester_number)]
        if len(sgpas) >= 2:
            x = np.arange(len(sgpas))
            slope, _ = np.polyfit(x, sgpas, 1)
            sgpa_trend = float(slope)

    # 3. Assessments breakdown (default to 65 if not taken yet)
    aptitude_score = 65.0
    technical_score = 65.0
    coding_score = 60.0
    communication_score = 70.0

    if assessment_results:
        cat_scores = {}
        for res in assessment_results:
            cat = res.category.lower()
            cat_scores.setdefault(cat, []).append(res.percentage)
        
        if 'aptitude' in cat_scores:
            aptitude_score = float(np.mean(cat_scores['aptitude']))
        if 'technical' in cat_scores:
            technical_score = float(np.mean(cat_scores['technical']))
        if 'coding' in cat_scores:
            coding_score = float(np.mean(cat_scores['coding']))
        if 'communication' in cat_scores or 'mock_interview' in cat_scores:
            comm_list = cat_scores.get('communication', []) + cat_scores.get('mock_interview', [])
            communication_score = float(np.mean(comm_list))

    # 4. Skills count & advanced proficiency
    skills_list = list(skills) if skills else []
    skills_count = len(skills_list)
    advanced_skills_count = sum(1 for s in skills_list if hasattr(s, 'proficiency') and s.proficiency in ['Advanced', 'Expert'])

    # 5. Projects
    projects_list = list(projects) if projects else []
    projects_score = min(100.0, sum(getattr(p, 'complexity_score', 70) for p in projects_list) * 0.5)

    # 6. Internships & Certifications
    internships_count = len(list(internships)) if internships else 0
    certifications_count = len(list(certifications)) if certifications else 0

    # 7. Resume score
    resume_score = float(resume.ats_score) if resume else 65.0

    features = {
        'cgpa': cgpa,
        'sgpa_trend': sgpa_trend,
        'tenth_pct': tenth_pct,
        'twelfth_pct': twelfth_pct,
        'active_backlogs': active_backlogs,
        'history_backlogs': history_backlogs,
        'attendance_pct': attendance_pct,
        'aptitude_score': aptitude_score,
        'technical_score': technical_score,
        'coding_score': coding_score,
        'communication_score': communication_score,
        'skills_count': skills_count,
        'advanced_skills_count': advanced_skills_count,
        'projects_score': projects_score,
        'internships_count': internships_count,
        'certifications_count': certifications_count,
        'resume_score': resume_score
    }
    return features

def features_to_vector(features_dict):
    """Convert features dict to ordered numpy array."""
    return np.array([[features_dict[name] for name in FEATURE_NAMES]])
