import { useState } from "react";
import { signInWithEmailAndPassword } from "../../auth";
import classes from "./Login.module.css";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password);
      // If sign-in is successful, the useEffect in _app.js will redirect to /dashboard
    } catch (error) {
      console.error("Sign-in failed", error);
      // Handle sign-in error (e.g., show error message to the user)
      alert("Please enter the right credentials");
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.logo}>
        <img src="/Eigtball-Logo.png" alt="logo" />
      </div>

      <div className={classes.content}>
        <h2>Welcome</h2>
        <p>Enter your email and password to sign in</p>

        <form className={classes.form}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <button onClick={handleSignUp}>Sign Up</button> */}
          <button onClick={handleSignIn}>Sign In</button>
          {/* <button onClick={handleSignOut}>Sign Out</button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
