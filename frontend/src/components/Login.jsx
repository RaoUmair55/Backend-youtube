import React,{useState} from 'react'
import './login.css'

const Login = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = {
            email: e.target.email.value,
            password: e.target.password.value,
          };
          const apiUrl = `${import.meta.env.VITE_API_URL}/login`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log(data.token);
        console.log(data);
    
        if (response.ok) {
            alert('Login successful!');
            setLoading(false);
        } else {
            const error = await response.json();
            alert('Login failed: ' + error.message);
        }
        } catch (err) {
        console.error(err);
        setLoading(false);
        alert('Something went wrong.');
        }
    };


  return (
    <>  
         <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login