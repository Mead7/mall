import { debounce } from "./utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
    data() {
        return {
            itemImgListener: null
        }
    },
    mounted() {
        let refresh = debounce(this.$refs.scroll.refresh, 100);
        this.itemImageLoad = () => {
            refresh();
        };
        this.$bus.$on('itemImageLoad', this.itemImageLoad);
    }
}

// 点击返回顶部按钮抽取
export const backTopMinxin = {
    components: {
        BackTop
    },
    data() {
        return {
            isShowBackTop: false
        }
    },
    methods: {
        backClick() {
            this.$refs.scroll.scrollTo(0, 0)
        },
    }
}