import React, { useEffect, useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../../Components/Events/EventForm";
import { defaultAuthCheck } from "../../AuthCheck";
import axios from "axios";
import { mainContext } from "../../Contexts/mainContext";

function AddEventPage(props) {
    const { setUserId } = useContext(mainContext);
    const currentToken = localStorage.getItem("loginToken");
    const [loading, setLoading] = useState(true);
    const [currUserId, setCurrUserId] = useState(null);
    const navigate = useNavigate();
    const loadPage = async () => {
        await defaultAuthCheck(navigate).then((result) => {
            if (result.data.success) {
                setUserId(result.data.id);
                setCurrUserId(result.data.id);
                console.log("Logged in");
                setLoading(false);
            }
        });
    };
    useEffect(() => {
        loadPage();
    }, []);

    // =================methods=================
    const addNewEvent = async (newEvent) => {
        await axios
            .post(
                process.env.REACT_APP_BACKEND_API + "/events/",
                {
                    ...newEvent,
                    userId:currUserId,
                },
                { headers: { Authorization: `Bearer ${currentToken}` } }
            )
            .then((res) => {
                if (res.data.success) {
                    alert("Successfully added");
                    navigate("/events");
                } else {
                    alert("Failed to add");
                }
            })
            .catch((err) => {
                alert("Failed to add");
            });
    };
    return (
        <div>
            {loading ? (
                <>Loading...</>
            ) : (
                <>
                    <EventForm proceedFunction={addNewEvent} header={"Add New Event"}/>
                </>
            )}
        </div>
    );
}

export default AddEventPage;
