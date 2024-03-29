import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../../Components/General/Loader";
function EmailVerificationPage() {
    const { userId, token } = useParams();
    const [verified, setVerified] = useState(false);
    const [verificationFailed, setVerificationFailed] = useState(false);
    useEffect(() => {
        axios
            .put(
                `${process.env.REACT_APP_BACKEND_API}/users/verify/${userId}/${token}`
            )
            .then((res) => {
                if (res.data.success) {
                    setVerificationFailed(false);
                    setVerified(true);
                } else {
                    setVerificationFailed(true);
                    setVerified(false);
                }
            })
            .catch((err) => {
                setVerificationFailed(true);
                setVerified(false);
            });
    }, []);
    return (
        <div className="container authContainer card">
            {!verified && !verificationFailed ? (
                <Loader text={"Verifying"} />
            ) : (
                <div className="card authFormContainer">
                    <h1 className="title is-2">
                        {" "}
                        {verified && !verificationFailed ? (
                            <>Verified!</>
                        ) : (
                            <>Failed to verify</>
                        )}
                    </h1>

                    <Link to="/login" className="button addButton">
                        Back to login
                    </Link>
                </div>
            )}
        </div>
    );
}

export default EmailVerificationPage;
