import React from "react";
import { Input } from 'antd';


export default ({ placeholder, handleChange }) => {

    return (
        <div className="custom-input">
            <Input placeholder={placeholder} onChange={handleChange} />
        </div>
    )
}