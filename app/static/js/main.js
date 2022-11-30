var analyzer_seva_chart_1, analyzer_seva_chart_2
var analyzer_seva_graph_1, analyzer_seva_graph_2, analyzer_seva_graph_3, analyzer_seva_graph_4
var analyzer_seva_chart_data
var analyzer_seva_graph_data
var analyzer_seva_chart_data_table_1, analyzer_seva_chart_data_table_2
var analyzer_seva_graph_data_table_1, analyzer_seva_graph_data_table_2, analyzer_seva_graph_data_table_3, analyzer_seva_graph_data_table_4
var tag_desc_data
var tdls_status_data
var analyzer_seva_data
var limit_info_data
var fault_detection_data
var sensor_raw_data
var sensor_pred_data
var sensor_normal_ratio_data
var sensor_pred_flag_data
var machine_option = 1
var sensor_fault_rank_list = []

const analyzer_seva_chart_options_1 = {
	chartArea: {width: '80%', left: '10%', right: 0},
	legend: {position: 'none'},
	backgroundColor: '#000',
	seriesType: 'bars',
	series: {5: {type: 'line'}},
	hAxis: {
		textStyle:{color: '#FFF'},
		baselineColor: '#FFF',
	},
	vAxis: {
		textStyle:{color: '#FFF'},
		baselineColor: '#FFF',
	},
	vAxes: {
		0: {title: 'O2 [%]', titleColor: '#FFF'},
	}
}

const analyzer_seva_chart_options_2 = {
	chartArea: {width: '80%', left: '20%', right: 0},
	legend: {position: 'none'},
	backgroundColor: '#000',
	seriesType: 'bars',
	series: {5: {type: 'line'}},
	hAxis: {
		textStyle:{color: '#FFF'},
		baselineColor: '#FFF',
	},
	vAxis: {
		textStyle:{color: '#FFF'},
		baselineColor: '#FFF',
	},
	vAxes: {
		0: {title: 'CO [ppm]', titleColor: '#FFF'},
	}
}

const analyzer_seva_graph_options = {
	chartArea: {width: '75%', left: '5%', right: '5%', top: '20%', bottom: '20%'},
	legend: {position: 'none'},
	hAxis: {
	  textStyle: {color: 'transparent'},
	  gridlines: {color: 'transparent'},
	  baselineColor: '#FFF',
	},
	vAxis: {
	  textStyle:{color: '#FFF'},
	  gridlines: {color: 'transparent'},
	  baselineColor: '#FFF',
	},
	backgroundColor: '#000',
	series: {
		0: { color: '#0100FF' }
	}
}

