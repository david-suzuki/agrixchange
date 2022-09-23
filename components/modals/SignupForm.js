import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Modal, ModalHeader, ModalBody, Input, Label, Alert } from "reactstrap";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import { getFormClient, server_domain } from "../../services/constants";
import { post } from "../../services/axios";
import { AuthContext } from "../../helpers/auth/AuthContext";
import router from "next/router";

const SignupForm = (props) => {
  const { isShow, onClose, userTypeId, membershipTypeId } = props;
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const onAuth = authContext.onAuth;
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered;

  const settingContext = useContext(SettingContext);
  const types = settingContext.appData.users_types;
  const userTypes = types.filter((type) => type.name !== "Admin");
  const membershipTypes = settingContext.appData.membership_types;

  const userTypeOptions = userTypes.map((type) => (
    <option key={type._id} value={type._id}>
      {type.name}
    </option>
  ));

  const membershipOptions = membershipTypes.map((type) => (
    <option key={type._id} value={type._id}>
      {type.name}
    </option>
  ));
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isErr, setIsErr] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    membershipType: "",
  });

  const onFormChanged = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSignupClicked = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setIsErr(true);
      setErrMsg("None-empty field is required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setIsErr(true);
      setErrMsg("Password is not matched.");
      return;
    }

    let formData = getFormClient();
    formData.append("api_method", "register");
    formData.append("first_name", form.firstName);
    formData.append("last_name", form.lastName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("typeISbb_agrix_users_typesID", form.userType);
    formData.append(
      "membershipISbb_agrix_membership_typesID",
      form.membershipType
    );

    try {
      setLoading(true);
      const response = await post(server_domain, formData);
      if (response.data.message === "SUCCESS") {
        // closing modal
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          userType: "",
          membershipType: "",
        });
        onClose(!isShow);
        onAuthModalsTriggered(
          "login",
          "Thanks for signing up! Login below to start."
        );
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    setForm({
      ...form,
      userType: userTypeId,
      membershipType: membershipTypeId,
    });
  }, [userTypeId, membershipTypeId]);

  const onTermsClicked = () => {
    router.push("/terms");
    onClose(!isShow);
  };

  return (
    <Modal
      isOpen={isShow}
      toggle={() => onClose(!isShow)}
      className="modal-md mt-3"
      centered
    >
      <ModalHeader className="signFormHeader border-0 thick-green d-flex justify-content-center">
        Sign up
      </ModalHeader>
      <ModalBody className="py-3 px-4">
        <form>
          {isErr && (
            <div className="mb-3">
              <Alert color="danger" toggle={() => setIsErr(false)}>
                {errMsg}
              </Alert>
            </div>
          )}
          <div className="input-group mb-3 mt-2">
            <input
              type="text"
              className="form-control"
              name="firstName"
              placeholder="First Name*"
              value={form.firstName}
              onChange={onFormChanged}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              name="lastName"
              placeholder="Last Name*"
              value={form.lastName}
              onChange={onFormChanged}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email*"
              value={form.email}
              onChange={onFormChanged}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password*"
              value={form.password}
              onChange={onFormChanged}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Confirm Password*"
              value={form.confirmPassword}
              onChange={onFormChanged}
            />
          </div>
          <div className="input-group mb-3">
            <select
              className="form-control"
              name="userType"
              value={form.userType}
              onChange={onFormChanged}
            >
              <option value="" hidden>
                Select user type*
              </option>
              {userTypeOptions}
            </select>
          </div>
          <div className="input-group mb-3">
            <select
              className="form-control"
              name="membershipType"
              value={form.membershipType}
              onChange={onFormChanged}
            >
              <option value="" hidden>
                Select membership type*
              </option>
              {membershipOptions}
            </select>
          </div>
          <div className="form-check mb-3">
            <Input
              className="form-check-input"
              type="checkbox"
              id="keep-signed"
            />
            <Label className="form-check-label fs-sm" for="keep-signed">
              <a className="signLink" onClick={onTermsClicked}>
                Agree to accept Terms and Conditions
              </a>
            </Label>
          </div>
          <div className="d-flex justify-content-center mb-3">
            <button
              type="button"
              className="btn btn-solid btn-default-plan btn-post btn-sm"
              onClick={onSignupClicked}
              disabled={loading ? true : false}
            >
              {loading ? "Loading..." : "Sign Up"}
              {loading && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
            </button>
          </div>
          <div>
            Already have an account?{" "}
            <a
              style={{ cursor: "pointer", color: "#208cff" }}
              onClick={() => onAuthModalsTriggered("login")}
            >
              Sign in
            </a>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SignupForm;
