import { useEffect, useState } from "react"
import {Select} from 'antd'
import type { ReportItemProps } from "../../../types/schema"
import ReportList from "./ReportList"
import { getData } from "../../../api/api"
import styles from './ReportManagement.module.css'

const ReportManagement = () => {

  const [listReport, setListReport] = useState<ReportItemProps[]> ([]) 

  const getAll = async () => {
    try {
      const res = await getData<{
        code: number;
        message: string;
        result: {
          content: ReportItemProps[];
        };
      }> ('/api/admin/reports');
      setListReport (res.result.content);
    } catch (error) {
      
    }
  }

  useEffect(() => {
      getAll();
    },[])

    console.log(listReport)
  return (
    <div className= {styles.page}>
      <div>
      <div className= {styles.title}>
        <div style={{fontSize: 24}}>Danh sách yêu cầu</div>
        <Select
          options={[
            { value: "ALL", label: "Tất cả" },
            { value: "PENDING", label: "Đang chờ xử lý" },
            { value: "PROCESSING", label: "Đang xử lý" },
            { value: "RESOLVED", label: "Đã giải quyết" },
          ]}
          defaultValue="ALL"
          // onChange={onStatusChange}
          style={{ width: "150px" }}
        />

      </div>

      <div className='container'>
        <ReportList data={listReport} getAll = {getAll} />
      </div>
      </div>
    </div>
  )
}

export default ReportManagement
