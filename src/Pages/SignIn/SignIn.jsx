import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup, auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import './SignIn.css';
const SignIn = () => {
    const [signState, setSignState] = useState("Sign In");
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //Track Firebase Authentication Status
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is logged in:", user);
                navigate("/"); 
            }
        });
        return () => unsubscribe();  
    }, [navigate]);

    const userAuth = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (signState === "Sign In") {
                await login(email, password);
            } else {
                await signup(name, email, password);
            }
            
            setPassword("");  // ✅ Clear password field

        } catch (error) {
            console.error("Authentication error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='signin'>
            <div className="signin-form">
                <h1>{signState}</h1>
                <form onSubmit={userAuth}>
                    {signState === "Sign Up" && (
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            placeholder='Name' 
                            required
                        />
                    )}
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder='Email' 
                        required 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}  
                        placeholder='Password' 
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Processing..." : signState}
                    </button>
                </form>
                <div className="form-switch">
                    {signState === "Sign In" ? (
                        <p>Don't have an account? <span onClick={() => setSignState("Sign Up")}>Sign Up</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setSignState("Sign In")}>Sign In</span></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignIn;
