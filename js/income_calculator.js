"use strict";

const outpost_income_checkErrors = () => {

    const outpost_lvl = Number.parseInt(qs("#current_outpost_level").value);
    const credit_boost = Number.parseInt(qs("#current_credit_boost").value);
    const battle_data_boost = Number.parseInt(qs("#current_battle_data_boost").value);
    const core_dust_boost = Number.parseInt(qs("#current_core_dust_boost").value);

    if (isNaN(outpost_lvl) || isNaN(credit_boost) || isNaN(battle_data_boost) || isNaN(core_dust_boost)) {
        outpost_income_displayError("A value is not a number or empty");
    } else if (outpost_lvl < 1 || outpost_lvl > 300) {
        outpost_income_displayError("The outpost level have an invalid value ( range 1 to 300 )");
    }else if (credit_boost < 0) {
        outpost_income_displayError("The credit boost have an invalid value ( minimum 0 )");
    }else if (battle_data_boost < 0) {
        outpost_income_displayError("The battle data boost have an invalid value ( minimum 0 )");
    }else if (core_dust_boost < 0) {
        outpost_income_displayError("The core dust boost have an invalid value ( minimum 0 )");
    } else {
        outpost_income_displayResult(outpost_lvl, credit_boost, battle_data_boost, core_dust_boost)
    }
}

const outpost_income_displayError = (error_msg) => {
    qs("#income_calculator_result").style.display = "none";

    let error = qs("#income_calculator_error")
    error.style.display = "block";
    error.style.borderColor = "red";

    error.innerHTML = "Error: <br/>" + error_msg;

}

const outpost_income_displayResult = async (outpost_lvl, credit_boost, battle_data_boost, core_dust_boost) => {
    qs("#income_calculator_error").style.display = "none";

    const response = await fetch("js/json/OutpostBattleTable.json")
    const json = await response.json();

    json.records.forEach((array) => {
        if (array.id == outpost_lvl) {

            localStorage.setItem("outpost_level", array.id)
            localStorage.setItem("credit_boost", credit_boost)
            localStorage.setItem("battle_data_boost", battle_data_boost)
            localStorage.setItem("core_dust_boost", core_dust_boost)

            const credit = array.credit * 3 / 10000;
            const battle_data = array.character_exp1 * 3 / 10000;
            const core_dust = array.character_exp2 * 1 / 10000;

            const RESSOURCES = [
                {
                    name: "credit",
                    value: credit,
                    boost: credit_boost
                },
                {
                    name:"core_dust",
                    value:core_dust,
                    boost: core_dust_boost
                },
                {
                    name:"battle_data",
                    value:battle_data,
                    boost: battle_data_boost
                }
            ];


            RESSOURCES.forEach(ressource => {
                qs("#income_"+ressource.name+"_base").innerHTML = Math.floor(ressource.value).toLocaleString()
                qs("#income_"+ressource.name+"_1m").innerHTML = Math.floor(ressource.value +  ressource.value * ressource.boost / 100).toLocaleString()
                qs("#income_"+ressource.name+"_1h").innerHTML = Math.floor((ressource.value +  ressource.value * ressource.boost / 100) * 60).toLocaleString()
                qs("#income_"+ressource.name+"_24h").innerHTML = Math.floor((ressource.value +  ressource.value * ressource.boost / 100) * 60 * 24).toLocaleString()
            });


        }
    })

    let result = qs("#income_calculator_result")
    result.style.display = "block";
    result.style.borderColor = "lime";

}

qs("#income_calculator_div button").addEventListener("click", (e) => {
    e.preventDefault()
    outpost_income_checkErrors()
})

if (localStorage.getItem("outpost_level")) {
    qs("#current_outpost_level").value = localStorage.getItem("outpost_level")
    qs("#current_credit_boost").value = localStorage.getItem("credit_boost");
    qs("#current_battle_data_boost").value = localStorage.getItem("battle_data_boost");
    qs("#current_core_dust_boost").value = localStorage.getItem("core_dust_boost");
    qs("#income_calculator_div button").click()
}