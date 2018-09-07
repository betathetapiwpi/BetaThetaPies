var last = "25";
// var handler = StripeCheckout.configure({
//     key: 'pk_test_J4F9lMh7okJ2vEP0MKOB9ZhS',
//     image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
//     locale: 'auto',
//     token: function (token) {
//         console.log($.extend({}, token, {note: generateNote()}));
//         $.post({
//             url: '/checkout',
//             data: $.extend({}, token, {note: generateNote()})
//         });
//     }
// });

$(document).ready(function () {
    // var stripe = Stripe('pk_live_CxFYTe1sioFipBbod7dZHWas');
    // var elements = stripe.elements();
    // var style = {
    //     base: {
    //         color: '#32325d',
    //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //         fontSmoothing: 'antialiased',
    //         fontSize: '16px',
    //         '::placeholder': {
    //             color: '#aab7c4'
    //         }
    //     },
    //     invalid: {
    //         color: '#fa755a',
    //         iconColor: '#fa755a'
    //     }
    // };

// Create an instance of the card Element.
//     var card = elements.create('card', {style: style});
//
//     card.mount('#card-element');
    $('#cellnumber').mask('999-999-9999');

    $.ajax({
        url: '/times',
        type: 'GET',
        error: function () {
            $('#datepicker').pickadate({
                min: [2018, 8, 13],
                max: [2018, 8, 15]
            }).pickadate('picker').set({disable: true});
            $('#timepicker').pickatime({
                min: [18, 0],
                max: [21, 0],
                interval: 15,
                disabled: true
            }).pickatime('picker').set({disable: true});
        },
        success: function (data) {
            var dates = [];
            newData = JSON.parse(data);
            dates.push(true);
            for (let i = 0; i < newData.length - 1; i++) {
                dates.push(new Date(newData[i]));
            }
            var timepicker = $('#timepicker').pickatime({
                min: [18, 0],
                max: [21, 0],
                interval: 15
            }).pickatime('picker');
            var datepicker = $('#datepicker').pickadate({
                min: dates[1],
                max: dates[dates.length - 1],
                disable: dates,
                formatSubmit: "m/d/yyyy",
                hiddenName: true,
                format: "mmm d",
                onSet: function (thingset) {
                    timepicker.set('disable', false);
                    var selectedDayTimes = JSON.parse(data).filter(date => new Date(date).getDate() === new Date(thingset.select).getDate());
                    selectedDayTimes = selectedDayTimes.map((date, index, array) => [new Date(date).getHours(), new Date(date).getMinutes()]);
                    selectedDayTimes.unshift(true);
                    timepicker.set('disable', selectedDayTimes);
                    timepicker.set('disable', 'flip');
                }
            }).pickadate('picker');
            datepicker.set('select', dates[1]);
            timepicker.on({
                set: (thing) => {
                    $('.venmo-button').removeClass('disabled');
                }

            })


        },
        timeout: 10000
    });

    $('.toppingsIcon').click(function () {
        $('img', this).toggleClass('deselected');
        $('#' + (this.id.split('-')[0])).fadeToggle(1000);
    });

    // $('.stripe-button').click((e) => {
    //     if (!document.getElementById('orderform').checkValidity()){
    //         return false;
    //     }
    //     if (!$('#timepicker').pickatime('picker').get()){
    //         alert("Please select a time");
    //         return false;
    //     }
    //     handler.open({
    //         name: 'Beta Theta Pi - Eta Tau',
    //         description: 'Beta Theta Pie Purchase',
    //         amount: 1000
    //     });
    //     e.preventDefault();
    // });

    // window.addEventListener('popstate', () => {
    //     handler.close();
    // });
});


function pay() {
    window.open('https://venmo.com/BetaThetaPi-WPI?txn=pay&note=BTPOO' + generateNote() + '&amount=10', '_blank');
}

function generateNote() {
    const name = $('#name').val().replace(',', ' ');
    const addr = $('#address').val().replace(',', ' ');
    const cell = $('#cellnumber').val();
    let toppings = "";
    $('#crust').children().each((idx, itm) => {
        if ($(itm).is(":visible")) {
            toppings += itm.id + "/";
        }
    });

    const toppingsum = toppings.slice(0, -1);
    const day = $('#datepicker').pickadate('picker').get('select', 'm/d/yyyy');
    const time = $('#timepicker').pickatime('picker').get('select', 'H:i');
    if (time === "" || time === undefined) {
        $('#timepicker')[0].setCustomValidity("Please select a time");
        return false;
    }
    const comments = $('#comments').val().replace(',', ' ');
    return name + ',' + addr + ',' + cell + ',' + toppingsum + ',' + day + ',' + time + ',' + comments;
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
