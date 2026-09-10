import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PredictionInput, PredictionResult } from '../types';
import { TrainedModel, predictStudentPlacement } from '../utils/mlEngine';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Code2,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';

interface PredictionFormProps {
  model: TrainedModel;
}

export default function PredictionForm({ model }: PredictionFormProps) {
  // 1. CGPA
  const [cgpa, setCgpa] = useState<number>(7.85);

  // 2. Branch
  const [branch, setBranch] = useState<string>('Computer Science');

  // 3. Internship
  const [internship, setInternship] = useState<'Yes' | 'No'>('Yes');

  // 4. Marks (10th, 12th, and College Marks %)
  const [tenthPercentage, setTenthPercentage] = useState<number>(78.5);
  const [twelfthPercentage, setTwelfthPercentage] = useState<number>(76.0);
  const [collegeMarksPercentage, setCollegeMarksPercentage] = useState<number>(78.0);

  // 5. Skills
  const [skills, setSkills] = useState<string>('Python & DSA');

  // 6. LeetCode Problems Solved
  const [leetcode, setLeetcode] = useState<number>(165);

  // 7. Projects
  const [projects, setProjects] = useState<number>(3);
  const [projectDomain, setProjectDomain] = useState<string>('Full-Stack Web App');

  // Real-time calculation on mount and state changes
  const [result, setResult] = useState<PredictionResult>(() => {
    return predictStudentPlacement(
      {
        branch: 'Computer Science',
        cgpa: 7.85,
        tenthPercentage: 78.5,
        twelfthPercentage: 76.0,
        collegeMarksPercentage: 78.0,
        internship: 'Yes',
        skills: 'Python & DSA',
        leetcode: 165,
        projects: 3,
        projectDomain: 'Full-Stack Web App',
      },
      model
    );
  });

  const handlePredict = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const input: PredictionInput = {
      branch,
      cgpa: Number(cgpa),
      tenthPercentage: Number(tenthPercentage),
      twelfthPercentage: Number(twelfthPercentage),
      collegeMarksPercentage: Number(collegeMarksPercentage),
      internship,
      skills,
      leetcode: Number(leetcode),
      projects: Number(projects),
      projectDomain,
    };

    const pred = predictStudentPlacement(input, model);
    setResult(pred);

    if (pred.predictedPlaced) {
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.65 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  // Presets for quick evaluation
  const applyPreset = (presetType: 'strong' | 'average' | 'atRisk') => {
    if (presetType === 'strong') {
      setBranch('Computer Science');
      setCgpa(8.85);
      setTenthPercentage(88.0);
      setTwelfthPercentage(86.5);
      setCollegeMarksPercentage(85.0);
      setInternship('Yes');
      setSkills('Full Stack Web');
      setLeetcode(320);
      setProjects(4);
      setProjectDomain('Full-Stack Web App');
      const pred = predictStudentPlacement(
        {
          branch: 'Computer Science',
          cgpa: 8.85,
          tenthPercentage: 88.0,
          twelfthPercentage: 86.5,
          collegeMarksPercentage: 85.0,
          internship: 'Yes',
          skills: 'Full Stack Web',
          leetcode: 320,
          projects: 4,
          projectDomain: 'Full-Stack Web App',
        },
        model
      );
      setResult(pred);
    } else if (presetType === 'average') {
      setBranch('Information Technology');
      setCgpa(7.2);
      setTenthPercentage(72.0);
      setTwelfthPercentage(70.0);
      setCollegeMarksPercentage(71.5);
      setInternship('No');
      setSkills('Python & DSA');
      setLeetcode(110);
      setProjects(2);
      setProjectDomain('Machine Learning');
      const pred = predictStudentPlacement(
        {
          branch: 'Information Technology',
          cgpa: 7.2,
          tenthPercentage: 72.0,
          twelfthPercentage: 70.0,
          collegeMarksPercentage: 71.5,
          internship: 'No',
          skills: 'Python & DSA',
          leetcode: 110,
          projects: 2,
          projectDomain: 'Machine Learning',
        },
        model
      );
      setResult(pred);
    } else {
      setBranch('Mechanical');
      setCgpa(6.1);
      setTenthPercentage(61.0);
      setTwelfthPercentage(58.5);
      setCollegeMarksPercentage(60.0);
      setInternship('No');
      setSkills('CAD & SolidWorks');
      setLeetcode(0);
      setProjects(0);
      setProjectDomain('CAD/Hardware Prototype');
      const pred = predictStudentPlacement(
        {
          branch: 'Mechanical',
          cgpa: 6.1,
          tenthPercentage: 61.0,
          twelfthPercentage: 58.5,
          collegeMarksPercentage: 60.0,
          internship: 'No',
          skills: 'CAD & SolidWorks',
          leetcode: 0,
          projects: 0,
          projectDomain: 'CAD/Hardware Prototype',
        },
        model
      );
      setResult(pred);
    }
  };

  const isTechBranch = branch === 'Computer Science' || branch === 'Information Technology';

  // LeetCode band description
  const getLeetcodeTier = (count: number) => {
    if (count >= 300) return { label: 'Top Tier / High Priority', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/60' };
    if (count >= 150) return { label: 'Interview Ready (DSA)', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/60 dark:border-indigo-800/60' };
    if (count >= 50) return { label: 'Foundational Problem Solving', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/60' };
    return { label: 'Beginner / At Risk for OA', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200/60 dark:border-rose-800/60' };
  };

  const lcTier = getLeetcodeTier(leetcode);

  return (
    <div id="student-prediction-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Form Column (7 Cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Student Profile & Parameters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isTechBranch
                ? 'High priority on LeetCode & DSA, CGPA, projects, skills, and baseline board marks'
                : `Tailored for ${branch}: Prioritizing core domain projects, skills, CGPA, and internships`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-1.5">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('strong')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              High CGPA (CS)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('average')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              Average (IT)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('atRisk')}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              Mech (Core)
            </button>
          </div>
        </div>

        <form onSubmit={handlePredict} className="space-y-4.5">
          {/* Section 1: Academic Fundamentals (Branch & CGPA) */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch */}
              <div>
                <label htmlFor="branch-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Engineering Branch
                </label>
                <select
                  id="branch-select"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 transition cursor-pointer font-medium"
                >
                  <option value="Computer Science">Computer Science Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm.">Electronics & Communication</option>
                  <option value="Mechanical">Mechanical Engineering</option>
                  <option value="Civil">Civil Engineering</option>
                </select>
              </div>

              {/* Technical Skills */}
              <div>
                <label htmlFor="skills-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  Primary Technical Skill
                </label>
                <select
                  id="skills-select"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 transition cursor-pointer font-medium"
                >
                  <option value="Python & DSA">Python & Data Structures</option>
                  <option value="Full Stack Web">Full Stack Web (React & Node)</option>
                  <option value="Cloud & DevOps">Cloud & DevOps (AWS/Docker)</option>
                  <option value="Machine Learning">Machine Learning & AI</option>
                  <option value="Java & Spring">Java & Spring Boot</option>
                  <option value="Embedded Systems">Embedded Systems & IoT</option>
                  <option value="CAD & SolidWorks">CAD & SolidWorks Modeling</option>
                  <option value="Data Analytics">Data Analytics & SQL</option>
                  <option value="Core Mechanical">Core Mechanical Engineering</option>
                  <option value="Project Planning">Civil Infrastructure Planning</option>
                </select>
              </div>
            </div>

            {/* CGPA Slider & Numerical Input */}
            <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="cgpa-slider" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  College CGPA (Cumulative Aggregate)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5.0"
                    max="10.0"
                    step="0.05"
                    value={cgpa}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setCgpa(Math.min(10, Math.max(5, val)));
                    }}
                    className="w-16 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 rounded-lg px-1.5 py-1 focus:outline-hidden font-mono shadow-2xs"
                  />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">/ 10.0</span>
                </div>
              </div>
              <input
                type="range"
                id="cgpa-slider"
                min="5.0"
                max="10.0"
                step="0.05"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                <span>5.0 (Pass)</span>
                <span>6.5 (Standard Cutoff)</span>
                <span>7.5 (Product Tier Cutoff)</span>
                <span>10.0 (Perfect)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Marks (10th, 12th, and College Marks %) */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Academic Marks (Low Priority - Baseline Filter Only)
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Minimum 60% eligibility cutoff
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 10th Marks */}
              <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="tenth-slider" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    10th Board Marks
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {tenthPercentage.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  id="tenth-slider"
                  min="50.0"
                  max="100.0"
                  step="0.5"
                  value={tenthPercentage}
                  onChange={(e) => setTenthPercentage(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* 12th Marks */}
              <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="twelfth-slider" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    12th Board Marks
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {twelfthPercentage.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  id="twelfth-slider"
                  min="50.0"
                  max="100.0"
                  step="0.5"
                  value={twelfthPercentage}
                  onChange={(e) => setTwelfthPercentage(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* College Semester Marks % */}
              <div className="bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="college-marks-slider" className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    College Marks %
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {collegeMarksPercentage.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  id="college-marks-slider"
                  min="50.0"
                  max="100.0"
                  step="0.5"
                  value={collegeMarksPercentage}
                  onChange={(e) => setCollegeMarksPercentage(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: LeetCode & DSA Profile (CS & IT ONLY) */}
          {isTechBranch ? (
            <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="leetcode-slider" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-500" />
                      LeetCode / DSA Problems Solved
                    </label>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                      Top Priority (CS & IT)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Primary deciding factor for clearing Online Assessments (OA) & technical coding rounds
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${lcTier.color}`}>
                    {lcTier.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="800"
                      step="5"
                      value={leetcode}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setLeetcode(Math.max(0, Math.min(800, val)));
                      }}
                      className="w-16 text-center text-xs font-bold text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 rounded-lg px-1.5 py-1 focus:outline-hidden font-mono shadow-2xs"
                    />
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">problems</span>
                  </div>
                </div>
              </div>

              <input
                type="range"
                id="leetcode-slider"
                min="0"
                max="600"
                step="5"
                value={leetcode}
                onChange={(e) => setLeetcode(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>0 (High Risk for OA)</span>
                <span>100 (Fundamental)</span>
                <span>200 (Interview Ready)</span>
                <span>400+ (Product Tier)</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    LeetCode Not Required for {branch}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    LeetCode / DSA problem count is exclusively evaluated for CS & IT roles. For {branch}, placement relies on hands-on domain engineering projects, core technical skills, and internships.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Projects & Portfolio */}
          <div className="bg-slate-50/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Technical Projects & Portfolio
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Evaluates hands-on development experience and resume strength
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {projects} Major Project{projects !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setProjects((prev) => Math.max(0, prev - 1))}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
                    {projects}
                  </span>
                  <button
                    type="button"
                    onClick={() => setProjects((prev) => Math.min(8, prev + 1))}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Primary Project Domain
                </label>
                <select
                  value={projectDomain}
                  onChange={(e) => setProjectDomain(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-500 font-medium"
                >
                  <option value="Full-Stack Web App">Full-Stack Web App / SaaS (React, Node, DB)</option>
                  <option value="Machine Learning">Machine Learning / Deep Learning Pipeline</option>
                  <option value="Mobile Application">Mobile Application (Flutter / React Native)</option>
                  <option value="Cloud / DevOps">Cloud & Distributed Systems Architecture</option>
                  <option value="Embedded / IoT">Embedded Systems & Hardware Prototype</option>
                  <option value="CAD/Hardware Prototype">CAD / Mechanical Systems Modeling</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Portfolio Strength Indicator
                </label>
                <div className="h-9 flex items-center px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                  {projects >= 3 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> High Impact (3+ GitHub repos)
                    </span>
                  ) : projects >= 1 ? (
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Good Baseline ({projects} project)
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> No Projects (Needs Action)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Internship */}
          <div>
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              Completed Industry Internship?
            </span>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  internship === 'Yes'
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="internship"
                  value="Yes"
                  checked={internship === 'Yes'}
                  onChange={() => setInternship('Yes')}
                  className="hidden"
                />
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Yes (Internship Completed)
              </label>

              <label
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  internship === 'No'
                    ? 'border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 ring-2 ring-slate-400/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="internship"
                  value="No"
                  checked={internship === 'No'}
                  onChange={() => setInternship('No')}
                  className="hidden"
                />
                <AlertCircle className="w-4 h-4 text-slate-500" />
                No Internship Yet
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              id="predict-placement-btn"
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-indigo-500/25 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Calculate Placement Probability
            </button>
          </div>
        </form>
      </div>

      {/* Results Column (5 Cols) */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        {result ? (
          <div
            id="prediction-result-card"
            className={`border rounded-2xl p-6 shadow-sm transition-all relative overflow-hidden ${
              result.predictedPlaced
                ? 'bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 dark:border-emerald-500/40'
                : 'bg-gradient-to-b from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/30 dark:border-rose-500/40'
            }`}
          >
            {/* Header Status */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Logistic Regression Verdict
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${
                  result.predictedPlaced
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60'
                }`}
              >
                {result.academicRating} Profile
              </span>
            </div>

            {/* Main Result Headline */}
            <div className="my-4">
              <div className="flex items-center gap-3.5">
                {result.predictedPlaced ? (
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-400/30">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Classification</span>
                  <h3
                    id="prediction-result-title"
                    className={`text-lg sm:text-xl font-black tracking-tight ${
                      result.predictedPlaced ? 'text-emerald-950 dark:text-emerald-300' : 'text-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {result.predictedPlaced ? 'Likely to be Placed' : 'Needs Technical Reinforcement'}
                  </h3>
                </div>
              </div>

              {/* Likelihood Meter */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/70 dark:border-slate-800">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Placement Probability</span>
                  <span
                    className={`text-2xl font-black tracking-tight ${
                      result.predictedPlaced ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {result.probability}%
                  </span>
                </div>
                <div className="w-full bg-slate-200/90 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-700 shadow-xs ${
                      result.probability >= 70
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : result.probability >= 50
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-400'
                        : result.probability >= 35
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-gradient-to-r from-rose-500 to-red-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(5, result.probability))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                  <span>0% (Low)</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Threshold: 50%</span>
                  <span>100% (High)</span>
                </div>
              </div>
            </div>

            {/* Profile Summary Chips */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/70 dark:border-slate-800 text-center">
              <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">CGPA</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{cgpa.toFixed(2)}</span>
              </div>
              {isTechBranch ? (
                <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">LeetCode (Top Priority)</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">{leetcode} Qs</span>
                </div>
              ) : (
                <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Internship</span>
                  <span className={`text-xs font-bold font-mono ${internship === 'Yes' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {internship === 'Yes' ? 'Completed' : 'None'}
                  </span>
                </div>
              )}
              <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Projects</span>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 font-mono">{projects} Done</span>
              </div>
            </div>

            {/* Contributing Factors */}
            <div className="space-y-2 pt-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                Key Model Factors (Evaluated on Inputs)
              </h4>
              <div className="space-y-1.5">
                {result.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2.5 rounded-xl border ${
                      factor.type === 'positive'
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
                        : factor.type === 'warning'
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="font-bold">{factor.title}: </span>
                    <span className="text-slate-600 dark:text-slate-400">{factor.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="mt-3.5 pt-3.5 border-t border-slate-200/70 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Personalized Recommendations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-extrabold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}

        {/* Model Classification Details Note */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-200">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold">Multi-Feature Linear Classification</h4>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Evaluates your weighted log-odds score based on <span className="font-semibold text-slate-800 dark:text-slate-200">CGPA</span>, <span className="font-semibold text-slate-800 dark:text-slate-200">LeetCode</span>, <span className="font-semibold text-slate-800 dark:text-slate-200">Projects</span>, <span className="font-semibold text-slate-800 dark:text-slate-200">Internship</span>, <span className="font-semibold text-slate-800 dark:text-slate-200">Marks</span>, and <span className="font-semibold text-slate-800 dark:text-slate-200">Branch Skills</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
