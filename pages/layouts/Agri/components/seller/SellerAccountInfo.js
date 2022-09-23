import React, {useState, useContext, useEffect, Fragment, useRef} from "react"
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { AuthContext } from '../../../../../helpers/auth/AuthContext';
import getConfig from 'next/config';
import { getFormClient } from '../../../../../services/constants';
import { post } from '../../../../../services/axios';
import AlertModal from '../../../../../components/modals/AlertModal';

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const SellerAccountInfo = () => {
    const authContext = useContext(AuthContext)
    const user = authContext.user

    const [isShowAlertModal, setShowAlertModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")

    const [countrylist, setCountryList] = useState([])
    const [loading, setIsLoading] = useState(false)
    const [passwordloading, setPasswordLoading] = useState(false)

    const [regions, setRegions] = useState([])
    const [cities, setCities] = useState([])

    const inputImageFile = useRef(null);
    const imgImageRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [imageCrop, setImageCrop] = useState();
    const [imageCompletedCrop, setImageCompletedCrop] = useState(null);
    const [imageUrl, setImageUrl] = useState(user.profilepictureISfile ? (contentsUrl+user.profilepictureISfile) : null);
    const [imageBase64, setImageBase64] = useState("")

    const [errors, setErrors] = useState({
        first_name: false,
        last_name: false,
        email: false
    })

    const [form, setForm] = useState({
        firstName: user.first_name ?? "",
        lastName: user.last_name ?? "",
        email: user.email ?? "",
        phoneNumber: user.telephone ?? "",
        address1: user.address_line_1 ?? "",
        address2: user.address_line_2 ?? "",
        areaCode: user.area_code ?? "",
        websiteUrl: user.website_url ?? "",
        countryId: user.countryISbb_agrix_countriesID ?? "",
        regionId: user.regionISbb_agrix_countriesID ?? "",
        cityId: user.cityISbb_agrix_countriesID ?? "",
        company: user.company ?? ""
    })

    const countries = countrylist.filter(country=>country.refers_toISbb_agrix_countriesID === null);
    const countryOptions = countries.map(country => 
        <option key={country._id} value={country.numeric_id}>{country.name}</option>
    )

    const regionOptions = regions.map(region => 
        <option key={region._id} value={region.numeric_id}>{region.name}</option>
    )

    const cityOptions = cities.map(city => 
        <option key={city._id} value={city.numeric_id}>{city.name}</option>
    )

    useEffect(()=>{
        const getCountryList = async () => {
            let formData = getFormClient()
            formData.append("api_method", 'list_countries')
            try {
                const response = await post(apiUrl, formData);
                if (response.data.message === "SUCCESS") {
                    const country_list = response.data.list
                    setCountryList(country_list)
                    if (user.countryISbb_agrix_countriesID) {
                        const regions = country_list.filter(country=>country.refers_toISbb_agrix_countriesID === user.countryISbb_agrix_countriesID)
                        setRegions(regions)
                    }
                    if (user.regionISbb_agrix_countriesID) {
                        const cities = country_list.filter(country=>country.refers_toISbb_agrix_countriesID === user.regionISbb_agrix_countriesID)
                        setCities(cities)
                    }
                } else if (response.data.error) {
                    alert(response.data.message)  
                }
            } catch (err) {
                alert(err.toString())
            }
        }
        
        getCountryList()
    }, [])

    const onSaveClicked = async () => {
        let formData = getFormClient();
        formData.append('api_method', 'update_profile');
        formData.append('user_id', user._id);
        formData.append('session_id', user.session_id);
        formData.append('first_name', form.firstName);
        formData.append('last_name', form.lastName);
        formData.append('email', form.email);
        formData.append('telephone', form.phoneNumber);
        formData.append('company', form.company);
        formData.append('website_url', form.websiteUrl);
        formData.append('address_line_1', form.address1);
        formData.append('address_line_2', form.address2);
        formData.append('area_code', form.areaCode);
        formData.append('countryISbb_agrix_countriesID', form.countryId);
        formData.append('regionISbb_agrix_countriesID', form.regionId);
        formData.append('cityISbb_agrix_countriesID', form.cityId);
        formData.append('profilepictureISfile', imageBase64);

        try {
            setIsLoading(true);
            const response = await post(apiUrl, formData);
            if (response.data.message === "SUCCESS") {
                const userInfo = response.data.data
                console.log(userInfo)
                localStorage.setItem('user', JSON.stringify(userInfo));
                const onAuth = authContext.onAuth;
                onAuth(userInfo, true)

                setModalMsg("User information has been updated successfully.")
                setShowAlertModal(!isShowAlertModal)
            } else if (response.data.error) {
                alert(response.data.message)  
            }
            setIsLoading(false);
        } catch (err) {
            alert(err.toString())
        }
    }

    const onResetPasswordClicked = async () => {
        let formData = getFormClient();
        formData.append('api_method', 'password_reset');
        formData.append('email', form.email);

        try {
            setPasswordLoading(true);
            const response = await post(apiUrl, formData);
            if (response.data.message === "SUCCESS") {
                setModalMsg("An email with password-reset link has been sent to your mail account.")
                setShowAlertModal(!isShowAlertModal)
            } else if (response.data.error) {
                alert(response.data.message)  
            }
            setPasswordLoading(false);
        } catch (err) {
            alert(err.toString())
        }
    }

    const onFormChanged = (e) => {
        setForm({...form, [e.target.name]:e.target.value})
        const locationId = e.target.value
        if (e.target.name === "countryId") {
            const regions = countrylist.filter(country=>country.refers_toISbb_agrix_countriesID === locationId)
            setRegions(regions)
        } else if (e.target.name === "regionId") {
            const cities = countrylist.filter(country=>country.refers_toISbb_agrix_countriesID === locationId)
            setCities(cities)
        } 
    }

    const onBlur = (e) => {
        const name = e.target.name
        const value = e.target.value
        if ( name === 'firstName') 
            if ( value === "" )
                setErrors({...errors, first_name: true})
            else
                setErrors({...errors, first_name: false})
        if ( name === 'lastName') 
            if ( value === "" )
                setErrors({...errors, last_name: true})
            else
                setErrors({...errors, last_name: false})
        if ( name === 'email') 
            if ( value === "" )
                setErrors({...errors, email: true})
            else
                setErrors({...errors, email: false})
    }
    function handleImageImageLoad(event) {
        imgImageRef.current = event?.currentTarget
    
        const { width, height } = event?.currentTarget
        const crop = centerCrop(
            makeAspectCrop({ unit: '%', width: 90 }, 1/1, width, height),
            width,
            height,
        )
        setImageCrop(crop)
    }
    
    function handleSelectImageClick(event) {
        event.preventDefault();
        inputImageFile.current.click();
    }
    
    async function handleImageEditingDone(_event) {
        setEditingImage(false);
        const imageBlob = await getCroppedImg(imgImageRef.current, imageCompletedCrop, 'Image.jpg');
        setImageUrl(URL.createObjectURL(imageBlob))
        const imageBlobToBase64 = await blobToBase64(imageBlob)
        setImageBase64(imageBlobToBase64)
    }
    
    function handleImageEditingCancel(_event) {
        setEditingImage(null);
        setImageUrl(user.profilepictureISfile ? (contentsUrl+user.profilepictureISfile) : null);
        setImageSrc(null);
    }
    
    function handleSelectImage(event) {
        if (event?.target?.files?.length) {
            setImageCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader?.result?.toString() ?? '');
                setEditingImage(true);
                inputImageFile.current.value = null;
            })
            reader.readAsDataURL(event?.target?.files?.[0])
        }
    }
    
    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
    
    function getCroppedImg(image, crop, fileName) {
        // let image = this.imageRef;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = Math.ceil(crop.width * scaleX);
        canvas.height = Math.ceil(crop.height * scaleY);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY,
            // 250,
            // 250
        );
        // As Base64 string
        // const base64Image = canvas.toDataURL('image/jpeg');
        // As a blob
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                blob.name = fileName;
                resolve(blob);
            }, 'image/jpeg', 1);
        });
    }

    return (
        <Fragment>
            <Row>
                <Col md="6">
                    <form className="needs-validation user-add">
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span> First Name
                            </Label>
                            <input
                                className={`form-control col-xl-8 col-md-7 ${errors.first_name ? 'is-invalid' : ''}`}
                                name="firstName"
                                type="text"
                                value={form.firstName}
                                onChange={onFormChanged}
                                onBlur={onBlur} 
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span> Last Name
                            </Label>
                            <input
                                className={`form-control col-xl-8 col-md-7 ${errors.last_name ? 'is-invalid' : ''}`}
                                name="lastName"
                                type="text"
                                value={form.lastName}
                                onChange={onFormChanged}
                                onBlur={onBlur} 
                            />

                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>*</span> Email
                            </Label>
                            <input
                                type="text"
                                name="email"
                                className={`form-control col-xl-8 col-md-7 ${errors.email ? 'is-invalid' : ''}`}
                                value={form.email}
                                onChange={onFormChanged}
                                onBlur={onBlur} 
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Company
                            </Label>
                            <input
                                className="form-control col-xl-8 col-md-7"
                                name="company"
                                type="text"
                                value={form.company}
                                onChange={onFormChanged}
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>WebSite URL
                            </Label>
                            <input
                                className="form-control col-xl-8 col-md-7"
                                name="websiteUrl"
                                type="text"
                                value={form.websiteUrl}
                                onChange={onFormChanged} 
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Phone
                            </Label>
                            <input
                                className="form-control col-xl-8 col-md-7"
                                name="phoneNumber"
                                type="text"
                                value={form.phoneNumber}
                                onChange={onFormChanged}  
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Address 1
                            </Label>
                            <input
                                className="form-control col-xl-8 col-md-7"
                                name="address1"
                                type="text"
                                value={form.address1}
                                onChange={onFormChanged} 
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Address 2
                            </Label>
                            <input
                                className="form-control col-xl-8 col-md-7"
                                name="address2"
                                type="text"
                                value={form.address2}
                                onChange={onFormChanged} 
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Area Code
                            </Label>
                            <input
                                className="form-control col-xl-8 col-md-7"
                                name="areaCode"
                                type="text"
                                value={form.areaCode}
                                onChange={onFormChanged} 
                            />
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Country
                            </Label>
                            <select 
                                className="custom-select col-md-7" 
                                name="countryId" 
                                value={form.countryId}
                                onChange={onFormChanged}
                            >
                                <option value="" hidden>--Select Country--</option>
                                { countryOptions }
                            </select>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>Region
                            </Label>
                            <select 
                                className="custom-select col-md-7" 
                                name="regionId"
                                value={form.regionId}
                                onChange={onFormChanged}
                            >
                                <option value="" hidden>--Select Region--</option>
                                { regionOptions }
                            </select>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label className="col-xl-3 col-md-4">
                                <span>&nbsp;</span>City
                            </Label>
                            <select 
                                className="custom-select col-md-7" 
                                name="cityId"
                                value={form.cityId}
                                onChange={onFormChanged}
                            >
                                <option value="" hidden>--Select City--</option>
                                { cityOptions }
                            </select>
                        </FormGroup>
                        <FormGroup className="row justify-content-center">
                            <button
                                type='button' 
                                className="btn btn-solid btn-default-plan btn-post btn-sm"
                                onClick={onSaveClicked}
                                disabled={loading ? true : false}>
                                {loading ? 'Loading...' : 'Save Changes'}
                                {
                                    loading &&
                                    <span className="spinner-border spinner-border-sm mr-1"></span>
                                }
                            </button>
                        </FormGroup>
                    </form>
                </Col>
                <Col md="6">
                    <Row>
                        <Col 
                            md={{ offset: 1, size: 1 }} 
                            className='d-flex justify-content-center'>
                            <Label>
                                Password
                            </Label>
                        </Col>
                        <Col md="6" className='d-flex justify-content-center'>
                            <button 
                                className="btn btn-solid btn-blue-plan btn-post btn-lg"
                                onClick={onResetPasswordClicked}
                                disabled={passwordloading ? true : false}
                            >
                            {passwordloading ? 'Loading...' : 'Reset Password'}
                            {
                                passwordloading &&
                                <span className="spinner-border spinner-border-sm mr-1"></span>
                            }
                            </button>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col md="3">
                            <Label className="pl-2">Profile Photo</Label>
                        </Col>
                        {
                            (imageSrc || imageUrl) &&
                            <Col md="5">
                            {
                                editingImage ?
                                <ReactCrop
                                    keepSelection
                                    crop={imageCrop}
                                    onChange={crop => setImageCrop(crop)}
                                    onComplete={crop => setImageCompletedCrop(crop)}
                                    aspect={1/1}
                                >
                                    <img
                                        alt="Image"
                                        onLoad={handleImageImageLoad}
                                        src={imageSrc}
                                        style={{ transform: `scale(1) rotate(0deg)` }}
                                    />
                                </ReactCrop> :
                                imageUrl ?
                                    <img className="w-100" src={imageUrl} /> : ""
                            }
                            </Col>
                        }
                        <input
                            style={{ display: "none" }}
                            ref={inputImageFile}
                            onChange={handleSelectImage}
                            type="file"
                        />
                        <Col md="4">
                        {
                            editingImage ?
                            <div style={{ width: "60%" }}>
                                <button type="button" onClick={handleImageEditingDone} className="btn btn-solid btn-default-plan btn-post w-100">
                                    Crop
                                </button>
                                <button type="button" onClick={handleImageEditingCancel} className="btn btn-solid btn-default-plan btn-post w-100 mt-2">
                                    Cancel
                                </button>
                            </div> :
                            <div style={{ width: "100%", marginLeft: 20 }}>
                                <button type="button" onClick={handleSelectImageClick} className="btn btn-solid btn-default-plan btn-post">
                                    {
                                        (imageSrc || imageUrl) ? "Edit Image" : "Select Image"
                                    }
                                </button>
                            </div> 
                        }
                        </Col>
                    </Row>
                </Col>
            </Row>
            <AlertModal 
                isShow={isShowAlertModal}
                onToggle={(isShowAlertModal)=>setShowAlertModal(!isShowAlertModal)}
                message={modalMsg}
            />
        </Fragment>
    )
}

export default SellerAccountInfo