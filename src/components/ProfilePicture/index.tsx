import { stringToColor } from '@/lib/helpers';

export default function ProfilePicture({ address } : { address: string }) {
    return (
        <div
            className="pfp"
            style={{
                background: `linear-gradient(45deg, ${stringToColor(address)}, #2b0107)`
            }}
        ></div>
    )
}