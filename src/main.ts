import './style.css';
import './loader.css';
import imglyRemoveBackground, { Config } from '@imgly/background-removal';
import FileSaver from 'file-saver';

const uploadBtn = document.querySelector<HTMLButtonElement>('#upload-btn')!;
const uploadInput = document.querySelector<HTMLInputElement>('#upload-input')!;
const outputImg = document.querySelector<HTMLImageElement>('#output')!;
const progress = document.querySelector<HTMLImageElement>('#progress')!;
const loader = document.querySelector<HTMLDivElement>('.lds-roller')!;

const config: Config = {
  // publicPath: '/public', // path to the wasm files
  progress: (key: string, current: string, total: string) => {
    progress.innerText = `Loading ${key}: ${current} of ${total}`;
  },
};

uploadBtn.addEventListener('click', () => {
  uploadInput.click();
});

uploadInput?.addEventListener(
  'change',
  async () => {
    const selectedFile = document.querySelector<HTMLInputElement>('#upload-input')!.files![0];
    const fileName = selectedFile.name;
    const downloadBtn = document.querySelector<HTMLButtonElement>('#download')!;

    progress.hidden = false;
    uploadBtn.disabled = true;
    outputImg.hidden = true;
    loader.hidden = false;


    const blob = await imglyRemoveBackground(selectedFile, config);

    const url = URL.createObjectURL(blob);

    console.log('DONE');
    outputImg.src = url;
    loader.hidden = true
    outputImg.hidden = false;
    progress.hidden = true;
    downloadBtn.hidden = false;
    uploadBtn.disabled = false;

    /* Remove all listeners */
    const downloadBtnClone = downloadBtn.cloneNode(true);
    downloadBtn.parentNode?.replaceChild(downloadBtnClone, downloadBtn);

    document.querySelector<HTMLButtonElement>('#download')!.addEventListener(
      'click',
      () => {
        FileSaver.saveAs(blob, fileName);
      },
      { once: true }
    );
  },
  false
);
