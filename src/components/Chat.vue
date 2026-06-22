<template>
  <!-- Floating Chat Icon -->
  <div
    class="chat-icon"
    @click="toggleChat"
    v-if="!chatOpen"
    aria-label="Mở chat với Dược sĩ AI"
  >
    <i class="fas fa-robot"></i>
    <span class="chat-icon-pulse"></span>
  </div>

  <!-- Chat Dialog -->
  <div class="chat-dialog" v-if="chatOpen">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-header-avatar">
          <i class="fas fa-user-md"></i>
        </div>
        <div class="chat-header-copy">
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
          <button @click="quickSend('Tư vấn thuốc cảm cúm')">
            Thuốc cảm cúm
          </button>
          <button @click="quickSend('Vitamin cho trẻ em')">
            Vitamin trẻ em
          </button>
          <button @click="quickSend('Thuốc đau dạ dày')">Đau dạ dày</button>
        </div>
      </div>

      <div class="chat-messages">
        <div
          v-for="(msg, idx) in chatLog"
          :key="idx"
          :class="['chat-line', msg.role]"
        >
          <div class="chat-item">
            <div class="chat-avatar" v-if="msg.role === 'assistant'">
              <i class="fas fa-user-md"></i>
            </div>
            <div class="chat-bubble">
              <div class="chat-text" v-html="msg.text"></div>
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
      <div class="chat-input-shell" ref="inputAreaRef">
        <div class="provider-row">
          <button
            type="button"
            class="provider-chip"
            @click="toggleProviderDropdown"
            :aria-expanded="providerDropdownOpen"
            aria-haspopup="listbox"
          >
            <span>{{ selectedProviderDisplay }}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <span class="chat-provider-status" v-if="providerStatusText">
            {{ providerStatusText }}
          </span>

          <div
            class="provider-dropdown"
            v-if="providerDropdownOpen"
            role="listbox"
          >
            <button
              v-for="provider in decoratedProviders"
              :key="provider.id"
              type="button"
              :class="[
                'provider-option',
                { selected: provider.id === selectedProvider, disabled: !provider.available },
              ]"
              :disabled="!provider.available"
              role="option"
              :aria-selected="provider.id === selectedProvider"
              @click="chooseProvider(provider.id)"
            >
              <span class="provider-option-icon">{{ provider.icon }}</span>
              <span class="provider-option-copy">
                <span class="provider-option-name">{{ provider.label }}</span>
                <span class="provider-option-desc">
                  {{ provider.available ? provider.description : "Chua cau hinh" }}
                </span>
              </span>
              <i
                v-if="provider.id === selectedProvider"
                class="fas fa-check provider-option-check"
              ></i>
            </button>
          </div>
        </div>
        <div class="message-row">
      <textarea
        v-model="userMessage"
        rows="1"
        placeholder="Nhập câu hỏi về sức khỏe..."
        @keydown.enter.prevent="sendChat"
        @input="autoResize"
        ref="textareaRef"
      ></textarea>
      <button
        @click="sendChat"
        :disabled="isSending || !userMessage.trim()"
        class="send-btn"
        aria-label="Gửi tin nhắn"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { marked } from "marked";
import { chatOpen } from "../composables/useChat.js";

const base = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const userMessage = ref("");
const chatLog = ref([]);
const isSending = ref(false);
const chatBody = ref(null);
const textareaRef = ref(null);
const inputAreaRef = ref(null);
const providerDropdownOpen = ref(false);
const PROVIDER_STORAGE_KEY = "chat.selectedProvider";
const providerUiMeta = {
  gemini: { icon: "✨", label: "Gemini", description: "Google AI" },
  xai: { icon: "🚀", label: "xAI", description: "Reasoning & Analysis" },
  groq: { icon: "⚡", label: "Groq", description: "Ultra Fast Responses" },
  openrouter: { icon: "🌐", label: "OpenRouter", description: "Access Multiple Models" },
};
const fallbackProviders = [
  { id: "gemini", label: "Gemini", available: true, isDefault: true },
  { id: "xai", label: "xAI", available: true, isDefault: false },
  { id: "groq", label: "Groq", available: true, isDefault: false },
  { id: "openrouter", label: "OpenRouter", available: true, isDefault: false },
];
const providers = ref([...fallbackProviders]);
const selectedProvider = ref(localStorage.getItem(PROVIDER_STORAGE_KEY) || "gemini");
const providerStatusText = ref("");

