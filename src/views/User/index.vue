<template>
    <div class="User-center">
        <div class="User-center-wrapper">
            <div class="close-btn" @click="goToHome">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
            <el-tabs v-model="activeName" class="tabs" :class="{ 'mobile-tabs': isMobile }">
                <el-tab-pane label="用户设置" name="first">
                    <div class="account-info-wrapped">
                        <span>用户头像：</span>
                        <div class="account-info-content">
                            <el-upload class="avatar-uploader" :action="avatarUrl" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                <img v-if="userStore.imageUrl" :src="userStore.imageUrl" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户账号：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.account" disabled></el-input>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户密码：</span>
                        <div class="account-info-content">
                            <el-button @click="openSet('password')">修改密码</el-button>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户昵称：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.name" disabled></el-input>
                        </div>
                        <div class="account-save-button">
                            <el-button @click="openSet('name')">修改姓名</el-button>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户性别：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.sex" disabled></el-input>
                        </div>
                        <div class="account-save-button">
                            <el-button @click="openSet('gender')">修改性别</el-button>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户邮箱：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.email" disabled></el-input>
                        </div>
                        <div class="account-save-button">
                            <el-button @click="openSet('email')">修改邮箱</el-button>
                        </div>
                    </div>
                    <div class="quick-actions">
                        <el-divider>快捷入口</el-divider>
                        <div class="action-buttons">
                            <el-button type="primary" @click="GoToPages('/my-trips')">
                                <el-icon>
                                    <Location />
                                </el-icon>
                                我的行程
                            </el-button>
                            <el-button type="success" @click="GoToPages('/travel-log/create')">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                发布游记
                            </el-button>
                            <el-button type="warning" @click="GoToPages('/my-favorites')">
                                <el-icon>
                                    <Star />
                                </el-icon>
                                我的收藏
                            </el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="旅行日志" name="second">
                    <div class="travel-log-section">
                        <div class="section-header">
                            <h3>我的游记</h3>
                            <el-button type="primary" @click="GoToPages('/travel-log/create')">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                发布游记
                            </el-button>
                        </div>
                        <el-empty v-if="myLogs.length === 0" description="暂无游记">
                            <el-button type="primary" @click="GoToPages('/travel-log/create')">发布第一篇游记</el-button>
                        </el-empty>
                        <div v-else class="log-list">
                            <el-card v-for="log in myLogs" :key="log.id" class="log-item" @click="viewLog(log.id)">
                                <div class="log-info">
                                    <h4>{{ log.title }}</h4>
                                    <p class="log-meta">
                                        <span>{{ log.destination }}</span>
                                        <span>{{ formatDate(log.created_at) }}</span>
                                    </p>
                                </div>
                                <div class="log-stats">
                                    <span><el-icon>
                                            <Star />
                                        </el-icon> {{ log.likes_count || 0 }}</span>
                                </div>
                            </el-card>
                        </div>
                        <el-button v-if="myLogs.length > 0" class="view-all-btn" @click="GoToPages('/travel-log/list')">
                            查看全部游记
                        </el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="出行提醒" name="third">
                    <div class="reminder-section">
                        <div class="section-header">
                            <h3>我的提醒</h3>
                            <el-button type="primary" @click="showReminderDialog = true">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                                创建提醒
                            </el-button>
                        </div>
                        <el-empty v-if="myReminders.length === 0" description="暂无提醒">
                            <el-button type="primary" @click="showReminderDialog = true">创建第一个提醒</el-button>
                        </el-empty>
                        <div v-else class="reminder-list">
                            <el-card v-for="reminder in myReminders" :key="reminder.id" class="reminder-item">
                                <div class="reminder-info">
                                    <h4>{{ reminder.title }}</h4>
                                    <p class="reminder-meta">
                                        <span>{{ reminder.type }}</span>
                                        <span>{{ formatDate(reminder.reminder_time) }}</span>
                                    </p>
                                </div>
                                <el-tag :type="reminder.status === '已发送' ? 'success' : 'warning'">
                                    {{ reminder.status }}
                                </el-tag>
                            </el-card>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <SettingDialog v-model="dialogVisible" :title="dialogConfig.title" :fields="dialogConfig.fields"
        :initial-value="dialogConfig.initialValue" :rules="dialogConfig.rules" @confirm="handleConfirm">
    </SettingDialog>

    <el-dialog v-model="showReminderDialog" title="创建提醒" width="600px" destroy-on-close>
        <Reminder :trip-id="null" />
    </el-dialog>
