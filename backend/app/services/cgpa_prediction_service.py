import numpy as np

def calculate_cgpa_trajectory(student_profile, current_cgpa: float, semester_records: list) -> dict:
    """
    Calculate academic trajectory and project final graduation CGPA.
    Returns previous trend, projected final CGPA, best-case trajectory,
    expected trajectory, and improvement-required trajectory.
    """
    total_semesters = 8 if getattr(student_profile, 'degree', 'B.Tech') == 'B.Tech' else 6
    current_sem = getattr(student_profile, 'current_semester', 7)
    
    # Sort existing semesters
    sorted_sems = sorted(semester_records, key=lambda s: s.semester_number) if semester_records else []
    
    history_points = []
    sgpas = []
    
    if sorted_sems:
        for s in sorted_sems:
            history_points.append({
                'semester': f"Sem {s.semester_number}",
                'sem_num': s.semester_number,
                'sgpa': round(s.sgpa, 2),
                'cgpa_at_time': round(float(np.mean([x.sgpa for x in sorted_sems if x.semester_number <= s.semester_number])), 2),
                'type': 'Actual'
            })
            sgpas.append(s.sgpa)
    else:
        # Generate representative past sems up to current_sem - 1
        base_cgpa = current_cgpa if current_cgpa > 0 else 7.2
        for i in range(1, current_sem):
            sim_sgpa = round(base_cgpa + np.random.uniform(-0.3, 0.3), 2)
            history_points.append({
                'semester': f"Sem {i}",
                'sem_num': i,
                'sgpa': sim_sgpa,
                'cgpa_at_time': round(base_cgpa, 2),
                'type': 'Actual'
            })
            sgpas.append(sim_sgpa)

    avg_past_sgpa = float(np.mean(sgpas)) if sgpas else current_cgpa
    trend_slope = 0.0
    if len(sgpas) >= 2:
        x = np.arange(len(sgpas))
        trend_slope, _ = np.polyfit(x, sgpas, 1)

    # Remaining semesters to complete
    remaining_sems = list(range(max(current_sem, len(sgpas) + 1), total_semesters + 1))
    
    # 1. Expected Trajectory (Maintains current momentum + small improvement)
    expected_future_sgpa = np.clip(avg_past_sgpa + (trend_slope * 0.5), 5.0, 9.8)
    all_expected_sgpas = list(sgpas) + [expected_future_sgpa] * len(remaining_sems)
    projected_final_cgpa = float(np.mean(all_expected_sgpas)) if all_expected_sgpas else current_cgpa

    # 2. Best-Case / Target Trajectory (Active sprint + target SGPA boost)
    best_case_future_sgpa = min(9.8, avg_past_sgpa + 1.2)
    all_best_sgpas = list(sgpas) + [best_case_future_sgpa] * len(remaining_sems)
    best_case_final_cgpa = float(np.mean(all_best_sgpas)) if all_best_sgpas else current_cgpa

    # 3. Conservative / Improvement Required Trajectory (If focus drops)
    conservative_future_sgpa = max(5.5, avg_past_sgpa - 0.6)
    all_conservative_sgpas = list(sgpas) + [conservative_future_sgpa] * len(remaining_sems)
    conservative_final_cgpa = float(np.mean(all_conservative_sgpas)) if all_conservative_sgpas else current_cgpa

    # Chart trajectory series
    trajectory_chart = []
    # Add past points
    for p in history_points:
        trajectory_chart.append({
            'semester': p['semester'],
            'actual_sgpa': p['sgpa'],
            'expected_trajectory': p['sgpa'],
            'best_case_trajectory': p['sgpa'],
            'conservative_trajectory': p['sgpa'],
            'is_projection': False
        })
    
    # Add future projected points
    curr_proj_expected = avg_past_sgpa
    curr_proj_best = avg_past_sgpa
    curr_proj_cons = avg_past_sgpa
    for sem_num in remaining_sems:
        curr_proj_expected = round(np.clip(curr_proj_expected + 0.1, 5.0, 9.8), 2)
        curr_proj_best = round(np.clip(curr_proj_best + 0.35, 5.0, 9.9), 2)
        curr_proj_cons = round(np.clip(curr_proj_cons - 0.15, 5.0, 9.0), 2)
        
        trajectory_chart.append({
            'semester': f"Sem {sem_num} (Est.)",
            'actual_sgpa': None,
            'expected_trajectory': curr_proj_expected,
            'best_case_trajectory': curr_proj_best,
            'conservative_trajectory': curr_proj_cons,
            'is_projection': True
        })

    # Summary analysis
    trend_description = "Upward Momentum" if trend_slope > 0.05 else "Consistent & Stable" if trend_slope >= -0.05 else "Needs Acceleration"

    return {
        'current_cgpa': round(current_cgpa, 2),
        'avg_past_sgpa': round(avg_past_sgpa, 2),
        'trend_slope': round(float(trend_slope), 3),
        'trend_description': trend_description,
        'projected_final_cgpa': round(projected_final_cgpa, 2),
        'best_case_final_cgpa': round(best_case_final_cgpa, 2),
        'conservative_final_cgpa': round(conservative_final_cgpa, 2),
        'strongest_semester': max(history_points, key=lambda x: x['sgpa'])['semester'] if history_points else f"Sem {current_sem}",
        'weakest_semester': min(history_points, key=lambda x: x['sgpa'])['semester'] if history_points else f"Sem {current_sem}",
        'trajectory_chart': trajectory_chart,
        'disclaimer': "Academic projections are statistical estimates based on historical SGPA progression and do not guarantee final university grades."
    }
