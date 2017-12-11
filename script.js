document.querySelector('#logout').onclick = function(event) {
    event.preventDefault();
    window.location.href = 'https://logout:logout@counter.stanislas-brodin.fr' + window.location.pathname;
};

window.onload = function() {
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
    // Chargement des compteurs de l'utilisateur
    xhr.send("name=" + window.location.pathname);

    if (document.querySelector('#create_counter')) {
        document.querySelector('#create_counter').onclick = function(event) {
            event.preventDefault();
            create_counter();
        };
    }
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
        var ftr_second_div = createElementTd('', 'counter_name', '', counter.counter_name, counter.counter_color, true);
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
        delete_button.innerHTML = '&#10007;';
        delete_button.setAttribute('class', 'delete_counter');
        delete_button.setAttribute('title', 'Supprimer le compteur "' + counter.counter_name + '"');

        // Ajout du bouton de suppression
        counter_container.appendChild(delete_button);

        // Création du bouton de validation (pour l'édition du compteur)
        var confirm_button = document.createElement('span');
        confirm_button.innerHTML = '&#10003;';
        confirm_button.setAttribute('class', 'confirm_edition');
        confirm_button.setAttribute('title', 'Valider les modifications');

        // Ajout du bouton de validation
        counter_container.appendChild(confirm_button);

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

function createElementTd(td_id, td_class, td_rowspan, td_content, td_color, create_hidden_elements) {
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
    if (create_hidden_elements) {
        var hidden_input_content = document.createElement('input');
        hidden_input_content.setAttribute('type', 'hidden');
        hidden_input_content.setAttribute('value', td_content);
        hidden_input_content.setAttribute('class', 'hidden_value');
        td.appendChild(hidden_input_content);
        if (td_color != '') {
            var hidden_input_color = document.createElement('input');
            hidden_input_color.setAttribute('type', 'hidden');
            hidden_input_color.setAttribute('value', '#' + td_color);
            hidden_input_color.setAttribute('class', 'hidden_color');
            hidden_input_color.setAttribute('title', 'Modifier la couleur du compteur');
            td.appendChild(hidden_input_color);
        }
    }
    return td;
}

function update_html(counter) {
    if (counter.counter_id != undefined) {
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
        // Mise à jour du nom et de la couleur du compteur
        if (counter.new_name != undefined &&
            counter.new_color != undefined) {
            var counter_name = document.querySelector('.counter[data-id="' + counter.counter_id + '"] .counter_name');

            counter_name.innerHTML = counter.new_name;

            // Ajout du nouveau nom du compteur
            var hidden_input_content = document.createElement('input');
            hidden_input_content.setAttribute('type', 'hidden');
            hidden_input_content.setAttribute('value', counter.new_name);
            hidden_input_content.setAttribute('class', 'hidden_value');
            counter_name.appendChild(hidden_input_content);

            // Ajout du nouveau nom du compteur
            var hidden_input_color = document.createElement('input');
            hidden_input_color.setAttribute('type', 'hidden');
            hidden_input_color.setAttribute('value', counter.new_color);
            hidden_input_color.setAttribute('class', 'hidden_color');
            counter_name.appendChild(hidden_input_color);

            counter_name.style.backgroundColor = counter.new_color;
            document.querySelector('.counter[data-id="' + counter.counter_id + '"] .counter_value').style.backgroundColor = counter.new_color;

            document.querySelector('.counter[data-id="' + counter.counter_id + '"]').parentElement.querySelector('.confirm_edition').style.display = 'none';
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
                    // Ajout des listeners sur le compteur créé
                    add_listeners(document.querySelector('.counter[data-id="' + response[0].counter_id + '"]').parentElement);
                }
            }
        }
    };
    xhr.send("name=" + window.location.pathname);
}

function update_counter() {
    var counter_id = this.closest('.counter_container').querySelector('table').getAttribute('data-id');
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
    if (this.className.match(/\bconfirm_edition\b/)) {
        console.log('change counter name !');
        var new_name = this.closest('.counter_container').querySelector('.hidden_value').value;
        var new_color = this.closest('.counter_container').querySelector('.hidden_color').value;
        xhr.send("counter_id=" + counter_id + "&name=" + window.location.pathname + "&new_name=" + new_name + "&new_color=" + new_color);
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

function add_listeners(elements) {
    if (elements == undefined ) {
        elements = document;
    }

    elements.querySelectorAll('.minus, .plus').forEach(function(element) {
        element.addEventListener('click', update_counter, false);
    });

    elements.querySelectorAll('.counter_name, .counter_value').forEach(function(element) {
        element.addEventListener('dblclick', change_name_color, false);
    });

    elements.querySelectorAll('.confirm_edition').forEach(function(element) {
        element.addEventListener('click', update_counter, false);
    });

    elements.querySelectorAll('.delete_counter').forEach(function(element) {
        element.addEventListener('click', function() {
            if (confirm('Confirmer la suppression du compteur ?')) {
                delete_counter(this);
            } else {
                return;
            }
        }, false);
    });
}

function change_name_color() {
    var counter_container = this.closest('.counter_container');
    counter_container.querySelector('.confirm_edition').style.display = 'inline-block';
    var hidden_value = counter_container.querySelector('.hidden_value');
    hidden_value.type = 'text';
    var hidden_color = counter_container.querySelector('.hidden_color');
    hidden_color.type = 'color';
    counter_container.querySelector('.counter_name').innerHTML = '';
    counter_container.querySelector('.counter_name').appendChild(hidden_value);
    counter_container.querySelector('.counter_name').appendChild(hidden_color);
    // console.log(hidden_elements);
}