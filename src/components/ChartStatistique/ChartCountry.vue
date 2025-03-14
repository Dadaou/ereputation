<template>
  <h3 v-if="hasData">About Countries</h3>
  <div v-if="hasData" style="position: relative;">

    <div v-if="showModal" class="overlay" >
      <div class="modal" @click.stop>
       <div>
          <h3 class="text-lg font-bold" style="margin: -15px;">Visitors {{visitors[0].os}}</h3>
          <button class="btn text-lg close-btn" style="color: red;" @click="showModal = false">x</button>
       </div>
        <div class="modal-content">


            <el-table :data="visitors" class="custom-header" style="font-size: 13px !important;padding: 0px !important;margin: 0px !important;">
           
              <el-table-column label="Os" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style=" width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.os }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="OS" align="center" prop="os"/> -->

               <el-table-column label="Device" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.device }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="Device" prop="device"   /> -->

              <!-- <el-table-column label="Country" prop="country" /> -->
              <el-table-column label="Country" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.country }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="City" prop="city"/> -->
               <el-table-column label="City" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.city }}
                  </span>

                </template>
              </el-table-column>

              <!-- <el-table-column label="Gps" align="center" prop="gps"  show-overflow-tooltip/> -->
              <el-table-column label="Gps" align="center" style="width: 20%; min-width: 800px;">
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                    {{ scope.row.gps }}
                  </span>

                </template>
              </el-table-column>
             
              <!-- <el-table-column label="Visited at" prop="created_at" /> -->
            <el-table-column label="created_at" align="left" >
                <template #default="scope">
                  <span style="width: 20%; min-width: 800px; word-wrap: break-word;word-break: break-word;white-space: normal">
                     {{ scope.row.created_at ? moment(scope.row.created_at).format('YYYY-MM-DD HH:mm') : '' }}

                  </span>

                </template>
              </el-table-column>
             
          </el-table>

          
        </div>
        
      </div>
    </div>


    <div class="chart-container">
      <apexchart type="bar" height="460" :options="chartOptions" :series="series"  @dataPointSelection="handleBarClick"/>
    </div>

  </div>
  <div v-else class="content-message">
    <div v-if="hasData">No scan<br>
      <span v-if="IsValueOkay(establishment) && establishment[0] != 'all'"> for establishment :
        <span v-for="(estab_id, index) in establishment" :key="estab_id">
          <span v-for="estab_name in establishments" :key="estab_name.id">
            <span v-if="estab_name.id == estab_id">
              {{ estab_name.name }}<span v-if="index !== establishment.length - 1">, </span>
            </span>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, inject } from 'vue';
import VueApexCharts from 'vue3-apexcharts'
import { useRoute } from 'vue-router';
import services from '@Services/services.js';
import moment from 'moment';
import { useUserStore } from "@Stores/user.js"
import {
    ElMessage,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElButton,
    ElInput, ElOption, ElSelect, ElDatePicker, ElTooltip
} from 'element-plus'

