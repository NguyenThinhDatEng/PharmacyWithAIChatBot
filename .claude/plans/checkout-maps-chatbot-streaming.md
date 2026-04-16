# Kế hoạch thi công: Checkout Form + Maps + ChatBot Streaming

## Context

Cập nhật 3 nhóm tính năng độc lập nhau:
- **Checkout form** có layout 1 cột dài, thiếu dấu `*` bắt buộc, và width bị lệch khi chọn chuyển khoản
- **Trang liên hệ** chỉ có thông tin text, cần nhúng bản đồ Google Maps
- **ChatBot** icon trông generic, và phải chờ toàn bộ response mới hiển thị — cần streaming SSE

---

## I. Checkout Form (`src/components/Cart.vue`)

### I.1 — Fix width lệch khi chọn bank_transfer

**Vấn đề:** `.bank-details` không có `width` cố định, khi expand nội dung bên trong có thể đẩy rộng parent `.option-group`.

**Sửa CSS** (dòng ~691–706):
```css
.bank-details {
  margin-left: 26px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 0.875rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.3s ease;
  padding: 0 12px;
  box-sizing: border-box;
  width: calc(100% - 26px);   /* khóa width, không đẩy parent */
}
.bank-details-active {
  padding: 12px;
  max-height: 150px;
}
```

### I.2 — Layout 2 cột, giảm scroll

**Sửa CSS** `.field-group` (dòng ~603):
```css
.field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-field--full {
  grid-column: 1 / -1;   /* Ghi chú span full width */
}
.payment-delivery-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}
@media (max-width: 768px) {
  .field-group { grid-template-columns: 1fr; }
  .payment-delivery-row { grid-template-columns: 1fr; }
}
```

**Sửa template** (dòng 78–128):
- Thêm class `form-field--full` vào label "Ghi chú" (dòng 95)
- Bọc `.payment-options` và `.delivery-options` trong `<div class="payment-delivery-row">`

### I.3 — Dấu `*` đỏ trường bắt buộc

**Thêm CSS:**
```css
.required { color: #e53e3e; font-weight: 700; margin-left: 2px; }
```

**Sửa template** — thêm `<span class="required">*</span>` vào:
- Dòng 80: `<span>Họ và tên</span>`
- Dòng 84: `<span>Số điện thoại</span>`
- Dòng 92: `<span>Địa chỉ</span>`
- Dòng 102: `<h4>Phương thức thanh toán</h4>`

---

## II. Trang Liên Hệ (`src/components/Contact.vue`)

**Chèn map section** sau dòng 37 (`</div>` đóng `.contact-grid`), trước dòng 38 (`</div>` đóng `.panel`):

```html
<div class="map-section">
  <h3 class="map-title"><i class="fas fa-map-marked-alt"></i> Bản đồ</h3>
  <div class="map-wrapper">
    <iframe
      src="https://maps.google.com/maps?q=21.1436006,105.9599429&z=18&output=embed"
      width="100%"
      height="350"
      style="border: 0;"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Vị trí nhà thuốc"
    ></iframe>
  </div>
</div>
```

**Thêm CSS:**
```css
.map-section { margin-top: 32px; }
.map-title { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 1.125rem; }
.map-title i { color: var(--primary); }
.map-wrapper { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
.map-wrapper iframe { display: block; }
```

---

## III. ChatBot AI

### III.1 — Đổi icon (`src/components/Chat.vue`)

Dòng 9: `fa-comment-medical` → `fa-robot`

### III.2 — Backend: SSE Streaming endpoint (`backend/src/index.js`)

Thêm 3 generator functions và 1 route **sau dòng 247** (sau `CallToAIModel`). Không đụng route `/api/chat/pharmacist` cũ.

**streamOpenRouter** — dùng `fetch` trực tiếp (tránh phụ thuộc SDK):
```js
async function* streamOpenRouter(message) {
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  for (const key of keys) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], stream: true }),
      });
      if (!res.ok) continue;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') return;
          try { const c = JSON.parse(payload).choices?.[0]?.delta?.content; if (c) yield c; } catch (_) {}
        }
      }
      return;
    } catch (err) { console.error('OR stream key lỗi:', err.message); }
  }
  throw new Error('OpenRouter stream thất bại');
}
```

