import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { defaultAuthCheck, checkRefresh } from "../../AuthCheck";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux";
import axios from "axios";
import QuizForm from "../../Components/Quiz/QuizForm";
import Breadcrumbs from "../../Components/General/Breadcrumbs";
import Loader from "../../Components/General/Loader";
import Cookies from "universal-cookie";

function AddQuizPage() {
    const cookies = new Cookies();
    const currentToken = cookies.get("currentUser");

    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currUserId, setCurrUserId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const firstTimeLoad = async () => {
        await defaultAuthCheck(navigate).then((result) => {
            loadPage(result);
        });
    };
    const loadPage = async (result) => {
        if (result.status == 200) {
            dispatch(authActions.login());
            const { _id: id } = result.data.existingUser;
            setCurrUserId(id);
            setLoading(false);
        }
    };
    // =================methods=================
    const addNewQuiz = async (newQuiz) => {
        await axios
            .post(
                process.env.REACT_APP_BACKEND_API + "/quizzes/",
                {
                    ...newQuiz,
                    userId: currUserId,
                },
                {
                    headers: { Authorization: `Bearer ${currentToken}` },
                }
            )
            .then((res) => {
                if (res.data.success) {
                    alert("Successfully added");
                    navigate("/quizzes");
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
            <Breadcrumbs
                links={[
                    { text: "Home", linkDest: "/home" },
                    {
                        text: "Quizzes",
                        linkDest: "/quizzes",
                    },
                    {
                        text: "New Quiz",
                    },
                ]}
            />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <QuizForm
                        proceedFunction={addNewQuiz}
                        heading={"New Quiz"}
                    />
                </>
            )}
        </div>
    );
}

export default AddQuizPage;
