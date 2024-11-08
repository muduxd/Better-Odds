let odds = [0, 0]
let totalStake = ""





// INPUT EVENT HANDLERS

const handleNumberChange = (event) => {
    const value = event.target.value.trim()

    if (+value <= 0 || isNaN(value) || value === "" || value.length === 0) {
        return ""
    }

    return value
}



const handleNumberInput = (event) => {
    let value = event.target.value.trim()

    if (value < 0 || value[0] === "0") {
        value = ""
    }

    return value
}



const handleNumberKeyDown = (event) => {
    if (event.key === '-') {
        event.preventDefault()
        return
    }

    if (event.key === 'ArrowDown') {
        const value = event.target.value.trim()

        if (+value === 0 || value === "") {
            event.preventDefault()
            event.target.value = ""
            return
        }
    }
}



const attachNumberInputHandlers = (inputElement, onChangeCallback = null) => {
    inputElement.addEventListener('input', (event) => {
        const value = handleNumberInput(event)
        if (onChangeCallback) onChangeCallback(value)
    })

    inputElement.addEventListener('keydown', handleNumberKeyDown)

    inputElement.addEventListener('change', (event) => {
        const value = handleNumberChange(event)
        if (onChangeCallback) onChangeCallback(value)
    })
}













// UI CRUD FUNTIONS

const renderBets = () => {
    const bets = document.querySelector(".bets")
    bets.innerHTML = ""


    for (let i = 0; i < odds.length; i++) {
        document.querySelector(".bets").innerHTML += `<div class="bet"><label for="bet-${i + 1}">Bet ${i + 1}</label><input type="number" id="bet-${i + 1}" value="${odds[i] > 0 ? odds[i] : ""}" class="bet-input" placeholder="Enter odds" step="0.1"><div class="result"><span>$ 0.00</span></div><div class="result"><span>$ 0.00</span></div></div>`
        const betInput = document.getElementById(`bet-${i + 1}`)

        attachNumberInputHandlers(betInput, (value) => {
            console.log("VALUE", value, i)
            odds[i] = value
            console.log(odds)

            calculateBets()
        })

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
    console.log(totalStake)

    if (!totalStake || totalStake <= 0) {
        return
    }
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









// LOAD EVENT LISTENERS ON DOCUMENT LOAD



document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("add-bet-button").addEventListener("click", addBet)
    document.getElementById("reset-button").addEventListener("click", reset)


    attachNumberInputHandlers(document.getElementById("total-stake"), (value) => {
        totalStake = value
        calculateBets()
    })

    renderBets()
})
