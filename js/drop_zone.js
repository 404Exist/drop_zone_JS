let dropZoneFilesStore = [];
const dropZone = data => new DropZone(data);
class DropZone {
  constructor(data = []) {
    this.data = data;
    this.pushFiles = true;
    this.newestFiles = [];
    this.imagesExtensions = ['jpeg', 'jpg', 'png', 'gif', 'ico', 'icon', 'bmp', 'webp', 'psd', 'pdf', 'ai', 'raw', 'heif', 'indd', 'eps','jpe' ,'jif', 'jfif', 'jfi'];
    this.htmlExtensions = ['htm', 'html', 'xhtml', 'jhtml'];
    this.cssExtensions = ['css', 'scss', 'sass', 'less', 'ccss', 'pcss'];
    this.jsExtensions = ['js', 'jsx', 'vue'];
    this.phpExtensions = ['php', 'php4', 'php3', 'phtml'];
    this.codeExtensions = ['hss', 'asp', 'aspx', 'axd', 'asx', 'asmx', 'ashx', 'cfm', 'yaws', 'swf', 'jsp', 'jspx', 'wss', 'do', 'action', 'pl', 'py', 'rb', 'rhtml', 'shtml', 'xml', 'rss', 'svg', 'cgi', 'dll'];
    this.wordExtensions = ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'mht', 'mhtml', 'pdf', 'rtf', 'odt', 'wps', 'txt', 'xml'];
    this.excelExtensions = ['csv', 'dbf', 'dif', 'ods', 'prn', 'slk', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xltm', 'xlt', 'xps'];
    this.powerPointExtensions = ['emf', 'pot', 'potm', 'potx', 'ppa', 'ppam', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'thmx'];
    this.audioExtensions = ['mp3', 'aac', 'ogg', 'flac', 'alac', 'wav', 'aiff', 'dsd', 'pcm'];
    this.videoExtensions = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'mng', 'avi', 'mov', 'wmv', 'qt', 'yuv', 'rm', 'rmvb', 'viv', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm2v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'];
    this.zipExtensions = ['zip', 'rar'];

    const vm = this;
    drop_zone.addEventListener("dragover", this.dragOverHandler);
    drop_zone.addEventListener("drop", (e) => this.dropHandler(e, vm));
    vm.data["paramName"] = "paramName" in vm.data ? vm.data["paramName"] : "drop_zone_input";
    vm.data["multiple"] = "multiple" in vm.data ? vm.data["multiple"] : false;
    vm.data["addDownloadinks"] = "addDownloadinks" in vm.data ? vm.data["addDownloadinks"] : true;
    vm.data["addRemoveLinks"] = "addRemoveLinks" in vm.data ? vm.data["addRemoveLinks"] : true;
    vm.data["addFileName"] = "addFileName" in vm.data ? vm.data["addFileName"] : true;
    vm.data["addFileSize"] = "addFileSize" in vm.data ? vm.data["addFileSize"] : true;
    vm.data["removeMessageAfter"] = "removeMessageAfter" in vm.data ? vm.data["removeMessageAfter"] : 2500;
    vm.data["inputID"] = "inputID" in vm.data ? vm.data["inputID"] : "drop_zone_input";
    vm.data["acceptedFiles"] = "acceptedFiles" in vm.data ? vm.data["acceptedFiles"] : false;
    vm.data["customeMaxFilesMsg"] = "customeMaxFilesMsg" in vm.data ? vm.data["customeMaxFilesMsg"] : false;
    vm.data["customeMaxFileSizeMsg"] = "customeMaxFileSizeMsg" in vm.data ? vm.data["customeMaxFileSizeMsg"] : false;
    vm.data["customeAcceptedFilesMsg"] = "customeAcceptedFilesMsg" in vm.data ? vm.data["customeAcceptedFilesMsg"] : false;
    vm.data["oldFilesPath"] = "oldFilesPath" in vm.data && vm.data["oldFilesPath"] != '' ? vm.data["oldFilesPath"].split("||") : false;
    vm.data["oldFilesID"] = "oldFilesID" in vm.data && vm.data["oldFilesID"] != '' ? vm.data["oldFilesID"].split("||") : false;
    if (vm.data["acceptedFiles"]) {
        if (!Array.isArray(vm.data['acceptedFiles'])) {
            vm.data['acceptedFiles'] = vm.data["acceptedFiles"].replace(/\s/g,'');
        } else {
            for (var i = 0; i < vm.data['acceptedFiles'].length; i++) {
                vm.data['acceptedFiles'][i] = vm.data["acceptedFiles"][i].replace(/\s/g,'');
            }
        }
    }
    if (vm.data["deleting"]  == undefined && vm.data["submitting"]  == undefined) {
      let input = this.createInputFile();
      drop_zone.addEventListener("click", (e) => {
          if (e.target.tagName.toLowerCase() != 'a' && e.target.tagName.toLowerCase() != 'span' && e.target.tagName.toLowerCase() != 'audio' && e.target.tagName.toLowerCase() != 'video') {
            input.click();
          }
      });
      input.onchange = function () {
        vm.pushFileWithValidations(input.files);
      };
    }

    if (vm.data["oldFilesPath"]  && vm.data['oldFilesID']) {
        for (let i = 0; i < vm.data["oldFilesPath"].length; i++) {
            async function createFile(path = vm.data["oldFilesPath"][i], fileID = vm.data["oldFilesID"][i]) {
                var theFile = path.split("/")[path.split("/").length -1];
                let data = await fetch(path).then((response) =>
                    response.blob()
                );
                let metadata = {
                    type: vm.data.type,
                };
                var createdFile = new File([data], theFile, metadata);
                vm.getImageUrlBase64(createdFile, fileID);
            }
            createFile();
        }
    }

    if ('submitButtons' in vm.data) {
        let submitBtns = vm.data['submitButtons'].split(','), submitBtn;
        submitBtns.forEach(btn => {
            submitBtn = document.querySelector(btn);
            if (submitBtn) {
                submitBtn.setAttribute('onclick', `drop_zone_input.files = new DropZone({submitting: true}).FileListItems(dropZoneFilesStore);${submitBtn.getAttribute('onclick') != null ? submitBtn.getAttribute('onclick') : ''}`)
            } else {
                alert(`sorry but this submitButton ${btn} you set in Drop Zone isn't exist`)
            }
        })
    }
  }
  createInputFile() {
    if (document.getElementById(this.data["inputID"])) return document.getElementById(this.data["inputID"]);
    let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("style", "display:none;");
        input.setAttribute("name", this.data["multiple"] ? this.data["paramName"] + "[]" : this.data["paramName"]);
        input.setAttribute("id", this.data["inputID"]);

        this.data["multiple"] ? input.setAttribute("multiple", "multiple") : "";
        if (this.data["acceptedFiles"]) {
            if (!Array.isArray(this.data['acceptedFiles'])) {
                this.data['acceptedFiles'] = this.data['acceptedFiles'].split(',');
            }
            var acceptWithInput = '', acceptedExts = '';
            for (var i =0; i< this.data['acceptedFiles'].length; i++) {
                acceptedExts = this.data['acceptedFiles'][i] == 'jpg' ? 'jpeg' : this.data['acceptedFiles'][i];
                if (this.imagesExtensions.includes(acceptedExts)) acceptWithInput += `image/${acceptedExts}, `;
                else if (this.videoExtensions.includes(acceptedExts)) acceptWithInput += `video/${acceptedExts}, `;
                else if (this.audioExtensions.includes(acceptedExts)) acceptWithInput += `audio/${acceptedExts}, `;
                else acceptWithInput += `.${acceptedExts}, `;
            }
            acceptWithInput = acceptWithInput.substring(0, acceptWithInput.length - 1);
            acceptWithInput = acceptWithInput.substring(0, acceptWithInput.length - 1);
            input.setAttribute("accept", acceptWithInput);
        }
    drop_zone.prepend(input);
    return input;
  }
  printErrorMsg(theMsg = '') {
    const vm = this;
      var msgsELe = document.getElementById('drop_zone_errorMsgs');
      if (msgsELe) {
          msgsELe.innerHTML = theMsg;
          document.getElementById('drop_zone_errorMsgs').className = "drop_zone_errorMsgs--show";
      } else {
          msgsELe = document.createElement('p');
          msgsELe.setAttribute('class', 'drop_zone_errorMsgs--show');
          msgsELe.setAttribute('id', 'drop_zone_errorMsgs');
          msgsELe.innerHTML = theMsg;
          drop_zone.prepend(msgsELe);
      }
      if (vm.data['removeMessageAfter']) {
        setTimeout(() => {
            document.getElementById('drop_zone_errorMsgs').className = "drop_zone_errorMsgs--remove";
        }, vm.data['removeMessageAfter']);
      }
  }
  pushFileWithValidations(files) {
      if (files) {
        this.newestFiles = [];
          if (this.data["multiple"]) {
              if ("maxFiles" in this.data) {
                  if (files.length+drop_zone.querySelectorAll('div').length <= this.data['maxFiles']) {
                      this.pushFiles = true;
                  } else {
                      this.pushFiles = false;
                      this.errorMsgs = this.data["customeMaxFilesMsg"] ? this.data["customeMaxFilesMsg"] : `You can't upload more than ${this.data['maxFiles']} files`;
                  }
              }
          } else {
              if (files.length == 1 && drop_zone.querySelectorAll('div').length == 0) {
                  this.pushFiles = true;
              } else {
                  this.pushFiles = false;
                  this.errorMsgs = this.data["customeMaxFilesMsg"] ? this.data["customeMaxFilesMsg"] : 'You can\'t upload more than 1 file';
              }

          }

          if (this.pushFiles) {
              for (var i = 0; i < files.length; i++) {
                  var file = typeof  files[i].name == 'string' ? files[i] : files[i].getAsFile(),
                      fileExtension = file.name.split('.')[file.name.split('.').length - 1];
                  if (this.data["acceptedFiles"]) {
                      if ('maxFileSize' in this.data) {
                          if (!Array.isArray(this.data['acceptedFiles'])) {
                              this.data['acceptedFiles'] = this.data['acceptedFiles'].split(',');
                          }
                          if (this.data['acceptedFiles'].includes(fileExtension)) {
                              if (file.size <= this.data['maxFileSize']) {
                                  this.pushFiles = true;
                              } else {
                                  this.pushFiles = false;
                                  this.errorMsgs = this.data["customeMaxFileSizeMsg"] ? this.data["customeMaxFileSizeMsg"] : `Sorry, but max file size must be ${this.formatBytes(this.data['maxFileSize'])}`;
                              }
                          } else {
                              this.pushFiles = false;
                              this.errorMsgs = this.data["customeAcceptedFilesMsg"] ? this.data["customeAcceptedFilesMsg"] : `Sorry, but allowed extensions are [ ${this.data['acceptedFiles'].join(', ')} ]`;
                          }

                      } else {
                          if (!Array.isArray(this.data['acceptedFiles'])) {
                              this.data['acceptedFiles'] = this.data['acceptedFiles'].split(',');
                          }
                          if (this.data['acceptedFiles'].includes(fileExtension)) {
                              this.pushFiles = true;
                          } else {
                              this.pushFiles = false;
                              this.errorMsgs = this.data["customeAcceptedFilesMsg"] ? this.data["customeAcceptedFilesMsg"] : `Sorry, but allowed extensions are [ ${this.data['acceptedFiles'].join(', ')} ]`;
                          }
                      }
                  } else {
                      if ('maxFileSize' in this.data) {
                          if (file.size <= this.data['maxFileSize']) {
                              this.pushFiles = true;
                          } else {
                              this.pushFiles = false;
                              this.errorMsgs = this.data["customeMaxFileSizeMsg"] ? this.data["customeMaxFileSizeMsg"] : `Sorry, but max file size must be ${this.formatBytes(this.data['maxFileSize'])}`;
                          }
                      }
                  }

                  if (this.pushFiles) {
                      dropZoneFilesStore.push(file);
                      this.newestFiles.push(file);
                  } else {
                      this.printErrorMsg(this.errorMsgs);
                  }
              }
          } else {
              this.printErrorMsg(this.errorMsgs);
          }
      }
      drop_zone_input.files = this.FileListItems(dropZoneFilesStore);
      'onUpload' in this.data ? this.data['onUpload'](this.newestFiles, drop_zone_input.files) : '';
      this.getImageUrlBase64(this.newestFiles);
  }
  dropHandler(e, vm) {
      e.preventDefault();
      vm.pushFileWithValidations(e.dataTransfer.items);
  }
  dragOverHandler(e) {
      e.preventDefault();
  }
  getImageUrlBase64(files, fileID = false) {
    const vm = this;
      function buildUi(file, fileID = false) {
          var fileExtension = file.name.split('.')[file.name.split('.').length - 1];
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
              var productImageUrl = reader.result;
              let showFile= '', removeLink= '', downloadLink= '', fileSize= '', fileName= '';
              if (vm.imagesExtensions.includes(fileExtension)) {
                  showFile = `<img src="${productImageUrl}" alt="${file.name}"/>`;
              } else if (vm.zipExtensions.includes(fileExtension)) {
                  showFile = `<i class="far fa-file-archive fa-9x"></i>`;
              } else if (vm.htmlExtensions.includes(fileExtension)) {
                  showFile = `<i class="fab fa-html5 fa-9x"></i>`;
              } else if (vm.cssExtensions.includes(fileExtension)) {
                  showFile = `<i class="fab fa-css3 fa-9x"></i>`;
              } else if (vm.jsExtensions.includes(fileExtension)) {
                  showFile = `<i class="fab fa-js-square fa-9x"></i>`;
              } else if (vm.phpExtensions.includes(fileExtension)) {
                  showFile = `<i class="fab fa-php fa-9x"></i>`;
              } else if (vm.codeExtensions.includes(fileExtension)) {
                  showFile = `<i class="fab fa-file-code fa-9x"></i>`;
              } else if (vm.wordExtensions.includes(fileExtension)) {
                  showFile = `<i class="far fa-file-word fa-9x"></i>`;
              } else if (vm.excelExtensions.includes(fileExtension)) {
                  showFile = `<i class="fas fa-file-excel fa-9x"></i>`;
              } else if (vm.powerPointExtensions.includes(fileExtension)) {
                  showFile = `<i class="far fa-file-powerpoint fa-9x"></i>`;
              } else if (vm.audioExtensions.includes(fileExtension)) {
                  showFile = `<audio src="${productImageUrl}" alt="${file.name}" style="height: 100%;width: 100%;z-index: 1;" controls></audio>`;
              } else if (vm.videoExtensions.includes(fileExtension)) {
                  showFile = `<video src="${productImageUrl}" alt="${file.name}" style="height: 100%;object-fit: fill;z-index: 1;" controls></video>`;
              } else {
                  showFile = `<i class="fas fa-file fa-9x"></i>`;
              }
              var onDeleteFun = 'onDelete' in vm.data ? vm.data['onDelete'] : '';
              if (vm.data["addDownloadinks"]) downloadLink = `<a download="myCustomDropZone" href="${productImageUrl}" style="right: auto;color:#52fdae;" title="Download"> &downarrow; </a>`;
              if (vm.data["addRemoveLinks"]) removeLink = `<a onClick="new DropZone({deleting: true}).deleteFile(this,${file.lastModified},${fileID},${onDeleteFun});" title="Delete"> &Cross; </a>`;
              if (vm.data["addFileSize"]) fileSize = `<span style="top: 10%;">SIZE: ${vm.formatBytes(file.size)}</span>`;
              if (vm.data["addFileName"]) fileName = `<span>${file.name}</span>`;

              drop_zone.innerHTML += `
              <div>
                  ${showFile}
                  ${fileName}
                  ${fileSize}
                  ${removeLink}
                  ${downloadLink}
              </div>`;
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

  formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';
      let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(1024));
      return parseFloat((bytes / Math.pow(1024, i)).toFixed(decimals)) + ' ' + sizes[i];
  }
  
  deleteFile(el, lastModified, fileID, onDeleteFun) {
      if (confirm("Are you sure you want to remove this image ?")) {
          dropZoneFilesStore = dropZoneFilesStore.filter(
              (file) => file.lastModified != lastModified
          );
          let removedFilesInput = document.createElement("input");
          removedFilesInput.setAttribute("type", "hidden");
          removedFilesInput.setAttribute("name", "removedFilesID[]");
          removedFilesInput.setAttribute("value", fileID);
          fileID && drop_zone.prepend(removedFilesInput);
          if (onDeleteFun) {
              drop_zone_input.files = this.FileListItems(dropZoneFilesStore);
              onDeleteFun(fileID || null, drop_zone_input.files);
          }
          el.parentElement.remove();
      }
  }

  FileListItems(files) {
      var b = new ClipboardEvent("").clipboardData || new DataTransfer();
      for (var i = 0, len = files.length; i < len; i++) b.items.add(files[i]);
      return b.files;
  }
}