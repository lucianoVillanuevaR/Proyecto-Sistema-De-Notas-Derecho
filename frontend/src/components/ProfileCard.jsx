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
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
          <p>
            <strong>Fecha de creación:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
