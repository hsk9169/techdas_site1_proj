var tag_desc_data
var o2_co_limit_data
var limit_info_data

async function makeDataFilterTableRows() {
    for (let row=1 ; row<=tag_desc_data.length; row++) {
        $('#data-filter-table').append(`
            <tr style="height: 1vh; width: 100%;">
                <td id="dataFilterData1${row}" class="table-row" style="width: 60%; border: 1px solid white; padding: 1%; text-align: start; font-size: 1.5vh;"></td>
                <td id="dataFilterData2${row}" class="table-row" style="width: 10%; border: 1px solid white; padding: 1%;"></td>
                <td id="dataFilterData3${row}" class="table-row" style="width: 15%; border: 1px solid black; padding: 1%; text-align: start; font-size: 1.5vh;"></td>
                <td id="dataFilterData4${row}" class="table-row" style="width: 15%; border: 1px solid black; padding: 1%; text-align: start; font-size: 1.5vh;"></td>
        `)
        $(`#dataFilterData3${row}`).css('background-color', '#FFFFFF')
        $(`#dataFilterData4${row}`).css('background-color', '#FFFFFF')

        $(`#dataFilterData1${row}`).text(tag_desc_data[row - 1].Tag)
        $(`#dataFilterData2${row}`).append($(`<input id="checkBox${row}" type="checkbox" />`))
        if (tag_desc_data[row - 1].BandWidth == 'O') {
            $(`#checkBox${row}`).attr('checked', 'checked')
        }
        $(`#dataFilterData3${row}`).append($(`<input id="inputHigh${row}" value=${tag_desc_data[row - 1].High == '' ? 'None' : tag_desc_data[row - 1].High} style="width: 100%; color: black; border: none;" />`))
        $(`#dataFilterData4${row}`).append($(`<input id="inputLow${row}" value=${tag_desc_data[row - 1].Low == '' ? 'None' : tag_desc_data[row - 1].Low} style="width: 100%; color: black; border: none;" />`))
    }
}

async function makeO2COLimitTableRows() {
    const tag = ['예열대 상부 O2', '예열대 하부 O2', '균열대 하부 O2', '예열대 상부 CO', 'Stack O2']
    for (let row=1 ; row<=5; row++) {
        $('#o2co-limit-table').append(`
            <tr style="height: 1vh; width: 100%;">
                <td id="o2coLimitData1${row}" class="table-row" style="width: 60%; border: 1px solid white; padding: 1%; text-align: start; font-size: 1.5vh;"></td>
                <td id="o2coLimitData2${row}" class="table-row" style="width: 10%; border: 1px solid white; padding: 1%;"></td>
                <td id="o2coLimitData3${row}" class="table-row" style="width: 15%; border: 1px solid black; padding: 1%; text-align: start; font-size: 1.5vh;"></td>
                <td id="o2coLimitData4${row}" class="table-row" style="width: 15%; border: 1px solid black; padding: 1%; text-align: start; font-size: 1.5vh;"></td>
        `)
        $(`#o2coLimitData3${row}`).css('background-color', '#FFFFFF')
        $(`#o2coLimitData4${row}`).css('background-color', '#FFFFFF')

        $(`#o2coLimitData1${row}`).text(tag[row - 1])
        $(`#o2coLimitData2${row}`).append($(`<input type="checkbox" />`))

        $(`#o2coLimitData3${row}`).append($(`<input id="inputYellow${row}" value=${limit_info_data[row - 1].yellow == '' ? 'None' : limit_info_data[row - 1].yellow} style="width: 100%; color: black; border: none;" />`))
        $(`#o2coLimitData4${row}`).append($(`<input id="inputRed${row}" value=${limit_info_data[row - 1].red == '' ? 'None' : limit_info_data[row - 1].red} style="width: 100%; color: black; border: none;" />`))
    }
}

async function fetchData() {
    await fetch('/data/tag_desc/setting?'
        + new URLSearchParams({num_machine: sel}))
        .then(response => response.json())
        .then(jsonData => {
            tag_desc_data = jsonData.data
        })

    await fetch('/data/limit_info?' 
        + new URLSearchParams({num_machine: sel}))
        .then(response => response.json())
        .then(jsonData => {
            console.log(jsonData.data)
            limit_info_data = jsonData.data
        })
}

async function submitTagDescData() {
    await fetch('/data/tag_desc/setting?'
        + new URLSearchParams({num_machine: sel}), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tag_desc_data)
        })
        .then(response => response.json())
        .then(jsonData => {
            tag_desc_data = jsonData.data
        })
}

async function submitO2COLimitData() {
    await fetch('/data/limit_info?'
        + new URLSearchParams({num_machine: sel}), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(limit_info_data)
        })
        .then(response => response.json())
        .then(jsonData => {
            console.log(jsonData.data)
            limit_info_data = jsonData.data
        })
}

async function drawDataFilterTable() {
    for (const [key, value] of Object.entries(tag_desc_data)) {
        const row = parseInt(key) + 1
        
        if (value.BandWidth == 'O') {
            $(`#checkBox${row}`).attr('checked', 'checked')
        }
        $(`#inputHigh${row}`).val(value.High == '' ? 'None' : value.High)
        $(`#inputLow${row}`).val(value.Low == '' ? 'None' : value.Low)
    }
}

async function drawO2ControllerStateTable() {
    for (const [key, value] of Object.entries(limit_info_data)) {
        const row = parseInt(key) + 1

        $(`#o2coLimitData3${row}`).val(value.yellow == '' ? 'None' : value.yellow)
        $(`#o2coLimitData4${row}`).val(value.red == '' ? 'None' : value.red)
    }
}

function setCallbackOnInputs() {
    for (let row=1 ; row<= tag_desc_data.length ; row++) {
        $(`#checkBox${row}`).on('change', function() {
            tag_desc_data[row - 1].BandWidth = this.checked ? 'O' : 'X'
        })
        $(`#inputHigh${row}`).on('change', function() {
            tag_desc_data[row - 1].High = isNaN(Number(this.value)) ? '' : Number(this.value)
        })
        $(`#inputLow${row}`).on('change', function() {
            tag_desc_data[row - 1].Low = isNaN(Number(this.value)) ? '' : Number(this.value)
        })
    }
    for (let row=1 ; row<=limit_info_data.length ; row++) {
        $(`#inputYellow${row}`).on('change', function() {
            limit_info_data[row - 1].yellow = isNaN(Number(this.value)) ? '' : Number(this.value)
        })
        $(`#inputRed${row}`).on('change', function() {
            limit_info_data[row - 1].red = isNaN(Number(this.value)) ? '' : Number(this.value)
        })
    }
}

$('#submit_data_filter_button').on('click', async function() {
    await submitTagDescData()
    await drawDataFilterTable()
})

$('#submit_o2_co_limit_button').on('click', async function() {
    await submitO2COLimitData()
    await drawO2ControllerStateTable()
})

$(document).ready(async function() {
    await fetchData()

    await makeDataFilterTableRows()
    await makeO2COLimitTableRows()

    setCallbackOnInputs()
})