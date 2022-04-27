import React, { useState, useRef, useEffect } from 'react';
import Layout from 'Layouts';
import { useRouter } from 'next/router';
import { FileDetail } from '@core/services/api';

const FileViewer = React.lazy(() => {
  return import('react-file-viewer');
});

interface fileProps {
  filePath: string;
  fileType: string;
}

const index = () => {
  const router = useRouter();
  const { id: fileId } = router.query;

  const [fileDetail, setFileDetail] = useState<fileProps | null>(null);

  useEffect(() => {
    handleFileDetail();
  }, []);

  const handleFileDetail = () => {
    // const fileType = getFileExtension(fileObject[0].FileUploadName);

    FileDetail(fileId as string)
      .then((res) => {
        console.log(res.data);
        const file = res.data?.Data;
        if (file) {
          setFileDetail({
            filePath: file.FileUploadUrl,
            fileType: getFileExtension(file.FileUploadName),
          });
        } else {
          setFileDetail(null);
        }
      })
      .catch((error) => {
        console.log(error);
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
