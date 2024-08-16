import { useContext } from "react";
import { useParams } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceList.css";

export default function PlaceList({ places, onDelete }) {
  const uId = useParams().userId;
  const auth = useContext(AuthContext);
  if (places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places Found, Maybe Create One</h2>
          {uId === auth.userId ? <Button to="/places/new">Share Place</Button> : null}
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {places.map((place) => (
        <PlaceItem key={place.id} {...place} onDelete={onDelete}/>
      ))}
    </ul>
  );
}
