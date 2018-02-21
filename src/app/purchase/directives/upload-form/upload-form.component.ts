import { Component, OnInit, ChangeDetectorRef, Inject, Input, Output} from '@angular/core';
import { AlertService} from './../../../alert.service';
import { UploadingService } from './../../../uploading.service';
import * as moment from 'moment';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {

    filesToUpload: Array<File> = [];
    openfiles: boolean = false;
    openApprove: boolean = false;
    isUploading: boolean = false;
    filePath: string;
    fieldName: any;
    files: Array<any> = [];
    loadingFiles: boolean = false;

    @Input('documentPrefix') documentPrefix: string;
    @Input('documentReferentID') documentReferentID: string;

  constructor(
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private uploadingService: UploadingService,
    @Inject('DOC_URL') private docUrl: string,
  ) { }

  ngOnInit() {
  }

  fileChangeEvent(fileInput: any) {
        this.filesToUpload = [];
        this.filesToUpload = <Array<File>>fileInput.target.files;
  }

    upload() {
       this.loadingFiles = true;
        const documentCode = `${this.documentPrefix}-${this.documentReferentID}`;
        this.uploadingService.makeFileRequest(documentCode, this.filesToUpload)
            .then((result: any) => {
                if (result.ok) {
                    this.filesToUpload = [];
                    this.alertService.success();
                     this.ref.detectChanges();
                    this.getFilesList();
                } else {
                    this.alertService.error(JSON.stringify(result.error));
                }
            }, (error) => {
                this.alertService.error(JSON.stringify(error));
            });
    }


    openFilesModal(purchasing_id) {
        const documentCode = `${this.documentPrefix}-${this.documentReferentID}`;
        this.openfiles = true;
        this.loadingFiles = true;
        this.uploadingService.getFiles(documentCode)
            .then((result: any) => {
                if (result.ok) {
                    this.files = result.rows;
                     this.ref.detectChanges();
                } else {
                    this.alertService.error(JSON.stringify(result.error));
                }
                this.loadingFiles = false;
            })
            .catch(() => {
                this.loadingFiles = false;
                this.alertService.serverError();
            });
    }

    getFilesList(refID: string = null) {
        this.files = [];
        this.loadingFiles = true;
        const file = `${this.documentPrefix}-${refID ? refID : this.documentReferentID}`;
        try {
            this.uploadingService.getFiles(file)
                .then((result: any) => {
                    if (result.ok) {
                        this.files = result.rows;
                         this.ref.detectChanges();
                    } else {
                        this.alertService.error(JSON.stringify(result.error));
                    }
                    this.loadingFiles = false;
                })
                .catch(() => {
                    this.loadingFiles = false;
                    this.alertService.serverError();
                });
        } catch (error) {
            this.alertService.error();
        }

    }

    getFile(documentId) {
        const url = `${this.docUrl}/uploads/files/${documentId}`;
        window.open(url, '_blank');
    }

    removeFile(documentId, idx) {
        this.alertService.confirm('คุณต้องการลบไฟล์นี้ ใช่หรือไม่?')
            .then(() => {
                this.uploadingService.removeFile(documentId)
                    .then((result: any) => {
                        if (result.ok) {
                            this.files.splice(idx, 1);
                            // this.getApproveList();
                             this.ref.detectChanges();
                        } else {
                            this.alertService.error(JSON.stringify(result.error));
                        }
                    })
                    .catch(() => {
                        this.alertService.serverError();
                    });
            })
            .catch(() => {
                // cancel
            });
    }

}
