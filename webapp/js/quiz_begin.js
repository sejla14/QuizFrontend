function doStart() {
    var user = {
        'userID' : Math.floor(Math.random() * 9999),
        'name' : this.idInputName,
        'surname' : this.idInputSurname
    };
    sessionStorage.setItem("player", user );

    $.get("/admin/quizgame", function (data, status) {
        var retMessage = data + "\nStatus: " + status;
        $("#idQuizInfoMessage").text(retMessage);
        $("#idQuizInfoMessage").show();
    });
}