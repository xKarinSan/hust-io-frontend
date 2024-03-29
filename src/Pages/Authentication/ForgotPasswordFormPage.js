import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/General/Loader";
function ForgotPasswordFormPage() {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { userId, token } = useParams();
    const navigate = useNavigate();
    const resetPassword = async () => {
        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters!");
        } else {
            setLoading(true);
            axios
                .post(process.env.REACT_APP_BACKEND_API + "/users/changepass", {
                    newPassword,
                    userId,
                    token,
                })
                .then((res) => {
                    alert("Password reset sucessfully.");
                    navigate("/login");
                })
                .catch((err) => {
                    alert("Failed to reset password");
                });
            setLoading(false);
        }
    };
    return (
        <div>
            {loading ? (
                <Loader text={"Resetting password"} />
            ) : (
                <div className="container authForm card">
                    <h1 className="title is-2">Reset password</h1>
                    <label className="label">New Password:</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                        }}
                    />
                    <Link
                        className="button is-link"
                        type="button"
                        onClick={() => {
                            resetPassword();
                        }}
                    >
                        Proceed
                    </Link>
                    <br></br>
                    <Link
                        className="button cancelAuthBtn"
                        type="button"
                        to="/login"
                    >
                        Cancel
                    </Link>
                </div>
            )}
        </div>
    );
}

export default ForgotPasswordFormPage;
