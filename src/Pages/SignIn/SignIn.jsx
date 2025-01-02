import React,{ useState} from 'react';
import './SignIn.css';
import { login,signup} from '../../firebase'


const SignIn = () => {
    const [signState, setSignState] = useState("Sign In")
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const userAuth = async (event) => {
      event.preventDefault();
      if (signState === "Sign In") {
        
            await login(email,password);
            
      }
          else {
            await signup(name,email,password);
          }
    }
    return (
      <div className='signin'>
          <div className="signin-form">
              <h1>{ signState }</h1>
              <form>
                  { signState==="Sign Up" ? <input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" placeholder='Name' />:<></>}
                  <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email' />
                  <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  placeholder='Password' />
                  <button onClick={userAuth} >{ signState }</button>
              </form>
              <div className="form-switch">
                  { signState==="Sign In"?
                    <p>Don't have account <span onClick={()=> {setSignState("Sign Up")}}>Sign Up</span></p>:
                    <p>Already have account <span onClick={()=> {setSignState("Sign In")}}>Sign In</span></p>}
              </div>
          </div>
      </div>
    )
}

export default SignIn