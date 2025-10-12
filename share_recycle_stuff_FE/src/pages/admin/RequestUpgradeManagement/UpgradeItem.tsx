import { Table, Modal, Button, Input, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import type { RequestUpgradeDataProps } from '../../../types/schema';
import { postData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api';
import { useMessage } from '../../../context/MessageProvider';

interface UpgradeItemProps {
  data: RequestUpgradeDataProps[];
  getAll : () => Promise<void>;
}

const UpgradeItem = ({ data, getAll }: UpgradeItemProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<RequestUpgradeDataProps | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const {showMessage} = useMessage();
    
    const showModal = (record: RequestUpgradeDataProps) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const columns: TableProps<RequestUpgradeDataProps>['columns'] = [
    {
        title: 'Id',
        dataIndex: 'requestId',
        key: 'requestId',
    },
    {
        title: 'Họ và tên',
        dataIndex: 'fullName',
        key: 'fullName',
    },
    {
        title: 'Số CCCD',
        dataIndex: 'idCard',
        key: 'idCard',
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
        key: 'createdAt',
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
            case 'APPROVED':
                color = '#048C73';
                break;
            case 'REJECTED':
                color = '#F76C6F';
                break;
            default:
            color = '#999999';
        }
           return <Tag 
                color={color}
                style={{
                    width: 80,   
                    height: 24,
                    textAlign: "center",
                    borderRadius: 6,     
                }}
                >
                    {status === 'PENDING' ? 'Đang chờ' :
                    status === 'APPROVED' ? 'Đã duyệt' :
                    status === 'REJECTED' ? 'Từ chối' : status}
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


    const handleOk = async (id?: number) => {
        if (!id) return;
        try {     
            const res = await postData(`/api/admin/request_proxy/${id}/approve`,{})
            showMessage({type: "success", message: "Đã chấp nhận yêu cầu"})
            getAll();
        } catch (error: any) {
            const errData : ErrorResponse = error;
            showMessage({type: "error", message: errData.message, code: errData.status})
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleReject = async (id?: number, reason?: string) => {
        if(!id) return;
        try {
            const res = await postData(`/api/admin/request_proxy/${id}/reject?reason=${encodeURIComponent(reason || "")}`, {})
            showMessage({type: "success", message: "Đã từ chối yêu cầu"})
            getAll();
            setIsModalOpen(false);
        } catch (error : any) {
            const errData : ErrorResponse = error;
            showMessage({type: "error", message: errData.message, code: errData.status})
        }
    };

  return (
    <>
        <Table<RequestUpgradeDataProps>
        columns={columns}
        dataSource={data}
        rowKey="requestId"
        pagination = {{position :['bottomCenter']}}
        />
        <Modal
            title="Chi tiết yêu cầu"
            open={isModalOpen}
            onOk={() => handleOk(selectedRecord?.requestId)}
            onCancel={handleCancel}
            footer={null} 
        >
            {selectedRecord && (
                <div className="space-y-3">
                    <div>
                    <strong>Họ và tên:</strong> {selectedRecord.fullName}
                    </div>
                    <div>
                    <strong>Email:</strong> {selectedRecord.email}
                    </div>
                    <div>
                    <strong>Địa chỉ chi tiết:</strong> {selectedRecord.addressDetail}
                    </div>
                    <div>
                    <strong>Số cccd:</strong> {selectedRecord.idCard}
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    {selectedRecord.cardFront && (
                        <img
                        src={selectedRecord.cardFront}
                        alt="CCCD mặt trước"
                        style={{ width: 150, borderRadius: 8 }}
                        />
                    )}
                    {selectedRecord.cardBack && (
                        <img
                        src={selectedRecord.cardBack}
                        alt="CCCD mặt sau"
                        style={{ width: 150, borderRadius: 8 }}
                        />
                    )}
                    </div>

                    {selectedRecord.status === 'PENDING' &&
                    
                        <div>

                            <div style={{ marginTop: 16 }}>
                                
                                <strong>Lý do từ chối:</strong>
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Nhập lý do từ chối (nếu có)"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, gap: 10 }}>
                                <Button onClick={() => handleReject (selectedRecord.requestId, rejectReason)} danger>
                                    Từ chối
                                </Button>
                                <Button type="primary" onClick={() => handleOk(selectedRecord.requestId)}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>

                    }

                </div>
            )}
            
        </Modal>
    </>
  );
};

export default UpgradeItem;