const route = useRoute();
const dataChart = ref([]);
const series = ref([]);
const visitors = ref([]);
const category = ref([]);
const start_date = inject('start_date');
const end_date = inject('end_date');
const timePeriods = inject('timePeriods');
const establishment = inject('establishment');
const establishments = inject('establishments');
const staff = inject('staffFilter'); 
const units = inject('unitsFilter');
const userStore = useUserStore();
const source = inject('sourceFilter')
const hasData = ref(false);
const showModal = ref(false);
const emits = defineEmits(['showModal','setSource','show-visitors','show-chart']);
const pays = [
    { nom: "Afghanistan", drapeau: "🇦🇫", couleur: "#002F6C" },
    { nom: "Afrique du Sud", drapeau: "🇿🇦", couleur: "#007847" },
    { nom: "Albanie", drapeau: "🇦🇱", couleur: "#E41E20" },
    { nom: "Algérie", drapeau: "🇩🇿", couleur: "#006233" },
    { nom: "Allemagne", drapeau: "🇩🇪", couleur: "#000000" },
    { nom: "Andorre", drapeau: "🇦🇩", couleur: "#D61024" },
    { nom: "Angola", drapeau: "🇦🇴", couleur: "#FF0000" },
    { nom: "Arabie Saoudite", drapeau: "🇸🇦", couleur: "#006C35" },
    { nom: "Argentine", drapeau: "🇦🇷", couleur: "#75AADB" },
    { nom: "Arménie", drapeau: "🇦🇲", couleur: "#D90012" },
    { nom: "Australie", drapeau: "🇦🇺", couleur: "#002868" },
    { nom: "Autriche", drapeau: "🇦🇹", couleur: "#EF3340" },
    { nom: "Azerbaïdjan", drapeau: "🇦🇿", couleur: "#0094C8" },
    { nom: "Bahamas", drapeau: "🇧🇸", couleur: "#00778B" },
    { nom: "Bahreïn", drapeau: "🇧🇭", couleur: "#D71A28" },
    { nom: "Bangladesh", drapeau: "🇧🇩", couleur: "#006A4E" },
    { nom: "Belgique", drapeau: "🇧🇪", couleur: "#FAE042" },
    { nom: "Bénin", drapeau: "🇧🇯", couleur: "#FCD116" },
    { nom: "Bhoutan", drapeau: "🇧🇹", couleur: "#FFCC00" },
    { nom: "Biélorussie", drapeau: "🇧🇾", couleur: "#D32F2F" },
    { nom: "Bolivie", drapeau: "🇧🇴", couleur: "#DA291C" },
    { nom: "Botswana", drapeau: "🇧🇼", couleur: "#6DA9D2" },
    { nom: "Brésil", drapeau: "🇧🇷", couleur: "#009739" },
    { nom: "Bulgarie", drapeau: "🇧🇬", couleur: "#00966E" },
    { nom: "Burkina Faso", drapeau: "🇧🇫", couleur: "#EF3340" },
    { nom: "Burundi", drapeau: "🇧🇮", couleur: "#118600" },
    { nom: "Cameroun", drapeau: "🇨🇲", couleur: "#007A5E" },
    { nom: "Canada", drapeau: "🇨🇦", couleur: "#D52B1E" },
    { nom: "Cap-Vert", drapeau: "🇨🇻", couleur: "#0033A0" },
    { nom: "Chili", drapeau: "🇨🇱", couleur: "#D52B1E" },
    { nom: "Chine", drapeau: "🇨🇳", couleur: "#DE2910" },
    { nom: "Colombie", drapeau: "🇨🇴", couleur: "#FFD700" },
    { nom: "Comores", drapeau: "🇰🇲", couleur: "#FFD700" },
    { nom: "Congo (Brazzaville)", drapeau: "🇨🇬", couleur: "#009543" },
    { nom: "Congo (Kinshasa)", drapeau: "🇨🇩", couleur: "#FCD116" },
    { nom: "Corée du Nord", drapeau: "🇰🇵", couleur: "#C60C30" },
    { nom: "Corée du Sud", drapeau: "🇰🇷", couleur: "#003478" },
    { nom: "Costa Rica", drapeau: "🇨🇷", couleur: "#002B7F" },
    { nom: "Côte d'Ivoire", drapeau: "🇨🇮", couleur: "#F77F00" },
    { nom: "Croatie", drapeau: "🇭🇷", couleur: "#171796" },
    { nom: "Cuba", drapeau: "🇨🇺", couleur: "#0055A4" },
    { nom: "Danemark", drapeau: "🇩🇰", couleur: "#C8102E" },
    { nom: "Djibouti", drapeau: "🇩🇯", couleur: "#0095B6" },
    { nom: "Égypte", drapeau: "🇪🇬", couleur: "#C8102E" },
    { nom: "Émirats Arabes Unis", drapeau: "🇦🇪", couleur: "#00732F" },
    { nom: "Équateur", drapeau: "🇪🇨", couleur: "#FFD700" },
    { nom: "Espagne", drapeau: "🇪🇸", couleur: "#FFCC00" },
    { nom: "Estonie", drapeau: "🇪🇪", couleur: "#0072CE" },
    { nom: "États-Unis", drapeau: "🇺🇸", couleur: "#B22234" },
    { nom: "Éthiopie", drapeau: "🇪🇹", couleur: "#008000" },
    { nom: "Fidji", drapeau: "🇫🇯", couleur: "#5BC4E8" },
    { nom: "France", drapeau: "🇫🇷", couleur: "#0055A4" },
    { nom: "Gabon", drapeau: "🇬🇦", couleur: "#009B77" },
    { nom: "Gambie", drapeau: "🇬🇲", couleur: "#008F7B" },
    { nom: "Géorgie", drapeau: "🇬🇪", couleur: "#C8102E" },
    { nom: "Ghana", drapeau: "🇬🇭", couleur: "#F00A12" },
    { nom: "Grèce", drapeau: "🇬🇷", couleur: "#0D5E8C" },
    { nom: "Grenade", drapeau: "🇬🇩", couleur: "#F03C31" },
    { nom: "Guatemala", drapeau: "🇬🇹", couleur: "#009639" },
    { nom: "Guinée", drapeau: "🇬🇳", couleur: "#FCD116" },
    { nom: "Guinée-Bissau", drapeau: "🇬🇼", couleur: "#E30B17" },
    { nom: "Guyana", drapeau: "🇬🇾", couleur: "#009739" },
    { nom: "Haïti", drapeau: "🇭🇹", couleur: "#0D47A1" },
    { nom: "Honduras", drapeau: "🇭🇳", couleur: "#0033A0" },
    { nom: "Hongrie", drapeau: "🇭🇺", couleur: "#C8102E" },
    { nom: "Inde", drapeau: "🇮🇳", couleur: "#FF9933" },
    { nom: "Indonésie", drapeau: "🇮🇩", couleur: "#D71A28" },
    { nom: "Irak", drapeau: "🇮🇶", couleur: "#006747" },
    { nom: "Irlande", drapeau: "🇮🇪", couleur: "#009B77" },
    { nom: "Israël", drapeau: "🇮🇱", couleur: "#0038A8" },
    { nom: "Italie", drapeau: "🇮🇹", couleur: "#008C45" },
    { nom: "Jamaïque", drapeau: "🇯🇲", couleur: "#F8B500" },
    { nom: "Japon", drapeau: "🇯🇵", couleur: "#BC002D" },
    { nom: "Jordanie", drapeau: "🇯🇴", couleur: "#F00A12" },
    { nom: "Kazakhstan", drapeau: "🇰🇿", couleur: "#00A9E0" },
    { nom: "Kenya", drapeau: "🇰🇪", couleur: "#FF0000" },
    { nom: "Kirghizistan", drapeau: "🇰🇬", couleur: "#E10000" },
    { nom: "Kiribati", drapeau: "🇰🇮", couleur: "#FFCB00" },
    { nom: "Koweït", drapeau: "🇰🇼", couleur: "#F00A12" },
    { nom: "Laos", drapeau: "🇱🇦", couleur: "#0038A8" },
    { nom: "Lesotho", drapeau: "🇱🇸", couleur: "#000000" },
    { nom: "Lettonie", drapeau: "🇱🇻", couleur: "#9E0031" },
    { nom: "Liban", drapeau: "🇱🇧", couleur: "#D71A28" },
    { nom: "Liberia", drapeau: "🇱🇸", couleur: "#009639" },
    { nom: "Libye", drapeau: "🇱🇾", couleur: "#009E49" },
    { nom: "Liechtenstein", drapeau: "🇱🇮", couleur: "#1E47A1" },
    { nom: "Lituanie", drapeau: "🇱🇹", couleur: "#FCD116" },
    { nom: "Luxembourg", drapeau: "🇱🇺", couleur: "#F00A12" },
    { nom: "Macédoine", drapeau: "🇲🇰", couleur: "#E50000" },
    { nom: "Madagascar", drapeau: "🇲🇬", couleur: "#007847" },
    { nom: "Malaisie", drapeau: "🇲🇾", couleur: "#F00A12" },
    { nom: "Malawi", drapeau: "🇲🇼", couleur: "#D71A28" },
    { nom: "Maldives", drapeau: "🇲🇻", couleur: "#E0D819" },
    { nom: "Mali", drapeau: "🇲🇱", couleur: "#009E49" },
    { nom: "Malte", drapeau: "🇲🇹", couleur: "#F00A12" },
    { nom: "Maroc", drapeau: "🇲🇦", couleur: "#FF0000" },
    { nom: "Marshall", drapeau: "🇲🇭", couleur: "#1D4E89" },
    { nom: "Maurice", drapeau: "🇲🇺", couleur: "#E4002B" },
    { nom: "Mauritanie", drapeau: "🇲🇷", couleur: "#009639" },
    { nom: "Mexique", drapeau: "🇲🇽", couleur: "#006747" },
    { nom: "Micronésie", drapeau: "🇫🇲", couleur: "#48C6E4" },
    { nom: "Moldavie", drapeau: "🇲🇩", couleur: "#E10000" },
    { nom: "Monaco", drapeau: "🇲🇨", couleur: "#D71A28" },
    { nom: "Mongolie", drapeau: "🇲🇳", couleur: "#006AA7" },
    { nom: "Mozambique", drapeau: "🇲🇿", couleur: "#FF0000" },
    { nom: "Namibie", drapeau: "🇳🇦", couleur: "#009639" },
    { nom: "Nauru", drapeau: "🇳🇷", couleur: "#F9A100" },
    { nom: "Népal", drapeau: "🇳🇵", couleur: "#E10000" },
    { nom: "Nicaragua", drapeau: "🇳🇮", couleur: "#004E80" },
    { nom: "Niger", drapeau: "🇳🇬", couleur: "#FCD116" },
    { nom: "Nigeria", drapeau: "🇳🇬", couleur: "#008B4A" },
    { nom: "Niue", drapeau: "🇳🇺", couleur: "#0064A8" },
    { nom: "Norvège", drapeau: "🇳🇴", couleur: "#BA0C2F" },
    { nom: "Nouvelle-Zélande", drapeau: "🇳🇿", couleur: "#002B7F" },
    { nom: "Oman", drapeau: "🇴🇲", couleur: "#F00A12" },
    { nom: "Ouganda", drapeau: "🇺🇬", couleur: "#009E49" },
    { nom: "Pakistan", drapeau: "🇵🇰", couleur: "#006847" },
    { nom: "Palaos", drapeau: "🇵🇼", couleur: "#62B1B4" },
    { nom: "Panama", drapeau: "🇵🇦", couleur: "#0063B1" },
    { nom: "Papouasie-Nouvelle-Guinée", drapeau: "🇵🇬", couleur: "#E60012" },
    { nom: "Paraguay", drapeau: "🇵🇾", couleur: "#005BAC" },
    { nom: "Pays-Bas", drapeau: "🇳🇱", couleur: "#21468B" },
    { nom: "Pérou", drapeau: "🇵🇪", couleur: "#D91D29" },
    { nom: "Philippines", drapeau: "🇵🇭", couleur: "#0038A8" },
    { nom: "Pologne", drapeau: "🇵🇱", couleur: "#E4002B" },
    { nom: "Portugal", drapeau: "🇵🇹", couleur: "#006747" },
    { nom: "Qatar", drapeau: "🇶🇦", couleur: "#9E0022" },
    { nom: "République tchèque", drapeau: "🇨🇿", couleur: "#D52B1E" },
    { nom: "Roumanie", drapeau: "🇷🇴", couleur: "#FCD116" },
    { nom: "Royaume-Uni", drapeau: "🇬🇧", couleur: "#C8102E" },
    { nom: "Russie", drapeau: "🇷🇺", couleur: "#0000FF" },
    { nom: "Rwanda", drapeau: "🇷🇼", couleur: "#0A5F72" },
    { nom: "Saint-Christophe-et-Niévès", drapeau: "🇰🇳", couleur: "#FDBB30" },
    { nom: "Saint-Marin", drapeau: "🇸🇲", couleur: "#74B3D4" },
    { nom: "Saint-Vincent-et-les-Grenadines", drapeau: "🇻🇨", couleur: "#01A7D6" },
    { nom: "Sao Tomé-et-Principe", drapeau: "🇸🇹", couleur: "#3E8E41" },
    { nom: "Sénégal", drapeau: "🇸🇳", couleur: "#009639" },
    { nom: "Serbie", drapeau: "🇷🇸", couleur: "#D71A28" },
    { nom: "Seychelles", drapeau: "🇸🇨", couleur: "#FFD700" },
    { nom: "Sierra Leone", drapeau: "🇸🇱", couleur: "#18B2AA" },
    { nom: "Singapour", drapeau: "🇸🇬", couleur: "#E4002B" },
    { nom: "Slovaquie", drapeau: "🇸🇰", couleur: "#006B3F" },
    { nom: "Slovénie", drapeau: "🇸🇮", couleur: "#FFFFFF" },
    { nom: "Somalie", drapeau: "🇸🇴", couleur: "#009C9C" },
    { nom: "Soudan", drapeau: "🇸🇩", couleur: "#F00A12" },
    { nom: "Soudan du Sud", drapeau: "🇸🇸", couleur: "#1F6B3C" },
    { nom: "Sri Lanka", drapeau: "🇱🇰", couleur: "#F8B900" },
    { nom: "Suède", drapeau: "🇸🇪", couleur: "#006AA7" },
    { nom: "Suisse", drapeau: "🇨🇭", couleur: "#FF0000" },
    { nom: "Syrie", drapeau: "🇸🇾", couleur: "#D71A28" },
    { nom: "Tadjikistan", drapeau: "🇹🇯", couleur: "#F80B1D" },
    { nom: "Tanzanie", drapeau: "🇹🇿", couleur: "#FFB81C" },
    { nom: "Tchad", drapeau: "🇹🇩", couleur: "#009639" },
    { nom: "Thaïlande", drapeau: "🇹🇭", couleur: "#C8102E" },
    { nom: "Timor-Leste", drapeau: "🇹🇱", couleur: "#E40000" },
    { nom: "Togo", drapeau: "🇹🇬", couleur: "#009639" },
    { nom: "Tonga", drapeau: "🇹🇴", couleur: "#F5A5A1" },
    { nom: "Trinité-et-Tobago", drapeau: "🇹🇹", couleur: "#E4002B" },
    { nom: "Tunisie", drapeau: "🇹🇳", couleur: "#E60012" },
    { nom: "Turkménistan", drapeau: "🇹🇲", couleur: "#006747" },
    { nom: "Turquie", drapeau: "🇹🇷", couleur: "#E30B17" },
    { nom: "Tuvalu", drapeau: "🇹🇻", couleur: "#0089C2" },
    { nom: "Ukraine", drapeau: "🇺🇦", couleur: "#0066B1" },
    { nom: "Uruguay", drapeau: "🇺🇾", couleur: "#FFD700" },
    { nom: "United States of America", drapeau: "🇺🇸", couleur: "#B22234" },
    { nom: "United Kingdom of Great Britain and Northern Ireland", drapeau: "🇬🇧", couleur: "#00247D" },
    { nom: "Vanuatu", drapeau: "🇻🇺", couleur: "#00A14E" },
    { nom: "Vatican", drapeau: "🇻🇦", couleur: "#FFD700" },
    { nom: "Venezuela", drapeau: "🇻🇪", couleur: "#FCD116" },
    { nom: "Vietnam", drapeau: "🇻🇳", couleur: "#F00A12" },
    { nom: "Yémen", drapeau: "🇾🇪", couleur: "#D71A28" },
    { nom: "Zambie", drapeau: "🇿🇲", couleur: "#007847" },
    { nom: "Zimbabwe", drapeau: "🇿🇼", couleur: "#00A859" }
];


