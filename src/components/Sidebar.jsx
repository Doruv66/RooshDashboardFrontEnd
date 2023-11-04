import routes from "../routes";

function Sidebar() {
    return <nav className="sidebar">
    {routes.map(link => (
        <li key={link.id}>
          <NavLink to={link.path} className="nav-link">{link.text}</NavLink>
        </li>
      ))}
    </nav>;
  }
  export default Sidebar;
  