import { Circle } from 'better-react-spinkit'
import Image from 'next/image'
import WpImage from '../public/wp-icon.png'


function Loading() {
    return (
        <center onDragStart={(e) => e.preventDefault()} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <div>
                <Image
                    src={WpImage}
                    alt=''
                    height={200}
                    width={200}
                />
                <br />
                <br />
                <Circle color='#3cb328' size={60} />
            </div>
        </center >
    )
}

export default Loading