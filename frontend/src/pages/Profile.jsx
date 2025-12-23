import { useEffect, useState } from "react";
import { useGetProfile } from "@hooks/profile/useGetProfile.jsx";
import ProfileCard from "@components/ProfileCard.jsx";
import "@styles/profile.css";

const Profile = () => {
  const { fetchProfile } = useGetProfile();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetchProfile();
        console.log("Profile response:", response);
        if (response && response.data) {
          setProfileData(response.data);
        } else {
          setError("No se pudo cargar el perfil");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    getProfileData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="profile-container">
          <p>Cargando perfil...</p>
        </div>
      ) : error ? (
        <div className="profile-container">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      ) : profileData ? (
        <div className="profile-container">
          <ProfileCard user={profileData} />
        </div>
      ) : (
        <div className="profile-container">
          <p>No se encontró información del perfil</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
