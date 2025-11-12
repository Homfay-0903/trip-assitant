<template>
    <el-dialog v-model="dialogRegisterVisible" title="注册账号" class="register-dialog" align-center>
        <el-form :model="RegisterForm" class="Register-form">
            <el-form-item class="username form-item" prop="account">
                <el-input class="input-item" v-model="RegisterForm.account" placeholder="使用邮箱或者手机号">
                    <template #prefix>
                        <el-icon>
                            <User />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="password form-item" prop="password">
                <el-input class="input-item" v-model="RegisterForm.password" placeholder="请输入密码" type="password">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="password form-item" prop="confirmPassword">
                <el-input class="input-item" v-model="RegisterForm.confirmPassword" placeholder="再次输入密码"
                    type="password">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogRegisterVisible = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="GoRegister" class="register-btn">注册</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue'

const RegisterForm = reactive({
    account: '',
    password: '',
    confirmPassword: ''
})

const dialogRegisterVisible = ref(false)
const openDialog = () => {
    dialogRegisterVisible.value = true
}

const GoRegister = () => {
    console.log('注册信息:', RegisterForm)
    // 注册成功后可以关闭对话框
    dialogRegisterVisible.value = false
}

defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped>
.Register-form {
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
}

.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 20px;

    :deep(.el-button) {
        margin-left: 0;
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

    .register-btn {
        border-radius: 25px;
        padding: 12px 30px;
        margin-left: 0;
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
    .Register-form {
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
    }

    .dialog-footer {
        gap: 10px;

        .cancel-btn,
        .register-btn {
            width: 50%;
            padding: 14px 30px;
            font-size: 16px;
        }
    }
}

// 平板端样式
@media (min-width: 768px) and (max-width: 1024px) {
    .Register-form {
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
        .register-btn {
            padding: 12px 35px;
        }
    }
}

// 桌面端样式
@media (min-width: 1024px) {
    .Register-form {
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
        .register-btn {
            padding: 12px 40px;
            font-size: 16px;
        }
    }
}
</style>

<style lang="scss">
.register-dialog {
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
    .register-dialog {
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
    .register-dialog {
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
    .register-dialog {
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