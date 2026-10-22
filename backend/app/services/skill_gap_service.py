ROLE_REQUIREMENTS_MAP = {
    'Software Developer': {
        'required': ['Java', 'C++', 'Python', 'Data Structures & Algorithms', 'DBMS', 'SQL', 'OOP', 'Git', 'Operating Systems', 'REST API'],
        'primary_domains': ['Core Programming', 'DSA', 'Databases', 'Computer Fundamentals'],
        'roadmap_templates': [
            {'week': 1, 'title': 'Data Structures Foundations & Complexity', 'topic': 'DSA', 'desc': 'Master Arrays, Strings, HashMaps, Two Pointers, and Time/Space complexity analysis on LeetCode/GFG.'},
            {'week': 2, 'title': 'Core CS Fundamentals (DBMS & OS)', 'topic': 'Core CS', 'desc': 'Review SQL Joins, Indexing, Transactions, Normalization, Process Scheduling, and Deadlocks.'},
            {'week': 3, 'title': 'Object-Oriented Design & Clean Code', 'topic': 'OOP & System Design', 'desc': 'Deep dive into SOLID principles, Design Patterns (Factory, Singleton, Observer), and Schema design.'},
            {'week': 4, 'title': 'Advanced Algorithms & Dynamic Programming', 'topic': 'DSA', 'desc': 'Practice Trees, Binary Search Trees, Graphs (BFS/DFS), and standard Dynamic Programming patterns.'},
            {'week': 5, 'title': 'Full-Stack REST Integration & Project Polish', 'topic': 'Backend & API', 'desc': 'Refactor personal projects with proper API error handling, authentication, and Dockerization.'},
            {'week': 6, 'title': 'Mock Technical & HR Coding Interview Sprint', 'topic': 'Interview Prep', 'desc': 'Simulate timed company-specific coding tests and practice behavioral STAR responses for Oriental placement drives.'}
        ]
    },
    'Full Stack Developer': {
        'required': ['JavaScript', 'React', 'Node.js', 'Express', 'Python', 'SQL', 'MongoDB', 'REST API', 'Git', 'Tailwind CSS', 'Docker'],
        'primary_domains': ['Frontend Architecture', 'Backend APIs', 'Database Management', 'DevOps & Deployment'],
        'roadmap_templates': [
            {'week': 1, 'title': 'Modern React & State Management', 'topic': 'Frontend', 'desc': 'Master React Hooks, Context API, Redux/Zustand, responsive UI layout, and API fetching.'},
            {'week': 2, 'title': 'Scalable RESTful Backend Architecture', 'topic': 'Backend', 'desc': 'Build secure REST APIs using Node/Express or Flask with JWT authentication and middleware.'},
            {'week': 3, 'title': 'Database Modeling & Query Optimization', 'topic': 'Database', 'desc': 'Design normalized PostgreSQL/MySQL schemas and implement MongoDB aggregate pipelines.'},
            {'week': 4, 'title': 'Full-Stack Integration & Cloud Deployment', 'topic': 'Integration', 'desc': 'Deploy production web application on AWS / Vercel with environment security and CI/CD.'},
            {'week': 5, 'title': 'DSA for Full-Stack Interviews', 'topic': 'DSA', 'desc': 'Solve 25+ top interview problems focused on strings, arrays, matrix, and tree traversals.'},
            {'week': 6, 'title': 'System Design & Mock Placement Assessment', 'topic': 'Mock Drive', 'desc': 'Design a URL shortener / chat system and complete Oriental mock placement test.'}
        ]
    },
    'Backend Engineer': {
        'required': ['Java', 'Spring Boot', 'Python', 'Django', 'Flask', 'SQL', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'Microservices'],
        'primary_domains': ['Backend Frameworks', 'Caching & Message Queues', 'Databases', 'Microservices'],
        'roadmap_templates': [
            {'week': 1, 'title': 'REST API Design & Security Standards', 'topic': 'APIs', 'desc': 'Build clean REST APIs with rate limiting, input sanitization, and OAuth2 / JWT.'},
            {'week': 2, 'title': 'Spring Boot / Flask Microservice Architecture', 'topic': 'Backend', 'desc': 'Implement controller-service-repository patterns, dependency injection, and JPA/ORM.'},
            {'week': 3, 'title': 'High Performance Caching & SQL Optimization', 'topic': 'Databases', 'desc': 'Implement Redis caching, write complex SQL queries, and optimize query execution plans.'},
            {'week': 4, 'title': 'Containerization & Cloud Infrastructure', 'topic': 'DevOps', 'desc': 'Dockerize multi-container services with Docker Compose and set up AWS EC2/S3 basics.'},
            {'week': 5, 'title': 'Core Backend DSA & Concurrency', 'topic': 'DSA & Multithreading', 'desc': 'Practice concurrency concepts, thread safety, queues, and tree/graph problems.'},
            {'week': 6, 'title': 'Backend System Design & Mock Interview', 'topic': 'Interview', 'desc': 'Simulate backend system design rounds and live coding on company assessment patterns.'}
        ]
    },
    'Data Analyst / AI Engineer': {
        'required': ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Power BI', 'Tableau', 'Data Visualization', 'Machine Learning', 'Statistics'],
        'primary_domains': ['Data Wrangling', 'Statistical Analysis', 'Machine Learning Modeling', 'Business Intelligence'],
        'roadmap_templates': [
            {'week': 1, 'title': 'Advanced SQL & Data Extraction', 'topic': 'SQL & BI', 'desc': 'Master Window functions, Common Table Expressions (CTEs), Subqueries, and joins.'},
            {'week': 2, 'title': 'Data Manipulation with Pandas & NumPy', 'topic': 'Data Processing', 'desc': 'Wrangle messy real-world datasets, handle missing values, and engineer predictive features.'},
            {'week': 3, 'title': 'Exploratory Data Analysis & Dashboards', 'topic': 'Visualization', 'desc': 'Build interactive dashboards using Power BI / Tableau and Python Seaborn/Plotly.'},
            {'week': 4, 'title': 'Supervised & Unsupervised Machine Learning', 'topic': 'ML Pipeline', 'desc': 'Train regression, classification, and clustering models using Scikit-Learn with cross-validation.'},
            {'week': 5, 'title': 'ML Model Deployment & API Serving', 'topic': 'MLOps', 'desc': 'Deploy predictive model as a Flask/FastAPI REST microservice with Docker.'},
            {'week': 6, 'title': 'Data Case Studies & Technical Presentation', 'topic': 'Interview', 'desc': 'Prepare end-to-end portfolio case study presentation for campus placement panels.'}
        ]
    },
    'Cloud & DevOps Engineer': {
        'required': ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Git', 'Terraform', 'Python', 'Bash Scripting', 'Networking'],
        'primary_domains': ['Cloud Architecture', 'Container Orchestration', 'Infrastructure as Code', 'CI/CD Pipelines'],
        'roadmap_templates': [
            {'week': 1, 'title': 'Linux Administration & Shell Scripting', 'topic': 'Linux', 'desc': 'Master command line utilities, permissions, process management, and automated Bash scripts.'},
            {'week': 2, 'title': 'Containerization with Docker', 'topic': 'Containers', 'desc': 'Write optimized multi-stage Dockerfiles, manage volumes, and network containers.'},
            {'week': 3, 'title': 'AWS Cloud Core Services (EC2, S3, RDS, IAM)', 'topic': 'Cloud', 'desc': 'Architect secure VPCs, compute instances, storage, and IAM least-privilege roles.'},
            {'week': 4, 'title': 'Automated CI/CD Pipelines (GitHub Actions)', 'topic': 'CI/CD', 'desc': 'Build automated test, lint, and deployment pipelines with GitHub Actions.'},
            {'week': 5, 'title': 'Kubernetes Basics & Infrastructure as Code', 'topic': 'Orchestration', 'desc': 'Deploy pods, services, and ingress on Kubernetes; automate with Terraform.'},
            {'week': 6, 'title': 'DevOps Portfolio & Placement Sprint', 'topic': 'Interview', 'desc': 'Review networking protocols (TCP/IP, DNS, SSL) and practice DevOps interview questions.'}
        ]
    }
}

