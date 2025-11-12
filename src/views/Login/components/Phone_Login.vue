<template>
    <el-dialog v-model="dialogPhoneVisible" title="手机验证码登录" class="Phone-dialog" align-center>
        <el-form :model="PhoneForm" class="Phone-form">
            <el-form-item class="userPhone form-item" prop="PhoneNumber">
                <el-input class="input-item" v-model="PhoneForm.PhoneNumber" placeholder="输入手机号">
                    <template #prefix>
                        <el-icon>
                            <Phone />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="userCode form-item" prop="Code">
                <el-input class="input-item" v-model="PhoneForm.Code" placeholder="输入验证码">
                    <template #prefix>
                        <el-icon>
                            <Cherry />
                        </el-icon>
                    </template>
                    <template #suffix>
                        <el-button>接收验证码</el-button>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialogPhoneVisible = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="GoLogin" class="Login-btn">登录</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { Phone, Cherry } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';

const PhoneForm = reactive({
    PhoneNumber: '',
    Code: ''
})

const GoLogin = () => {
    dialogPhoneVisible.value = false
}

const dialogPhoneVisible = ref(false)
const openDialog = () => {
    dialogPhoneVisible.value = true
}
defineExpose({
    openDialog
})

</script>

<style lang="scss" scoped>
.Phone-form {
    .form-item {
        margin-bottom: 25px;

        .input-item {
            width: 100%;

            :deep(.el-input__wrapper) {
                border-radius: 25px;
                padding: 0 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;

                &:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                &.is-focus {
                    box-shadow: 0 4px 12px rgba(59, 72, 89, 0.3);
                }

                .el-input__inner {
                    padding: 0 10px;
                }

                .el-icon {
                    color: rgb(59, 72, 89);
                }
            }
        }
    }

    // 验证码按钮样式
    .userCode {
        :deep(.el-input__suffix) {
            .code-btn {
                border: none;
                background: transparent;
                color: rgb(59, 72, 89);
                font-size: 14px;
                padding: 0 10px;
                height: 28px;
                line-height: 28px;

                &:hover {
                    color: rgb(29, 67, 89);
                    background: rgba(59, 72, 89, 0.1);
                    border-radius: 14px;
                }

                &:active {
                    background: rgba(59, 72, 89, 0.2);
                }
            }
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: center;

    :deep(.el-button) {
        flex: 1;
    }

    .cancel-btn {
        border-radius: 25px;
        padding: 12px 30px;
        font-size: 16px;
        color: rgb(81, 100, 115);
        border: 1px solid rgb(81, 100, 115);
        background: transparent;

        &:hover {
            background-color: rgba(81, 100, 115, 0.1);
        }
    }

    .Login-btn {
        border-radius: 25px;
        padding: 12px 60px;
        font-size: 16px;
        background: linear-gradient(135deg, rgb(59, 72, 89) 0%, rgb(29, 67, 89) 100%);
        border: none;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 72, 89, 0.4);
        }
    }
}

// 手机端样式
@media (max-width: 767px) {
    .Phone-form {
        .form-item {
            margin-bottom: 20px;

            .input-item {
                :deep(.el-input__wrapper) {
                    height: 48px;

                    .el-input__inner {
                        font-size: 16px; // 防止iOS缩放
                    }
                }
            }
        }

        // 验证码按钮在手机端的调整
        .userCode {
            :deep(.el-input__suffix) {
                .code-btn {
                    font-size: 12px;
                    padding: 0 8px;
                    white-space: nowrap;
                }
            }
        }
    }

    .dialog-footer {

        .cancel-btn,
        .Login-btn {
            width: 50%;
            padding: 14px 30px;
            font-size: 16px;
        }
    }
}

// 平板端样式
@media (min-width: 768px) and (max-width: 1024px) {
    .Phone-form {
        .form-item {
            .input-item {
                :deep(.el-input__wrapper) {
                    height: 48px;
                }
            }
        }
    }

    .dialog-footer {

        .cancel-btn,
        .Login-btn {
            width: 50%;
            padding: 14px 30px;
            font-size: 16px;
        }
    }
}

// 桌面端样式
@media (min-width: 1024px) {
    .Phone-form {
        .form-item {
            .input-item {
                :deep(.el-input__wrapper) {
                    height: 50px;
                }
            }
        }
    }

    .dialog-footer {

        .cancel-btn,
        .Login-btn {
            width: 50%;
            padding: 14px 30px;
            font-size: 16px;
        }
    }
}
</style>

<!-- 全局样式，不受 scoped 限制 -->
<style lang="scss">
.Phone-dialog {
    border-radius: 20px;
    overflow: hidden;

    .el-dialog__header {
        margin: 0;
        padding: 20px 20px 10px;
        text-align: center;

        .el-dialog__title {
            color: black;
            font-size: 24px;
            font-weight: 500;
        }

        .el-dialog__headerbtn {
            top: 20px;
            right: 20px;

            .el-dialog__close {
                color: black;
                font-size: 20px;

                &:hover {
                    color: orange;
                }
            }
        }
    }

    .el-dialog__body {
        padding: 30px 40px 20px;
    }

    .el-dialog__footer {
        padding: 10px 40px 30px;
        border-top: 1px solid #eaeaea;
    }
}

/* 手机端样式 */
@media (max-width: 767px) {
    .Phone-dialog {
        width: 90% !important;
        max-width: 400px;

        .el-dialog__header {
            padding: 15px 15px 5px;

            .el-dialog__title {
                font-size: 20px;
            }
        }

        .el-dialog__body {
            padding: 20px 25px 10px;
        }

        .el-dialog__footer {
            padding: 5px 25px 20px;
        }
    }
}

/* 平板端样式 */
@media (min-width: 768px) and (max-width: 1024px) {
    .Phone-dialog {
        width: 70% !important;
        max-width: 500px;

        .el-dialog__header {
            .el-dialog__title {
                font-size: 22px;
            }
        }

        .el-dialog__body {
            padding: 25px 35px 15px;
        }

        .el-dialog__footer {
            padding: 10px 35px 25px;
        }
    }
}

/* 桌面端样式 */
@media (min-width: 1024px) {
    .Phone-dialog {
        width: 30% !important;
        max-width: 450px;
        min-width: 400px;

        .el-dialog__header {
            .el-dialog__title {
                font-size: 24px;
            }
        }
    }
}
</style>