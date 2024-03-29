import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { defaultAuthCheck, checkRefresh } from "../../AuthCheck";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux";
import axios from "axios";
import Loader from "../../Components/General/Loader";
import Cookies from "universal-cookie";

axios.defaults.withCredentials = true;
function CreateQuizAttempt() {
    const cookies = new Cookies();
    const currentToken = cookies.get("currentUser");

    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [firstLoad, setFirstLoad] = useState(true);
    const [currUserId, setCurrUserId] = useState("");

    const firstTimeLoad = async () => {
        await defaultAuthCheck(navigate).then((result) => {
            loadPage(result);
        });
    };

    const loadPage = async (result) => {
        console.log(result.status)
        console.log(result.status == 200)
        if (result.status == 200) {
            dispatch(authActions.login());
            const { _id: id } = result.data.existingUser;
            console.log(id)
            setCurrUserId(id);
            addNewQuizAttempt(id);
        }
    };
    // =================methods=================
    const addNewQuizAttempt = async (userId) => {
        await axios
            .post(
                process.env.REACT_APP_BACKEND_API + "/quizAttempts/",
                {
                    quizId,
                    userId,
                },
                {
                    headers: { Authorization: `Bearer ${currentToken}` },
                }
            )
            .then((res) => {
                if (res.data.success) {
                    alert("Successfully added");
                    navigate(`/quizzes/attempt/${res.data.data}`);
                } else {
                    alert("Failed to add");
                }
            })
            .catch((err) => {
                alert("Failed to add");
            });
    };
    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(false);
            firstTimeLoad();
        }
        let interval = setInterval(() => {
            checkRefresh().then((result) => loadPage(result));
        }, 1000 * 10);
        return () => clearInterval(interval);
    }, []);
    return (
        <div>
            <Loader text={"Generating Quiz"} />
        </div>
    );
}

export default CreateQuizAttempt;
