<template>
    <div v-if="data && data.plan" class="account-summary">
        <div class="summary-card__content">
            <div class="app__title">
                <h1>Plan Details</h1>
            </div>
            <table>
                <tr>
                    <td>Plan</td>
                    <td>: <span class="plan-name">{{ data.planName || '' }}</span></td>
                </tr>
                <tr>
                    <td>Establishment(s)</td>
                    <td>: {{ data.establishmentNumber || 'Illimited' }}</td>
                </tr>
                <tr>
                    <td>Intern reviews</td>
                    <td>: Illimited</td>
                </tr>
                <tr>
                    <td>Leads</td>
                    <td>: Illimited</td>
                </tr>
                <tr>
                    <td>Events</td>
                    <td>: {{ data.plan.event_limit || 'Illimited' }}</td>
                </tr>
                <tr>
                    <td>Monitored points of sale</td>
                    <td>: {{ data.plan.pointofsale_limit || 'Illimited' }}</td>
                </tr>
                <tr>
                    <td>Leads integration in your CRM</td>
                    <td>: <i class="uil" :class="data.plan.crm ? 'uil-check-square' : 'uil-times-square'"></i></td>
                </tr>
                <tr>
                    <td>Sales integration (API)</td>
                    <td>: <i class="uil" :class="data.plan.sale ? 'uil-check-square' : 'uil-times-square'"></i></td>
                </tr>
            </table>
        </div>
        <div class="summary-card__content">
            <div class="app__title">
                <h1>User Information</h1>
            </div>
            <table>
                <tr>
                    <td>First Name</td>
                    <td>: {{ data.uFName }}</td>
                </tr>
                <tr>
                    <td>Last Name</td>
                    <td>: {{ data.uLName }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>: {{ data.uEmail }}</td>
                </tr>
            </table>
        </div>
        <div class="summary-card__content">
            <div class="app__title">
                <h1>Company Information</h1>
            </div>
            <table>
                <tr>
                    <td>Name</td>
                    <td>: {{ data.cName }}</td>
                </tr>
                <tr>
                    <td>Adress</td>
                    <td>: {{ data.cAdress }}</td>
                </tr>
                <tr>
                    <td>Second Adress</td>
                    <td>: {{ data.cSAdress }}</td>
                </tr>
                <tr>
                    <td>Location</td>
                    <td>: {{ data.cZip }} {{ data.cCity }}, {{ data.cCountry }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        type: Object,
        required: false,
        default: () => { }
    }
})
</script>
<style>
.app__title {
    font-weight: 800;
    color: var(--color-bg);
}

.uil-check-square {
    color: var(--el-color-success);
    font-size: 20px;
    font-weight: 900;
}

.uil-times-square {
    color: var(--color-danger3);
    font-size: 20px;
    font-weight: 700;
}

.plan-name {
    border-radius: 20px;
    padding: 4px 12px;
    background-color: color-mix(in srgb, var(--color-primary) 25%, white);
    color: var(--color-danger);
    font-weight: 600;
}

.summary-card {
    display: flex;
    /* flex-direction: column;
  justify-content: flex-start;
  text-align: center; */
    box-shadow: rgba(149, 157, 165, 0.2) 2px 4px 16px;
    flex-basis: 150px;
    padding: 28px 38px;
    border-radius: 10px;
    border-radius: 12px;
    border: 1px outset rgba(149, 157, 165, 0.1);
    cursor: pointer;
}

.summary-card__content {
    width: 360px;
}

.account-summary {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 28px 24px 0 0;
}

.account-summary .summary-card__content {
    width: 100%;
}

.summary-card__content h1 {
    border-bottom: rgba(116, 116, 116, .4) 1px solid;
    width: 100%;
    margin-block: 12px 8px;
}

.account-summary table td {
    padding-right: 16px;
    padding-block: 4px;
    font-size: .85rem;
}

@media (max-width: 768px) {
    .summary-card__content {
        width: 100%;
    }

    .summary-card {
        width: 100%;
    }
}
</style>