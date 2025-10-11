import {Select} from 'antd'
import UpgradeItem from './UpgradeItem';
import { getData } from '../../../api/api';
import type { ErrorResponse } from '../../../api/api'; 
import type { RequestUpgradeDataProps } from '../../../types/schema';
import { useMessage } from '../../../context/MessageProvider';
import { useEffect, useState } from 'react';
import styles from './UpgradeManagement.module.css'

const RequestUpgradeManagement = () => {
  const {showMessage} = useMessage();
  const [requestList, setRequestList] = useState<RequestUpgradeDataProps[]>([])

  const onStatusChange = (value?: string) => {
    if (!value || value === "ALL") {
      getAll();
    }else {
      getByStatus(value);
    }
  }

  //call Api get All
  const getAll = async () => {
    try {
      const res = await getData<{
      code: number;
      message: string;
      result: {
        content: RequestUpgradeDataProps[];
      };
    }>("/api/admin/request_proxy");

      setRequestList(res.result.content);
    } catch (error: any) {
      const ErrorData : ErrorResponse = error
      showMessage({type: "error", message: ErrorData.message, code: ErrorData.status})
    }
  }

  const getByStatus = async (status: string) => {
    try {
      const res = await getData<{
      code: number;
      message: string;
      result: {
        content: RequestUpgradeDataProps[];
      };
    }> ("/api/admin/request_proxy", {status});
      setRequestList(res.result.content)
    }catch (error: any) {
      const ErrorData : ErrorResponse = error
      showMessage({type: "error", message: ErrorData.message, code: ErrorData.status})
    }
  }

  useEffect(() => {
    getAll();
  },[])

  return (
    <div className= {styles.page}>
      <div>
      <div className= {styles.title}>
        <div style={{fontSize: 24}}>Danh sách yêu cầu</div>
        <Select
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "PENDING", label: "Đang chờ" },
            { value: "APPROVED", label: "Đã chấp nhận" },
            { value: "REJECTED", label: "Đã từ chối" },
          ]}
          defaultValue="ALL"
          onChange={onStatusChange}
          style={{ width: "150px" }}
        />

      </div>

      <div className='container'>
        <UpgradeItem data={requestList} getAll = {getAll} />
      </div>
      </div>
    </div>
  )
}

export default RequestUpgradeManagement
