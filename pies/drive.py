import os

import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds']

jsondata = {"client_email": os.environ.get("client_email"), "private_key": os.environ.get("private_key"),
            "client_id":    os.environ.get("client_id"), "private_key_id": os.environ.get("private_key_id"),
            "type":         "service_account"}
credentials = ServiceAccountCredentials._from_parsed_json_keyfile(jsondata, scope)

gc = gspread.authorize(credentials)

wks = gc.open_by_key('1LskHuzVfUyxahsPzCRteXmkpawZZ2wSnJcxqHuRWDZw').sheet1

TOPPINGS = ['Sauce', 'Cheese', 'Pepperoni', 'Mushrooms', 'Bacon', 'Onion', 'Sausage', 'Green Pepper']


def add_order(order):
    gc = gspread.authorize(credentials)
    wks = gc.open_by_key('1LskHuzVfUyxahsPzCRteXmkpawZZ2wSnJcxqHuRWDZw').sheet1
    name = order[0]
    addr = order[1]
    cellnumber = order[2]
    toppings = order[3]
    date = int(order[4])
    time = order[5]
    notes = ''.join(order[6:])

    startRow = (date - 25) * 27 + 2
    for row in range(startRow, startRow + 26):
        if wks.cell(row, 3).value == time:
            if wks.cell(row, 4).value != '':
                row += 1
            if wks.cell(row, 4).value != '':
                row = 82
                while wks.cell(row, 4).value != '':
                    row += 1
                wks.update_cell(row, 4, name)
                wks.update_cell(row, 5, cellnumber)
                wks.update_cell(row, 6, addr)
                wks.update_cell(row, 7, toppings)
                wks.update_cell(row, 8, notes)
                wks.update_cell(row, 9, 'Venmo')

                print("OVERBOOKED")
                return

            wks.update_cell(row, 4, name)
            wks.update_cell(row, 5, cellnumber)
            wks.update_cell(row, 6, addr)
            wks.update_cell(row, 7, toppings)
            wks.update_cell(row, 8, notes)
            wks.update_cell(row, 9, 'Venmo')

            print("SUCCESSFULLY ORDERED", name)
            return
