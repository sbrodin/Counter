document.querySelector('#logout').onclick = function(event) {
    event.preventDefault();
    window.location.href = 'https://logout:logout@counter.stanislas-brodin.fr' + window.location.pathname;
};

window.onload = function() {
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../load_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            if (xhr.responseText != '') {
                var response = JSON.parse(xhr.responseText);
                if (response.status == 'success') {
                    delete response.status;
                    display_counter(response);
                }
            }
            return;
        }
    };
    xhr.send("name=" + window.location.pathname);

    document.querySelectorAll('.update_counter').forEach(function(element) {
        element.addEventListener('click', update_counter, false);
    })

    document.querySelector('#create_counter').onclick = function(event) {
        event.preventDefault();
        create_counter();
    };
};

function update_counter() {
    var counter_id = this.closest('table').getAttribute('data-id');
    var value = encodeURIComponent(this.innerHTML);
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../update_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            if (xhr.responseText != '') {
                var response = JSON.parse(xhr.responseText);
                if (response.status == 'success') {
                    delete response.status;
                    update_html(response);
                }
            }
        }
    };
    // Incrémentation / décrémentation du compteur
    if (value == encodeURIComponent('-') || value == encodeURIComponent('+')) {
        xhr.send("counter_id=" + counter_id + "&name=" + window.location.pathname + "&direction=" + value);
    }
    // TODO : Ajouter les cas de changement de nom et de couleur du compteur
};

function display_counter(counters) {
    var counters_div = document.querySelector('#counters');
    for (var counter_key in counters) {
        counter = counters[counter_key];
        // Création du tableau qui va contenir les données du compteur
        var table = createElementTable('', 'counter', counter.counter_id);
        var tbody = createElementTbody();

        // Création de la première ligne qui va contenir les données du compteur
        var first_table_row = createElementTr('', '');
        var ftr_first_div = createElementTd('', 'update_counter minus', 2, '-');
        var ftr_second_div = createElementTd('', 'counter_name', '', counter.counter_name, counter.counter_color);
        var ftr_third_div = createElementTd('', 'update_counter plus', 2, '+');

        // Ajout des td dans le tr parent
        first_table_row.appendChild(ftr_first_div);
        first_table_row.appendChild(ftr_second_div);
        first_table_row.appendChild(ftr_third_div);

        // Création de la seconde ligne qui va contenir les données du compteur
        var second_table_row = createElementTr('', '');
        var str_first_div = createElementTd('', 'counter_value', '', counter.counter_value, counter.counter_color);

        // Ajout du td dans le tr parent
        second_table_row.appendChild(str_first_div);

        // Ajout des tr dans le tableau
        tbody.appendChild(first_table_row);
        tbody.appendChild(second_table_row);
        // Ajout du body dans le tableau
        table.appendChild(tbody)

        // Ajout du compteur dans la div conteneur
        counters_div.appendChild(table);
    };

    // Ajout des listeners
    document.querySelectorAll('.update_counter').forEach(function(element) {
        element.addEventListener('click', update_counter, false);
    })
}

function createElementTable(table_id, table_class, table_data_id) {
    var table = document.createElement('table');
    if (table_id != '') {
        table.setAttribute('id', table_id);
    } else if (table_data_id != '') {
        table.setAttribute('id', 'counter' + table_data_id);
    }
    if (table_class != '') {
        table.setAttribute('class', table_class);
    }
    if (table_data_id != '') {
        table.setAttribute('data-id', table_data_id);
    }
    return table;
}

function createElementTbody() {
    var tbody = document.createElement('tbody');
    return tbody;
}

function createElementTr(tr_id, tr_class) {
    var tr = document.createElement('tr');
    if (tr_id != '') {
        td.setAttribute('id', tr_id);
    }
    if (tr_class != '') {
        td.setAttribute('class', tr_class);
    }
    return tr;
}

function createElementTd(td_id, td_class, td_rowspan, td_content, td_color) {
    var td = document.createElement('td');
    if (td_id != '') {
        td.setAttribute('id', td_id);
    }
    if (td_class != '') {
        td.setAttribute('class', td_class);
    }
    if (td_rowspan != '') {
        td.setAttribute('rowspan', td_rowspan);
    }
    td.innerHTML = td_content;
    if (td_color != '') {
        td.style.backgroundColor = '#' + td_color;
    }
    return td;
}

function update_html(counter) {
    if (counter.direction != undefined) {
        var counter_value = document.querySelector('.counter[data-id="' + counter.counter_id + '"] .counter_value');
        if (counter.direction == '+') {
            ++counter_value.innerHTML;
        } else if (counter.direction == '-') {
            --counter_value.innerHTML;
        }
    }
}

function create_counter() {
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../create_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            if (xhr.responseText != '') {
                var response = JSON.parse(xhr.responseText);
                if (response.status == 'success') {
                    delete response.status;
                    display_counter(response);
                }
            }
        }
    };
    xhr.send("name=" + window.location.pathname);
}

function delete_counter() {
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../delete_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            if (xhr.responseText != '') {
                var response = JSON.parse(xhr.responseText);
                if (response.status == 'success') {
                    delete response.status;
                    display_counter(response);
                }
            }
        }
    };
    xhr.send("name=" + window.location.pathname);
}