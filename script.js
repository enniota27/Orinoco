let request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        //document.getElementById('main').innerHTM += "<ul>";
        for (let i in response){
            document.getElementById('list').innerHTML += "<li>" + response[i].name + "<ul><li>" + response[i].price + "</li>" + "<li>" +'<img src="' + response[i].imageUrl + '" alt="' + response[i].name + '"></li>' + "<li>" + response[i].description + "</li></ul></li>"; 
        }
        //document.getElementById('main').innerHTML += "</ul>";
    }
};
request.open("GET", "http://localhost:3000/api/teddies");
request.send();


