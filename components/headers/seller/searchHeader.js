import React, { Fragment, useState } from "react";
import { Search } from "react-feather";
import { Form, FormGroup, Input } from "reactstrap";

const SearchHeader = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const onKeyPressed = (e) => {
    if (e.key === "Enter") {
      if (searchText) onSearch(searchText);
    }
  };

  return (
    <Fragment>
      <div className="form-inline search-form">
        <FormGroup className="custom-search-field">
          <Input
            className="form-control-plaintext open"
            type="search"
            placeholder="Search.."
            value={searchText}
            onKeyUp={onKeyPressed}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="d-sm-none mobile-search">
            <Search />
          </div>
        </FormGroup>
      </div>
    </Fragment>
  );
};

export default SearchHeader;