async function fetchData() {
	const dateTime = getDateTimeString()
	
	await fetch('/data/analyzer_seva?' + new URLSearchParams({
		num_machine: 0,
		date_time: dateTime,
	}))
		.then(response => response.json())
		.then(jsonData => {
			analyzer_seva_chart_data = jsonData
		})
	
	await fetch('/data/limit_info?' + new URLSearchParams({
		num_machine: 0
	}))
		.then(response => response.json())
		.then(jsonData => {
			limit_info_data = jsonData
		})
	
	await fetch('/data/tag_desc/sensor?' + new URLSearchParams({
		num_machine: machine_option,
	}))
	.then(response => response.json())
	.then(jsonData => {
		tag_desc_data = jsonData.data
	})
	

	await fetch('/data/analyzer_status?' + new URLSearchParams({
		date_time: dateTime,
	}))
		.then(response => response.json())
		.then(jsonData => {
			tdls_status_data = jsonData
		})
	
	await fetch('/data/analyzer_seva/all?' + new URLSearchParams({
			num_machine: machine_option,
			date_time: dateTime,
		}))
		.then(response => response.json())
		.then(jsonData => {
			analyzer_seva_graph_data = jsonData.data
		})
	
	await fetch('/data/fault_detection?' + new URLSearchParams({
		date_time: dateTime,
	}))
		.then(response => response.json())
		.then(jsonData => {
			fault_detection_data = jsonData
		})

	await fetch('/data/raw_data_sensor?' + new URLSearchParams({
        num_machine: machine_option,
        date_time: dateTime,
    }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_raw_data = jsonData.data
        })

	await fetch('/data/sensor_pred?' + new URLSearchParams({
        num_machine: machine_option,
        date_time: dateTime,
    }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_pred_data = jsonData.data
        })
	
	await fetch('/data/sensor_normal_ratio?' + new URLSearchParams({
        num_machine: machine_option,
        date_time: dateTime,
    }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_normal_ratio_data = jsonData.data
        })
	
	await fetch('/data/sensor_status?' 
        + new URLSearchParams({
            num_machine: machine_option,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            sensor_pred_flag_data = jsonData.data
        })
	
	await updateAnalyzerSevaChartData()
	await drawAnalyzerSevaTable()
	await drawTdlsStatusTable()
	await updateAnalyzerSevaGraphsData()
	await drawFalutDetectionTable()
	await updateSensorFaultRankList()
	await drawFaultStatusTable()
}


async function initGoogleCharts() {
	analyzer_seva_chart_1 = await new google.visualization.ComboChart(document.getElementById('analyzer_seva_chart_1'))
	analyzer_seva_chart_data_table_1 = await new google.visualization.DataTable()
	analyzer_seva_chart_data_table_1.addColumn('string', 'chart_type')
	analyzer_seva_chart_data_table_1.addColumn('number', '#1')
	analyzer_seva_chart_data_table_1.addColumn('number', '#2')
	analyzer_seva_chart_data_table_1.addColumn('number', '#3')
	analyzer_seva_chart_data_table_1.addColumn('number', '#4')

	analyzer_seva_chart_2 = await new google.visualization.ComboChart(document.getElementById('analyzer_seva_chart_2'))
	analyzer_seva_chart_data_table_2 = await new google.visualization.DataTable()
	analyzer_seva_chart_data_table_2.addColumn('string', 'chart_type')
	analyzer_seva_chart_data_table_2.addColumn('number', '#1')
	analyzer_seva_chart_data_table_2.addColumn('number', '#2')
	analyzer_seva_chart_data_table_2.addColumn('number', '#3')
	analyzer_seva_chart_data_table_2.addColumn('number', '#4')

	analyzer_seva_graph_1 = await new google.visualization.LineChart(document.getElementById('analyzer_seva_graph_1'))
	analyzer_seva_graph_data_table_1 = await new google.visualization.DataTable()
	analyzer_seva_graph_data_table_1.addColumn('string', 'timestamp')
	analyzer_seva_graph_data_table_1.addColumn('number', '예열대 상부 O2 %')

	analyzer_seva_graph_2 = await new google.visualization.LineChart(document.getElementById('analyzer_seva_graph_2'))
	analyzer_seva_graph_data_table_2 = await new google.visualization.DataTable()
	analyzer_seva_graph_data_table_2.addColumn('string', 'timestamp')
	analyzer_seva_graph_data_table_2.addColumn('number', '예열대 하부 O2 %')

	analyzer_seva_graph_3 = await new google.visualization.LineChart(document.getElementById('analyzer_seva_graph_3'))
	analyzer_seva_graph_data_table_3 = await new google.visualization.DataTable()
	analyzer_seva_graph_data_table_3.addColumn('string', 'timestamp')
	analyzer_seva_graph_data_table_3.addColumn('number', '균열대 하부 O2 %')

	analyzer_seva_graph_4 = await new google.visualization.LineChart(document.getElementById('analyzer_seva_graph_4'))
	analyzer_seva_graph_data_table_4 = await new google.visualization.DataTable()
	analyzer_seva_graph_data_table_4.addColumn('string', 'timestamp')
	analyzer_seva_graph_data_table_4.addColumn('number', '예열대 상부 CO %')
}

async function drawTdlsStatusTable() {
	for (const [key, value] of Object.entries(tdls_status_data)) {
		$(`#tdlsStatus${key.substring(4)}1`).removeClass()
		$(`#tdlsStatus${key.substring(4)}2`).removeClass()
		$(`#tdlsStatus${key.substring(4)}3`).removeClass()
		$(`#tdlsStatus${key.substring(4)}4`).removeClass()
		$(`#tdlsStatus${key.substring(4)}5`).removeClass()

		$(`#tdlsStatus${key.substring(4)}1`)
			.addClass(
				value.y1 == 0 ? 'status-dot-good' :
				value.y1 == 1 ? 'status-dot-normal' :
				'status-dot-bad'
			)
		$(`#tdlsStatus${key.substring(4)}2`)
			.addClass(
				value.y2 == 0 ? 'status-dot-good' :
				value.y2 == 1 ? 'status-dot-normal' :
				'status-dot-bad'
			)
		$(`#tdlsStatus${key.substring(4)}3`)
			.addClass(
				value.y3 == 0 ? 'status-dot-good' :
				value.y3 == 1 ? 'status-dot-normal' :
				'status-dot-bad'
			)
		$(`#tdlsStatus${key.substring(4)}4`)
			.addClass(
				value.y4 == 0 ? 'status-dot-good' :
				value.y4 == 1 ? 'status-dot-normal' :
				'status-dot-bad'
			)
		$(`#tdlsStatus${key.substring(4)}5`)
			.addClass(
				value.y5 == 0 ? 'status-dot-good' :
				value.y5 == 1 ? 'status-dot-normal' :
				'status-dot-bad'
			)
	}
}

function setDataColor(obj, val, yellow, red) {
	if (val <= yellow) {
		obj.css({'color': 'white'})
	} else if (val > yellow && val <= red) {
		obj.css({'color': 'yellow'})
	} else {
		obj.css({'color': 'red'})
	}
}

async function drawAnalyzerSevaTable() {
	for (const [key, value] of Object.entries(analyzer_seva_chart_data)) {
		console.log(limit_info_data)
		$(`#analyzerSevaData${key.substring(4)}1`)
			.text(value.y1.toFixed(2))
		setDataColor($(`#analyzerSevaData${key.substring(4)}1`), 
			value.y1, limit_info_data[key][0].yellow, limit_info_data[key][0].red)
		$(`#analyzerSevaData${key.substring(4)}2`)
			.text(value.y2.toFixed(2))
		setDataColor($(`#analyzerSevaData${key.substring(4)}2`), 
			value.y2, limit_info_data[key][1].yellow, limit_info_data[key][1].red)
		$(`#analyzerSevaData${key.substring(4)}3`)
			.text(value.y3.toFixed(2))
		setDataColor($(`#analyzerSevaData${key.substring(4)}3`), 
			value.y3, limit_info_data[key][2].yellow, limit_info_data[key][2].red)
		$(`#analyzerSevaData${key.substring(4)}4`)
			.text(value.y4.toFixed(2))
		setDataColor($(`#analyzerSevaData${key.substring(4)}4`), 
			value.y4, limit_info_data[key][3].yellow, limit_info_data[key][3].red)
		$(`#analyzerSevaData${key.substring(4)}5`)
			.text(value.y5.toFixed(2))
		setDataColor($(`#analyzerSevaData${key.substring(4)}5`), 
			value.y5, limit_info_data[key][4].yellow, limit_info_data[key][4].red)
	}
	limit_info_data.data1.forEach((element, index) => {
		$(`#analyzerSevaData5${index+1}`)
			.text(element.yellow)
		$(`#analyzerSevaData6${index+1}`)
			.text(element.red)
	})

}

async function updateAnalyzerSevaChartData() {
	let data1, data2, data3, data4
	try {
		analyzer_seva_chart_data_table_1.removeRows(0, analyzer_seva_chart_data_table_1.getNumberOfRows())
		analyzer_seva_chart_data_table_2.removeRows(0, analyzer_seva_chart_data_table_2.getNumberOfRows())
		data1 = analyzer_seva_chart_data.data1
		data2 = analyzer_seva_chart_data.data2
		data3 = analyzer_seva_chart_data.data3
		data4 = analyzer_seva_chart_data.data4
	} catch {}

	analyzer_seva_chart_data_table_1.addRows([
		['예열대 상부 O2', data1.y1, data2.y1, data3.y1, data4.y1],
		['예열대 하부 O2', data1.y2, data2.y2, data3.y2, data4.y2],
		['균열대 하부 O2', data1.y3, data2.y3, data3.y3, data4.y3],
		['Stack O2', data1.y5, data2.y5, data3.y5, data4.y5]
	])

	analyzer_seva_chart_data_table_2.addRows([
		['예열대 상부 CO', data1.y4, data2.y4, data3.y4, data4.y4]
	])
	
	analyzer_seva_chart_1.draw(analyzer_seva_chart_data_table_1, analyzer_seva_chart_options_1)
	analyzer_seva_chart_2.draw(analyzer_seva_chart_data_table_2, analyzer_seva_chart_options_2)
}

async function drawFalutDetectionTable() {
	for (const [key, value] of Object.entries(fault_detection_data)) {
		$(`#faultDetection${key.substring(4)}1`).removeClass()
		$(`#faultDetection${key.substring(4)}1`)
			.addClass(
				value.Status == 0 ? 'status-dot-good' :
				value.Status == 1 ? 'status-dot-normal' :
				'status-dot-bad'
			)
	}
}

async function drawFaultStatusTable() {
	for (i=0 ; i<5 ; i++) {
		$(`#faultStatusData1${i + 1}`).text('')
		$(`#faultStatusData2${i + 1}`).text('')
		$(`#faultStatusData3${i + 1}`).text('')
		$(`#faultStatusData4${i + 1}`).text('')
		$(`#faultStatusData5${i + 1}`).text('')
	}

	for (i=0 ; i<sensor_fault_rank_list.length ; i++) {
		let actual_value = sensor_fault_rank_list[i]['sensor_raw_data']
		let predict_value = sensor_fault_rank_list[i]['predict_value']
		$(`#faultStatusData1${i + 1}`).text(sensor_fault_rank_list[i]['tag_desc_data'].Tag)
		$(`#faultStatusData2${i + 1}`).text(actual_value.toFixed(2))
		$(`#faultStatusData3${i + 1}`).text(predict_value.toFixed(2))
		$(`#faultStatusData4${i + 1}`).text((actual_value - predict_value).toFixed(2))
		$(`#faultStatusData5${i + 1}`).text(sensor_fault_rank_list[i]['sensor_normal_ratio'].toFixed(2))		
	}
}
 
async function updateAnalyzerSevaGraphsData() {
	try {
		analyzer_seva_graph_data_table_1.removeRows(0, analyzer_seva_graph_data_table_1.getNumberOfRows())
		analyzer_seva_graph_data_table_2.removeRows(0, analyzer_seva_graph_data_table_2.getNumberOfRows())
		analyzer_seva_graph_data_table_3.removeRows(0, analyzer_seva_graph_data_table_3.getNumberOfRows())
		analyzer_seva_graph_data_table_4.removeRows(0, analyzer_seva_graph_data_table_4.getNumberOfRows())
		console.log('remove')
	} catch {}

	analyzer_seva_graph_data.forEach(element => {
		analyzer_seva_graph_data_table_1.addRow([element.DateTime, element.y1])
		analyzer_seva_graph_data_table_2.addRow([element.DateTime, element.y2])
		analyzer_seva_graph_data_table_3.addRow([element.DateTime, element.y3])
		analyzer_seva_graph_data_table_4.addRow([element.DateTime, element.y4])
	})
	
	analyzer_seva_graph_1.draw(analyzer_seva_graph_data_table_1, analyzer_seva_graph_options)
	analyzer_seva_graph_2.draw(analyzer_seva_graph_data_table_2, analyzer_seva_graph_options)
	analyzer_seva_graph_3.draw(analyzer_seva_graph_data_table_3, analyzer_seva_graph_options)
	analyzer_seva_graph_4.draw(analyzer_seva_graph_data_table_4, analyzer_seva_graph_options)
	console.log('draw')
}

async function updateSensorFaultRankList() {
	temp = []
	for (const [key, value] of Object.entries(sensor_pred_flag_data)) {
		if (key != 'DateTime') {
			if (value == 1) {
				let index = parseInt(key.substring(4))
				temp.push({
					'tag_desc_data': tag_desc_data[index - 1],
					'sensor_raw_data': sensor_raw_data[tag_desc_data[index - 1].var],
					'predict_value': sensor_pred_data[key],
					'sensor_normal_ratio': sensor_normal_ratio_data[key]
				})
			}
		}
	}

	temp.sort(function(a, b) {
		return a['sensor_normal_ratio'] - b['sensor_normal_ratio']
	})
	sensor_fault_rank_list = temp.slice(0, 5)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timerRoutine() {
	while(true) {
		if (getDateTimeString() != tdls_status_data.data1.DateTime) {
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
	await google.charts.load('current', {packages:['bar', 'line']})
	await google.charts.load('visualization', 'current', {packages: ['corechart']})
	await google.charts.setOnLoadCallback(initGoogleCharts)

	await fetchData()
	
	await setTimerRoutine()
})

$(window).resize(function() {
	analyzer_seva_chart_1.draw(analyzer_seva_chart_data_table_1, analyzer_seva_chart_options_1)
	analyzer_seva_chart_2.draw(analyzer_seva_chart_data_table_2, analyzer_seva_chart_options_2)
	analyzer_seva_graph_1.draw(analyzer_seva_graph_data_table_1, analyzer_seva_graph_options)
	analyzer_seva_graph_2.draw(analyzer_seva_graph_data_table_2, analyzer_seva_graph_options)
	analyzer_seva_graph_3.draw(analyzer_seva_graph_data_table_3, analyzer_seva_graph_options)
	analyzer_seva_graph_4.draw(analyzer_seva_graph_data_table_4, analyzer_seva_graph_options)
})

$('select').on('change', async function() {
	const dateTime = getDateTimeString()
	machine_option = this.value

	await fetch('/data/analyzer_seva/all?' + new URLSearchParams({
		num_machine: this.value,
		date_time: dateTime
	}))
		.then(response => response.json())
		.then(jsonData => {
			analyzer_seva_graph_data = jsonData.data
		})

	await fetch('/data/raw_data_sensor?' + new URLSearchParams({
		num_machine: machine_option,
		date_time: dateTime,
	}))
		.then(response => response.json())
		.then(jsonData => {
			sensor_raw_data = jsonData.data
		})

	await fetch('/data/sensor_pred?' + new URLSearchParams({
		num_machine: machine_option,
		date_time: dateTime,
	}))
		.then(response => response.json())
		.then(jsonData => {
			sensor_pred_data = jsonData.data
		})
	
	await fetch('/data/sensor_normal_ratio?' + new URLSearchParams({
		num_machine: machine_option,
		date_time: dateTime,
	}))
		.then(response => response.json())
		.then(jsonData => {
			sensor_normal_ratio_data = jsonData.data
		})
	
	await fetch('/data/sensor_status?' 
	    + new URLSearchParams({
	        num_machine: machine_option,
	        date_time: dateTime,
	    }))
	    .then(response => response.json())
	    .then(jsonData => {
	        sensor_pred_flag_data = jsonData.data
	    })
	
	await updateAnalyzerSevaGraphsData()
	await updateSensorFaultRankList()
	await drawFaultStatusTable()
})
