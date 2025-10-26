import { Table, Modal, Button, Input, Tag, Image  } from 'antd';
import type { TableProps } from 'antd';
import type { ReportItemProps } from "../../../types/schema";
import { formatDate } from "../../../utils/formatters";
import { useState } from 'react';
import { useMessage } from '../../../context/MessageProvider';
import styles from './ReportManagement.module.css' 
import clsx from 'clsx';
import { deleteData, postData, putData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';

interface ReportListProps {
    data: ReportItemProps[];
    getAll : () => Promise<void>;
}

const ReportList = ({data, getAll} : ReportListProps) => {

    const {showMessage} = useMessage ();

    const [isModalOpen, setIsModalOpen] = useState (false);
    const [selectedRecord, setSelectedRecord] = useState<ReportItemProps | null> (null);

    const [adminResponse, setAdminResponse] = useState ('');
    const [isLoading, setIsLoading] = useState (false);

    const [actionType, setActionType] = useState ('NO_ACTION');

    const showModal = (record : ReportItemProps) => {
        setSelectedRecord (record);
        setIsModalOpen (true);
    }

    const handleOK = () => {}

    const handleCancel = () => {
        setIsModalOpen (false);
    }

    const onProccessing = async (reportId : number) => {
        const payload = {
            reportId: reportId,
            statusCode: 2,
            adminResponse: "Đang xử lý",
            actionType: "NO_ACTION"
        }

        setIsLoading(true);

        try {
            const res = await putData('/api/admin/reports/process',payload);

            setSelectedRecord((prev) =>
                prev ? { ...prev, status: "PROCESSING" } : prev
            );

            await getAll();
        } catch (error : any) {
            const ErrorData : ErrorResponse = error;
            showMessage({type:"error", message:ErrorData.message, code: ErrorData.status})
        } finally {
            setIsLoading (false);
        }
    }

    const handleDeletePost = () => {
            setActionType('DELETE_POST');
            showMessage({type: "success" , message: "bài đăng đã bị xóa"})

    }

    const handleLockAcc = () => {
        
        setActionType('LOCK_ACCOUNT');
        showMessage({type: "success", message: "Tài khoản này đã bị khóa"})
       
    }

    const onResponse = async (reportId : number) => {
        if (adminResponse === '') {
            showMessage({type: "error", message :"Phản hồi bị bỏ trống, không thể gửi!"});
            return;
        }
        const payload = {
            reportId: reportId,
            statusCode: 3,
            adminResponse: adminResponse,
            actionType: actionType
        }

        setIsLoading(true);

        try {
            const res = await putData('/api/admin/reports/process',payload);

            setSelectedRecord((prev) =>
                prev ? { ...prev, status: "RESOLVED", adminResponse: adminResponse } : prev
            );

            showMessage({type:"success" , message: 'Phản hồi thành công'})

            await getAll();
        } catch (error : any) {
            const ErrorData : ErrorResponse = error;
            showMessage({type:"error", message:ErrorData.message, code: ErrorData.status})
        } finally {
            setIsLoading (false);
        }
    }
    
    const columns: TableProps<ReportItemProps>['columns'] = [
    {
        title: 'STT',
        key: 'index',
        render: (_text, _record, index) => index +1, 
    },
    {
        title: 'Người báo cáo',
        dataIndex: ['reporter', 'fullName'], //ở đây nó sẽ hiểu ra là reporter.fullName
        key: 'reporterName',
    },
    {
        title: 'Loại báo cáo',
        dataIndex: 'reportType',
        key: 'reportType',
        render: (report_type : any) => (
            <Tag
                style={{
                    width: 80,   
                    height: 24,
                    textAlign: "center",
                    borderRadius: 6,     
                }}
            >
                {report_type === 'POST_VIOLATION'? 'Bài đăng':
                 report_type === 'USER_VIOLATION'? 'Người dùng' : report_type
                }
            </Tag>
        )
    },
    {
        title: 'Ngày báo cáo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: number []) => formatDate(text),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
        let color = '';
        switch (status) {
            case 'PENDING':
                color = '#F3C200';
                break;
            case 'PROCESSING':
                color = '#F76C6F';
                break;
            case 'RESOLVED':
                color = '#048C73';
                break;
            default:
            color = '#999999';
        }
           return <Tag 
                color={color}
                style={{
                    width: 100,   
                    height: 24,
                    textAlign: "center",
                    borderRadius: 6,     
                }}
                >
                    {status === 'PENDING' ? 'Đang chờ xử lý' :
                    status === 'PROCESSING' ? 'Đang xử lý' :
                    status === 'RESOLVED' ? 'Đã giải quyết' : status}
                </Tag>

        },
    },
    {
        title: 'Thông tin chi tiết',
        key: 'action',
        render: (_, record) => (
            <Button type="link" onClick={() => showModal(record)}>
                Xem chi tiết
            </Button>
        ),
        },
    ];

  return (
    <div>
        <Table<ReportItemProps>
        columns={columns}
        dataSource={data}
        rowKey="requestId"
        pagination = {{position :['bottomCenter']}}
        />
        <Modal
            title="Chi tiết yêu cầu"
            open={isModalOpen}
            onOk={handleOK}
            onCancel={handleCancel}
            footer={null} 
            width='80vw'
        >
            {selectedRecord && (
                <div className="space-y-3" style={{marginTop: '32px'}}>
                    <div className= {styles.ctn_1}>
                        <div>
                            <strong className = {styles.sub_title}>Người báo cáo</strong>
                            <div>
                                <p>
                                    <strong>Họ và tên: </strong>
                                    {selectedRecord.reporter.fullName}
                                </p>
                                <p>
                                    <strong>Email: </strong>
                                    {selectedRecord.reporter.email}
                                </p>
                                <p>
                                    <strong>Số điện thoại: </strong>
                                    {selectedRecord.reporter.phoneNumber}
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <strong className = {styles.sub_title} >Báo cáo: </strong>
                            <p>
                                <strong>Loại báo cáo: </strong>
                                {selectedRecord.reportType === 'POST_VIOLATION' ?
                                'Bài đăng' : 'Người dùng'
                                }
                            </p>
                            <p>
                                <strong>Thông tin vi phạm: </strong>
                                {selectedRecord.violationType}
                            </p>
                            <p>
                                <strong>Nội dung báo cáo: </strong>
                                {selectedRecord.content}
                            </p>
                        </div>

                        <div>
                            <div className= {clsx(styles.mgb_16, styles.sub_title)}><strong>Bằng chứng </strong></div>
                            <div>                                
                                <Image.PreviewGroup>
                                    <Image 
                                        width={150}
                                        src= {selectedRecord.evidenceUrl}
                                        alt='minh chứng'
                                        style={{ borderRadius: 8 }}
                                    />
                                </Image.PreviewGroup>
                            </div>
                        </div>
                    </div>

                    {/*Thông tin đối tượng vi phạm post || user*/ }
                    <div>
                        <strong className = {styles.sub_title} >Thông tin vi phạm</strong>
                        {
                            selectedRecord.reportType === 'POST_VIOLATION' ?
                            <div>
                                <p>
                                    <strong>Người đăng bài: </strong>
                                    {selectedRecord.reportedPost.authorName}
                                </p>
                                <p>
                                    <strong>Tiêu đề bài viết: </strong>
                                    {selectedRecord.reportedPost.title}
                                </p>
                                <p>
                                    <strong>Nội dung bài viết: </strong>
                                    {selectedRecord.reportedPost.content}
                                </p>
                                <p>
                                    <strong>Trạng thái bài viết: </strong>
                                    {selectedRecord.reportedPost.status}
                                </p>
                                <p>
                                    <strong>Đăng ngày: </strong>
                                    {formatDate(selectedRecord.reportedPost.createdAt)}
                                </p>
                            </div>:
                            <div>
                                <p>
                                    <strong>Tên người dùng: </strong>
                                    {selectedRecord.reportedAccount.fullName}
                                </p>
                                <p>
                                    <strong>Email: </strong>
                                    {selectedRecord.reportedAccount.email}
                                </p>
                                <p>
                                    <strong>Số điện thoại: </strong>
                                    {selectedRecord.reportedAccount.phoneNumber}
                                </p>
                                <p>
                                    <strong>Trạng thái tài khoản: </strong>
                                    {selectedRecord.reportedAccount.isLocked === false ? 'Hoạt động' : 'Bị khóa'}
                                </p>
                            </div>
                        }
                    </div>

                    {selectedRecord.status === 'PROCESSING' &&
                    
                        <div>

                            <div style={{ marginTop: 16 }}>
                                <div className= {clsx(styles.mgb_16, styles.sub_title)}>
                                    <strong >Phản hồi:</strong>
                                </div>
                                
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Nhập phản hồi về báo cáo"
                                    value={adminResponse}
                                    onChange={(e) => setAdminResponse(e.target.value)}
                                />
                            </div>

                        </div>

                    }

                    {selectedRecord.status === 'RESOLVED' &&
                        <div>

                            <div style={{ marginTop: 16 }}>
                                <div className= {clsx(styles.mgb_16, styles.sub_title)}>
                                    <strong >Phản hồi:</strong>
                                </div>
                                <p>{selectedRecord.adminResponse}</p>
                            </div>

                        </div>
                    }

                    <div>
  
                        {selectedRecord.status === 'PROCESSING' && (
                            <>
                            <p>Chọn hành động để giải quyết vi phạm (*Nếu không có thì bỏ qua)</p>
                                {selectedRecord.reportType === 'POST_VIOLATION' ? (
                                    <Button className= {styles.btn_handle}
                                        onClick={handleDeletePost}
                                    >
                                        Xóa bài viết
                                    </Button>
                                    ) : (
                                    <Button className= {styles.btn_handle}
                                        onClick={handleLockAcc}
                                    >
                                        Khóa tài khoản
                                    </Button>
                                )}
                            </>
                        )}

                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 10 }}>
                        {selectedRecord.status === 'PENDING' && 
                            <Button className= {styles.btn_processing}
                                onClick={() => onProccessing(selectedRecord.id)}
                                loading= {isLoading}
                            >Đang xử lý</Button> 
                        }
                        <Button onClick={handleCancel} >
                            Đóng
                        </Button>

                        {selectedRecord.status === 'PROCESSING' &&
                            <Button className= {styles.btn_processing}
                                onClick={() => onResponse(selectedRecord.id)}
                                loading= {isLoading}
                            >Gửi phản hồi</Button> 
                        } 
                    </div>

                </div>
            )}
            
        </Modal>
    </div>
  )
}

export default ReportList
