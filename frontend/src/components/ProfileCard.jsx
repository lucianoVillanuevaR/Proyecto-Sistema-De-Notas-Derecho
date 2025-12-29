import "@styles/profile.css";
import profilePic from "@assets/profilePic.png";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <h1 className="profile-header">Mi Perfil</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={profilePic} alt="Foto de perfil" />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.nombre || 'N/A'}
          </p>
          <p>
            <strong>RUT:</strong> {user.rut || 'N/A'}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
