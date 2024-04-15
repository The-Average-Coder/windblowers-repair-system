import { useState } from 'react';
import brand from '../../images/brand-red.png';
import bcrypt from 'bcryptjs';
import axios from 'axios';

function Login(props) {
    const [password, setPassword] = useState('');

    const attemptLogin = async (e) => {
        e.preventDefault();
        const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u');
        try {
          const res = await axios.get('/authenticate', { auth: { username: 'user', password: hashedPassword } });
          if (res.data === 'user') {
            props.login();
          }
        } catch (e) {
          setPassword('');
        }
    }

    return (
        <div className='login' >
            <div className='login-box'>
                <div>
                    <img className='brand' src={brand} alt='brand' />

                    <form onSubmit={attemptLogin}>
                        <input className='password-input' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input className='login-button' type='submit' value='LOGIN' />
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default Login;