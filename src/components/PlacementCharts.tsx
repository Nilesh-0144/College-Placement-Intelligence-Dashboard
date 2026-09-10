import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { StudentRecord } from '../types';
import { BarChart3, TrendingUp, Briefcase, Award, Building2 } from 'lucide-react';

interface PlacementChartsProps {
  dataset: StudentRecord[];
}

export default function PlacementCharts({ dataset }: PlacementChartsProps) {
  // Chart 1: Placement Rate by Branch
  const branchPlacementData = useMemo(() => {
    const branches = Array.from(new Set(dataset.map((d) => d.Branch)));
    return branches.map((branch) => {
      const branchStudents = dataset.filter((d) => d.Branch === branch);
      const placedCount = branchStudents.filter((d) => d.Placed === 'Yes').length;
      const rate = branchStudents.length > 0 ? (placedCount / branchStudents.length) * 100 : 0;
      return {
        branch: branch.replace('Electronics & Comm.', 'ECE').replace('Information Technology', 'IT'),
        fullBranch: branch,
        rate: Number(rate.toFixed(1)),
        placed: placedCount,
        total: branchStudents.length,
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [dataset]);

  // Chart 2: CGPA vs Placement (Grouped into CGPA Bands: 5-6, 6-7, 7-8, 8-9, 9-10)
  const cgpaPlacementData = useMemo(() => {
    const bands = [
      { band: '5.0 - 6.0', min: 5.0, max: 6.0 },
      { band: '6.0 - 7.0', min: 6.0, max: 7.0 },
      { band: '7.0 - 8.0', min: 7.0, max: 8.0 },
      { band: '8.0 - 9.0', min: 8.0, max: 9.0 },
      { band: '9.0 - 10.0', min: 9.0, max: 10.0 },
    ];

    return bands.map((b) => {
      const inBand = dataset.filter((d) => d.CGPA >= b.min && d.CGPA < (b.max === 10 ? 10.1 : b.max));
      const placed = inBand.filter((d) => d.Placed === 'Yes').length;
      const unplaced = inBand.length - placed;
      const rate = inBand.length > 0 ? (placed / inBand.length) * 100 : 0;
      return {
        band: b.band,
        placed,
        unplaced,
        rate: Number(rate.toFixed(1)),
        total: inBand.length,
      };
    });
  }, [dataset]);

  // Chart 3: Internship vs Placement
  const internshipData = useMemo(() => {
    const withIntern = dataset.filter((d) => d.Internship === 'Yes');
    const withoutIntern = dataset.filter((d) => d.Internship === 'No');

    const withPlaced = withIntern.filter((d) => d.Placed === 'Yes').length;
    const withoutPlaced = withoutIntern.filter((d) => d.Placed === 'Yes').length;

    return [
      {
        status: 'With Internship',
        placed: withPlaced,
        unplaced: withIntern.length - withPlaced,
        rate: withIntern.length > 0 ? Number(((withPlaced / withIntern.length) * 100).toFixed(1)) : 0,
        total: withIntern.length,
      },
      {
        status: 'Without Internship',
        placed: withoutPlaced,
        unplaced: withoutIntern.length - withoutPlaced,
        rate: withoutIntern.length > 0 ? Number(((withoutPlaced / withoutIntern.length) * 100).toFixed(1)) : 0,
        total: withoutIntern.length,
      },
    ];
  }, [dataset]);

  // Chart 4: Average Package by Branch (Placed students only)
  const packageBranchData = useMemo(() => {
    const placedStudents = dataset.filter((d) => d.Placed === 'Yes');
    const branches = Array.from(new Set(placedStudents.map((d) => d.Branch)));

    return branches.map((branch) => {
      const branchPlaced = placedStudents.filter((d) => d.Branch === branch);
      const avgPkg =
        branchPlaced.length > 0
          ? branchPlaced.reduce((acc, curr) => acc + curr.Package, 0) / branchPlaced.length
          : 0;
      const maxPkg =
        branchPlaced.length > 0 ? Math.max(...branchPlaced.map((d) => d.Package)) : 0;

      return {
        branch: branch.replace('Electronics & Comm.', 'ECE').replace('Information Technology', 'IT'),
        fullBranch: branch,
        avgPackage: Number(avgPkg.toFixed(2)),
        maxPackage: Number(maxPkg.toFixed(2)),
        count: branchPlaced.length,
      };
    }).sort((a, b) => b.avgPackage - a.avgPackage);
  }, [dataset]);

  // Chart 5: Company-wise Placements
  const companyData = useMemo(() => {
    const placedStudents = dataset.filter((d) => d.Placed === 'Yes' && d.Company !== 'Not Placed');
    const counts: { [company: string]: number } = {};
    placedStudents.forEach((d) => {
      counts[d.Company] = (counts[d.Company] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([company, count]) => ({
        company,
        students: count,
      }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 10);
  }, [dataset]);

  const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div id="placement-charts-section" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Placement Rate by Branch */}
        <div id="chart-branch-rate" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5.5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">1. Placement Rate by Branch</h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
              Placed (%)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPlacementData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="branch" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} unit="%" />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}% (${item.payload.placed}/${item.payload.total} students)`,
                    'Placement Rate',
                  ]}
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: '1px solid #1E293B', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                  {branchPlacementData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: CGPA vs Placement */}
        <div id="chart-cgpa-placement" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5.5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">2. CGPA vs Placement Outcome</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
              Grade Bands
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpaPlacementData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="band" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} students (${item.payload.rate}% placed)`,
                    name === 'placed' ? 'Placed' : 'Not Placed',
                  ]}
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: '1px solid #1E293B', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="placed" name="Placed" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unplaced" name="Not Placed" fill="#F43F5E" stackId="a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Internship vs Placement */}
        <div id="chart-internship-placement" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5.5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 ring-1 ring-violet-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">3. Internship vs Placement</h3>
            </div>
            <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-2.5 py-0.5 rounded-md border border-violet-200/50 dark:border-violet-800/50">
              Work Exposure
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={internshipData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="status" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} students (${item.payload.rate}% success rate)`,
                    name === 'placed' ? 'Placed' : 'Not Placed',
                  ]}
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: '1px solid #1E293B', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="placed" name="Placed" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="unplaced" name="Not Placed" fill="#94A3B8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Average Package by Branch */}
        <div id="chart-package-branch" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5.5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 ring-1 ring-amber-500/20">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">4. Average CTC by Branch</h3>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-800/50">
              LPA (Annual)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packageBranchData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="branch" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} />
                <YAxis unit=" L" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} LPA`, 'Avg Package']}
                  contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: '1px solid #1E293B', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                />
                <Bar dataKey="avgPackage" fill="#F59E0B" radius={[6, 6, 0, 0]}>
                  {packageBranchData.map((_, index) => (
                    <Cell key={`cell-pkg-${index}`} fill={index === 0 ? '#F59E0B' : '#FBBF24'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 5: Company-wise Placements (Full Width) */}
      <div id="chart-company-placements" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 ring-1 ring-cyan-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">5. Top Campus Recruiters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distribution of job offers across major hiring partners</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-200/50 dark:border-cyan-800/50 self-start sm:self-auto">
            Top 10 Recruiters
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={companyData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.3} />
              <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="company"
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
                width={120}
              />
              <Tooltip
                formatter={(val: any) => [`${val} Offers Extended`, 'Recruited']}
                contentStyle={{ backgroundColor: '#0B0F17', borderRadius: '12px', color: '#FFF', fontSize: '12px', border: '1px solid #1E293B', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
              />
              <Bar dataKey="students" fill="#06B6D4" radius={[0, 6, 6, 0]}>
                {companyData.map((_, index) => (
                  <Cell
                    key={`cell-comp-${index}`}
                    fill={['#4F46E5', '#06B6D4', '#10B981', '#3B82F6', '#8B5CF6', '#14B8A6'][index % 6]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
