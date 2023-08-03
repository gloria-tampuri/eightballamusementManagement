import { useState } from "react";
import { signUpWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "../../auth";
import classes from './Login.module.css'
import { useRouter } from 'next/router'
import Image from "next/image";
import poolpic from '../../public/pexels-ketut-subiyanto-5055421.jpg'

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(email, password);
      // If sign-in is successful, the useEffect in _app.js will redirect to /dashboard
    } catch (error) {
      console.error("Sign-in failed", error);
      // Handle sign-in error (e.g., show error message to the user)
    }
  };

  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //     // Handle successful sign-out
  //   } catch (error) {
  //     // Handle sign-out error
  //   }
  // };

  return (
   <div className={classes.wrapper}>
    <div className={classes.login}>
      <div className={classes.words}>
        <h2>EightBall Amusement</h2>
        <h1>Welcome To The Land of Possibilities</h1>
        <Image className={classes.img} src={poolpic} alt='playing pool'  />
        <p className={classes.made}>Made By: tani-tampuri technologies</p>
      </div>
    <div className={classes.formContainer}>
      <h2>SIGN IN</h2>
    <form className={classes.form}>
      <label htmlFor="email">Email</label>
     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
     <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {/* <button onClick={handleSignUp}>Sign Up</button> */}
      <button onClick={handleSignIn}>Sign In</button>
      {/* <button onClick={handleSignOut}>Sign Out</button> */}
     </form>
    </div>
    </div>
   </div>
  );
};

export default Login;
