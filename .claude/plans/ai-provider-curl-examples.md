# AI Provider Curl Examples

This document collects direct `curl` examples for testing the AI providers used by `backend/src/index.js`, without going through the local backend routes.

## Shared values

Use these Postman environment variables or replace them inline:

- `{{OPENROUTER_KEY}}`
- `{{MODEL}}`
- `{{GEMINI_API_KEY}}`
- `{{GROQ_API_KEY}}`
- `{{XAI_API_KEY}}`
- `{{XAI_MODEL}}` with default `grok-4.3`
- `{{USER_MESSAGE}}` such as `Toi dang bi sot nhe va dau hong, nen uu tien thuoc gi?`

System prompt used by the backend:

```text
Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can.
```

Backend prompt template:

```text
<SYSTEM_PROMPT> Nguoi dung hoi: "<USER_MESSAGE>"
```

Suggested combined prompt for providers that accept a single text input:

```text
Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can. Nguoi dung hoi: "{{USER_MESSAGE}}"
```

## OpenRouter

URL:

```text
POST https://openrouter.ai/api/v1/chat/completions
```

Required headers:

```text
Authorization: Bearer {{OPENROUTER_KEY}}
Content-Type: application/json
```

Non-stream:

```bash
curl https://openrouter.ai/api/v1/chat/completions ^
  -H "Authorization: Bearer {{OPENROUTER_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"{{MODEL}}\",\"messages\":[{\"role\":\"user\",\"content\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can. Nguoi dung hoi: \\\"{{USER_MESSAGE}}\\\"\"}],\"stream\":false}"
```

Stream:

```bash
curl -N https://openrouter.ai/api/v1/chat/completions ^
  -H "Authorization: Bearer {{OPENROUTER_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"{{MODEL}}\",\"messages\":[{\"role\":\"user\",\"content\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can. Nguoi dung hoi: \\\"{{USER_MESSAGE}}\\\"\"}],\"stream\":true}"
```

Success signal:

- Non-stream returns JSON with `choices[0].message.content`
- Stream returns SSE lines beginning with `data: ` and ends with `data: [DONE]`

Auth error check:

```bash
curl https://openrouter.ai/api/v1/chat/completions ^
  -H "Authorization: Bearer INVALID_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"{{MODEL}}\",\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"stream\":false}"
```

## Gemini

The backend currently uses:

- Non-stream model: `gemini-2.5-flash-lite`
- Stream model: `gemini-2.5-flash`

Gemini accepts a single `contents` payload in the current backend logic, so the system prompt and user text are combined into one string.

Non-stream URL:

```text
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={{GEMINI_API_KEY}}
```

Non-stream:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={{GEMINI_API_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"contents\":[{\"parts\":[{\"text\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can. Nguoi dung hoi: \\\"{{USER_MESSAGE}}\\\"\"}]}]}"
```

Stream URL:

```text
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key={{GEMINI_API_KEY}}
```

Stream:

```bash
curl -N "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key={{GEMINI_API_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"contents\":[{\"parts\":[{\"text\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can. Nguoi dung hoi: \\\"{{USER_MESSAGE}}\\\"\"}]}]}"
```

Success signal:

- Non-stream usually returns JSON with text under `candidates[0].content.parts[0].text`
- Stream returns SSE chunks; each event contains incremental JSON data

Auth error check:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=INVALID_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"contents\":[{\"parts\":[{\"text\":\"test\"}]}]}"
```

## Groq

URL:

```text
POST https://api.groq.com/openai/v1/chat/completions
```

Required headers:

```text
Authorization: Bearer {{GROQ_API_KEY}}
Content-Type: application/json
```

Model used by the backend:

```text
llama-3.3-70b-versatile
```

Non-stream:

```bash
curl https://api.groq.com/openai/v1/chat/completions ^
  -H "Authorization: Bearer {{GROQ_API_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"llama-3.3-70b-versatile\",\"messages\":[{\"role\":\"system\",\"content\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can.\"},{\"role\":\"user\",\"content\":\"{{USER_MESSAGE}}\"}],\"stream\":false}"
```

Stream:

```bash
curl -N https://api.groq.com/openai/v1/chat/completions ^
  -H "Authorization: Bearer {{GROQ_API_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"llama-3.3-70b-versatile\",\"messages\":[{\"role\":\"system\",\"content\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can.\"},{\"role\":\"user\",\"content\":\"{{USER_MESSAGE}}\"}],\"stream\":true}"
```

Success signal:

- Non-stream returns JSON with `choices[0].message.content`
- Stream returns SSE lines with `choices[0].delta.content`

Auth error check:

```bash
curl https://api.groq.com/openai/v1/chat/completions ^
  -H "Authorization: Bearer INVALID_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"llama-3.3-70b-versatile\",\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"stream\":false}"
```

## xAI

URL:

```text
POST https://api.x.ai/v1/chat/completions
```

Required headers:

```text
Authorization: Bearer {{XAI_API_KEY}}
Content-Type: application/json
```

Model:

```text
{{XAI_MODEL}}
```

Default if you mirror backend fallback:

```text
grok-4.3
```

Non-stream:

```bash
curl https://api.x.ai/v1/chat/completions ^
  -H "Authorization: Bearer {{XAI_API_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"{{XAI_MODEL}}\",\"messages\":[{\"role\":\"system\",\"content\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can.\"},{\"role\":\"user\",\"content\":\"{{USER_MESSAGE}}\"}],\"stream\":false}"
```

Stream:

```bash
curl -N https://api.x.ai/v1/chat/completions ^
  -H "Authorization: Bearer {{XAI_API_KEY}}" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"{{XAI_MODEL}}\",\"messages\":[{\"role\":\"system\",\"content\":\"Ban la duoc si chuyen nghiep. Tra loi ngan gon, lich su, an toan, khuyen nghi kham chuyen gia neu can.\"},{\"role\":\"user\",\"content\":\"{{USER_MESSAGE}}\"}],\"stream\":true}"
```

Success signal:

- Non-stream returns JSON with `choices[0].message.content`
- Stream returns SSE lines with `choices[0].delta.content`

Auth error check:

```bash
curl https://api.x.ai/v1/chat/completions ^
  -H "Authorization: Bearer INVALID_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"{{XAI_MODEL}}\",\"messages\":[{\"role\":\"user\",\"content\":\"test\"}],\"stream\":false}"
```

## Quick Postman notes

- For non-stream requests, create a normal `POST` request and paste the JSON body exactly as shown.
- For stream requests, Postman may show chunked or SSE output depending on version; if it is awkward to inspect, use terminal `curl -N` for the first verification.
- If you use Postman variables, keep them in an Environment so you can switch keys without editing request bodies.
- If `{{MODEL}}` is empty, OpenRouter requests will fail even if the API key is valid.

## Suggested smoke test message

```text
Toi dang bi sot nhe va dau hong, nen uu tien thuoc gi? Khi nao can di kham?
```
