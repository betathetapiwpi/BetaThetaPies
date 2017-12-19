var last = "25";
$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
    $('#'+ $("#dateselector").val()).css("display", "block")
})

function pay() {
    window.open('https://venmo.com/BetaThetaPi-WPI?txn=pay&note=hello&amount=10', 'Beta Theta Pie Payment');
}

function changeTime(day){
    $('#' + last).css("display", "none")
    last = $("#dateselector").val()
    $('#' + last).css("display", "block")

}
