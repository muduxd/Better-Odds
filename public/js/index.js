// State management
const state = {
    bets: [{ odds: '' }, { odds: '' }],
    totalStake: ''
}

// Utility functions
const formatCurrency = (amount) => `$ ${Number(amount).toFixed(2)}`

const calculateArbitrage = (bets, totalStake) => {
    const validBets = bets.filter(bet => bet.odds > 0)
    if (validBets.length < 2 || !totalStake || totalStake <= 0) {
        return null
    }

    const impliedProbabilities = bets.map(bet => 1 / bet.odds)
    const totalProbability = impliedProbabilities.reduce((sum, prob) => sum + prob, 0)
    const isArbitrage = totalProbability < 1

    const stakes = impliedProbabilities.map(prob => (totalStake * prob) / totalProbability)
    const payouts = stakes.map((stake, i) => stake * bets[i].odds)
    
    return {
        isArbitrage,
        totalProbability,
        stakes,
        payouts,
        profit: isArbitrage ? (totalStake / totalProbability - totalStake) : 0
    }
}

// UI Components
const createBetElement = (index, bet, onRemove) => {
    const betDiv = document.createElement('div')
    betDiv.className = 'bet'
    
    betDiv.innerHTML = `
        <label for="bet-${index + 1}">Bet ${index + 1}</label>
        <input type="number" 
               id="bet-${index + 1}" 
               value="${bet.odds}" 
               class="bet-input" 
               placeholder="Enter odds" 
               step="0.1"
               min="0">
        <div class="result">
            <span class="result-label">Bet Stake: </span>
            <span>${formatCurrency(0)}</span>
        </div>
        <div class="result">
            <span class="result-label">Payout: </span>
            <span>${formatCurrency(0)}</span>
        </div>
        ${
            state.bets.length > 2
                ? `
            <button class="remove-bet-button" title="Remove bet">
                <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#FFFFFF" d="M19 13H5v-2h14v2z"/>
                </svg>
            </button>
        `
                : ""
        }
    `

    if (state.bets.length > 2) {
        const removeButton = betDiv.querySelector('.remove-bet-button')
        removeButton.addEventListener('click', () => onRemove(index))
    }

    return betDiv
}

const createArbitrageMessage = (result) => {
    const message = document.createElement('p')
    message.className = 'arbitrage-message'
    message.style.textAlign = 'center'
    message.style.marginTop = '1rem'
    message.style.fontWeight = 'bold'

    if (result.isArbitrage) {
        message.style.color = 'green'
        message.textContent = `Profitable! Expected profit: ${formatCurrency(result.profit)}`
    } else {
        message.style.color = 'red'
        message.textContent = 'Not profitable - Total probability > 100%'
    }

    return message
}

// Event Handlers
const handleNumberInput = (event) => {
    let value = event.target.value.trim()
    
    if (value < 0 || value[0] === '0' && value[1] !== '.') {
        event.target.value = ''
        return ''
    }

    // Handle decimal points - keep only the first one
    const decimalCount = (value.match(/\./g) || []).length
    if (decimalCount > 1) {
        const parts = value.split('.')
        value = parts[0] + '.' + parts.slice(1).join('')
        event.target.value = value
    }

    return event.target.value
}

const handleNumberKeyDown = (event) => {
    // Prevent negative numbers
    if (event.key === '-') {
        event.preventDefault()
        return
    }

    // Prevent decimal point if one already exists
    if (event.key === '.' && event.target.value.includes('.')) {
        event.preventDefault()
        return
    }

    // Prevent down arrow making number negative
    if (event.key === 'ArrowDown' && (+event.target.value === 0 || event.target.value === '')) {
        event.preventDefault()
        return
    }
}

// Main render function
const render = () => {
    const betsContainer = document.querySelector('.bets')
    const currentBets = document.querySelectorAll('.bet')
    
    // Only rebuild all bets if the number of bets changed
    if (currentBets.length !== state.bets.length) {
        betsContainer.innerHTML = ''
        state.bets.forEach((bet, index) => {
            const betElement = createBetElement(index, bet, (index) => {
                state.bets.splice(index, 1)
                render()
            })
            betsContainer.appendChild(betElement)
        })
    }
    
    const result = calculateArbitrage(state.bets, state.totalStake)
    
    // Update stakes and payouts if we have a valid calculation
    if (result) {
        const betElements = document.querySelectorAll('.bet')
        betElements.forEach((betElement, index) => {
            const resultSpans = betElement.querySelectorAll('.result span:not(.result-label)')
            resultSpans[0].textContent = formatCurrency(result.stakes[index] || 0)
            resultSpans[1].textContent = formatCurrency(result.payouts[index] || 0)
        })

        // Update or create arbitrage message
        const existingMessage = document.querySelector('.arbitrage-message')
        if (existingMessage) {
            existingMessage.remove()
        }
        document.querySelector('.grid').appendChild(createArbitrageMessage(result))
    } else {
        // Clear previous results when calculation is invalid
        const resultSpans = document.querySelectorAll('.result span:not(.result-label)')
        resultSpans.forEach(span => {
            span.textContent = formatCurrency(0)
        })
        
        // Remove arbitrage message if exists
        const existingMessage = document.querySelector('.arbitrage-message')
        if (existingMessage) {
            existingMessage.remove()
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Setup add button
    const addButton = document.getElementById('add-bet-button')
    addButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        Add`
    
    addButton.addEventListener('click', () => {
        state.bets.push({ odds: '' })
        render()
    })

    // Setup reset button
    document.getElementById('reset-button').addEventListener('click', () => {
        state.bets = [{ odds: '' }, { odds: '' }]
        state.totalStake = ''
        document.getElementById('total-stake').value = ''
        render()
    })

    // Setup total stake input
    const totalStakeInput = document.getElementById('total-stake')
    totalStakeInput.setAttribute('step', '0.1')
    totalStakeInput.setAttribute('min', '0')
    totalStakeInput.addEventListener('input', (event) => {
        state.totalStake = handleNumberInput(event)
        render()
    })
    totalStakeInput.addEventListener('keydown', handleNumberKeyDown)

    // Setup initial bet inputs
    document.addEventListener('input', (event) => {
        if (event.target.classList.contains('bet-input')) {
            const index = parseInt(event.target.id.split('-')[1]) - 1
            const value = handleNumberInput(event)
            state.bets[index].odds = value
            
            // Only render if we have valid odds and total stake
            if (state.totalStake && state.bets.some(bet => bet.odds > 0)) {
                render()
            }
        }
    })

    document.addEventListener('change', (event) => {
        if (event.target.classList.contains('bet-input')) {
            render()
        }
    })

    document.addEventListener('keydown', (event) => {
        if (event.target.classList.contains('bet-input')) {
            handleNumberKeyDown(event)
        }
    })

    render()
})
