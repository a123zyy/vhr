<template>
    <div>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="id"
                    label="工号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="deptName"
                    label="部门"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="positionName"
                    label="职位"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="positionType"
                    label="职能"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="month"
                    label="在职月份"
                    width="180">
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                :pager-count="11"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
    </div>

</template>

<script>
    import client from "../../modules/client";
    export default {
        name: "EmpAdv",
        data () {
            return {
                tableData:[],
                total:0,
                pageSize:10,
                pageNum:0,
            }
        },
        mounted () {
            // 初始化
            this.getTable()
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val;
                this.getTable();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getTable();
            },
            getTable(){
                client.get('/employee/advanc/?pageSize='+this.pageSize+'&pageNum='+this.pageNum).then(data=>{
                    this.tableData = data.data.list;
                    this.total = data.data.total;
                }).catch(error=>{

                })
            }
        },
    }
</script>

<style scoped>

</style>
