import fileSaver from 'file-saver';

export const saveFile = (fileUrl: string, fileName: string) => {
  fileSaver.saveAs(fileUrl, fileName);
};
