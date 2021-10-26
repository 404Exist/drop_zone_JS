var fileStore = [],
    newestFiles = [],
    pushFiles = true,
    errorMsgs;
let imagesExtensions = ['jpeg', 'jpg', 'png', 'gif', 'ico', 'icon', 'bmp', 'webp', 'psd', 'pdf', 'ai', 'raw', 'heif', 'indd', 'eps','jpe' ,'jif', 'jfif', 'jfi'],
    htmlExtensions = ['htm', 'html', 'xhtml', 'jhtml'],
    cssExtensions = ['css', 'scss', 'sass', 'less', 'ccss', 'pcss'],
    jsExtensions = ['js', 'jsx', 'vue'],
    phpExtensions = ['php', 'php4', 'php3', 'phtml'],
    codeExtensions = ['hss', 'asp', 'aspx', 'axd', 'asx', 'asmx', 'ashx', 'cfm', 'yaws', 'swf', 'jsp', 'jspx', 'wss', 'do', 'action', 'pl', 'py', 'rb', 'rhtml', 'shtml', 'xml', 'rss', 'svg', 'cgi', 'dll'],
    wordExtensions = ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'mht', 'mhtml', 'pdf', 'rtf', 'odt', 'wps', 'txt', 'xml'],
    excelExtensions = ['csv', 'dbf', 'dif', 'ods', 'prn', 'slk', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xltm', 'xlt', 'xps'],
    powerPointExtensions = ['emf', 'pot', 'potm', 'potx', 'ppa', 'ppam', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'thmx'],
    audioExtensions = ['mp3', 'aac', 'ogg', 'flac', 'alac', 'wav', 'aiff', 'dsd', 'pcm'],
    videoExtensions = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'mng', 'avi', 'mov', 'wmv', 'qt', 'yuv', 'rm', 'rmvb', 'viv', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm2v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'],
    zipExtensions = ['zip', 'rar'];
function deleteFile(el, lastModified, fileID, onDeleteFun) {
    if (confirm("Are you sure you want to remove this image ?")) {
        fileStore = fileStore.filter(
            (file) => file.lastModified != lastModified
        );
        if (fileID) {
            let removedFilesInput = document.createElement("input");
            removedFilesInput.setAttribute("type", "hidden");
            removedFilesInput.setAttribute("name", "removedFilesID[]");
            removedFilesInput.setAttribute("value", fileID);
            drop_zone.prepend(removedFilesInput);
            if (onDeleteFun) {
                drop_zone_input.files = new FileListItems(fileStore);
                onDeleteFun(fileID, drop_zone_input.files);
            }
        } else {
            if (onDeleteFun) {
                drop_zone_input.files = new FileListItems(fileStore);
                onDeleteFun(null, drop_zone_input.files);
            }
        }

        el.parentElement.remove();
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals)) + ' ' + sizes[i];
}

