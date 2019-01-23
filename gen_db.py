import os
import psycopg2
from datetime import datetime, timedelta, timezone
from pytz import timezone
eastern = timezone('US/Eastern')

DATABASE_URL = os.environ['DATABASE_URL']
conn = psycopg2.connect(DATABASE_URL, sslmode='require')

cur = conn.cursor()

def datetime_range(start, end, delta):
    current = start
    while current <= end:
        yield current
        current += delta

thurs = [dt for dt in datetime_range(datetime(2019, 1, 31, 18, tzinfo=eastern), datetime(2019, 1, 31, 21, tzinfo=eastern), timedelta(minutes=15))]

fri = [dt for dt in datetime_range(datetime(2019, 2, 1, 18, tzinfo=eastern), datetime(2019, 2, 1, 21, tzinfo=eastern), timedelta(minutes=15))]

sat = [dt for dt in datetime_range(datetime(2019, 2, 2, 18, tzinfo=eastern
), datetime(2019, 2, 2, 21, tzinfo=eastern
), timedelta(minutes=15))]

for time in thurs:
    cur.execute("INSERT INTO orders (date, time) values(%s, %s)", (time.date(), time.time()))
    cur.execute("INSERT INTO orders (date, time) values(%s, %s)", (time.date(), time.time()))
for time in fri:
    cur.execute("INSERT INTO orders (date, time) values(%s, %s)", (time.date(), time.time()))
    cur.execute("INSERT INTO orders (date, time) values(%s, %s)", (time.date(), time.time()))
for time in sat:
    cur.execute("INSERT INTO orders (date, time) values(%s, %s)", (time.date(), time.time()))
    cur.execute("INSERT INTO orders (date, time) values(%s, %s)", (time.date(), time.time()))
conn.commit()
cur.close()
conn.close()