**streamGemini:**
```js
async function* streamGemini(message) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `${SYSTEM_PROMPT} Người dùng hỏi: "${message}"`;
  const stream = await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: prompt });
  for await (const chunk of stream) { if (chunk.text) yield chunk.text; }
}
```

**streamGroq:**
```js
async function* streamGroq(message) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }],
    stream: true,
  });
  for await (const chunk of stream) {
    const c = chunk.choices[0]?.delta?.content; if (c) yield c;
  }
}
```

**Route mới POST /api/chat/stream:**
```js
app.post('/api/chat/stream', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (text) => res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
  const done = () => { res.write('data: [DONE]\n\n'); res.end(); };

  async function tryStream(genFn) {
    for await (const chunk of genFn(message)) send(chunk);
  }

  try {
    try { await tryStream(streamOpenRouter); return done(); }
    catch (err) { console.error('OR stream lỗi, sang Gemini:', err.message); }

    if (process.env.GEMINI_API_KEY) {
      try { await tryStream(streamGemini); return done(); }
      catch (err) { console.error('Gemini stream lỗi, sang Groq:', err.message); }
    }

    if (process.env.GROQ_API_KEY) {
      try { await tryStream(streamGroq); return done(); }
      catch (err) { console.error('Groq stream lỗi:', err.message); }
    }

    send('Xin lỗi, hiện tại tôi không trả lời được.'); done();
  } catch (err) {
    if (!res.writableEnded) { send('Xin lỗi, có lỗi xảy ra.'); done(); }
  }
});
```

### III.3 — Frontend: Streaming với fetch (`src/components/Chat.vue`)

**Xóa** `import axios from 'axios'`. Thay `sendChat()`:

```js
async function sendChat() {
  const question = userMessage.value.trim();
  if (!question || isSending.value) return;

  chatLog.value.push({ role: 'user', text: question });
  userMessage.value = '';
  isSending.value = true;
  if (textareaRef.value) textareaRef.value.style.height = 'auto';

  const assistantEntry = reactive({ role: 'assistant', text: '', isStreaming: true });
  chatLog.value.push(assistantEntry);
  scrollToBottom();

  let rawText = '';
  try {
    const response = await fetch(`${base}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user1', message: question }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') {
          assistantEntry.text = marked.parse(rawText);
          assistantEntry.isStreaming = false;
          break;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.chunk) {
            rawText += parsed.chunk;
            assistantEntry.text = rawText;
            isSending.value = false;   // tắt typing dots sau chunk đầu
            scrollToBottom();
          }
        } catch (_) {}
      }
    }
    if (assistantEntry.isStreaming) {
      assistantEntry.text = marked.parse(rawText) || 'Không gửi được, vui lòng thử lại.';
      assistantEntry.isStreaming = false;
    }
  } catch (err) {
    assistantEntry.text = 'Không gửi được, vui lòng thử lại.';
    assistantEntry.isStreaming = false;
    console.error(err);
  } finally {
    isSending.value = false;
    scrollToBottom();
  }
}
```

**Lưu ý:** Import thêm `reactive` từ vue nếu chưa có trong destructure.

---

## Thứ tự thực hiện (thấp → cao rủi ro)

1. Contact.vue — Google Maps embed
2. Cart.vue — Dấu `*` đỏ
3. Cart.vue — Layout 2 cột + fix bank-details width
4. Chat.vue — Đổi icon
5. backend/src/index.js — Thêm SSE streaming route
6. Chat.vue — Streaming frontend

---

## Kiểm tra

- **Checkout:** Desktop 2 cột / mobile 1 cột; chọn chuyển khoản → không lệch layout; dấu `*` hiển thị đúng
- **Contact:** `/contact` → bản đồ hiện đúng địa chỉ Bắc Ninh
- **Icon:** Chat button hiển thị robot icon
- **Streaming:** Gửi tin nhắn → text xuất hiện dần; typing dots tắt sau chunk đầu; markdown render đúng sau [DONE]

## Files cần sửa

- [src/components/Cart.vue](src/components/Cart.vue)
- [src/components/Contact.vue](src/components/Contact.vue)
- [src/components/Chat.vue](src/components/Chat.vue)
- [backend/src/index.js](backend/src/index.js)
