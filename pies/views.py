from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from pies.models import Date

def index(request):
    dates = []

    for date in Date.objects.all():
        if not date.ordered and date not in dates:
            dates.append(date)
    template = loader.get_template('pies/index.html')
    return HttpResponse(template.render({'dates': dates}, request))

# Create your views here.
