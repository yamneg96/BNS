import { Link } from "react-router-dom";
import logo from "../assets/medical-bed.png";

const Navbar = () => {
  return (
    <nav className="bg-primary text-black px-6 py-3 flex justify-between items-center shadow-lg">
      <Link to='/'>
      <h1 className="text-xl font-bold flex items-center gap-2">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        Bed Notification System
      </h1>
      </Link>
      <div className="flex gap-4">
        <Link to="/dashboard" className="hover:text-accent">Dashboard</Link>
        <Link to="/beds" className="hover:text-accent">Beds</Link>
        <Link to="/notifications" className="hover:text-accent">Notifications</Link>
        <Link to="/login" className="bg-accent rounded-lg">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
