function doLogin () {
  $.post("/admin/login", /*** Podesiti putanju kako treba ****/
  {
    username: this.username,
    password: this.password
  },
  function(data, status){
    var retMessage = data + "\nStatus: " + status;
    $("#idInfoMessage").text(retMessage);
    $("#idInfoMessage").show();
  });
}