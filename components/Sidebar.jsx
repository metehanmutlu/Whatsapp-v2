import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc, query, where } from "firebase/firestore";
import Chat from './Chat';


function Sidebar() {
    const [user] = useAuthState(auth)
    const userChatRef = query(collection(db, 'chats'), where('users', 'array-contains', user?.email));
    const [chatSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt('Please enter an email address for the user you want to chat with');

        if (!input) return null;
        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            async function setData() {
                await addDoc(collection(db, 'chats'), {
                    users: [user.email, input]
                });
            }
            setData();
        }
    }

    const chatAlreadyExists = (recipienEmail) => {
        if (chatSnapshot) {
            let isIncludes = false;
            for (let i = 0; i < chatSnapshot.docs.length; i++) {
                const chat = chatSnapshot.docs[i];
                const users = chat.data().users;
                if (users.includes(recipienEmail)) {
                    isIncludes = true
                    break
                }
            }
            return isIncludes
        }
    }

    return (
        <Container>
            <Header>
                <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon />
                <SearchInput placeholder='Search in chats' />
            </Search>
            <SidebarButton onClick={createChat}>
                Start a new chat
            </SidebarButton>
            {chatSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;