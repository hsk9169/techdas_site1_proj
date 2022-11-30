import sqlite3, json
from os import path

bind_key = path.splitext(path.basename(__file__))[0]
basedir = path.abspath(path.dirname(__file__))

conn = sqlite3.connect(path.join(basedir, f'../../DB/{bind_key}.db'), check_same_thread=False)
cur = conn.cursor()

num_sensor = 24

class analyzer_status:
    def get_latest(filter_date):
        query = cur.execute(f""" \
            SELECT * FROM analyzer_status \
            WHERE DateTime LIKE '{filter_date}' \
        """)
        
        row = query.fetchall()[0]
        
        data = {}
        data['DateTime'] = row[0]
        data['y1'] = int(row[1])
        data['y2'] = int(row[2])
        data['y3'] = int(row[3])
        data['y4'] = int(row[4])
        data['y5'] = int(row[5])
        return data

class analyzer_seva:
    def get_latest(filter_date):
        query = cur.execute(f""" \
                SELECT * FROM analyzer_seva \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['y1'] = float(row[1])
        data['y2'] = float(row[2])
        data['y3'] = float(row[3])
        data['y4'] = float(row[4])
        data['y5'] = float(row[5])
        return data

    def get_daily(filter_date):
        query = cur.execute(f""" \
                SELECT * FROM analyzer_seva \
                WHERE DateTime LIKE '{filter_date}%' \
                """)

        rows = query.fetchall()

        data = []
        for row in rows:
            temp = {}
            temp['DateTime'] = row[0]
            temp['y1'] = float(row[1])
            temp['y2'] = float(row[2])
            temp['y3'] = float(row[3])
            temp['y4'] = float(row[4])
            temp['y5'] = float(row[5])
            data.append(temp)
        return data

class limit_info:
    def get_data():
        query = cur.execute('SELECT * FROM limit_info')

        rows = query.fetchall()

        data = []
        for row in rows:
            temp = {}
            temp['var'] = row[0]
            temp['yellow'] = float(row[1])
            temp['red'] = float(row[2])
            data.append(temp)
        return data

    def set_data(jsonData):
        for row in jsonData:
            cur.execute(f""" \
                UPDATE limit_info \
                SET yellow = '{row['yellow']}', \
                    red = '{row['red']}' \
                WHERE var = '{row['var']}' \
                """)
            conn.commit()

class fault_detection:
    def get_latest(filter_date):
        query = cur.execute(f""" \
                SELECT DateTime, Status FROM fault_detection \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['Status'] = row[1]
        return data

class temp_monitoring:
    def get_latest(filter_date):
        query = cur.execute(f""" \
                SELECT * FROM temp_monitoring \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['t1'] = float(row[1])
        data['t2'] = float(row[2])
        data['t3'] = float(row[3])
        data['t4'] = float(row[4])
        data['t5'] = float(row[5])
        data['t6'] = float(row[6])
        data['t7'] = float(row[7])
        return data

class analyzer_pred:
    def get_latest(filter_date):
        query = cur.execute(f""" \
                SELECT * FROM analyzer_pred \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['y1'] = float(row[1])
        data['y2'] = float(row[2])
        data['y3'] = float(row[3])
        data['y4'] = float(row[4])
        data['y5'] = float(row[5])
        return data

    def get_daily(filter_date):
        query = cur.execute(f""" \
                SELECT * FROM analyzer_pred \
                WHERE DateTime LIKE '{filter_date}%' \
                """)

        rows = query.fetchall()
        data = []

        for row in rows:
            temp = {}
            temp['DateTime'] = row[0]
            temp['y1'] = float(row[1])
            temp['y2'] = float(row[2])
            temp['y3'] = float(row[3])
            temp['y4'] = float(row[4])
            temp['y5'] = float(row[5])
            data.append(temp)
        return data

class analyzer_normal_ratio:
    def get_latest(filter_date):
        query = cur.execute(f""" \
                SELECT * FROM analyzer_normal_ratio \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['y1'] = float(row[1])
        data['y2'] = float(row[2])
        data['y3'] = float(row[3])
        data['y4'] = float(row[4])
        data['y5'] = float(row[5])
        return data

class tag_desc:
    def get_setting_data():
        query = cur.execute(f""" \
                SELECT Tag, var, BandWidth, High, Low FROM tag_desc \
                """)

        rows = query.fetchall()
        data = []
        
        for row in rows:
            temp = {}
            temp['Tag'] = row[0]
            temp['var'] = row[1]
            temp['BandWidth'] = row[2]
            temp['High'] = row[3]
            temp['Low'] = row[4]
            data.append(temp)
        return data

    def set_setting_data(jsonData):
        for row in jsonData:
            cur.execute(f""" \
                    UPDATE tag_desc \
                    SET BandWidth = '{row['BandWidth']}', \
                        High = '{row['High']}', \
                        Low = '{row['Low']}' \
                    WHERE var = '{row['var']}' \
                    """)
            conn.commit()

    def get_sensor_data():
        query = cur.execute(f""" \
                SELECT Tag, var, BandWidth, High, Low, Sigma FROM tag_desc \
                WHERE var = 'X3' OR var = 'X5' OR var = 'X7' OR var = 'X9' \
                OR var = 'X11' OR var = 'X13' OR var = 'X15' OR var = 'X17' \
                OR var = 'X19' OR var = 'X20' OR var = 'X21' OR var = 'X22' \
                OR var = 'X23' OR var = 'X24' OR var = 'X25' OR var = 'X26' \
                OR var = 'X27' OR var = 'X29' OR var = 'X30' OR var = 'X31' \
                OR var = 'X32' OR var = 'X33' OR var = 'X43' OR var = 'X44' \
                """)

        rows = query.fetchall()
        data = [] 
       
        for row in rows:
            temp = {}
            temp['Tag'] = row[0]
            temp['var'] = row[1]
            temp['BandWidth'] = row[2]
            temp['High'] = row[3]
            temp['Low'] = row[4]
            temp['Sigma'] = row[5]
            data.append(temp)
        return data

class raw_data:
    def get_air_ratio(filter_date):
        query = cur.execute(f""" \
                SELECT DateTime, X35, X36, X37, X38, X39, X40, X41, X42 FROM raw_data \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['z1'] = float(row[1])
        data['z2'] = float(row[2])
        data['z3'] = float(row[3])
        data['z4'] = float(row[4])
        data['z5'] = float(row[5])
        data['z6'] = float(row[6])
        data['z7'] = float(row[7])
        data['z8'] = float(row[8])
        return data

    def get_sv_value(filter_date):
        query = cur.execute(f""" \
                SELECT DateTime, X52 FROM raw_data \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['Y1'] = float(row[1])
        return data

    def get_tdls_latest(filter_date):
        query = cur.execute(f""" \
                SELECT DateTime, Y1, Y2, Y3, Y4, Y5 FROM raw_data \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['y1'] = float(row[1])
        data['y2'] = float(row[2])
        data['y3'] = float(row[3])
        data['y4'] = float(row[4])
        try:
            data['y5'] = float(row[5])
        except:
            data['y5'] = ''
        return data

    def get_tdls_daily(filter_date):
        query = cur.execute(f""" \
                SELECT DateTime, Y1, Y2, Y3, Y4, Y5 FROM raw_data \
                WHERE DateTime LIKE '{filter_date}%' \
                """)
        rows = query.fetchall()

        data = []
        for row in rows:
            temp = {}
            temp['DateTime'] = row[0]
            temp['y1'] = float(row[1])
            temp['y2'] = float(row[2])
            temp['y3'] = float(row[3])
            temp['y4'] = float(row[4])
            try:
                temp['y5'] = float(row[5])
            except:
                temp['y5'] = ''
            data.append(temp)
        return data

    def get_sensor(filter_date):
        query = cur.execute(f""" \
                SELECT DateTime, X3, X5, X7, X9, X11, X13, X15, X17, X19, X20, X21, X22, X23, X24, X25, X26, X27, X29, X30, X31, X32, X33, X43, X44 FROM raw_data \
                WHERE DateTime LIKE '{filter_date}' \
                """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        data['X3'] = float(row[1])
        data['X5'] = float(row[2])
        data['X7'] = float(row[3])
        data['X9'] = float(row[4])
        data['X11'] = float(row[5])
        data['X13'] = float(row[6])
        data['X15'] = float(row[7])
        data['X17'] = float(row[8])
        data['X19'] = float(row[9])
        data['X20'] = float(row[10])
        data['X21'] = float(row[11])
        data['X22'] = float(row[12])
        data['X23'] = float(row[13])
        data['X24'] = float(row[14])
        data['X25'] = float(row[15])
        data['X26'] = float(row[16])
        data['X27'] = float(row[17])
        data['X29'] = float(row[18])
        data['X30'] = float(row[19])
        data['X31'] = float(row[20])
        data['X32'] = float(row[21])
        data['X33'] = float(row[22])
        data['X43'] = float(row[23])
        data['X44'] = float(row[24])
        return data

class sensor_pred:
    def get_latest(filter_date):
        query = cur.execute(f""" \
            SELECT * FROM sensor_pred \
            WHERE DateTime LIKE '{filter_date}' \
            """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        for i in range(num_sensor):
            data[f'SP_X{i+1}'] = float(row[i+1])
        return data

class sensor_normal_ratio:
    def get_latest(filter_date):
        query = cur.execute(f""" \
            SELECT * FROM sensor_normal_ratio \
            WHERE DateTime LIKE '{filter_date}' \
            """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        for i in range(num_sensor):
            data[f'SP_X{i+1}'] = float(row[i+1])
        return data

class sensor_status:
    def get_latest(filter_date):
        query = cur.execute(f""" \
            SELECT * FROM sensor_status \
            WHERE DateTime LIKE '{filter_date}' \
            """)

        row = query.fetchall()[0]

        data = {}
        data['DateTime'] = row[0]
        for i in range(num_sensor):
            data[f'SP_X{i+1}'] = float(row[i+1])
        return data
