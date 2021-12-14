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
    this.jsExtensions = ['js', 'jsx', 'vue', 'ts', 'tsx'];
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
  dropHandler(e, vm) {
    e.preventDefault();
    vm.pushFileWithValidations(e.dataTransfer.items);
  }
  dragOverHandler(e) {
    e.preventDefault();
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
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="far" data-icon="file-zipper" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0L64-.0001c-35.35 0-64 28.65-64 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h48V64h64V48.13h48.01L224 128c0 17.67 14.33 32 32 32h79.1V448zM176 96h-64v32h64V96zM176 160h-64v32h64V160zM176 224h-64l-30.56 116.5C73.51 379.5 103.7 416 144.3 416c40.26 0 70.45-36.3 62.68-75.15L176 224zM160 368H128c-8.836 0-16-7.164-16-16s7.164-16 16-16h32c8.836 0 16 7.164 16 16S168.8 368 160 368z"></path></svg>`;
              } else if (vm.htmlExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="html5" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"></path></svg>`;
              } else if (vm.cssExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="css3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M480 32l-64 368-223.3 80L0 400l19.6-94.8h82l-8 40.6L210 390.2l134.1-44.4 18.8-97.1H29.5l16-82h333.7l10.5-52.7H56.3l16.3-82H480z"></path></svg>`;
              } else if (vm.jsExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="js-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"></path></svg>`;
              } else if (vm.phpExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="php" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="currentColor" d="M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"></path></svg>`;
              } else if (vm.codeExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-code" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM154.1 353.8c7.812 7.812 7.812 20.5 0 28.31C150.2 386.1 145.1 388 140 388s-10.23-1.938-14.14-5.844l-48-48c-7.812-7.812-7.812-20.5 0-28.31l48-48c7.812-7.812 20.47-7.812 28.28 0s7.812 20.5 0 28.31L120.3 320L154.1 353.8zM306.1 305.8c7.812 7.812 7.812 20.5 0 28.31l-48 48C254.2 386.1 249.1 388 244 388s-10.23-1.938-14.14-5.844c-7.812-7.812-7.812-20.5 0-28.31L263.7 320l-33.86-33.84c-7.812-7.812-7.812-20.5 0-28.31s20.47-7.812 28.28 0L306.1 305.8zM256 0v128h128L256 0z"></path></svg>`;
              } else if (vm.wordExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="far" data-icon="file-word" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM214.6 248C211.3 238.4 202.2 232 192 232s-19.25 6.406-22.62 16L144.7 318.1l-25.89-77.66C114.6 227.8 101 221.2 88.41 225.2C75.83 229.4 69.05 243 73.23 255.6l48 144C124.5 409.3 133.5 415.9 143.8 416c10.17 0 19.45-6.406 22.83-16L192 328.1L217.4 400C220.8 409.6 229.8 416 240 416c10.27-.0938 19.53-6.688 22.77-16.41l48-144c4.188-12.59-2.594-26.16-15.17-30.38c-12.61-4.125-26.2 2.594-30.36 15.19l-25.89 77.66L214.6 248z"></path></svg>`;
              } else if (vm.excelExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-excel" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM272.1 264.4L224 344l48.99 79.61C279.6 434.3 271.9 448 259.4 448h-26.43c-5.557 0-10.71-2.883-13.63-7.617L192 396l-27.31 44.38C161.8 445.1 156.6 448 151.1 448H124.6c-12.52 0-20.19-13.73-13.63-24.39L160 344L111 264.4C104.4 253.7 112.1 240 124.6 240h26.43c5.557 0 10.71 2.883 13.63 7.613L192 292l27.31-44.39C222.2 242.9 227.4 240 232.9 240h26.43C271.9 240 279.6 253.7 272.1 264.4zM256 0v128h128L256 0z"></path></svg>`;
              } else if (vm.powerPointExtensions.includes(fileExtension)) {
                  showFile = `<svg style="font-size: 9em; height: 1em;" aria-hidden="true" focusable="false" data-prefix="far" data-icon="file-powerpoint" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM200 224H128C119.2 224 112 231.2 112 240v168c0 13.25 10.75 24 24 24S160 421.3 160 408v-32h44c44.21 0 79.73-37.95 75.69-82.98C276.1 253.2 240 224 200 224zM204 328H160V272h44c15.44 0 28 12.56 28 28S219.4 328 204 328z"></path></svg>`;
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