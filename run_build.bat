@echo off
set PATH=C:\Program Files\nodejs;%SystemRoot%\system32;%SystemRoot%
cd /d C:\Users\Administrator\.gemini\antigravity\scratch\tuition-app
node node_modules\vite\bin\vite.js build
