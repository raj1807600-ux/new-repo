from backend.app.services.eligibility_service import check_company_eligibility

def get_recommended_companies(student_profile, companies: list, academic_record, student_skills, placement_prob: float = 75.0) -> list:
    """
    Rank and recommend company placement opportunities based on:
    - Eligibility status (Eligible > Almost Eligible > Not Eligible)
    - Match percentage
    - Skill alignment
    - CTC tier vs readiness probability
    """
    ranked_list = []
    for company in companies:
        if not getattr(company, 'is_active', True):
            continue
        
        eval_result = check_company_eligibility(student_profile, company, academic_record, student_skills)
        status = eval_result['status']
        match_pct = eval_result['match_percentage']

        # Weight score based on status
        status_multiplier = 1.0 if status == 'Eligible' else 0.75 if status == 'Almost Eligible' else 0.40
        final_rank_score = match_pct * status_multiplier

        # Generate recommendation reason
        if status == 'Eligible' and match_pct >= 85.0:
            reason = f"High Match ({round(match_pct)}%) - You satisfy all academic cutoffs and core tech requirements."
        elif status == 'Eligible':
            reason = f"Eligible ({round(match_pct)}%) - Strong academic profile and good skill alignment."
        elif status == 'Almost Eligible':
            missing = eval_result['missing_skills'][:2]
            missing_text = f", brush up on {', '.join(missing)}" if missing else ""
            reason = f"Near Match ({round(match_pct)}%){missing_text} to reach full eligibility."
        else:
            reason = f"Aspirational - Requires addressing academic or skill prerequisites."

        ranked_list.append({
            'company': company.to_dict(),
            'status': status,
            'match_percentage': match_pct,
            'rank_score': final_rank_score,
            'recommendation_reason': reason,
            'evaluation': eval_result
        })

    # Sort descending by rank score
    ranked_list.sort(key=lambda x: x['rank_score'], reverse=True)
    
    # Assign ranks 1..N
    for i, item in enumerate(ranked_list, 1):
        item['rank'] = i

    return ranked_list
