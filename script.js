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
                    add_listeners();
                }
            }
            return;
        }
    };
    xhr.send("name=" + window.location.pathname);

    document.querySelector('#create_counter').onclick = function(event) {
        event.preventDefault();
        create_counter();
    };
};

function display_counter(counters) {
    var counters_div = document.querySelector('#counters');
    for (var counter_key in counters) {
        counter = counters[counter_key];

        // Création de la div conteneur du compteur
        var counter_container = document.createElement('div');
        counter_container.setAttribute('class', 'counter_container');

        // Création du tableau qui va contenir les données du compteur
        var table = createElementTable('', 'counter', counter.counter_id);
        var tbody = createElementTbody();

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
        tbody.appendChild(first_table_row);
        tbody.appendChild(second_table_row);
        // Ajout du body dans le tableau
        table.appendChild(tbody);

        // Ajout du compteur dans la div conteneur
        counter_container.appendChild(table);

        // Création du bouton de suppression
        var delete_button = document.createElement('span');
        delete_button.innerHTML = '-';
        delete_button.setAttribute('class', 'delete_counter');

        // Ajout du bouton de suppression
        counter_container.appendChild(delete_button);

        // Ajout du conteneur dans le conteneur général
        counters_div.appendChild(counter_container);
    };
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
    // Mise à jour du DOM pour indrémentation / décrémentation
    if (counter.direction != undefined) {
        var counter_value = document.querySelector('.counter[data-id="' + counter.counter_id + '"] .counter_value');
        if (counter.direction == '+') {
            ++counter_value.innerHTML;
        } else if (counter.direction == '-') {
            --counter_value.innerHTML;
        }
    }
    // Suppression du compteur du DOM
    if (counter.delete != undefined) {
        var counter_table = document.querySelector('.counter[data-id="' + counter.counter_id + '"]');
        counter_table.parentElement.remove();
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
                    // Ajout des listeners sur le compteur créé
                    add_listeners(document.querySelector('.counter[data-id="' + response[0].counter_id + '"]').parentElement);
                }
            }
        }
    };
    xhr.send("name=" + window.location.pathname);
}

function update_counter() {
    var counter_id = this.closest('table').getAttribute('data-id');
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
    if (this.className.match(/\bminus\b/) ||
        this.className.match(/\bplus\b/)) {
        xhr.send("counter_id=" + counter_id + "&name=" + window.location.pathname + "&direction=" + encodeURIComponent(this.innerHTML));
    }
    if (this.className.match(/\bcounter_name\b/)) {
        console.log('change counter name !');
        // xhr.send("counter_id=" + counter_id + "&name=" + window.location.pathname + "&direction=" + this.innerHTML);
    }
    // TODO : Ajouter les cas de changement de nom et de couleur du compteur
};

function delete_counter(delete_button) {
    var counter_id = delete_button.previousSibling.getAttribute('data-id');
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
    xhr.send("counter_id=" + counter_id + "&name=" + window.location.pathname + "&delete=");
}

function add_listeners(element) {
    if (element == undefined ) {
        element = document;
    }

    element.querySelectorAll('.minus, .plus').forEach(function(element) {
        element.addEventListener('click', update_counter, false);
    })

    element.querySelectorAll('.counter_name').forEach(function(element) {
        element.addEventListener('dblclick', update_counter, false);
    })

    element.querySelectorAll('.delete_counter').forEach(function(element) {
        element.addEventListener('click', function() {
            if (confirm('Confirmer la suppression du compteur ?')) {
                delete_counter(this);
            } else {
                return;
            }
        }, false);
    })
}