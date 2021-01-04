import React from "react";
import { Modal, Form, Select } from "antd";
import {
  onCancel,
  onOk,
  initialValues,
} from "../../Functional/NewRequest/NewRequestForm";

export default function NewRequestModal(props) {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={props.show}
      title="New Planning Request"
      okText="Create"
      cancelText="Cancel"
      onCancel={() => onCancel(props.setShow)}
      onOk={() => onOk(form, props.setShow)}
    >
      <Form
        form={form}
        layout="vertical"
        name="submit_new_request"
        initialValues={initialValues}
      >
        <Form.Item
          name="item1"
          label="item 1"
          rules={[
            { required: true, message: "Please enter the item 1 value." },
          ]}
        >
          <Select
            showSearch
            value={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
