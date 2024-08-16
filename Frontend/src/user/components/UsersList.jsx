import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

export default function UsersList({ users }) {
if (users.length === 0) {
        return (
          <div className="center">
            <Card>
              <h2>No Users Found</h2>
            </Card>
          </div>
        );
      }
  

  return (
    <ul className="users-list">
      {users.map((user) => (
        <UserItem key={user.id} {...user} />
      ))}
    </ul>
  );
}
