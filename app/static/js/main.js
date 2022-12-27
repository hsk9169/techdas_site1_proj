import {Chart} from "../js/chartjs/auto/auto.js"

var analyzer_seva_chart_data
var analyzer_seva_graph_data
var lineGraph1, lineGraph2, lineGraph3, lineGraph4
var lineGraphCtx1, lineGraphCtx2, lineGraphCtx3, lineGraphCtx4
var barGraph1, barGraph2
var barGraphCtx1, barGraphCtx2

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

//------- Chart JS
var analyzer_seva_chart_data1 = {}, analyzer_seva_chart_data2 = {}
var barGraph1, barGraph2

var barGraphOption1 = {
	responsive: false,
    scales: {
      y: {
        border: {
          display: true,
          color: 'white',
        },
        ticks: { color: 'white', beginAtZero: true },
        title: {
          display: true,
          text: 'O2[%]',
          color: 'white',
        },
      },
      x: {
        border: {
          display: true,
          color: 'white',
        },
        ticks: { color: 'white', beginAtZero: true },
      }
    },
    plugins: {
      legend: {display: false},
    },
}

var barGraphOption2 = {
	responsive: false,
  	scales: {
  	  	y: {
  	  	  	border: {
  	  	  	  	display: true,
  	  	  	  	color: 'white',
  	  	  	},
  	  	  	ticks: { color: 'white', beginAtZero: true },
  	  	  	title: {
  	  	  	  	display: true,
  	  	  	  	text: 'CO[ppm]',
  	  	  	  	color: 'white',
  	  	  	},
  	  	},
  	  	x: {
  	  	  	border: {
  	  	  	  	display: true,
  	  	  	  	color: 'white',
  	  	  	},
  	  	  	ticks: { color: 'white', beginAtZero: true },
  	  	}
  	},
  	plugins: {
  	  	legend: {display: false},
  	}
}

