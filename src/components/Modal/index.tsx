'use client'

import './modal.scss';

export default function Modal({
    set,
    children
} : {
    set: (type: string, options: any) => void,
    children: React.ReactNode
}) {

    const close = (e: React.MouseEvent<HTMLDivElement> | undefined) => {
        if (!(e?.target as HTMLElement)?.closest("#modal .modal-content")) set("", {});
    }

    return (
        <div id="modal" onClick={close}>
            <div className="modal-content">
                {children}
            </div>
        </div>
    )
}