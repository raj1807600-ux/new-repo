import React, { useState, useEffect } from 'react';
import { assessmentAPI, predictionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BrainCircuit,
  Timer,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Award,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

const AssessmentsPage = () => {
  const { refreshProfile } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [categoryAverages, setCategoryAverages] = useState({});
  const [loading, setLoading] = useState(true);

  // Active quiz session state
  const [activeQuiz, setActiveQuiz] = useState(null); // Assessment object
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // question_id -> chosen index
  const [timeLeft, setTimeLeft] = useState(0);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResultSummary, setQuizResultSummary] = useState(null);

  useEffect(() => {
    fetchAssessmentsData();
  }, []);

  // Timer interval for active test
  useEffect(() => {
    let timer;
    if (activeQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft]);

  const fetchAssessmentsData = async () => {
    setLoading(true);
    try {
      const [assRes, resRes] = await Promise.all([
        assessmentAPI.getAssessments(),
        assessmentAPI.getStudentResults()
      ]);
      setAssessments(assRes.data.assessments || []);
      setStudentResults(resRes.data.results || []);
      setCategoryAverages(resRes.data.category_averages || {});
    } catch (err) {
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (assessment) => {
    try {
      const res = await assessmentAPI.getAssessmentDetail(assessment.id, false);
      setActiveQuiz(res.data.assessment);
      setQuizQuestions(res.data.questions || []);
      setCurrentQIndex(0);
      setUserAnswers({});
      setTimeLeft(res.data.assessment.duration_minutes * 60);
      setQuizResultSummary(null);
    } catch (err) {
      console.error('Error starting test:', err);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex
    });
  };

  const handleAutoSubmitQuiz = async () => {
    if (!activeQuiz) return;
    submitQuizPayload();
  };

  const handleManualSubmit = () => {
    if (window.confirm('Are you sure you want to submit your assessment responses?')) {
      submitQuizPayload();
    }
  };

  const submitQuizPayload = async () => {
    setSubmittingQuiz(true);
    try {
      const timeSpent = activeQuiz.duration_minutes * 60 - timeLeft;
      const res = await assessmentAPI.submitAssessment(activeQuiz.id, {
        answers: userAnswers,
        time_taken_seconds: timeSpent
      });

      setQuizResultSummary(res.data);
      // Auto refresh profile & recalculate ML prediction
      await predictionAPI.runPrediction();
      await refreshProfile();
      await fetchAssessmentsData();
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading placement diagnostic assessment banks...</span>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ RUNNER VIEW
  if (activeQuiz) {
    if (quizResultSummary) {
      return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="font-display font-extrabold text-2xl text-slate-900">
              Assessment Completed!
            </h2>
            <p className="text-xs text-slate-500">
              Your test results have been evaluated and integrated into your AI Placement Readiness Profile.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Score Earned</span>
                <span className="text-xl font-bold text-slate-800">
                  {quizResultSummary.result.score} / {quizResultSummary.result.max_score}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Percentage</span>
                <span className="text-xl font-extrabold text-teal-600">
                  {quizResultSummary.result.percentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Result</span>
                <span className="text-sm font-bold text-emerald-600 block mt-1">
                  {quizResultSummary.result.passed ? 'PASSED' : 'NEEDS PRACTICE'}
                </span>
              </div>
            </div>

            <button
              onClick={() => { setActiveQuiz(null); setQuizResultSummary(null); }}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Assessment Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    const currentQ = quizQuestions[currentQIndex];

    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
        
        {/* Test Header with Timer */}
        <div className="bg-oriental-navy text-white p-4 sm:p-6 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
              {activeQuiz.category.toUpperCase()} DIAGNOSTIC
            </span>
            <h2 className="font-bold text-sm sm:text-base text-white">{activeQuiz.title}</h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-xs font-bold text-amber-300">
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Container */}
        {currentQ && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-teal-700">
                Question {currentQIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentQ.marks || 5} Marks
              </span>
            </div>

            <h3 className="font-semibold text-sm sm:text-base text-slate-800 leading-relaxed">
              {currentQ.question_text}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options?.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>

            {/* Pagination / Submit Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(currentQIndex - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQIndex < quizQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex(currentQIndex + 1)}
                    className="px-5 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl transition-all"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submittingQuiz}
                    onClick={handleManualSubmit}
                    className="px-6 py-2 text-xs font-bold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 rounded-xl shadow-md transition-all"
                  >
                    {submittingQuiz ? 'Evaluating...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    );
  }

  // DEFAULT DASHBOARD VIEW
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">
            Placement Diagnostic Assessment Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate actual company recruitment test patterns (TCS, Infosys, Cisco) across Aptitude, DSA, and Technical fundamentals.
          </p>
        </div>

        {/* Diagnostic Score Summary */}
        <div className="flex items-center gap-2">
          {Object.entries(categoryAverages).map(([cat, avg]) => (
            <div key={cat} className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">{cat}</span>
              <span className="text-xs font-extrabold text-teal-700">{avg}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Assessment Test Banks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((ass) => (
          <div key={ass.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                  {ass.category} • {ass.difficulty}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Timer className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ass.duration_minutes} Mins</span>
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{ass.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ass.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                <span>{ass.questions_count} Questions • {ass.total_marks} Marks</span>
              </div>

              <button
                onClick={() => startAssessment(ass)}
                className="px-4 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                <span>Start Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Past Assessment Result History */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Your Assessment History ({studentResults.length})
        </h3>

        {studentResults.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {studentResults.map((res) => (
              <div key={res.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{res.assessment_title}</h4>
                  <p className="text-[11px] text-slate-400 capitalize">{res.category} • Taken {new Date(res.date_taken).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    res.percentage >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {res.percentage}% Score ({res.score}/{res.max_score})
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs">
            No assessment attempts yet. Start a diagnostic test above.
          </div>
        )}
      </div>

    </div>
  );
};

export default AssessmentsPage;
