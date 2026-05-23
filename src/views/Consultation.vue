<template>
    <div class="consultation-container">
        <div class="sidebar">
            <!-- ai助手信息 -->
            <div class="ai-assistant-info">
                <!-- ai助手头像 -->
                <div class="breathing-circle">
                    <el-image :src="iconUrl1" style="width: 30px; height: 30px;" />
                </div>

                <div class="assistant-info">
                    <p class="assistant-name">AI心理健康助手</p>
                    <div class="online-status">
                        <div class="status-dot"></div>
                        在线服务中
                    </div>
                </div>
            </div>
            <!-- 情绪花园 -->
            <div class="emotion-garden">
                <div class="garden-header">
                    <div class="garden-title">情绪花园</div>
                </div>
                <div class="emotion-info">
                    <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
                    <div class="emotion-score">{{ currentEmotion.emotionScore }}</div>
                </div>
                <div class="warm-tips">
                    <div class="emotion-status-text">
                        <span class="status-label">今天感觉</span>
                        <span class="status-emotion">{{ currentEmotion.isNegative ? '需要关注' : '很不错' }}</span>
                    </div>
                    <div class="emotion-intensity">
                        <span class="intensity-dots">
                            <span v-for="dot in 3" :key="dot" class="dot"
                                :class="{ 'active': getIntensityClass(currentEmotion.emotionScore) >= dot }"></span>
                        </span>
                        <span class="intensity-text">
                            {{ getRiskText(currentEmotion.riskLevel) }}
                        </span>
                    </div>
                    <!-- 温暖建议卡片 -->
                    <div class="warm-suggestion" v-if="currentEmotion.suggestion">
                        <div class="suggestion-icon">💝</div>
                        <div class="suggestion-content">
                            <div class="suggestion-title">给你的小建议</div>
                            <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
                        </div>
                    </div>
                    <!-- 治愈行动卡片 -->
                    <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
                        <div class="actions-title">治愈行动</div>
                        <div class="actions-list">
                            <div class="action-item" v-for="action in currentEmotion.improvementSuggestions"
                                :key="action">
                                <div class="action-icon">✨</div>
                                <div class="action-text">{{ action }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 风险提示卡片 -->
                     <div class="risk-notice" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
                        <div class="notice-icon">🤗</div>
                        <div class="notice-content">
                            <div class="notice-title">温馨提示</div>
                            <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
                        </div>
                     </div>
                </div>

            </div>
            <!-- 会话历史 -->
            <div class="session-history">
                <h4 class="section-title">会话历史</h4>
                <div class="session-list">
                    <div v-for="item in sessionHistoryList" :key="item.id" @click="handleSessionClick(item)"
                        class="session-item">
                        <div class="session-info">
                            <div class="session-title">
                                <span>{{ item.sessionTitle }}</span>
                                <div class="session-meta">
                                    <span class="session-time">{{ item.startetAt }}</span>
                                </div>
                                <div class="session-preview">{{ item.lastMessageContent }}</div>
                                <div class="session-stats">
                                    <span>
                                        <el-icon>
                                            <ChatRound />
                                        </el-icon>
                                        {{ item.messageCount || 0 }}
                                    </span>
                                    <span>
                                        <el-icon>
                                            <Clock />
                                        </el-icon>
                                        {{ item.durationMinutes || 0 }}分钟
                                    </span>
                                </div>
                            </div>
                            <div class="session-actions">
                                <el-button text type="danger" size="mini" @click="handleSessionDelete(item)">
                                    <el-icon>
                                        <DeleteFilled />
                                    </el-icon>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-main">
            <div class="chat-header">
                <div class="header-left">
                    <div class="chat-avatar">
                        <el-image :src="iconUrl2" style="width: 30px; height: 30px;" />
                    </div>
                    <div class="chat-info">
                        <h2>宁渡AI</h2>
                        <p>您贴心的心理健康助手</p>
                    </div>
                </div>
                <el-button circle @click="createNewSession" title="创建新会话">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
            <!-- 聊天内容 -->
            <div class="chat-messages">
                <div class="message-item ai-message" v-if="messages.length === 0">
                    <div class="message-avatar">
                        <el-image :src="iconUrl1" style="width: 18px ; height: 18px;" />
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <p>您好，我是小宁，您的AI心理健康助手。很高兴陪伴您，无论您是想倾诉烦恼、寻求建议，还是只是想找人聊聊天，我都在这里。您可以随时告诉我您的感受，我会认真倾听并给予温暖的回应。
                            </p>
                        </div>
                        <div class="message-time">刚刚</div>
                    </div>
                </div>

                <!-- 消息列表 -->
                <div class="message-item" :class="msg.senderType === 1 ? 'user-message' : 'ai-message'"
                    v-for="msg in messages" :key="msg.id">
                    <div class="message-avatar">
                        <el-image v-if="msg.senderType === 1" :src="iconUrl3"
                            style="width: 18px ; height: 18px;"></el-image>
                        <el-image v-if="msg.senderType === 2" :src="iconUrl1"
                            style="width: 18px ; height: 18px;"></el-image>
                    </div>
                    <div class="message-content">
                        <div class="message-bubble">
                            <!--AI思考中-->
                            <div v-if="msg.senderType === 2 && isAiTyping && !msg.content" class="typing-indicator">
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                                <div class="typing-dot"></div>
                            </div>
                            <!--AI错误提示-->
                            <div v-else-if="msg.isError" class="error-message">
                                <p>{{ msg.content }}</p>
                            </div>
                            <!--AI正常回复-->
                            <MarkdownRenderer v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content"
                                :is-ai-message="true" />
                            <!--用户数据-->
                            <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
                        </div>
                        <div class="message-time">
                            {{ msg.senderType === 2 && isAiTyping ? '正在输入中...' : msg.createdAt }}
                        </div>
                    </div>

                </div>
            </div>
            <!-- 消息输入框 -->
            <div class="chat-input">
                <div class="input-container">
                    <el-input class="message-input" v-model="userMessage" placeholder="请输入您想要分享的内容..." type="textarea"
                        :rows="3" :disabled="isAiTyping" @keydown="handleKeyDownEvent" clearable />
                    <div class="markdown-content">
                        <span>按Enter发送，Shift+Enter换行</span>
                        <span>{{ userMessage.length }}/500</span>
                    </div>
                </div>
                <el-button :disabled="!userMessage.trim() || userMessage.length > 500" type="primary" class="send-btn"
                    @click="sendMessage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Clock, Plus, Promotion } from '@element-plus/icons-vue';
    import { ref, onMounted } from 'vue'
    import { startSession, getSessionHistory, deleteSession, getSessionMessages, getSessionEmotion } from '@/api/frontEnd'
    import { ElMessage } from 'element-plus'
    import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
    import { fetchEventSource } from '@microsoft/fetch-event-source'
    import type {
        ChatMessage,
        ChatSession,
        CurrentSession,
        EmotionAnalysis,
        StartSessionRequest,
        StreamChunk,
    } from '@/interface'


    const iconUrl1 = new URL('@/assets/images/robot-fill.png', import.meta.url).href
    const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
    const iconUrl3 = new URL('@/assets/images/users.png', import.meta.url).href


    //新建会话
    const createNewSession = () => {
        //创建新会话对象
        const newSession: CurrentSession = {
            sessionId: `temp_${Date.now()}`,
            status: 'TEMP',
            sessionTitle: '新会话',
        }

        currentSession.value = newSession
        messages.value = []  // 清空消息列表，显示默认欢迎消息
        isAiTyping.value = false  // 重置AI输入状态
    }
    //定义当前会话对象
    const currentSession = ref<CurrentSession | null>(null)
    const sessionHistoryList = ref<ChatSession[]>([])

    //定义对话消息
    const messages = ref<ChatMessage[]>([])

    const userMessage = ref('')

    const isAiTyping = ref(false)//是否正在输入


    //情绪花园
    const currentEmotion = ref<EmotionAnalysis>({
        primaryEmotion: '中性',
        emotionScore: 50,
        isNegative: false,
        riskLevel: 0,
        suggestion: '情绪状态平稳正常',
        riskDescription: '',
        improvementSuggestions: [],
    })

    const loadSessionEmotion =  (sessionId: string | number) => {
        //判断格式是否正确
        const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`

        //获取会话情绪
        getSessionEmotion(id).then(res => {
            console.log(res)
            currentEmotion.value = res
        })
    }

    const getIntensityClass = (score: number) => {
        if (score >= 61) {
            return 3
        } else if (score >= 31) {
            return 2
        } else {
            return 1
        }
    }

    const getRiskText = (level: number) => {
        if (level === 3) {
            return '危机'
        } else if (level === 2) {
            return '预警'
        } else if (level === 1) {
            return '需要关注'
        } else if (level === 0) {
            return '正常'
        } else {
            return '未知风险'
        }
    }


    const sendMessage = () => {
        sendUserMessage()
    }

    const handleKeyDownEvent = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    //用户发送消息
    const sendUserMessage = () => {
        if (!userMessage.value.trim()) return

        if (isAiTyping.value) {
            ElMessage.error('正在输入,请稍后...')
            return
        }

        const message = userMessage.value.trim()
        userMessage.value = ''
        const session = currentSession.value
        if (!session) {
            createNewSession()
            startNewSession(message)
            return
        }

        //如果是新会话,则需要创建会话
        if (session.status === 'TEMP') {
            startNewSession(message)
        } else {
            //继续现有会话
            messages.value.push({
                id: Date.now(),
                senderType: 1,
                content: message,
                createdAt: new Date().toISOString(),
            })
            //开始流式对话
            startAiResponse(session.sessionId, message)
        }

    }

    const startNewSession = (message: string) => {
        //构建会话参数
        const session = currentSession.value
        if (!session) return

        const sessionParams: StartSessionRequest = {
            initialMessage: message,
            sessionTitle: '',
        }

        if (session.sessionTitle === '新会话') {
            sessionParams.sessionTitle = `宁度AI - ${new Date().toLocaleString()}`
        } else {
            //如果是历史会话,则使用历史会话标题
            sessionParams.sessionTitle = session.sessionTitle
        }


        //创建会话
        startSession(sessionParams).then((res) => {
            console.log(res)
            //将后端返回的数据转为前端需要的格式
            const sessionData: CurrentSession = {
                sessionId: res.sessionId,
                status: res.status,
                sessionTitle: sessionParams.sessionTitle,
            }

            //如果当前是临时会话，更新数据
            if (currentSession.value && currentSession.value.status === 'TEMP') {
                //更新为正式会话
                Object.assign(currentSession.value, sessionData)
            } else {
                currentSession.value = sessionData
            }
            //更新会话列表
            getSessionPage()

            //添加初始用户消息
            messages.value.push({
                id: Date.now(),
                senderType: 1,
                content: message,
                createdAt: new Date().toISOString(),
            })

            //开始流式对话
            if (currentSession.value) {
                startAiResponse(currentSession.value.sessionId, message)
            }

        })
    }

    const startAiResponse = (sessionId: string, userMessage: string) => {
        if (isAiTyping.value) {
            ElMessage.error('正在输入,请稍后...')
            return
        }
        //开始流式对话
        isAiTyping.value = true

        const aiMessage: ChatMessage = {
            id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            senderType: 2,
            content: '',
            createdAt: new Date().toISOString(),
        }
        messages.value.push(aiMessage)

        //调用流式接口
        const controller = new AbortController() //用来终止fetch请求
        fetchEventSource('/api/psychological-chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': localStorage.getItem('token') || '',
                'Accept': 'text/event-stream',
            },
            body: JSON.stringify({
                sessionId: sessionId,
                userMessage: userMessage,
            }),
            signal: controller.signal,
            onopen: async (response) => {
                console.log(response)
                //检查响应头是否包含text/event-stream
                if (response.headers.get('Content-Type') !== 'text/event-stream') {
                    ElMessage.error('连接失败,请稍后重试')
                }
            },
            onmessage: (event: { data: string; event?: string }) => {
                const raw = event.data.trim()
                if (!raw) return
                const eventName = event.event
                const aiMessage = messages.value[messages.value.length - 1]
                if (!aiMessage) return
                if (eventName === 'done') {
                    isAiTyping.value = false
                    controller.abort()
                    //开始情绪分析
                    if (currentSession.value) {
                        loadSessionEmotion(currentSession.value.sessionId)
                    }
                    return
                }
                const payload = JSON.parse(raw) as StreamChunk
                const ok = String(payload.code) === '200'
                if (ok && payload.data?.content) {
                    aiMessage.content += payload.data.content
                } else if (!ok) {
                    //错误回复提示
                    handleError(payload.message || '连接失败,请稍后重试')
                }
            },
            onerror: (error) => {
                handleError(error || '连接失败,请稍后重试')
                throw error
            },
            onclose: () => {
                //开始情绪分析
                if (currentSession.value) {
                    loadSessionEmotion(currentSession.value.sessionId)
                }
            }
        })
    }

    //错误处理函数
    const handleError = (error: unknown) => {
        console.error(error)
        const aiMessage = messages.value[messages.value.length - 1]
        if (aiMessage) {
            aiMessage.content = 'AI回复失败，请重试'
        }
        isAiTyping.value = false
        ElMessage.error('AI回复失败，请重试')
    }

    //获取会话历史
    const getSessionPage = () => {
        getSessionHistory({
            pageNum: 1,
            pageSize: 10,
        }).then((res) => {
            console.log(res)
            sessionHistoryList.value = res.records
        })
    }

    //点击会话项,获取会话数据
    const handleSessionClick = (item: ChatSession) => {
        //获取会话消息
        getSessionMessages(item.id).then((res) => {
            messages.value = res
        })

        //获取会话情绪
        loadSessionEmotion(item.id)

        //更新当前会话
        const sessionData: CurrentSession = {
            sessionId: "session_" + item.id,
            status: "ACTIVE",
            sessionTitle: item.sessionTitle,
        }
        currentSession.value = sessionData
    }

    //删除会话
    const handleSessionDelete = (item: ChatSession) => {
        deleteSession(item.id).then(() => {
            ElMessage.success('会话删除成功')
            //更新会话列表
            getSessionPage()
        })
    }

    const formatMessageContent = (content: string) => {
        return content.replace(/\n/g, '<br>')
    }

    onMounted(() => {
        getSessionPage()
        createNewSession()
    })
</script>

<style scoped lang="scss">
    .consultation-container {
        margin: 0 auto;
        width: 1200px;
        display: flex;
        gap: 20px;
        padding: 20px;

        .sidebar {
            width: 320px;

            .ai-assistant-info {
                margin-bottom: 20px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                border-radius: 16px;
                padding: 16px;
                box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(251, 146, 60, 0.08);
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;

                .breathing-circle {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 12px;
                    animation: breathing 4s ease-in-out infinite;
                    box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
                    position: relative;
                }

                .assistant-name {
                    font-size: 16px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #fb923c, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-align: center;
                    background-clip: text;
                    margin: 0 0 12px;
                }

                .online-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #059669;
                    font-size: 12px;
                    font-weight: 600;

                    .status-dot {
                        width: 8px;
                        height: 8px;
                        background: #059669;
                        border-radius: 50%;
                        margin-right: 8px;
                        animation: pulse 2s infinite;
                        box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
                    }
                }
            }

            .session-history {
                background: white;
                border-radius: 16px;
                padding: 16px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                margin-bottom: 20px;
                min-height: 250px;
                display: flex;
                flex-direction: column;

                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                }

                .session-list {
                    overflow-y: auto;
                    max-height: 200px;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

                    .session-item {
                        position: relative;
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                        padding: 12px;
                        margin-bottom: 8px;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: 2px solid transparent;

                        &:hover {
                            background: #f8f9ff;
                            border-color: #e6f0ff;
                        }

                        &.active {
                            background: #e6f0ff;
                            border-color: #4096ff;
                        }

                        .session-info {
                            flex: 1;

                            .session-title {
                                font-weight: 500;
                                font-size: 14px;
                                color: #333;
                                margin-bottom: 4px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;

                                .session-meta {
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                    margin-bottom: 6px;

                                    .session-time {
                                        font-size: 12px;
                                        color: #999;
                                    }
                                }

                                .session-preview {
                                    width: 200px;
                                    font-size: 12px;
                                    color: #666;
                                    margin-bottom: 6px;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }

                                .session-stats {
                                    display: flex;
                                    align-items: center;
                                    gap: 12px;

                                    span {
                                        font-size: 12px;
                                        color: #999;
                                        display: flex;
                                        align-items: center;
                                        gap: 4px;
                                    }
                                }
                            }

                            .session-actions {
                                position: absolute;
                                top: 10px;
                                right: 12px;
                            }
                        }
                    }

                    .no-sessions-text {
                        text-align: center;
                        font-size: 14px;
                        color: #999;
                    }
                }
            }

            .emotion-garden {
                background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
                border-radius: 20px;
                padding: 16px;
                margin-bottom: 20px;
                box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
                overflow: hidden;
                min-height: 300px;

                .garden-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 2;

                    .garden-title {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        color: #8b4513;
                    }
                }

                .emotion-info {
                    margin: 0 auto;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.8);
                    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                    color: #fff;

                    .emotion-name {
                        font-size: 15px;
                        font-weight: 600;
                        line-height: 1;
                        margin-bottom: 2px;
                    }

                    .emotion-score {
                        font-size: 14px;
                        font-weight: 700;
                        opacity: 0.9;
                    }
                }

                .warm-tips {
                    text-align: center;
                    margin-bottom: 16px;

                    .emotion-status-text {
                        margin-bottom: 12px;

                        .status-label {
                            font-size: 14px;
                            color: #8b7355;
                            margin-right: 8px;
                        }

                        .status-emotion {
                            font-size: 16px;
                            font-weight: 600;
                            padding: 4px 12px;
                            border-radius: 16px;
                            display: inline-block;
                        }
                    }

                    .emotion-intensity {
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;

                        .intensity-dots {
                            display: flex;
                            gap: 4px;

                            .dot {
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background: #e0e0e0;
                                transition: all 0.3s ease;

                                &.active {
                                    background: linear-gradient(135deg, #ff9a9e, #fecfef);
                                    transform: scale(1.2);
                                    box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
                                }
                            }
                        }

                        .intensity-text {
                            font-size: 12px;
                            color: #8b7355;
                            font-weight: 500;
                        }
                    }

                    .warm-suggestion {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
                        border-radius: 16px;
                        padding: 12px;
                        margin-bottom: 16px;
                        display: flex;
                        align-items: flex-start;
                        gap: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.6);
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);

                        .suggestion-icon {
                            font-size: 20px;
                            flex-shrink: 0;
                            margin-top: 2px;
                        }

                        .suggestion-content {
                            text-align: left;
                            flex: 1;

                            .suggestion-title {
                                font-size: 14px;
                                font-weight: 600;
                                color: #8b7355;
                                margin-bottom: 6px;
                            }

                            .suggestion-text {
                                font-size: 13px;
                                color: #6b5b47;
                                line-height: 1.5;
                            }
                        }
                    }

                    .healing-actions {
                        margin-bottom: 16px;

                        .actions-title {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            color: #8b7355;
                            margin-bottom: 16px;
                        }

                        .actions-list {
                            display: flex;
                            flex-direction: column;
                            gap: 10px;

                            .action-item {
                                background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
                                border-radius: 12px;
                                padding: 12px;
                                display: flex;
                                align-items: center;
                                gap: 10px;
                                border: 1px solid rgba(255, 255, 255, 0.5);
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
                                text-align: left;

                                .action-icon {
                                    font-size: 14px;
                                    color: #ffd700;
                                    flex-shrink: 0;
                                }

                                .action-text {
                                    font-size: 12px;
                                    color: #6b5b47;
                                    line-height: 1.4;
                                    flex: 1;
                                }
                            }
                        }
                    }

                    .risk-notice {
                        background: linear-gradient(135deg, #fff9e6, #ffeaa7);
                        border-radius: 16px;
                        padding: 16px;
                        display: flex;
                        align-items: flex-start;
                        gap: 12px;
                        border: 1px solid rgba(255, 234, 167, 0.6);
                        box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

                        .notice-icon {
                            font-size: 20px;
                            flex-shrink: 0;
                            margin-top: 2px;
                        }

                        .notice-content {
                            flex: 1;

                            .notice-title {
                                font-size: 14px;
                                font-weight: 600;
                                color: #d4840f;
                                margin-bottom: 6px;
                            }

                            .notice-text {
                                font-size: 13px;
                                color: #b8740c;
                                line-height: 1.5;
                            }
                        }
                    }
                }
            }
        }

        .chat-main {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
            border-radius: 20px;
            box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
            border: 1px solid rgba(251, 146, 60, 0.1);
            backdrop-filter: blur(10px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 1;

            .chat-header {
                background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
                color: white;
                padding: 20px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                flex-shrink: 0;

                .header-left {
                    display: flex;
                    align-items: center;

                    .chat-avatar {
                        width: 48px;
                        height: 48px;
                        background: rgba(255, 255, 255, 0.25);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 16px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        position: relative;
                        z-index: 1;
                    }

                    .chat-info {
                        h2 {
                            font-size: 20px;
                            font-weight: 700;
                            margin-bottom: 4px;
                        }

                        p {
                            font-size: 14px;
                        }
                    }
                }
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
                min-height: 0;
                max-height: calc(100vh - 200px);
                scrollbar-width: thin;
                scrollbar-color: rgba(251, 146, 60, 0.3) transparent;

                .message-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;

                    .message-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        color: white;
                        flex-shrink: 0;
                    }

                    &.ai-message {
                        .message-avatar {
                            background: linear-gradient(135deg, #fb923c, #f59e0b);
                            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
                        }
                    }

                    &.user-message {
                        .message-avatar {
                            background: linear-gradient(135deg, #6b7280, #4b5563);
                            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
                        }
                    }

                    .message-content {
                        max-width: 70%;

                        .message-bubble {
                            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
                            border-radius: 16px;
                            padding: 12px 16px;
                            position: relative;
                            animation: fadeInUp 0.4s ease-out;
                            border: 1px solid rgba(251, 146, 60, 0.1);
                            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);

                            .typing-indicator {
                                display: flex;
                                gap: 4px;
                                padding: 8px 0;

                                .typing-dot {
                                    width: 8px;
                                    height: 8px;
                                    background: #ccc;
                                    border-radius: 50%;
                                    animation: typing 1.5s ease-in-out infinite;

                                    &:nth-child(2) {
                                        animation-delay: 0.2s;
                                    }

                                    &:nth-child(3) {
                                        animation-delay: 0.4s;
                                    }
                                }
                            }

                            /* 错误消息样式 */
                            .error-message {
                                background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
                                border: 1px solid #F87171;
                                border-radius: 12px;
                                padding: 12px 16px;
                                color: #991B1B;
                                font-weight: 500;
                                display: flex;
                                align-items: center;
                                gap: 8px;
                            }
                        }

                        .message-time {
                            font-size: 12px;
                            color: #999;
                            margin-top: 4px;
                        }
                    }
                }
            }

            .chat-input {
                border-top: 1px solid rgba(251, 146, 60, 0.1);
                padding: 20px 24px;
                display: flex;
                gap: 12px;
                align-items: flex-end;
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
                backdrop-filter: blur(10px);
                flex-shrink: 0;

                .input-container {
                    flex: 1;
                }

                .input-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    color: #78716c;
                    font-weight: 500;
                }

                .send-btn {
                    height: 60px;
                    width: 60px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
                    border: none !important;
                    box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
                    transition: all 0.3s ease;
                }

            }

        }
    }

</style>
