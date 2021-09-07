<template>
    <div>
        <div class="container-sm mt-2 mr-0">
            <div class="d-flex flex-row-reverse">
                <b-alert 
                    variant="success" 
                    class="position-fixed"
                    style="z-index:1;"
                    :show="countDown"
                    dismissible
                    @dismissed="countDown = 0"
                    @dismiss-count-down="updateCountDown"
                    fade>
                    {{ Msg[1].text }}
                </b-alert>
            </div>
        </div>
        
        <div class="container-sm mt-5" style="max-width: 800px">
            <ValidationObserver v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(insertData)">
                    <div class="row mt-3">
                        <div class="col-sm-3 mr-3">
                            {{ form[0].text }}
                        </div>
                        <validation-provider rules="required|min:3" v-slot="{ errors, classes }">
                            <div :class="classes">
                                <input v-model="systemid" name="systemid" type="text"><br>
                                <span>{{ errors[0] }}</span>
                            </div>
                        </validation-provider>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-3">
                            {{ form[1].text }}
                        </div>
                        <div class="col-sm-3">
                            <input name="productcode" type="text">
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-3">
                            {{ form[2].text }}
                        </div>
                        <div class="col-sm-9">
                            <input name="parmgroup" type="text" style="width: 100%">
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-3">
                            {{ form[3].text }}
                        </div>
                        <div class="col-sm-9">
                            <input name="parmname" type="text" style="width: 100%">
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-3">
                            {{ form[4].text }}
                        </div>
                        <div class="col-sm-9">
                            <input name="parmdesc" type="text" style="width: 100%">
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-3">
                            {{ form[5].text }}
                        </div>
                        <div class="col-sm-9">
                            <input name="parmvalue" type="text" style="width: 100%">
                        </div>
                    </div>

                    <div class="row mt-5">
                        <div class="col-sm-2" style="padding-top: 5px">{{ form[6].text }}</div>
                        <div class="col-sm-2" style="padding: 3px">
                            <input type="text" style="width: 100%">
                        </div>
                        <div class="col-sm-2" style="padding: 3px">
                            <input type="text" style="width: 100%">
                        </div>
                        <div class="col-sm-2" style="padding-top: 5px">{{ form[7].text }}</div>
                        <div class="col-sm-2" style="padding: 3px">
                            <input type="text" style="width: 100%">
                        </div>
                        <div class="col-sm-2" style="padding: 3px">
                            <input type="text" style="width: 100%">
                        </div>
                    </div>

                    <div class="container-sm mt-5">
                        <div class="row d-flex justify-content-center">
                            <template v-for="(item, index) in btnData">
                                <button class="btn btn-outline-danger mr-3"
                                    type="submit"
                                    :key="index"
                                    v-if="item.name === 'confirm1'">
                                    {{ item.text }}
                                </button>
                            </template>
                            <template v-for="(item, index) in btnData">
                                <router-link class="btn btn-outline-success"
                                    :key="index"
                                    v-if="item.name === 'cancel1'"
                                    to="/">
                                    {{ item.text }}
                                </router-link>
                            </template>
                        </div>
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </div>
</template>

<script>
//引入json格式的資源檔
import Form from '../assets/lang/sys/sysprm/sysprmt210/Form'
import Button from '../assets/lang/share/button'
import Message from '../assets/lang/share/message'
import customerValidator from '../validators/validator'

customerValidator();

export default {
    data() {
        return {
            form: [],
            Msg: [],
            btnData: [],
            //b-alert存在秒數
            countDownNum: 3,
            //b-alert倒數計時用
            countDown: 0,
            systemid: '',
            productCode: ''
        };
    },
    methods: {
        //讀取表單語系
        readForm() {
            const vm = this;

            Form.formField.forEach(item => {
                let itemObj = {
                    name: '',
                    text: '',
                };

                itemObj.name = item.name;
                if (this.$store.state.nowLang === true)
                    itemObj.text = item.locale[0].text;
                else
                    itemObj.text = item.locale[1].text;

                vm.form.push(itemObj);
            });
        },
        readMsg() {
            const vm = this;

            Message.message.forEach(item => {
                let itemObj = {
                    name: '',
                    text: '',
                };

                itemObj.name = item.name;
                if (this.$store.state.nowLang === true)
                    itemObj.text = item.locale[0].text;
                else
                    itemObj.text = item.locale[1].text;

                vm.Msg.push(itemObj);
            });
        },
        //讀取按鈕語系
        readBTNData() {
            const vm = this;

            Button.button.forEach(item => {
                let itemObj = {
                    name: '',
                    text: ''
                };
                
                itemObj.name = item.name;
                if (this.$store.state.nowLang === true)
                    itemObj.text = item.locale[0].text;
                else
                    itemObj.text = item.locale[1].text;

                vm.btnData.push(itemObj);
            });
        },
        insertData() {
            //將倒數的總秒數秒數assign進去讓b-alert component啟動
            this.countDown = this.countDownNum;
        },
        //b-alert啟動後倒數秒數為0後則會消失
        updateCountDown(countDown) {
            this.countDown = countDown;
        }
    },
    computed: {
        nowLang() {
            return this.$store.state.nowLang;
        },
        lang() {
            return this.$store.state.lang;
        }
    },
    created() {
        this.$store.dispatch('getNowLang');
        this.readForm();
        this.readMsg();
        this.readBTNData();
    }
}
</script>

<style scoped>
.invalid {
  color: #EB0600;
}
.invalid input {
  border: 1px #EB0600 solid
}
.valid {
  color: green;
}
.valid input {
  border: 1px green solid
}
</style>
