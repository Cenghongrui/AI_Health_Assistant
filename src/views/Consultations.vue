<template>
  <div>
    <PageHead title="咨询记录" />

    <el-table :data="tableData" style="width: 100%;">
      <el-table-column label="会话ID" width="200" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-avatar size="default">
              {{ scope.row.userNickname }}
            </el-avatar>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="情绪标签">
        <template #default="scope">
          <div class="session-title">
            {{ scope.row.sessionTitle }}
          </div>
          <div class="session-preview">
            {{ scope.row.lastMessageContent }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="messageCount" label="消息数" width="100" />
      <el-table-column prop="lastMessageTime" label="时间" width="100" />
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="viewSessionDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.size"
      :current-page="pagination.currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-model="showDetailDialog" title="咨询会话详情" width="80%" :close-on-click-modal="false">
      <div class="session-detail">
        <div>
          <div class="detail-header">
            <div class="detail-row">
              <div>用户：</div>
              <div>{{ currentRow.userNickname }}</div>
            </div>
            <div class="detail-row">
              <div>开始时间：</div>
              <div>{{ currentRow.startedAt }}</div>
            </div>
            <div class="detail-row">
              <div>消息数：</div>
              <div>{{ currentRow.messageCount }}</div>
            </div>
          </div>

          <div class="messages-container">
            <div class="messages-header">
              <h4>对话记录</h4>
            </div>
            <div class="messages-list" v-loading="loadingMessages">
              <div
                v-for="message in sessionMessages"
                :key="message.id"
                class="message-item"
                :class="message.senderType === 1 ? 'user-message' : 'ai-message'"
              >
                <div class="message-header">
                  <span class="sender">{{ message.senderType === 1 ? '用户' : 'AI助手' }}</span>
                  <span class="time">{{ message.createdAt }}</span>
                </div>
                <div class="message-content">
                  {{ message.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import PageHead from '@/components/PageHead.vue'
import { getConsultationsPage, getSessionDetail } from '@/api/admin'
import type { ChatMessage, ChatSession, PaginationState } from '@/interface'

const tableData = ref<ChatSession[]>([])
const pagination = reactive<PaginationState>({
  total: 0,
  size: 10,
  currentPage: 1,
})

const createEmptySession = (): ChatSession => ({
  id: '',
  sessionTitle: '',
  userNickname: '',
  startedAt: '',
  messageCount: 0,
})

const handleSearch = async () => {
  const { records, total } = await getConsultationsPage(pagination)
  tableData.value = records
  pagination.total = total
}

const handleSizeChange = (val: number) => {
  pagination.size = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch()
}

const showDetailDialog = ref(false)
const currentRow = ref<ChatSession>(createEmptySession())
const sessionMessages = ref<ChatMessage[]>([])
const loadingMessages = ref(false)

const viewSessionDetail = async (row: ChatSession) => {
  loadingMessages.value = true
  try {
    sessionMessages.value = await getSessionDetail(row.id)
    currentRow.value = row
    showDetailDialog.value = true
  } finally {
    loadingMessages.value = false
  }
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="scss" scoped>
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.session-detail {
  max-height: 70vh;
  overflow-y: auto;

  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
}

.messages-container {
  margin-top: 20px;

  .messages-header {
    margin-bottom: 16px;

    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;

    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;

      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }
    }

    .message-content {
      color: #333;
      line-height: 1.6;
      white-space: pre-wrap;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style>
