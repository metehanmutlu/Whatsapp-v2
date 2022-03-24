import styled from 'styled-components';
import Head from 'next/head'
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { doc, getDoc, query, orderBy, getDocs, collection, Timestamp } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';


function Chat({ chat, messages }) {
    const [user] = useAuthState(auth);
    // console.log(chat);
    // console.log(JSON.parse(messages));
    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} InitialMessages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context) {
    const chatRef = doc(db, 'chats', context.query.id);
    const chatSnap = await getDoc(chatRef)

    const messagesRef = collection(db, 'chats', context.query.id, 'messages')
    const messagesSnap = await getDocs(messagesRef)

    const messages = await Promise.all(messagesSnap.docs
        .map(async (message) => {
            const user = await getDoc(message.data().user)
            // console.log(user.data());
            return {
                id: message.id,
                ...message.data(),
                user: {
                    ...user.data(),
                    id: user.id
                }
            }
        }))
    // console.log(messages);

    const chat = {
        id: chatSnap.id,
        ...chatSnap.data()
    }
    // console.log(chat);

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;