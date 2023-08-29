import { h } from "vue";
import Markdown from "../components/Markdown.vue";

import { html as start } from "../markdown/start.md";
import { html as dev } from "../markdown/dev.md";
import { html as apiEffect } from "../markdown/webgl.md";

const md = (string: any) => h(Markdown, { content: string, key: string });

export const docMenus = {
    文档: [
    { 
        name: '快速接入',
        path: 'start', 
        component: md(start), 
    },
    { 
        name: '参与贡献',
        path: 'dev', 
        component: md(dev), 
    }],
    API: [{ 
        name: '@onnx-infer/webgl',
        path: 'webgl', 
        component: md(apiEffect),
    }],
};