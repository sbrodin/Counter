document.getElementById('logout').onclick = function() {
    event.preventDefault();
    window.location.href = 'https://logout:logout@counter.stanislas-brodin.fr' + window.location.pathname;
};

document.getElementById('send_ajax').onclick = function(event) {
    event.preventDefault();
    // Appel AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "../../change_counter.php", true);
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
    xhr.open("POST", "../../load_counter.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) {
            show_counter(xhr.responseText);
            return;
        }
    };
    xhr.send("name=" + window.location.pathname);
};

function show_counter(counters) {
    if (counters == '') {
        return;
    }
    counters = JSON.parse(counters);
    var counters_div = document.getElementById('counters');
    counters.forEach(function(counter) {
        console.log(counter);

        // Création du tableau qui va contenir les données du compteur
        var table = createElementTable('', 'counter', counter.counter_id);

        // Création de la première ligne qui va contenir les données du compteur
        var first_table_row = createElementTr('', '');
        var ftr_first_div = createElementTd('', 'minus', 2, '-');
        var ftr_second_div = createElementTd('', 'counter_name', '', counter.counter_name, counter.counter_color);
        var ftr_third_div = createElementTd('', 'plus', 2, '+');

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
        table.appendChild(first_table_row);
        table.appendChild(second_table_row);

        // Ajout du compteur dans la div conteneur
        counters_div.appendChild(table);
    });
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