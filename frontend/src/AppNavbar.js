import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Navbar, NavbarBrand, NavbarToggler, UncontrolledDropdown } from 'reactstrap';
import GamePlayNowPlayer from "./player/games/GamePlayNowPlayer";
import tokenService from './services/token.service';
import './static/css/home/home.css';

function AppNavbar() {
    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState("");
    const jwt = tokenService.getLocalAccessToken();
    const [collapsed, setCollapsed] = useState(true);
    const [pendingGame, setPendingGame] = useState(null);
    const user = tokenService.getUser();
    const toggleNavbar = () => setCollapsed(!collapsed);


    useEffect(() => {
        if (jwt) {
            setRoles(jwt_decode(jwt).authorities);
            setUsername(jwt_decode(jwt).sub);

            if (jwt_decode(jwt).authorities.includes("PLAYER")) {
                const interval = setInterval(async () => {
                    try {
                        const playerResponse = await fetch(`/api/v1/games/players/${user.id}/notended`, {
                            headers: { Authorization: `Bearer ${jwt}` },
                        });

                        if (!playerResponse.ok) {
                            throw new Error(`HTTP error! status: ${playerResponse.status}`);
                        }

                        const playerData = await playerResponse.json();
                        const ongoingGame = playerData.find((game) => !game.endedAt);
                        setPendingGame(ongoingGame);

                    } catch (error) {
                        console.error('Error fetching pending games:', error);
                    }
                }, 5000); // Actualización cada 5 segundos

                return () => clearInterval(interval);
            }
        }
    }, [jwt])

    const handleReject = async () => {
        try {
            const gamePlayerResponse = await fetch(`/api/v1/gameplayers/${pendingGame.id}/${user.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!gamePlayerResponse.ok) {
                throw new Error(`Error fetching GamePlayer: ${gamePlayerResponse.statusText}`);
            }

            const gamePlayer = await gamePlayerResponse.json();
            const response = await fetch(`/api/v1/games/${pendingGame.id}/${gamePlayer.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setPendingGame(null);
            } else {
                throw new Error('Failed to delete the game');
            }
        } catch (error) {
            console.error('Error deleting game:', error);
        }

    };

    let adminLinks = <></>;
    let playerLinks = <></>;
    let userLogout = <></>;
    let publicLinks = <></>;

    roles.forEach((role) => {
        if (role === "ADMIN") {
            adminLinks = (
                <>

                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} id="docs" tag={Link} to="/docs">Docs</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/games">Games</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/players">Players</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/rules">Rules</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/achievements">Achievements</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/friendships">Friendships</NavLink>
                    </NavItem>
                    <span style={{ color: "gray", display: "inline-block", margin: "5px 10px" }}>|</span>
                </>
            )
        }
        if (role === "PLAYER") {
            playerLinks = (
                <>
                    {pendingGame ? (
                        <>
                            <NavItem>
                                <div className="fuente" style={{ color: "white", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                    Game pending. Join now?
                                </div>
                            </NavItem>
                            <span style={{ display: "block", margin: "5px 5px" }}></span>
                            <NavItem style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Button
                                    className="auth-button-eol-delete"
                                    size="sm"
                                    color="danger"
                                    onClick={handleReject}>
                                    Reject
                                </Button>
                            </NavItem>
                            <span style={{ display: "block", margin: "5px 5px" }}></span>
                            <NavItem style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Button color="success"
                                    size="sm"
                                    className="auth-button-eol-create"
                                    onClick={() => window.location.href = `/games/${pendingGame.id}`}>
                                    Accept
                                </Button>
                            </NavItem>
                            <span style={{ display: "block", margin: "5px 5px" }}></span>
                        </>
                    ) : (
                        <NavItem>
                            <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} onClick={GamePlayNowPlayer}>Play Now!</NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/rules">Rules</NavLink>
                    </NavItem>
                    <span style={{ color: "gray", display: "inline-block", margin: "5px 10px" }}>|</span>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret className="fuente" style={{ color: "#EF87E0" }}>
                            {username}
                        </DropdownToggle>
                        <DropdownMenu end style={{ backgroundColor: "#222222", textAlign: 'center' }}>
                            <DropdownItem style={{ borderBottom: '1px solid gray', padding: '10px' }}>
                                <NavItem>
                                    <NavLink className="fuente" style={{ color: "#EF87E0" }} tag={Link} to="/profile">My Profile</NavLink>
                                </NavItem>
                            </DropdownItem>

                            <DropdownItem style={{ borderBottom: '1px solid gray', padding: '10px' }}>
                                <NavItem>
                                    <NavLink className="fuente" style={{ color: "#EF87E0" }} tag={Link} to="/games">My Games</NavLink>
                                </NavItem>
                            </DropdownItem>

                            <DropdownItem style={{ borderBottom: '1px solid gray', padding: '10px' }}>
                                <NavItem>
                                    <NavLink className="fuente" style={{ color: "#EF87E0" }} tag={Link} to="/friendships">Friendships</NavLink>
                                </NavItem>
                            </DropdownItem>

                            <DropdownItem style={{ borderBottom: '1px solid gray', padding: '10px' }}>
                                <NavItem>
                                    <NavLink className="fuente" style={{ color: "#EF87E0" }} tag={Link} to="/achievements">Achievements</NavLink>
                                </NavItem>
                            </DropdownItem>

                            <DropdownItem>
                                <NavItem>
                                    <NavLink className="fuente" style={{ color: "#EF87E0" }} tag={Link} to="/stats">Stats</NavLink>
                                </NavItem>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            )

        }
    })

    if (!jwt) {
        publicLinks = (
            <>
                <NavItem>
                    <NavLink className="fuente" style={{ color: "#75FBFD" }} tag={Link} to="/rules">Rules</NavLink>
                </NavItem>
                <span style={{ color: "gray", display: "inline-block", margin: "5px 10px" }}>|</span>
                <NavItem>
                    <NavLink className="fuente" style={{ color: "#EF87E0" }} id="login" tag={Link} to="/login">Sign in</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="fuente" style={{ color: "#EF87E0" }} id="register" tag={Link} to="/register">Register</NavLink>
                </NavItem>
            </>
        )
    } else {
        userLogout = (
            <>
                <NavItem className="d-flex">
                    <NavLink className="fuente" style={{ color: "#EF87E0" }} id="logout" tag={Link} to="/logout">Logout</NavLink>
                </NavItem>
            </>
        )

    }

    return (
        <div>
            <Navbar expand="md" dark color="dark">
                <NavbarBrand href="/">
                    <img alt="logo" src="/eol_logo.png" style={{ height: 30, width: 250 }} />
                </NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="ms-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav className="ms-auto mb-2 mb-lg-0" navbar>
                        {adminLinks}
                        {playerLinks}
                        {publicLinks}
                        {userLogout}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default AppNavbar;