let currentLaps = 0;

function setStat(element, to, span=ACHIEVEMENT_SET_STAT_TIMEOUT) {
    let current = parseInt(element.text());
    if (current === to) return;
    element.prop('counter', current).animate({counter: to}, {
        duration: span,
        easing: 'swing',
        step: now => element.text(Math.ceil(now))
    });
}

function setBackground(points) {
    if (points < BRONZE_MEDAL_POINT_COUNT){
        document.getElementById("bg").style.background = NO_MEDAL_BG;
    } else if (points >= BRONZE_MEDAL_POINT_COUNT && points < SILVER_MEDAL_POINT_COUNT) {
        document.getElementById("bg").style.background = BRONZE_MEDAL_BG;
    } else if (points >= SILVER_MEDAL_POINT_COUNT && points < GOLD_MEDAL_POINT_COUNT) {
        document.getElementById("bg").style.background = SILVER_MEDAL_BG;
    } else if (points >= GOLD_MEDAL_POINT_COUNT){
        document.getElementById("bg").style.background = GOLD_MEDAL_BG;
    }

}

function updateData() {
    $.getJSON(`/swimmer/info/${id}`, raw => {
        if (raw.code === 0) { // success
            setBackground(raw.data.points);
            $('#name').text(raw.data.name);
            setStat($('#points'), raw.data.points);
            setStat($('#swim'), raw.data.swim_laps * SWIM_LAP_LENGTH);
            setStat($('#run'),  raw.data.run_laps  * RUN_LAP_LENGTH );
            setStat($('#challenge'), raw.data.challenges);
            document.title = `${raw.data.name} | Swim For Love`;
        } else { // if error, print message
            setBackground(0);
            $('#name').text(raw.msg);
            $('#points').parent().remove();
            $('#swim').parent().remove();
            $('#run').parent().remove();
            $('#challenge').parent().remove();
        }
    });
}

function backToLeaderboard() {
    window.location.href = '/leaderboard';
}

$(document).ready(() => {
    $.ajaxSetup({cache: false}); // no cache
 
    updateData();
    setInterval(updateData, 2000);

    setTimeout(backToLeaderboard, ACHIEVEMENT_PAGE_TIMEOUT);
    $(document.body).on('mousedown keydown', backToLeaderboard);
});
