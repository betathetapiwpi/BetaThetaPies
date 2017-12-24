import gspread
import os 
from datetime import date, time
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds']

jsondata = {"client_email": os.environ.get("client_email"), "private_key": os.environ.get("private_key"), "client_id": os.environ.get("client_id"), "private_key_id": os.environ.get("private_key_id"), "type": "service_account"}
credentials = ServiceAccountCredentials._from_parsed_json_keyfile(jsondata, scope)

gc = gspread.authorize(credentials)

wks = gc.open_by_key('1LskHuzVfUyxahsPzCRteXmkpawZZ2wSnJcxqHuRWDZw').sheet1

TOPPINGS = ['Sauce', 'Cheese', 'Pepperoni', 'Mushrooms', 'Bacon', 'Onion', 'Sausage', 'Green Pepper']
def add_order(order):
    name = order[0]
    addr = order[1]
    cellnumber = order[2]
    toppings = int(order[3])
    final_toppings = [t for i, t in enumerate(TOPPINGS) if 1<<i & toppings]
    date = int(order[4])
    time = order[5]
    notes = order[6]

    startRow = (date - 25)*27 + 2
    for row in range(startRow, startRow+26):
        if wks.cell(row, 3).value == time:
            if wks.cell(row, 4).value != '':
                row += 1
            
            wks.update_cell(row, 4, name)
            wks.update_cell(row, 5, cellnumber)
            wks.update_cell(row, 6, addr)
            wks.update_cell(row, 7, ','.join(final_toppings))
            wks.update_cell(row, 8, notes)
            wks.update_cell(row, 9, 'Venmo')
        
            return
        


        
