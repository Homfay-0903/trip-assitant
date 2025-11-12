<template>
    <el-dialog v-model="dialogWeChatVisible" title="微信扫码登录" class="WeChat-dialog" align-center>
        <div class="qrcode-container">
            <div class="qrcode">
                <div class="qrcode-placeholder">
                    <p class="placeholder-text">微信二维码将显示在这里</p>
                </div>
            </div>
            <div class="instructions">
                <p class="instruction-text">打开手机微信扫一扫</p>
                <p class="instruction-text">扫描二维码登录</p>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';

const dialogWeChatVisible = ref(false)
const openDialog = () => {
    dialogWeChatVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped>
.qrcode-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;

    .qrcode {
        width: 250px;
        height: 250px;
        background-color: #f5f5f5;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        border: 1px solid #e0e0e0;

        .qrcode-placeholder {
            text-align: center;

            .wechat-icon {
                margin-bottom: 15px;
                display: flex;
                justify-content: center;
            }

            .placeholder-text {
                color: #999;
                font-size: 14px;
                margin: 0;
            }
        }
    }

    .instructions {
        text-align: center;

        .instruction-text {
            margin: 5px 0;
            color: #666;
            font-size: 15px;
        }
    }
}

// 手机端样式
@media (max-width: 767px) {
    .qrcode-container {
        padding: 15px 0;

        .qrcode {
            width: 200px;
            height: 200px;
            margin-bottom: 15px;

            .qrcode-placeholder {
                .wechat-icon svg {
                    width: 60px;
                    height: 60px;
                }

                .placeholder-text {
                    font-size: 12px;
                }
            }
        }

        .instructions {
            .instruction-text {
                font-size: 14px;
            }
        }
    }
}

// 平板端样式
@media (min-width: 768px) and (max-width: 1024px) {
    .qrcode-container {
        .qrcode {
            width: 220px;
            height: 220px;
        }
    }
}

// 桌面端样式
@media (min-width: 1024px) {
    .qrcode-container {
        .qrcode {
            width: 250px;
            height: 250px;
        }
    }
}
</style>

<!-- 全局样式，不受 scoped 限制 -->
<style lang="scss">
.WeChat-dialog {
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
        padding: 20px 40px 30px;
    }

    .el-dialog__footer {
        padding: 0;
        border-top: none;
    }
}

/* 手机端样式 */
@media (max-width: 767px) {
    .WeChat-dialog {
        width: 90% !important;
        max-width: 320px;
        margin: 0 auto;

        .el-dialog__header {
            padding: 15px 15px 5px;

            .el-dialog__title {
                font-size: 20px;
            }
        }

        .el-dialog__body {
            padding: 15px 25px 20px;
        }
    }
}

/* 平板端样式 */
@media (min-width: 768px) and (max-width: 1024px) {
    .WeChat-dialog {
        width: 70% !important;
        max-width: 400px;

        .el-dialog__header {
            .el-dialog__title {
                font-size: 22px;
            }
        }

        .el-dialog__body {
            padding: 20px 35px 25px;
        }
    }
}

/* 桌面端样式 */
@media (min-width: 1024px) {
    .WeChat-dialog {
        width: 30% !important;
        max-width: 450px;
        min-width: 350px;

        .el-dialog__header {
            .el-dialog__title {
                font-size: 24px;
            }
        }
    }
}
</style>