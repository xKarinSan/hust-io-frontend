import React, { useEffect, useState,useContext } from "react";
import MainCalendar from "../../Components/Organiser/MainCalendar";
import { defaultAuthCheck } from "../../AuthCheck";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../../Contexts/mainContext";

function OrganiserPage(props) {
    const { setUserId } = useContext(mainContext);
    const [loading,setLoading] = useState(true)
    const [currUserId, setCurrUserId] = useState(null);
    const navigate = useNavigate();
    const loadPage = async () => {
        await defaultAuthCheck(navigate).then((result) => {
            if (result.data.success) {
                // setLoggedIn(true);
                setCurrUserId(result.data.id);
                setUserId(result.data.id)
                console.log("Logged in");
                setLoading(false)
            }
        });
    };
    useEffect(() => {
        loadPage();
    }, []);
    return (
        <div>
            {loading?<>Loading ...</>:<><MainCalendar userId = {currUserId}/></>}
        </div>
    );
}

export default OrganiserPage;
