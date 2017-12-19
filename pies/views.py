from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from pies.models import Date
from pytz import timezone

def index(request):
    days = {}
    times = {}
    for date in Date.objects.all():
        day = date.delivery_time.astimezone(timezone('US/Eastern'))
        if date.ordered:
            continue
        print(day.date())
        if day.date() not in days:
            days[day.date()] = []
        if day.time() not in days[day.date()]:
            days[day.date()].append(day.time())

    days = {k:v for k, v in days.items() if v!=[]}
    times = {str(k.day):v for k, v in days.items()}

    print(times['25'])
    template = loader.get_template('pies/index.html')
    return HttpResponse(template.render({'dates': days, 'times': times, 'keys': times.keys(), 'length': range(len(times))}, request))
