var thisTime = new Date('2022-07-01T13:59:00')

function getDateTimeString() {
    const year = thisTime.getFullYear()
	const m = thisTime.getMonth() + 1
	const month = m < 10 ? `0${m}` : m
	const d = thisTime.getDate()
	const day = d < 10 ? `0${d}` : d
	const hour = thisTime.getHours()
	const mm = thisTime.getMinutes()
	const min = mm < 10 ? `0${mm}` : mm
	const now = `${year}-${month}-${day} ${hour}:${min}`

    return now
}

