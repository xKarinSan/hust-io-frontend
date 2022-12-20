import React, { useState } from "react";
import { Link } from "react-router-dom";
function Navbar({ userId }) {
    const [opened, setOpened] = useState(false);
    const loggedInLinks = [
        { linkName: "Home", link: "/home" },
        { linkName: "Organiser", link: "/organiser" },
        { linkName: "Events", link: "/events" },
        { linkName: "Journal", link: "/journals" },
        { linkName: "Tasks", link: "/tasks" },
        { linkName: "Quizzes", link: "/quizzes" },
        { linkName: "Logout", link: "/logout" },
    ];
    const notLoggedInLinks = [
        { link: "/login", linkName: "Login" },
        { link: "/register", linkName: "Register" },
    ];

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <Link
                // href="#"
                onClick={() => {
                    setOpened(!opened);
                }}
                role="button"
                className="navbar-burger"
                aria-label="menu"
                aria-expanded={opened}
                data-target="navbar"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </Link>

            <div
                id="navbar"
                className={opened ? "navbar-menu is-active" : "navbar-menu"}
            >
                <div className="navbar-start">
                    {userId ? (
                        <>
                            {" "}
                            {loggedInLinks.map((currLink, index) => {
                                const { linkName, link } = currLink;
                                return (
                                    <Link
                                        to={link}
                                        key={index}
                                        className="navbar-item"
                                    >
                                        {linkName}
                                    </Link>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            {" "}
                            {notLoggedInLinks.map((currLink, index) => {
                                const { linkName, link } = currLink;
                                return (
                                    <Link
                                        to={link}
                                        key={index}
                                        className="navbar-item"
                                    >
                                        {linkName}
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