var lineGraphOption = {
    elements: {
      point: {
        radius: 0.5,
      },
    },
    responsive: false,
    scales: { 
      y: {
        border: {
          display: true,
          color: 'white',
        },
        ticks: { color: 'white', beginAtZero: true },
      },
      x: {
        border: {
          display: true,
          color: 'white',
        },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: {display: false},
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
		Object.keys(jsonData).forEach((key) => {
		  let temp1 = [], temp2 = []
		  Object.keys(jsonData[key]).forEach((subKey) => {
			if (subKey != 'DateTime' && subKey != 'y5') {
			  temp1.push(jsonData[key][subKey])
			} else if (subKey == 'y5') {
			  temp2.push(jsonData[key][subKey])
			}
		  })
		  if (temp1.length > 0) {
			analyzer_seva_chart_data1[key] = temp1
		  }
		  if (temp2.length > 0) {
			analyzer_seva_chart_data2[key] = temp2
		  }
		})
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
	
	await drawBarGraph()
	await drawAnalyzerSevaTable()
	await drawTdlsStatusTable()
	await updateAnalyzerSevaGraphsData()
	await drawFalutDetectionTable()
	await updateSensorFaultRankList()
	await drawFaultStatusTable()
}

async function initCharts () {
    barGraphCtx1 = document.getElementById('analyzer_seva_chart_1')
    barGraphCtx2 = document.getElementById('analyzer_seva_chart_2')
	lineGraphCtx1 = document.getElementById('analyzer_seva_graph_1')
	lineGraphCtx2 = document.getElementById('analyzer_seva_graph_2')
	lineGraphCtx3 = document.getElementById('analyzer_seva_graph_3')
	lineGraphCtx4 = document.getElementById('analyzer_seva_graph_4')

    let barGraphData1 = {
        labels: [
			'예열대 상부 O2',
			'예열대 하부 O2',
			'균열대 하부 O2',
			'Stack O2'],
        datasets: [],
    }
	let barGraphData2 = {
        labels: ['예열대 상부 CO'],
        datasets: [],
    }
	let lineGraphData = {
		labels: [],
		datasets: [],
	}

    let barGraphConfig1 = {type: 'bar', options: barGraphOption1, data: barGraphData1}
    let barGraphConfig2 = {type: 'bar', options: barGraphOption2, data: barGraphData2}
	let lineGraphConfig = {type: 'line', options: lineGraphOption, data: lineGraphData}
    barGraph1 = new Chart(barGraphCtx1, barGraphConfig1)
    barGraph2 = new Chart(barGraphCtx2, barGraphConfig2)
	lineGraph1 = new Chart(lineGraphCtx1, lineGraphConfig)
	lineGraph2 = new Chart(lineGraphCtx2, lineGraphConfig)
	lineGraph3 = new Chart(lineGraphCtx3, lineGraphConfig)
	lineGraph4 = new Chart(lineGraphCtx4, lineGraphConfig)
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

async function drawBarGraph() {
	let barGraphData1 = {
	  labels: [
		'예열대 상부 O2',
		'예열대 하부 O2',
		'균열대 하부 O2',
		'Stack O2'
	  ],
	  datasets: [
		{
		  label: '#1',
		  data: analyzer_seva_chart_data1.data1,
		  backgroundColor: 
			  'rgba(105, 151, 206)',          
		},
		{
		  label: '#2',
		  data: analyzer_seva_chart_data1.data2,
		  backgroundColor: 
			  'rgba(136, 150, 174)',
		},
		{
		  label: '#3',
		  data: analyzer_seva_chart_data1.data3,
		  backgroundColor: 
			  'rgba(71, 83, 104)',
		},
		{
		  label: '#4',
		  data: analyzer_seva_chart_data1.data4,
		  backgroundColor: 
			  'rgba(165, 194, 227)',
		},
	  ]
	}
  
	let barGraphData2 = {
	  labels: [
		'예열대 상부 CO',
	  ],
	  datasets: [
		{
		  label: '#1',
		  data: analyzer_seva_chart_data2.data1,
		  backgroundColor: 
			  'rgba(105, 151, 206)',          
		},
		{
		  label: '#2',
		  data: analyzer_seva_chart_data2.data2,
		  backgroundColor: 
			  'rgba(136, 150, 174)',
		},
		{
		  label: '#3',
		  data: analyzer_seva_chart_data2.data3,
		  backgroundColor: 
			  'rgba(71, 83, 104)',
		},
		{
		  label: '#4',
		  data: analyzer_seva_chart_data2.data4,
		  backgroundColor: 
			  'rgba(165, 194, 227)',
		},
	  ]
	}
	
	barGraph1.config.data = barGraphData1
	barGraph2.config.data = barGraphData2

	barGraph1.update()
	barGraph2.update()
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
	for (let i=0 ; i<5 ; i++) {
		$(`#faultStatusData1${i + 1}`).text('')
		$(`#faultStatusData2${i + 1}`).text('')
		$(`#faultStatusData3${i + 1}`).text('')
		$(`#faultStatusData4${i + 1}`).text('')
		$(`#faultStatusData5${i + 1}`).text('')
	}

	for (let i=0 ; i<sensor_fault_rank_list.length ; i++) {
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
	let dateTimeTemp = [], dataTemp1 = [], dataTemp2 = [], dataTemp3 = [], dataTemp4 = []
	analyzer_seva_graph_data.map(row => {
		dateTimeTemp.push(row.DateTime)
		dataTemp1.push(row.y1)
		dataTemp2.push(row.y2)
		dataTemp3.push(row.y3)
		dataTemp4.push(row.y4)
	})

	let lineGraphData1 = {
		labels: dateTimeTemp,
		datasets: [
			{
				label: '예열대 상부 O2',
				data: dataTemp1,
				backgroundColor: 'rgba(1, 0, 255)',
				bordercolor: 'rgba(1, 0, 255)',
				borderWidth: 5,
			}
		]
	}
	let lineGraphData2 = {
		labels: dateTimeTemp,
		datasets: [
			{
				label: '예열대 하부 O2',
				data: dataTemp2,
				backgroundColor: 'rgba(1, 0, 255)',
				bordercolor: 'rgba(1, 0, 255)',
				borderWidth: 1,
			}
		]
	}
	let lineGraphData3 = {
		labels: dateTimeTemp,
		datasets: [
			{
				label: '균열대 하부 O2',
				data: dataTemp3,
				backgroundColor: 'rgba(1, 0, 255)',
				bordercolor: 'rgba(1, 0, 255)',
				borderWidth: 1,
			}
		]
	}
	let lineGraphData4 = {
		labels: dateTimeTemp,
		datasets: [
			{
				label: '예열대 상부 CO',
				data: dataTemp4,
				backgroundColor: 'rgba(1, 0, 255)',
				bordercolor: 'rgba(1, 0, 255)',
				borderWidth: 1,
			}
		]
	}

	lineGraph1.config.data = lineGraphData1
	lineGraph2.config.data = lineGraphData2
	lineGraph3.config.data = lineGraphData3
	lineGraph4.config.data = lineGraphData4
	lineGraph1.update()
	lineGraph2.update()
	lineGraph3.update()
	lineGraph4.update()
	console.log('update')
}

async function updateSensorFaultRankList() {
	let temp = []
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
	await initCharts()

	await fetchData()
	
	await setTimerRoutine()
})

$(window).resize(function() {
	barGraph1.update()
	barGraph2.update()
	lineGraph1.update()
	lineGraph2.update()
	lineGraph3.update()
	lineGraph4.update()
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
