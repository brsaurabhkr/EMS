import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

type NavbarProps = {
  onToggleSidebar: () => void;
};

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-8">
    
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-100"
            onClick={onToggleSidebar}
          >
            <Menu size={18} />
          </button>
          <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">EMS</span>
          </div>
          <h1 className="hidden sm:block text-lg font-bold text-gray-800 tracking-tight">
            EMS Portal
          </h1>
        </div>

        {/* Center: Title (Responsive) */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-800 hidden md:block">
            Employee Management System
          </h1>
        </div>


        {/* Right: Actions */}
        <div className="flex items-center gap-4">
         <Button className="h-10 cursor-pointer bg-sky-500 px-4 text-white transition-colors hover:bg-sky-600">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
