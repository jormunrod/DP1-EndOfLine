import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation } from 'react-router-dom';
import AppNavbar from "./AppNavbar";
import GameNavbar from "./GameNavbar";
import AchievementEdit from "./achievement/achievementEdit";
import AchievementList from "./achievement/achievementList";
import AchievementPlayer from "./achievement/achievementListPlayer";
import ClinicOwnerEditAdmin from "./admin/clinicOwners/ClinicOwnerEditAdmin";
import ClinicOwnerListAdmin from "./admin/clinicOwners/ClinicOwnerListAdmin";
import ClinicEditAdmin from "./admin/clinics/ClinicEditAdmin";
import ClinicListAdmin from "./admin/clinics/ClinicListAdmin";
import ConsultationEditAdmin from "./admin/consultations/ConsultationEditAdmin";
import ConsultationListAdmin from "./admin/consultations/ConsultationListAdmin";
import TicketListAdmin from "./admin/consultations/TicketListAdmin";
import FriendshipListAdmin from "./admin/friendships/FriendshipListAdmin";
import OwnerEditAdmin from "./admin/owners/OwnerEditAdmin";
import OwnerListAdmin from "./admin/owners/OwnerListAdmin";
import PetEditAdmin from "./admin/pets/PetEditAdmin";
import PetListAdmin from "./admin/pets/PetListAdmin";
import PlayerListAdmin from "./admin/players/PlayerListAdmin";
import UserEditAdmin from "./admin/users/UserEditAdmin";
import UserListAdmin from "./admin/users/UserListAdmin";
import SpecialtyEditAdmin from "./admin/vets/SpecialtyEditAdmin";
import SpecialtyListAdmin from "./admin/vets/SpecialtyListAdmin";
import VetEditAdmin from "./admin/vets/VetEditAdmin";
import VetListAdmin from "./admin/vets/VetListAdmin";
import VisitEditAdmin from "./admin/visits/VisitEditAdmin";
import VisitListAdmin from "./admin/visits/VisitListAdmin";
import Login from "./auth/login";
import Logout from "./auth/logout";
import Register from "./auth/register";
import AdminBoard from "./games/adminBoard";
import AdminGamesList from "./games/adminGamesList";
import Board from "./games/board";
import NewGame from "./games/newGame";
import PlayerGamesList from "./games/playerGamesList";
import Home from "./home";
import FriendshipListPlayer from "./player/friendships/FriendshipListPlayer";
import PlayerProfile from "./player/playerProfile";
import PlayerProfileEdit from "./player/playerProfileEdit";
import PlayerStats from "./player/playerStats";
import PrivateRoute from "./privateRoute";
import PlanList from "./public/plan";
import SwaggerDocs from "./public/swagger";
import PDFViewer from "./rules";
import tokenService from "./services/token.service";


