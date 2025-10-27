import { useEffect, useState } from "react"
import { Button, Input, Upload } from "antd";
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import axios from "axios";
import { useMessage } from "../../context/MessageProvider";
import styles from './ReportModal.module.css'
import { postData } from "../../api/api";
import type { ErrorResponse } from "../../api/api";

const reasons = [
    {id: 1, content: 'Spam'},
    {id: 2, content: 'Nội dung không phù hợp'},
    {id: 3, content: 'Lừa đảo/gian lận'},
    {id: 4, content: 'Nội dung người lớn'},
    {id: 5, content: 'Nội dung mang tính thù ghét'},
    {id: 6, content: 'Mặt hàng cấm/hạn chế'}
]

interface ReportModalProps {
    reportOK : () => void,
    cancelReport: () => void,
    postID?: number,
    reportTypeCode : number,
    reportedAccountId? : number,
}

const ReportModal = ({reportOK, cancelReport, postID, reportTypeCode, reportedAccountId } : ReportModalProps ) => {



    const {showMessage} = useMessage();
    const [loading, setLoading] = useState(false);

    const [isReasonChoose, setReasonChoose] = useState (false);
    const [violationType, setViolationType] = useState (null);
    const [reason, setReason] = useState ('');

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET_POST = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_REPORT;

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadToCloudinary = async (file : File) : Promise<string> => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET_POST);

        try {
        const res = await axios.post(url, formData, 
            {
            headers: {'Content-Type': 'multipart/form-data'}
            }
        )

        if(res.data.secure_url) return res.data.secure_url;
        throw new Error('Upload thất bại');
        } catch (error: any) {
        showMessage({type:"error", message:"Up load thất bại"})
        throw error;
        }
    }


  //Hủy modal 
    const cancelModal = () => {
        setReasonChoose (false);
        cancelReport();
    }

    //Quay lại chỗ phần lí do 
    const comeBack = () => {
        setReasonChoose (false);
    }

    // Này để chọn lỗi vi phạm
    const handleReport = async (content : any) => {
        setViolationType (content);
        setReasonChoose(true);
        console.log(violationType);
    }

    const handleSubmit = async () => {

        setLoading(true);

        let url  = null;

        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            if (file.originFileObj) {
                url = await uploadToCloudinary(file.originFileObj as File);
            }
        }

        const payload = {

                reportTypeCode: reportTypeCode,
                reportedPostId: postID,
                reportedAccountId: reportedAccountId,
                violationType: violationType,
                content: reason,
                evidenceUrl: url
            
        }

        console.log(violationType);

        console.log(payload)

        try {
            const res = await postData <{message: string}> ('/api/reports', payload);
            showMessage ({type : "success", message: res.message })
        } catch (error : any) {
            const errData : ErrorResponse = error;
            showMessage({type: "error" , message : errData.message, code: errData.status});
        } finally {
            setLoading (false);       
            reportOK();
        }

    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

  return (
    <div>
        {!isReasonChoose && 
        
            <div>
                
                {reasons.map((reason) => (
                    <div className= {styles.reason}
                        onClick={() => handleReport (reason.content)}
                    >
                        <p key={reason.id} > 
                            {reason.content}
                        </p>

                        <RightOutlined />
                    </div>
                    
                ))}

                
            </div>
        }

        {isReasonChoose &&
            <div>
                <div>
                    <p>Nội dung báo cáo</p>
                    <Input.TextArea
                        placeholder="Hãy mô tả điều bạn muốn phản ánh"
                        rows={5}
                        onChange={(e) => setReason (e.target.value)}
                        className= {styles.mgb16}
                    >
                    </Input.TextArea>

                </div>
                <div>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        multiple
                        className= {styles.mgb16}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </div>
                <div className= {styles.btns}>
                    <Button onClick={comeBack} className= {styles.mgr16} >Quay lại</Button>
                    
                    <Button onClick={cancelModal} className= {styles.mgr16} >Hủy</Button>

                    <Button 
                        onClick={handleSubmit}
                        loading= {loading} 
                    >Gửi báo cáo</Button>
                </div>
            </div>
            
        }
    </div>
  )
}

export default ReportModal
