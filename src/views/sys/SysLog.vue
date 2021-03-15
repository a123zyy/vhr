<template>
    <div class="page-style">
        <p style="font-size: 14px;width: 100%">{{this.$route.meta.title}}</p>
        <div style="margin: 30px 30px 0px 30px">
            <p style="font-size: 20px;font-weight: bold;margin-bottom: 10px">{{this.$route.meta.title}}</p>
            <el-table
                    :data="OplogList"
                    stripe
                    border
                    element-loading-text="正在加载..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">

                <el-table-column
                        prop="id"
                        label="id">
                </el-table-column>
                <el-table-column
                        prop="hrid"
                        label="操作人id">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作内容">
                </el-table-column>
                <el-table-column
                        prop="adddate"
                        label="时间">
                </el-table-column>

            </el-table>
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        :page-size="this.OplogInfo.pageSize"
                        :pager-count="this.OplogInfo.pageNo"
                        @current-change="pageChangePage"
                        @size-change="pageSizeChangePage"
                        layout="sizes, prev, pager, next, jumper"
                        :total="pageTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import client from "../../modules/client";
    export default {
        name: "SysLog",
        data(){
            return{
                //上传图片 end
                OplogInfo:{
                    pageNo:1,
                    pageSize:20
                },
                //暂时存储单条数据
                helperDialogData: {},
                helperDialogDataType: 'add',
                helperDialogShow: false,
                //暂时存储单条数据 end
                pageTotal:0,
                page_size_opts: [10, 30, 50, 100],
                tabIsLoading: false,
                OplogList:[],
                paramerValue:'',
                paramerKey:'nickName'
            }
        },
        methods:{
            getOplogs(row){
                this.OplogInfo.pageNo =row
                client.get("/system/basic/oplog/?pageNo="+row+"&pageSize="+this.OplogInfo.pageSize).then((data)=>{
                    console.log(data.data)
                    this.OplogList = data.data.list
                    this.pageTotal = data.data.total
                    this.tabIsLoading = false
                }).catch((error)=>{
                    console.log(error)
                    this.$message.error("请求失败,请查看日志！")
                })
            },
            pageChangePage(num) {//页码改变的回调，返回改变后的页码
                this.getOplogs(num)
            },
            pageSizeChangePage(num) {
                this.OplogInfo.pageSize = num
                this.getOplogs(this.OplogInfo.pageNo)
            },
            //上传图片需要的方法 end
        },
        mounted() {
            this.getOplogs(0);
        }
    }
</script>

<style scoped>

</style>
