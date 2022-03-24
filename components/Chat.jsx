import styled from 'styled-components';
import { Avatar } from '@mui/material';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, query, where } from "firebase/firestore";
import { useRouter } from 'next/router';


function Chat({ id, users }) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(
        query(collection(db, 'users'), where('username', '==', getRecipientEmail(users, user)))
    )

    const enterChat = () => {
        if (router.query.id !== id) {
            router.push(`/chat/${id}`)
        }
    }
    // recipientSnapshot?.docs.forEach((a) => {
    //     console.log(a);
    // });
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user)

    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ) : (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb
    }
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
    margin: 5px;
    margin-right: 15px
`;