function FileListItems(files) {
    var b = new ClipboardEvent("").clipboardData || new DataTransfer();
    for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
    return b.files;
}
function dropZone(data = []) {
    drop_zone.addEventListener("dragover", dragOverHandler);
    drop_zone.addEventListener("drop", dropHandler);
    data["paramName"] = "paramName" in data ? data["paramName"] : "drop_zone_input";
    data["multiple"] = "multiple" in data ? data["multiple"] : false;
    data["addDownloadinks"] = "addDownloadinks" in data ? data["addDownloadinks"] : true;
    data["addRemoveLinks"] = "addRemoveLinks" in data ? data["addRemoveLinks"] : true;
    data["addFileName"] = "addFileName" in data ? data["addFileName"] : true;
    data["addFileSize"] = "addFileSize" in data ? data["addFileSize"] : true;
    data["inputID"] = "inputID" in data ? data["inputID"] : "drop_zone_input";
    data["acceptedFiles"] = "acceptedFiles" in data ? data["acceptedFiles"] : false;
    data["customeMaxFilesMsg"] = "customeMaxFilesMsg" in data ? data["customeMaxFilesMsg"] : false;
    data["customeMaxFileSizeMsg"] = "customeMaxFileSizeMsg" in data ? data["customeMaxFileSizeMsg"] : false;
    data["customeAcceptedFilesMsg"] = "customeAcceptedFilesMsg" in data ? data["customeAcceptedFilesMsg"] : false;
    data["oldFilesPath"] = "oldFilesPath" in data && data["oldFilesPath"] != '' ? data["oldFilesPath"].split("||") : false;
    data["oldFilesID"] = "oldFilesID" in data && data["oldFilesID"] != '' ? data["oldFilesID"].split("||") : false;
    if (data["acceptedFiles"]) {
        if (!Array.isArray(data['acceptedFiles'])) {
            data['acceptedFiles'] = data["acceptedFiles"].replace(/\s/g,'');
        } else {
            for (var i = 0; i < data['acceptedFiles'].length; i++) {
                data['acceptedFiles'][i] = data["acceptedFiles"][i].replace(/\s/g,'');
            }
        }
    }

    let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("style", "display:none;");
        input.setAttribute("name", data["multiple"] ? data["paramName"] + "[]" : data["paramName"]);
        input.setAttribute("id", data["inputID"]);

        data["multiple"] ? input.setAttribute("multiple", "multiple") : "";
        if (data["acceptedFiles"]) {
            if (!Array.isArray(data['acceptedFiles'])) {
                data['acceptedFiles'] = data['acceptedFiles'].split(',');
            }
            var acceptWithInput = '', acceptedExts = '';
            for (var i =0; i< data['acceptedFiles'].length; i++) {
                acceptedExts = data['acceptedFiles'][i] == 'jpg' ? 'jpeg' : data['acceptedFiles'][i];
                if (imagesExtensions.includes(acceptedExts)) acceptWithInput += `image/${acceptedExts}, `;
                else if (videoExtensions.includes(acceptedExts)) acceptWithInput += `video/${acceptedExts}, `;
                else if (audioExtensions.includes(acceptedExts)) acceptWithInput += `audio/${acceptedExts}, `;
                else acceptWithInput += `.${acceptedExts}, `;
            }
            acceptWithInput = acceptWithInput.substring(0, acceptWithInput.length - 1);
            acceptWithInput = acceptWithInput.substring(0, acceptWithInput.length - 1);
            input.setAttribute("accept", acceptWithInput);
        }
    drop_zone.prepend(input);
    drop_zone.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() != 'a' && e.target.tagName.toLowerCase() != 'span' && e.target.tagName.toLowerCase() != 'audio' && e.target.tagName.toLowerCase() != 'video') {
            input.click();
        }
    });

    function printErrorMsg(theMsg = '') {
        var msgsELe = document.getElementById('drop_zone_errorMsgs');
        if (msgsELe) {
            msgsELe.innerHTML = theMsg;
            document.getElementById('drop_zone_errorMsgs').className = "drop_zone_errorMsgs--show";
            setTimeout(() => {
                document.getElementById('drop_zone_errorMsgs').className = "drop_zone_errorMsgs--remove";
            }, 2500);
        } else {
            msgsELe = document.createElement('p');
            msgsELe.setAttribute('class', 'drop_zone_errorMsgs--show');
            msgsELe.setAttribute('id', 'drop_zone_errorMsgs');
            msgsELe.innerHTML = theMsg;
            drop_zone.prepend(msgsELe);
        }
    }
    function pushFileWithValidations(files) {
        if (files) {
            newestFiles = [];
            if (data["multiple"]) {
                if ("maxFiles" in data) {
                    if (files.length+drop_zone.querySelectorAll('div').length <= data['maxFiles']) {
                        pushFiles = true;
                    } else {
                        pushFiles = false;
                        errorMsgs = data["customeMaxFilesMsg"] ? data["customeMaxFilesMsg"] : `You can't upload more than ${data['maxFiles']} files`;
                    }
                }
            } else {
                if (files.length == 1 && drop_zone.querySelectorAll('div').length == 0) {
                    pushFiles = true;
                } else {
                    pushFiles = false;
                    errorMsgs = data["customeMaxFilesMsg"] ? data["customeMaxFilesMsg"] : 'You can\'t upload more than 1 file';
                }

            }

            if (pushFiles) {
                for (var i = 0; i < files.length; i++) {
                    var file = typeof  files[i].name == 'string' ? files[i] : files[i].getAsFile(),
                        fileExtension = file.name.split('.')[file.name.split('.').length - 1];
                    if (data["acceptedFiles"]) {
                        if ('maxFileSize' in data) {
                            if (!Array.isArray(data['acceptedFiles'])) {
                                data['acceptedFiles'] = data['acceptedFiles'].split(',');
                            }
                            if (data['acceptedFiles'].includes(fileExtension)) {
                                if (file.size <= data['maxFileSize']) {
                                    pushFiles = true;
                                } else {
                                    pushFiles = false;
                                    errorMsgs = data["customeMaxFileSizeMsg"] ? data["customeMaxFileSizeMsg"] : `Sorry, but max file size must be ${formatBytes(data['maxFileSize'])}`;
                                }
                            } else {
                                pushFiles = false;
                                errorMsgs = data["customeAcceptedFilesMsg"] ? data["customeAcceptedFilesMsg"] : `Sorry, but allowed extensions are [ ${data['acceptedFiles'].join(', ')} ]`;
                            }

                        } else {
                            if (!Array.isArray(data['acceptedFiles'])) {
                                data['acceptedFiles'] = data['acceptedFiles'].split(',');
                            }
                            if (data['acceptedFiles'].includes(fileExtension)) {
                                pushFiles = true;
                            } else {
                                pushFiles = false;
                                errorMsgs = data["customeAcceptedFilesMsg"] ? data["customeAcceptedFilesMsg"] : `Sorry, but allowed extensions are [ ${data['acceptedFiles'].join(', ')} ]`;
                            }
                        }
                    } else {
                        if ('maxFileSize' in data) {
                            if (file.size <= data['maxFileSize']) {
                                pushFiles = true;
                            } else {
                                pushFiles = false;
                                errorMsgs = data["customeMaxFileSizeMsg"] ? data["customeMaxFileSizeMsg"] : `Sorry, but max file size must be ${formatBytes(data['maxFileSize'])}`;
                            }
                        }
                    }

                    if (pushFiles) {
                        fileStore.push(file);
                        newestFiles.push(file);
                    } else {
                        printErrorMsg(errorMsgs);
                    }
                }
            } else {
                printErrorMsg(errorMsgs);
            }
        }
        drop_zone_input.files = new FileListItems(fileStore);
        'onUpload' in data ? data['onUpload'](newestFiles, drop_zone_input.files) : '';
        getImageUrlBase64(newestFiles);
    }

    input.onchange = function () {
        pushFileWithValidations(input.files);
    };

    function dropHandler(e) {
        e.preventDefault();
        pushFileWithValidations(e.dataTransfer.items);
    }
    function dragOverHandler(e) {
        e.preventDefault();
    }

    function getImageUrlBase64(files, fileID = false) {
        function buildUi(file, fileID = false) {
            var fileExtension = file.name.split('.')[file.name.split('.').length - 1];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                productImageUrl = reader.result;
                let showFile= '', removeLink= '', downloadLink= '', fileSize= '', fileName= '';
                if (imagesExtensions.includes(fileExtension)) {
                    showFile = `<img src="${productImageUrl}" alt="${file.name}"/>`;
                } else if (zipExtensions.includes(fileExtension)) {
                    showFile = `<i class="far fa-file-archive fa-9x"></i>`;
                } else if (htmlExtensions.includes(fileExtension)) {
                    showFile = `<i class="fab fa-html5 fa-9x"></i>`;
                } else if (cssExtensions.includes(fileExtension)) {
                    showFile = `<i class="fab fa-css3 fa-9x"></i>`;
                } else if (jsExtensions.includes(fileExtension)) {
                    showFile = `<i class="fab fa-js-square fa-9x"></i>`;
                } else if (phpExtensions.includes(fileExtension)) {
                    showFile = `<i class="fab fa-php fa-9x"></i>`;
                } else if (codeExtensions.includes(fileExtension)) {
                    showFile = `<i class="fab fa-file-code fa-9x"></i>`;
                } else if (wordExtensions.includes(fileExtension)) {
                    showFile = `<i class="far fa-file-word fa-9x"></i>`;
                } else if (excelExtensions.includes(fileExtension)) {
                    showFile = `<i class="fas fa-file-excel fa-9x"></i>`;
                } else if (powerPointExtensions.includes(fileExtension)) {
                    showFile = `<i class="far fa-file-powerpoint fa-9x"></i>`;
                } else if (audioExtensions.includes(fileExtension)) {
                    showFile = `<audio src="${productImageUrl}" alt="${file.name}" style="height: 100%;width: 100%;z-index: 1;" controls></audio>`;
                } else if (videoExtensions.includes(fileExtension)) {
                    showFile = `<video src="${productImageUrl}" alt="${file.name}" style="height: 100%;object-fit: fill;z-index: 1;" controls></video>`;
                } else {
                    showFile = `<i class="fas fa-file fa-9x"></i>`;
                }
                var onDeleteFun = 'onDelete' in data ? data['onDelete'] : '';
                if (data["addDownloadinks"]) downloadLink = `<a download="myCustomDropZone" href="${productImageUrl}" style="right: auto;color:#52fdae;" title="Download"> &downarrow; </a>`;
                if (data["addRemoveLinks"]) removeLink = `<a onClick="deleteFile(this,${file.lastModified},${fileID},${onDeleteFun});" title="Delete"> &Cross; </a>`;
                if (data["addFileSize"]) fileSize = `<span style="top: 10%;">SIZE: ${formatBytes(file.size)}</span>`;
                if (data["addFileName"]) fileName = `<span>${file.name}</span>`;

                drop_zone.innerHTML += `
            <div>
                ${showFile}
                ${fileName}
                ${fileSize}
                ${removeLink}
                ${downloadLink}
            </div>
            `;
            };
            reader.onerror = function () {
                alert("Error!!");
            };
        }
        if (Array.isArray(files)) {
            files.forEach((file) => {
                buildUi(file);
            });
        } else {
            buildUi(files, fileID);
        }
    }

    if (data["oldFilesPath"]  && data['oldFilesID']) {
        for (let i = 0; i < data["oldFilesPath"].length; i++) {
            async function createFile(path = data["oldFilesPath"][i], fileID = data["oldFilesID"][i]) {
                var theFile = path.split("/")[path.split("/").length -1];
                let data = await fetch(path).then((response) =>
                    response.blob()
                );
                let metadata = {
                    type: data.type,
                };
                createdFile = new File([data], theFile, metadata);
                getImageUrlBase64(createdFile, fileID);
            }
            createFile();
        }
    }

    if ('submitButtons' in data) {
        let submitBtns = data['submitButtons'].split(','), submitBtn;
        submitBtns.forEach(btn => {
            submitBtn = document.querySelector(btn);
            if (submitBtn) {
                submitBtn.setAttribute('onclick', `drop_zone_input.files = new FileListItems(fileStore);${submitBtn.getAttribute('onclick') != null ? submitBtn.getAttribute('onclick') : ''}`)
            } else {
                alert(`sorry but this submitButton ${btn} you set in Drop Zone isn't exist`)
            }
        })
    }
}