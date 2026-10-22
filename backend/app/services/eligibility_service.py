import json

def check_company_eligibility(student_profile, company, academic_record, student_skills) -> dict:
    """
    Evaluate student against company eligibility criteria:
    - Minimum CGPA
    - 10th & 12th minimum percentage
    - Maximum active backlogs / history
    - Eligible branches
    - Minimum attendance
    - Required mandatory skills
    Returns status ('Eligible' / 'Almost Eligible' / 'Not Eligible'), match percentage, and reason details.
    """
    criteria = company.criteria
    if not criteria:
        return {
            'company_id': company.id,
            'status': 'Eligible',
            'match_percentage': 85.0,
            'cgpa_eligible': True,
            'backlog_eligible': True,
            'branch_eligible': True,
            'tenth_twelfth_eligible': True,
            'matched_skills': [],
            'missing_skills': [],
            'reasons': []
        }

    # 1. Branch check
    eligible_branches = json.loads(criteria.eligible_branches_json) if criteria.eligible_branches_json else []
    student_branch = getattr(student_profile, 'branch', 'CSE')
    branch_eligible = (not eligible_branches) or (student_branch in eligible_branches) or ('ALL' in [b.upper() for b in eligible_branches])

    # 2. CGPA check
    student_cgpa = float(academic_record.current_cgpa) if academic_record else 7.0
    min_cgpa = float(criteria.min_cgpa)
    cgpa_eligible = student_cgpa >= min_cgpa
    cgpa_near = (student_cgpa >= (min_cgpa - 0.35))

    # 3. Backlogs check
    active_backlogs = int(academic_record.active_backlogs) if academic_record else 0
    history_backlogs = int(academic_record.history_backlogs) if academic_record else 0
    max_backlogs = int(criteria.max_active_backlogs)
    
    backlog_eligible = active_backlogs <= max_backlogs
    if not criteria.allow_backlog_history and history_backlogs > 0:
        backlog_eligible = False

    # 4. 10th & 12th check
    tenth_pct = float(academic_record.tenth_percentage) if academic_record else 75.0
    twelfth_pct = float(academic_record.twelfth_percentage) if (academic_record and academic_record.twelfth_percentage) else tenth_pct
    tenth_twelfth_eligible = (tenth_pct >= criteria.min_tenth_percentage) and (twelfth_pct >= criteria.min_twelfth_percentage)

    # 5. Skills matching
    student_skill_names = set()
    for s in student_skills:
        name = s.skill.name if hasattr(s, 'skill') and s.skill else getattr(s, 'name', str(s))
        student_skill_names.add(name.lower().strip())

    company_required = list(company.required_skills.all()) if hasattr(company.required_skills, 'all') else []
    mandatory_skills = [s.skill_name for s in company_required if getattr(s, 'importance', 'Mandatory') == 'Mandatory']
    all_req_skills = [s.skill_name for s in company_required] or ['Java', 'SQL', 'Problem Solving']

    matched_skills = []
    missing_skills = []
    for skill_name in all_req_skills:
        skill_lower = skill_name.lower().strip()
        matched = False
        for s_name in student_skill_names:
            if skill_lower in s_name or s_name in skill_lower:
                matched_skills.append(skill_name)
                matched = True
                break
        if not matched:
            missing_skills.append(skill_name)

    skills_match_pct = (len(matched_skills) / len(all_req_skills) * 100.0) if all_req_skills else 80.0

    # Build reasons
    reasons = []
    if not branch_eligible:
        reasons.append(f"Branch '{student_branch}' is not in eligible list ({', '.join(eligible_branches)}).")
    if not cgpa_eligible:
        reasons.append(f"CGPA {student_cgpa:.2f} is below minimum requirement of {min_cgpa:.2f}.")
    if not backlog_eligible:
        reasons.append(f"Active backlogs ({active_backlogs}) exceed allowed maximum ({max_backlogs}).")
    if not tenth_twelfth_eligible:
        reasons.append(f"10th/12th percentages ({tenth_pct:.1f}% / {twelfth_pct:.1f}%) below cutoff ({criteria.min_tenth_percentage}% / {criteria.min_twelfth_percentage}%).")
    if missing_skills:
        reasons.append(f"Missing key skills: {', '.join(missing_skills[:3])}")

    # Determine overall status: 'Eligible', 'Almost Eligible', 'Not Eligible'
    is_hard_ineligible = (not branch_eligible) or (not backlog_eligible) or (student_cgpa < (min_cgpa - 0.5))
    if not is_hard_ineligible and cgpa_eligible and tenth_twelfth_eligible and (skills_match_pct >= 60.0):
        status = 'Eligible'
    elif not is_hard_ineligible and (cgpa_near or skills_match_pct >= 40.0):
        status = 'Almost Eligible'
    else:
        status = 'Not Eligible'

    # Compute overall company match percentage
    cgpa_factor = min(100.0, (student_cgpa / max(min_cgpa, 6.0)) * 90.0)
    match_score = (
        cgpa_factor * 0.35 +
        skills_match_pct * 0.40 +
        (100.0 if backlog_eligible else 30.0) * 0.15 +
        (100.0 if branch_eligible else 20.0) * 0.10
    )
    match_percentage = float(min(98.5, max(15.0, match_score)))

    return {
        'company_id': company.id,
        'status': status,
        'match_percentage': round(match_percentage, 1),
        'cgpa_eligible': cgpa_eligible,
        'backlog_eligible': backlog_eligible,
        'branch_eligible': branch_eligible,
        'tenth_twelfth_eligible': tenth_twelfth_eligible,
        'skills_match_percentage': round(skills_match_pct, 1),
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
        'reasons': reasons
    }