const decoratedProviders = computed(() =>
  providers.value.map(provider => ({
    ...provider,
    icon: providerUiMeta[provider.id]?.icon || "✨",
    label: providerUiMeta[provider.id]?.label || provider.label,
    description: providerUiMeta[provider.id]?.description || "AI Provider",
  }))
);

const selectedProviderDisplay = computed(() => {
  const provider = decoratedProviders.value.find(item => item.id === selectedProvider.value);
  return provider ? `${provider.icon} ${provider.label}` : "✨ Gemini";
});

function getProviderLabel(providerId) {
  return providers.value.find(provider => provider.id === providerId)?.label || providerId || "AI";
}

function selectAvailableProvider(preferredProvider) {
  const availableProviders = providers.value.filter(provider => provider.available);
  const preferred = availableProviders.find(provider => provider.id === preferredProvider);
  const defaultProvider = availableProviders.find(provider => provider.isDefault);
  selectedProvider.value = (preferred || defaultProvider || availableProviders[0] || providers.value[0]).id;
  rememberSelectedProvider();
}

function rememberSelectedProvider() {
  localStorage.setItem(PROVIDER_STORAGE_KEY, selectedProvider.value);
  providerStatusText.value = "";
}

function toggleProviderDropdown() {
  providerDropdownOpen.value = !providerDropdownOpen.value;
}

function chooseProvider(providerId) {
  const provider = providers.value.find(item => item.id === providerId);
  if (!provider?.available) return;
  selectedProvider.value = providerId;
  rememberSelectedProvider();
  providerDropdownOpen.value = false;
}

function closeProviderDropdown() {
  providerDropdownOpen.value = false;
}

function handleOutsideClick(event) {
  if (!providerDropdownOpen.value) return;
  if (inputAreaRef.value?.contains(event.target)) return;
  closeProviderDropdown();
}

function handleEscape(event) {
  if (event.key === "Escape") {
    closeProviderDropdown();
  }
}

async function loadProviders() {
  try {
    const response = await fetch(`${base}/chat/providers`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data.providers) && data.providers.length > 0) {
      providers.value = data.providers;
    }
  } catch (error) {
    providers.value = [...fallbackProviders];
    console.error(error);
  } finally {
    selectAvailableProvider(selectedProvider.value);
  }
}

function updateProviderStatus(meta) {
  if (!meta.providerUsed) {
    providerStatusText.value = "Tat ca AI dang loi";
    return;
  }

  const requestedLabel = getProviderLabel(meta.requestedProvider);
  const usedLabel = getProviderLabel(meta.providerUsed);
  providerStatusText.value = meta.fallbackUsed
    ? `${requestedLabel} loi, da chuyen sang ${usedLabel}`
    : `Dang dung ${usedLabel}`;
}

function toggleChat() {
  chatOpen.value = !chatOpen.value;
  if (chatOpen.value) {
    document.body.classList.add("chat-open");
    loadProviders();
    nextTick(() => textareaRef.value?.focus());
  } else {
    document.body.classList.remove("chat-open");
    closeProviderDropdown();
  }
}

