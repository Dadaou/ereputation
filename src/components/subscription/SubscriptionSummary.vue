<template>
    <div class="account-summary">
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
                    <td>Age</td>
                    <td>: 16</td>
                </tr>
                <tr>
                    <td>Propriétaire</td>
                    <td>: Belle-mère</td>
                </tr>
                <tr>
                    <td>Habitudes alimentaires</td>
                    <td>: Mange tous les restes</td>
                </tr>
            </table>
        </div>
        <div class="summary-card__content">
            <div class="app__title">
                <h1>User Information</h1>
            </div>
            <table>
                <tr>
                    <td>Name</td>
                    <td>: Knocky</td>
                </tr>
                <tr>
                    <td>Race</td>
                    <td>: Jack Russell</td>
                </tr>
                <tr>
                    <td>Age</td>
                    <td>: 16</td>
                </tr>
                <tr>
                    <td>Propriétaire</td>
                    <td>: Belle-mère</td>
                </tr>
                <tr>
                    <td>Habitudes alimentaires</td>
                    <td>: Mange tous les restes</td>
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
                    <td>: Knocky</td>
                </tr>
                <tr>
                    <td>Race</td>
                    <td>: Jack Russell</td>
                </tr>
                <tr>
                    <td>Age</td>
                    <td>: 16</td>
                </tr>
                <tr>
                    <td>Propriétaire</td>
                    <td>: Belle-mère</td>
                </tr>
                <tr>
                    <td>Habitudes alimentaires</td>
                    <td>: Mange tous les restes</td>
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