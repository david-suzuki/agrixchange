import React, { useState } from "react";
import { Col, Input, Row, Label } from "reactstrap";

const ProduceGraphicalFilter = ({ usersProduce, onFilter }) => {
  let produceTemplates = [];
  for (let prod1 of usersProduce) {
    const same_produces = usersProduce.filter(
      (pd) =>
        pd.produce_sub_categoryISbb_agrix_produce_typesID ===
        prod1.produce_sub_categoryISbb_agrix_produce_typesID
    );
    const tags = same_produces.map((sp) =>
      Object.assign(
        {},
        {
          numeric_id: sp.numeric_id,
          tag_name: sp.produce_typeISbb_agrix_produce_typesID_data
            ? sp.produce_typeISbb_agrix_produce_typesID_data.name
            : "",
        }
      )
    );
    const item = {
      produce: {
        numeric_id: prod1.numeric_id,
        name: prod1.produce_sub_categoryISbb_agrix_produce_typesID_data
          ? prod1.produce_sub_categoryISbb_agrix_produce_typesID_data.name
          : "",
      },
      tags: tags,
    };

    const template = produceTemplates.find(
      (pt) => pt.produce.name === item.produce.name
    );
    if (!template) produceTemplates.push(item);
  }

  const [produce, setProduce] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const produceOptions = produceTemplates.map((pt) => (
    <option key={pt.produce.numeric_id} value={pt.produce.numeric_id}>
      {pt.produce.name}
    </option>
  ));

  const tagOptions = tags.map((tag) => (
    <option key={tag.numeric_id} value={tag.numeric_id}>
      {tag.tag_name}
    </option>
  ));

  const onProduceChanged = (e) => {
    const produce = e.target.value;
    setProduce(produce);
    const produceTemplate = produceTemplates.find(
      (pt) => pt.produce.numeric_id === produce
    );

    const produceTags = produceTemplate.tags;
    setTags(produceTags);

    onFilter(produce);
  };

  const onTagChanged = (e) => {
    const tag = e.target.value;
    setTag(tag);

    onFilter(tag);
  };

  return (
    <form className="needs-validation" style={{ background: "white" }}>
      <Row className="pt-3">
        <Col md="2 d-flex justify-content-end">
          <Label style={{ fontSize: 16, marginTop: 5 }}>Filter Produce:</Label>
        </Col>
        <Col md="3">
          <Input type="select" value={produce} onChange={onProduceChanged}>
            <option value="" hidden>
              -Select produce-
            </option>
            {produceOptions}
          </Input>
        </Col>
        <Col md="3">
          <Input type="select" value={tag} onChange={onTagChanged}>
            {tagOptions}
          </Input>
        </Col>
      </Row>
    </form>
  );
};

export default ProduceGraphicalFilter;