function autoResize(e) {
  const el = e.target;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 100) + "px";
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

  closeProviderDropdown();
  chatLog.value.push({ role: "user", text: question });
  userMessage.value = "";
  isSending.value = true;
  if (textareaRef.value) textareaRef.value.style.height = "auto";
  scrollToBottom();

  let assistantEntry = null;
  let rawText = "";

  function ensureEntry() {
    if (!assistantEntry) {
      assistantEntry = reactive({ role: "assistant", text: "", isStreaming: true });
      chatLog.value.push(assistantEntry);
      isSending.value = false;
    }
    return assistantEntry;
  }

  try {
    const response = await fetch(`${base}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user1", message: question, provider: selectedProvider.value }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    outer: while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") {
          ensureEntry().text = marked.parse(rawText);
          ensureEntry().isStreaming = false;
          break outer;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.type === "meta") {
            updateProviderStatus(parsed);
            continue;
          }
          if (parsed.chunk) {
            rawText += parsed.chunk;
            ensureEntry().text = marked.parse(rawText);
            scrollToBottom();
          }
        } catch (_) {}
      }
    }
    if (assistantEntry?.isStreaming) {
      assistantEntry.text = marked.parse(rawText) || "Không gửi được, vui lòng thử lại.";
      assistantEntry.isStreaming = false;
    }
    if (!assistantEntry) {
      chatLog.value.push(reactive({ role: "assistant", text: "Không gửi được, vui lòng thử lại.", isStreaming: false }));
    }
  } catch (error) {
    if (assistantEntry) {
      assistantEntry.text = "Không gửi được, vui lòng thử lại.";
      assistantEntry.isStreaming = false;
    } else {
      chatLog.value.push(reactive({ role: "assistant", text: "Không gửi được, vui lòng thử lại.", isStreaming: false }));
    }
    console.error(error);
  } finally {
    isSending.value = false;
    scrollToBottom();
  }
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);
});

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
  box-shadow: 0 4px 16px rgba(21, 128, 61, 0.4);
  z-index: 1000;
  transition: all 0.2s ease;
}

.chat-icon:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(21, 128, 61, 0.5);
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
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
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
  min-width: 0;
  flex: 1;
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

.chat-header-copy {
  min-width: 0;
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

.chat-provider-status {
  color: #047857;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
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
  padding: 16px 22px;
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

.sending-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.sending-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

/* Chat Input */
.chat-input {
  padding: 12px 22px 16px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-white);
  position: relative;
}

.chat-input-shell {
  position: relative;
  background: #ffffff;
  border: 1px solid #d9eee5;
  border-radius: 22px;
  padding: 10px 12px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.06);
}

.provider-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin-bottom: 8px;
}

.provider-chip {
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  color: #047857;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-height: unset;
  flex-shrink: 0;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.provider-chip:hover {
  background: #d1fae5;
  border-color: #86efac;
  box-shadow: none;
  color: #047857;
  transform: translateY(-1px);
}

.provider-chip i {
  font-size: 0.7rem;
}

.provider-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  max-height: 240px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  z-index: 1100;
}

.provider-option {
  width: 100%;
  height: auto;
  min-height: 48px;
  padding: 8px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: none;
  background: transparent;
  text-align: left;
  min-width: unset;
  transition: background 0.2s ease;
}

.provider-option:hover:not(:disabled) {
  background: #f3f4f6;
  box-shadow: none;
}

.provider-option.selected {
  background: #ecfdf5;
}

.provider-option.disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.provider-option-icon {
  width: 22px;
  flex-shrink: 0;
  font-size: 1rem;
}

.provider-option-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.provider-option-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.provider-option.selected .provider-option-name {
  color: #047857;
}

.provider-option-desc {
  font-size: 12px;
  color: #6b7280;
}

.provider-option-check {
  color: #047857;
  font-size: 0.8rem;
  margin-left: auto;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.chat-input textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  padding: 4px 0;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  max-height: 100px;
  min-height: 40px;
  font-family: var(--font-body);
  background: transparent;
  color: #0f172a;
}

.chat-input textarea:focus {
  outline: none;
  background: transparent;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #059669;
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
  background: #047857;
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
    bottom: 12px;
    right: 12px;
    left: 12px;
    width: calc(100vw - 24px);
    height: min(640px, calc(100vh - 24px));
    border-radius: 22px;
  }

  .chat-icon {
    bottom: 16px;
    right: 16px;
    width: 52px;
    height: 52px;
  }

  .chat-body {
    padding: 14px 16px;
  }

  .chat-input {
    padding: 10px 16px 14px;
  }

  .provider-dropdown {
    max-height: 240px;
    min-width: min(220px, calc(100vw - 72px));
  }
}
</style>
