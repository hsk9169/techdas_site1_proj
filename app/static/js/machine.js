var temp_monitoring_chart
var temp_monitoring_chart_data_table
var o2_co_histogram_chart
var o2_co_histogram_chart_data
var o2_co_histogram_chart_data_table
var tdls_graph_1, tdls_graph_2
var analyer_pred_graph_data, raw_data_graph_data
var tdls_graph_data_table_1, tdls_graph_data_table_2

var analyzer_seva_data
var temp_monitoring_data
var air_ratio_data
var sv_value_data
var analyzer_pred_data
var raw_data_tdls_data
var analyzer_status_data
var analyzer_normal_ratio_data

var chart1_sel = 0, chart2_sel = 0

const temp_monitoring_chart_option = {
    legend: {position: 'none'},
	backgroundColor: '#000000',
    series: {
        0: {color: '#FFC000', visibleInLegend: false}
    },
    chartArea: {width: '80%', top: '10%', bottom: '10%', left: '10%', right: '10%'},
    hAxis: {
        titleTextStyle:{color: '#FFFFFF'},
        textStyle:{color: '#FFFFFF'},
		baselineColor: '#FFFFFF',
        gridlines: {color: 'transparent'},
    },
    vAxis: {
        titleTextStyle:{color: '#FFFFFF'},
        textStyle:{color: '#FFFFFF'},
		baselineColor: '#FFFFFF',
        gridlines: {color: 'transparent'},
    },
    bars: 'horizontal'
};

const o2_co_histogram_chart_option = {
    hAxis: {
        title: 'O2', 
        minValue: 0,
        maxValue: 21,
        textStyle: {color: '#FFF'}, 
        baselineColor: '#FFF', 
        gridlines: {color: 'transparent'}},
    vAxis: {
        title: 'CO', 
        minValue: 0,
        maxValue: 3000,
        textStyle: {color: '#FFF'}, 
        baselineColor: '#FFF', 
        gridlines: {color: 'transparent'}},
    legend: {
        position: 'topLeft',
        textStyle: {color: '#FFFFFF'}
    },
    backgroundColor: 'none',
    chartArea: {width: '90%', left: '15%', right: '20%'},
    series: {
        0: { color: '#F5C242'}
    }
}

const tdls_graph_options = {
    chartArea: {width: '100%', left: '5%', right: '5%'},
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
	backgroundColor: '#000000',
	series: {
		0: { color: '#0100FF' },
		1: { color: '#B12418' }
	}
}

function makeAirRatioTableRows() {
    let rowLen
    if (sel == 1) {
        rowLen = 7
    } else {
        rowLen = 8
    }
    for (row=1 ; row<=rowLen; row++) {
        $('#air-ratio-table').find('tbody').append(`
            <tr>
                <th class="table-row" style="padding: 0; vertical-align: middle; font-size: 1.8vh;">z#${row}</th>
                <td class="table-row" style="padding: 0; vertical-align: middle; font-size: 1.8vh;"><b id="airRatioData${row}"></b></td>
        `)
    }
}