function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const jwt = tokenService.getLocalAccessToken();
  let roles = []
  if (jwt) {
    roles = getRolesFromJWT(jwt);
  }

  function getRolesFromJWT(jwt) {
    return jwt_decode(jwt).authorities;
  }

  let adminRoutes = <></>;
  let ownerRoutes = <></>;
  let userRoutes = <></>;
  let playerRoutes = <></>;
  let gameRoutes = <></>;
  let publicRoutes = <></>;

  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminRoutes = (
        <>
          <Route path="/users" exact={true} element={<PrivateRoute><UserListAdmin /></PrivateRoute>} />
          <Route path="/users/:username" exact={true} element={<PrivateRoute><UserEditAdmin /></PrivateRoute>} />
          <Route path="/owners" exact={true} element={<PrivateRoute><OwnerListAdmin /></PrivateRoute>} />
          <Route path="/owners/:id" exact={true} element={<PrivateRoute><OwnerEditAdmin /></PrivateRoute>} />
          <Route path="/clinics" exact={true} element={<PrivateRoute><ClinicListAdmin /></PrivateRoute>} />
          <Route path="/clinics/:id" exact={true} element={<PrivateRoute><ClinicEditAdmin /></PrivateRoute>} />
          <Route path="/clinicOwners" exact={true} element={<PrivateRoute><ClinicOwnerListAdmin /></PrivateRoute>} />
          <Route path="/clinicOwners/:id" exact={true} element={<PrivateRoute><ClinicOwnerEditAdmin /></PrivateRoute>} />
          <Route path="/pets" exact={true} element={<PrivateRoute><PetListAdmin /></PrivateRoute>} />
          <Route path="/pets/:id" exact={true} element={<PrivateRoute><PetEditAdmin /></PrivateRoute>} />
          <Route path="/pets/:petId/visits" exact={true} element={<PrivateRoute><VisitListAdmin /></PrivateRoute>} />
          <Route path="/pets/:petId/visits/:visitId" exact={true} element={<PrivateRoute><VisitEditAdmin /></PrivateRoute>} />
          <Route path="/vets" exact={true} element={<PrivateRoute><VetListAdmin /></PrivateRoute>} />
          <Route path="/vets/:id" exact={true} element={<PrivateRoute><VetEditAdmin /></PrivateRoute>} />
          <Route path="/vets/specialties" exact={true} element={<PrivateRoute><SpecialtyListAdmin /></PrivateRoute>} />
          <Route path="/vets/specialties/:specialtyId" exact={true} element={<PrivateRoute><SpecialtyEditAdmin /></PrivateRoute>} />
          <Route path="/consultations" exact={true} element={<PrivateRoute><ConsultationListAdmin /></PrivateRoute>} />
          <Route path="/consultations/:consultationId" exact={true} element={<PrivateRoute><ConsultationEditAdmin /></PrivateRoute>} />
          <Route path="/consultations/:consultationId/tickets" exact={true} element={<PrivateRoute><TicketListAdmin /></PrivateRoute>} />
          <Route path="/achievements" exact={true} element={<PrivateRoute><AchievementList /></PrivateRoute>} />
          <Route path="/achievements/:achievementId" exact={true} element={<PrivateRoute><AchievementEdit /></PrivateRoute>} />
          <Route path="/games" exact={true} element={<PrivateRoute><AdminGamesList /></PrivateRoute>} />
          <Route path="/players" exact={true} element={<PrivateRoute><PlayerListAdmin /></PrivateRoute>} />
          <Route path="/friendships" exact={true} element={<PrivateRoute><FriendshipListAdmin /></PrivateRoute>} />
          <Route path="/game/:id" exact={true} element={<PrivateRoute><AdminBoard /></PrivateRoute>} />
        </>)
    }
    if (role === "PLAYER") {
      playerRoutes = (
        <>
          {/* <Route path="/dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} /> */}
          <Route path="/games" exact={true} element={<PrivateRoute><PlayerGamesList /></PrivateRoute>} />
          <Route path="/profile" exact={true} element={<PrivateRoute><PlayerProfile /></PrivateRoute>} />
          <Route path="/profile/edit" exact={true} element={<PrivateRoute><PlayerProfileEdit /></PrivateRoute>} />
          <Route path="/achievements" exact={true} element={<PrivateRoute><AchievementPlayer /></PrivateRoute>} />
          <Route path="/stats" exact={true} element={<PrivateRoute><PlayerStats /></PrivateRoute>} />
          <Route path="/play" exact={true} element={<PrivateRoute><NewGame /></PrivateRoute>} />
          <Route path="/game/:id" exact={true} element={<PrivateRoute><Board /></PrivateRoute>} />
          <Route path="/friendships" exact={true} element={<PrivateRoute><FriendshipListPlayer /></PrivateRoute>} />
        </>)
      gameRoutes = (
        <>
          <Route path="/game/:id" exact={true} element={<PrivateRoute><Board /></PrivateRoute>} />
          <Route path="/rulesInGame" element={<PDFViewer />} />
        </>
      )
    }
  })
  if (!jwt) {
    publicRoutes = (
      <>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  } else {
    userRoutes = (
      <>
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  }

  const location = useLocation();
  const [isGameRoute, setIsGameRoute] = useState(false);
  const [isRulesInGameRoute, setIsRulesInGameRoute] = useState(false);

  useEffect(() => {
    const gamePaths = ['/game/:id'];
    const rulesInGamePaths = ['/rulesInGame'];
    const currentPath = location.pathname;
    setIsGameRoute(gamePaths.some(path => currentPath.startsWith(path.replace(':id', ''))));
    setIsRulesInGameRoute(rulesInGamePaths.some(path => currentPath.startsWith(path)));
  }, [location]);

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback} >
        {(isGameRoute || isRulesInGameRoute) ? <GameNavbar /> : <AppNavbar />}
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/plans" element={<PlanList />} />
          <Route path="/docs" element={<SwaggerDocs />} />
          <Route path="/rules" element={<PDFViewer />} />
          {publicRoutes}
          {userRoutes}
          {adminRoutes}
          {ownerRoutes}
          {playerRoutes}
          {gameRoutes}
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
