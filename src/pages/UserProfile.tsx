import { useParams } from "react-router-dom";

export const UserProfile = () => {
    const { userId } = useParams();

    return (
        <div>
            <h2>User Profile</h2>
            <p>User ID: {userId}</p>
        </div>
    );
};