function makeMachineDataTableRows() {
    for (row=1 ; row<=8 ; row++) {
        $('#machine-data-table').append('<tr style="width: 100%">')
        for (col=1 ; col<=12 ; col++) {
            if (col == 1 || col == 4 || col == 11) {
                $('#machine-data-table').append(`
                    <td id=machineData${col}${row} class="table-row" style="width: 13%; height: 12.5%; padding: 0; vertical-align: middle; font-size: 0.8vh;"></td>
                `)
            } else {
                $('#machine-data-table').append(`
                    <td id=machineData${col}${row} class="table-row" style="width: 6.5%; height: 12.5%; padding: 0; vertical-align: middle; font-size: 0.8vh;"></td>
                `)
            }
        }
    }
    $('#machineData14').text('Stack O2 %')
    $('#machineData14').css('padding-right', '2%')

    $('#machineData42').text('Pre CO ppm')
    $('#machineData43').text('Pre U O2 %')

    $('#machineData51').text('공기비')
    $('#machineData52').text('온도')

    $('#machineData61').text('Z1 AR')
    $('#machineData62').text('Z1 T C')

    $('#machineData71').text('Z2 AR')
    $('#machineData72').text('Z2 T C')
    $('#machineData77').text('공기비')
    $('#machineData78').text('온도')

    $('#machineData81').text('Z4 AR')
    $('#machineData82').text('Z4 T C')
    $('#machineData87').text('Z3 AR')
    $('#machineData88').text('Z3 T C')

    $('#machineData91').text('Z6 AR')
    $('#machineData92').text('Z6 T C')
    $('#machineData97').text('Z5 AR')
    $('#machineData98').text('Z5 T C')

    $('#machineData101').text('Z7 AR')
    $('#machineData102').text('Z7 T C')

    $('#machineData112').text('Z8 AR')
    $('#machineData113').text('Z8 T C')
    $('#machineData117').text('Stack O2 %')

}

async function fetchData() {
    const dateTime = getDateTimeString()

    await fetch('/data/analyzer_pred/all?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            analyzer_pred_data = jsonData
        })

    await fetch('/data/temp_monitoring?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            temp_monitoring_data = jsonData.data
        })

    await fetch('/data/analyzer_seva?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime
        }))
        .then(response => response.json())
        .then(jsonData => {
            analyzer_seva_data = jsonData.data
        })

    await fetch('/data/air_ratio?'
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            air_ratio_data = jsonData.data
        })

    await fetch('/data/analyzer_pred?'
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            analyzer_pred_data = jsonData.data
        })

    await fetch('/data/sv_value?'
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            sv_value_data = jsonData.data
        })

    await fetch('/data/raw_data_tdls?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            raw_data_tdls_data = jsonData.data
    })

    await fetch('/data/analyzer_normal_ratio?' 
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            analyzer_normal_ratio_data = jsonData.data
    })
    
    await fetch('/data/analyzer_status?'
        + new URLSearchParams({
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            switch(parseInt(sel)) {
                case 1:
                    analyzer_status_data = jsonData.data1
                    break;
                case 2:
                    analyzer_status_data = jsonData.data2
                    break;
                case 3:
                    analyzer_status_data = jsonData.data3
                    break;
                case 4:
                    analyzer_status_data = jsonData.data4
                    break;
                default:
                    break;
            }
        })

    
    await drawO2ControllerStateTable()
    await updateTempMonitoringChartData()
    await drawTdlsStatusTable()
    await updateO2COHistogramData()
    await updateTempMonitoringChartData()
    await drawAirRatioTable()
    await updateTdlsGraphData(1, chart1_sel)
    await updateTdlsGraphData(2, chart2_sel)
}

async function initGoogleCharts() {
    temp_monitoring_chart = await new google.visualization.BarChart(document.getElementById('temp_monitoring_chart'))
    temp_monitoring_chart_data_table = await new google.visualization.DataTable()
    temp_monitoring_chart_data_table.addColumn('string', '')
    temp_monitoring_chart_data_table.addColumn('number', 'temp')
    temp_monitoring_chart_data_table.addColumn({role: 'style'})

    o2_co_histogram_chart = await new google.visualization.ScatterChart(document.getElementById('o2_co_histogram_chart'))
    o2_co_histogram_chart_data_table = await new google.visualization.DataTable()
    o2_co_histogram_chart_data_table.addColumn('number', 'O2')
    o2_co_histogram_chart_data_table.addColumn('number', '현재값')

    tdls_graph_1 = await new google.visualization.LineChart(document.getElementById('selected-chart-1'))
    tdls_graph_data_table_1 = await new google.visualization.DataTable()
    tdls_graph_data_table_1.addColumn('string', 'timestamp')
    tdls_graph_data_table_1.addColumn('number', '예측값')
    tdls_graph_data_table_1.addColumn('number', '측정값')

    tdls_graph_2 = await new google.visualization.LineChart(document.getElementById('selected-chart-2'))
    tdls_graph_data_table_2 = await new google.visualization.DataTable()
    tdls_graph_data_table_2.addColumn('string', 'timestamp')
    tdls_graph_data_table_2.addColumn('number', '예측값')
    tdls_graph_data_table_2.addColumn('number', '측정값')
}