</template>

<script setup>
import { Plus, Close, Location, Edit, Star } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/UserStore'

import { changeName, changeSex, changeEmail, changePassword, bindAccount } from '@/api/userinfo'
import { getTravelLogList } from '@/api/travellog'
import { getReminderList } from '@/api/reminder'

import SettingDialog from '@/views/User/components/dialog/index.vue'
import Reminder from '@/components/Reminder/index.vue'

const userStore = useUserStore()

const router = useRouter()

const activeName = ref('first')
const isMobile = ref(false)
const myLogs = ref([])
const myReminders = ref([])
const showReminderDialog = ref(false)

const dialogVisible = ref(false);
const dialogConfig = reactive({
    title: '',
    fields: [],
    initialValue: {},
    rules: {}
})

const openSet = (type) => {
    switch (type) {
        case 'name':
            dialogConfig.title = '修改姓名';
            dialogConfig.fields = [
                { key: 'oldName', label: '旧名称', type: 'input', placeholder: '' },
                { key: 'newName', label: '新名称', type: 'input', placeholder: '请输入新姓名' }
            ];
            dialogConfig.initialValue = { oldName: userStore.name, newName: '' };
            dialogConfig.rules = {
                newName: [{ required: true, message: '请输入新姓名', trigger: 'blur' }]
            };
            break;

        case 'gender':
            dialogConfig.title = '修改性别';
            dialogConfig.fields = [
                {
                    key: 'oldGender',
                    label: '旧性别',
                    type: 'select',
                    options: [{ label: '男', value: '男' }, { label: '女', value: '女' }]
                },
                {
                    key: 'newGender',
                    label: '新性别',
                    type: 'select',
                    placeholder: '请选择新性别',
                    options: [{ label: '男', value: '男' }, { label: '女', value: '女' }]
                }
            ];
            dialogConfig.initialValue = { oldGender: userStore.sex, newGender: '' };
            dialogConfig.rules = {
                newGender: [{ required: true, message: '请选择新性别', trigger: 'change' }]
            };
            break;

        case 'email':
            dialogConfig.title = '修改邮箱';
            dialogConfig.fields = [
                { key: 'oldEmail', label: '旧邮箱', type: 'input', placeholder: '' },
                { key: 'newEmail', label: '新邮箱', type: 'input', placeholder: '请输入新邮箱' }
            ];
            dialogConfig.initialValue = { oldEmail: userStore.email, newEmail: '' };
            dialogConfig.rules = {
                newEmail: [{ required: true, message: '请输入新邮箱', trigger: 'blur' }]
            };
            break;

        case 'password':
            dialogConfig.title = '修改密码';
            dialogConfig.fields = [
                { key: 'oldPassword', label: '旧密码', type: 'input', placeholder: '请输入旧密码' },
                { key: 'newPassword', label: '新密码', type: 'input', placeholder: '请输入新密码' }
            ];
            dialogConfig.initialValue = { oldPassword: '', newPassword: '' };
            dialogConfig.rules = {
                oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
                newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
            };
            break;
    }
    dialogVisible.value = true;
}

const handleConfirm = async (data) => {
    console.log('修改后的数据：', data);
    const id = localStorage.getItem('id')
    const { newName, newEmail, newGender, newPassword } = data
    if (newName) {
        const res = await changeName(id, newName)
        if (res.status == 0) {
            userStore.name = newName
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '修改失败',
                type: 'error',
            })
        }
    } else if (newGender) {
        const res = await changeSex(id, newGender)
        if (res.status == 0) {
            userStore.sex = newGender
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '修改失败',
                type: 'error',
            })
        }
    } else if (newEmail) {
        const res = await changeEmail(id, newEmail)
        if (res.status == 0) {
            userStore.email = newEmail
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '修改失败',
                type: 'error',
            })
        }
    } else if (newPassword) {
        const res = await changePassword(id, newPassword)
        if (res.status === 0) {
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        } else {
            ElMessage({
                message: '修改失败',
                type: 'error',
            })
        }
    }
};

