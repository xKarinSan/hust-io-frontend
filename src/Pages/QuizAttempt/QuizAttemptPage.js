import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { defaultAuthCheck, checkRefresh } from "../../AuthCheck";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux";
import Cookies from "universal-cookie";

import axios from "axios";
import QuizAttemptQuestion from "../../Components/QuizAttempt/QuizAttemptQuestion";
import Breadcrumbs from "../../Components/General/Breadcrumbs";
import Loader from "../../Components/General/Loader";

function QuizAttemptPage() {
    const cookies = new Cookies();
    const currentToken = cookies.get("currentUser");

    const { quizAttemptId } = useParams();
    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(true);
    const [currUserId, setCurrUserId] = useState(null);
    const [quizAttempt, setQuizAttempt] = useState(null);
    const [displayDate, setDisplayDate] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const statuses = ["", "In progress", "Marking in progress", "Completed"];

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
            await getCurrentAttempt();
            setLoading(false);
        }
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
    // =================methods=================
    const getCurrentAttempt = async () => {
        await axios
            .get(
                process.env.REACT_APP_BACKEND_API +
                    `/quizAttempts/id/${quizAttemptId}`,
                {
                    headers: { Authorization: `Bearer ${currentToken}` },
                }
            )
            .then((res) => {
                if (res.data.success) {
                    setQuizAttempt(res.data.data);
                    const { isoDate } = res.data.data;
                    const quizDate = new Date(isoDate);
                    const year = quizDate.getFullYear();
                    const month = quizDate.getMonth();
                    const day = quizDate.getDate();
                    var hour = quizDate.getHours();
                    if (hour <= 9) {
                        hour = "0" + hour;
                    }
                    var minute = quizDate.getMinutes();
                    if (minute <= 9) {
                        minute = "0" + minute;
                    }
                    var seconds = quizDate.getSeconds();
                    if (seconds <= 9) {
                        seconds = "0" + seconds;
                    }

                    const displayDate = `${day}-${month + 1}-${year}, ${
                        hour == "0" ? "00" : hour
                    }:${minute == "0" ? "00" : minute}:${
                        seconds == "0" ? "00" : seconds
                    }`;
                    setDisplayDate(displayDate);
                }
            })
            .catch((err) => {});
    };
    // =============update=============
    // base function
    const editQuizAttempt = async () => {
        await axios
            .put(
                process.env.REACT_APP_BACKEND_API +
                    `/quizAttempts/${quizAttemptId}`,
                {
                    ...quizAttempt,
                    userId: currUserId,
                },
                {
                    headers: { Authorization: `Bearer ${currentToken}` },
                }
            )
            .then((res) => {
                if (res.data.success) {
                    getCurrentAttempt();
                }
            })
            .catch((err) => {});
    };

    // autosave
    const handleAnswerChange = (newAnswer, index) => {
        quizAttempt.questions[index].userAnswer = newAnswer;
    };

    // mark answer
    const handleMarking = (isCorrectStatus, index) => {
        quizAttempt.questions[index].isCorrect = isCorrectStatus;
    };

    // ==========handlers==========
    // handle submission (finish submitting)
    const submitQuiz = async () => {
        if (quizAttempt.attemptStatus == 1) {
            const confirmSubmit = prompt("Type 'ok' to submit");
            if (confirmSubmit == "ok") {
                quizAttempt.attemptStatus = 2;
                await editQuizAttempt();
                alert("Submitted");
            }
        }
    };
    // handle marking (finish marking)
    const markQuiz = async () => {
        if (quizAttempt.attemptStatus == 2) {
            const confirmSubmit = prompt("Type 'ok' to confirm finish marking");
            if (confirmSubmit == "ok") {
                quizAttempt.attemptStatus = 3;
                await editQuizAttempt();
                alert("Submitted");
            }
        }
    };
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
                        text: "Quiz Attempt",
                    },
                ]}
            />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <div className="container quizAttemptQuestion card">
                            <h2 className="title is-2 is-spaced">
                                {" "}
                                {quizAttempt.quizName}
                            </h2>
                            <h3 className="subtitle">
                                Attempt Date: {displayDate}
                            </h3>
                            <h3 className="subtitle">
                                Status: {statuses[quizAttempt.attemptStatus]}
                            </h3>

                            {quizAttempt.attemptStatus == 3 ? (
                                <h3 className="subtitle">
                                    Score: {quizAttempt.quizScore}/
                                    {quizAttempt.noOfQuestions}
                                </h3>
                            ) : (
                                <></>
                            )}
                        </div>
                        {quizAttempt.questions.map((question, index) => {
                            return (
                                <QuizAttemptQuestion
                                    changeAnswer={handleAnswerChange}
                                    markAnswer={handleMarking}
                                    autoSaveAnswer={editQuizAttempt}
                                    attemptQuestion={question}
                                    questionIndex={index}
                                    key={index}
                                    attemptStatus={quizAttempt.attemptStatus}
                                />
                            );
                        })}
                        {quizAttempt.attemptStatus == 1 ? (
                            <>
                                <button
                                    className="button quizAttemptSubmitBtn"
                                    onClick={() => {
                                        submitQuiz();
                                    }}
                                >
                                    Submit
                                </button>
                            </>
                        ) : (
                            <>
                                {quizAttempt.attemptStatus == 2 ? (
                                    <>
                                        <button
                                            className="button quizAttemptSubmitBtn"
                                            onClick={() => {
                                                markQuiz();
                                            }}
                                        >
                                            Finish Marking
                                        </button>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                        <Link
                            className="button quizAttemptSubmitBtn cancelBtn"
                            to="/quizzes"
                        >
                            Back
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default QuizAttemptPage;
