import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";

export default function UserPlaces() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [loadComponents, setLoadComponents] = useState(false);
  const userId = useParams().userId;

  const fetchUserPlaces = async () => {
    const responseData = await sendRequest(
      `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`
    );
    return setLoadedPlaces(responseData.places);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
        setLoadComponents(true);
      } catch (err) {
        console.log();
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {(isLoading || !loadComponents) &&(
        <div className='center'>
            <LoadingSpinner />
            <h2>Loading...</h2>
        </div>)}
      {!isLoading && loadComponents && <PlaceList places={loadedPlaces} onDelete={fetchUserPlaces}/>}
    </>
  );
}
