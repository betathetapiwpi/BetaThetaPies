import datetime

from django.db import models
from django.utils import timezone
import pytz

tz = pytz.timezone('US/Eastern')
class Date(models.Model):
    delivery_time = models.DateTimeField('Delivery Time')

    def __str__(self):
        return self.delivery_time.astimezone(tz).strftime("%a %b %d, %I:%M %p")
