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
var raw_data_temp_data

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

function makeMachineDataTableRows(num) {
    for (row=1 ; row<=8 ; row++) {
        $('#machine-data-table').append('<tr style="width: 100%">')
        for (col=1 ; col<=13 ; col++) {
            if (col == 1) {
                $('#machine-data-table').append(`
                    <td class="table-row" style="width: 10%; height: 12.5%; padding: 0; vertical-align: middle; font-size: 0.8vh;"><b id=machineData${col}${row} style="color: #00B050"></b><b id=machineDataUnit${col}${row}></b></td>
                `)
            } else {
                $('#machine-data-table').append(`
                    <td class="table-row" style="width: 6.5%; height: 12.5%; padding: 0; vertical-align: middle; font-size: 0.8vh;"><b id=machineData${col}${row} style="color: #00B050"></b><b id=machineDataUnit${col}${row}></b></td>
                `)
            }
        }
    }
    if (num == 1) {
        $('#machineData14').text('Y5')
        $('#machineData14').css('padding-right', '2%')
        $('#machineDataUnit14').text('%')

        $('#machineData42').text('Y4')
        $('#machineData42').css('padding-right', '2%')
        $('#machineDataUnit42').text('ppm')

        $('#machineData43').text('Y1')
        $('#machineData43').css('padding-right', '2%')
        $('#machineDataUnit43').text('%')

        $('#machineDataUnit51').text('공기비')
        $('#machineDataUnit52').text('온도')

        $('#machineDataUnit57').text('공기비')
        $('#machineDataUnit58').text('온도')

        $('#machineData61').text('X30')

        $('#machineData62').text('X2')
        $('#machineData62').css('padding-right', '2%')
        $('#machineDataUnit62').append('&#8451;')

        $('#machineData63').text('Y2')
        $('#machineData63').css('padding-right', '2%')
        $('#machineDataUnit63').text('%')

        $('#machineData67').text('X31')

        $('#machineData68').text('X4')
        $('#machineData68').css('padding-right', '2%')
        $('#machineDataUnit68').append('&#8451;')

        $('#machineData81').text('X32')

        $('#machineData82').text('X6')
        $('#machineData82').css('padding-right', '2%')
        $('#machineDataUnit82').append('&#8451;')

        $('#machineData87').text('X33')

        $('#machineData88').text('X8')
        $('#machineData88').css('padding-right', '2%')
        $('#machineDataUnit88').append('&#8451;')

        $('#machineData101').text('X34')

        $('#machineData102').text('X10')
        $('#machineData102').css('padding-right', '2%')
        $('#machineDataUnit102').append('&#8451;')

        $('#machineData103').text('Y3')
        $('#machineData103').css('padding-right', '2%')
        $('#machineDataUnit103').append('%')

        $('#machineData111').text('X35')

        $('#machineData112').text('X12')
        $('#machineData112').css('padding-right', '2%')
        $('#machineDataUnit112').append('&#8451;')

        $('#machineData117').text('X36')

        $('#machineData118').text('X14')
        $('#machineData118').css('padding-right', '2%')
        $('#machineDataUnit118').append('&#8451;')
    } else if (num == 2) {
        $('#machineData14').text('Y5')
        $('#machineData14').css('padding-right', '2%')
        $('#machineDataUnit14').text('%')

        $('#machineData42').text('Y4')
        $('#machineData42').css('padding-right', '2%')
        $('#machineDataUnit42').text('ppm')

        $('#machineData43').text('Y1')
        $('#machineData43').css('padding-right', '2%')
        $('#machineDataUnit43').text('%')

        $('#machineDataUnit51').text('공기비')
        $('#machineDataUnit52').text('온도')

        $('#machineDataUnit57').text('공기비')
        $('#machineDataUnit58').text('온도')

        $('#machineData61').text('X41')

        $('#machineData62').text('X4')
        $('#machineData62').css('padding-right', '2%')
        $('#machineDataUnit62').append('&#8451;')

        $('#machineData63').text('Y2')
        $('#machineData63').css('padding-right', '2%')
        $('#machineDataUnit63').text('%')

        $('#machineData67').text('X42')

        $('#machineData68').text('X6')
        $('#machineData68').css('padding-right', '2%')
        $('#machineDataUnit68').append('&#8451;')

        $('#machineData81').text('X43')

        $('#machineData82').text('X8')
        $('#machineData82').css('padding-right', '2%')
        $('#machineDataUnit82').append('&#8451;')

        $('#machineData87').text('X44')

        $('#machineData88').text('X10')
        $('#machineData88').css('padding-right', '2%')
        $('#machineDataUnit88').append('&#8451;')

        $('#machineData101').text('X45')

        $('#machineData102').text('X12')
        $('#machineData102').css('padding-right', '2%')
        $('#machineDataUnit102').append('&#8451;')

        $('#machineData103').text('Y3')
        $('#machineData103').css('padding-right', '2%')
        $('#machineDataUnit103').append('%')

        $('#machineData107').text('X47')

        $('#machineData108').text('X16')
        $('#machineData108').css('padding-right', '2%')
        $('#machineDataUnit108').append('&#8451;')

        $('#machineData111').text('X46')

        $('#machineData112').text('X14')
        $('#machineData112').css('padding-right', '2%')
        $('#machineDataUnit112').append('&#8451;')

        $('#machineData117').text('X48')

        $('#machineData118').text('X18')
        $('#machineData118').css('padding-right', '2%')
        $('#machineDataUnit118').append('&#8451;')
    } else if (num == 3) {
        $('#machineData43').text('Y1')
        $('#machineData43').css('padding-right', '2%')
        $('#machineDataUnit43').text('%')

        $('#machineData47').text('Y4')
        $('#machineData47').css('padding-right', '2%')
        $('#machineDataUnit47').text('ppm')
        $('#machineData48').text('Y5')
        $('#machineData48').css('padding-right', '2%')
        $('#machineDataUnit48').text('%')

        $('#machineDataUnit51').text('공기비')
        $('#machineDataUnit52').text('온도')

        $('#machineDataUnit57').text('공기비')
        $('#machineDataUnit58').text('온도')

        $('#machineData61').text('X40')

        $('#machineData62').text('X3')
        $('#machineData62').css('padding-right', '2%')
        $('#machineDataUnit62').append('&#8451;')

        $('#machineData63').text('Y2')
        $('#machineData63').css('padding-right', '2%')
        $('#machineDataUnit63').text('%')

        $('#machineData67').text('X41')

        $('#machineData68').text('X5')
        $('#machineData68').css('padding-right', '2%')
        $('#machineDataUnit68').append('&#8451;')

        $('#machineData81').text('X42')

        $('#machineData82').text('X7')
        $('#machineData82').css('padding-right', '2%')
        $('#machineDataUnit82').append('&#8451;')

        $('#machineData87').text('X43')

        $('#machineData88').text('X9')
        $('#machineData88').css('padding-right', '2%')
        $('#machineDataUnit88').append('&#8451;')

        $('#machineData101').text('X44')

        $('#machineData102').text('X11')
        $('#machineData102').css('padding-right', '2%')
        $('#machineDataUnit102').append('&#8451;')

        $('#machineData103').text('Y3')
        $('#machineData103').css('padding-right', '2%')
        $('#machineDataUnit103').append('%')

        $('#machineData107').text('X46')

        $('#machineData108').text('X15')
        $('#machineData108').css('padding-right', '2%')
        $('#machineDataUnit108').append('&#8451;')

        $('#machineData111').text('X45')

        $('#machineData112').text('X13')
        $('#machineData112').css('padding-right', '2%')
        $('#machineDataUnit112').append('&#8451;')

        $('#machineData117').text('X47')

        $('#machineData118').text('X17')
        $('#machineData118').css('padding-right', '2%')
        $('#machineDataUnit118').append('&#8451;')
    } else {
        $('#machineData14').text('Y5')
        $('#machineData14').css('padding-right', '2%')
        $('#machineDataUnit14').text('%')

        $('#machineData42').text('Y4')
        $('#machineData42').css('padding-right', '2%')
        $('#machineDataUnit42').text('ppm')

        $('#machineData43').text('Y1')
        $('#machineData43').css('padding-right', '2%')
        $('#machineDataUnit43').text('%')

        $('#machineDataUnit61').text('공기비')
        $('#machineDataUnit62').text('온도')

        $('#machineData63').text('Y2')
        $('#machineData63').css('padding-right', '2%')
        $('#machineDataUnit63').text('%')

        $('#machineDataUnit67').text('공기비')
        $('#machineDataUnit68').text('온도')

        $('#machineData71').text('X35')

        $('#machineData72').text('X3')
        $('#machineData72').css('padding-right', '2%')
        $('#machineDataUnit72').append('&#8451;')

        $('#machineData77').text('X36')

        $('#machineData78').text('X5')
        $('#machineData78').css('padding-right', '2%')
        $('#machineDataUnit78').append('&#8451;')

        $('#machineData91').text('X37')

        $('#machineData92').text('X7')
        $('#machineData92').css('padding-right', '2%')
        $('#machineDataUnit92').append('&#8451;')

        $('#machineData97').text('X38')

        $('#machineData98').text('X9')
        $('#machineData98').css('padding-right', '2%')
        $('#machineDataUnit98').append('&#8451;')

        $('#machineData101').text('X39')

        $('#machineData102').text('X11')
        $('#machineData102').css('padding-right', '2%')
        $('#machineDataUnit102').append('&#8451;')

        $('#machineData103').text('Y3')
        $('#machineData103').css('padding-right', '2%')
        $('#machineDataUnit103').append('%')

        $('#machineData107').text('X41')

        $('#machineData108').text('X15')
        $('#machineData108').css('padding-right', '2%')
        $('#machineDataUnit108').append('&#8451;')

        $('#machineData111').text('X40')

        $('#machineData112').text('X13')
        $('#machineData112').css('padding-right', '2%')
        $('#machineDataUnit112').append('&#8451;')

        $('#machineData117').text('X42')

        $('#machineData118').text('X17')
        $('#machineData118').css('padding-right', '2%')
        $('#machineDataUnit118').append('&#8451;')
    }
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

    await fetch('/data/raw_data_temp?'
        + new URLSearchParams({
            num_machine: sel,
            date_time: dateTime,
        }))
        .then(response => response.json())
        .then(jsonData => {
            raw_data_temp_data = jsonData.data
        })
    
    await drawO2ControllerStateTable()
    await updateTempMonitoringChartData()
    await drawAirRatioTable()
    await drawTdlsStatusTable()
    await updateO2COHistogramData()
    await updateMachineDataTable(sel)
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

async function updateMachineDataTable(sel) {
    if (sel == 1) {
        $('#machineData14').text(raw_data_tdls_data.y5)
        $('#machineData42').text(raw_data_tdls_data.y4)
        $('#machineData43').text(raw_data_tdls_data.y1)
        $('#machineData103').text(raw_data_tdls_data.y3)
        $('#machineData61').text(air_ratio_data.z1)
        $('#machineData67').text(air_ratio_data.z2)
        $('#machineData81').text(air_ratio_data.z3)
        $('#machineData87').text(air_ratio_data.z4)
        $('#machineData101').text(air_ratio_data.z5)
        $('#machineData111').text(air_ratio_data.z6)
        $('#machineData117').text(air_ratio_data.z7)
        $('#machineData62').text(raw_data_temp_data.X2.toFixed(2))
        $('#machineData68').text(raw_data_temp_data.X4.toFixed(2))
        $('#machineData82').text(raw_data_temp_data.X6.toFixed(2))
        $('#machineData88').text(raw_data_temp_data.X8.toFixed(2))
        $('#machineData102').text(raw_data_temp_data.X10.toFixed(2))
        $('#machineData112').text(raw_data_temp_data.X12.toFixed(2))
        $('#machineData118').text(raw_data_temp_data.X14.toFixed(2))
    } else if (sel == 2) {
        console.log(raw_data_temp_data)
        $('#machineData14').text(raw_data_tdls_data.y5)
        $('#machineData42').text(raw_data_tdls_data.y4)
        $('#machineData43').text(raw_data_tdls_data.y1)
        $('#machineData63').text(raw_data_tdls_data.y2)
        $('#machineData103').text(raw_data_tdls_data.y3)
        $('#machineData61').text(air_ratio_data.z1)
        $('#machineData67').text(air_ratio_data.z2)
        $('#machineData81').text(air_ratio_data.z3)
        $('#machineData87').text(air_ratio_data.z4)
        $('#machineData101').text(air_ratio_data.z5)
        $('#machineData107').text(air_ratio_data.z6)
        $('#machineData111').text(air_ratio_data.z7)
        $('#machineData117').text(air_ratio_data.z8)
        $('#machineData62').text(raw_data_temp_data.X4)
        $('#machineData68').text(raw_data_temp_data.X6)
        $('#machineData82').text(raw_data_temp_data.X8)
        $('#machineData88').text(raw_data_temp_data.X10)
        $('#machineData102').text(raw_data_temp_data.X12)
        $('#machineData112').text(raw_data_temp_data.X14)
        $('#machineData108').text(raw_data_temp_data.X16)
        $('#machineData118').text(raw_data_temp_data.X18)
    } else if (sel == 3) {
        console.log(raw_data_temp_data)
        $('#machineData48').text(raw_data_tdls_data.y5)
        $('#machineData47').text(raw_data_tdls_data.y4)
        $('#machineData43').text(raw_data_tdls_data.y1)
        $('#machineData63').text(raw_data_tdls_data.y2)
        $('#machineData103').text(raw_data_tdls_data.y3)
        $('#machineData61').text(air_ratio_data.z1)
        $('#machineData67').text(air_ratio_data.z2)
        $('#machineData81').text(air_ratio_data.z3)
        $('#machineData87').text(air_ratio_data.z4)
        $('#machineData101').text(air_ratio_data.z5)
        $('#machineData107').text(air_ratio_data.z6)
        $('#machineData111').text(air_ratio_data.z7)
        $('#machineData117').text(air_ratio_data.z8)
        $('#machineData62').text(raw_data_temp_data.X3)
        $('#machineData68').text(raw_data_temp_data.X5)
        $('#machineData82').text(raw_data_temp_data.X7)
        $('#machineData88').text(raw_data_temp_data.X9)
        $('#machineData102').text(raw_data_temp_data.X11)
        $('#machineData112').text(raw_data_temp_data.X13)
        $('#machineData108').text(raw_data_temp_data.X15)
        $('#machineData118').text(raw_data_temp_data.X17)
    } else {
        $('#machineData14').text(raw_data_tdls_data.y5)
        $('#machineData42').text(raw_data_tdls_data.y4)
        $('#machineData43').text(raw_data_tdls_data.y1)
        $('#machineData63').text(raw_data_tdls_data.y2)
        $('#machineData103').text(raw_data_tdls_data.y3)
        $('#machineData71').text(air_ratio_data.z1)
        $('#machineData77').text(air_ratio_data.z2)
        $('#machineData91').text(air_ratio_data.z3)
        $('#machineData97').text(air_ratio_data.z4)
        $('#machineData101').text(air_ratio_data.z5)
        $('#machineData107').text(air_ratio_data.z6)
        $('#machineData111').text(air_ratio_data.z7)
        $('#machineData117').text(air_ratio_data.z8)
        $('#machineData72').text(raw_data_temp_data.X3)
        $('#machineData78').text(raw_data_temp_data.X5)
        $('#machineData92').text(raw_data_temp_data.X7)
        $('#machineData98').text(raw_data_temp_data.X9)
        $('#machineData102').text(raw_data_temp_data.X11)
        $('#machineData112').text(raw_data_temp_data.X13)
        $('#machineData108').text(raw_data_temp_data.X15)
        $('#machineData118').text(raw_data_temp_data.X17)
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
    makeMachineDataTableRows(sel)

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