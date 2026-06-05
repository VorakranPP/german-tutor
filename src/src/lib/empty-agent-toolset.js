// Stub สำหรับ build เบราว์เซอร์
// @anthropic-ai/sdk เรียก tools/agent-toolset/node.mjs ผ่าน dynamic import ใน
// lib/environments/worker.mjs (Node/Cloudflare Worker) — โมดูลนี้ใช้ node:crypto,
// node:fs, node:child_process ที่ bundle ในเบราว์เซอร์ไม่ได้ และโค้ดฝั่ง browser
// ของเราไม่เคยเรียกใช้ จึง alias ให้ชี้มาที่ stub ว่างนี้แทน (ดู vite.config.js)
export const betaAgentToolset20260401 = undefined
export default {}
