$(document).ready(() => {
    $('#uploadButton').click((e) => {
        $('.progress').removeClass('hide')
        $(e.target).attr('disabled', "")
        let uploadFile = document.getElementById('attachment')


        if (uploadFile.files.length === 0) {
            $('#uploadButton').removeAttr('disabled')
            return alert('Vui long chon file')
        }

        let getEmail = document.getElementById('user-email')

        let email = getEmail.dataset.email
        let path = getEmail.dataset.path

        let file = uploadFile.files[0];

        let form = new FormData();

        form.set('email', email)
        form.set('path', path);
        form.set('attachment', file);
        let upload_progress = document.getElementById('upload_progress')

        upload_progress.style.width = '0%'
        let icon = file.type.split('/')

        // fetch('http://localhost:3000/upload', {
        //     method: 'post',
        //     body: form,
        // }).then(
        //     response => response.json()
        // ).then(json => {
        //     if (json.code === 0) {
        //         let id = parseInt($(`#tbody_id tr:last`).attr('data-id')) + 1
        //         var xhr = new window.XMLHttpRequest();
        //         xhr.upload.addEventListener("progress", function (evt) {
        //             if (evt.lengthComputable) {
        //                 var percentComplete = evt.loaded / evt.total;
        //                 console.log(percentComplete);
        //                 $('.progress').css({
        //                     width: percentComplete * 100 + '%'
        //                 });
        //                 if (percentComplete === 1) {
        //                     $('.progress').addClass('hide');
        //                 }
        //             }
        //         }, false);
        //         // move()
        //         ajaxAddFile(file, path, icon, id, json.data)
        //     }
        // }
        // ).catch(
        //     error => console.log(error)
        // );

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
                        // console.log(percentComplete);
                        $('#upload_progress').css("width", progress + '%');
                    },
                        false);
                    return xhr;
                }
            },
            success: function (data) {
                if (data.code === 0) {
                    let id = parseInt($(`#tbody_id tr:last`).attr('data-id')) + 1
                    ajaxAddFile(file, path, icon, id, data.data)

                }
                setTimeout(() => {
                    $('#upload_progress').css('width', 0 + '%');
                    $('.progress').addClass('hide')
                    $('#uploadButton').removeAttr('disabled')
                }, 500)
            }
        });


    })

    function ajaxAddFile(file, path, icon, id, data) {
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
            if (file.name === $('#tbody_id tr td')[index].textContent.trim()) {
                duplicate = true;
            }
        }

        // if(!iconFile || iconFile === 'application' || iconFile === 'text') {
        //     iconFile = 'alt'
        // }

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
                    File
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
            $('.delete-action').on("click", function (e) {
                let id = e.target.dataset.id
                let nameFile = e.target.dataset.name

                $('#confirm-delete').modal('show')
                $('.modal-delete .name-delete').html(nameFile)
                $('#btn-confirm-delete').attr('data-id', id)
            })

            $('.action.edit-action').on("click", function (e) {
                let nameFile = e.target.dataset.name
                let id = e.target.dataset.id

                $('#confirm-rename').modal('show')
                $('#input-rename').val(nameFile)
                $('.modal-edit .name-rename').html(nameFile)
                $('#btn-confirm-rename').attr('data-id', id)
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
        }
    }

    $("#input-search").on("keyup", function () {
        let lengthId = ($(`#tbody_id tr:last`).attr('data-id'))
        var value = $(this).val().toLowerCase();

        let currentId = []
        let table = []

        for (let i = 0; i <= lengthId; i++) {

            if ($(`#nameFile-${i}`).text() !== '') {
                table.push($(`#nameFile-${i}`))
                currentId.push(i)
                // console.log($(`#nameFile-${i}`).text());
            }
        }
        // console.log(currentId, table);
        table.filter(function (t, i) {
            if (t) {
                $(`#row${currentId[i]}`).toggle(t.text().toLowerCase().indexOf(value) > -1)
            }
        });
    });
})