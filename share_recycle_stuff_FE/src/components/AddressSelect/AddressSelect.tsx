import { Form, Select, Space } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '/src/styles/GlobalStyle.css';

interface Province {
  code: number;
  name: string;
}

interface Ward {
    code: number;
    name: string;
    province_code: number;
}
const AddressSelect = () => {
    const [cities, setCities] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<number | null>(null);


    useEffect(() => {
        const controller = new AbortController();

        const fetchCities = async () => {
        try {
            const res = await axios.get("/api-provinces/p/");
            setCities(res.data);
        } catch (err) {
            console.error("Lỗi khi load tỉnh/thành phố:", err);
        }
        };
        fetchCities();
        
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchWards = async () => {
        if (!selectedCity) {
            setWards([]);
            return;
        }
        try {
            const res = await axios.get(
            `/api-provinces/w/?province=${selectedCity}`
            );
            setWards(res.data);
        } catch (err) {
            console.error("Lỗi khi load xã/phường:", err);
        }
        };
        fetchWards();
        return () => controller.abort();
    }, [selectedCity]);

    return (
        <Space size={42}>
                <Form.Item
                name="city"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}
                >
                <Select
                    placeholder="Tỉnh/Thành phố"
                    style={{ width: 180 }}
                    onChange={(value) => {
                        const selected = cities.find(c => c.name === value);
                        setSelectedCity(selected?.code || null); 
                    }}
                    options={cities.map((c) => ({
                        label: c.name,
                        value: c.name,  
                    }))}
                />
                </Form.Item>

                <Form.Item
                name="ward"
                noStyle
                rules={[{ required: true, message: 'Vui lòng chọn Xã/Phường!' }]}
                >
                <Select
                    placeholder="Xã/Phường"
                    style={{ width: 180 }}
                    disabled={!selectedCity}
                    options={wards.map((w) => ({
                        label: w.name,
                        value: w.name,
                    }))}
                />
                </Form.Item>
            </Space>
    )
}

export default AddressSelect
