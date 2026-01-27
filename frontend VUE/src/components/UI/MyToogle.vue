<script>
export default{
    name: "MyToogle",

    props: {
        isActive: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        toggle() {
            this.$emit('update:isActive', !this.isActive);
        }
    },

    computed: {
        isActive() {
            return this.isActive;
        }
    }
}
</script>

<template>
    <button
        class="text-left hover:underline"
        @click="toggle"
    >
        <span>{{ isActive ? '[■]' : '[ ]' }}</span>
        <slot></slot>
    </button>
</template>