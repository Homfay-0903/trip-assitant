<template>
    <div class="box">
        <div class="content">
            <div class="login-wrapper">
                <h1>登录</h1>
                <div class="login-container">
                    <el-form :model="loginForm" class="login-form">
                        <el-form-item class="username form-item" prop="account">
                            <el-input class="input-item" v-model="loginForm.account" placeholder="使用邮箱或者手机号">
                                <template #prefix>
                                    <el-icon>
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="password form-item" prop="password">
                            <el-input class="input-item" v-model="loginForm.password" placeholder="密码">
                                <template #prefix>
                                    <el-icon>
                                        <Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <el-button class="login-btn" @click="Login">登 录</el-button>
                </div>
                <div class="divider">
                    <span class="line"></span>
                    <span class="divider-text">其他方式登录</span>
                    <span class="line"></span>
                </div>
                <div class="other-login-wrapper">
                    <el-button class="other-login-item" @click="showPhoneDialog">
                        <img src="@/assets/images/Phone.png" alt="手机登录">
                    </el-button>
                    <el-button class="other-login-item" @click="showWeChatDialog">
                        <img src="@/assets/images/WeChat.png" alt="微信登录">
                    </el-button>
                </div>
                <div class="register-tip">
                    <span>还没有账号？</span>
                    <span class="register-link" @click="showRegisterDialog">去注册</span>
                </div>
            </div>
        </div>
    </div>
    <Register_Dialog ref="Register"></Register_Dialog>
    <Phone_LoginDialog ref="Phone"></Phone_LoginDialog>
    <WeChat_LoginDialog ref="WeChat"></WeChat_LoginDialog>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/MusicStore';

import Phone_LoginDialog from './components/Phone_Login.vue';
import WeChat_LoginDialog from './components/WeChat_Login.vue';
import Register_Dialog from '@/views/Register/index.vue'

const MusicStore = useMusicStore()

const router = useRouter()

const loginForm = reactive({
    account: '',
    password: ''
})

const Login = () => {
    router.push('/home')
    MusicStore.playAfterInteraction()
}

const Register = ref()
const showRegisterDialog = () => {
    Register.value.openDialog()
}
const Phone = ref()
const showPhoneDialog = () => {
    Phone.value.openDialog()
}
const WeChat = ref()
const showWeChatDialog = () => {
    WeChat.value.openDialog()
}
</script>

<style lang="scss" scoped>
.box {
    height: 100vh;
    width: 100vw;
    background-color: rgb(29, 67, 89);


    .content {
        .login-wrapper {
            h1 {
                text-align: center;
            }

            .login-container {
                .login-form {
                    .form-item {
                        margin: 20px 0;

                        .input-item {
                            width: 100%;
                        }
                    }
                }

                .login-btn {
                    border-radius: 40px;
                    width: 100%;
                    font-weight: 300;
                    margin-top: 10px;
                }
            }

            .divider {
                width: 100%;
                margin: 20px 0;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;

                span:nth-child(1) {
                    flex: 1;
                }

                span:nth-child(3) {
                    flex: 1;
                }

                .line {
                    display: inline-block;
                    max-width: 30%;
                    width: 30%;
                }

                .divider-text {
                    vertical-align: middle;
                    margin: 0px 20px;
                    line-height: 0px;
                    display: inline-block;
                    width: 100px;
                }
            }

            .other-login-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;

            }

            .register-tip {
                text-align: center;
                margin-top: 20px;
                font-size: 14px;

                .register-link {
                    color: #409EFF;
                    cursor: pointer;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}

//手机
@media (max-width: 767px) {
    .box {
        .content {
            height: 100vh;
            width: 100vw;
            background-image: url('@/assets/images/login_phone.png');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;

            .login-wrapper {
                width: 70%;
                max-width: 400px;

                h1 {
                    font-size: 32px;
                    color: #fff;
                    margin-bottom: 35px;
                }

                .login-container {
                    .login-form {
                        .form-item {
                            margin: 18px 0;

                            .input-item {
                                height: 48px;

                                :deep(.el-input__wrapper) {
                                    border-radius: 25px;
                                    padding: 0 20px;
                                }
                            }
                        }
                    }

                    .login-btn {
                        height: 48px;
                        font-size: 18px;
                        margin-top: 15px;
                        width: 50%;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }
                }

                .divider {
                    margin: 30px 0;

                    .line {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.6);
                    }

                    .divider-text {
                        color: #fff;
                        font-size: 14px;
                    }
                }

                .other-login-item {
                    width: 55px;
                    height: 55px;
                    border-radius: 18px;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}

//平板
@media (min-width: 768px) and (max-width: 1024px) {
    .box {
        background-color: rgb(29, 67, 89);

        .content {
            width: 90vw;
            height: 90vh;
            max-width: 1000px;
            background-image: url('@/assets/images/login_pc.jpg');
            background-size: cover;
            background-position: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 20px;

            .login-wrapper {
                width: 35vw;
                min-width: 320px;
                max-width: 400px;
                position: absolute;
                right: 8%;
                top: 50%;
                transform: translateY(-50%);

                h1 {
                    text-align: center;
                    font-size: 40px;
                    color: rgb(81, 100, 115);
                    margin-bottom: 35px;
                }

                .login-container {
                    .login-form {
                        .form-item {
                            margin: 18px 0;

                            .input-item {
                                height: 48px;

                                :deep(.el-input__wrapper) {
                                    border-radius: 25px;
                                    padding: 0 20px;
                                }
                            }
                        }
                    }

                    .login-btn {
                        height: 50px;
                        font-size: 18px;
                        background-color: rgb(59, 72, 89);
                        color: white;
                        width: 50%;
                        display: block;
                        margin-left: auto;
                        margin-right: auto;

                        &:hover {
                            background-color: rgb(49, 62, 79);
                        }
                    }
                }

                .divider {
                    .line {
                        border-bottom: 1px solid rgb(94, 98, 101);
                    }
                }

                .other-login-item {
                    width: 55px;
                    height: 55px;
                    border-radius: 18px;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(5px);

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}

//桌面
@media (min-width: 1024px) {
    .box {
        .content {
            width: 85vw;
            height: 85vh;
            max-width: 1400px;
            background-image: url('@/assets/images/login_pc.jpg');
            background-size: cover;
            background-position: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 25px;

            .login-wrapper {
                width: 25vw;
                min-width: 350px;
                max-width: 450px;
                position: absolute;
                right: 10%;
                top: 50%;
                transform: translateY(-50%);

                h1 {
                    font-size: 45px;
                    color: rgb(81, 100, 115);
                    margin-bottom: 40px;
                }

                .login-container {
                    .login-form {
                        .form-item {
                            margin: 20px 0;

                            .input-item {
                                height: 50px;

                                :deep(.el-input__wrapper) {
                                    border-radius: 25px;
                                    padding: 0 20px;
                                }
                            }
                        }
                    }

                    .login-btn {
                        height: 52px;
                        font-size: 20px;
                        background-color: rgb(59, 72, 89);
                        color: white;
                        transition: all 0.3s ease;
                        width: 50%;
                        display: block;
                        margin: auto;

                        &:hover {
                            background-color: rgb(49, 62, 79);
                            transform: translateY(-2px);
                        }
                    }
                }

                .divider {
                    .line {
                        border-bottom: 1px solid rgb(94, 98, 101);
                    }

                    margin: 25px 0;
                }

                .other-login-item {
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    padding: 12px;
                    transition: all 0.3s ease;

                    &:hover {
                        transform: translateY(-2px);
                        background: rgba(255, 255, 255, 0.2);
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}
</style>