async function drawTdlsStatusTable() {
    let i=0;
    for (const [key, value] of Object.entries(analyzer_pred_data)) {
        if (i > 0) {
            $(`#tdlsStatus1${i}`).text(value.toFixed(2))
            if (raw_data_tdls_data[key] == '') {
                $(`#tdlsStatus2${i}`).text('-')
            } else {
                $(`#tdlsStatus2${i}`).text(raw_data_tdls_data[key].toFixed(2))
            }            
            $(`#tdlsStatus3${i}`).removeClass()
            $(`#tdlsStatus3${i}`).addClass(analyzer_status_data[key] == 0 ? 
                'status-dot-good' : analyzer_status_data[key] == 1 ? 
                'status-dot-normal' : 'status-dot-bad')
            $(`#tdlsStatus4${i}`).text(analyzer_seva_data[key].toFixed(2))
            $(`#tdlsStatus5${i}`).text(analyzer_normal_ratio_data[key].toFixed(2))
        }
        i++
    }

}

async function drawO2ControllerStateTable() {
    $('#o2ControllerData11').text(sv_value_data.Y1.toFixed(2))
    $('#o2ControllerData12').text(analyzer_seva_data.y1.toFixed(2))
    $('#o2ControllerData13').text(analyzer_pred_data.y1.toFixed(2))
    $('#o2ControllerData22').text((analyzer_seva_data.y1 - sv_value_data.Y1).toFixed(2))
    $('#o2ControllerData23').text((analyzer_pred_data.y1 - sv_value_data.Y1).toFixed(2))
}

async function drawAirRatioTable() {
    $('#airRatioData1').text(air_ratio_data.z1.toFixed(2))
    $('#airRatioData2').text(air_ratio_data.z2.toFixed(2))
    $('#airRatioData3').text(air_ratio_data.z3.toFixed(2))
    $('#airRatioData4').text(air_ratio_data.z4.toFixed(2))
    $('#airRatioData5').text(air_ratio_data.z5.toFixed(2))
    $('#airRatioData6').text(air_ratio_data.z6.toFixed(2))
    $('#airRatioData7').text(air_ratio_data.z7.toFixed(2))
    if (sel > 1) {
        $('#airRatioData8').text(air_ratio_data.z8.toFixed(2))
    }
    
}

async function updateTempMonitoringChartData() {
    try {
        temp_monitoring_chart_data_table.removeRows(0, temp_monitoring_chart_data_table.getNumberOfRows())
    } catch {}

    temp_monitoring_chart_data_table.addRows([
        ['t1', temp_monitoring_data.t1, '#7EEF30'], ['t2', temp_monitoring_data.t2, '#7EEF30'], 
        ['t3', temp_monitoring_data.t3, '#7EEF30'], ['t4', temp_monitoring_data.t4, '#7EEF30'], 
        ['t5', temp_monitoring_data.t5, '#7EEF30'], ['t6', temp_monitoring_data.t6, '#7EEF30'], 
        ['t7', temp_monitoring_data.t7, '#7EEF30'], ['t8', temp_monitoring_data.t8, '#7EEF30'], 
    ])

    temp_monitoring_chart.draw(temp_monitoring_chart_data_table, temp_monitoring_chart_option)
}

async function updateO2COHistogramData() {
    try {
        o2_co_histogram_chart_data_table.removeRows(0, o2_co_histogram_chart_data_table.getNumberOfRows())
    } catch {}

    o2_co_histogram_chart_data_table.addRow(
        [analyzer_seva_data.y4, analyzer_seva_data.y1]
    )

    o2_co_histogram_chart.draw(o2_co_histogram_chart_data_table, o2_co_histogram_chart_option)
}