function interpolateColor(color1, color2, steps) {
    const c1 = color1.match(/\w\w/g).map(c => parseInt(c, 16));
    const c2 = color2.match(/\w\w/g).map(c => parseInt(c, 16));
    const colors = [];

    for (let i = 0; i <= steps; i++) {
        const r = Math.round(c1[0] + (c2[0] - c1[0]) * (i / steps));
        const g = Math.round(c1[1] + (c2[1] - c1[1]) * (i / steps));
        const b = Math.round(c1[2] + (c2[2] - c1[2]) * (i / steps));
        colors.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`);
    }
    return colors;
}



const chartOptions = ref({
  chart: {
    id: 'vuechart-example2',
    stacked: true,
  },
  events: {
      dataPointSelection: (event, chartContext, config) => {
       
        handleBarClick(event, chartContext, config);
      }
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    min: 0,
    max: 60,
    tickAmount: 6,
    labels: {
      formatter: function (val) {
        return val.toFixed(0);
      }
    }
  },
  colors: interpolateColor(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color, userStore.user.partner ? userStore.user.partner.title_color : userStore.user.customer.partner_title_color, 3),
  // colors: userStore.user.partner ? [userStore.user.partner.back_color, userStore.user.partner.title_color] : [userStore.user.customer.partner_back_color, userStore.user.customer.partner_title_color],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
  },
  plotOptions: {
    bar: {
      borderRadius: 0,
    },
  },
});

const handleBarClick = (event, chartContext, config)=> {
 
  const { dataPointIndex } = config;
  const serieName = series.value[config.seriesIndex]?.name;
  
    getVisitors(chartOptions.value.xaxis.categories[dataPointIndex], chartOptions.value.xaxis.categories[dataPointIndex], timePeriods.value, establishment.value, staff.value, units.value,serieName);
  emits('showModal',true);
 emits('setSource','Country');
  // showModal.value = true;
  
}

const getMaxData = (_series) => {
 const maxIndex = _series[0].data.length;
const sums = Array.from({ length: maxIndex }, (_, i) => 
  _series.reduce((sum, s) => sum + s.data[i], 0)
);

const maxData = Math.max(...sums);
  return maxData;
}

const IsValueOkay = (value) => (value == '' || value == 'Global' || value == 0 || value == null || value == undefined) ? false : true;

const loadData = async (start_date, end_date, timePeriods, establishment, staff, units) => {

  if (IsValueOkay(start_date) && IsValueOkay(end_date)) {
    start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
    end_date = moment(new Date(end_date)).format('YYYY-MM-DD');
  }

  let api = `/customer/visitor/chart/country?tag=${route.params.tag}&from=${start_date}&to=${end_date}&type=${timePeriods || 'daily'}&source=${source.value || 'all'}`
  if (establishment) {
    api = api + `&establishment=${establishment}`
  }
  if (staff) {
    api = api + `&staff=${staff}`
  }
  if (units) {
    api = api + `&units=${units}`
  }

  try {
    const response = await new Promise((resolve) => {
      services.get_Record(api, (response) => {
        resolve(response);
      });
    });


    if (response.status === 200) {
      dataChart.value = response.data;
      category.value = response.data.categories || [];
      let seriesFormatted=[];
      let chart_colors=[];
       response.data.series.forEach((_d)=>{
        
        const france = pays.find(pays => pays.nom.toLowerCase() === _d['name'].toLowerCase())

        if (france) {
          _d['name']=`${france.drapeau} ${france.nom}`;
          chart_colors.push(france.couleur);
        }else{
          chart_colors.push(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color);
        }
        seriesFormatted.push(_d);
      })

      series.value = seriesFormatted || [];
      const maxValue = response.data.series.length > 0 ? getMaxData(response.data.series) : 0;
      
     
      
      chartOptions.value = {
        ...chartOptions.value,
        xaxis: {
          categories: category.value,
        },
        yaxis: {
          max: maxValue,
        },
        colors : chart_colors
        // colors : interpolateColor(userStore.user.partner ? userStore.user.partner.back_color : userStore.user.customer.partner_back_color, userStore.user.partner ? userStore.user.partner.title_color : userStore.user.customer.partner_title_color, response.data.series.length)
      };
      const total = series.value.reduce((totalAcc, serie) => {
        return totalAcc + (serie.data ? serie.data.reduce((acc, curr) => acc + curr, 0) : 0);
      }, 0);
     

      hasData.value = total > 0;
      if (total <= 0) {
          emits('show-chart','country_false');
      }else{
          emits('show-chart','country');
      }


    } else {
      console.error('Error fetching data:', response);
    }
  } catch (error) {
    console.error(error);
  }
};

const getVisitors = async (start_date, end_date, timePeriods, establishment, staff, units,country) => {



  let api = `/customer/visitor/chart/country?tag=${route.params.tag}&from=${start_date}&to=${end_date}&country=${country}&type=${timePeriods || 'daily'}&source=${source.value || 'all'}`
  if (establishment) {
    api = api + `&establishment=${establishment}`
  }
  if (staff) {
    api = api + `&staff=${staff}`
  }
  if (units) {
    api = api + `&units=${units}`
  }

  try {
    const response = await new Promise((resolve) => {
      services.get_Record(api, (response) => {
        resolve(response);
      });
    });


    if (response.status === 200) {
       let visiteurs=[];
      response.data.forEach((_d)=>{
        _d['created_at']=moment(_d['created_at']).format('YYYY-MM-DD HH:mm')
        // visitors.value.push(_d);
        visiteurs.push(_d);
      })
    
      emits('show-visitors',visiteurs);
      // visitors.value = response.data;
      // emits('show-visitors',response.data);

    } else {
      console.error('Error fetching data:', response);
    }
  } catch (error) {
    console.error(error);
  }
};

watch([start_date, end_date, timePeriods, establishment, staff, units], () => {
  loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value)
})

onBeforeMount(async () => {
  await loadData(start_date.value, end_date.value, timePeriods.value, establishment.value, staff.value, units.value);
});


</script>

<script>
export default {
  components: {
    apexchart: VueApexCharts
  }
};
</script>

<style scoped>

  .modal {
  position: absolute;
  top: 0%;
  left: -5%;
 background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  width: 110%;
  height: 90%;
  overflow: auto; 
  display: flex;
  flex-direction: column;
  z-index: 1000 !important;
  scrollbar-width: none;
}

.modal-content {
  flex-grow: 1;
  overflow-x: auto; 
  overflow-y: auto; 
  border: 1px solid #ccc;
  padding: 5px;
  white-space: nowrap; 
}

.close-btn {
  position: absolute;
  top: 1px;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: red;
  cursor: pointer;

}



.chart-container {
  width: 100%;
  max-width: 100%;
}

.inside {
  display: flex;
  justify-content: center;
}

h3 {
  /* margin: 40px 0 0; */
  text-align: center;
  padding: 20px;
  font-weight: 600;
  font-size: 14px;
  color: rgb(101, 101, 101);
}

.inside {
  padding: 20px;
}

.date__filter {
  margin-bottom: 20px;
}

.text-sm {
  font-size: 0.875rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.content-message {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 22px;
}
</style>