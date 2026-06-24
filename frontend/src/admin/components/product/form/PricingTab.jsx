import { Card, Form, InputNumber, Row, Col, Radio, Button } from "antd";
import { useState, useEffect } from "react";

const fmt = {
    formatter: (v) => v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "",
    parser: (v) => v.replace(/,/g, ""),
};

export default function PricingTab() {
    const form = Form.useFormInstance();
    const price = Form.useWatch("price", form);
    const [discountType, setDiscountType] = useState(null);

    useEffect(() => {
        setDiscountType(form.getFieldValue("discount_type") || null);
    }, [form.getFieldValue("discount_type")]);

    function handleTypeChange(type) {
        setDiscountType(type);
        form.setFieldValue("discount_type", type);
        form.setFieldValue("sale_price", null);
    }

    function calcSalePrice() {
        if (!price) return;
        if (discountType === "percent") {
            const pct = form.getFieldValue("discount_percent");
            if (pct) form.setFieldValue("sale_price", Math.round(price * (1 - pct / 100)));
        } else if (discountType === "fixed") {
            const amt = form.getFieldValue("discount_amount");
            if (amt) form.setFieldValue("sale_price", Math.max(0, price - amt));
        }
    }

    function clearDiscount() {
        setDiscountType(null);
        form.setFieldsValue({
            discount_type: null,
            discount_percent: null,
            discount_amount: null,
            sale_price: null,
        });
    }

    return (
        <Card title="Pricing">
            <Form.Item label="Giá gốc" name="price">
                <InputNumber style={{ width: "100%" }} {...fmt} />
            </Form.Item>

            <Form.Item name="discount_type" hidden><input /></Form.Item>

            <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Giảm giá</label>
                <Radio.Group value={discountType} onChange={(e) => handleTypeChange(e.target.value)}>
                    <Radio.Button value="percent">Theo %</Radio.Button>
                    <Radio.Button value="fixed">Theo số tiền</Radio.Button>
                </Radio.Group>
                {discountType && (
                    <Button size="small" type="link" danger onClick={clearDiscount} style={{ marginLeft: 8 }}>
                        Xóa giảm giá
                    </Button>
                )}
            </div>

            {discountType === "percent" && (
                <Row gutter={12} align="bottom">
                    <Col span={8}>
                        <Form.Item label="Phần trăm giảm" name="discount_percent">
                            <InputNumber style={{ width: "100%" }} min={0} max={100} suffix="%" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label=" ">
                            <Button type="primary" block onClick={calcSalePrice} disabled={!price}>Tính</Button>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giá sale" name="sale_price">
                            <InputNumber style={{ width: "100%" }} {...fmt} disabled />
                        </Form.Item>
                    </Col>
                </Row>
            )}

            {discountType === "fixed" && (
                <Row gutter={12} align="bottom">
                    <Col span={8}>
                        <Form.Item label="Số tiền giảm" name="discount_amount">
                            <InputNumber style={{ width: "100%" }} {...fmt} min={0} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label=" ">
                            <Button type="primary" block onClick={calcSalePrice} disabled={!price}>Tính</Button>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Giá sale" name="sale_price">
                            <InputNumber style={{ width: "100%" }} {...fmt} disabled />
                        </Form.Item>
                    </Col>
                </Row>
            )}

            {!discountType && (
                <Form.Item label="Giá sale" name="sale_price">
                    <InputNumber style={{ width: "100%" }} {...fmt} disabled placeholder="Chọn kiểu giảm giá ở trên" />
                </Form.Item>
            )}
        </Card>
    );
}
