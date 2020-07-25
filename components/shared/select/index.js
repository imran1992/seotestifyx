import React from "react";
import { Select } from 'antd';

const { Option } = Select;

export default ({ options, defaultValue, handleChange }) => {

    const children = options.map((option, i) => {
        // @ts-ignore
        return <Option key={i}>{option}</Option>
    });

    return (
        <div className="custom-select-list">
            <Select
                size={"large"}
                defaultValue={defaultValue}
                onChange={handleChange}
                style={{
                    width: '100%',
                    height: 40,
                    // fontWeight: 500,
                    fontSize: 16,
                    lineHeight: 18,
                    borderRadius: "15px"
                }}
            >
                {children}
            </Select>
        </div>
    )
}