<template>
    <div class="box">
        <div class="content">
            <div class="login-wrapper">
                <h1>登录</h1>
                <div class="login-container">
                    <el-form :model="loginForm" class="login-form">
                        <el-form-item class="username form-item" prop="account">
                            <el-input class="input-item" v-model="loginForm.account" placeholder="使用邮箱或者手机号" />
                        </el-form-item>
                        <el-form-item class="password form-item" prop="password">
                            <el-input class="input-item" v-model="loginForm.password" placeholder="使用邮箱或者手机号" />
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
                    <el-button class="other-login-item">
                        <img src="@/assets/images/Phone.png" alt="手机登录">
                    </el-button>
                    <el-button class="other-login-item">
                        <img src="@/assets/images/WeChat.png" alt="微信登录">
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/MusicStore';

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
</script>

<style lang="scss" scoped>
.box {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(29, 67, 89);


    .content {
        width: 1200px;
        height: 650px;
        align-items: center;
        justify-content: center;
        background-image: url('@/assets/images/login_pc.jpg');
        background-size: cover;

        .login-wrapper {
            height: 100%;
            width: 100%;

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

                .other-login-item {
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    padding: 10px;
                }

                .other-login-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
}
</style>