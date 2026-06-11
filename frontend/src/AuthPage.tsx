import { useState,} from 'react';
import './App.css';

function AuthPage({ onLogin }: { onLogin: (token: string) => void }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

  async function handleLogin(){
   
         //const response = await fetch('https://timestables-bwbqcvexgaf5fsdp.canadacentral-01.azurewebsites.net/api/Auth/login', {
    try{
    const response = await fetch(`${API_URL}/api/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    });
    if (!response.ok) {
        const errors = await response.json();
        const messages = errors.map((e: any) => e.description).join(', ');
        setError(messages);
        return;
    }
    const data = await response.json();
    localStorage.setItem("token", data.token);
    onLogin(data.token);
    }catch (error){
      setError("Something went worng. Please try again")
    }
  }

  async function handleRegister() {
    if (password !== passwordConfirmation) {
        setError("Passwords do not match");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/api/Auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, passwordConfirmation })
        });
        if (!response.ok) {
            setError("Registration failed. Email may already be in use.");
            return;
        }
        // Auto login after registration
        await handleLogin();
    } catch (error) {
        setError("Something went wrong. Please try again");
    }
}

return (
    <div>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div>
                <label>Email:
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
            </div>
            <div>
                <label>Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
            </div>
            {isRegistering && (
                <div>
                    <label>Confirm Password:
                        <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                    </label>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!isRegistering ? (
                
                <div className="button-group-login">
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={() => setIsRegistering(true)}>Register</button>
                </div>
            ) : (
                <div className="button-group-login">
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={() => setIsRegistering(false)}>Back to Login</button>
                </div>
            )}
        </form>
    </div>
);
}

export default AuthPage;