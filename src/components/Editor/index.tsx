'use client'

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break';
import Paragraph from '@tiptap/extension-paragraph';
import Document from '@tiptap/extension-document';
import StarterKit from '@tiptap/starter-kit';
import Text from '@tiptap/extension-text';

import './editor.scss';

export default function Editor({ set } : { set: (i: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            HardBreak.extend({
                addKeyboardShortcuts () {
                  return {
                    Enter: () => this.editor.commands.setHardBreak()
                  }
                }
            }),
            Placeholder.configure({
                placeholder: () => {
                    return (
                        `The question of whether the Earth is flat has been a topic of debate for centuries...`
                    )
                },
            }),
            Paragraph,
            Document,
            Text
        ],
        content: ``
    });

    useEffect(() => {
        set(editor?.getHTML() || "");

        editor?.on('update', data => {
            set(data.editor.getHTML());
        });
    }, [editor])

    return (
        <EditorContent editor={editor} />
    )
}