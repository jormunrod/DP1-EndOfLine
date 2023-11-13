import React, { useEffect, useState } from "react";
import { Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import tokenService from "../services/token.service";
import useFetchState from "../util/useFetchState";
import getErrorModal from "../util/getErrorModal";

const user = tokenService.getUser();
const defaultImage = "https://img.freepik.com/fotos-premium/adorable-bebe-buho-estilo-pixar-grandes-ojos-felices_804788-4862.jpg";

export default function EditPlayerProfile() {
  const jwt = tokenService.getLocalAccessToken();
  const [player, setPlayer] = useFetchState(null, `/api/v1/player/${user.id}`, jwt);
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [surname, setSurname] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [avatarError, setAvatarError] = useState("");

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/v1/player/${user.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await response.json();
        setPlayer(data);
        setName(data.name);
        setSurname(data.surname);
        setNickname(data.nickname);
        setAvatar(data.avatar);
        setEmail(data.email);
      } catch (error) {
        setMessage("Error fetching player data");
        setVisible(true);
      }
    };
    fetchData();
  }, [jwt, setPlayer]);

  const modal = getErrorModal(setVisible, visible, message);

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    // Verificación del rango de longitud del nombre
    if (newName.length < 3 || newName.length > 15) {
      setNameError("Name must be between 3 and 15 characters");
    } else {
      setNameError("");
    }
  };

  const handleSurnameChange = (event) => {
    const newSurname = event.target.value;
    setSurname(newSurname);
    // Verificación del rango de longitud del apellido
    if (newSurname.length < 3 || newSurname.length > 15) {
      setSurnameError("Surname must be between 3 and 15 characters");
    }
    else {
      setSurnameError("");
    }
  };

  const handleNicknameChange = (event) => {
    const newNickname = event.target.value;
    setNickname(newNickname);
    // Verificación del rango de longitud del nickname
    if (newNickname.length < 5 || newNickname.length > 15) {
      setNicknameError("Nickname must be between 5 and 15 characters");
    } else {
      setNicknameError("");
    }
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    // Verificación de formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handleAvatarChange = (event) => {
    const newAvatar = event.target.value;
    setAvatar(newAvatar);
    // Verificación de formato de URL de avatar
    const avatarPattern = /^https?:\/\/.*\.(jpg|png|jpeg)$/i;
    if(newAvatar.length > 0 && !avatarPattern.test(newAvatar)) {
      setAvatarError("Invalid avatar URL");
    } else {
      setAvatarError("");
    }
  };

  const handleSaveChanges = async () => {
    if (nicknameError || emailError || avatarError || nameError || surnameError) {
      setMessage("Invalid data");
      setVisible(true);
      return;
    }
    try {
      const response = await fetch(`/api/v1/player/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          id: user.id,
          name,
          surname,
          nickname,
          avatar,
          password: player.password,
          email,
          birthDate: player.birthDate,
          authority: player.authority
        }),
      }
    );

      if (response.ok) {
        console.log("Player updated successfully");
        window.location.href = "/profile";
      } else {
        const data = await response.json();
        setMessage(data.message || "Error updating player");
        setVisible(true);
      }
    } catch (error) {
      setMessage("Error updating player");
      setVisible(true);
    }
  };

  return (
    
    <div className="home-page-container">
     <div className="scrollable-content" style={scrollbarStyles}> 
      <div className="hero-div">
        <h1 className="text-center">Edit Profile</h1>
        {player ? (
          <div>
            <p style={{ marginBottom: "-2px", color: "white" }}>Name:</p>
            <Input style={{ marginBottom: "10px" }} type="text" value={name} onChange={handleNameChange} />
            {nameError && <p style={{ color: "red" }}>{nameError}</p>}
            <p style={{ marginBottom: "-2px", color: "white" }}>Surname:</p>
            <Input style={{ marginBottom: "10px" }} type="text" value={surname} onChange={handleSurnameChange} />
            {surnameError && <p style={{ color: "red" }}>{surnameError}</p>}
            <p style={{ marginBottom: "-2px", color: "white" }}>Nickname:</p>
            <Input style={{ marginBottom: "10px" }} type="text" value={nickname} onChange={handleNicknameChange} />
            {nicknameError && <p style={{ color: "red" }}>{nicknameError}</p>}
            <p style={{ marginBottom: "-2px", color: "white" }}>Email:</p>
            <Input style={{ marginBottom: "10px" }} type="text" value={email} onChange={handleEmailChange} />
            {emailError && <p style={{ color: "red" }}>{emailError}</p>}
            <p style={{ marginBottom: "-2px", color: "white" }}>Avatar:</p>
            <Input style={{ marginBottom: "20px" }} type="text" value={avatar?avatar:defaultImage} onChange={handleAvatarChange} />
            {avatarError && <p style={{ color: "red" }}>{avatarError}</p>}
            {!avatarError && avatar && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <img
                src={avatar}
                alt="avatar"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </div>
          )}
          {!avatarError && !avatar && (
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <img
                src={defaultImage}
                alt="avatar"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </div>
          )}
          </div>
        ) : (
          <p style={{ color: "white" }}>Loading player data...</p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button outline color="danger">
          <Link to="/profile" className="btn sm" style={{ textDecoration: "none", color: "white" }}>
            Cancel
          </Link>
        </Button>
        <div style={{ width: "10px" }}></div>
        <Button outline color="success" style={{ textDecoration: "none", color: "white"}} onClick={handleSaveChanges}>
          Save Changes
        </Button>
        </div>
        {modal}
        </div>
      </div>
    </div>
  );
}
