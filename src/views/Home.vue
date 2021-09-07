<template>
  <div>
    <div class="container-sm mt-5">
      <div class="row">
        <div class="col-sm-12">{{ '目前語系:' + (nowLang ? '中文' : 'English') }}</div>
      </div>
      <div class="row">
        <div class="col-sm-12">{{ '下次登入語系:' + (lang ? '中文' : 'English') }}</div>
      </div>

      <div class="row d-flex mt-5">
        <div class="col-sm-1">{{ }}</div>
        <div class="col-sm-3 mb-3">{{ form[0].text }}</div>
        <div class="col-sm-3 mr-auto mb-3">
          <input type="text">
        </div>
        <div class="col-sm-2">{{ }}</div>
        <div class="col-sm-2">
          <button id="Chinese" class="btn btn-light" @click="updateLang">中文</button>
        </div>
        <div class="col-1">{{ }}</div>
      </div>

      <div class="row mt-3">
        <div class="col-sm-1">{{ }}</div>
        <div class="col-sm-3 mb-3">{{ form[1].text }}</div>
        <div class="col-sm-3 mb-3">
          <input type="text">
        </div>
        <div class="col-sm-2">
          <button class="btn btn-dark mb-3">{{ btnData[0].text }}</button>
        </div>
        <div class="col-sm-2">
          <button id="English" class="btn btn-light" @click="updateLang">English</button>
        </div>
        <div class="col-sm-1">{{ }}</div>
      </div>
    </div>

    <div class="container-sm mt-5 ml-0">
      <div class="row">
        <div class="col-sm-3 mb-3 d-flex justify-content-start">
          <router-link to="/insert" id="insertBTN" class="btn btn-secondary">
            {{ btnData[1].text }}
          </router-link>
        </div>
        <div class="col-sm-7 d-flex justify-content-center">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </div>
        <div class="col-sm-2">
          <router-link class="btn btn-primary" to="/sys/sysbas/sysbast290">頁面測試</router-link>
        </div>
      </div>
    </div>

    <b-overlay :show="show" rounded="sm">
      <b-table
        id="my-table"
        class="mt-4"
        head-variant="light"
        striped
        hover
        :items="tableData"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        responsive="sm"
        :per-page="perPage"
        :current-page="currentPage"
        v-if="response"
      ></b-table>
    </b-overlay>

    <div>
      Sorting By: <b>{{ sortBy }}</b>, Sort Direction:
      <b>{{ sortDesc ? 'Ascending' : 'Descending' }}</b>
    </div>
  </div>
</template>

<script>
//引入json格式的資源檔
import Panel from '../assets/lang/sys/sysprm/sysprmt210/Panel'
import Button from '../assets/lang/share/button'

export default {
  components: {
    
  },
  data() {
    return {
      //存放表單語系資料
      form: [],
      //存放表格語系資料
      fields: [],
      //表格資料
      tableData: [],
      sortBy: '',
      sortDesc: true,
      currentPage: 1,
      perPage: 30,
      //存放按鈕語系資料
      btnData: [],
      response: [],
      show: false
    };
  },
  methods: {
    //讀取表單語系
    readForm() {
      const vm = this;

      Panel.queryField.forEach(item => {
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
    //讀取表格語系
    readTable() {
      const vm = this;

      Panel.tableField.forEach((item, index) => {
        let itemObj = {
          key: '',
          label: '',
          sortable: true,
          thStyle: '',
          tdClass: 'columnSetting'
        };

        itemObj.key = item.name;
        if (this.$store.state.nowLang === true) {
          itemObj.label = item.locale[0].text;
          itemObj.thStyle = 'background-color: lightblue; border-style: outset; padding: 5px; font-size: 9px; width: ' + 
                            String(item.locale[0].columnWidth) + 'px';
        } else {
          itemObj.label = item.locale[1].text;
          itemObj.thStyle = 'background-color: lightblue; border-style: outset; padding: 5px; font-size: 14px; width: ' + 
                            String(item.locale[1].columnWidth) + 'px';
        }

        vm.fields.push(itemObj);
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
    //儲存下次登入時的語系設定
    updateLang(event) {
      if (event.target.id === 'Chinese' && this.lang === false) {
        this.$store.commit('LANG', true);
        localStorage.setItem('LANG', 'TW');
      } else if (event.target.id === 'English' && this.lang === true) {
        this.$store.commit('LANG', false);
        localStorage.setItem('LANG', 'EN');
      }
    },
    request() {
      const URL = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/C-B0024-001?Authorization=CWB-D93A23A1-8576-40B9-8A04-16D6238C42B1&format=JSON';
      // let API = 'posts';
      // const URL = `http://localhost:3000/${API}`;
      this.show = true;
      this.$http.get(URL)
        .then(res => {
          if (res.statusText === 'OK') {
            // console.log(res)
            this.response = res.data.cwbdata.resources.resource.data.surfaceObs.location;
            this.showData();
            this.show = false;
          }
          else
            console.log('Get data error');
        })
        .catch(err => {
          console.log(err);
        });
    },
    showData() {
      const vm = this;

      this.response.forEach(item => {
        vm.tableData.push({
          systemid: item.station.stationNameEN,
          productcode: item.station.stationID,
          parmname: item.station.stationName,
          parmdesc: item.station.stationAttribute
        });
      });
    },
    // x2js() {
    //   const xml = this.$x2js.xml2js(``);
    //   console.log(xml);
    // }
  },
  computed: {
    nowLang() {
      return this.$store.state.nowLang;
    },
    lang() {
      return this.$store.state.lang;
    },
    rows() {
      return this.response.length;
    }
  },
  created() {
    this.request();
    //讀取localStorage的語系設定並設定現在的語系
    this.$store.dispatch('getNowLang');
    this.readForm();
    this.readTable();
    this.readBTNData();
    // this.x2js();
  }
}
</script>

<style scoped>
.table th.click {
  cursor: pointer;
}

.table th.click {
  cursor: pointer;
}

.icon {
  display: inline-block;
}
.icon.inverse {
  transform: rotate(180deg)
}

/deep/ .table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
  background-color: rgb(231, 247, 9);
}

#insertBTN {
  width: 120px;
  height: 30px;
  padding-top: 3px;
}

.btn-light {
  color: black;
  background-color: #dee2e6;
  border-color: black;
  width: 90px;
  height: 30px;
  padding-top: 3px;
}

.btn-light:hover {
  color: white;
  background-color: black;
}

.btn-dark {
  color: black;
  background-color: #adb5bd;
  border-color: black;
  width: 90px;
  height: 30px;
  padding-top: 3px;
}

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
  border: 1px solid green
}

/deep/ .columnSetting {
  font-size: 9px;
  text-align: left;
  vertical-align: middle;
  padding: 1px;
  border-style: outset;
  border-top-width: 1px;
  /* border-left: black; */
}
</style>
