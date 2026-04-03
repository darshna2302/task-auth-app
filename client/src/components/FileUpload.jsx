import React,{useCallback, useContext} from 'react'
import { useState,useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import axios from "axios"
import { AppContent } from '../context/AppContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import DocPreview from './DocPreview'

function FileUpload() {
  
  const navigate=useNavigate();
    const [file,setFile]=useState(null)
    const [uploadedFiles,setUploadedFiles]=useState([])
    const {backendUrl}=useContext(AppContent);


    useEffect(()=>{
      fetchUserFiles();
    },[])

    const fetchUserFiles = async () => {
        try {
          const {data}= await axios.get(backendUrl+"/api/auth/uploaded-file",{
            // headers:{
            //   "Content-Type":"multipart/form-data"
            // },
            withCredientials:true
          });

          if(data.success)
          {
            setUploadedFiles(data.files);
          }
        } catch (error) {
          // console.error("Failed to fetch files",error);
          
        }
    }
    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles.length>0)
        {
          
            const uploadedFiles=acceptedFiles[0]
            if (uploadedFiles.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
          }
            const preview= URL.createObjectURL(uploadedFiles);
            uploadedFiles["preview"]=preview;
            setFile(uploadedFiles)
            // setFile({
            //     ...uploadedFiles,
            //     preview:URL.createObjectURL(uploadedFiles),
            // })
        }
        // console.log("Accepted files",acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,maxFiles:1});

  const uploadFile= async() =>{
 try {
     const formData = new FormData();
    formData.append("file",file);
    const {status,data} = await axios.post(backendUrl+"/api/auth/file-upload",formData,{
            headers: {
        "Content-Type":"multipart/form-data"
      },
      withCredentials:true
    }
    );

    if(data.success)
    {
      toast("Success!",{description:data.message});
      setFile(null);
      fetchUserFiles()
    }
    else
    {
      toast.error("Failed!",{description:data.message})
    }
 } catch (error) {
  toast.error("Error!",{description:error.response?.data?.message});
 }

    
  }
  return (
    <div className='min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 w-full flex gap-10 flex-col items-center justify-center'>
      <Navbar/>
        
         <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm flex items-center justify-center' {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>

    {file && (
  <div className="mt-4">
    {file.type.startsWith("image/") && (
      <img
        className="h-32 w-32 object-fill"
        src={file.preview}
        alt={file.name}
      />
    )}

    {file.type === "application/pdf" && (
      <iframe
        src={file.preview}
        title="PDF Preview"
        className="h-40 w-40"
      />
    )}

    {!file.type.startsWith("image/") &&
      file.type !== "application/pdf" && (
        <div className="text-white text-sm bg-gray-700 p-4 rounded">
          📄 {file.name}
        </div>
      )}
  </div>
)}
    <button onClick={uploadFile} className='bg-indigo-500 text-white px-6 py-2 rounded-lg'>
                Upload
    </button>

    {uploadedFiles.length > 0 && (
                <div className='w-full max-w-2xl'>
                    <h2 className=' text-lg font-semibold mb-4'>Your Uploaded Files</h2>
                    <div className='grid grid-cols-3 gap-4'>
                       {uploadedFiles.map((f) => (
  <div key={f.id} className='flex flex-col items-center gap-1'>
    
    {f.mimetype?.startsWith("image/") ? (
      <img className='h-24 w-24 object-cover rounded-lg shadow'
        src={backendUrl + "/" + f.path}
        alt={f.name}
      />
    ) : f.mimetype === "application/pdf" ? (
      <iframe
        src={backendUrl + "/" + f.path}
        className="h-24 w-24"
        title="PDF"
      />
    ) : f.mimetype ===
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
  <DocPreview fileUrl={`${backendUrl}/${f.path}`} />
) : (
  <div className="h-24 w-24 flex items-center justify-center bg-gray-700 text-white text-xs rounded shadow">
    📄 {f.name}
  </div>
)}

    <p className='text-white text-xs truncate w-24 text-center'>
      {f.name}
    </p>
  </div>
))}
                        </div>
                        </div>
    )}
    </div>
  )
}

export default FileUpload