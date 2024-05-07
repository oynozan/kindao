'use client'

import { useEffect, useState } from "react"
import toast from "react-hot-toast";

import { useModalStore, useProfileStore, useTronStore } from "@/lib/states";
import Button from "../Button";

export default function CreateProfile({
    set
} : {
    set: (i: { username: string, avatarUrl: string | null } | null) => void
}) {

    const kinDao = useTronStore(state => state.kinDao);
    const setModal: (type: string, options: any) => void = useModalStore(state => state.setModal);

    const [avatar, setAvatar] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    function save() {
        (async() => {
            if (username && kinDao.createProfile) {
                try {
                    await kinDao?.createProfile(username, avatar);
                    toast.success("Profile is successfully created.");
                    set({ username, avatarUrl: avatar });
                    setModal("", {});
                } catch(e: any) {
                    console.log(e);
                }
            }
        })()
    }

    return (
        <div id="create-profile">
            <label htmlFor="username">Username</label>
            <input
                onChange={e => setUsername(e.target.value)}
                id="username"
                placeholder="trondao"
            />

            <label htmlFor="avatar">Avatar URL (Optional)</label>
            <input
                onChange={e => setAvatar(e.target.value)}
                id="avatar"
                type="url"
                placeholder="https://global.discourse-cdn.com/business4/uploads/trondao/optimized/1X/75fc8e7f0d5c6c608603cbe593f7531a888df7c5_2_32x32.png"
            />

            <Button type="main" click={save}>Save</Button>
        </div>
    )
}