var last = "25";
$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
    $('#'+ $("#dateselector").val()).css("display", "block")
})

function pay() {
    name = $('#name').val();
    addr = $('#address').val();
    cell = $('#cellnumber').val();
    var toppingsum = 0;
    for(i = 0; i <= 7; i++){
        if ($('#toppingsinput-'+i).prop('checked')){
            toppingsum |= 1 << i;
        }
    }
    day = $('#dateselector').val();
    time = $('#time'+day).find(":selected").text();
    comments = $('#comments').val()
    note = name+','+addr+','+cell+','+toppingsum+','+day+','+time+','+comments
    console.log(note);
    hashed = btoa(note);
    window.location.href = 'https://venmo.com/BetaThetaPi-WPI?txn=pay&note=BTPOO'+hashed+'&amount=.01';
}

function changeTime(day){
    $('#' + last).css("display", "none");
    last = $("#dateselector").val();
    $('#' + last).css("display", "block");

}
