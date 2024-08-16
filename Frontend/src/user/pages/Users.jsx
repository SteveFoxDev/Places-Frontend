import { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function Users() {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState([]);
    const [loadComponents, setLoadComponents] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const responseData = await sendRequest(`${import.meta.env.VITE_BACKEND_URL}/users`);
            setLoadedUsers(responseData.users);
            setLoadComponents(true);
        } catch (err) {
            console.log();
        }
    };
    fetchUsers();
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {(isLoading || !loadComponents) && (
                <div className='center'>
                    <LoadingSpinner />
                    <h2>Loading...</h2>
                </div>)}
                {!isLoading && loadComponents && <UsersList users={loadedUsers}/>}
        </>
)
}