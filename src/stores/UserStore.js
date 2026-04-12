import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getUserInfo } from '@/api/userinfo'

export const useUserStore = defineStore('User', () => {
    const id = ref('')
    const imageUrl = ref('')
    const name = ref('')
    const sex = ref('')
    const account = ref('')
    const email = ref('')

    const fetchUserInfo = async (userId) => {
        id.value = userId
        const res = await getUserInfo(userId)
        if (res.status == 0) {
            imageUrl.value = res.results.image_url
            name.value = res.results.name
            sex.value = res.results.sex
            account.value = res.results.account
            email.value = res.results.email
        }
    }

    return {
        imageUrl,
        name,
        sex,
        account,
        email,
        id,
        fetchUserInfo
    }
}, {
    persist: true
})