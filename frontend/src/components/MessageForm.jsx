import axios from 'axios'
import React, { useState } from 'react'
import { toast } from "react-toastify";

const MessageForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    
    const handleMessage = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:4000/api/v1/message/send",
                { firstName, lastName, phone, email, message },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                toast.success(res.data.message);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPhone("");
                setMessage("");
            })
        } catch (error) {
            // Extract main error message
            const errorMessage = extractErrorMessage(error.response.data);

            toast.error(errorMessage);
        }
    };

    // Function to extract main error message from HTML error response
    const extractErrorMessage = (errorHtml) => {
        const startTag = 'Error: ';
        const endTag = '<br>';

        const startIndex = errorHtml.indexOf(startTag);
        const endIndex = errorHtml.indexOf(endTag, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
            return errorHtml.substring(startIndex + startTag.length, endIndex).trim();
        } else {
            return 'Unknown error occurred';
        }
    };


return (
    <div className="container form-component message-form">
        <h2>Send us a message</h2>
        <form onSubmit={handleMessage}>
            <div>
                <input 
                    type="text"
                    placeholder='First Name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder='Last Name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <input 
                    type="text"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="number"
                    placeholder='Phone Number'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                </div>
                <textarea
                    rows={7}
                    placeholder='Message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <div style={{justifyContent: 'center', alignItems: 'center'}}>
                    <button type='submit'>Send</button>
                </div>
        </form>
    </div>
)
}

export default MessageForm