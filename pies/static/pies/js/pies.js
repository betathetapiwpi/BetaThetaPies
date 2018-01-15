var last = "25";
$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
    $('#'+ $("#dateselector").val()).css("display", "block")
})

function pay() {
    name = $('#name').val().replace(',', ' ');
    addr = $('#address').val().replace(',', ' ');
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
    comments = $('#comments').val().replace(',', ' ');
    note = name+','+addr+','+cell+','+toppingsum+','+day+','+time+','+comments
    window.open('https://venmo.com/BetaThetaPi-WPI?txn=pay&note=BTPOO'+note+'&amount=10', '_blank')
}

function changeTime(day){
    $('#' + last).css("display", "none");
    last = $("#dateselector").val();
    $('#' + last).css("display", "block");

}

function random(){
    rand = Math.floor(Math.random() * 252) + 3;
    console.log(rand)
    for(i = 2; i <= 7; i++){
        if( (1 << i) & rand){
            $('#toppingsinput-' + i).prop('checked', true)
        }
        else{
            $('#toppingsinput-' + i).prop('checked', false)
        }
    }
}
