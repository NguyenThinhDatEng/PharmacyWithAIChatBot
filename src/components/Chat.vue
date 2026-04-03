<template>
  <!-- Floating Chat Icon -->
  <div class="chat-icon" @click="toggleChat" v-if="!isOpen" aria-label="Mở chat với Dược sĩ AI">
    <i class="fas fa-comment-medical"></i>
    <span class="chat-icon-pulse"></span>
  </div>

  <!-- Chat Dialog -->
  <div class="chat-dialog" v-if="isOpen">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-header-avatar">
          <i class="fas fa-user-md"></i>
        </div>
        <div>
          <span class="chat-title">Dược sĩ AI</span>
          <span class="chat-status-text">
            <span class="status-dot"></span> Sẵn sàng hỗ trợ
          </span>
        </div>
      </div>
      <button class="close-btn" @click="toggleChat" aria-label="Đóng chat">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="chat-body" ref="chatBody">
      <!-- Welcome message -->
      <div class="chat-welcome" v-if="chatLog.length === 0">
        <div class="welcome-icon">
          <i class="fas fa-stethoscope"></i>
        </div>
        <p>Xin chào! Tôi là Dược sĩ AI, sẵn sàng tư vấn sức khỏe cho bạn.</p>
        <div class="quick-actions">
          <button @click="quickSend('Tư vấn thuốc cảm cúm')">Thuốc cảm cúm</button>
          <button @click="quickSend('Vitamin cho trẻ em')">Vitamin trẻ em</button>
          <button @click="quickSend('Thuốc đau dạ dày')">Đau dạ dày</button>
        </div>
      </div>

      <div class="chat-messages">
        <div v-for="(msg, idx) in chatLog" :key="idx" :class="['chat-line', msg.role]">
          <div class="chat-item">
            <div class="chat-avatar" v-if="msg.role === 'assistant'">
              <i class="fas fa-user-md"></i>
            </div>
            <div class="chat-bubble">
              <div class="chat-text">{{ msg.text }}</div>
            </div>
            <div class="chat-avatar user-avatar" v-if="msg.role === 'user'">
              <i class="fas fa-user"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div class="typing-indicator" v-if="isSending">
        <div class="chat-item">
          <div class="chat-avatar">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="chat-bubble typing-bubble">
            <div class="sending-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <textarea
        v-model="userMessage"
        rows="1"
        placeholder="Nhập câu hỏi về sức khỏe..."
        @keydown.enter.prevent="sendChat"
        @input="autoResize"
        ref="textareaRef"
      ></textarea>
      <button @click="sendChat" :disabled="isSending || !userMessage.trim()" class="send-btn" aria-label="Gửi tin nhắn">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import axios from 'axios';

const base = 'http://localhost:3000/api';
const userMessage = ref('');
const chatLog = ref([]);
const isSending = ref(false);
const isOpen = ref(false);
const chatBody = ref(null);
const textareaRef = ref(null);

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    document.body.classList.add('chat-open');
    nextTick(() => textareaRef.value?.focus());
  } else {
    document.body.classList.remove('chat-open');
  }
}

function autoResize(e) {
  const el = e.target;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  });
}

function quickSend(text) {
  userMessage.value = text;
  sendChat();
}

async function sendChat() {
  const question = userMessage.value.trim();
  if (!question || isSending.value) return;

  chatLog.value.push({ role: 'user', text: question });
  userMessage.value = '';
  isSending.value = true;

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }

  scrollToBottom();

  try {
    const res = await axios.post(`${base}/chat/pharmacist`, { userId: 'user1', message: question });
    chatLog.value.push({ role: 'assistant', text: res.data.answer });
  } catch (error) {
    chatLog.value.push({ role: 'assistant', text: 'Không gửi được, vui lòng thử lại.' });
    console.error(error);
  } finally {
    isSending.value = false;
    scrollToBottom();
  }
}

watch(chatLog, scrollToBottom, { deep: true });
</script>

<style scoped>
/* Chat Icon */
.chat-icon {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(8, 145, 178, 0.4);
  z-index: 1000;
  transition: all 0.2s ease;
}

.chat-icon:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(8, 145, 178, 0.5);
}

.chat-icon i {
  color: white;
  font-size: 1.5rem;
}

.chat-icon-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid var(--primary);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.3); opacity: 0; }
}

/* Chat Dialog */
.chat-dialog {
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 380px;
  height: 540px;
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

/* Chat Header */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.chat-title {
  font-weight: 700;
  font-size: 1rem;
  display: block;
  font-family: var(--font-heading);
}

.chat-status-text {
  font-size: 0.75rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--secondary-light);
  display: inline-block;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: background 0.2s ease;
  padding: 0;
  min-height: unset;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: none;
  color: white;
}

/* Chat Body */
.chat-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: var(--bg-subtle);
}

/* Welcome */
.chat-welcome {
  text-align: center;
  padding: 24px 8px;
}

.welcome-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bg-muted), var(--bg-subtle));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.welcome-icon i {
  font-size: 1.5rem;
  color: var(--primary);
}

.chat-welcome p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.quick-actions button {
  padding: 6px 14px;
  font-size: 0.75rem;
  border: 1px solid var(--primary);
  background: var(--bg-white);
  color: var(--primary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-height: unset;
}

.quick-actions button:hover {
  background: var(--primary);
  color: white;
}

/* Messages */
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-line {
  display: flex;
  justify-content: flex-start;
}

.chat-line.user {
  justify-content: flex-end;
}

.chat-item {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 85%;
}

.chat-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
  background: var(--primary);
  color: white;
}

.user-avatar {
  background: var(--secondary);
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 16px 16px 16px 4px;
  background: var(--bg-white);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-light);
}

.chat-line.user .chat-bubble {
  background: var(--primary);
  color: white;
  border-radius: 16px 16px 4px 16px;
  border: none;
}

.chat-text {
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Typing Indicator */
.typing-indicator {
  padding-top: 8px;
}

.typing-bubble {
  padding: 12px 18px !important;
}

.sending-dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.sending-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: dot-bounce 1.4s infinite ease-in-out;
}

.sending-dots span:nth-child(2) { animation-delay: 0.2s; }
.sending-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-5px); opacity: 1; }
}

/* Chat Input */
.chat-input {
  display: flex;
  padding: 12px 16px;
  gap: 10px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-white);
  align-items: flex-end;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 10px 14px;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.4;
  max-height: 100px;
  min-height: 40px;
  font-family: var(--font-body);
  background: var(--bg-subtle);
  transition: border-color 0.2s ease;
}

.chat-input textarea:focus {
  border-color: var(--primary);
  outline: none;
  background: var(--bg-white);
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 0;
  min-height: unset;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
  color: white;
}

.send-btn:disabled {
  background: var(--border);
  cursor: not-allowed;
  color: var(--text-muted);
  border: none;
}

.send-btn i {
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 480px) {
  .chat-dialog {
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .chat-icon {
    bottom: 16px;
    right: 16px;
    width: 52px;
    height: 52px;
  }
}
</style>
