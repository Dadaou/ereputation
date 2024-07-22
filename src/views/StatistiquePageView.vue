<template>
    <div>
        <h1>Analytics</h1>
        <div class="number">
            <div class="square bordure-bleu">
                
                <h5><i class="uil uil-user"></i> <span>Total visits</span></h5>
                <p>14</p>
            </div>
            <div class="square square bordure-rouge">
                <h5><i class="uil uil-times"></i> <span>Total not submitted</span></h5>
                <p>14</p>
            </div>
             <div class="square bordure-vert">
                <h5><i class="uil-envelope-send"></i> <span>Total submissions</span></h5>
                <p>14</p>
            </div>
            <div class="square">
                <h5><i class="uil uil-hand-pointer"></i><span>Total social media clicks</span></h5>
                <p>14</p>
            </div>
        </div>
        
       
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
.bordure-vert{
    border-bottom: 2px solid;
    border-bottom-color: #0a8964;
}
.bordure-bleu{
    border-bottom: 2px solid;
    border-bottom-color: #7bc6e9;
}
.bordure-rouge{
    border-bottom: 2px solid;
    border-bottom-color: #e97b80;
}
.dashboard {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
}
@media (max-width: 995px) {
    .dashboard {
        display: flex;
        justify-content: space-around;
    }

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
.square{
    width: 20%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
}

.square h5{
    text-align: center;
    padding: 20px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}

.square p {
    text-align: center;
    padding: 10px;
    font-weight: 600;
    font-size: 14px;
    color: rgb(101, 101, 101);
}
.number{
    display: flex;
    padding-top: 20px;
    justify-content: space-around;
}


</style>