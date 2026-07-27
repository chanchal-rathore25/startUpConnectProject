import { Link } from "react-router-dom";

const Navbar = () => (
  <div className="topnav">
    <Link className="back-link" to="/search">
      <span aria-hidden="true">&#8592;</span> Back to Search
    </Link>
    <span className="nav-tag">Startup Profile</span>
  </div>
);

export default Navbar;
