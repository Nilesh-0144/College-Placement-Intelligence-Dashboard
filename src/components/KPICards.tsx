import { Users, CheckCircle2, TrendingUp, DollarSign, Brain } from 'lucide-react';
import { KPIData } from '../types';

interface KPICardsProps {
  kpi: KPIData;
}

export default function KPICards({ kpi }: KPICardsProps) {
  const cards = [
    {
      id: 'kpi-total-students',
      label: 'Total Students',
      value: kpi.totalStudents.toLocaleString(),
      subtext: 'Enrolled in placement pool',
      icon: Users,
      badge: 'Cohort 2024-2025',
      badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 ring-1 ring-indigo-500/20',
      borderHover: 'hover:border-indigo-300 dark:hover:border-indigo-700/80',
    },
    {
      id: 'kpi-students-placed',
      label: 'Students Placed',
      value: kpi.studentsPlaced.toLocaleString(),
      subtext: `${kpi.studentsPlaced} secured campus offers`,
      icon: CheckCircle2,
      badge: `${((kpi.studentsPlaced / (kpi.totalStudents || 1)) * 100).toFixed(0)}% of Batch`,
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 ring-1 ring-emerald-500/20',
      borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700/80',
    },
    {
      id: 'kpi-placement-rate',
      label: 'Placement Rate',
      value: `${kpi.placementRate.toFixed(1)}%`,
      subtext: 'Overall cohort success rate',
      icon: TrendingUp,
      badge: kpi.placementRate >= 70 ? 'High Employability' : 'Moderate',
      badgeColor: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border border-violet-200/60 dark:border-violet-800/60',
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 ring-1 ring-violet-500/20',
      borderHover: 'hover:border-violet-300 dark:hover:border-violet-700/80',
    },
    {
      id: 'kpi-avg-package',
      label: 'Average Package',
      value: `₹${kpi.averagePackage.toFixed(2)} LPA`,
      subtext: 'Across all placed candidates',
      icon: DollarSign,
      badge: 'CTC Annual',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 ring-1 ring-amber-500/20',
      borderHover: 'hover:border-amber-300 dark:hover:border-amber-700/80',
    },
    {
      id: 'kpi-ml-accuracy',
      label: 'ML Model Accuracy',
      value: `${(kpi.modelAccuracy * 100).toFixed(1)}%`,
      subtext: 'Logistic Regression on test split',
      icon: Brain,
      badge: 'Scikit-Learn',
      badgeColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/60',
      iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 ring-1 ring-cyan-500/20',
      borderHover: 'hover:border-cyan-300 dark:hover:border-cyan-700/80',
    },
  ];

  return (
    <div id="kpi-cards-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-black/40 ${card.borderHover} group relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-tight">{card.label}</span>
              <div className={`p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${card.iconBg}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl sm:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">{card.value}</span>
            </div>
            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[110px]">{card.subtext}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap shadow-2xs ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
