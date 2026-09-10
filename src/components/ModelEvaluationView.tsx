import { TrainedModel } from '../utils/mlEngine';
import { Target, HelpCircle, Layers, CheckCircle, XCircle } from 'lucide-react';

interface ModelEvaluationViewProps {
  model: TrainedModel;
}

export default function ModelEvaluationView({ model }: ModelEvaluationViewProps) {
  const { metrics, report, featureWeights, trainSize, testSize } = model;
  const { tp, fp, tn, fn, accuracy, precision, recall, f1Score } = metrics;

  return (
    <div id="ml-evaluation-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 ring-1 ring-indigo-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Logistic Regression Performance Evaluation
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Trained on 80% partition ({trainSize} records) and rigorously evaluated on an unseen 20% test holdout ({testSize} records).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Overall Test Accuracy</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
              {(accuracy * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">F1-Score (Placed)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {(f1Score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Confusion Matrix + Classification Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">2x2 Confusion Matrix Heatmap</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ground Truth vs Scikit-Learn Model Classifications</p>
            </div>
            <span className="text-[11px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-slate-700/60">
              N = {testSize} Test Samples
            </span>
          </div>

          <div className="space-y-4">
            {/* Grid Box */}
            <div className="relative border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Model Classification Grid
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {/* True Negative */}
                <div className="bg-white dark:bg-slate-900/90 border-2 border-emerald-500/40 dark:border-emerald-500/50 rounded-xl p-3.5 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    <CheckCircle className="w-3.5 h-3.5" />
                    True Negative (TN)
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white my-1 tracking-tight">{tn}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Actual: Not Placed | Pred: Not Placed
                  </div>
                </div>

                {/* False Positive */}
                <div className="bg-white dark:bg-slate-900/90 border-2 border-rose-400/40 dark:border-rose-500/50 rounded-xl p-3.5 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                    <XCircle className="w-3.5 h-3.5" />
                    False Positive (FP)
                  </div>
                  <div className="text-3xl font-black text-rose-600 dark:text-rose-400 my-1 tracking-tight">{fp}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Actual: Not Placed | Pred: Placed
                  </div>
                </div>

                {/* False Negative */}
                <div className="bg-white dark:bg-slate-900/90 border-2 border-amber-400/40 dark:border-amber-500/50 rounded-xl p-3.5 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                    <XCircle className="w-3.5 h-3.5" />
                    False Negative (FN)
                  </div>
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-400 my-1 tracking-tight">{fn}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Actual: Placed | Pred: Not Placed
                  </div>
                </div>

                {/* True Positive */}
                <div className="bg-white dark:bg-slate-900/90 border-2 border-indigo-500/50 dark:border-indigo-500/60 rounded-xl p-3.5 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                    <CheckCircle className="w-3.5 h-3.5" />
                    True Positive (TP)
                  </div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 my-1 tracking-tight">{tp}</div>
                  <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Actual: Placed | Pred: Placed
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Explanation Note */}
            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <span className="font-bold text-slate-800 dark:text-slate-200">Formula Breakdown: </span>
              Accuracy = <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-300 font-semibold">
                (TP + TN) / Total = ({tp} + {tn}) / {testSize} = {(accuracy * 100).toFixed(1)}%
              </code>
              . The classifier accurately predicted {tp + tn} out of {testSize} unseen students.
            </div>
          </div>
        </div>

        {/* Classification Report (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Classification Performance Report</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Precision, Recall, F1-Score & Support</p>
              </div>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 px-2.5 py-1 rounded-full font-semibold">
                Binary Classes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3 text-right">Precision</th>
                    <th className="py-2.5 px-3 text-right">Recall</th>
                    <th className="py-2.5 px-3 text-right">F1-Score</th>
                    <th className="py-2.5 px-3 text-right">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {report.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-200">{row.label}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {(row.precision * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {(row.recall * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {(row.f1Score * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400 font-mono">
                        {row.support}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/80 dark:bg-slate-800/70 font-bold text-slate-900 dark:text-white">
                    <td className="py-2.5 px-3">Macro Average</td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                      {(((report[0].precision + report[1].precision) / 2) * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                      {(((report[0].recall + report[1].recall) / 2) * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-600 dark:text-indigo-400">
                      {(((report[0].f1Score + report[1].f1Score) / 2) * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">{testSize}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">Precision ({(precision * 100).toFixed(0)}%):</span>
              <span>When the model classifies a student as placed, it is accurate {(precision * 100).toFixed(1)}% of the time.</span>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">Recall ({(recall * 100).toFixed(0)}%):</span>
              <span>The model identifies {(recall * 100).toFixed(1)}% of all genuinely placed candidates.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learned Feature Weights / Coefficients */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Learned Feature Weights & Beta Coefficients</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Coefficients learned via gradient descent optimization on Binary Cross-Entropy loss
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Higher absolute weight = Greater influence on placement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {featureWeights.map((fw, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{fw.featureName}</span>
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-md border font-mono ${
                      fw.weight > 0
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60'
                    }`}
                  >
                    {fw.weight > 0 ? `+${fw.weight.toFixed(2)}` : fw.weight.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{fw.impact}</p>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fw.weight > 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-red-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(fw.weight) * 35)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
