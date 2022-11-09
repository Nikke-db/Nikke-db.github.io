"use strict";


const checkErrors = () =>{

    const current_level = Number.parseInt(qs("#char_level_up_current").value);
    const target_level = Number.parseInt(qs("#char_level_up_target").value);

    if(isNaN(current_level)|| isNaN(target_level)){
        displayError("At least one of the values is empty or not a number");
    }else if(current_level<1 || current_level >199){
        displayError("The current level have an invalid value ( range 1 to 199 )");
    }else if(target_level>200 || target_level < 2){
        displayError("The target level have an invalid value ( range 2 to 200 )");
    }else if(current_level>=target_level){
        displayError("The current level is greater than the target level");
    }else{
        displayResult(current_level, target_level)
    }
}

const displayError = (error_msg) => {
    qs("#calculator_result").style.display = "none";

    let error = qs("#calculator_error")
    error.style.display = "block";
    error.style.borderColor="red";

    error.innerHTML = "Error in the numbers given: <br/>" + error_msg;

}

const displayResult = async (current_level, target_level) => {
    qs("#calculator_error").style.display = "none";

    let credits = 0;
    let battle_data = 0;
    let core_dust = 0;

    const response = await fetch("js/json/CharacterLevelTable.json")
    const json = await response.json();
    
    json.records.forEach((array)=>{
        if (array.level>=current_level && array.level <target_level){
            credits     += array.gold;
            battle_data += array.character_exp;
            core_dust   += array.character_exp_2;
        }
    })

    qs("#calc_credit").innerHTML = credits.toLocaleString();
    qs("#calc_exp_blue").innerHTML = battle_data.toLocaleString();
    qs("#calc_exp_red").innerHTML = core_dust.toLocaleString();
    qs("#calc_level_min").innerHTML = current_level;
    qs("#calc_level_max").innerHTML = target_level;

    let result = qs("#calculator_result")
    result.style.display = "block";
    result.style.borderColor="lime";
}

qs("#level_up_div button").addEventListener("click",(e)=>{
    e.preventDefault();
    checkErrors();
})