//? why 2
const handleCancel = () => {
    console.log('取消修改');
};


const goToHome = () => {
    router.push('/home')
}

const GoToPages = (path) => {
    router.push(path)
}

const viewLog = (id) => {
    router.push(`/travel-log/list?log_id=${id}`)
}

const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('zh-CN')
}

const loadMyLogs = async () => {
    if (!userStore.id) {
        return
    }

    try {
        const res = await getTravelLogList()
        if (res && res.data && res.data.status === 0) {
            myLogs.value = res.data.data.logs.slice(0, 5) || []
        } else {
            myLogs.value = []
        }
    } catch (error) {
        console.error('加载游记失败:', error)
        myLogs.value = []
    }
}

const loadMyReminders = async () => {
    if (!userStore.id) {
        return
    }

    try {
        const res = await getReminderList({ user_id: userStore.id })
        if (res && res.data && res.data.status === 0) {
            myReminders.value = res.data.data.reminders.slice(0, 5) || []
        } else {
            myReminders.value = []
        }
    } catch (error) {
        console.error('加载提醒失败:', error)
        myReminders.value = []
    }
}

const checkScreenSize = () => {
    isMobile.value = window.innerWidth <= 767
}

const avatarUrl = ref(`${import.meta.env.VITE_API_BASEURL}/user/uploadAvatar`)
const handleAvatarSuccess = (response) => {
    if (response.status == 0) {
        userStore.$patch({
            imageUrl: response.url
        })
        ElMessage({
            message: '更新头像成功',
            type: 'success',
        });
        (async () => {
            const res = await bindAccount(userStore.account, response.onlyId, response.url)
        })()
    } else {
        ElMessage.error('更新头像失败！请重新上传')
    }
}
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像图片必须是 JPG 格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过 2MB!')
        return false
    }
    return true
}

onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    loadMyLogs()
    loadMyReminders()
})
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
    display: block;
    object-fit: contain;
    width: 100%;
    height: 100%;
}

//公共
.User-center {
    height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg,
            #b0e0e6 0%,
            #80deea 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    .User-center-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        position: relative;

        .close-btn {
            position: absolute;
            top: 12px;
            right: 15px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;

            .el-icon {
                font-size: 20px;
                color: #606266;

                &:hover {
                    color: orange;
                }
            }

            &:hover {
                background: rgba(0, 0, 0, 0.15);
                transform: scale(1.2);
            }
        }

        .tabs {
            height: 100%;

            :deep(.el-tabs__header) {
                margin-bottom: 0;

                .el-tabs__nav {
                    display: flex;
                    width: 100%;

                    .el-tabs__item {
                        flex: 1;
                        text-align: center;
                        justify-content: center;
                    }
                }
            }

            :deep(.el-tabs__content) {
                padding: 20px;
                height: calc(100% - 40px);
                overflow-y: auto;
            }

            .account-info-wrapped {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding: 10px 0;

                span {
                    width: 100px;
                    font-weight: 500;
                    color: rgb(81, 100, 115);
                }

                .account-info-content {
                    flex: 1;
                    display: flex;
                    align-items: center;

                    .avatar-uploader {
                        width: 80px;
                        height: 80px;
                        overflow: hidden;
                        border: 1px dashed #d9d9d9;
                        border-radius: 20px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #f5f7fa;

                        &:hover {
                            border-color: #409eff;
                        }

                        .el-icon {
                            font-size: 24px;
                            color: #8c939d;
                        }
                    }
                }

                .account-save-button {
                    margin-left: 15px;

                    .el-button {
                        color: #fff;

                        &:hover {
                            color: black;
                        }

                    }
                }
            }

            .quick-actions {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ebeef5;

                .action-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
            }

            .travel-log-section,
            .reminder-section {
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;

                    h3 {
                        margin: 0;
                        font-size: 18px;
                        color: #303133;
                    }
                }

                .log-list,
                .reminder-list {

                    .log-item,
                    .reminder-item {
                        margin-bottom: 12px;
                        cursor: pointer;
                        transition: all 0.3s;

                        &:hover {
                            transform: translateX(5px);
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        }

                        :deep(.el-card__body) {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 16px;
                        }

                        .log-info,
                        .reminder-info {
                            flex: 1;

                            h4 {
                                margin: 0 0 8px 0;
                                font-size: 16px;
                                color: #303133;
                            }

                            .log-meta,
                            .reminder-meta {
                                margin: 0;
                                font-size: 14px;
                                color: #909399;

                                span {
                                    margin-right: 12px;
                                }
                            }
                        }

                        .log-stats {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: #909399;
                            font-size: 14px;

                            .el-icon {
                                color: #f56c6c;
                            }
                        }
                    }
                }

                .view-all-btn {
                    width: 100%;
                    margin-top: 12px;
                }
            }
        }

        .mobile-tabs {
            :deep(.el-tabs__header) {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                z-index: 1000;
                margin: 0;
                padding: 0 10px;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            }

            :deep(.el-tabs__nav-wrap) {
                &::after {
                    display: none;
                }
            }

            :deep(.el-tabs__nav) {
                display: flex;
                width: 100%;
                justify-content: space-around;
            }

            :deep(.el-tabs__item) {
                flex: 1;
                text-align: center;
                padding: 12px 0;
            }

            :deep(.el-tabs__content) {
                padding-bottom: 60px;
                /* 为底部标签栏留出空间 */
                height: calc(100vh - 60px);
            }
        }
    }
}

