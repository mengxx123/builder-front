<template>
    <ui-raised-button class="btn" slot="right" :label="label" ref="button"
                    @mouseenter.native="mouseenter"
                    @click="toggle">
        <ui-popover :trigger="trigger"
                    :open="open"
                    @mouseenter.native="mouseenter"
                    @mouseleave.native="mouseleave"
                    @show="show"
                    @hide="hide"
                    :anchorOrigin="{vertical: 'bottom', horizontal: 'left'}"
                    :targetOrigin="{vertical: 'top', horizontal: 'left'}"
                    @close="handleClose" >
            <slot ></slot>
        </ui-popover>
    </ui-raised-button>
</template>

<script>
    export default {
        data() {
            return {
                open: false,
                trigger: null,
                in: false
            }
        },
        props: {
            label: {
                type: String,
                default: ''
            }
        },
        mounted() {
            this.trigger = this.$refs.button.$el
        },
        methods: {
            mouseenter() {
//                this.open = true
//                this.in = true
//                console.log('进去')
            },
            mouseleave() {
//                console.log('chulai')
//                this.in = false
//                setTimeout(() => {
//                    if (!this.in) {
//                        this.open = false
//                    }
//                }, 1000)
            },
            show() {
                this.open = true
                this.in = true
            },
            hide() {
                this.in = false
                setTimeout(() => {
                    if (!this.in) {
                        this.open = false
                    }
                }, 1000)
            },
            toggle () {
                this.open = !this.open
            },
            handleClose (e) {
                this.open = false
            }
        }
    }
</script>
