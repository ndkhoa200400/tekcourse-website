$("[type=checkbox]").click(function () {
    var str = $('input[type=checkbox]:checked').map(function () { 
        return this.name + "=" + this.value; }).get().join("&");
    if (str != "") str += "";
    else str += str;

    //const nextURL = window.location.href + str;
    //window.location.replace(nextURL);

    $("#results").text(str);
});