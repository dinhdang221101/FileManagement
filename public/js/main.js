$(document).ready(() => {
    let url = (window.location.search);
    let aUrl = url.split('/')
    let aLink = ''
    aUrl.forEach(function (u) {
        aLink += u + '/'
        if (u !== '') {
            let U = u.split('?dir=')
            console.log(U);
            let newLi = `<li class="breadcrumb-item"><a href="/${aLink}">${U.pop()}</a></li>`
            $('.breadcrumb').append(newLi);
        }
    })

    function getEmail_Path() {
        let getEmail = document.getElementById('user-email')
        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
        return { email, path }
    }

    function ajaxAddFile(id, data) {
        var tbody = $('#tbody_id');
        let duplicate = false;
        for (let index = 0; index < $('#tbody_id tr td').length; index++) {
            if (data.name === $('#tbody_id tr td')[index].textContent.trim()) {
                duplicate = true;
            }
        }
        if (parseFloat(data.size) == 0.0) {
            data.size = '-'
        }
        if (data.type != 'Folder') {
            data.type = 'File'
        }
        if (!duplicate) {
            tbody.append(`
            <tr data-id="${id}" id = "row${id}">
                <td>
                    ${data.icon}
                    <a id="subPath-${id}" href="http://localhost:3000${data.subPath}">
                        <span id="nameFile-${id}">${data.name}</span>
                    </a>
                </td>
                <td>
                    ${data.type}
                </td>
                <td>
                    ${data.size}
                </td>
                <td>
                    ${data.lastModified}
                </td>
                <td>
                    <span><i data-id="${id}" data-name="${data.name}" id="download-action-${id}" class="fa fa-download action download-action"></i></span>
                    <span><i data-id="${id}" data-name="${data.name}" id="edit-action-${id}" class="fa fa-edit action edit-action"></i></span>
                    <span><i data-id="${id}" data-name="${data.name}" id="delete-action-${id}" class="fa fa-trash action delete-action"></i></span>
                </td>
            </tr>
            `)
            downloadAction()
            editAction();
            deleteAction();
        }
    }

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    $('#uploadButton').click((e) => {
        $('.progress').removeClass('hide')
        $(e.target).attr('disabled', "")
        let uploadFile = document.getElementById('attachment')
        if (uploadFile.files.length === 0) {
            $('#uploadButton').removeAttr('disabled')
            return alert('Vui long chon file')
        }
        let data = getEmail_Path()
        let file = uploadFile.files[0];
        let form = new FormData();
        form.set('email', data.email)
        form.set('path', data.path);
        form.set('attachment', file);
        $.ajax({
            type: 'POST',
            url: "/upload",
            data: form,
            processData: false,
            contentType: false,
            xhr: function () {
                const xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener("progress", e => {
                        const { loaded, total } = e;
                        progress = (loaded / total) * 100;
                        $('#upload_progress').css("width", progress + '%');
                    }, false);
                    return xhr;
                }
            },
            success: function (data) {
                if (data.code === 0) {
                    let id = parseInt($(`#tbody_id tr:last`).attr('data-id')) + 1
                    ajaxAddFile(id, data.data)
                }
                setTimeout(() => {
                    $('#upload_progress').css('width', 0 + '%');
                    $('.progress').addClass('hide')
                    $('#uploadButton').removeAttr('disabled')
                }, 500)
            }
        });
    })

    $("#input-search").on("keyup", function () {
        let lengthId = ($(`#tbody_id tr:last`).attr('data-id'))
        var value = $(this).val().toLowerCase();
        let currentId = []
        let table = []
        for (let i = 0; i <= lengthId; i++) {
            if ($(`#nameFile-${i}`).text() !== '') {
                table.push($(`#nameFile-${i}`))
                currentId.push(i)
            }
        }
        table.filter(function (t, i) {
            if (t) {
                $(`#row${currentId[i]}`).toggle(t.text().toLowerCase().indexOf(value) > -1)
            }
        });
    });

    $('#createFolder').click((e) => {
        $('#new-folder-dialog').modal('show')
    })

    $('#btn-confirm-new-folder').click((e) => {
        let nameFolder = $('#input-new-folder').val()
        let data = getEmail_Path()
        fetch('http://localhost:3000/new-folder/' + nameFolder, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(json => {
            if (json.code === 0) {
                let id = parseInt($(`#tbody_id tr:last`).attr('data-id')) + 1
                ajaxAddFile(id, json.data)
            }
            else {
                alert(json.message)
            }
        }).catch(
            error => console.log(error)
        );
    })

    $('#createFile').click((e) => {
        $('#new-file-dialog').modal('show')
    })

    $('#btn-confirm-new-file').click((e) => {
        let nameFile = $('#input-new-file').val()
        let content = $('#input-content-new-file').val()
        let data = getEmail_Path()
        data.content = content
        fetch('http://localhost:3000/new-file/' + nameFile, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(json => {
            if (json.code === 0) {
                let id = parseInt($(`#tbody_id tr:last`).attr('data-id')) + 1

                ajaxAddFile(id, json.data)
            }
            else {
                alert(json.message)
            }
        }).catch(
            error => console.log(error)
        );
    })

    function downloadAction() {
        $('.download-action').click((e) => {
            let name = e.target.dataset.name
            let data = getEmail_Path()
            fetch('http://localhost:3000/download/' + name, {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then(
                response => response.json()
            ).then(json => {
                if (json.code === 0) {
                    window.location.href = 'http://localhost:3000/download/' + encodeURIComponent(json.data)
                }
                else {
                    alert(json.message)
                }
            }).catch(
                error => console.log(error)
            );
        })
    }
    downloadAction();

    function editAction() {
        $('.action.edit-action').on("click", function (e) {
            let nameFile = e.target.dataset.name
            let id = e.target.dataset.id
            $('#confirm-rename').modal('show')
            $('#input-rename').val(nameFile)
            $('.modal-edit .name-rename').html(nameFile)
            $('#btn-confirm-rename').attr('data-id', id)
        })
    }
    editAction();

    $('#btn-confirm-rename').click((e) => {
        let id = e.target.dataset.id
        let oldName = $('.modal-edit .name-rename').text()
        let newName = $('#input-rename').val()
        let data = getEmail_Path()
        data.newName = newName
        fetch('http://localhost:3000/rename/' + oldName, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(json => {
            if (json.code === 0) {
                $(`#nameFile-${id}`).replaceWith(`<span id="nameFile-${id}" >${newName}</span>`)
                $(`#edit-action-${id}`).attr('data-name', newName)
                let oldSubPath = $(`#subPath-${id}`).attr('href')
                let newSubPath = oldSubPath.replace(oldName, newName)
                $(`#subPath-${id}`).attr('href', newSubPath)
                $(`#delete-action-${id}`).attr('data-name', newName)
                $(`#download-action-${id}`).attr('data-name', newName)
            }
            else {
                alert(json.message)
            }
        }
        ).catch(
            error => console.log(error)
        );
    })

    function deleteAction() {
        $('.delete-action').on("click", function (e) {
            let id = e.target.dataset.id
            let nameFile = e.target.dataset.name
            $('#confirm-delete').modal('show')
            $('.modal-delete .name-delete').html(nameFile)
            $('#btn-confirm-delete').attr('data-id', id)
        })
    }
    deleteAction();

    $('#btn-confirm-delete').click((e) => {
        let id = e.target.dataset.id
        let name = $('.modal-delete .name-delete').text()
        let data = getEmail_Path()
        fetch('http://localhost:3000/delete/' + name, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(json => {
            if (json.code === 0) {
                $(`tr#row${id}`).remove()
            }
            else {
                alert(json.message)
            }
        }).catch(
            error => console.log(error)
        );
    })
})