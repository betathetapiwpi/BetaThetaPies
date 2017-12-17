$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
})

function pay() {
    window.open('https://venmo.com/BetaThetaPi-WPI?txn=pay&note=hello&amount=10', 'Beta Theta Pie Payment');
}
