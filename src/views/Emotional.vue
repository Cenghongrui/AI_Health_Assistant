<template>
  <div>
    <PageHead title="情绪日志" />
    <TableSearch :formItem="formItem" @search="handleSearch" />

    <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="用户" width="100">
        <template #default="scope">
          <el-avatar>
            {{ scope.row.nickname }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="diaryDate" label="记录日期" width="120" />
      <el-table-column label="情绪评分" width="200">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="140">
        <template #default="scope">
          <p>睡眠：{{ scope.row.sleepQuality }}/5</p>
          <p>压力：{{ scope.row.stressLevel }}/5</p>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="140" />
      <el-table-column prop="diaryContent" label="日记内容" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button text type="primary" @click="viewSessionDetail(scope.row)">详情</el-button>
          <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog v-model="showDetailDialog" title="情绪日志详情" width="800px" :close-on-click-modal="false">
      <div class="detail-content" v-if="currentRow">
        <div class="detail-section">
          <h4>用户信息:</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ currentRow.username }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ currentRow.nickname }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ currentRow.userId }}</el-descriptions-item>
            <el-descriptions-item label="记录日期">{{ currentRow.diaryDate }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="currentRow.moodScore" :max="10" disabled />
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(currentRow.dominantEmotion)">{{ currentRow.dominantEmotion || '-' }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量">{{ currentRow.sleepQuality }}/5</el-descriptions-item>
            <el-descriptions-item label="压力水平">{{ currentRow.stressLevel }}/5</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>日记内容:</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">{{ currentRow.emotionTriggers }}</el-descriptions-item>
            <el-descriptions-item label="日记内容">{{ currentRow.diaryContent }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>AI 情绪分析结果:</h4>
          <div class="ai-analysis-result">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getAiEmotionTagType(aiEmotionAnalysis.primaryEmotion)">
                  {{ aiEmotionAnalysis.primaryEmotion }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                <el-progress
                  :percentage="aiEmotionAnalysis.emotionScore"
                  :color="getEmotionScoreColor(aiEmotionAnalysis.emotionScore)"
                  :stroke-width="8"
                />
              </el-descriptions-item>
              <el-descriptions-item label="风险等级">
                <el-tag :type="getRiskLevelTagType(aiEmotionAnalysis.riskLevel)">
                  {{ getRiskLevelText(aiEmotionAnalysis.riskLevel) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiEmotionAnalysis.isNegative ? 'danger' : 'success'">
                  {{ aiEmotionAnalysis.isNegative ? '负面情绪' : '正面情绪' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>

            <div class="ai-suggestion-section">
              <h5>专业建议：</h5>
              <div class="suggestion-content">{{ aiEmotionAnalysis.suggestion || '无' }}</div>
            </div>
            <div class="ai-risk-section">
              <h5>风险描述：</h5>
              <div class="risk-content">{{ aiEmotionAnalysis.riskDescription || '无' }}</div>
            </div>
            <div class="ai-improvements-section">
              <h5>改善建议：</h5>
              <ul class="improvement-list">
                <li v-for="item in aiEmotionAnalysis.improvementSuggestions" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>时间信息:</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="创建时间">{{ currentRow.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ currentRow.updatedAt }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { getEmotionPage, deleteEmotion } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import type {
  EmotionAnalysis,
  EmotionDiary,
  PaginationState,
  SearchFormModel,
  TableSearchItem,
} from '@/interface'

type TagType = 'success' | 'info' | 'warning' | 'danger'

const createDefaultEmotionAnalysis = (): EmotionAnalysis => ({
  primaryEmotion: '',
  emotionScore: 0,
  isNegative: false,
  riskLevel: 0,
  suggestion: '',
  riskDescription: '',
  improvementSuggestions: [],
})

const getEmotionTagType = (emotion?: string): TagType => {
  const emotionTypes: Record<string, TagType> = {
    快乐: 'success',
    平静: 'info',
    兴奋: 'warning',
    愤怒: 'danger',
    悲伤: 'info',
    焦虑: 'warning',
  }

  return emotion ? emotionTypes[emotion] ?? 'info' : 'info'
}

const getAiEmotionTagType = (emotion: string): TagType => {
  const emotionTagMap: Record<string, TagType> = {
    快乐: 'success',
    平静: 'success',
    兴奋: 'warning',
    满足: 'success',
    愤怒: 'danger',
    悲伤: 'info',
    焦虑: 'warning',
    恐惧: 'danger',
    沮丧: 'info',
    压力: 'warning',
  }

  return emotionTagMap[emotion] ?? 'info'
}

const getEmotionScoreColor = (score: number) => {
  if (score >= 80) return '#f56c6c'
  if (score >= 60) return '#e6a23c'
  if (score >= 40) return '#909399'
  return '#67c23a'
}

const getRiskLevelTagType = (riskLevel: number): TagType => {
  const riskTagMap: Record<number, TagType> = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'danger',
  }

  return riskTagMap[riskLevel] ?? 'info'
}

const getRiskLevelText = (riskLevel: number) => {
  const riskTextMap: Record<number, string> = {
    0: '正常',
    1: '关注',
    2: '预警',
    3: '危机',
  }

  return riskTextMap[riskLevel] ?? '未知风险等级'
}

const formItem = reactive<TableSearchItem[]>([
  { comp: 'input', prop: 'userID', label: '用户ID', placeholder: '请输入用户ID' },
  {
    comp: 'select',
    prop: 'moodScoreRange',
    label: '情绪评分',
    placeholder: '请选择情绪评分范围',
    options: [
      { label: '低分（1-3 分）', value: '1-3' },
      { label: '中分（4-6 分）', value: '4-6' },
      { label: '高分（7-10 分）', value: '7-10' },
    ],
  },
])

const tableData = ref<EmotionDiary[]>([])
const pagination = reactive<PaginationState>({
  currentPage: 1,
  size: 10,
  total: 0,
})

const handleSearch = async (formData: SearchFormModel = {}) => {
  const params = {
    ...pagination,
    ...formData,
  }

  const { records, total } = await getEmotionPage(params)
  tableData.value = records
  pagination.total = total
}

const handleSizeChange = (val: number) => {
  pagination.size = val
  handleSearch({})
}

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  handleSearch({})
}

const showDetailDialog = ref(false)
const currentRow = ref<EmotionDiary | null>(null)
const aiEmotionAnalysis = ref<EmotionAnalysis>(createDefaultEmotionAnalysis())

const parseEmotionAnalysis = (raw?: string): EmotionAnalysis => {
  if (!raw) return createDefaultEmotionAnalysis()

  try {
    const data = JSON.parse(raw) as Partial<EmotionAnalysis>
    return {
      ...createDefaultEmotionAnalysis(),
      ...data,
      improvementSuggestions: Array.isArray(data.improvementSuggestions) ? data.improvementSuggestions : [],
    }
  } catch {
    return createDefaultEmotionAnalysis()
  }
}

const viewSessionDetail = (row: EmotionDiary) => {
  currentRow.value = row
  aiEmotionAnalysis.value = parseEmotionAnalysis(row.aiEmotionAnalysis)
  showDetailDialog.value = true
}

const handleDelete = (row: EmotionDiary) => {
  ElMessageBox.confirm(`确认删除情绪日记 ${row.id} 吗？`, '确认', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteEmotion(row.id).then(() => {
      ElMessage.success('删除成功')
      handleSearch({})
    })
  })
}

onMounted(() => {
  handleSearch({})
})
</script>

<style scoped lang="scss">
.detail-content {
  .detail-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 16px 0;
      color: #303133;
      font-size: 16px;
    }
  }
}

.ai-analysis-result {
  .ai-suggestion-section,
  .ai-risk-section,
  .ai-improvements-section {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 4px;

    h5 {
      margin: 0 0 8px 0;
      color: #606266;
      font-size: 14px;
      font-weight: 600;
    }
  }

  .suggestion-content,
  .risk-content {
    line-height: 1.6;
    color: #606266;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }

  .improvement-list {
    margin: 0;
    padding-left: 20px;

    li {
      margin-bottom: 4px;
      color: #606266;
      line-height: 1.5;
    }
  }
}
</style>
