import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFormClient } from "../../../../services/constants";
import { post } from "../../../../services/axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const SelectCategory = ({ produceData, type }) => {
  const router = useRouter();

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const getSubCategories = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");
      formData.append("get_linked_data", "1");
      formData.append(
        "refers_toISbb_agrix_produce_typesID",
        produceData.numeric_id
      );

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setSubCategories(response.data.list);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getSubCategories();
  }, [produceData]);

  const subCategoryOptions = subCategories.map((subCategory) => (
    <option key={subCategory.numeric_id} value={subCategory.numeric_id}>
      {subCategory.name}
    </option>
  ));

  const onSubCategoryChanged = (e) => {
    const subCategoryId = e.target.value;
    if (type === "report") router.push(`/report-sub/${subCategoryId}`);
    else if (type === "produce") router.push(`/produce-sub/${subCategoryId}`);
  };

  return (
    <div
      className={`${
        type === "produce"
          ? "produce-select-category"
          : "report-select-category"
      }`}
    >
      <select
        className="form-control"
        name="userType"
        onChange={onSubCategoryChanged}
      >
        <option value="" hidden>
          &#xf039;&nbsp;&nbsp;{produceData.name}
        </option>
        {subCategoryOptions}
      </select>
    </div>
  );
};

export default SelectCategory;
