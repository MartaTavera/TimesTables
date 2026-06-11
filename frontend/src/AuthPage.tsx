import { useState,} from 'react';
import './App.css';

function AuthPage({ onLogin }: { onLogin: (token: string) => void }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [regstered, setRegistered] = useState<boolean>(false);


  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    //const response = await fetch('https://timestables-bwbqcvexgaf5fsdp.canadacentral-01.azurewebsites.net/api/Auth/login', {
    const response = await fetch(`${API_URL}/api/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    onLogin(data.token);
    }

return (
    <div>
        <form onSubmit={handleSubmit}>
      <label>Enter your email:
        <input 
        type="text" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}/>
      </label>
      <br/>
      <label>Enter your password:
        <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}/>
      </label><br/>

      <button type="submit">Login</button>
    </form>




    </div>
)
}
export default AuthPage