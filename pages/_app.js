import React, { useEffect, useState } from "react";
import "../public/assets/scss/app.scss";
import { ToastContainer } from "react-toastify";
import TapTop from "../components/common/widgets/Tap-Top";
import CartContextProvider from "../helpers/cart/CartContext";
import { WishlistContextProvider } from "../helpers/wishlist/WishlistContext";
import FilterProvider from "../helpers/filter/FilterProvider";
import SettingProvider from "../helpers/theme-setting/SettingProvider";
import AuthProvider from "../helpers/auth/AuthProvider";
import { CompareContextProvider } from "../helpers/Compare/CompareContext";
import { CurrencyContextProvider } from "../helpers/Currency/CurrencyContext";
import Helmet from "react-helmet";
import { getFormClient } from "../services/constants";
import { post } from "../services/axios";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

export default function MyApp({ Component, pageProps }) {

  const [isLoading, setIsLoading] = useState(true);
  const [appSettingData, setAppSettingData] = useState({})

  const [authInfo, setAuthInfo] = useState({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [targetPath, setTargetPath] = useState("/dashboard")

  const onAuth = (info, isAuth) => {
    setAuthInfo(info)
    setIsAuthenticated(isAuth)
  }

  const onTarget = (val) => {
    setTargetPath(val)
  }

  useEffect(() => {
    const getAppSettingData = async() => {
      let formData = getFormClient();
      formData.append('api_method', 'app_settings');
      formData.append('app_version', '1');
      formData.append('device_info', '1');

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setAppSettingData(response.data)
        } else if (response.data.error) {
          alert(response.data.message)  
        }
        setIsLoading(false);
      } catch (err) {
        alert(err.toString())
      }
    }

    const setAuthUserInfo = () => {
      let isAuthStorage = localStorage.getItem("isAuthenticated")
      if (isAuthStorage === "done") {
        let userStorage = localStorage.getItem("user")
        onAuth(JSON.parse(userStorage), true)
      }
    }

    getAppSettingData();
    setAuthUserInfo();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loader-wrapper">
            <div className="loader"></div>
        </div>
      ) : (
        <>
          <Helmet>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>Biggest Online Agricultural Marketplace - E-Market Platforms for Farmers</title>
          </Helmet>
          <div>
            <SettingProvider appData={appSettingData}>
              {/* <CompareContextProvider>
                <CurrencyContextProvider>
                  <CartContextProvider>
                    <WishlistContextProvider>
                      <FilterProvider> */}
                        <AuthProvider 
                          user={authInfo} 
                          isAuthenticated={isAuthenticated} 
                          onAuth={onAuth}
                          onTarget={onTarget}
                          targetPath={targetPath}
                        >
                          <Component {...pageProps}/>
                        </AuthProvider>  
                      {/* </FilterProvider>
                    </WishlistContextProvider>
                  </CartContextProvider>
                </CurrencyContextProvider>
              </CompareContextProvider> */}
            </SettingProvider>
            <ToastContainer />
            <TapTop />
          </div>
        </>
      )}
    </>
  );
}
