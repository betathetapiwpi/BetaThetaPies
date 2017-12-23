import datetime

from django.db import models
from django.utils import timezone
import pytz

tz = pytz.timezone('US/Eastern')
class Date(models.Model):
    delivery_time = models.DateTimeField('Delivery Time')
    ordered = models.BooleanField('Ordered', default=False)
    name = models.TextField('Name', default = '')

    def __str__(self):
        return self.delivery_time.astimezone(tz).strftime("%a %b %d, %I:%M %p")

    def __eq__(self, other):
        return str(self) == str(other)

    def __hash__(self):
        return hash(str(self))
