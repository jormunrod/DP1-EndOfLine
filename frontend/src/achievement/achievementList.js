import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import tokenService from "../services/token.service";
import deleteFromList from "../util/deleteFromList";
import getErrorModal from "../util/getErrorModal";
import useFetchState from "../util/useFetchState";

const Pagination = ({ achievementsPerPage, totalAchievements, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalAchievements / achievementsPerPage); i++) {
        pageNumbers.push(i);
    }

    const getPageStyle = (pageNumber) => {
        return {
            backgroundColor: '#343F4B', 
            color: currentPage === pageNumber ? "#75FBFD" : '#EF87E0',
            border: 'none',
            padding: '5px 10px',
            margin: '0 5px',
            borderRadius: '5px',
            cursor: 'pointer'
        };
    };

        return (
            <nav>
                <ul className='pagination'>
                    {pageNumbers.map(number => (
                        <li key={number} className='page-item'>
                            <a 
                                onClick={(e) => {
                                    e.preventDefault();
                                    paginate(number);
                                }} 
                                href="!#" 
                                style={getPageStyle(number)}
                                className='page-link'
                            >
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        );
};

export default function AchievementList() {
    const jwt = tokenService.getLocalAccessToken();
    const [achievements, setAchievements] = useFetchState(null, "/api/v1/achievements", jwt);
    const [currentPage, setCurrentPage] = useState(1);
    const [achievementsPerPage] = useState(5);

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/v1/achievements", {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const data = await response.json();
                setAchievements(data);
            } catch (error) {
                setMessage("Error fetching achievements data");
                setVisible(true);
            }
        };
        fetchData();
    }, [jwt, setAchievements]);

    const indexOfLastAchievement = currentPage * achievementsPerPage;
    const indexOfFirstAchievement = indexOfLastAchievement - achievementsPerPage;
    const currentAchievements = achievements ? achievements.slice(indexOfFirstAchievement, indexOfLastAchievement) : [];

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const modal = getErrorModal(setVisible, visible, message);

    return (
        <div className="home-page-container">
            <div className="hero-div">
            <h1 style={{ textAlign: 'center', color: "#EF87E0" }}>Achievements</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', width: '100%', padding: '10px' }}>
                        <span style={{ flex: 2, textAlign: 'center' }}>Name</span>
                        <span style={{ flex: 2, textAlign: 'center' }}>Description</span>
                        <span style={{ flex: 2, textAlign: 'center' }}>Badge Image</span>
                    </div>
                    {currentAchievements.length > 0 ? (
                        currentAchievements.map((achievement) => (
                            <div key={achievement.id} style={{ display: 'flex', width: '100%', padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <span style={{ flex: 2, textAlign: 'center', paddingLeft: '10px' }}>{achievement.name}</span>
                                <span style={{ flex: 2, textAlign: 'center', paddingLeft: '10px' }}>{achievement.description}</span>
                                <span style={{ flex: 2, textAlign: 'center' }}>
                                <img src={achievement.badgeAchieved} alt="badge_achieved" style={{ borderRadius: "50%", width: "40px", height:"40px"}} />
                                </span>
                                <span style={{ flex: 1, textAlign: 'center' }}>
                                    <Button
                                        aria-label={"delete-" + achievement.id}
                                        size="sm"
                                        color="danger"
                                        onClick={() => deleteFromList(
                                            `/api/v1/achievements/${achievement.id}`,
                                            achievement.id,
                                            [achievements, setAchievements],
                                            [alerts, setAlerts],
                                            setMessage,
                                            setVisible
                                        )}
                                    >
                                        Delete
                                    </Button>
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', width: '100%' }}>Loading...</div>
                    )}
                </div>
                <Pagination
                    achievementsPerPage={achievementsPerPage}
                    totalAchievements={achievements ? achievements.length : 0}
                    paginate={paginate}
                    currentPage={currentPage}
                />
                {modal}
            </div>
        </div>
    );
};