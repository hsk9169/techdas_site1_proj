from app import app
from flask import jsonify, render_template, request, flash
from .databases import HS_F0, HS_F1, HS_F3 

db = [HS_F0, HS_F1, HS_F1, HS_F3]

@app.route('/main')
def render_main_page():
    return render_template('main.html')

@app.route('/<num_machine>/machine')
def render_machine_page(num_machine):
    if num_machine == '1':
        return render_template('machine_0.html', num_machine=num_machine)
    elif num_machine == '4':
        return render_template('machine_3.html', num_machine=num_machine)
    else:
        return render_template('machine_12.html', num_machine=num_machine)

@app.route('/<num_machine>/Sensor')
def render_sensor_page(num_machine):
    return render_template('sensor.html', num_machine=num_machine)

@app.route('/<num_machine>/Setting')
def render_setting_page(num_machine):
    return render_template('setting.html', num_machine=num_machine)


# Flash errors from the form if validation fails
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
            ))

### Data Fetch Routes
@app.route('/data/analyzer_status')
def get_all_analyzer_status():
    parameter_dict = request.args.to_dict()
    filter_date = parameter_dict['date_time']

    data1 = db[0].analyzer_status.get_latest(filter_date) 
    data2 = db[1].analyzer_status.get_latest(filter_date) 
    data3 = db[2].analyzer_status.get_latest(filter_date) 
    data4 = db[3].analyzer_status.get_latest(filter_date) 

    return jsonify(data1=data1, data2=data2, data3=data3, data4=data4)

@app.route('/data/analyzer_seva')
def get_all_analyzer_seva():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    ret = ''

    if sel_machine == '0':
        data1 = db[0].analyzer_seva.get_latest(filter_date)
        data2 = db[1].analyzer_seva.get_latest(filter_date)
        data3 = db[2].analyzer_seva.get_latest(filter_date)
        data4 = db[3].analyzer_seva.get_latest(filter_date)
        ret = jsonify(data1=data1, data2=data2, data3=data3, data4=data4)
    else:
        data = db[int(sel_machine) - 1].analyzer_seva.get_latest(filter_date)
        ret = jsonify(data=data)
    
    return ret

@app.route('/data/analyzer_seva/all')
def get_analyzer_seva_all():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    date_time = parameter_dict['date_time']

    filter_date = date_time[:10]

    data = db[int(sel_machine) - 1].analyzer_seva.get_daily(filter_date)

    return jsonify(data=data)

@app.route('/data/analyzer_pred')
def get_analyzer_pred():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].analyzer_pred.get_latest(filter_date) 
    return jsonify(data=data)

@app.route('/data/analyzer_pred/all')
def get_analyer_pred_all():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    date_time = parameter_dict['date_time']

    filter_date = date_time[:10]

    data = db[int(sel_machine) - 1].analyzer_pred.get_daily(filter_date)
    return jsonify(data=data)

@app.route('/data/analyzer_normal_ratio')
def get_analyer_normal_ratio():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].analyzer_normal_ratio.get_latest(filter_date)
    return jsonify(data=data)


@app.route('/data/sv_value')
def get_sv_value():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].raw_data.get_sv_value(filter_date) 
    return jsonify(data=data) 

@app.route('/data/limit_info', methods = ['POST', 'GET'])
def get_all_limit_info():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']

    if request.method == 'GET':
        ret = ''
        if sel_machine == '0':
            data1 = db[0].limit_info.get_data()
            data2 = db[1].limit_info.get_data()
            data3 = db[2].limit_info.get_data()
            data4 = db[3].limit_info.get_data()
            ret = jsonify(data1=data1, data2=data2, data3=data3, data4=data4)
        else:
            data = db[int(sel_machine) - 1].limit_info.get_data()
            ret = jsonify(data=data)
        return ret
    else:
        body = request.get_json()
        db[int(sel_machine) - 1].limit_info.set_data(body)
        data = db[int(sel_machine) - 1].limit_info.get_data()
        return jsonify(data=data)


@app.route('/data/fault_detection')
def get_all_fault_detection():
    parameter_dict = request.args.to_dict()
    filter_date = parameter_dict['date_time']

    data1 = db[0].fault_detection.get_latest(filter_date)
    data2 = db[1].fault_detection.get_latest(filter_date)
    data3 = db[2].fault_detection.get_latest(filter_date)
    data4 = db[3].fault_detection.get_latest(filter_date)

    return jsonify(data1=data1, data2=data2, data3=data3, data4=data4)

@app.route('/data/temp_monitoring')
def get_temp_monitoring():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].temp_monitoring.get_latest(filter_date)
    return jsonify(data=data)

@app.route('/data/tag_desc/sensor')
def get_tag_desc_sensor():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']

    data = db[int(sel_machine) - 1].tag_desc.get_sensor_data()

    return jsonify(data=data)

@app.route('/data/tag_desc/setting', methods = ['POST', 'GET'])
def tag_desc_setting():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']

    if request.method == 'GET':
        data = db[int(sel_machine) - 1].tag_desc.get_setting_data()
        return jsonify(data=data)
    else:
        body = request.get_json()
        db[int(sel_machine) - 1].tag_desc.set_setting_data(body)
        data = db[int(sel_machine) - 1].tag_desc.get_setting_data()
        return jsonify(data=data)

@app.route('/data/air_ratio')
def get_air_ratio():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].raw_data.get_air_ratio(filter_date) 

    return jsonify(data=data)

@app.route('/data/raw_data_tdls')
def get_raw_data_tdls():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].raw_data.get_tdls_latest(filter_date)
    return jsonify(data=data)

@app.route('/data/raw_data_tdls/all')
def get_raw_data_tdls_all():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    date_time = parameter_dict['date_time']
    filter_date = date_time[:10]

    data = db[int(sel_machine) - 1].raw_data.get_tdls_daily(filter_date)
    return jsonify(data=data)

@app.route('/data/raw_data_sensor')
def get_raw_data_sensor():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].raw_data.get_sensor(filter_date)
    return jsonify(data=data)

@app.route('/data/sensor_pred')
def get_sensor_pred():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].sensor_pred.get_latest(filter_date)
    return jsonify(data=data)

@app.route('/data/sensor_normal_ratio')
def get_sensor_normal_ratio():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].sensor_normal_ratio.get_latest(filter_date)
    return jsonify(data=data)

@app.route('/data/sensor_status')
def get_sensor_status():
    parameter_dict = request.args.to_dict()
    sel_machine = parameter_dict['num_machine']
    filter_date = parameter_dict['date_time']

    data = db[int(sel_machine) - 1].sensor_status.get_latest(filter_date)
    return jsonify(data=data)



###
# The functions below should be applicable to all Flask apps.
###


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=600'
    return response

@app.before_first_request
def initialize_before_request():
    print('before first request')

@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port="8080")
