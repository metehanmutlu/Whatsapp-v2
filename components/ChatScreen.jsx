import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router'
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, doc, getDoc, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import Message from './Message';
import { InsertEmoticonOutlined } from '@mui/icons-material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { useEffect, useRef, useState } from 'react';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import moment from 'moment';


function ChatScreen({ chat, InitialMessages }) {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input, setInput] = useState('');
    const [messagesSnapShot] = useCollection(
        query(collection(db, 'chats', router.query.id, 'messages'), orderBy('createdAt', 'asc'))
    )
    const [recipientSnapshot] = useCollection(
        query(collection(db, 'users'), where('username', '==', getRecipientEmail(chat.users, user)))
    )
    const [messages, setMessages] = useState([]);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        setMessages([...JSON.parse(InitialMessages)]);
    }, [router.query.id])

    useEffect(() => {
        if (messagesSnapShot) {
            messagesSnapShot.docs.forEach(async (message) => {
                const user = await getDoc(message.data().user)
                // console.log(user.data());
                let existsMessages = messages.filter(msg => msg.id === message.id);
                if (existsMessages.length === 0) {
                    const msgData = {
                        id: message.id,
                        ...message.data(),
                        // createdAt: serverTimestamp(),
                        user: {
                            ...user.data(),
                            id: user.id
                        }
                    }
                    setMessages(prevData => [...prevData, msgData])
                    ScrollToBottom();
                }
            });
        }
    }, [messagesSnapShot])


    const ScrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        const newInput = input;
        setInput('');
        await setDoc(doc(db, 'users', user.uid), {
            lastSeen: { seconds: moment().unix() },
            username: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        })
        const userRef = doc(db, 'users', user.uid)
        const msgData = {
            createdAt: { seconds: moment().unix() },
            content: newInput,
            user: userRef
        }
        const docRef = await addDoc(collection(db, 'chats', router.query.id, 'messages'), msgData)
        ScrollToBottom()
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user)

    const sortMessages = (messages) => {
        return messages.sort((a, b) => (a.createdAt.seconds - b.createdAt.seconds))
    }
    sortMessages(messages)

    const uniqueMessages = () => {
        const unique = messages.filter((set => f => !set.has(f.id) && set.add(f.id))(new Set))
        // console.log(unique);
        return unique
    }

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <IconButton>
                            <Avatar src={recipient?.photoURL} />
                        </IconButton>
                    ) : (
                        <IconButton>
                            <Avatar>{recipientEmail[0]}</Avatar>
                        </IconButton>
                    )
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last Active: {`  `}
                            {recipient?.lastSeen ? (
                                <TimeAgo datetime={recipient?.lastSeen.seconds * 1000} />
                            ) : 'Unavailable'}
                        </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {
                    uniqueMessages().map((message) => (
                        <Message
                            key={message.id}
                            user={message.user}
                            message={{
                                ...message,
                                createdAt: message.createdAt
                            }}
                        />
                    ))
                }

                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>
            <InputContainer>
                <IconButton>
                    <InsertEmoticonOutlined />
                </IconButton>
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
                <IconButton>
                    <KeyboardVoiceIcon />
                </IconButton>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    >h3{
        margin-bottom: 3px;
    }

    >p{
        font-size: 14px;
        color: gray
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 29px;
    margin-left: 15px;
    margin-right: 15px;
    font-size: 18px;
`;