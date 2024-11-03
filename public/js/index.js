let odds = [0, 0]
const totalStake = 0




const renderBets = () => {
    const bets = document.querySelector(".bets")
    bets.innerHTML = ""


    for (let i = 0; i < odds.length; i++) {
        document.querySelector(".bets").innerHTML += `<div class="bet"><label for="bet-${i + 1}">Bet ${i + 1}</label><input type="number" id="bet-${i + 1}" value=${odds[i]} class="bet-input" placeholder="Enter odds"><div class="result"><span>$ 0.00</span></div><div class="result"><span>$ 0.00</span></div></div>`
    }

    removeButtonController()
}





const addBet = () => {
    odds.push(0)
    renderBets()            
}



const removeBet = (index) => {
    const totalBets = document.querySelector(".bets")
    if (totalBets.children.length <= index) return
    

    odds.splice(index, 1)
    renderBets()
    calculateBets()
}



const reset = () => {
    odds = [0, 0]
    renderBets()
}







const calculateBets = () => {
    if (totalStake <= 0) return
}


const removeButtonController = () => {
    const totalBets = document.querySelectorAll(".bet")





    // if (totalBets.length > 2) {
    //     for (let i = 0; i < totalBets.length; i++) {
    //         if (!totalBets[i].querySelector("#remove-bet-button"))
    //             totalBets[i].innerHTML += '<button id="remove-bet-button">-</button>'
            
    //         totalBets[i].querySelector("#remove-bet-button").removeEventListener("click", () => { removeBet(i) })
    //         totalBets[i].querySelector("#remove-bet-button").addEventListener("click", () => { removeBet(i) })
    //     }
    // }
    // else {
    //     for (let i = 0; i < totalBets.length; i++) {
    //         if (totalBets[i].querySelector("#remove-bet-button"))
    //             totalBets[i].removeChild(totalBets[i].querySelector("#remove-bet-button"))
    //     }
    // }

}


const handleInputValues = (event) => {
    console.log("kjflsj")
    if (event.target.value[event.target.value.length - 1] === "-") {
    console.log("da")

        event.target.value = event.target.value.substring(0, event.target.value.length - 1)
    }
}




document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("add-bet-button").addEventListener("click", addBet)
    document.getElementById("reset-button").addEventListener("click", reset)
    document.querySelectorAll("input").forEach(element => element.addEventListener("input", handleInputValues))

    renderBets()
})