def analyze_student_skill_gap(student_skills: list, target_role: str = 'Software Developer') -> dict:
    """
    Perform deep skill gap analysis comparing student mastered skills with target role requirements.
    Generates missing skills list, domain gap diagnosis, match percentage, and adaptive 6-week roadmap.
    """
    role_config = ROLE_REQUIREMENTS_MAP.get(target_role, ROLE_REQUIREMENTS_MAP['Software Developer'])
    required_skills = role_config['required']
    
    # Normalize student skill names
    student_skill_names = set()
    student_skill_proficiencies = {}
    for s in student_skills:
        name = s.skill.name if hasattr(s, 'skill') and s.skill else getattr(s, 'name', str(s))
        norm_name = name.strip()
        student_skill_names.add(norm_name.lower())
        prof = getattr(s, 'proficiency', 'Intermediate')
        student_skill_proficiencies[norm_name.lower()] = prof

    matched_skills = []
    missing_skills = []

    for req in required_skills:
        req_lower = req.lower()
        matched = False
        for s_name in student_skill_names:
            if req_lower in s_name or s_name in req_lower:
                matched_skills.append(req)
                matched = True
                break
        if not matched:
            missing_skills.append(req)

    match_percentage = (len(matched_skills) / len(required_skills)) * 100.0 if required_skills else 50.0

    # Determine primary gap area
    if any(k in missing_skills for k in ['Data Structures & Algorithms', 'DSA']):
        primary_gap = 'Data Structures & Algorithms'
    elif any(k in missing_skills for k in ['Spring Boot', 'Node.js', 'REST API', 'Django', 'Flask']):
        primary_gap = 'Backend Development & REST APIs'
    elif any(k in missing_skills for k in ['React', 'JavaScript', 'Tailwind CSS']):
        primary_gap = 'Frontend UI & Modern Web Frameworks'
    elif any(k in missing_skills for k in ['Docker', 'AWS', 'Kubernetes', 'Linux']):
        primary_gap = 'Cloud Infrastructure & DevOps'
    elif any(k in missing_skills for k in ['SQL', 'DBMS', 'PostgreSQL', 'MongoDB']):
        primary_gap = 'Database Management & Query Optimization'
    else:
        primary_gap = 'Advanced Problem Solving & System Integration'

    # Adapt roadmap templates based on missing skills
    roadmap = []
    for step in role_config['roadmap_templates']:
        roadmap.append({
            'week': step['week'],
            'title': step['title'],
            'topic': step['topic'],
            'description': step['desc'],
            'resources': [
                {'name': f"Oriental Placement Portal - {step['topic']} Module", 'type': 'Curriculum'},
                {'name': 'LeetCode / GeeksforGeeks Curated Practice Sheet', 'type': 'Problem Set'},
                {'name': 'Interactive Technical Quiz', 'type': 'Assessment'}
            ]
        })

    return {
        'target_role': target_role,
        'student_skills': list(student_skill_names),
        'required_skills': required_skills,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills,
        'match_percentage': round(match_percentage, 1),
        'primary_gap_area': primary_gap,
        'gap_summary': f"You match {len(matched_skills)} of {len(required_skills)} key competencies ({round(match_percentage, 1)}%). Your primary focus area should be {primary_gap}.",
        'roadmap': roadmap
    }
