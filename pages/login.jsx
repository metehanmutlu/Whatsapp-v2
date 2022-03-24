import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { auth, provider } from '../firebase';
import { signInWithPopup } from "firebase/auth";


function Login() {
    const signIn = () => {
        signInWithPopup(auth, provider).catch(alert)
    }
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src='https://media.discordapp.net/attachments/852299725511327764/956685518882623558/580b57fcd9996e24bc43c543.png?width=701&height=701' />
                <Button onClick={signIn} variant='outlined'>Sign in with google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;