async function updateTdlsGraphData(num, idx) {
    if (idx > 0) {
        if (num == 1) {
            try {
                tdls_graph_data_table_1.removeRows(0, tdls_graph_data_table_1.getNumberOfRows())
            } catch {}
    
            const key = `y${idx}`
            for (i=0 ; i<analyer_pred_graph_data.length ; i++) {
                if (raw_data_graph_data[i][key] != '') {
                    tdls_graph_data_table_1.addRow(
                        [analyer_pred_graph_data[i].DateTime, 
                        analyer_pred_graph_data[i][key], 
                        raw_data_graph_data[i][key]]
                    )
                }
            }
    
            tdls_graph_1.draw(tdls_graph_data_table_1, tdls_graph_options)
        } else {
            try {
                tdls_graph_data_table_2.removeRows(0, tdls_graph_data_table_2.getNumberOfRows())
            } catch {}
    
            const key = `y${idx}`
            for (i=0 ; i<analyer_pred_graph_data.length ; i++) {
                if (raw_data_graph_data[i][key] != '') {
                    tdls_graph_data_table_2.addRow(
                        [analyer_pred_graph_data[i].DateTime, 
                        analyer_pred_graph_data[i][key], 
                        raw_data_graph_data[i][key]]
                    )
                }
            }
    
            tdls_graph_2.draw(tdls_graph_data_table_2, tdls_graph_options)
        }
    } else {
        if (num == 1) {
            try {
                tdls_graph_data_table_1.removeRows(0, tdls_graph_data_table_1.getNumberOfRows())
            } catch {}
            tdls_graph_1.draw(tdls_graph_data_table_1, tdls_graph_options)
        } else {
            try {
                tdls_graph_data_table_2.removeRows(0, tdls_graph_data_table_2.getNumberOfRows())
            } catch {}
            tdls_graph_2.draw(tdls_graph_data_table_2, tdls_graph_options)
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timerRoutine() {
	while(true) {
		if (getDateTimeString() != analyzer_seva_data.DateTime) {
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
    makeAirRatioTableRows()
    makeMachineDataTableRows()

    await google.charts.load('current', {packages:['bar']})
    await google.charts.load('visualization', 'current', {packages: ['corechart']})
    await google.charts.setOnLoadCallback(initGoogleCharts)

    await fetchData()

    await setTimerRoutine()
})

$(window).resize(function() {
    temp_monitoring_chart.draw(temp_monitoring_chart_data_table, temp_monitoring_chart_option)
    o2_co_histogram_chart.draw(o2_co_histogram_chart_data_table, o2_co_histogram_chart_option)
    tdls_graph_1.draw(tdls_graph_data_table_1, tdls_graph_options)
    tdls_graph_2.draw(tdls_graph_data_table_2, tdls_graph_options)
})


async function onSelectChart(idx, text, num) {
    if (num == 1) {
        chart1_sel = idx
    } else {
        chart2_sel = idx
    }
    
    if (idx > 0) {
        const dateTime = getDateTimeString()

        await fetch('/data/analyzer_pred/all?' 
            + new URLSearchParams({
                num_machine: sel,
                date_time: dateTime,
            }))
            .then(response => response.json())
            .then(jsonData => {
                analyer_pred_graph_data = jsonData.data
            })

        await fetch('/data/raw_data_tdls/all?' 
            + new URLSearchParams({
                num_machine: sel,
                date_time: dateTime,
            }))
            .then(response => response.json())
            .then(jsonData => {
                raw_data_graph_data = jsonData.data
            })
        
        await updateTdlsGraphData(num, idx)
        $(`#selected-chart-title-${num}`).text(text)
    } else {
        await updateTdlsGraphData(num, idx)
        $(`#selected-chart-title-${num}`).text('------')
    }
    
}