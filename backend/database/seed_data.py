import os
import json
from datetime import datetime, date, timedelta
from backend.app import create_app
from backend.app.extensions import db, hash_password
from backend.app.models import (
    User, StudentProfile, AcademicRecord, SemesterRecord,
    Skill, StudentSkill, Certification, Internship, Project, Resume,
    Assessment, AssessmentQuestion, AssessmentResult,
    Company, CompanyCriteria, CompanySkill, Prediction, PredictionHistory,
    SkillGap, RoadmapTask, AdminActivityLog
)
from backend.app.services.prediction_service import run_placement_prediction_for_student

def seed_database():
    app = create_app()
    with app.app_context():
        print("Dropping existing tables and creating schema...")
        db.drop_all()
        db.create_all()

        print("1. Seeding Master Skills...")
        skills_data = [
            # Languages
            ('Java', 'languages', 'Core Java, OOP, Collections, Multithreading, JVM'),
            ('Python', 'languages', 'Python 3, Data Structures, OOP, Scripting'),
            ('C++', 'languages', 'Modern C++, STL, Pointers, Memory Management'),
            ('C', 'languages', 'Pointers, Memory, Structures, Systems Programming'),
            ('JavaScript', 'languages', 'ES6+, Async/Await, Promises, Closures, DOM'),
            ('TypeScript', 'languages', 'Type system, Generics, Interfaces, Modern TS'),
            
            # Core CS
            ('Data Structures & Algorithms', 'core_cs', 'Arrays, Linked Lists, Trees, Graphs, DP, Sorting'),
            ('DBMS', 'core_cs', 'Normalization, Relational Algebra, ACID, Transactions, Indexing'),
            ('Operating Systems', 'core_cs', 'Processes, Threads, Scheduling, Memory, Deadlocks'),
            ('Computer Networks', 'core_cs', 'OSI Model, TCP/IP, DNS, HTTP, Routing Protocols'),
            ('Object-Oriented Programming', 'core_cs', 'Abstraction, Encapsulation, Polymorphism, Inheritance'),

            # Databases
            ('SQL', 'database', 'Complex queries, Joins, Aggregations, Subqueries, Stored Procs'),
            ('MySQL', 'database', 'Relational database administration and query tuning'),
            ('PostgreSQL', 'database', 'Advanced relational database with JSONB and indexing'),
            ('MongoDB', 'database', 'NoSQL document store, Aggregation pipeline'),
            ('Redis', 'database', 'In-memory key-value caching and session storage'),

            # Backend
            ('REST API', 'backend', 'RESTful API principles, JSON, Status codes, Authentication'),
            ('Flask', 'backend', 'Python microframework, Blueprints, REST APIs'),
            ('Spring Boot', 'backend', 'Java enterprise framework, Spring Data JPA, Microservices'),
            ('Node.js', 'backend', 'Event-driven server-side runtime, Express.js'),
            ('Django', 'backend', 'Python web framework, ORM, Admin, Auth'),

            # Frontend
            ('React', 'frontend', 'Component lifecycle, Hooks, Context, Virtual DOM, Router'),
            ('HTML5 & CSS3', 'frontend', 'Semantic HTML, Flexbox, Grid, Responsive web design'),
            ('Tailwind CSS', 'frontend', 'Utility-first modern CSS framework'),

            # Cloud & DevOps
            ('Git & GitHub', 'cloud_devops', 'Version control, Branching, Pull Requests, Rebase'),
            ('Docker', 'cloud_devops', 'Containerization, Dockerfile, Docker Compose'),
            ('AWS', 'cloud_devops', 'EC2, S3, IAM, Cloud architecture fundamentals'),
            ('Linux', 'cloud_devops', 'Shell scripting, Bash, Permissions, CLI administration'),
            ('CI/CD', 'cloud_devops', 'GitHub Actions, automated build and test pipelines'),

            # AI & Data
            ('Pandas & NumPy', 'ai_ml', 'Data manipulation, vector calculations, cleaning'),
            ('Machine Learning', 'ai_ml', 'Supervised & Unsupervised modeling, Scikit-Learn'),
            ('Data Visualization', 'ai_ml', 'Matplotlib, Seaborn, Power BI, Dashboards'),

            # Soft Skills
            ('Verbal Communication', 'soft_skills', 'Clarity, articulation, technical presentation'),
            ('Problem Solving', 'soft_skills', 'Analytical reasoning, debugging, creative solutions'),
            ('Teamwork & Leadership', 'soft_skills', 'Collaboration, agile teamwork, initiative'),
            ('Time Management', 'soft_skills', 'Project delivery, prioritization, deadline discipline')
        ]

        skill_objs = {}
        for name, cat, desc in skills_data:
            s = Skill(name=name, category=cat, description=desc)
            db.session.add(s)
            skill_objs[name] = s
        db.session.flush()

        print("2. Seeding Placement Assessment Question Banks...")
        # 1. Aptitude Assessment
        apt_assessment = Assessment(
            title='Oriental Placement Aptitude Diagnostic Test',
            category='aptitude',
            sub_category='Quantitative & Logical Reasoning',
            description='Standard campus placement diagnostic test covering quantitative aptitude, number series, data interpretation, and deductive logic.',
            duration_minutes=30,
            total_marks=50,
            passing_marks=20,
            weight_percentage=20.0,
            difficulty='Medium'
        )
        db.session.add(apt_assessment)
        db.session.flush()

        apt_questions = [
            ("A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?",
             ["65 seconds", "89 seconds", "100 seconds", "150 seconds"], 1,
             "Speed = 240/24 = 10 m/s. Time to pass platform = (240 + 650) / 10 = 890 / 10 = 89 seconds.", 5),
            ("Find the next term in the series: 3, 7, 15, 31, 63, ?",
             ["127", "125", "129", "131"], 0,
             "Each number is multiplied by 2 and 1 is added: (63 * 2) + 1 = 127.", 5),
            ("If 6 workers can construct a wall in 12 days, how many days will 9 workers take working at the same pace?",
             ["6 days", "8 days", "9 days", "10 days"], 1,
             "Total Work = 6 * 12 = 72 worker-days. Days for 9 workers = 72 / 9 = 8 days.", 5),
            ("A pipe can fill a cistern in 6 hours and another can empty it in 8 hours. If both pipes are opened together, how long will it take to fill the cistern?",
             ["12 hours", "18 hours", "24 hours", "30 hours"], 2,
             "Net rate = 1/6 - 1/8 = 1/24 cistern per hour. Thus, 24 hours.", 5),
            ("In a class of 60 students, 40% are girls. How many boys are there in the class?",
             ["24", "36", "30", "42"], 1,
             "Boys percentage = 60%. Number of boys = 0.60 * 60 = 36.", 5),
            ("Find the odd one out: 27, 64, 125, 144, 216, 343",
             ["64", "144", "216", "343"], 1,
             "All numbers except 144 are perfect cubes (3^3, 4^3, 5^3, 6^3, 7^3). 144 is 12^2.", 5),
            ("If SOUTH-EAST becomes NORTH, NORTH-EAST becomes WEST and so on, what will WEST become?",
             ["SOUTH-EAST", "NORTH-EAST", "SOUTH-WEST", "NORTH-WEST"], 0,
             "The rotation is 135 degrees clockwise. West rotated 135 deg clockwise becomes South-East.", 5),
            ("What is the remainder when 2^50 is divided by 7?",
             ["1", "2", "4", "6"], 2,
             "2^3 = 8 = 1 (mod 7). 2^50 = (2^3)^16 * 2^2 = (1)^16 * 4 = 4.", 5),
            ("Pointing to a photograph, Rohit said, 'She is the daughter of my grandfather's only son.' How is Rohit related to the girl?",
             ["Cousin", "Brother", "Father", "Uncle"], 1,
             "Grandfather's only son is Rohit's father. Father's daughter is Rohit's sister, so Rohit is her brother.", 5),
            ("The average of 5 consecutive odd numbers is 27. What is the largest of these numbers?",
             ["29", "31", "33", "35"], 1,
             "Consecutive odd numbers with average 27 are: 23, 25, 27, 29, 31. Largest is 31.", 5)
        ]
        for q_text, opts, ans_idx, expl, marks in apt_questions:
            q = AssessmentQuestion(
                assessment_id=apt_assessment.id,
                question_text=q_text,
                options_json=json.dumps(opts),
                correct_option_index=ans_idx,
                explanation=expl,
                marks=marks
            )
            db.session.add(q)

        # 2. Technical & Core CS Assessment
        tech_assessment = Assessment(
            title='Core CS & Technical Foundations Assessment',
            category='technical',
            sub_category='DBMS, OS, OOP & Computer Networks',
            description='Comprehensive technical assessment covering database normalization, relational algebra, virtual memory, process synchronization, and OOP principles.',
            duration_minutes=35,
            total_marks=50,
            passing_marks=20,
            weight_percentage=25.0,
            difficulty='Medium'
        )
        db.session.add(tech_assessment)
        db.session.flush()

        tech_questions = [
            ("Which normal form eliminates partial dependency of non-prime attributes on candidate keys?",
             ["1NF", "2NF", "3NF", "BCNF"], 1,
             "Second Normal Form (2NF) requires that the table is in 1NF and all non-key attributes are fully functionally dependent on the primary key.", 5),
            ("In Operating Systems, what condition is NOT required for a deadlock to occur?",
             ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"], 2,
             "Deadlock requires 'No Preemption' (preemption not allowed). If preemption is allowed, deadlocks can be broken.", 5),
            ("Which OOP concept allows a subclass to provide a specific implementation of a method that is already defined in its superclass?",
             ["Method Overloading", "Method Overriding", "Encapsulation", "Abstraction"], 1,
             "Method Overriding allows runtime polymorphism where a subclass provides its own version of an inherited method.", 5),
            ("Which protocol operates at the Transport layer and provides reliable, connection-oriented data delivery?",
             ["UDP", "IP", "TCP", "ICMP"], 2,
             "TCP (Transmission Control Protocol) is connection-oriented and provides flow control, error checking, and sequenced delivery.", 5),
            ("What is the time complexity of searching an element in a balanced Binary Search Tree (AVL Tree)?",
             ["O(1)", "O(log n)", "O(n)", "O(n log n)"], 1,
             "A balanced BST has a height of O(log n), so search, insertion, and deletion operate in O(log n) time.", 5),
            ("Which SQL clause is used to filter the results of an aggregate function (e.g. GROUP BY)?",
             ["WHERE", "HAVING", "ORDER BY", "FILTER"], 1,
             "HAVING is used to filter rows after aggregation (GROUP BY), whereas WHERE filters rows before aggregation.", 5),
            ("What is Thrashing in Operating Systems?",
             ["A state where CPU spends more time swapping pages than executing processes", "A disk fragmentation issue", "A network collision error", "A CPU clock frequency surge"], 0,
             "Thrashing occurs when excessive page faults cause high paging activity, severely reducing CPU utilization.", 5),
            ("In Java / C++, which memory area stores dynamic memory allocated via 'new' / 'malloc'?",
             ["Stack Memory", "Heap Memory", "Code Segment", "Data Segment"], 1,
             "Dynamic memory allocation happens on the Heap.", 5),
            ("Which of the following is an ACID property in DBMS guaranteeing that either all transaction operations occur or none do?",
             ["Atomicity", "Consistency", "Isolation", "Durability"], 0,
             "Atomicity ensures all-or-nothing execution of a database transaction.", 5),
            ("What is the primary function of the Address Resolution Protocol (ARP)?",
             ["Translate Domain Name to IP address", "Translate IP address to MAC address", "Assign dynamic IP addresses", "Route packets between subnets"], 1,
             "ARP translates a network layer IP address into a link layer physical MAC address.", 5)
        ]
        for q_text, opts, ans_idx, expl, marks in tech_questions:
            q = AssessmentQuestion(
                assessment_id=tech_assessment.id,
                question_text=q_text,
                options_json=json.dumps(opts),
                correct_option_index=ans_idx,
                explanation=expl,
                marks=marks
            )
            db.session.add(q)

        # 3. Coding & DSA Assessment
        coding_assessment = Assessment(
            title='DSA & Algorithmic Problem Solving Assessment',
            category='coding',
            sub_category='Data Structures & Algorithm Design',
            description='Evaluates algorithmic problem solving, time/space complexity analysis, recursion, and core data structure manipulation.',
            duration_minutes=40,
            total_marks=50,
            passing_marks=25,
            weight_percentage=25.0,
            difficulty='Hard'
        )
        db.session.add(coding_assessment)
        db.session.flush()

        coding_questions = [
            ("What data structure is best suited to implement an Undo/Redo operation or evaluate postfix expressions?",
             ["Queue", "Stack", "Binary Tree", "Hash Map"], 1,
             "A Stack operates on LIFO (Last In First Out), making it ideal for Undo operations and expression evaluation.", 5),
            ("Which sorting algorithm has the best average-case and worst-case time complexity of O(n log n) and is stable?",
             ["Quick Sort", "Merge Sort", "Bubble Sort", "Selection Sort"], 1,
             "Merge Sort is a stable divide-and-conquer algorithm with guaranteed O(n log n) time in all cases.", 5),
            ("What is the worst-case lookup time in a Hash Table with poor hash function distribution (all collisions in one bucket)?",
             ["O(1)", "O(log n)", "O(n)", "O(n^2)"], 2,
             "If all keys hash to the same bucket, it degrades into a linked list search taking O(n) time.", 5),
            ("Which algorithmic paradigm does Dijkstra's Single Source Shortest Path algorithm follow?",
             ["Dynamic Programming", "Greedy Approach", "Divide and Conquer", "Backtracking"], 1,
             "Dijkstra's algorithm greedily chooses the unvisited vertex with the minimum distance at each step.", 5),
            ("What is the space complexity of Depth First Search (DFS) on a binary tree with maximum depth h?",
             ["O(1)", "O(h)", "O(n log n)", "O(2^h)"], 1,
             "The call stack memory during DFS traversal corresponds directly to the maximum height of the tree O(h).", 5),
            ("Which algorithm is used to detect a cycle in a Linked List in O(1) auxiliary space?",
             ["Kadane's Algorithm", "Floyd's Tortoise and Hare Algorithm", "KMP Algorithm", "Dijkstra's Algorithm"], 1,
             "Floyd's Cycle-Finding Algorithm uses two pointers (slow and fast) to detect cycles in O(n) time and O(1) space.", 5),
            ("In dynamic programming, what property allows a problem to be broken down into overlapping subproblems with optimal substructure?",
             ["Memoization / Tabulation", "Greedy Choice Property", "Branch and Bound", "Divide and Conquer"], 0,
             "Overlapping subproblems allow caching previous results via memoization or tabulation.", 5),
            ("What is the minimum number of queues needed to implement a Stack?",
             ["1", "2", "3", "Not possible"], 1,
             "A Stack can be implemented using 2 standard FIFO queues (by rotating elements during push or pop).", 5),
            ("Which graph traversal technique is utilized to find the shortest path in an unweighted graph?",
             ["Depth First Search (DFS)", "Breadth First Search (BFS)", "Topological Sort", "Kruskal's Algorithm"], 1,
             "BFS explores nodes level-by-level, finding the shortest unweighted path in O(V + E).", 5),
            ("What is the time complexity to find the maximum sum contiguous subarray using Kadane's algorithm?",
             ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], 2,
             "Kadane's algorithm scans the array in a single linear pass in O(n) time and O(1) space.", 5)
        ]
        for q_text, opts, ans_idx, expl, marks in coding_questions:
            q = AssessmentQuestion(
                assessment_id=coding_assessment.id,
                question_text=q_text,
                options_json=json.dumps(opts),
                correct_option_index=ans_idx,
                explanation=expl,
                marks=marks
            )
            db.session.add(q)

        # 4. Communication & Interview Readiness Assessment
        comm_assessment = Assessment(
            title='Placement Communication & Professional Interview Assessment',
            category='communication',
            sub_category='Verbal Communication & Behavioral Readiness',
            description='Evaluates professional communication etiquette, situational business judgment, STAR interview framing, and email/client interaction.',
            duration_minutes=25,
            total_marks=50,
            passing_marks=20,
            weight_percentage=15.0,
            difficulty='Easy'
        )
        db.session.add(comm_assessment)
        db.session.flush()

        comm_questions = [
            ("In a behavioral placement interview, what does the STAR technique stand for?",
             ["Subject, Topic, Action, Result", "Situation, Task, Action, Result", "Strategy, Team, Analysis, Report", "Scenario, Timeline, Achievement, Review"], 1,
             "STAR stands for Situation, Task, Action, and Result - the gold standard framework for structuring competency interview responses.", 5),
            ("When an interviewer asks 'Tell me about a time you faced a technical roadblock', what is the most effective approach?",
             ["Explain that you never make mistakes", "Describe the problem, the specific debugging actions you took, and the measurable outcome/learning", "Blame your team members for the failure", "State that technical issues are normal and change the topic"], 1,
             "Highlight problem-solving initiative, structured troubleshooting, and key learnings.", 5),
            ("Choose the grammatically correct sentence for professional communication:",
             ["Each of the project team members are responsible for their tasks.", "Each of the project team members is responsible for their task.", "Each of the project team members were responsible for their task.", "Each of the project team member is responsible."], 1,
             "'Each' is singular and takes a singular verb 'is'.", 5),
            ("During a Group Discussion (GD) in campus placements, what is the best strategy when you disagree with a peer?",
             ["Interrupt them loudly to prove your point", "Politely acknowledge their perspective and state your reasoned counter-view with facts", "Remain silent and withdraw from discussion", "Dismiss their point as invalid immediately"], 1,
             "Professional GD etiquette requires active listening, constructive acknowledgement, and structured rebuttal with evidence.", 5),
            ("What is the most professional way to conclude a technical interview when the interviewer asks 'Do you have any questions for us?'",
             ["Say 'No, I am good.'", "Ask insightful questions about the tech stack, engineering challenges, or team onboarding practices", "Ask how much bonus you will get on day one", "Ask why the company is struggling in the market"], 1,
             "Asking thoughtful questions demonstrates genuine curiosity, preparation, and long-term interest in the role.", 5),
            ("Identify the correct synonym for 'MITIGATE':",
             ["Aggravate", "Alleviate / Reduce", "Destroy", "Complicate"], 1,
             "Mitigate means to make less severe, serious, or painful (to alleviate).", 5),
            ("In professional email correspondence, when should you use 'BCC' (Blind Carbon Copy)?",
             ["When you want everyone to reply to all", "When sending to a large recipient list to protect recipient privacy and prevent reply storms", "For urgent escalation emails only", "Never in business communication"], 1,
             "BCC keeps recipient addresses private and prevents inadvertent reply-all clutter.", 5),
            ("If you do not know the answer to a tricky technical question in an interview, you should:",
             ["Guess randomly with false confidence", "Acknowledge that you are unsure, but explain your logical thought process on how you would deduce or find the answer", "Refuse to speak further", "Complain that the syllabus didn't cover this"], 1,
             "Demonstrating transparent analytical reasoning and problem-solving method is highly valued by interviewers.", 5),
            ("Which tone is most suitable for communicating project status updates to clients and stakeholders?",
             ["Overly casual and humorous", "Professional, clear, concise, and outcome-oriented", "Aggressive and defensive", "Cryptic with heavy unexplained jargon"], 1,
             "Stakeholder communication must be objective, concise, and focused on deliverables.", 5),
            ("Identify the antonym for 'PRAGMATIC':",
             ["Practical", "Realistic", "Idealistic / Impractical", "Sensible"], 2,
             "Pragmatic means dealing with things sensibly and realistically. Its antonym is idealistic or impractical.", 5)
        ]
        for q_text, opts, ans_idx, expl, marks in comm_questions:
            q = AssessmentQuestion(
                assessment_id=comm_assessment.id,
                question_text=q_text,
                options_json=json.dumps(opts),
                correct_option_index=ans_idx,
                explanation=expl,
                marks=marks
            )
            db.session.add(q)

        print("3. Seeding Realistic Recruiting Companies for Oriental Institute Drives...")
        companies_seed = [
            {
                'name': 'Tata Consultancy Services (TCS)',
                'logo_url': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
                'industry': 'IT Services & Consulting',
                'website': 'https://www.tcs.com',
                'tier': 'Tier 1',
                'job_role': 'System Engineer / Digital Innovator',
                'job_location': 'Pan India / Bhopal / Indore / Pune',
                'ctc_min_lpa': 3.6,
                'ctc_max_lpa': 7.5,
                'drive_status': 'Active',
                'drive_date': date.today() + timedelta(days=14),
                'registration_deadline': date.today() + timedelta(days=7),
                'description': 'TCS National Qualifier Test (NQT) campus drive for Oriental Group of Institutes. Hiring across Ninja, Digital, and Prime engineering packages.',
                'selection_process': '1. TCS NQT (Aptitude + Advanced Coding)\n2. Technical Interview\n3. HR & Managerial Interview',
                'min_cgpa': 6.5,
                'min_tenth': 60.0,
                'min_twelfth': 60.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'EC', 'ME', 'EX', 'CE', 'AIML'],
                'skills': [('Java', 'Mandatory'), ('SQL', 'Mandatory'), ('Data Structures & Algorithms', 'Mandatory'), ('Python', 'Preferred'), ('Verbal Communication', 'Mandatory')]
            },
            {
                'name': 'Infosys Limited',
                'logo_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150',
                'industry': 'Information Technology',
                'website': 'https://www.infosys.com',
                'tier': 'Tier 1',
                'job_role': 'Specialist Programmer / System Engineer',
                'job_location': 'Bangalore / Pune / Hyderabad / Indore',
                'ctc_min_lpa': 4.0,
                'ctc_max_lpa': 9.5,
                'drive_status': 'Upcoming',
                'drive_date': date.today() + timedelta(days=21),
                'registration_deadline': date.today() + timedelta(days=12),
                'description': 'Infosys HackWithInfy & Campus recruitment for Specialist Programmer (SP) and Digital Specialist Engineer (DSE) roles.',
                'selection_process': '1. Online Coding Round (3 DSA questions)\n2. Deep Technical Interview\n3. Behavioral Round',
                'min_cgpa': 7.0,
                'min_tenth': 65.0,
                'min_twelfth': 65.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'EC', 'AIML'],
                'skills': [('Data Structures & Algorithms', 'Mandatory'), ('Java', 'Mandatory'), ('C++', 'Preferred'), ('DBMS', 'Mandatory'), ('Problem Solving', 'Mandatory')]
            },
            {
                'name': 'Wipro Technologies',
                'logo_url': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150',
                'industry': 'IT Services & Consulting',
                'website': 'https://www.wipro.com',
                'tier': 'Tier 1',
                'job_role': 'Project Engineer (Elite & Turbo)',
                'job_location': 'Bangalore / Pune / Chennai / Gurgaon',
                'ctc_min_lpa': 3.5,
                'ctc_max_lpa': 6.5,
                'drive_status': 'Active',
                'drive_date': date.today() + timedelta(days=18),
                'registration_deadline': date.today() + timedelta(days=9),
                'description': 'Wipro Elite National Talent Hunt (NLTH) hiring engineering graduates for cloud, full-stack, and application engineering streams.',
                'selection_process': '1. Online Assessment (Aptitude, Essay, Coding)\n2. Technical Interview\n3. HR Round',
                'min_cgpa': 6.0,
                'min_tenth': 60.0,
                'min_twelfth': 60.0,
                'max_backlogs': 1,
                'branches': ['CSE', 'IT', 'EC', 'ME', 'EX', 'CE', 'AIML'],
                'skills': [('Java', 'Mandatory'), ('Python', 'Preferred'), ('SQL', 'Mandatory'), ('Verbal Communication', 'Mandatory')]
            },
            {
                'name': 'Cognizant Technology Solutions',
                'logo_url': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=150',
                'industry': 'Digital Engineering & IT',
                'website': 'https://www.cognizant.com',
                'tier': 'Tier 1',
                'job_role': 'GenC Elevate / GenC Next Software Engineer',
                'job_location': 'Pune / Bangalore / Hyderabad / Kolkata',
                'ctc_min_lpa': 4.5,
                'ctc_max_lpa': 7.0,
                'drive_status': 'Upcoming',
                'drive_date': date.today() + timedelta(days=28),
                'registration_deadline': date.today() + timedelta(days=16),
                'description': 'Cognizant GenC Elevate campus drive for full-stack developers, cloud practitioners, and test automation engineers.',
                'selection_process': '1. GenC Skill Assessment (Aptitude + Full Stack Coding)\n2. Technical SME Interview\n3. HR Verification',
                'min_cgpa': 6.8,
                'min_tenth': 60.0,
                'min_twelfth': 60.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'EC', 'AIML'],
                'skills': [('Java', 'Mandatory'), ('SQL', 'Mandatory'), ('React', 'Preferred'), ('REST API', 'Mandatory'), ('DBMS', 'Mandatory')]
            },
            {
                'name': 'Persistent Systems',
                'logo_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
                'industry': 'Software Product Engineering',
                'website': 'https://www.persistent.com',
                'tier': 'Dream',
                'job_role': 'Software Development Engineer (SDE)',
                'job_location': 'Pune / Goa / Hyderabad / Bangalore',
                'ctc_min_lpa': 6.5,
                'ctc_max_lpa': 9.0,
                'drive_status': 'Upcoming',
                'drive_date': date.today() + timedelta(days=35),
                'registration_deadline': date.today() + timedelta(days=22),
                'description': 'Persistent Systems product engineering drive for core software engineers with deep algorithmic and backend design acumen.',
                'selection_process': '1. Advanced Coding Assessment\n2. Technical Round 1 (DSA & Core CS)\n3. Technical Round 2 (System Architecture & Live Coding)\n4. HR Discussion',
                'min_cgpa': 7.5,
                'min_tenth': 70.0,
                'min_twelfth': 70.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'AIML'],
                'skills': [('Data Structures & Algorithms', 'Mandatory'), ('Java', 'Mandatory'), ('Spring Boot', 'Preferred'), ('Docker', 'Preferred'), ('MySQL', 'Mandatory')]
            },
            {
                'name': 'Capgemini Technology Services',
                'logo_url': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150',
                'industry': 'Consulting & Technology',
                'website': 'https://www.capgemini.com',
                'tier': 'Tier 1',
                'job_role': 'Analyst / Senior Analyst',
                'job_location': 'Mumbai / Pune / Bangalore / Noida',
                'ctc_min_lpa': 4.25,
                'ctc_max_lpa': 7.5,
                'drive_status': 'Ongoing',
                'drive_date': date.today() + timedelta(days=5),
                'registration_deadline': date.today() + timedelta(days=1),
                'description': 'Capgemini Excellence Drive offering Analyst (4.25 LPA) and Senior Analyst (7.5 LPA) profiles for Oriental Bhopal students.',
                'selection_process': '1. Pseudo-code & Technical MCQ\n2. English Communication Test\n3. Game-based Aptitude\n4. Technical & HR Interview',
                'min_cgpa': 6.5,
                'min_tenth': 60.0,
                'min_twelfth': 60.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'EC', 'ME', 'EX', 'AIML'],
                'skills': [('Python', 'Preferred'), ('Java', 'Mandatory'), ('SQL', 'Mandatory'), ('Problem Solving', 'Mandatory')]
            },
            {
                'name': 'Hexaware Technologies',
                'logo_url': 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
                'industry': 'Cloud & Automation Services',
                'website': 'https://www.hexaware.com',
                'tier': 'Tier 1',
                'job_role': 'Graduate Engineer Trainee (GET) - Cloud & Full Stack',
                'job_location': 'Chennai / Mumbai / Pune',
                'ctc_min_lpa': 4.0,
                'ctc_max_lpa': 6.0,
                'drive_status': 'Active',
                'drive_date': date.today() + timedelta(days=10),
                'registration_deadline': date.today() + timedelta(days=4),
                'description': 'GET recruitment program focusing on modern cloud frameworks, automation testing, and full stack microservices.',
                'selection_process': '1. Aptitude & Domain Test\n2. Communication Assessment\n3. Technical Interview\n4. HR Interview',
                'min_cgpa': 6.0,
                'min_tenth': 60.0,
                'min_twelfth': 60.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'EC', 'EX', 'AIML'],
                'skills': [('JavaScript', 'Preferred'), ('Java', 'Mandatory'), ('SQL', 'Mandatory'), ('Git & GitHub', 'Preferred')]
            },
            {
                'name': 'Cisco Systems',
                'logo_url': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=150',
                'industry': 'Networking & Cloud Infrastructure',
                'website': 'https://www.cisco.com',
                'tier': 'Super Dream',
                'job_role': 'Software Consulting Engineer / Network SDE',
                'job_location': 'Bangalore / Remote',
                'ctc_min_lpa': 12.0,
                'ctc_max_lpa': 18.0,
                'drive_status': 'Upcoming',
                'drive_date': date.today() + timedelta(days=45),
                'registration_deadline': date.today() + timedelta(days=30),
                'description': 'Cisco high-tier campus hiring for Network Automation, Cloud Infrastructure, and Core Systems software developers.',
                'selection_process': '1. Cisco Online Challenge (Advanced Coding + Computer Networks)\n2. Technical Rounds 1 & 2\n3. Managerial & Culture Fit Round',
                'min_cgpa': 8.0,
                'min_tenth': 75.0,
                'min_twelfth': 75.0,
                'max_backlogs': 0,
                'branches': ['CSE', 'IT', 'EC', 'AIML'],
                'skills': [('Computer Networks', 'Mandatory'), ('Python', 'Mandatory'), ('Linux', 'Mandatory'), ('C++', 'Preferred'), ('Docker', 'Preferred')]
            }
        ]

        for c_data in companies_seed:
            comp = Company(
                name=c_data['name'],
                logo_url=c_data['logo_url'],
                industry=c_data['industry'],
                website=c_data['website'],
                tier=c_data['tier'],
                job_role=c_data['job_role'],
                job_location=c_data['job_location'],
                ctc_min_lpa=c_data['ctc_min_lpa'],
                ctc_max_lpa=c_data['ctc_max_lpa'],
                drive_status=c_data['drive_status'],
                drive_date=c_data['drive_date'],
                registration_deadline=c_data['registration_deadline'],
                description=c_data['description'],
                selection_process=c_data['selection_process']
            )
            db.session.add(comp)
            db.session.flush()

            crit = CompanyCriteria(
                company_id=comp.id,
                min_cgpa=c_data['min_cgpa'],
                min_tenth_percentage=c_data['min_tenth'],
                min_twelfth_percentage=c_data['min_twelfth'],
                max_active_backlogs=c_data['max_backlogs'],
                eligible_branches_json=json.dumps(c_data['branches'])
            )
            db.session.add(crit)

            for s_name, imp in c_data['skills']:
                c_skill = CompanySkill(company_id=comp.id, skill_name=s_name, importance=imp)
                db.session.add(c_skill)

        print("4. Seeding Admin & Student User Accounts...")
        # 1. Admin / TPO Account
        admin_pwd = hash_password('Admin@123')
        admin_user = User(email='admin@oriental.ac.in', password_hash=admin_pwd, role='admin')
        db.session.add(admin_user)
        db.session.flush()

        admin_log = AdminActivityLog(
            user_id=admin_user.id,
            action='SYSTEM_INITIALIZED',
            target_type='System',
            details='Oriental Placement Intelligence Platform seeded and initialized.'
        )
        db.session.add(admin_log)

        # 2. Main Demo Student Account
        student_pwd = hash_password('Student@123')
        student_user = User(email='student@oriental.ac.in', password_hash=student_pwd, role='student')
        db.session.add(student_user)
        db.session.flush()

        main_student = StudentProfile(
            user_id=student_user.id,
            enrollment_no='0105CS211045',
            full_name='Priyanshu Sharma',
            phone='+91 98765 43210',
            gender='Male',
            date_of_birth=date(2003, 7, 14),
            address='Oriental Campus Hostel, Opp Patel Nagar',
            city='Bhopal',
            state='Madhya Pradesh',
            branch='CSE',
            degree='B.Tech',
            current_semester=7,
            passing_year=2026,
            target_role='Software Developer',
            bio='Aspiring Software Developer passionate about full-stack development, distributed systems, and algorithmic problem solving at OIST Bhopal.',
            avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        )
        db.session.add(main_student)
        db.session.flush()

        main_academic = AcademicRecord(
            student_id=main_student.id,
            current_cgpa=7.84,
            tenth_percentage=88.5,
            twelfth_percentage=84.2,
            active_backlogs=0,
            history_backlogs=0,
            attendance_percentage=88.0
        )
        db.session.add(main_academic)

        # Semester SGPAs
        sem_sgpas = [7.20, 7.45, 7.60, 7.85, 8.10, 8.25]
        for sem_idx, sgpa in enumerate(sem_sgpas, 1):
            sem_rec = SemesterRecord(
                student_id=main_student.id,
                semester_number=sem_idx,
                sgpa=sgpa,
                percentage=round(sgpa * 9.5, 2),
                credits=24.0,
                backlogs_in_sem=0,
                subjects_passed=6
            )
            db.session.add(sem_rec)

        # Associate student skills
        priyanshu_skills = [
            ('Java', 'Advanced', 80, 24),
            ('Data Structures & Algorithms', 'Advanced', 85, 20),
            ('Python', 'Intermediate', 65, 14),
            ('SQL', 'Advanced', 80, 18),
            ('DBMS', 'Advanced', 75, 18),
            ('React', 'Intermediate', 65, 10),
            ('REST API', 'Intermediate', 60, 8),
            ('Git & GitHub', 'Advanced', 85, 24),
            ('Operating Systems', 'Intermediate', 70, 12),
            ('Verbal Communication', 'Advanced', 80, 24),
            ('Problem Solving', 'Advanced', 85, 24)
        ]
        for s_name, prof, p_score, exp in priyanshu_skills:
            if s_name in skill_objs:
                st_skill = StudentSkill(
                    student_id=main_student.id,
                    skill_id=skill_objs[s_name].id,
                    proficiency=prof,
                    proficiency_score=p_score,
                    experience_months=exp
                )
                db.session.add(st_skill)

        # Projects
        p1 = Project(
            student_id=main_student.id,
            title='Campus Placement Intelligence & Prediction Platform',
            category='Web Application',
            technologies='React, Flask, Scikit-Learn, SQLite/MySQL, Tailwind CSS',
            github_url='https://github.com/oriental-student/placement-intelligence',
            live_url='https://oriental-placement.internal.oriental.ac.in',
            description='Engineered an AI-driven student placement readiness evaluation and ML prediction dashboard with dynamic SGPA trajectory modeling and ATS resume analyzer.',
            team_size=1,
            complexity='Advanced',
            complexity_score=92
        )
        p2 = Project(
            student_id=main_student.id,
            title='Distributed Cloud File Storage with Role-Based Access',
            category='Cloud / Backend',
            technologies='Java, Spring Boot, MySQL, Docker, AWS S3',
            github_url='https://github.com/oriental-student/cloud-storage-engine',
            live_url='',
            description='Built a high-throughput microservice backend for secure file storage with encrypted AES-256 chunking and JWT authentication.',
            team_size=2,
            complexity='Intermediate',
            complexity_score=78
        )
        db.session.add(p1)
        db.session.add(p2)

        # Internship
        intern1 = Internship(
            student_id=main_student.id,
            company_name='Netlink Software Group, Bhopal',
            role='Software Engineering Intern (Backend)',
            location='Bhopal, MP',
            duration_months=3,
            start_date=date(2025, 5, 1),
            end_date=date(2025, 7, 31),
            technologies='Java, Spring Boot, PostgreSQL, Git, Postman',
            description='Contributed to RESTful API endpoints for enterprise workflow automation, optimized database indexing reducing query latency by 28%.'
        )
        db.session.add(intern1)

        # Certifications
        c1 = Certification(
            student_id=main_student.id,
            title='AWS Certified Cloud Practitioner (CLF-C02)',
            issuing_organization='Amazon Web Services',
            issue_date=date(2025, 2, 10),
            credential_id='AWS-CLF-9928172',
            credential_url='https://aws.amazon.com/verification',
            skills_covered='AWS EC2, S3, IAM, Cloud Architecture'
        )
        c2 = Certification(
            student_id=main_student.id,
            title='Mastering Data Structures & Algorithms in Java',
            issuing_organization='GeeksforGeeks / Coursera',
            issue_date=date(2024, 11, 15),
            credential_id='GFG-DSA-77821',
            credential_url='',
            skills_covered='Trees, Graphs, DP, Sorting, Hashing'
        )
        db.session.add(c1)
        db.session.add(c2)

        # Resume record
        res = Resume(
            student_id=main_student.id,
            filename='Priyanshu_Sharma_Resume_OIST.pdf',
            file_path=os.path.join(app.config['UPLOAD_FOLDER'], 'resume_0105CS211045.pdf'),
            file_size_kb=142.5,
            ats_score=84,
            ats_breakdown_json=json.dumps({
                'sections_score': 95,
                'keywords_score': 85,
                'action_verbs_score': 80,
                'detected_skills_count': 11,
                'detected_verbs_count': 7
            }),
            detected_skills_json=json.dumps(['Java', 'Python', 'SQL', 'React', 'Flask', 'Git', 'AWS', 'DSA', 'DBMS', 'REST API']),
            recommendations_json=json.dumps([
                "High ATS score! Excellent layout and relevant keyword density for software engineering drives.",
                "Consider adding metrics to project descriptions (e.g. 'Improved query latency by 28%')."
            ]),
            is_active=True
        )
        db.session.add(res)

        # Assessment Results for student
        r1 = AssessmentResult(
            student_id=main_student.id,
            assessment_id=apt_assessment.id,
            score=45.0,
            max_score=50.0,
            percentage=90.0,
            category='aptitude',
            passed=True,
            time_taken_seconds=1140
        )
        r2 = AssessmentResult(
            student_id=main_student.id,
            assessment_id=tech_assessment.id,
            score=40.0,
            max_score=50.0,
            percentage=80.0,
            category='technical',
            passed=True,
            time_taken_seconds=1380
        )
        r3 = AssessmentResult(
            student_id=main_student.id,
            assessment_id=coding_assessment.id,
            score=42.0,
            max_score=50.0,
            percentage=84.0,
            category='coding',
            passed=True,
            time_taken_seconds=1620
        )
        r4 = AssessmentResult(
            student_id=main_student.id,
            assessment_id=comm_assessment.id,
            score=45.0,
            max_score=50.0,
            percentage=90.0,
            category='communication',
            passed=True,
            time_taken_seconds=980
        )
        db.session.add(r1)
        db.session.add(r2)
        db.session.add(r3)
        db.session.add(r4)

        db.session.commit()

        # Run Prediction for main student
        print("5. Running initial ML prediction for demo student...")
        run_placement_prediction_for_student(main_student)

        # Seed additional cohort students for rich TPO admin dashboard
        print("6. Seeding cohort students across Oriental Bhopal departments...")
        cohort_data = [
            ('Aakash Patel', '0105CS211002', 'aakash.patel@oriental.ac.in', 'CSE', 8.52, 0, 86.0, 'Full Stack Developer', 88.0, 86.0, 'Strong'),
            ('Sneha Mishra', '0105IT211018', 'sneha.mishra@oriental.ac.in', 'IT', 9.15, 0, 94.0, 'Software Developer', 94.5, 92.0, 'Excellent'),
            ('Rohan Gupta', '0105EC211032', 'rohan.gupta@oriental.ac.in', 'EC', 7.12, 0, 78.0, 'Embedded & IoT Systems Engineer', 68.0, 66.0, 'Moderate'),
            ('Ananya Verma', '0105AI211009', 'ananya.verma@oriental.ac.in', 'AIML', 8.78, 0, 91.0, 'Data Analyst / AI Engineer', 90.0, 88.0, 'Excellent'),
            ('Deepak Sen', '0105ME211015', 'deepak.sen@oriental.ac.in', 'ME', 6.45, 1, 72.0, 'Technical Consultant', 48.0, 46.0, 'Developing'),
            ('Pooja Saxena', '0105EX211022', 'pooja.saxena@oriental.ac.in', 'EX', 7.60, 0, 84.0, 'Software Developer', 74.0, 72.0, 'Moderate'),
            ('Vikram Rathore', '0105CE211004', 'vikram.rathore@oriental.ac.in', 'CE', 6.10, 2, 68.0, 'QA & Automation Engineer', 38.0, 36.0, 'Needs Improvement'),
            ('Neha Chouhan', '0105CS211068', 'neha.chouhan@oriental.ac.in', 'CSE', 8.24, 0, 89.0, 'Backend Engineer', 84.0, 82.0, 'Strong'),
            ('Manish Tiwari', '0105IT211044', 'manish.tiwari@oriental.ac.in', 'IT', 7.35, 0, 80.0, 'Cloud & DevOps Engineer', 70.0, 69.0, 'Moderate'),
            ('Ritika Jain', '0105AIML211030', 'ritika.jain@oriental.ac.in', 'AIML', 8.92, 0, 92.0, 'Data Analyst / AI Engineer', 91.0, 89.0, 'Excellent')
        ]

        for name, enroll, email, branch, cgpa, backlogs, att, role, prob, read_score, read_tier in cohort_data:
            u = User(email=email, password_hash=student_pwd, role='student')
            db.session.add(u)
            db.session.flush()

            st = StudentProfile(
                user_id=u.id,
                enrollment_no=enroll,
                full_name=name,
                branch=branch,
                degree='B.Tech',
                current_semester=7,
                passing_year=2026,
                target_role=role,
                profile_completion=85.0
            )
            db.session.add(st)
            db.session.flush()

            ac = AcademicRecord(
                student_id=st.id,
                current_cgpa=cgpa,
                tenth_percentage=cgpa * 9.2,
                twelfth_percentage=cgpa * 8.8,
                active_backlogs=backlogs,
                history_backlogs=backlogs,
                attendance_percentage=att
            )
            db.session.add(ac)

            # Associate default skills
            for s_k in ['Java', 'SQL', 'Data Structures & Algorithms', 'Verbal Communication', 'Problem Solving']:
                if s_k in skill_objs:
                    ssk = StudentSkill(
                        student_id=st.id,
                        skill_id=skill_objs[s_k].id,
                        proficiency='Intermediate',
                        proficiency_score=65,
                        experience_months=12
                    )
                    db.session.add(ssk)

            # Prediction record
            pred = Prediction(
                student_id=st.id,
                placement_probability=prob,
                readiness_score=read_score,
                readiness_level=read_tier,
                confidence_score=85.0,
                best_fit_role=role,
                alternative_roles_json=json.dumps(['Software Developer', 'Backend Engineer', 'Data Analyst / AI Engineer']),
                academic_score=cgpa * 10.0,
                technical_score=read_score * 0.95,
                coding_score=read_score * 0.90,
                communication_score=att * 0.95,
                projects_score=75.0,
                internships_score=60.0,
                certifications_score=50.0,
                resume_score=72.0,
                projected_final_cgpa=round(min(9.9, cgpa + 0.2), 2),
                is_demo=True
            )
            db.session.add(pred)

        db.session.commit()
        print("Database successfully seeded with comprehensive Oriental Institute institutional placement data!")

if __name__ == '__main__':
    seed_database()
