import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import UserTypeModal from "../../components/modals/UserType";
import MembershipModal from "../../components/modals/Membership";
import SigninForm from "../../components/modals/SigninForm";
import SignupForm from "../../components/modals/SignupForm";
import SubscriptionModal from "../../components/modals/Subscription";

const AuthProvider = (props) => {
  
  const [isLoginModal, setIsLoginModal] = useState(false)
  const [isUserTypeModal, setIsUserTypeModal] = useState(false)
  const [isMembershipModal, setIsMembershipModal] = useState(false)
  const [isSubscriptionModal, setIsSubscriptionModal] = useState(false)
  const [isRegisterModal, setIsRegisterModal] = useState(false)

  const [userTypeId, setUserTypeId] = useState("")
  const [membershipTypeId, setMembershipTypeId] = useState("")
  const [msg, setMsg] = useState("")

  const onAuthModalsTriggered = (name, val) => {
    if (name === "login") {
      setIsLoginModal(true)
      if (val)
        setMsg(val)
      setIsRegisterModal(false)
    }
    else if (name === "user_type") {
      setIsUserTypeModal(true)
      setIsLoginModal(false)
    }  
    else if (name === "membership") {
      setUserTypeId(val)
      setIsUserTypeModal(false)
      setIsSubscriptionModal(false)
      setIsMembershipModal(true)
    } else if (name === "subscribe") {
      setMembershipTypeId(val)
      setIsMembershipModal(false)
      setIsSubscriptionModal(true)
    } else if (name === "register") {
      setMembershipTypeId(val)
      setIsMembershipModal(false)
      setIsSubscriptionModal(false)
      setIsRegisterModal(true)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...props,
        onAuthModalsTriggered: onAuthModalsTriggered
      }}
    >
      {props.children}
      <UserTypeModal 
          isShow={isUserTypeModal}
          onClose={()=>setIsUserTypeModal(false)}
        />
      <MembershipModal
        isShow={isMembershipModal}
        onClose={()=>setIsMembershipModal(false)}
        userTypeId={userTypeId}
      />
      <SubscriptionModal
        isShow={isSubscriptionModal}
        onClose={()=>setIsSubscriptionModal(false)}
        userTypeId={userTypeId}
        membershipTypeId={membershipTypeId}
      />
      <SigninForm 
        isShow={isLoginModal}
        msg={msg}
        onClose={()=>setIsLoginModal(false)}
      />
      <SignupForm 
        isShow={isRegisterModal}
        onClose={()=>setIsRegisterModal(false)}
        userTypeId={userTypeId}
        membershipTypeId={membershipTypeId}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
