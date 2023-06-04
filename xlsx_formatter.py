import pandas as pd
import sys
import numpy as np


input_file_index = 2
output_file_index = 3
ymn_index =4
YMN = "YMN"
CREDIT_ADJUSTMENT = "CREDIT ADJUSTMENTS"
DEBIT_ADJUSTMENT = "DEBIT ADJUSTMENT"

def convert_HT_bill():
    if len(sys.argv) < 3:
        print("Insufficient arguments")
        return
        
    CONSUMERNO = "CONS. NO"
    # Read and store content
    # of an excel file
    bill_filePath = sys.argv[input_file_index]
    bill_raw = pd.read_excel(bill_filePath)
    bill_raw.dropna(how='all', inplace=True)
    nRow, nCol = bill_raw.shape
    bill_final = pd.DataFrame()
    ymn = sys.argv[ymn_index]
    print("Creating HT Bill file for "+str(ymn))
    headers_title = -1
    count=0
    for i in range(0, nRow):
        if headers_title > -1 and str(bill_raw.iloc[i,0]).startswith(('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'))==True:
            title_i = headers_title
            data_i = i
            data = {YMN:str(ymn)}
            data_arr = [str(ymn)]
            max_c = 0
            while pd.isnull(bill_raw.iloc[title_i,1])==False and data_i < nRow:
                c = 0
                while pd.isnull(bill_raw.iloc[title_i,c])==False or c < max_c:
                    if pd.isnull(bill_raw.iloc[title_i,c])==False:
                        data[bill_raw.iloc[title_i,c]] = bill_raw.iloc[data_i,c]
                        data_arr.append(bill_raw.iloc[data_i,c])
                    c = c + 1
                    if (c > max_c):
                        max_c = c
                title_i = title_i + 1
                data_i = data_i + 1
            i = data_i - 1
            if len(data) > 1:
                if count == 0:
                    bill_final = pd.DataFrame(data, index=[0])
                else:
                    r,c = bill_final.shape
                    bill_final.loc[r] = data_arr
                count = count + 1
		
        if bill_raw.iloc[i,0] == CONSUMERNO:
            headers_title = i
        
    print(bill_final.head())
        
    bill_final.to_excel(sys.argv[output_file_index], sheet_name="sheet-1", index=False)

def convert_adj_2022_onwards():
    if len(sys.argv) < 3:
        print("Insufficient arguments")
        return

    CONSUMERNO = "Consumer Number"
    AMOUNT = "Amount"
    AMOUNT_TYPE = "Amount type"
    # Read and store content
    # of an excel file
    adj_filePath = sys.argv[input_file_index]
    adjustment = pd.read_excel(adj_filePath)
    adjustment.dropna(how='all', inplace=True)
    
    adj_result = pd.DataFrame()
    ymn = sys.argv[ymn_index]
    print("Creating Adjustment file for "+str(ymn))
    nRow, nCol = adjustment.shape
    headers_row = -1;
    amount_type=""
    for i in range(0, nRow):
        if adjustment.iloc[i, 0] == CREDIT_ADJUSTMENT or adjustment.iloc[i, 0] == DEBIT_ADJUSTMENT:
            amount_type = adjustment.iloc[i, 0]
        elif headers_row > -1 and str(adjustment.iloc[i, 0]).startswith(('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'))==True:
            title_row = headers_row
            data_row = i
            data = {YMN: str(ymn)}
            data_arr = [str(ymn)]
            while pd.isnull(adjustment.iloc[title_row, 0]) == False and data_row < nRow:
                c = 0
                while pd.isnull(adjustment.iloc[title_row, c]) == False:
                    if pd.isnull(adjustment.iloc[data_row, c]) == False:
                        data[adjustment.iloc[title_row, c]] = adjustment.iloc[data_row, c]
                        data_arr.append(adjustment.iloc[data_row, c])
                    else:
                        data[adjustment.iloc[title_row, c]] = "NA"
                        data_arr.append("NA")
                    c = c + 1
                break
            if pd.isnull(data[AMOUNT]) == False:
                if amount_type==CREDIT_ADJUSTMENT:
                    data[AMOUNT] = "-" + str(data[AMOUNT])
            if len(data) > 2:
                data[AMOUNT_TYPE] = amount_type
                data_arr.append(amount_type)
                r, c = adj_result.shape
                if r == 0:
                    adj_result = pd.DataFrame(data, index=[0])
                else:
                    #print(data_arr[1])
                    adj_result.loc[r] = list(data.values())
        elif adjustment.iloc[i, 0] == CONSUMERNO:
            headers_row = i
    
    print(adj_result.head())
    adj_result.to_excel(sys.argv[output_file_index], sheet_name="sheet-1", index=False)
    

if __name__=="__main__":
    if sys.argv[1] == "HT_BILL" or sys.argv[1] == "ht_bill":
        convert_HT_bill()
    elif sys.argv[1] == "ADJUSTMENT" or sys.argv[1] == "adjustment":
        if str(sys.argv[ymn_index]) >= "202201":
            convert_adj_2022_onwards()
    else:
        print("Invalid arguments")
    