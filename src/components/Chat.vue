<template>
  <!-- Floating Chat Icon -->
  <div class="chat-icon" @click="toggleChat" v-if="!isOpen">
    <i class="fas fa-comments"></i>
  </div>

  <!-- Chat Dialog -->
  <div class="chat-dialog" v-if="isOpen">
    <div class="chat-header">
      <span class="chat-title">AI Chatbot</span>
      <button class="close-btn" @click="toggleChat">&times;</button>
    </div>
    <div class="chat-body">
      <div class="chat-messages">
        <div v-for="(msg, idx) in chatLog" :key="idx" :class="['chat-line', msg.role]">
          <div class="chat-item">
            <div class="chat-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
            <div class="chat-bubble">
              <div class="chat-name">{{ msg.role === 'user' ? 'Bạn' : 'Dược sĩ AI' }}</div>
              <div class="chat-text">{{ msg.text }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-sending" v-if="isSending">
        <div class="chat-line assistant">
          <div class="chat-item">
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">
              <div class="chat-name">Dược sĩ AI</div>
              <div class="sending-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <textarea v-model="userMessage" rows="2" placeholder="Nhập câu hỏi" @keydown.enter.prevent="sendChat"></textarea>
      <button @click="sendChat" :disabled="isSending">Gửi</button>
    </div>
    <div class="chat-sending" v-if="isSending">
      <div class="chat-line assistant">
        <div class="chat-item">
          <div class="chat-avatar">🤖</div>
          <div class="chat-bubble">
            <div class="chat-name">Dược sĩ AI</div>
            <div class="sending-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const base = 'http://localhost:3000/api';
const userMessage = ref('');
const chatLog = ref([]);
const isSending = ref(false);
const chatStatus = ref('');
const isOpen = ref(false);

function toggleChat() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    document.body.classList.add('chat-open');
  } else {
    document.body.classList.remove('chat-open');
  }
}

async function sendChat() {
  if (!userMessage.value) return;

  const question = userMessage.value.trim();
  if (!question || isSending.value) return;

  chatLog.value.push({ role: 'user', text: question });
  userMessage.value = '';
  isSending.value = true;

  try {
    const res = await axios.post(`${base}/chat/pharmacist`, { userId: 'user1', message: question });
    chatLog.value.push({ role: 'assistant', text: res.data.answer });
  } catch (error) {
    chatLog.value.push({ role: 'assistant', text: 'Không gửi được, vui lòng thử lại.' });
    console.error(error);
  } finally {
    isSending.value = false;
  }
}
</script>

<style scoped>
.chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: var(--primary-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.chat-icon i {
  color: white;
  font-size: 24px;
}

.chat-dialog {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: var(--primary-green);
  color: white;
  border-radius: 10px 10px 0 0;
}

.chat-title {
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-line {
  display: flex;
  justify-content: flex-start;
  padding: 0;
  border-radius: 8px;
  max-width: 100%;
}

.chat-line.user {
  justify-content: flex-end;
}

.chat-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 100%;
}

.chat-avatar {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;
  background-color: #ebf5fb;
}

.chat-bubble {
  background-color: #f1f1f1;
  border-radius: 10px;
  padding: 8px 10px;
  max-width: 80%;
}

.chat-line.user .chat-bubble {
  background-color: var(--primary-green);
  color: white;
}

.chat-name {
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 3px;
  opacity: 0.8;
}

.chat-text {
  font-size: 0.9rem;
  line-height: 1.3;
}

.chat-line.assistant {
  align-self: flex-start;
  background-color: #f1f1f1;
  color: black;
}

.chat-input {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
  resize: none;
}

.chat-input button {
  background-color: var(--primary-green);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.chat-status {
  margin: 0;
  padding: 0 10px 10px;
  font-size: 12px;
  color: #666;
  display: none;
}

.chat-sending {
  padding: 0 10px 10px;
}

.sending-dots {
  display: inline-flex;
  gap: 4px;
}

.sending-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #333;
  animation: dot-bounce 1s infinite ease-in-out;
}

.sending-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.sending-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}
</style>