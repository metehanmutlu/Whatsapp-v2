import { Circle } from 'better-react-spinkit'

function Loading() {
    return (
        <center onDragStart={(e) => e.preventDefault()} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div>
                <img
                    src="https://media.discordapp.net/attachments/852299725511327764/956685518882623558/580b57fcd9996e24bc43c543.png?width=701&height=701"
                    alt=""
                    style={{ marginBottom: 10 }}
                    height={200}
                />
                <Circle color='#3cb328' size={60} />
            </div>
        </center >
    )
}

export default Loading