$(document).ready(() => {
    let url = (window.location.search);
    let aUrl = url.split('/')
    let aLink = ''
    aUrl.forEach(function(u) {
        aLink += u + '/'
        if(u !== ''){
            let U = u.split('?dir=')
            console.log(U);
            let newLi = `<li class="breadcrumb-item"><a href="/${aLink}">${U.pop()}</a></li>`
            $('.breadcrumb').append(newLi);

        }
    })

    $('.action.edit-action').click((e) => {
        let nameFile = e.target.dataset.name
        let id = e.target.dataset.id

        $('#confirm-rename').modal('show')
        $('#input-rename').val(nameFile)
        $('.modal-edit .name-rename').html(nameFile)
        $('#btn-confirm-rename').attr('data-id', id)
    })

    $('#btn-confirm-rename').click((e) => {
        let id = e.target.dataset.id
        let oldName = $('.modal-edit .name-rename').text()
        let newName = $('#input-rename').val()

        // console.log($(`#nameFile-${oldName}`).text()); 
        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
        let data = { newName, email, path }

        fetch('http://localhost:3000/rename/' + oldName, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(json => {
            if (json.code === 0) {
                // console.log($('#input-rename').val());
                $(`#nameFile-${id}`).replaceWith(`<span id="nameFile-${id}" >${newName}</span>`)

                $(`#edit-action-${id}`).attr('data-name', newName)



                //thay doi subPath
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

    $('#createFolder').click((e) => {
        $('#new-folder-dialog').modal('show')

        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
    })

    $('#btn-confirm-new-folder').click((e) => {
        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
        let nameFolder = $('#input-new-folder').val()

        let data = { email, path }

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
        }
        ).catch(
            error => console.log(error)
        );
    })

    $('.delete-action').on("click",function (e) {
        let id = e.target.dataset.id
        let nameFile = e.target.dataset.name

        $('#confirm-delete').modal('show')
        $('.modal-delete .name-delete').html(nameFile)
        $('#btn-confirm-delete').attr('data-id', id)
    })

    $('#btn-confirm-delete').click((e) => {
        let id = e.target.dataset.id
        let name = $('.modal-delete .name-delete').text()

        // console.log($(`#nameFile-${oldName}`).text()); 
        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
        let data = { email, path }
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
        }
        ).catch(
            error => console.log(error)
        );
    })

    function ajaxAddFile(id, data) {
        // let size = file.size
        // if(size >= 1024) {
        //     size = Math.round(size / 1024.0).toFixed(0)
        //     size = size + 'KB'
        //     if(parseInt(size) >= 1024) {
        //         size = (parseInt(size) * 1.0 / 1024.0).toFixed(2)
        //         size = size + 'MB'
        //     }
        // }

        var tbody = $('#tbody_id');
        let duplicate = false;
        // let iconFile = icon[0].toString()
        for (let index = 0; index < $('#tbody_id tr td').length; index++) {
            if (data.name === $('#tbody_id tr td')[index].textContent.trim()) {
                duplicate = true;
            }
        }

        if(parseFloat(data.size) == 0.0) {
            data.size = '-'
        }

        if(data.type != 'Folder'){
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
                    <span><i class="fa fa-download action"></i></span>
                    <span><i data-id="${id}" data-name="${data.name}" id="edit-action-${id}" class="fa fa-edit action edit-action"></i></span>
                    <span><i data-id="${id}" data-name="${data.name}" id="delete-action-${id}" class="fa fa-trash action delete-action"></i></span>
                </td>

            </tr>
            `)
            $('.delete-action').on("click",function (e) {
                let id = e.target.dataset.id
                let nameFile = e.target.dataset.name
        
                $('#confirm-delete').modal('show')
                $('.modal-delete .name-delete').html(nameFile)
                $('#btn-confirm-delete').attr('data-id', id)
            })

            $('.action.edit-action').on("click",function (e) {
                let nameFile = e.target.dataset.name
                let id = e.target.dataset.id
        
                $('#confirm-rename').modal('show')
                $('#input-rename').val(nameFile)
                $('.modal-edit .name-rename').html(nameFile)
                $('#btn-confirm-rename').attr('data-id', id)
            })
        }
    }

    $('#createFile').click((e) => {
        $('#new-file-dialog').modal('show')

        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
    })

    $('#btn-confirm-new-file').click((e) => {
        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
        let nameFile = $('#input-new-file').val()
        let content = $('#input-content-new-file').val()

        let data = { email, path , content}

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
        }
        ).catch(
            error => console.log(error)
        );
    })

    $('.download-action').click((e) => {
        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path
        let name = e.target.dataset.name

        let data = { email, path}
        fetch('http://localhost:3000/download/' + name, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(
            response => response.json()
        ).then(json => {
            if (json.code === 0) {
                window.location.href = 'http://localhost:3000/download/' + encodeURIComponent (json.data)
            }
            else {
                alert(json.message)
            }
        }
        ).catch(
            error => console.log(error)
        );

    })
})