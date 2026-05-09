import service from '@/utils/request'

export function login(data: any) {
    return service.post('/user/login', data)
}

export function categoryTree() {
    return service.get('/knowledge/category/tree')
}


export function articlePage(params: any) {
    return service.get('/knowledge/article/page', { params })
}

export function uploadFile(file: any,businessInfo: any) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')


    return service.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function createArticle(data: any) {
    return service.post('/knowledge/article', data)
}

export function getArticleDetail(id: number) {
    return service.get(`/knowledge/article/${id}`)
}

export function updateArticle(id: number,data: any) {
    return service.put(`/knowledge/article/${id}`, data)
}

export function changeArticleStatus(id: number,data: any) {
    return service.put(`/knowledge/article/${id}/status`,data)
}

export function deleteArticle(id: number) {
    return service.delete(`/knowledge/article/${id}`)
}

export function getConsultationsPage(params: any) {
    return service.get('/psychological-chat/sessions', { params })
}

export function getSessionDetail(sessionId: number) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionPage(params: any) {
    return service.get('/emotion-diary/admin/page', { params })
}

export function deleteEmotion(id: number) {
    return service.delete(`/emotion-diary/admin/${id}`)
}

export function getAnalysisOverview() {
    return service.get(`/data-analytics/overview`)
}

export function logout() {
    return service.post(`/user/logout`)
}


