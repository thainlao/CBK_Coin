import React, { useEffect, useState } from "react";
import { fetchUserData } from "../hoocs/fetchUserData";
import { IUserData } from "../utils/types";
import ErrorPage from "../pages/ErrorPage";
import LoadingPage from "../pages/LoadingPage";

export interface Props {
    friend: any;
}

const SingleFrien: React.FC<Props> = ({friend}) => {
    const [singleUserData, setSingleUserData] = useState<IUserData | null>(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUserData = async () => {
            setLoading(true);
            try {
                const data = await fetchUserData(friend);
                setSingleUserData(data);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        getUserData();
    }, [friend]);

    if (error) {
        return <ErrorPage />;
    }

    if (!singleUserData) {
        return <LoadingPage />;
    }

    if (loading) {
        return <LoadingPage />
    }

    let firstCharecters = singleUserData.username.split(' ').map((a: string) => a[0]);

    return (
        <div className="single_friend">
                <div className="single_friend_text">
                <div className="avatar-placeholder">
                    <h1>{firstCharecters}</h1>
                </div>
                    <section>
                        <h1>{singleUserData.username}</h1>
                        <p>+ {singleUserData.friends.length}</p>
                    </section>
                </div>
                <h3>{singleUserData.cbkCoins} <span>CBK</span></h3>
        </div>
    )
}

export default SingleFrien;