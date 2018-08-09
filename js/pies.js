var last = "25";


$(document).ready(function(){
    $('#cellnumber').mask('999-999-9999');
    $('#'+ $("#dateselector").val()).css("display", "block")

    });

function pay() {
    const name = $('#name').val().replace(',', ' ');
    const addr = $('#address').val().replace(',', ' ');
    const cell = $('#cellnumber').val();
    let toppings = "";
    for(let i = 0; i <= 7; i++){
        if ($('#toppingsinput-'+i).prop('checked')){
            toppings += $('#toppingsinput-'+i).attr('value')+'/'
        }
    }
    const toppingsum = toppings.slice(0,-1);
    const day = $('#dateselector').val();
    const time = $('#time'+day).find(":selected").text();
    const comments = $('#comments').val().replace(',', ' ');
    const note = name+','+addr+','+cell+','+toppingsum+','+day+','+time+','+comments;
    window.open('https://venmo.com/BetaThetaPi-WPI?txn=pay&note=BTPOO'+note+'&amount=10', '_blank');
}

function changeTime(){
    $('#' + last).css("display", "none");
    last = $("#dateselector").val();
    $('#' + last).css("display", "block");

}

// function random(){
//     rand = Math.floor(Math.random() * 252) + 3;
//     console.log(rand);
//     for(i = 2; i <= 7; i++){
//         if( (1 << i) & rand){
//             $('#toppingsinput-' + i).prop('checked', true)
//         }
//         else{
//             $('#toppingsinput-' + i).prop('checked', false)
//         }
//     }
// }
