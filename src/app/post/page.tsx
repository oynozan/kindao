'use client'

import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";

import { useContentStore } from '@/lib/states';
import Editor from '@/components/Editor';
import Button from "@/components/Button";
import Post from "@/actions/post";

import './add.scss';

export default function PublishFactRequest() {

    const content = useContentStore(state => state.content);
    const setContent = useContentStore(state => state.setContent);

    const [title, setTitle] = useState<string>("");
    const [bounty, setBounty] = useState<number>(100);

    return (
        <div id="publish-request">

            <label htmlFor="title">Title</label>
            <input id="title" onChange={e => setTitle(e.target.value)} />

            <label>Describe your Question</label>
            <Editor set={setContent} />

            <div className="bottom">
                <div>
                    <label htmlFor="bounty">Bounty</label>
                    <input id="bounty" type="number" onChange={e => setBounty(parseFloat(e.target.value))} />
                </div>

                <Button
                    type="main"
                    click={() => Post(title, content, bounty)}
                >
                    Publish Fact Request
                </Button>
            </div>

            <h5 className="preview-title">Preview: </h5>

            <h1>{title}</h1>
            <div
                className="preview"
                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content)}}
            ></div>
        </div>
    )
}