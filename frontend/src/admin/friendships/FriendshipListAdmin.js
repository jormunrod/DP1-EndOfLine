import React, { useEffect, useState } from "react";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";

const Pagination = ({ friendshipsPerPage, totalFriendships, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalFriendships / friendshipsPerPage); i++) {
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

export default function FriendshipList() {
    const jwt = tokenService.getLocalAccessToken();
    const [friendships, setFriendships] = useFetchState(null, "/api/v1/friendships/all", jwt);
    const [currentPage, setCurrentPage] = useState(1);
    const [friendshipsPerPage] = useState(5);

    const [message, setMessage] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/v1/friendships/all", {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });
                const data = await response.json();
                setFriendships(data);
            } catch (error) {
                setMessage("Error fetching friendships data");
                setVisible(true);
            }
        };
        fetchData();
    }, [jwt, setFriendships]);

    const indexOfLastFriendship = currentPage * friendshipsPerPage;
    const indexOfFirstFriendship = indexOfLastFriendship - friendshipsPerPage;
    const currentFriendships = friendships ? friendships.slice(indexOfFirstFriendship, indexOfLastFriendship) : [];

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const modal = getErrorModal(setVisible, visible, message);

    const getFriendStateStyle = (state) => {
        switch (state) {
            case "ACCEPTED":
                return { color: "green" };
            case "REJECTED":
                return { color: "red" };
            default:
                return { color: "yellow" };
        }
    };    

    return (
        <div className="home-page-container">
            <div className="hero-div">
            <h1 style={{ textAlign: 'center', color: "#EF87E0" }}>Friendships</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', width: '100%', padding: '10px' }}>
                        <span style={{ flex: 2, textAlign: 'center' }}>Sender's nickname</span>
                        <span style={{ flex: 2, textAlign: 'left' }}>Sender's avatar</span>
                        <span style={{ flex: 2, textAlign: 'left' }}>Receiver's nickname</span>
                        <span style={{ flex: 2, textAlign: 'center' }}>Receiver's avatar</span>
                        <span style={{ flex: 2, textAlign: 'center' }}>Status</span>
                    </div>
                    {currentFriendships.length > 0 ? (
                        currentFriendships.map((friendship) => (
                            <div key={friendship.id} style={{ display: 'flex', width: '100%', padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <span style={{ flex: 2, textAlign: 'left', paddingLeft: '10px' }}>{friendship.sender.nickname}</span>
                                <span style={{ flex: 2, textAlign: 'center' }}>
                                    <img src={friendship.sender.avatar} alt="avatar" style={{ borderRadius: "50%", width: "40px", height: "40px" }} />
                                </span>
                                <span style={{ flex: 3, textAlign: 'left', paddingLeft: '10px' }}>{friendship.receiver.nickname}</span>
                                <span style={{ flex: 2, textAlign: 'center' }}>
                                    <img src={friendship.receiver.avatar} alt="avatar" style={{ borderRadius: "50%", width: "40px", height: "40px" }} />
                                </span>
                                <span style={{ flex: 2, textAlign: 'center', paddingLeft: '10px', ...getFriendStateStyle(friendship.friendState) }}>{friendship.friendState}
                                </span>

                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', width: '100%' }}>Loading...</div>
                    )}
                </div>
                <Pagination
                    friendshipsPerPage={friendshipsPerPage}
                    totalFriendships={friendships ? friendships.length : 0}
                    paginate={paginate}
                    currentPage={currentPage}
                />
                {modal}
            </div>
        </div>
    );
};