export class SelectFileCase {
    constructor(private type: string, private multiple: boolean = true, private accept?: string) {

    }

    async process(): Promise<File[]> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            if (this.type === 'folder') {
                input.webkitdirectory = true;
            }
            if (this.type === 'file') {
                input.multiple = this.multiple;
            }
            if (this.type === "image") {
                input.accept = "image/jpeg, image/png";
            }
            if (this.type === "video") {
                input.accept = "video/mp4,video/x-m4v,video/*";
            }
            if (this.type === 'doc') {
                input.accept = "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf";
            }
            if (this.type === 'exam')
                input.accept = "application/pdf";
            if (this.type === "pdf") {
                input.accept = "application/pdf";
            }
            if (this.type === "audio") {
                input.accept = 'audio/mpeg, audio/ogg, audio/wav', "audio/x-m4a";
            }
            if (this.accept) {
                input.accept = this.accept
            }
            if (this.multiple) {
                input.multiple = this.multiple;
            }
            input.onchange = (e: any) => {
                if (this.type === 'xapi' || this.type === 'scorm') {
                    const listType = Object.assign([], e.target.files).filter(x => x.type !== 'application/zip')
                    if (listType.length > 0) {
                        resolve([])
                        return;
                    }
                }
                resolve(e.target.files);
            }
            input.click();
        })
    }
}
