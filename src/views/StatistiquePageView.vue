<template>
    <div>
        <h1>Statistique</h1>
        <div class="dashboard">
            <div class="statistique">
                <ChartComponent />
            </div>
            <div class="statistique">
                <Chart3Component />
            </div>
        </div>
        <br>
        <div class="dashboard">
            <div class="statistique bas">
                <Chart2Component />
            </div>
            <div class="statistique">
                <Chart4Component />
            </div>
        </div>

    </div>
</template>

<script setup>
import {defineAsyncComponent} from 'vue';


const ChartComponent = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/ChartComponent.vue")
)

const Chart2Component = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/Chart2Component.vue")
)

const Chart3Component = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/Chart3Component.vue")
)

const Chart4Component = defineAsyncComponent(() =>
    import("@Components/ChartStatistique/Chart4Component.vue")
)



</script>
<style>
.dashboard {
    display: flex;
    justify-content: space-around;
}
.bas {
    margin-left : -50px ;
}
.statistique {
    z-index: 2;
}
h1 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--color-primary);
}
</style>