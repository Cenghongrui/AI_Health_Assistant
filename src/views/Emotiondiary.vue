<template>
    <div class="emotionDiary-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl1" alt="情绪日记" style="width: 60px; height: 60px;" />
                <h1 style="font-size: 30px;color: rgb(255, 255, 255);"> 情绪日记</h1>
            </div>
        </div>
        <div class="content">
            <!-- 情绪评分 -->
            <div class="diary-card">
                <div class="title">今日情绪评分</div>
                <div class="section">
                    <p>您今天的情绪整体如何？</p>
                    <div class="rate">
                        <el-rate v-model="diaryForm.moodScore" :text="emotionStatus" show-texts :max="10"
                            size="large" />
                    </div>
                </div>
            </div>
            <!-- 主要情绪 -->
            <div class="diary-card">
                <div class="title">主要情绪</div>
                <div class="emotion-grid">
                    <div v-for="item in emotionOptions" :key="item.name" class="emotion-card"
                        :class="{ 'selected': item.name === diaryForm.dominantEmotion }"
                        @click="selectEmotion(item.name)">
                        <el-image :src="item.url" alt="情绪" style="width: 50px; height: 50px;" />
                        <div class="emotion-name">{{ item.name }}</div>
                    </div>
                </div>
            </div>
            <!-- 详细记录 -->
            <div class="diary-card">
                <div class="title">详细记录</div>
                <div class="detail-form">
                    <div class="form-group">
                        <div class="form-label">情绪触发因素</div>
                        <el-input type="textarea" :rows="3" maxlength="1000" show-word-limit
                            v-model="diaryForm.emotionTriggers" placeholder="请输入情绪触发因素" />
                    </div>
                    <div class="form-group">
                        <div class="form-label">今日感想</div>
                        <el-input type="textarea" :rows="5" maxlength="2000" show-word-limit
                            v-model="diaryForm.diaryContent" placeholder="请输入今日感想" />
                    </div>
                    <!-- 生活指标 -->
                    <div class="life-indicators">
                        <div class="indicator-group">
                            <div class="form-label">睡眠质量</div>
                            <el-select v-model="diaryForm.sleepQuality" placeholder="请选择">
                                <el-option label="很差" value="1" />
                                <el-option label="较差" value="2" />
                                <el-option label="一般" value="3" />
                                <el-option label="良好" value="4" />
                                <el-option label="优秀" value="5" />
                            </el-select>
                        </div>
                        <div class="indicator-group">
                            <div class="form-label">压力等级</div>
                            <el-select v-model="diaryForm.stressLevel" placeholder="请选择">
                                <el-option label="很低" value="1" />
                                <el-option label="较低" value="2" />
                                <el-option label="中等" value="3" />
                                <el-option label="较高" value="4" />
                                <el-option label="很高" value="5" />
                            </el-select>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <el-button @click="resetForm">重置</el-button>
                        <el-button type="primary" @click="submitForm">提交</el-button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>


<script setup lang="ts">
    import { ref, reactive } from 'vue'
    import { dayjs, ElMessage } from 'element-plus'
    import { addEmotionDiary } from '@/api/frontEnd'
    import type { EmotionDiaryRequest } from '@/interface'



    const iconUrl1 = new URL('@/assets/images/like.png', import.meta.url).href

    const emotionStatus = ['绝望崩溃', '消沉抑郁', '焦虑烦躁', '低落不悦', '平静淡然', '轻松惬意', '愉悦舒心', '欢欣满足', '兴奋欣喜', '极致幸福']
    const emotionOptions = [
        { name: '开心', url: new URL('@/assets/images/开心.png', import.meta.url).href, },
        { name: '平静', url: new URL('@/assets/images/平静.png', import.meta.url).href, },
        { name: '焦虑', url: new URL('@/assets/images/焦虑.png', import.meta.url).href, },
        { name: '悲伤', url: new URL('@/assets/images/悲伤.png', import.meta.url).href, },
        { name: '兴奋', url: new URL('@/assets/images/兴奋.png', import.meta.url).href, },
        { name: '疲惫', url: new URL('@/assets/images/疲惫.png', import.meta.url).href, },
        { name: '惊讶', url: new URL('@/assets/images/惊讶.png', import.meta.url).href, },
        { name: '困惑', url: new URL('@/assets/images/困惑.png', import.meta.url).href, },

    ]

    const selectEmotion = (emotionName: string) => {
        diaryForm.dominantEmotion = emotionName

    }

    interface EmotionDiaryForm extends Omit<EmotionDiaryRequest, 'moodScore' | 'sleepQuality' | 'stressLevel'> {
        moodScore: number | null
        sleepQuality: number | null
        stressLevel: number | null
    }

    const diaryForm = reactive<EmotionDiaryForm>({
        diaryDate: dayjs().format('YYYY-MM-DD'),
        moodScore: null,
        dominantEmotion: '',
        emotionTriggers: '',
        diaryContent: '',
        sleepQuality: null,
        stressLevel: null
    })

    const resetForm = () => {
        Object.assign(diaryForm, {
            diaryDate: dayjs().format('YYYY-MM-DD'),
            moodScore: null,
            dominantEmotion: '',
            emotionTriggers: '',
            diaryContent: '',
            sleepQuality: null,
            stressLevel: null
        })
    }

    const submitForm = () => {
        if (diaryForm.moodScore === null || diaryForm.sleepQuality === null || diaryForm.stressLevel === null) {
            ElMessage.error('请填写情绪评分')
            return
        }
        const payload: EmotionDiaryRequest = {
            ...diaryForm,
            moodScore: diaryForm.moodScore,
            sleepQuality: diaryForm.sleepQuality,
            stressLevel: diaryForm.stressLevel,
        }

        addEmotionDiary(payload).then(() => {
            ElMessage.success('提交成功')
            resetForm()
        })
    }







</script>

<style scoped lang="scss">
    .emotionDiary-container {
        background: linear-gradient(135deg, #fafbfc 0%, #f7f9fc 50%, #f2f6fa 100%);

        .header-section {
            background: linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(144, 60, 200) 100%) rgba(116, 59, 114, 0.95);
            color: rgb(255, 255, 255);
            padding: 48px;

            .header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
        }

        .content {
            margin: 0 auto;
            width: 980px;
            padding: 20px;

            .diary-card {
                margin-bottom: 20px;
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

                .title {
                    margin-bottom: 20px;
                    font-size: 25px;
                    font-weight: 600;
                    color: #374151;
                }

                .section {
                    margin-bottom: 20px;

                    p {
                        font-size: 15px;
                        color: #6B7280;
                        margin-bottom: 15px;
                    }
                }

                .emotion-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;

                    .emotion-card {
                        padding: 15px;
                        border: 2px solid #E5E7EB;
                        border-radius: 15px;
                        text-align: center;
                        cursor: pointer;
                        background: #F9FAFB;

                        .emotion-name {
                            margin-top: 10px;
                            padding: 0 75px;
                            color: #374151;
                        }

                        &.selected {
                            border-color: #7ED321;
                            background: #F0FDF4;
                            transform: translateY(-3px);
                        }
                    }
                }

                .detail-form {
                    .form-label {
                        margin: 10px 0;
                        color: #374151;
                    }

                    .life-indicators {
                        display: flex;
                        gap: 20px;

                        .indicator-group {
                            flex: 1;
                        }
                    }

                    .action-buttons {
                        margin-top: 40px
                    }
                }
            }
        }
    }
</style>
