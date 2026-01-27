<script>
export default{
    name: "MyModal",

    props:{
        show: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<template>

    <div 
        v-if="show"
        class="left-0 top-0 w-full h-full
        bg-gray-500 bg-opacity-50 fixed flex"
    >

        <div class="m-auto">
            <slot></slot>
        </div>

    </div>

</template>