import json
from datetime import datetime

from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from pytz import timezone

from pies.models import Date
from .drive import add_order


def index(request):
    days = {}
    times = {}
    for date in Date.objects.all():
        day = date.delivery_time.astimezone(timezone('US/Eastern'))
        if date.ordered:
            continue
        if day.date() not in days:
            days[day.date()] = []
        if day.time() not in days[day.date()]:
            days[day.date()].append(day.time())

    days = {k: v for k, v in days.items() if v != []}
    times = {str(k.day): v for k, v in days.items()}

    template = loader.get_template('pies/index.html')
    return HttpResponse(
        template.render({'dates': days, 'times': times, 'keys': times.keys(), 'length': range(len(times))}, request))


@csrf_exempt
@require_POST
def purchase(request):
    jsondata = request.body
    data = json.loads(jsondata)
    note = data['data']['note']
    amount = data['data']['amount']
    settled = data['data']['status'] == 'settled'

    if not note.startswith('BTPOO'):
        print("not a pies order")
        return HttpResponse(status=200)

    if not settled or amount < 10:
        print("either not settled. or too little amount")
        return HttpResponse(status=402)

    order = note[5:].split(',')
    day = '2018 01 ' + order[4] + ' ' + order[5] + 'PM'
    date = datetime.strptime(day, '%Y %m %d %I:%M%p').astimezone(timezone('US/Eastern'))

    for date in Date.objects.filter(delivery_time=date):
        date.delete()
        break
    else:
        print("BIG ERROR THERES AN OVERBOOK")

    add_order(order)
    return HttpResponse(status=200)
