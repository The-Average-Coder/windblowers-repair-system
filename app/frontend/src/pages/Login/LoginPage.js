import { useState } from 'react';

import axios from 'axios';

import saxWaterColor from '../../images/saxWaterColor.png';
import brandRed from '../../images/brandRed.png';
import brandWhite from '../../images/brandWhite.png';

import './LoginPage.css';

function LoginPage(props) {

    const [password, setPassword] = useState('');

    const attemptLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('/authenticate', { auth: { username: 'user', password: password } });
            if (res.data === 'user') {
                props.login();
            }
        } catch (e) {
            setPassword('');
        }
    }

    return (
        <div className='LoginPage'>

            <img className='design-element' src={saxWaterColor} />

            <form className='login-box' onSubmit={attemptLogin}>
                <img className='brand light' src={brandRed} />
                <p className='welcome-message'>Welcome Back</p>
                <input type='password' placeholder='Enter Password...' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>

        </div>
    )
}

export default LoginPage;