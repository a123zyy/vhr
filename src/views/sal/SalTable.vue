<template>
    <div>
        <div style="height: 80px;margin-bottom: 10px;width: 100%">
            <el-button icon="el-icon-search" type="primary" @click="getTable" :disabled="showAdvanceSearchView">
                搜索
            </el-button>
<!--            <el-button icon="" type="primary" @click="showHelpDialog('add')" :disabled="showAdvanceSearchView">-->
<!--                新增-->
<!--            </el-button>-->
        </div>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="id"
                    label="id">
            </el-table-column>
            <el-table-column
                    prop="uid"
                    label="uid">
            </el-table-column>
            <el-table-column
                    prop="staffName"
                    label="用户名"
            >
            </el-table-column>
            <el-table-column
                    prop="salaryId"
                    label="参考账套"
            >
            </el-table-column>
            <el-table-column
                    prop="baseSalary"
                    label="基础工资"
            >
            </el-table-column>
            <el-table-column
                    prop="projectBonus"
                    label="项目奖金"
            >
            </el-table-column>
            <el-table-column
                    prop="jobsYearBonus"
                    label="工龄奖金"
            >
            </el-table-column>
            <el-table-column
                    prop="otherBonus"
                    label="其他奖金"
            >
            </el-table-column>
            <el-table-column
                    prop="positionBonus"
                    label="职能奖金"
            >
            </el-table-column>
            <el-table-column
                    prop="performanceBonus"
                    label="绩效奖金"
            >
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
            >
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="修改时间"
            >
            </el-table-column>
<!--            <el-table-column-->
<!--                    prop="status"-->
<!--                    label="当前状态"-->
<!--            >-->
<!--                <template slot-scope="scope">-->
<!--                    <div>{{scope.row.status==0?'未生效':(scope.row.status==1?'未生效':'已取消')}}</div>-->
<!--                </template>-->
<!--            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
        <el-dialog
                :title="helperDialogDataType == 'edit' ? '修改数据':'新增数据'"
                :visible.sync="helperDialogShow"
                width="30%">
            <el-form ref="form" :model="helperDialogData" label-width="80px">
                <el-form-item label="选择人员">
                    <el-select v-model="helperDialogData.uid" filterable remote :remote-method	="selectEmp" placeholder="请选择">
                        <el-option
                                :key="item.id"
                                v-for="item in emps"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="基础工资">
                    <el-input-number v-model="helperDialogData.baseSalary" :precision="2" :step="0.1" :max="9999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="项目奖金">
                    <el-input-number v-model="helperDialogData.projectBonus" :precision="2" :step="0.1" :max="9999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="工龄奖金">
                    <el-input-number v-model="helperDialogData.jobsYearBonus" :precision="2" :step="0.1" :max="9999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="其他奖金">
                    <el-input-number v-model="helperDialogData.otherBonus" :precision="2" :step="0.1" :max="9999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="职能奖金">
                    <el-input-number v-model="helperDialogData.positionBonus" :precision="2" :step="0.1" :max="9999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="绩效奖金">
                    <el-input-number v-model="helperDialogData.performanceBonus" :precision="2" :step="0.1" :max="9999" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">{{helperDialogDataType == 'edit' ?'修改':'新增'}}</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import client from "../../modules/client";

    export default {
        name: "SalTable",
        data() {
            return {
                empsInfos:{},
                emps:{},
                showAdvanceSearchView: false,
                helperDialogData:{},
                helperDialogDataType:'',
                helperDialogShow:false,
                tableData: [],
                total: 0,
                pageSize: 10,
                pageNum: 0,
                empsTotal:0
            }
        },
        methods: {
            handleEdit(index, row) {
                this.selectEmp(row.name)
                this.showHelpDialog(row,'edit');
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            selectEmp(row){
                const Employee = {
                    pageNo:0,
                    pageSize:10,
                    politicId:null,
                    nationId:null,
                    jobLevelId:null,
                    posId:null,
                    engageForm:null,
                    departmentId:null,
                    beginDateScope:null,
                    name:row
                }
                client.post('/employee/basic/',Employee).then(resp => {
                    if (resp) {
                        this.emps = resp.data.data;
                        console.log(this.emps)
                        this.empsTotal = resp.data.total;
                    }
                    this.empsInfos = {};
                });
            },
            onSubmit(){
                if (this.helperDialogData.uid == ''|| this.helperDialogData.uid == undefined){
                    return alert("员工id不能为空")
                }
                client.post(this.helperDialogDataType == 'edit'?'/wage/update':'/wage/add',this.helperDialogData).then(data => {
                    if (data.status == 200) {
                        this.helperDialogShow  = false;
                        this.pageNum = 0;
                        this.getTable();
                    } else {
                        alert("系统错误,"+data.toString())
                        this.helperDialogShow  = false;

                    }
                }).catch(error => {
                    alert("系统错误,"+error.toString())
                    this.helperDialogShow  = false;
                })
            },
            showHelpDialog(dataJson, type) {
                this.helperDialogDataType = type
                if (type == 'edit') {
                    this.helperDialogData = {
                        "id": dataJson.id,
                        "uid": dataJson.uid,
                        "salaryId": dataJson.salaryId,
                        "baseSalary": dataJson.baseSalary,
                        "projectBonus": dataJson.projectBonus,
                        "jobsYearBonus": dataJson.jobsYearBonus,
                        "otherBonus": dataJson.otherBonus,
                        "positionBonus":dataJson.positionBonus,
                        "performanceBonus":dataJson.performanceBonus,
                        "status":1
                    }
                } else {
                    this.helperDialogData = {
                        "uid": 0,
                        "salaryId": 0,
                        "baseSalary": 0,
                        "projectBonus": 0,
                        "jobsYearBonus": 0,
                        "otherBonus": 0,
                        "positionBonus": 0,
                        "performanceBonus": 0,
                        "status":1
                    }
                }
                this.selectEmp(null)
                this.helperDialogShow = true
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getTable();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getTable();
            },
            getTable() {
                client.get('wage/?pageSize=' + this.pageSize + '&pageNum=' + this.pageNum).then(data => {
                    this.tableData = data.data.list;
                    this.total = data.data.total;
                }).catch(error => {

                })
            }
        },
        mounted() {
            this.getTable();
        }
    }
</script>

<style scoped>

</style>
