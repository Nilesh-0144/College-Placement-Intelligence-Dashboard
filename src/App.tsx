import { useState, useMemo, useEffect } from 'react';
import { rawStudentData } from './data/studentsData';
import { trainLogisticRegression } from './utils/mlEngine';
import KPICards from './components/KPICards';
import PlacementCharts from './components/PlacementCharts';
import PredictionForm from './components/PredictionForm';
import ModelEvaluationView from './components/ModelEvaluationView';
import {
  Sparkles,
  BarChart3,
  Brain,
  GraduationCap,
  Sun,
  Moon,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'predict' | 'dashboard' | 'model'>('predict');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Train Logistic Regression model on startup
  const trainedModel = useMemo(() => {
    return trainLogisticRegression(rawStudentData);
  }, []);

  // Compute KPI metrics for the dataset
  const kpiData = useMemo(() => {
    const total = rawStudentData.length;
    const placedStudents = rawStudentData.filter((d) => d.Placed === 'Yes');
    const placed = placedStudents.length;
    const rate = total > 0 ? (placed / total) * 100 : 0;
    const avgPkg =
      placedStudents.length > 0
        ? placedStudents.reduce((acc, curr) => acc + curr.Package, 0) / placedStudents.length
        : 0;

    return {
      totalStudents: total,
      studentsPlaced: placed,
      placementRate: rate,
      averagePackage: avgPkg,
      modelAccuracy: trainedModel.metrics.accuracy,
    };
  }, [trainedModel]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-200 font-sans antialiased transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                College Placement Intelligence
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Machine Learning Classification using Logistic Regression
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Model Accuracy: {(trainedModel.metrics.accuracy * 100).toFixed(1)}%
            </span>

            {/* Light/Dark mode toggle button without text in right corner */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50/50 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="inline-flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/60 gap-1 shadow-2xs">
            <button
              onClick={() => setActiveTab('predict')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'predict'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Predict Student Placement
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              Placement Analytics & Charts
            </button>

            <button
              onClick={() => setActiveTab('model')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'model'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-indigo-500" />
              Confusion Matrix & Evaluation
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* TAB 1: PREDICT STUDENT PLACEMENT */}
        {activeTab === 'predict' && (
          <div className="space-y-6">
            <PredictionForm model={trainedModel} />
          </div>
        )}

        {/* TAB 2: PLACEMENT ANALYTICS & CHARTS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <KPICards kpi={kpiData} />
            <PlacementCharts dataset={rawStudentData} />
          </div>
        )}

        {/* TAB 3: CONFUSION MATRIX & MODEL EVALUATION */}
        {activeTab === 'model' && (
          <div className="space-y-6">
            <ModelEvaluationView model={trainedModel} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>College Placement Prediction System • Logistic Regression Model</span>
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            N = {rawStudentData.length} Student Records • 80:20 Train-Test Split
          </span>
        </div>
      </footer>
    </div>
  );
}
