import React, { useContext, useState } from 'react'
import { Context } from '../main'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigateTo = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/user/login",
                { email, password, confirmPassword, role: "Patient" },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );
            toast.success(response.data.message);
            setIsAuthenticated(true)
        } catch (error) {
            // Extract main error message
            const errorMessage = extractErrorMessage(error.response.data);

            toast.error(errorMessage);
        }
    }

    if(isAuthenticated) {
        return <Navigate to={"/"} />
    }

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
    <div className='container form-component login-form'>
        <h2>Sign In</h2>
        <p>Please Login To Continue</p>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste unde quasi temporibus quia sit perspiciatis quibusdam, earum quae corrupti necessitatibus!</p>
        <form onSubmit={handleLogin}>
            <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder='Email' 
                />
            <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password' 
                />
            <input  
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm Password' 
                />
            <div
                style={{
                    gap: "10px",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                }}>
                    <p style={{ marginBottom: 0 }}>
                        Not Registered?
                    </p>
                    <Link 
                        to={"/register"}
                        style={{ textDecoration: "none", alignItems: "center" }}>
                            Register Now
                    </Link>
            </div>
            <div 
                style={{ justifyContent: "center", alignItems: "center" }}>
                    <button type='submit'>Login</button>
            </div>
        </form>
    </div>
)
}

export default Login