//手机
@media (max-width: 767px) {
    .User-center {
        .User-center-wrapper {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            background: rgba(255, 255, 255, 0.98);

            .close-btn {
                top: 10px;
                right: 10px;
                width: 36px;
                height: 36px;

                .el-icon {
                    font-size: 18px;
                }
            }

            .tabs {
                :deep(.el-tabs__content) {
                    padding: 15px;
                }

                .account-info-wrapped {
                    flex-direction: column;
                    align-items: flex-start;
                    margin-bottom: 15px;

                    span {
                        width: 100%;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }

                    .account-info-content {
                        width: 100%;
                        margin-bottom: 8px;
                    }

                    .account-save-button {
                        display: flex;
                        margin-left: 0;
                        width: 100%;
                        justify-content: center;

                        .el-button {
                            width: 50%;
                            margin-top: 5px;
                            background-color: #b0e0e6;
                            border-radius: 20px;
                        }
                    }
                }
            }
        }
    }
}

//平板
@media (min-width: 768px) and (max-width: 1024px) {
    .User-center {
        .User-center-wrapper {
            width: 85vw;
            height: 85vh;
            max-width: 800px;

            .tabs {
                :deep(.el-tabs__content) {
                    padding: 25px;
                }

                .account-info-wrapped {
                    margin-bottom: 25px;

                    span {
                        width: 120px;
                        font-size: 16px;
                    }

                    .account-save-button {
                        .el-button {
                            background-color: #b0e0e6;
                            border-radius: 20px;
                        }
                    }
                }
            }
        }
    }
}

//桌面
@media (min-width: 1024px) {
    .User-center {
        .User-center-wrapper {
            width: 70vw;
            height: 85vh;
            max-width: 1000px;

            .tabs {
                :deep(.el-tabs__content) {
                    padding: 30px;
                }

                .account-info-wrapped {
                    margin-bottom: 25px;

                    span {
                        width: 120px;
                        font-size: 16px;
                    }

                    .account-save-button {
                        .el-button {
                            background-color: #b0e0e6;
                            border-radius: 20px;
                        }
                    }

                    .account-info-content {
                        .avatar-uploader {
                            .avatar-uploader-trigger {
                                transition: all 0.3s ease;

                                &:hover {
                                    transform: scale(1.05);
                                    border-color: #409eff;
                                }
                            }
                        }
                    }

                    .account-save-button {
                        .el-button {
                            transition: all 0.3s ease;

                            &:hover {
                                transform: translateY(-2px);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
}
</style>