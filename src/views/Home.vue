<template>
    <my-page title="首页">
        <div class="editor">
            <ui-appbar class="appbar" title="这是标题"></ui-appbar>
            <div class="body">
                <div>
                    <ui-text-field class="text-field" v-model="input" :label="textFieldLabel" />
                </div>
                <ui-raised-button primary :label="buttonLabel" @click="click" />
                <div class="result" v-if="result">
                    {{ result }}
                </div>
            </div>
        </div>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                input: '',
                result: '1',
                textFieldLabel: '标签',
                buttonLabel: '呵呵',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            to: '/help'
                        }
                    ]
                }
            }
        },
        methods: {
            click() {
                alert(1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .editor {
        position: relative;
        width: 400px;
        height: 500px;
        border: 1px solid #999;
        .body {
            padding: 16px;
        }
        .text-field {

        }
        .appbar {
            /*margin-bottom: 16px;*/
        }
        .result {
            margin-top: 16px;
        }
    }
</style>
