import DashboardShell from "../../components/DashboardShell";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
