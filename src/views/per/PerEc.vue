<template>
    <div>
        <div style="height: 80px;margin-bottom: 10px;width: 100%">
            <el-button icon="el-icon-search" type="primary" @click="getTable" :disabled="showAdvanceSearchView">
                搜索
            </el-button>
            <el-button icon="" type="primary" @click="showHelpDialog('add')" :disabled="showAdvanceSearchView">
                新增
            </el-button>
        </div>
        <el-table
                :data="tableData"
                style="width: 100%">
            <el-table-column
                    prop="id"
                    label="id">
            </el-table-column>
            <el-table-column
                    prop="rewardPunishmentType"
                    label="奖惩类型">
                <template slot-scope="scope">
                    <div>{{scope.row.rewardPunishmentType?'奖励':'惩罚'}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="rewardPunishmentPrice"
                    label="奖惩金额"
                   >
            </el-table-column>
            <el-table-column
                    prop="rewardPunishmentItems"
                    label="奖惩物品"
                   >
            </el-table-column>
            <el-table-column
                    prop="empName"
                    label="员工姓名"
                    >
            </el-table-column>
            <el-table-column
                    prop="deptName"
                    label="部门"
                    >
            </el-table-column>
            <el-table-column
                    prop="positionName"
                    label="职位"
                    >
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注"
                    >
            </el-table-column>
            <el-table-column
                    prop="createDate"
                    label="创建时间"
                    >
            </el-table-column>
            <el-table-column
                    prop="implementationData"
                    label="生效时间"
                    >
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="当前状态"
                   >
                <template slot-scope="scope">
                    <div>{{scope.row.status==0?'未生效':(scope.row.status==1?'未生效':'已取消')}}</div>
                </template>
            </el-table-column>
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
                <el-form-item label="类型">
                    <el-radio-group v-model="helperDialogData.rewardPunishmentType">
                        <el-radio label="true">奖励</el-radio>
                        <el-radio label="false">罚款</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="奖惩金额">
                    <el-input v-model="helperDialogData.rewardPunishmentPrice"></el-input>
                </el-form-item>
                <el-form-item label="奖惩物品">
                    <el-input v-model="helperDialogData.rewardPunishmentItems"></el-input>
                </el-form-item>
                <el-form-item label="生效时间">
                    <el-date-picker
                            v-model="helperDialogData.implementationData"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选择人员">
                    <el-select v-model="helperDialogData.empId" filterable remote :remote-method	="selectEmp" placeholder="请选择">
                            <el-option
                                    :key="item.id"
                                    v-for="item in emps"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="helperDialogData.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">{{this.helperDialogDataType === 'edit'?'修改':'新增'}}</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import client from "../../modules/client";

    export default {
        name: "PerEc",
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
                if (this.helperDialogData.empId == ''|| this.helperDialogData.empId == undefined){
                   return alert("员工id不能为空")
                }
                client.post(this.helperDialogDataType === 'edit'?'rewardAndPunish/update':'rewardAndPunish/add',this.helperDialogData).then(data => {
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
                        "rewardPunishmentType": dataJson.rewardPunishmentType,
                        "rewardPunishmentPrice": dataJson.rewardPunishmentPrice,
                        "rewardPunishmentItems": dataJson.rewardPunishmentItems,
                        "empId": dataJson.empId,
                        "implementationData": dataJson.implementationData,
                        "createDate":dataJson.createDate,
                        "remark":dataJson.remark,
                        "status": dataJson.status,

                    }
                } else {
                    this.helperDialogData = {
                        "id": '',
                        "rewardPunishmentType": '',
                        "rewardPunishmentPrice": '',
                        "rewardPunishmentItems": '',
                        'status':1,
                        "implementationData": '',
                        "remark":'',
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
                client.get('rewardAndPunish/?pageSize=' + this.pageSize + '&pageNum=' + this.pageNum).then(data => {
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
