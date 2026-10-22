import unittest
import json
from backend.app import create_app
from backend.app.extensions import db

class TestPlacementSystemAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_01_health_check(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'healthy')
        print("[PASS] Health Check Passed")

    def test_02_student_login(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'student@oriental.ac.in',
            'password': 'Student@123'
        })
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn('access_token', data)
        self.assertEqual(data['user']['role'], 'student')
        self.assertEqual(data['student']['enrollment_no'], '0105CS211045')
        print("[PASS] Student Login Passed")

    def test_03_admin_login_and_stats(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'admin@oriental.ac.in',
            'password': 'Admin@123'
        })
        self.assertEqual(res.status_code, 200)
        token = json.loads(res.data)['access_token']

        # Get stats
        stats_res = self.client.get('/api/admin/statistics', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(stats_res.status_code, 200)
        stats_data = json.loads(stats_res.data)
        self.assertGreater(stats_data['overview']['total_students'], 0)
        print("[PASS] Admin Login & Stats Passed")

    def test_04_prediction_pipeline(self):
        # Login student
        res = self.client.post('/api/auth/login', json={
            'email': 'student@oriental.ac.in',
            'password': 'Student@123'
        })
        token = json.loads(res.data)['access_token']

        # Run Prediction
        pred_res = self.client.post('/api/prediction/run', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(pred_res.status_code, 201)
        pred_data = json.loads(pred_res.data)['prediction']
        self.assertGreater(pred_data['placement_probability'], 0)
        self.assertGreater(pred_data['readiness_score'], 0)
        self.assertIn('best_fit_role', pred_data)
        print(f"[PASS] ML Placement Prediction Passed -> Probability: {pred_data['placement_probability']}%, Readiness: {pred_data['readiness_score']}")

    def test_05_company_eligibility(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'student@oriental.ac.in',
            'password': 'Student@123'
        })
        token = json.loads(res.data)['access_token']

        comp_res = self.client.get('/api/companies', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(comp_res.status_code, 200)
        comps = json.loads(comp_res.data)['companies']
        self.assertGreater(len(comps), 0)
        self.assertIn('student_status', comps[0])
        print(f"[PASS] Company Eligibility Engine Passed -> Evaluated {len(comps)} companies")

    def test_06_skill_gap_analysis(self):
        res = self.client.post('/api/auth/login', json={
            'email': 'student@oriental.ac.in',
            'password': 'Student@123'
        })
        token = json.loads(res.data)['access_token']

        gap_res = self.client.get('/api/skill-gap', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(gap_res.status_code, 200)
        gap_data = json.loads(gap_res.data)
        self.assertIn('analysis', gap_data)
        self.assertIn('roadmap_tasks', gap_data)
        print(f"[PASS] Skill-Gap & Roadmap Passed -> Primary Gap: {gap_data['analysis']['primary_gap_area']}")

if __name__ == '__main__':
    unittest.main()
