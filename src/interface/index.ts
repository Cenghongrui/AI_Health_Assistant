import type { AxiosRequestConfig } from 'axios'

export type Id = number | string
export type UserType = 1 | 2
export type ArticleStatus = 0 | 1 | 2
export type SenderType = 1 | 2
export type SessionStatus = 'TEMP' | 'ACTIVE' | 'CLOSED' | 'COMPLETED'

export interface ApiEnvelope<T> {
  code: string | number
  data: T
  msg?: string
  message?: string
}

export interface HttpClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
}

export type QueryValue = string | number | boolean | null | undefined
export type SearchFormModel = Record<string, QueryValue>

export interface PaginationState {
  currentPage: number
  size: number
  total: number
}

export interface PaginationQuery extends SearchFormModel {
  currentPage?: number
  size?: number
  pageNum?: number
  pageSize?: number
}

export interface PageResult<T> {
  records: T[]
  total: number
  current?: number
  size?: number
  pages?: number
}

export interface SelectOption<T extends string | number = string | number> {
  label: string
  value: T
}

export interface SearchFormCol {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
}

export interface TableSearchItem {
  comp: 'input' | 'select'
  prop: string
  label: string
  placeholder?: string
  options?: SelectOption[]
  col?: SearchFormCol
}

export interface UserInfo {
  id?: Id
  username?: string
  nickname?: string
  userType: UserType
  email?: string
  phone?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
}

export interface RegisterRequest {
  username: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  gender: number
  userType: UserType
  nickname: string
}

export interface Category {
  id: number
  categoryName: string
  children?: Category[]
}

export type CategoryOption = SelectOption<number>

export interface ArticleListItem {
  id: Id
  title: string
  categoryId?: number
  categoryName?: string
  authorName?: string
  readCount?: number
  updatedAt?: string
  publishedAt?: string
  coverImage?: string
  summary?: string
  content?: string
  tags?: string
  tagArray?: string[]
  status?: ArticleStatus
}

export interface ArticleDetail extends ArticleListItem {
  content: string
  coverImage: string
  categoryId: number
  summary: string
  tags: string
}

export interface ArticleFormModel {
  id: Id | ''
  title: string
  content: string
  coverImage: string
  categoryId: number
  summary: string
  tags: string
  tagArray: string[]
}

export interface ArticleSaveRequest {
  id?: Id
  title: string
  content: string
  coverImage: string
  categoryId: number
  summary: string
  tags: string
}

export interface ArticlePageQuery extends PaginationQuery {
  title?: string
  categoryId?: number | string
  status?: ArticleStatus | ''
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}

export interface ArticleStatusRequest {
  status: ArticleStatus
}

export interface UploadBusinessInfo {
  businessId: string
}

export interface UploadFileResult {
  filePath: string
  fileName?: string
  url?: string
}

export interface RichTextChangePayload {
  html: string
  text: string
}

export interface StartSessionRequest {
  initialMessage: string
  sessionTitle: string
}

export interface StartSessionResult {
  sessionId: string
  status: SessionStatus
}

export interface CurrentSession {
  sessionId: string
  status: SessionStatus
  sessionTitle: string
}

export interface ChatSession {
  id: Id
  sessionId?: string
  status?: SessionStatus
  sessionTitle: string
  startedAt?: string
  startetAt?: string
  lastMessageContent?: string
  lastMessageTime?: string
  messageCount?: number
  durationMinutes?: number
  userNickname?: string
  userId?: Id
}

export interface ChatMessage {
  id: Id
  senderType: SenderType
  content: string
  createdAt: string
  isError?: boolean
}

export interface SessionPageQuery extends PaginationQuery {
  userId?: Id
}

export interface EmotionAnalysis {
  primaryEmotion: string
  emotionScore: number
  isNegative: boolean
  riskLevel: number
  suggestion: string
  riskDescription?: string
  improvementSuggestions: string[]
}

export interface EmotionDiaryRequest {
  moodScore: number
  sleepQuality: number
  stressLevel: number
  dominantEmotion?: string
  emotionTriggers?: string
  diaryContent: string
  diaryDate?: string
}

export interface EmotionDiary {
  id: number
  username?: string
  nickname?: string
  userId?: Id
  diaryDate?: string
  moodScore: number
  dominantEmotion?: string
  sleepQuality: number
  stressLevel: number
  emotionTriggers?: string
  diaryContent?: string
  aiEmotionAnalysis?: string
  createdAt?: string
  updatedAt?: string
}

export interface EmotionDiaryQuery extends PaginationQuery {
  userID?: Id
  moodScoreRange?: string
}

export interface SystemOverview {
  totalUsers: number
  activeUsers: number
  totalDiaries: number
  todayNewDiaries: number
  totalSessions: number
  todayNewSessions: number
  avgMoodScore: number
}

export interface EmotionTrendItem {
  date: string
  avgMoodScore: number
  recordCount: number
}

export interface ConsultationTrendItem {
  date: string
  sessionCount: number
  userCount: number
}

export interface ConsultationStats {
  totalSessions: number
  avgDurationMinutes: number
  dailyTrend: ConsultationTrendItem[]
}

export interface UserActivityItem {
  date: string
  activeUsers: number
  newUsers: number
  diaryUsers: number
  consultationUsers: number
}

export interface AnalysisOverview {
  systemOverview: SystemOverview
  emotionTrend: EmotionTrendItem[]
  consultationStats: ConsultationStats
  userActivity: UserActivityItem[]
}

export interface StreamChunkPayload {
  content?: string
}

export interface StreamChunk {
  code: string | number
  data?: StreamChunkPayload
  message?: string
  msg?: string
}
