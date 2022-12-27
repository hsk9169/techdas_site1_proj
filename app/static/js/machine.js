import {Chart} from "../js/chartjs/auto/auto.js"

var analyzer_pred_graph_data, raw_data_graph_data
var lineGraph1, lineGraph2
var lineGraphCtx1, lineGraphCtx2
var barGraph
var barGraphCtx
var scatterGraph
var scatterGraphCtx

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

var barGraphOption = {
    indexAxis: 'y',
    responsive: false,
    scales: {
        y: {
            border: {
                display: true,
                color: 'white',
            },
            ticks: {
                color: 'white',
                beginAtZero: true,
            },
        },
        x: {
            border: {
                display: true,
                color: 'white'
            },
            ticks: {
                color: 'white',
                beginAtZero: true,
            },
        }
    },
    plugins: {
        legend: {display: false}
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
      legend: {position: 'top', align: 'end'},
    }
}

var scatterGraphOption = {
    elements: {
        point: {
          radius: 5,
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
        min: 0,
        max: 21,
      },
      x: {
        border: {
          display: true,
          color: 'white',
        },
        ticks: { color: 'white', beginAtZero: true },
        min: 0,
        max: 3000,
      },
    },
    plugins: {
      legend: {position: 'right', align: 'start'},
    }
}

function makeAirRatioTableRows() {
    let rowLen
    if (sel == 1) {
        rowLen = 7
    } else {
        rowLen = 8
    }
    for (let row=1 ; row<=rowLen; row++) {
        $('#air-ratio-table').find('tbody').append(`
            <tr>
                <th class="table-row" style="padding: 0; vertical-align: middle; font-size: 1.8vh;">z#${row}</th>
                <td class="table-row" style="padding: 0; vertical-align: middle; font-size: 1.8vh;"><b id="airRatioData${row}"></b></td>
        `)
    }
}

function makeMachineDataTableRows(num) {
    for (let row=1 ; row<=8 ; row++) {
        $('#machine-data-table').append('<tr style="width: 100%">')
        for (let col=1 ; col<=13 ; col++) {
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

async function initCharts () {
    lineGraphCtx1 = document.getElementById('selected-chart-1')
    lineGraphCtx2 = document.getElementById('selected-chart-2')
    barGraphCtx = document.getElementById('temp_monitoring_chart')
    scatterGraphCtx = document.getElementById('o2_co_histogram_chart')

    let lineGraphData = {
        labels: [],
        datasets: [],
    }
    let barGraphData = {
        labels: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
        datasets: [],
    }
    let scatterGraphData = {
        datasets: [],
    }

    let lineGraphConfig = {type: 'line', options: lineGraphOption, data: lineGraphData}
    let barGraphConfig = {type: 'bar', options: barGraphOption, data: barGraphData}
    let scatterGraphConfig = {type: 'scatter', options: scatterGraphOption, data: scatterGraphData}
    lineGraph1 = new Chart(lineGraphCtx1, lineGraphConfig)
    lineGraph2 = new Chart(lineGraphCtx2, lineGraphConfig)
    barGraph = new Chart(barGraphCtx, barGraphConfig)
    scatterGraph = new Chart(scatterGraphCtx, scatterGraphConfig)
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
    const labels = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']

    let barGraphData = {
        labels: labels,
        datasets: [
            {
                data: labels.map(row => temp_monitoring_data[row]),
                backgroundColor: 'rgba(127, 240, 48)',
            }
        ]
    }
    barGraph.config.data = barGraphData
    barGraph.update()
}

async function updateO2COHistogramData() {
    let scatterGraphData = {
        datasets: [{
            label: '현재값',
            data: [{
                x: analyzer_seva_data.y1,
                y: analyzer_seva_data.y4,
            }],
            backgroundColor: 'rgba(245, 194, 66)'
        }]
    }
    scatterGraph.config.data = scatterGraphData
    scatterGraph.update()
}

async function updateTdlsGraphData(num, idx) {
    if (idx > 0) {
        const key = `y${idx}`
        let dateTimeTemp = [], rawDataTemp = []
        raw_data_graph_data.map(row => {
            dateTimeTemp.push(row.DateTime)
            rawDataTemp.push(row[key])
        })
        let lineGraphData = {
            labels: dateTimeTemp,
            datasets: [
              {
                label: '측정',
                data: rawDataTemp,
                backgroundColor: 'rgba(1, 0, 255)',
                borderColor: 'rgba(1, 0, 255)',
                borderWidth: 1,
              },
              {
                label: '예측',
                data: analyzer_pred_graph_data.map(row => row[key]),
                backgroundColor: 'rgba(177, 36, 24)',
                borderColor: 'rgba(177, 36, 24)',
                borderWidth: 1,
              }
            ]
        }
        if (num == 1) {            
              lineGraph1.config.data = lineGraphData
              lineGraph1.update()
        } else {
              lineGraph2.config.data = lineGraphData
              lineGraph2.update()
        }
    } else {
        let lineGraphData = {
            labels: [],
            datasets: [],
        }
        if (num == 1) {
            lineGraph1.config.data = lineGraphData
            lineGraph1.update()
        } else {
            lineGraph2.config.data = lineGraphData
            lineGraph2.update()
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

    await initCharts()

    await fetchData()

    await setTimerRoutine()
})

$(window).resize(function() {
    lineGraph1.update()
    lineGraph2.update()
    barGraph.update()
    scatterGraph.update()
})

$('#select1').on('change', async function() {
    const idx = this.selectedIndex
    const text = this.options[this.selectedIndex].text
    
    chart1_sel = idx
    
    if (idx > 0) {
        const dateTime = getDateTimeString()

        await fetch('/data/analyzer_pred/all?' 
            + new URLSearchParams({
                num_machine: sel,
                date_time: dateTime,
            }))
            .then(response => response.json())
            .then(jsonData => {
                analyzer_pred_graph_data = jsonData.data
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
        
        await updateTdlsGraphData(1, idx)
        $('#selected-chart-title-1').text(text)
    } else {
        await updateTdlsGraphData(1, idx)
        $('#selected-chart-title-1').text('------')
    }  
})

$('#select2').on('change', async function() {
    const idx = this.selectedIndex
    const text = this.options[this.selectedIndex].text
    
    chart2_sel = idx
    
    if (idx > 0) {
        const dateTime = getDateTimeString()

        await fetch('/data/analyzer_pred/all?' 
            + new URLSearchParams({
                num_machine: sel,
                date_time: dateTime,
            }))
            .then(response => response.json())
            .then(jsonData => {
                analyzer_pred_graph_data = jsonData.data
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
        
        await updateTdlsGraphData(2, idx)
        $('#selected-chart-title-2').text(text)
    } else {
        await updateTdlsGraphData(2, idx)
        $('#selected-chart-title-2').text('------')
    }  
})