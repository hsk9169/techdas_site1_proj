const baseUrl = 'http://localhost:8080/'

$(document).ready(function() {	
	if (sel > 0) {
		const sensor_nav = `<a class="text-other" style="background-color: transparent;" href='/${sel}/Sensor'>Sensor</a>`
		const setting_nav = `<a class="text-other" style="background-color: transparent;" href='/${sel}/Setting'>Setting</a>`
		$('#sensor_nav').append(sensor_nav)
		$('#setting_nav').append(setting_nav)
	}

	let navList = $('#topheader .navbar-nav a')
	const href = window.location.href
	const type = href.substring(baseUrl.length + 2)
	const num_machine = href.substring(baseUrl.length, baseUrl.length + 1)
	
	for(i=0 ; i<navList.length ; i++) {
		if (num_machine > 0) {
			if (navList[i].href.substring(
				baseUrl.length, baseUrl.length + 1) == num_machine) {
				$(navList[i]).parent().addClass('active')
				if (navList[i].href.substring(baseUrl.length + 2) != 'machine') {
					if (navList[i].textContent != type) {
						$(navList[i]).parent().removeClass('active')
					}
				}
			}
		} else {
			$(navList[0]).parent().addClass('active')
		}
	}
})

function getDateTime() {
	const year = thisTime.getFullYear()
	const m = thisTime.getMonth() + 1
	const month = m < 10 ? `0${m}` : m
	const d = thisTime.getDate()
	const day = d < 10 ? `0${d}` : d
	const hh = thisTime.getHours()
	const hour = hh < 10 ? `0${hh}` : hh
	const mm = thisTime.getMinutes()
	const min = mm < 10 ? `0${mm}` : mm
	const ss = thisTime.getSeconds()
	const sec = ss < 10 ? `0${ss}` : ss
	const now = `${year}년 ${month}월 ${day}일 ${hour}:${min}:${sec}`
    return now
}

function updateTime(){
	thisTime = new Date(thisTime.setSeconds(thisTime.getSeconds() + 1))
	$('#realtime').html(getDateTime())
}
   
setInterval(updateTime, 1000)
