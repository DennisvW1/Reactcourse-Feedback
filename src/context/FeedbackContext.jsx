import React, { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState([])

    useEffect(() => {
        fetchFeedback()
    }, [])

    // Fetch feedback
    const fetchFeedback = async () => {
        const response = await fetch("/feedback?_sort=id&_order=desc");
        const data = await response.json();

        setFeedback(data);
        setIsLoading(false);
    }

    const [feedbackEdit, setFeedbackEdit] = useState({
        item: {},
        edit: false
    })

    // To add feedback
    const addFeedback = async (newFeedback) => {
        const response = await fetch("/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newFeedback)
        })

        const data = await response.json();

        setFeedback([data, ...feedback]);
    }

    // To delete feedback
    const deleteFeedback = async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            await fetch(`/feedback/${id}`, {
                method: "DELETE"
            })

            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    // To edit feedback
    const editFeedback = (item) => {
        setFeedbackEdit({
            item,
            edit: true
        })
    }

    // To update feedbackitem
    const updateFeedback = async (id, updItem) => {
        const response = await fetch(`/feedback/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updItem)
        })

        const data = await response.json();

        setFeedback(feedback.map((item) => (item.id === id ? { ...item, ...data } : item)));
    }

    return <FeedbackContext.Provider value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext;