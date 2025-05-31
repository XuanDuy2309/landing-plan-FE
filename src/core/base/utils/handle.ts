import { AuthApi } from "src/core/api";
import { SelectFileCase } from "src/core/services";

export const enum Type_Upload {
    Folder = "folder",
    File = "file",
    Image = "image",
    Video = "video",
    Doc = "doc",
    Exam = "exam",
    Pdf = "pdf",
    Audio = "audio",
}

const onUpload = async (files: File[], type: Type_Upload): Promise<string[]> => {
    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
        form.append('files', files[i], files[i].name);
    }
    form.append('type', type);

    const res = await AuthApi.upload(form);
    if (res.Status) {
        return res.Data.data; // string[]
    }
    return [];
};


export const handleUpload = async (type: Type_Upload): Promise<string[]> => {
    const input = new SelectFileCase(type, true);
    try {
        const files = await input.process();
        if (files.length > 0) {
            const result = await onUpload(files, type);
            return result;
        }
        return [];
    } catch (error) {
        console.error("Upload error:", error);
        return [];
    }
}

