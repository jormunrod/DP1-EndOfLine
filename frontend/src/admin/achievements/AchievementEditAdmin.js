import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Input, Label } from "reactstrap";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";
import getIdFromUrl from "../../util/getIdFromUrl";
import useFetchState from "../../util/useFetchState";

const jwt = tokenService.getLocalAccessToken();

export default function AchievementEdit() {
    const id = getIdFromUrl(2);
    const emptyAchievement = {
        id: id === "new" ? null : id,
        name: "",
        description: "",
        badgeNotAchieved: "https://cdn-icons-png.flaticon.com/128/5730/5730459.png",
        badgeAchieved: "https://cdn-icons-png.flaticon.com/512/5778/5778223.png",
        threshold: "",
        category: "GAMES_PLAYED",
        actualDescription: ""
    };

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [achievement, setAchievement] = useFetchState(
        emptyAchievement,
        `/api/v1/achievements/${id}`,
        jwt,
        setMessage,
        setVisible,
        id
    );

    const modal = getErrorModal(setVisible, visible, message);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAchievement({ ...achievement, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `/api/v1/achievements${achievement.id ? "/" + achievement.id : ""}`,
                {
                    method: achievement.id ? "PUT" : "POST",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(achievement),
                }
            );

            const data = await response.text();
            if (data === "")
                window.location.href = "/achievements";
            else {
                let json = JSON.parse(data);
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                } else
                    window.location.href = "/achievements";
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="home-page-container">
            <div className="scrollable-content" style={scrollbarStyles}> 
                <div className="hero-div">
                    <h1 className="text-center">{achievement.id ? "Edit Achievement" : "Add Achievement"}</h1>
                    {modal}
                    <Form onSubmit={handleSubmit}>
                        <div className="custom-form-input">
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                required
                                name="name"
                                id="name"
                                value={achievement.name || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="custom-form-input">
                            <Label for="description">Description</Label>
                            <Input
                                type="text"
                                required
                                name="description"
                                id="description"
                                value={achievement.description || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="custom-form-input">
                            <Label for="name">Badge not achieved image URL</Label>
                            <Input
                                type="text"
                                required
                                name="badgeNotAchieved"
                                id="badgeNotAchieved"
                                value={achievement.badgeNotAchieved || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="custom-form-input">
                            <Label for="name">Badge achieved image URL</Label>
                            <Input
                                type="text"
                                required
                                name="badgeAchieved"
                                id="badgeAchieved"
                                value={achievement.badgeAchieved || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="custom-form-input">
                            <Label for="name">Threshold</Label>
                            <Input
                                type="text"
                                required
                                name="threshold"
                                id="threshold"
                                value={achievement.threshold || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="custom-form-input">
                            <Label for="name">Category</Label>
                            <Input
                                type="text"
                                required
                                name="category"
                                id="category"
                                value={achievement.category || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <Button outline color="danger">
                                <Link to="/achievements" style={{ textDecoration: "none", color: "white" }}>
                                    Cancel
                                </Link>
                            </Button>
                            <div style={{ width: "10px" }}></div>
                            <Button outline color="success" style={{ textDecoration: "none", color: "white"}} type="submit">
                            {achievement.id ? "Save" : "Create"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const scrollbarStyles = {
    maxHeight: "900px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#222222",
    WebkitOverflowScrolling: "touch",
    "&::-webkit-scrollbar": {
        width: "1px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#222",
        borderRadius: "1px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: "#555",
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
    },
};