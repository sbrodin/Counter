document.getElementById('logout').onclick = function() {
    event.preventDefault();
    window.location.href = 'https://logout:logout@counter.stanislas-brodin.fr' + window.location.pathname;
};

document.getElementById('send_ajax').onclick = function(event) {
    event.preventDefault();
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../change_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            return;
        }
    };
    xhr.send("banana=yellow&tomato=red");
};

window.onload = function() {
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../load_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            return;
        }
    };
    xhr.send("name=" + window.location.pathname);
};