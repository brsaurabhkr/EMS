import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import "./index.css";

import Navbar from "./layouts/Navbar";
import Sidebar from "./layouts/Sidebar";

import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Designations from "./pages/Designations/DesignationList";
import Employee from "./pages/Employees/EmployeeList";
import Tasks from "./pages/Tasks/TaskList";
import { Toaster } from "./components/ui/sonner";
import { useEmployeeStore } from "./store/employeeStore";
import { useDesignationStore } from "./store/designationStore";
import { getEmployees } from "./api/employee";
import { getDesignations } from "./api/designation";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const hideLayout = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  
  const { employees, setEmployees } = useEmployeeStore();
  const { setDesignations } = useDesignationStore();

  useEffect(() => {
    getDesignations()
      .then((response) => {
        setDesignations(response.data.data.map((item) => ({
          id: item.id,
          name: item.designation_name,
          description: item.description,
          status: item.status,
        })));
      })
      .catch((error) => console.error("Failed to load designations", error));

    getEmployees()
      .then((response) => {
        setEmployees(response.data.data.map((item) => ({
          id: item.id,
          employee_code: item.employee_code,
          employee_name: item.employee_name,
          code: item.employee_code,
          name: item.employee_name,
          designationId: Number(item.designation_id),
          designation_id: Number(item.designation_id),
          designation: item.designation_name || "",
          email: item.email,
          mobile: item.mobile,
          status: item.status,
        })));
      })
      .catch((error) => console.error("Failed to load employees", error));
  }, [setDesignations, setEmployees]);


 
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {!hideLayout && <Navbar onToggleSidebar={toggleSidebar} />}

      <div className={`flex w-full overflow-x-hidden ${hideLayout ? "min-h-screen" : "h-[calc(100dvh-4rem)] overflow-y-hidden"}`}>
        {!hideLayout && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}

        <main className={`flex-1 min-w-0 w-full ${hideLayout ? "min-h-screen" : "h-full overflow-y-auto p-2 md:p-4"}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/designation" element={<Designations />} />
            <Route path="/employees" element={<Employee />}/>
            <Route path="/tasks" element={<Tasks employees={employees as any} />}/>
          </Routes>
        </main>
      </div>
      <Toaster />
    </>
  );
}


 export default App;
