import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../main';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const [show, setShow] = useState(false);
    const { isAuthenticated } = useContext(Context);

    const navigateTo = useNavigate();

    const handleLogout = async () => {
            await axios.get(
                "http://localhost:4000/api/v1/user/patient/logout", {
                    withCredentials: true,
                }).then((res) => {
                    toast.success(res.data.message);
                }).catch((error) => {
                    // Extract main error message
                    const errorMessage = extractErrorMessage(error.response.data);
        
                    toast.error(errorMessage);
                });
    };

    const gotoLogin = () => {
        navigateTo("/login");
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
    <nav className='container'>
        <div className='logo'>ZeeCare</div>
        <div className={show ? "navLinks showmenu": "navLinks"}>
            <div className="links">
                <Link to={"/"}>Home</Link>
                <Link to={"/appointment"}>Appointment</Link>
                <Link to={"/about"}>About Us</Link>
            </div>
            {isAuthenticated ? (
                <button className='logoutBtn btn' onClick={handleLogout}>
                    Logout
                </button>
            ) : (
                <button className='logoutBtn btn' onClick={gotoLogin}>
                    Login
                </button>
            )}
        </div>
    </nav>
)
}

export default Navbar