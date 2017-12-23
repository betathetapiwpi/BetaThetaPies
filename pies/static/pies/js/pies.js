var last = "25";
$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
    $('#'+ $("#dateselector").val()).css("display", "block")
})

function pay() {
    name = $('#name').val();
    addr = $('#address').val();
    cell = $('#cellnumber').val();
    var toppings = "";
    for(i = 0; i <= 7; i++){
        if ($('#toppingsinput-'+i).prop('checked')){
            toppings += $('#toppingsinput-'+i).attr('value')+'/'
        }
    }
    toppingsum = toppings.slice(0,-1);
    day = $('#dateselector').val();
    time = $('#time'+day).find(":selected").text();
    comments = $('#comments').val();
    note = name+','+addr+','+cell+','+toppingsum+','+day+','+time+','+comments
    window.location.href = 'https://venmo.com/BetaThetaPi-WPI?txn=pay&note=BTPOO'+note+'&amount=10';
}

function changeTime(day){
    $('#' + last).css("display", "none");
    last = $("#dateselector").val();
    $('#' + last).css("display", "block");

}
