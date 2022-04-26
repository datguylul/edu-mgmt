import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import { useRouter } from 'next/router';

const FileViewer = React.lazy(() => {
  return import('react-file-viewer');
});

interface fileProps {
  filePath: string;
  fileType: string;
}

const fileObject = [
  {
    FileUploadId: '15b04d13-5046-4435-ac8e-950b43b5069e',
    FileUploadUrl: 'https://res.cloudinary.com/dhi8xksch/raw/upload/v1650967192/q4n35ob1ryrpxgcpbq2i.docx',
    FileUploadName: 'Untitled document.docx',
  },
  {
    FileUploadId: 'eecc8ebc-a55e-44a4-aaff-c682b72cb746',
    FileUploadUrl: 'https://res.cloudinary.com/dhi8xksch/raw/upload/v1650967176/gjafe2gd2okyofjqjxnf.png',
    FileUploadName: 'Thang-tu-la-loi-noi-doi-cua-em.png',
  },
  {
    FileUploadId: '6f50e07e-078b-4f5d-8176-30854a098f00',
    FileUploadUrl: 'https://res.cloudinary.com/dhi8xksch/raw/upload/v1650967187/xjhhvpkttzp4asmi9ks6.pdf',
    FileUploadName: 'Conmuacuoi.pdf',
  },
];

const index = () => {
  const router = useRouter();
  const { id: fileId } = router.query;

  const [fileDetail, setFileDetail] = useState<fileProps | null>(null);

  useEffect(() => {
    console.log('fileId', fileId);

    handleFileDetail();
  }, []);

  const handleFileDetail = () => {
    const fileType = getFileExtension(fileObject[0].FileUploadName);

    setFileDetail({
      filePath: fileObject[0].FileUploadUrl,
      fileType: fileType,
    });
  };

  const getFileExtension = (fileName: string) => {
    return fileName?.split('.').pop() || '';
  };

  const CustomErrorComponent = () => {
    return (
      <div>
        <p>File open error</p>
      </div>
    );
  };

  return (
    <div>
      {fileDetail ? (
        <React.Suspense fallback={<div>Loading...</div>}>
          <FileViewer
            filePath={fileDetail?.filePath}
            fileType={fileDetail?.fileType}
            // errorComponent={CustomErrorComponent}
            onError={() => {}}
          />
        </React.Suspense>
      ) : (
        CustomErrorComponent()
      )}
    </div>
  );
};
export default index;
