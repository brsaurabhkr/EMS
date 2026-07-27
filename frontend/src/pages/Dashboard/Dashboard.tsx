import { CheckCircle2, ClipboardList, Clock3, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useEmployeeStore } from "../../store/employeeStore";
import { useTaskStore } from "../../store/taskStore";

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="hover:shadow-md transition-all border-l-4 w-full" style={{ borderLeftColor: color }}>
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2.5 bg-slate-100 rounded-lg">
        <Icon size={20} style={{ color: color }} />
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const employees = useEmployeeStore((state) => state.employees);
  const tasks = useTaskStore((state) => state.tasks);
  const stats = [
    { title: "Employees", value: employees.length, icon: Users, color: "#3b82f6" },
    { title: "Total Tasks", value: tasks.length, icon: ClipboardList, color: "#a855f7" },
    { title: "Pending", value: tasks.filter((t: any) => t.status === "Pending").length, icon: Clock3, color: "#f97316" },
    { title: "Completed", value: tasks.filter((t: any) => t.status === "Completed").length, icon: CheckCircle2, color: "#22c55e" },
  ];

  return (
    <div className="min-h-full pt-0 px-4 pb-4 md:px-6 md:pb-6 space-y-4 bg-gray-50/50 text-left">
      {/* Top Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">System Overview</p>
      </div>

      {/* Stats Grid - Grid cols badhaye taaki cards bade dikhen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent Lists - Grid layout responsive banaya */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Employees</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employees.slice(-5).reverse().map((e: any) => (
              <div key={e.id} className="flex min-w-0 justify-between items-center gap-3 text-sm border-b pb-2 last:border-0 last:pb-0">
                <span className="min-w-0 truncate font-medium">{e.name}</span>
                <span className="shrink-0 text-[10px] bg-gray-100 px-2 py-0.5 rounded uppercase">{e.designation}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.slice(-5).reverse().map((t: any) => (
              <div key={t.id} className="flex min-w-0 justify-between items-center gap-3 text-sm border-b pb-2 last:border-0 last:pb-0">
                <span className="min-w-0 truncate font-medium">{t.title}</span>
                <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  t.status === "Completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
