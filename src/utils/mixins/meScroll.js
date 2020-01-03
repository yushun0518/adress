export default {
  data() {
    return {
      page: 1,
      size: 10,
      pageCount: 1,
      loading: false,
      finished: false,
      isLoading: false,
      finishedText: '没有更多了'
    }
  },

  methods: {
    loadMore() {
      
      // 异步更新数据
      setTimeout(() => {
        if(this.finished){
          return
        }
        this.page++
        this.scrollList(true)
      }, 1000);
    },

    onRefresh() {
      setTimeout(() => {
        this.page = 1
        this.scrollList()
        this.isLoading = false;
      }, 1000)
    }
  }
}