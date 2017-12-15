from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("""
    <form>
        <input type="email" required id="inpEmail" placeholder="Enter Email" autofocus>
    </form>
    """)

# Create your views here.
