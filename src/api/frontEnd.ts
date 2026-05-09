import service from '@/utils/request'


export function register(data: any) {
    return service.post('/user/add', data)
}

export function startSession(data: any) {
    return service.post('/psychological-chat/session/start', data)
}

export function getSessionHistory(params: any) {
    return service.get('/psychological-chat/sessions', { params })
}


export function deleteSession(sessionId: string) {
    return service.delete(`/psychological-chat/sessions/${sessionId}`)
}


export function getSessionMessages(sessionId: string) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getSessionEmotion(sessionId: string) {
    return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

export function addEmotionDiary(data: any) {
    return service.post('/emotion-diary', data)
}

export function getKnowledgeList(params: any) {
    return service.get('/knowledge/article/page', { params })
}

export function getArticleDetail(id: number) {
    return service.get(`/knowledge/article/${id}`)
}

