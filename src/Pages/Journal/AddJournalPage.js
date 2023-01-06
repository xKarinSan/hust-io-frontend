import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JournalForm from "../../Components/Journal/JournalForm";
import { defaultAuthCheck } from "../../AuthCheck";
import axios from "axios";
import Breadcrumbs from "../../Components/General/Breadcrumbs";
import Loader from "../../Components/General/Loader";

axios.defaults.withCredentials = true;
function AddJournalPage() {
    const [loading, setLoading] = useState(true);
    const [currUserId, setCurrUserId] = useState(null);
    const navigate = useNavigate();
    const loadPage = async () => {
        await defaultAuthCheck(navigate).then((result) => {
            if (result.status == 200) {
                const { _id: id } = result.data.existingUser;
                setCurrUserId(id);
                setLoading(false);
            }
        });
    };
    useEffect(() => {
        loadPage();
    }, []);
    // =================methods=================
    const addNewJournalEntry = async (newJournalEntry) => {
        await axios
            .post(
                process.env.REACT_APP_BACKEND_API + "/journals/",
                {
                    ...newJournalEntry,
                    userId: currUserId,
                },
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                if (res.data.success) {
                    alert("Successfully added");
                    navigate("/journals");
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
            <Breadcrumbs
                links={[
                    { text: "Home", linkDest: "/home" },
                    {
                        text: "Journal Entries",
                        linkDest: "/journals",
                    },
                    {
                        text: "Add Journal Entry",
                    },
                ]}
            />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <JournalForm
                        proceedFunction={addNewJournalEntry}
                        heading={"New Journal Entry"}
                    />
                </>
            )}
        </div>
    );
}

export default AddJournalPage;
