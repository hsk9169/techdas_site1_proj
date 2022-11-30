var sensor_raw_data
var sensor_pred_data
var sensor_pred_flag_data
var sensor_normal_ratio_data
var tag_desc_data
var sensor_fault_rank_list = []

function makeTablesRows() {
    let rowLen
    if (sel == 1 || sel == 3) {
        rowLen = 23
    } else if (sel == 2) {
        rowLen = 26
    } else {
        rowLen = 24
    }
    for (row=1 ; row<=rowLen; row++) {
        $('#sensor-data-table').find('tbody').append(`
            <tr style="width: 100%;">
                <th id="sensorData1${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></th>
                <td id="sensorData2${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
                <td id="sensorData3${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
                <td id="sensorData4${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
                <td id="sensorData5${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
                <td id="sensorData6${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
                <td id="sensorData7${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
                <td id="sensorData8${row}" class="table-row" style="padding:0; vertical-align: middle; font-size: 1.8vh;"></td>
        `)
    }
}

async function fetchData() {
    const dateTime = getDateTimeString()
    
    await fetch('/data/tag_desc/sensor?'
        + new URLSearchParams({num_machine: sel}))
        .then(response => response.json())
        .then(jsonData => {
            tag_desc_data = jsonData.data
        })

    await fetch('/data/raw_data_sensor?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_raw_data = jsonData.data
        })

    await fetch('/data/sensor_pred?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_pred_data = jsonData.data
        })

    await fetch('/data/sensor_normal_ratio?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_normal_ratio_data = jsonData.data
        })

    await fetch('/data/sensor_status?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_pred_flag_data = jsonData.data
        })
    await updateSensorFaultRankList()
    await drawSensorDataTable()
}

async function drawSensorDataTable() {
    for (i=0 ; i<sensor_fault_rank_list.length ; i++) {
        let actual_value = sensor_fault_rank_list[i]['sensor_raw_data']
		let predict_value = sensor_fault_rank_list[i]['predict_value']
        let diff = actual_value - predict_value
        let status = sensor_fault_rank_list[i]['sensor_status']
        let sigma = sensor_fault_rank_list[i]['tag_desc_data']['Sigma']
        $(`#sensorData1${i + 1}`).text(sensor_fault_rank_list[i]['tag_desc_data']['Tag'])
        $(`#sensorData2${i + 1}`).text(actual_value.toFixed(2))
        $(`#sensorData3${i + 1}`).text(predict_value.toFixed(2))
        $(`#sensorData4${i + 1}`).text(diff.toFixed(2))
        $(`#sensorData5${i + 1}`).text(sigma.toFixed(2))
        $(`#sensorData6${i + 1}`).text((diff / sigma).toFixed(2))
        if (status == 0) {
            $(`#sensorData7${i + 1}`).text('정상')
            $(`#sensorData7${i + 1}`).css('color', 'white')
        } else {
            $(`#sensorData7${i + 1}`).text('고장')
            $(`#sensorData7${i + 1}`).css('color', 'red')
        }       
        $(`#sensorData8${i + 1}`).text(sensor_fault_rank_list[i]['sensor_normal_ratio'].toFixed(2))
    }
}

async function updateSensorFaultRankList() {
	temp_fault = []
    temp_normal = []
	for (const [key, value] of Object.entries(sensor_pred_flag_data)) {
		if (key != 'DateTime') {
            let index = parseInt(key.substring(4))
            if (value == 1) {
                temp_fault.push({
                    'tag_desc_data': tag_desc_data[index - 1],
                    'sensor_raw_data': sensor_raw_data[tag_desc_data[index - 1].var],
                    'predict_value': sensor_pred_data[key],
                    'sensor_normal_ratio': sensor_normal_ratio_data[key],
                    'sensor_status': sensor_pred_flag_data[key],
                })
            } else {
                temp_normal.push({
                    'tag_desc_data': tag_desc_data[index - 1],
                    'sensor_raw_data': sensor_raw_data[tag_desc_data[index - 1].var],
                    'predict_value': sensor_pred_data[key],
                    'sensor_normal_ratio': sensor_normal_ratio_data[key],
                    'sensor_status': sensor_pred_flag_data[key],
                })
            }
		}
	}

	temp_fault.sort(function(a, b) {
		return a['sensor_normal_ratio'] - b['sensor_normal_ratio']
	})
    temp_normal.sort(function(a, b) {
		return a['sensor_normal_ratio'] - b['sensor_normal_ratio']
	})

	sensor_fault_rank_list = temp_fault.concat(temp_normal)
}

function onClickBack() {
    window.location.href = `http://localhost:8080/${sel}/machine`
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timerRoutine() {
	while(true) {
		if (getDateTimeString() != sensor_raw_data.DateTime) {
			console.log('update')
			await fetchData()
			break;
		} else {
			console.log('not yet')
		}
		await sleep(1000)
	}
}

async function setTimerRoutine() {
	setInterval(timerRoutine, 60000)
}

$(document).ready(async function() {
    makeTablesRows()
    await fetchData()
    await setTimerRoutine()
})