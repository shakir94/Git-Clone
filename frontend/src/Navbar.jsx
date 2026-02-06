import React from "react";
import "./navbar.css"

const Navbar = () => {
  return (
    <nav>
      <a href="/">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>GitHub</h3>
        </div>
      </a>

      <div>
        <a href="/create-repository"><p>Create a Repository</p></a>
        <a href="/profile"><p>Profile</p></a>
      </div>
    </nav>
  );
};

export default Navbar;